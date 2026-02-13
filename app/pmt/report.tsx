import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { 
    useCurrentMonthPmtSchedules, 
    useTodayPmtSchedule,
    useCreatePmtLog, 
    useUpdatePmtLog 
} from '@/services/hooks/use-pmt';
import { useFoodSearch, useFoodCategories } from '@/services/hooks/use-foods';
import { ApiError } from '@/services/api/errors';
import { PmtPortion, PMT_PORTION_LABEL, Food } from '@/types';
import { ImagePickerButton } from '@/components/ImagePickerButton';
import { SystemFoodCard } from '@/components/SystemFoodCard';
import { getCategoryIcon, getCategoryColor } from '@/utils/food-category-helpers';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Semantic colors for portion options
const PORTION_COLORS: Record<PmtPortion, string> = {
    habis: '#34D399',      // Green (success)
    half: '#FBBF24',       // Yellow (warning)
    quarter: '#F97316',    // Orange
    none: '#EF4444',       // Red (error)
};

const PORTION_ICONS: Record<PmtPortion, keyof typeof MaterialIcons.glyphMap> = {
    habis: 'check-circle',
    half: 'pie-chart',
    quarter: 'timelapse',
    none: 'cancel',
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function PMTReportScreen() {
    const { colors } = useTheme();
    const { scheduleId } = useLocalSearchParams<{ scheduleId?: string }>();
    
    const { data: child, isLoading: isLoadingChild } = useActiveChild();
    const childId = child?.id ?? 0;
    
    // Get all schedules to find the specific one
    const { data: schedules, isLoading: isLoadingSchedules } = useCurrentMonthPmtSchedules(childId);
    const { data: todaySchedule } = useTodayPmtSchedule(childId);
    
    const { mutate: createLog, isPending: isCreating } = useCreatePmtLog();
    const { mutate: updateLog, isPending: isUpdating } = useUpdatePmtLog();
    
    // Find the schedule - either by ID or use today's schedule
    const schedule = scheduleId 
        ? schedules?.find(s => s.id === Number(scheduleId))
        : todaySchedule;
    
    const [selectedPortion, setSelectedPortion] = useState<PmtPortion | null>(null);
    const [notes, setNotes] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [foodSearchQuery, setFoodSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showFoodResults, setShowFoodResults] = useState(false);
    
    const { data: searchResults, isLoading: isSearching } = useFoodSearch(foodSearchQuery, selectedCategory || undefined);
    const { data: categories } = useFoodCategories();
    
    // Initialize form with existing log data
    useEffect(() => {
        if (schedule?.log) {
            setSelectedPortion(schedule.log.portion);
            setNotes(schedule.log.notes || '');
            setPhotoUrl(schedule.log.photo_url || '');
            if (schedule.log.food) {
                setSelectedFood({
                    id: schedule.log.food.id,
                    name: schedule.log.food.name,
                    category: schedule.log.food.category,
                    icon: schedule.log.food.icon,
                    serving_size: schedule.log.food.serving_size,
                    nutrition: {
                        calories: schedule.log.food.calories,
                        protein: schedule.log.food.protein,
                        fat: 0,
                        carbohydrate: 0,
                    },
                    is_system: true,
                    is_active: true,
                } as Food);
            }
        }
    }, [schedule]);
    
    const isLoading = isLoadingChild || isLoadingSchedules;
    const isPending = isCreating || isUpdating;

    const handleSubmit = () => {
        if (!selectedPortion || !schedule) return;

        const data = {
            portion: selectedPortion,
            food_id: selectedFood?.id,
            photo: photoUrl || undefined,
            notes: notes || undefined,
        };

        const onSuccess = () => {
            Alert.alert(
                'Berhasil',
                schedule.is_logged ? 'Log PMT berhasil diperbarui' : 'Konsumsi PMT berhasil dicatat',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        };

        const onError = (error: Error) => {
            if (error instanceof ApiError) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Error', 'Gagal menyimpan. Silakan coba lagi.');
            }
        };

        if (schedule.is_logged) {
            updateLog({ scheduleId: schedule.id, data }, { onSuccess, onError });
        } else {
            createLog({ scheduleId: schedule.id, data }, { onSuccess, onError });
        }
    };

    const PortionOption = ({
        value,
        label,
        isSelected
    }: {
        value: PmtPortion;
        label: string;
        isSelected: boolean;
    }) => {
        const portionColor = PORTION_COLORS[value];
        const icon = PORTION_ICONS[value];

        return (
            <TouchableOpacity
                onPress={() => setSelectedPortion(value)}
                style={{
                    backgroundColor: isSelected ? colors.primaryContainer : colors.surfaceContainerHigh,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected ? portionColor : 'transparent',
                }}
                className="flex-1 items-center justify-center p-4 rounded-xl"
            >
                <View
                    style={{
                        backgroundColor: portionColor,
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8,
                    }}
                >
                    <MaterialIcons
                        name={icon}
                        size={20}
                        color="#FFFFFF"
                    />
                </View>
                <Text style={{ color: isSelected ? colors.onPrimaryContainer : colors.onSurface }} className="text-sm font-bold text-center">{label}</Text>
            </TouchableOpacity>
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ color: colors.onSurfaceVariant }} className="mt-4 text-sm">
                        Memuat data...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // No schedule found
    if (!schedule) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                
                {/* Header */}
                <View style={{ backgroundColor: colors.surface }} className="flex-row items-center p-4 pb-2 justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ backgroundColor: colors.surfaceContainerHigh }}
                        className="w-10 h-10 items-center justify-center rounded-full"
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
                    </TouchableOpacity>
                    <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
                        Lapor PMT
                    </Text>
                </View>
                
                <View className="flex-1 items-center justify-center px-8">
                    <MaterialIcons name="event-busy" size={64} color={colors.onSurfaceVariant} />
                    <Text style={{ color: colors.onSurface }} className="text-xl font-bold mt-4 text-center">
                        Tidak Ada Jadwal PMT
                    </Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm mt-2 text-center">
                        Tidak ada jadwal PMT yang dapat dilaporkan hari ini.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ backgroundColor: colors.primary }}
                        className="mt-6 px-6 py-3 rounded-xl"
                    >
                        <Text style={{ color: colors.onPrimary }} className="font-bold">Kembali</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ backgroundColor: colors.surface }} className="flex-row items-center p-4 pb-2 justify-between">
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ backgroundColor: colors.surfaceContainerHigh }}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
                </TouchableOpacity>
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
                    {schedule.is_logged ? 'Edit Laporan PMT' : 'Lapor PMT'}
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Status Card */}
                <View className="p-4">
                    <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-stretch justify-between gap-4 rounded-xl p-4">
                        <View className="flex-1 gap-1">
                            <Text style={{ color: colors.onSurface }} className="text-base font-bold leading-tight">
                                {formatDate(schedule.scheduled_date)}
                            </Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-normal">
                                {schedule.is_logged ? 'Sudah dilaporkan' : 'Belum dilaporkan'}
                            </Text>
                        </View>
                        <View style={{ backgroundColor: colors.primaryContainer }} className="w-12 h-12 items-center justify-center rounded-lg">
                            <MaterialIcons name="calendar-month" size={24} color={colors.primary} />
                        </View>
                    </View>
                </View>

                {/* Food Selection */}
                <View className="px-4 py-2">
                    <Text style={{ color: colors.onSurface }} className="text-sm font-bold mb-3">
                        Pilih Makanan
                    </Text>

                    {selectedFood ? (
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center rounded-xl p-4">
                            <View style={{ backgroundColor: colors.primaryContainer }} className="w-10 h-10 rounded-lg items-center justify-center mr-3">
                                <Text className="text-lg">{selectedFood.icon || '🍽️'}</Text>
                            </View>
                            <View className="flex-1">
                                <Text style={{ color: colors.onSurface }} className="text-base font-bold">{selectedFood.name}</Text>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">
                                    {selectedFood.nutrition.calories} kkal · {selectedFood.nutrition.protein}g protein
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => { setSelectedFood(null); setShowFoodResults(true); }}
                                style={{ backgroundColor: colors.primary }}
                                className="px-3 py-1.5 rounded-full"
                            >
                                <Text style={{ color: colors.onPrimary }} className="text-xs font-bold">Ganti</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View>
                            {/* Search Bar */}
                            <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row w-full items-center rounded-2xl h-14 shadow-sm overflow-hidden">
                                <View className="pl-4 pr-2">
                                    <MaterialIcons name="search" size={24} color={colors.onSurfaceVariant} />
                                </View>
                                <TextInput
                                    style={{ color: colors.onSurface }}
                                    className="flex-1 bg-transparent text-base font-medium h-full"
                                    placeholder="Cari makanan..."
                                    placeholderTextColor={colors.onSurfaceVariant}
                                    value={foodSearchQuery}
                                    onChangeText={setFoodSearchQuery}
                                    onFocus={() => setShowFoodResults(true)}
                                />
                                {(foodSearchQuery.length > 0 || selectedCategory) && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setFoodSearchQuery('');
                                            setSelectedCategory(null);
                                            setShowFoodResults(false);
                                        }}
                                        className="pr-4"
                                    >
                                        <MaterialIcons name="close" size={20} color={colors.onSurfaceVariant} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Category Filter Pills */}
                            {categories && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    className="mt-3"
                                    contentContainerStyle={{ gap: 8 }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedCategory(null);
                                            if (foodSearchQuery.length >= 2 || selectedCategory) {
                                                setShowFoodResults(true);
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
                                                setShowFoodResults(true);
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

                            {/* Search Results */}
                            {showFoodResults && (foodSearchQuery.length >= 2 || selectedCategory) && (
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
                                            {searchResults.data.map((food) => (
                                                <SystemFoodCard
                                                    key={food.id}
                                                    food={food}
                                                    onSelect={(f) => {
                                                        setSelectedFood(f);
                                                        setShowFoodResults(false);
                                                        setFoodSearchQuery('');
                                                        setSelectedCategory(null);
                                                    }}
                                                    showExpandedDetails={false}
                                                />
                                            ))}
                                        </ScrollView>
                                    )}

                                    {!isSearching && searchResults?.data?.length === 0 && (
                                        <View className="p-4 items-center">
                                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">
                                                Tidak ada makanan ditemukan
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                </View>

                <View className="h-4" />

                {/* Photo Upload */}
                <View className="px-4">
                    <Text style={{ color: colors.onSurface }} className="text-sm font-bold mb-3">
                        Foto Anak Makan
                    </Text>
                    <View className="items-center">
                        <ImagePickerButton
                            value={photoUrl || null}
                            onSelect={setPhotoUrl}
                            onRemove={() => setPhotoUrl('')}
                            shape="square"
                            size={160}
                            placeholderIcon="photo-camera"
                            placeholderIconSize={40}
                        />
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mt-2 text-center">
                            Pastikan wajah dan makanan terlihat
                        </Text>
                    </View>
                </View>

                <View className="h-2" />

                {/* Portion Section */}
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight tracking-tight px-4 text-left pb-3 pt-6">
                    Porsi yang dimakan
                </Text>

                {/* Portion Selector Grid */}
                <View className="px-4 flex-row flex-wrap gap-3">
                    <View className="flex-row gap-3 w-full">
                        <PortionOption value="habis" label={PMT_PORTION_LABEL.habis} isSelected={selectedPortion === 'habis'} />
                        <PortionOption value="half" label={PMT_PORTION_LABEL.half} isSelected={selectedPortion === 'half'} />
                    </View>
                    <View className="flex-row gap-3 w-full">
                        <PortionOption value="quarter" label={PMT_PORTION_LABEL.quarter} isSelected={selectedPortion === 'quarter'} />
                        <PortionOption value="none" label={PMT_PORTION_LABEL.none} isSelected={selectedPortion === 'none'} />
                    </View>
                </View>

                {/* Notes Section */}
                <View className="px-4 pt-6">
                    <Text style={{ color: colors.onSurface }} className="text-sm font-bold mb-2">
                        Catatan Tambahan (Opsional)
                    </Text>
                    <TextInput
                        style={{ backgroundColor: colors.surfaceContainerHigh, color: colors.onSurface }}
                        className="w-full rounded-xl p-4 min-h-[100px]"
                        placeholder="Ada keluhan atau catatan lain?"
                        placeholderTextColor={colors.outline}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>
            </ScrollView>

            {/* Footer Button */}
            <View style={{ backgroundColor: colors.surface }} className="absolute bottom-0 left-0 right-0 p-4 pb-8">
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!selectedPortion || isPending}
                    style={{ 
                        backgroundColor: colors.primary,
                        opacity: (!selectedPortion || isPending) ? 0.5 : 1
                    }}
                    className="w-full h-14 rounded-xl items-center justify-center flex-row gap-2"
                >
                    {isPending ? (
                        <ActivityIndicator size="small" color={colors.onPrimary} />
                    ) : (
                        <MaterialIcons name="check" size={24} color={colors.onPrimary} />
                    )}
                    <Text style={{ color: colors.onPrimary }} className="text-base font-bold leading-normal tracking-wide">
                        {isPending ? 'Menyimpan...' : (schedule.is_logged ? 'PERBARUI LAPORAN' : 'KIRIM LAPORAN')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
