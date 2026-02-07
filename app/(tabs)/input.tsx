import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { useFoodSearch, useFoodCategories, useCreateFoodLog, useCreateFood } from '@/services/hooks/use-foods';
import { Food, FoodLogItemInput, CreateFoodRequest } from '@/types';
import { ApiError } from '@/services/api/errors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState, useMemo, useCallback } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, FlatList, Modal, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { SystemFoodCard } from '@/components/SystemFoodCard';
import { ListItemSkeleton } from '@/components/Skeleton';

// Helper function to format date in Indonesian
const formatDateIndonesian = (date: Date): string => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
};

// Convert meal names to API format
const mealNameToApiFormat = (mealName: string): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
    const mapping: Record<string, 'breakfast' | 'lunch' | 'dinner' | 'snack'> = {
        'Pagi': 'breakfast',
        'Siang': 'lunch',
        'Malam': 'dinner',
        'Camilan': 'snack',
    };
    return mapping[mealName] || 'breakfast';
};

// Get icon for food category
const getCategoryIcon = (category: string): string => {
    const categoryIcons: Record<string, string> = {
        'Beras dan Hasil Olahan': 'rice-bowl',
        'Daging': 'local-dining',
        'Ikan': 'restaurant',
        'Telur': 'egg',
        'Sayuran': 'eco',
        'Buah-buahan': 'apple',
        'Produk Olahan Susu': 'local-cafe',
        'Minyak dan Lemak': 'opacity',
        'Gula dan Sirup': 'sweetness',
        'Kacang-kacangan': 'grain',
    };
    return categoryIcons[category] || 'restaurant';
};

// Get color for food category
const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
        'Beras dan Hasil Olahan': '#EA580C',
        'Daging': '#D4004A',
        'Ikan': '#0066CC',
        'Telur': '#CA8A04',
        'Sayuran': '#22C55E',
        'Buah-buahan': '#EC4899',
        'Produk Olahan Susu': '#8B5CF6',
        'Minyak dan Lemak': '#F59E0B',
        'Gula dan Sirup': '#06B6D4',
        'Kacang-kacangan': '#84CC16',
    };
    return categoryColors[category] || '#6B7280';
};

// Type for selected food item with quantity
interface SelectedFoodItem {
    food: Food;
    quantity: number;
}

export default function InputScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { data: activeChild } = useActiveChild();
    const childId = activeChild?.id || 0;

    // State - Date and meal selection
    const [selectedMeal, setSelectedMeal] = useState('Pagi');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // State - Search and food selection
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<SelectedFoodItem[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [notes, setNotes] = useState('');

    // State - Custom food modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newFoodForm, setNewFoodForm] = useState({
        name: '',
        category: '',
        calories: '',
        protein: '',
        fat: '',
        carbohydrate: ''
    });

    // Hooks
    const { data: searchResults, isLoading: isSearching } = useFoodSearch(searchQuery, selectedCategory || undefined);
    const { data: categories, isLoading: categoriesLoading } = useFoodCategories();
    const { mutate: createLog, isPending: isCreating } = useCreateFoodLog(childId);
    const { mutate: createFood, isPending: isCreatingFood } = useCreateFood();

    // Handle date change
    const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
        }
    };

    // Handle adding food from search results
    const handleAddFood = useCallback((food: Food) => {
        const existingItem = selectedItems.find(item => item.food.id === food.id);
        
        if (existingItem) {
            // Food already selected, just increase quantity
            setSelectedItems(selectedItems.map(item =>
                item.food.id === food.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            // New food, add to selection
            setSelectedItems([...selectedItems, { food, quantity: 1 }]);
        }
        
        // Clear search
        setSearchQuery('');
        setShowSearchResults(false);
    }, [selectedItems]);

    // Handle quantity change
    const handleQuantityChange = useCallback((foodId: number, delta: number) => {
        setSelectedItems(selectedItems.map(item => {
            if (item.food.id === foodId) {
                const newQuantity = item.quantity + delta;
                if (newQuantity <= 0) {
                    return null as any;
                }
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(Boolean));
    }, [selectedItems]);

    // Calculate total nutrition
    const totalNutrition = useMemo(() => {
        return selectedItems.reduce((acc, item) => ({
            calories: acc.calories + (item.food.nutrition.calories * item.quantity),
            protein: acc.protein + (item.food.nutrition.protein * item.quantity),
            fat: acc.fat + (item.food.nutrition.fat * item.quantity),
            carbohydrate: acc.carbohydrate + (item.food.nutrition.carbohydrate * item.quantity),
        }), { calories: 0, protein: 0, fat: 0, carbohydrate: 0 });
    }, [selectedItems]);

    // Validate custom food form
    const isFormValid = useMemo(() => {
        return newFoodForm.name.trim().length > 0 && newFoodForm.category.length > 0;
    }, [newFoodForm.name, newFoodForm.category]);

    // Reset custom food form
    const resetForm = useCallback(() => {
        setNewFoodForm({ name: '', category: '', calories: '', protein: '', fat: '', carbohydrate: '' });
    }, []);

    // Handle creating custom food
    const handleCreateFood = useCallback(() => {
        if (!isFormValid) return;

        const foodPayload: CreateFoodRequest = {
            name: newFoodForm.name.trim(),
            category: newFoodForm.category,
            serving_size: 100,
            calories: Number(newFoodForm.calories) || 0,
            protein: Number(newFoodForm.protein) || 0,
            fat: Number(newFoodForm.fat) || 0,
            carbohydrate: Number(newFoodForm.carbohydrate) || 0,
        };

        createFood(foodPayload, {
            onSuccess: (createdFood) => {
                handleAddFood(createdFood);
                setShowCreateModal(false);
                resetForm();
                Alert.alert('Sukses', 'Makanan baru berhasil ditambahkan');
            },
            onError: (error) => {
                const msg = error instanceof ApiError ? error.message : 'Gagal membuat makanan baru';
                Alert.alert('Error', msg);
            }
        });
    }, [newFoodForm, isFormValid, createFood, handleAddFood, resetForm]);

    // Handle submit food log
    const handleSubmitFoodLog = useCallback(() => {
        // Validation with Indonesian error messages
        if (selectedItems.length === 0) {
            Alert.alert(
                'Makanan Belum Dipilih',
                'Silakan pilih minimal satu makanan untuk dicatat.',
                [{ text: 'Mengerti', style: 'default' }]
            );
            return;
        }

        if (childId <= 0) {
            Alert.alert(
                'Anak Belum Dipilih',
                'Silakan pilih anak terlebih dahulu di halaman profil.',
                [{ text: 'Mengerti', style: 'default' }]
            );
            return;
        }

        // Validate date is not in the future
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (selectedDate > today) {
            Alert.alert(
                'Tanggal Tidak Valid',
                'Tanggal tidak boleh lebih dari hari ini.',
                [{ text: 'Mengerti', style: 'default' }]
            );
            return;
        }

        const items: FoodLogItemInput[] = selectedItems.map(item => ({
            food_id: item.food.id,
            quantity: item.quantity,
            serving_size: item.food.serving_size,
        }));

        const dateString = selectedDate.toISOString().split('T')[0];

        createLog({
            log_date: dateString,
            meal_time: mealNameToApiFormat(selectedMeal),
            notes: notes.trim() || undefined,
            items,
        }, {
            onSuccess: () => {
                // Success confirmation with navigation options
                Alert.alert(
                    'Berhasil Disimpan!',
                    `${selectedItems.length} makanan untuk ${selectedMeal.toLowerCase()} berhasil dicatat.\n\nTotal: ${totalNutrition.calories.toFixed(0)} kkal`,
                    [
                        {
                            text: 'Lihat Riwayat',
                            onPress: () => router.push('/food-logs/index' as never),
                        },
                        {
                            text: 'Catat Lagi',
                            style: 'default',
                        },
                    ]
                );
                // Reset form
                setSelectedItems([]);
                setSearchQuery('');
                setShowSearchResults(false);
                setNotes('');
                setSelectedCategory(null);
            },
            onError: (error) => {
                // Detailed Indonesian error messages based on error type
                let title = 'Gagal Menyimpan';
                let message = 'Terjadi kesalahan saat menyimpan data makanan.';
                
                if (error instanceof ApiError) {
                    if (error.status === 422) {
                        title = 'Data Tidak Valid';
                        message = error.message || 'Silakan periksa kembali data yang dimasukkan.';
                    } else if (error.status === 401) {
                        title = 'Sesi Berakhir';
                        message = 'Silakan login kembali untuk melanjutkan.';
                    } else if (error.status === 403) {
                        title = 'Akses Ditolak';
                        message = 'Anda tidak memiliki izin untuk mencatat makanan anak ini.';
                    } else if (error.status === 500) {
                        title = 'Kesalahan Server';
                        message = 'Terjadi masalah pada server. Silakan coba lagi nanti.';
                    } else {
                        message = error.message;
                    }
                }
                
                Alert.alert(title, message, [{ text: 'Mengerti', style: 'default' }]);
            }
        });
    }, [selectedItems, childId, selectedMeal, selectedDate, notes, totalNutrition, createLog, router]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {/* Header */}
                <View style={{ backgroundColor: colors.surface }} className="flex-none pt-4 pb-2 px-6 z-20">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text style={{ color: colors.onSurface }} className="tracking-tight text-[28px] font-bold leading-tight">Catat Makanan</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/food-logs')}
                            className="w-11 h-11 items-center justify-center rounded-full"
                            style={{ backgroundColor: colors.surfaceContainerHigh }}
                            accessibilityLabel="Lihat riwayat makanan"
                        >
                            <MaterialIcons name="history" size={24} color={colors.onSurfaceVariant} />
                        </TouchableOpacity>
                    </View>

                    {/* Date Display Bar - Tappable */}
                    <Pressable
                        onPress={() => setShowDatePicker(true)}
                        style={{
                            backgroundColor: colors.surfaceContainerHigh,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 12,
                            height: 48,
                            paddingHorizontal: 16,
                            marginBottom: 8
                        }}
                    >
                        <MaterialIcons name="event" size={20} color={colors.onSurfaceVariant} style={{ position: 'absolute', left: 16 }} />
                        <Text style={{ color: colors.onSurface, fontSize: 14, fontWeight: '500' }}>
                            {formatDateIndonesian(selectedDate)}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color={colors.onSurfaceVariant} style={{ position: 'absolute', right: 12 }} />
                    </Pressable>

                    {/* Date Picker Modal */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onDateChange}
                        />
                    )}
                </View>

                {/* Content */}
                <View className="flex-1 px-6 pt-2 pb-32">
                    {/* Meal Time Selector - Pill Style */}
                    <View style={{ backgroundColor: colors.surfaceContainerHigh, flexDirection: 'row', padding: 6, borderRadius: 9999, marginBottom: 16 }}>
                        {['Pagi', 'Siang', 'Malam', 'Camilan'].map((meal) => (
                            <Pressable
                                key={meal}
                                onPress={() => setSelectedMeal(meal)}
                                style={{
                                    flex: 1,
                                    backgroundColor: selectedMeal === meal ? colors.primary : 'transparent',
                                    paddingVertical: 8,
                                    borderRadius: 9999,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: selectedMeal === meal ? colors.onPrimary : colors.onSurfaceVariant,
                                        fontSize: 13,
                                        fontWeight: '500',
                                    }}
                                >
                                    {meal}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Search Bar */}
                    <View className="relative mb-4 mt-2">
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row w-full items-center rounded-2xl h-14 shadow-sm overflow-hidden">
                            <View className="pl-4 pr-2">
                                <MaterialIcons name="search" size={24} color={colors.onSurfaceVariant} />
                            </View>
                            <TextInput
                                style={{ color: colors.onSurface }}
                                className="flex-1 bg-transparent text-base font-medium h-full"
                                placeholder="Cari makanan..."
                                placeholderTextColor={colors.onSurfaceVariant}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onFocus={() => setShowSearchResults(true)}
                            />
                            {(searchQuery.length > 0 || selectedCategory) && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSearchQuery('');
                                        setSelectedCategory(null);
                                        setShowSearchResults(false);
                                    }}
                                    className="pr-4"
                                >
                                    <MaterialIcons name="close" size={20} color={colors.onSurfaceVariant} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Category Filter Pills */}
                        {categoriesLoading ? (
                            <View className="mt-3 gap-3">
                                <ListItemSkeleton />
                                <ListItemSkeleton />
                                <ListItemSkeleton />
                            </View>
                        ) : categories && (
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false} 
                                className="mt-3"
                                contentContainerStyle={{ gap: 8 }}
                            >
                                {/* "Semua" option */}
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedCategory(null);
                                        if (searchQuery.length >= 2 || selectedCategory) {
                                            setShowSearchResults(true);
                                        }
                                    }}
                                    style={{
                                        backgroundColor: selectedCategory === null ? colors.primary : colors.surfaceContainerHigh,
                                        paddingHorizontal: 14,
                                        paddingVertical: 8,
                                        borderRadius: 20,
                                    }}
                                >
                                    <Text style={{
                                        color: selectedCategory === null ? colors.onPrimary : colors.onSurface,
                                        fontSize: 12,
                                        fontWeight: '500',
                                    }}>
                                        Semua
                                    </Text>
                                </TouchableOpacity>
                                {(categories as string[]).map((cat: string) => (
                                    <TouchableOpacity
                                        key={cat}
                                        onPress={() => {
                                            setSelectedCategory(cat);
                                            setShowSearchResults(true);
                                        }}
                                        style={{
                                            backgroundColor: selectedCategory === cat ? colors.primary : colors.surfaceContainerHigh,
                                            paddingHorizontal: 14,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 4,
                                        }}
                                    >
                                        <View 
                                            style={{ 
                                                backgroundColor: selectedCategory === cat ? colors.onPrimary + '30' : getCategoryColor(cat) + '20',
                                                width: 20,
                                                height: 20,
                                                borderRadius: 10,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <MaterialIcons 
                                                name={getCategoryIcon(cat) as any} 
                                                size={12} 
                                                color={selectedCategory === cat ? colors.onPrimary : getCategoryColor(cat)} 
                                            />
                                        </View>
                                        <Text style={{
                                            color: selectedCategory === cat ? colors.onPrimary : colors.onSurface,
                                            fontSize: 12,
                                            fontWeight: '500',
                                        }}>
                                            {cat.length > 15 ? cat.substring(0, 15) + '...' : cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}

                        {/* Search Results Dropdown */}
                        {showSearchResults && (searchQuery.length >= 2 || selectedCategory) && (
                            <View style={{ backgroundColor: colors.surface, borderRadius: 12, marginTop: 8, maxHeight: 300, borderWidth: 1, borderColor: colors.outline }} className="shadow-lg">
                                {isSearching && (
                                    <View className="p-4 items-center">
                                        <ActivityIndicator size="small" color={colors.primary} />
                                    </View>
                                )}

                                {!isSearching && searchResults?.data && searchResults.data.length > 0 && (
                                    <ScrollView
                                        nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={true}
                                        contentContainerStyle={{ padding: 8 }}
                                    >
                                        {searchResults.data.map((item) => (
                                            <SystemFoodCard
                                                key={item.id}
                                                food={item}
                                                onSelect={handleAddFood}
                                                showExpandedDetails={false}
                                            />
                                        ))}
                                    </ScrollView>
                                )}

                                {/* No results - Show "Tambah Makanan Baru" button */}
                                {!isSearching && searchResults?.data?.length === 0 && (
                                    <View className="mb-4 p-4 items-center">
                                        <Text style={{ color: colors.onSurfaceVariant }} className="mb-3 text-sm">
                                            Tidak ada makanan ditemukan
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => setShowCreateModal(true)}
                                            style={{ backgroundColor: colors.primary }}
                                            className="flex-row items-center gap-2 px-5 py-3 rounded-full"
                                        >
                                            <MaterialIcons name="add" size={20} color={colors.onPrimary} />
                                            <Text style={{ color: colors.onPrimary }} className="font-semibold text-sm">
                                                Tambah Makanan Baru
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Notes Input */}
                    <View className="mb-6">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-bold uppercase tracking-wider pl-1 mb-2">Catatan (Opsional)</Text>
                        <TextInput
                            style={{
                                backgroundColor: colors.surfaceContainerHigh,
                                color: colors.onSurface,
                                borderRadius: 12,
                                paddingHorizontal: 14,
                                paddingVertical: 12,
                                minHeight: 60,
                                textAlignVertical: 'top',
                            }}
                            placeholder="Tambahkan catatan tentang makanan..."
                            placeholderTextColor={colors.onSurfaceVariant}
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={2}
                        />
                    </View>

                    {/* Selected Food List */}
                    {selectedItems.length > 0 && (
                        <View className="gap-4 mb-6">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-bold uppercase tracking-wider pl-1">Makanan Terpilih</Text>

                            {selectedItems.map((item) => (
                                <View key={item.food.id} style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center justify-between p-3 pr-4 rounded-2xl shadow-sm">
                                    <View className="flex-row items-center gap-3 flex-1">
                                        <View style={{ backgroundColor: getCategoryColor(item.food.category) + '30' }} className="w-12 h-12 rounded-xl items-center justify-center">
                                            <MaterialIcons name={getCategoryIcon(item.food.category) as any} size={24} color={getCategoryColor(item.food.category)} />
                                        </View>
                                        <View className="flex-1">
                                            <Text style={{ color: colors.onSurface }} className="font-bold text-base">{item.food.name}</Text>
                                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">
                                                {item.food.serving_size} gram • {(item.food.nutrition.calories * item.quantity).toFixed(0)} kkal
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ backgroundColor: colors.surfaceContainerLowest }} className="flex-row items-center rounded-full p-1 h-9">
                                        <TouchableOpacity
                                            onPress={() => handleQuantityChange(item.food.id, -1)}
                                            style={{ backgroundColor: colors.surfaceContainerHigh }} className="w-7 h-7 items-center justify-center rounded-full shadow-sm active:scale-95"
                                        >
                                            <MaterialIcons name="remove" size={16} color={colors.onSurface} />
                                        </TouchableOpacity>
                                        <Text style={{ color: colors.onSurface }} className="w-8 text-center text-sm font-bold">{item.quantity}</Text>
                                        <TouchableOpacity
                                            onPress={() => handleQuantityChange(item.food.id, 1)}
                                            style={{ backgroundColor: colors.primary }} className="w-7 h-7 items-center justify-center rounded-full shadow-sm active:scale-95"
                                        >
                                            <MaterialIcons name="add" size={16} color={colors.onPrimary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Nutrition Summary Card */}
                    {selectedItems.length > 0 && (
                        <View style={{ backgroundColor: colors.secondaryContainer }} className="p-4 rounded-3xl relative overflow-hidden shadow-sm mb-6">
                            <Text style={{ color: colors.onSecondaryContainer }} className="text-sm font-bold mb-3">Ringkasan Nutrisi</Text>

                            {/* Nutrition Grid */}
                            <View className="flex-row flex-wrap gap-2">
                                <View className="flex-1 min-w-[40%] items-center p-2" style={{ backgroundColor: colors.surface + '30', borderRadius: 12 }}>
                                    <Text style={{ color: colors.onSecondaryContainer }} className="text-xs font-medium">Energi</Text>
                                    <Text style={{ color: colors.onSecondaryContainer }} className="text-lg font-bold">{totalNutrition.calories.toFixed(0)}</Text>
                                    <Text style={{ color: colors.onSecondaryContainer }} className="text-[10px]">kkal</Text>
                                </View>

                                <View className="flex-1 min-w-[40%] items-center p-2" style={{ backgroundColor: colors.surface + '30', borderRadius: 12 }}>
                                    <Text style={{ color: colors.onSecondaryContainer }} className="text-xs font-medium">Protein</Text>
                                    <Text style={{ color: colors.onSecondaryContainer }} className="text-lg font-bold">{totalNutrition.protein.toFixed(1)}</Text>
                                    <Text style={{ color: colors.onSecondaryContainer }} className="text-[10px]">gr</Text>
                                </View>

                                <View className="flex-1 min-w-[40%] items-center p-2" style={{ backgroundColor: colors.surface + '30', borderRadius: 12 }}>
                                    <Text style={{ color: colors.onSecondaryContainer }} className="text-xs font-medium">Lemak</Text>
                                    <Text style={{ color: colors.onSecondaryContainer }} className="text-lg font-bold">{totalNutrition.fat.toFixed(1)}</Text>
                                    <Text style={{ color: colors.onSecondaryContainer }} className="text-[10px]">gr</Text>
                                </View>

                                <View className="flex-1 min-w-[40%] items-center p-2" style={{ backgroundColor: colors.surface + '30', borderRadius: 12 }}>
                                    <Text style={{ color: colors.onSecondaryContainer }} className="text-xs font-medium">Karbo</Text>
                                    <Text style={{ color: colors.onSecondaryContainer }} className="text-lg font-bold">{totalNutrition.carbohydrate.toFixed(1)}</Text>
                                    <Text style={{ color: colors.onSecondaryContainer }} className="text-[10px]">gr</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSubmitFoodLog}
                        disabled={isCreating || selectedItems.length === 0}
                        style={{ backgroundColor: isCreating || selectedItems.length === 0 ? colors.outline : colors.primary }}
                        className="w-full flex-row items-center justify-center gap-2 active:scale-[0.98] rounded-full py-4 shadow-lg"
                    >
                        {isCreating ? (
                            <ActivityIndicator size="small" color={colors.onPrimary} />
                        ) : (
                            <>
                                <MaterialIcons name="check-circle" size={24} color={colors.onPrimary} />
                                <Text style={{ color: colors.onPrimary }} className="font-bold text-lg">Simpan Asupan</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Custom Food Modal */}
            <Modal
                visible={showCreateModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCreateModal(false)}
            >
                <Pressable
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onPress={() => setShowCreateModal(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1, justifyContent: 'flex-end' }}
                    >
                        <Pressable onPress={(e) => e.stopPropagation()}>
                            <View style={{ backgroundColor: colors.surface }} className="rounded-t-3xl px-6 pt-6 pb-10">
                                {/* Header */}
                                <View className="flex-row justify-between items-center mb-6">
                                    <Text style={{ color: colors.onSurface }} className="text-xl font-bold">
                                        Tambah Makanan Baru
                                    </Text>
                                    <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                                        <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
                                    </TouchableOpacity>
                                </View>

                                {/* Form in ScrollView */}
                                <ScrollView showsVerticalScrollIndicator={false} className="max-h-96">
                                    {/* Name input */}
                                    <View className="mb-4">
                                        <Text style={{ color: colors.onSurface }} className="text-sm font-semibold mb-2">
                                            Nama Makanan *
                                        </Text>
                                        <TextInput
                                            style={{
                                                backgroundColor: colors.surfaceContainerHigh,
                                                color: colors.onSurface,
                                                borderRadius: 12,
                                                paddingHorizontal: 12,
                                                paddingVertical: 10,
                                            }}
                                            placeholder="Contoh: Nasi Putih"
                                            placeholderTextColor={colors.onSurfaceVariant}
                                            value={newFoodForm.name}
                                            onChangeText={(text) => setNewFoodForm({ ...newFoodForm, name: text })}
                                        />
                                    </View>

                                    {/* Category pills (horizontal scroll) */}
                                    <View className="mb-4">
                                        <Text style={{ color: colors.onSurface }} className="text-sm font-semibold mb-2">
                                            Kategori *
                                        </Text>
                                        {!categoriesLoading && categories ? (
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                                                {(categories as string[]).map((cat: string) => (
                                                    <TouchableOpacity
                                                        key={cat}
                                                        onPress={() => setNewFoodForm({ ...newFoodForm, category: cat })}
                                                        style={{
                                                            backgroundColor: newFoodForm.category === cat ? colors.primary : colors.surfaceContainerHigh,
                                                            paddingHorizontal: 12,
                                                            paddingVertical: 8,
                                                            borderRadius: 20,
                                                        }}
                                                        className="mr-2"
                                                    >
                                                        <Text style={{
                                                            color: newFoodForm.category === cat ? colors.onPrimary : colors.onSurface,
                                                            fontSize: 12,
                                                            fontWeight: '500',
                                                        }}>
                                                            {cat}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        ) : (
                                            <ActivityIndicator size="small" color={colors.primary} />
                                        )}
                                    </View>

                                    {/* Nutrition grid (2x2) */}
                                    <View className="mb-6">
                                        <Text style={{ color: colors.onSurface }} className="text-sm font-semibold mb-2">
                                            Informasi Nutrisi (per 100g)
                                        </Text>
                                        <View className="flex-row gap-2 mb-2">
                                            {/* Calories */}
                                            <View className="flex-1">
                                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mb-1">
                                                    Kalori (kkal)
                                                </Text>
                                                <TextInput
                                                    style={{
                                                        backgroundColor: colors.surfaceContainerHigh,
                                                        color: colors.onSurface,
                                                        borderRadius: 8,
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 8,
                                                        fontSize: 12,
                                                    }}
                                                    placeholder="0"
                                                    placeholderTextColor={colors.onSurfaceVariant}
                                                    keyboardType="number-pad"
                                                    value={newFoodForm.calories}
                                                    onChangeText={(text) => setNewFoodForm({ ...newFoodForm, calories: text })}
                                                />
                                            </View>

                                            {/* Protein */}
                                            <View className="flex-1">
                                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mb-1">
                                                    Protein (gr)
                                                </Text>
                                                <TextInput
                                                    style={{
                                                        backgroundColor: colors.surfaceContainerHigh,
                                                        color: colors.onSurface,
                                                        borderRadius: 8,
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 8,
                                                        fontSize: 12,
                                                    }}
                                                    placeholder="0"
                                                    placeholderTextColor={colors.onSurfaceVariant}
                                                    keyboardType="number-pad"
                                                    value={newFoodForm.protein}
                                                    onChangeText={(text) => setNewFoodForm({ ...newFoodForm, protein: text })}
                                                />
                                            </View>
                                        </View>

                                        <View className="flex-row gap-2">
                                            {/* Fat */}
                                            <View className="flex-1">
                                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mb-1">
                                                    Lemak (gr)
                                                </Text>
                                                <TextInput
                                                    style={{
                                                        backgroundColor: colors.surfaceContainerHigh,
                                                        color: colors.onSurface,
                                                        borderRadius: 8,
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 8,
                                                        fontSize: 12,
                                                    }}
                                                    placeholder="0"
                                                    placeholderTextColor={colors.onSurfaceVariant}
                                                    keyboardType="number-pad"
                                                    value={newFoodForm.fat}
                                                    onChangeText={(text) => setNewFoodForm({ ...newFoodForm, fat: text })}
                                                />
                                            </View>

                                            {/* Carbohydrate */}
                                            <View className="flex-1">
                                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mb-1">
                                                    Karbo (gr)
                                                </Text>
                                                <TextInput
                                                    style={{
                                                        backgroundColor: colors.surfaceContainerHigh,
                                                        color: colors.onSurface,
                                                        borderRadius: 8,
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 8,
                                                        fontSize: 12,
                                                    }}
                                                    placeholder="0"
                                                    placeholderTextColor={colors.onSurfaceVariant}
                                                    keyboardType="number-pad"
                                                    value={newFoodForm.carbohydrate}
                                                    onChangeText={(text) => setNewFoodForm({ ...newFoodForm, carbohydrate: text })}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>

                                {/* Submit button */}
                                <TouchableOpacity
                                    onPress={handleCreateFood}
                                    disabled={!isFormValid || isCreatingFood}
                                    style={{
                                        backgroundColor: !isFormValid || isCreatingFood ? colors.outline : colors.primary,
                                    }}
                                    className="w-full flex-row items-center justify-center gap-2 rounded-full py-4 mt-4"
                                >
                                    {isCreatingFood ? (
                                        <ActivityIndicator size="small" color={colors.onPrimary} />
                                    ) : (
                                        <>
                                            <MaterialIcons name="check" size={20} color={colors.onPrimary} />
                                            <Text style={{ color: colors.onPrimary }} className="font-bold">
                                                Buat Makanan
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    </KeyboardAvoidingView>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}
