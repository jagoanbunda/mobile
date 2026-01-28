import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  Pressable,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { useFoodLogDetail, useUpdateFoodLog, useFoodSearch } from '@/services/hooks/use-foods';
import { Food, FoodLogItemInput, MealTime } from '@/types';
import { ApiError } from '@/services/api/errors';

// Components
import { SystemFoodCard } from '@/components/SystemFoodCard';
import { CardSkeleton } from '@/components/Skeleton';

// Helper function to format date in Indonesian
const formatDateIndonesian = (date: Date): string => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
};

// Meal time mappings
const mealTimeToDisplay: Record<MealTime, string> = {
  'breakfast': 'Pagi',
  'lunch': 'Siang',
  'dinner': 'Malam',
  'snack': 'Camilan',
};

const displayToMealTime: Record<string, MealTime> = {
  'Pagi': 'breakfast',
  'Siang': 'lunch',
  'Malam': 'dinner',
  'Camilan': 'snack',
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

/**
 * Loading skeleton for edit screen
 */
function EditScreenSkeleton() {
  const { colors } = useTheme();

  return (
    <View className="px-6 py-4">
      {/* Date picker skeleton */}
      <View
        style={{ backgroundColor: colors.surfaceContainerHigh }}
        className="h-12 rounded-xl mb-4"
      />
      
      {/* Meal selector skeleton */}
      <View
        style={{ backgroundColor: colors.surfaceContainerHigh }}
        className="h-12 rounded-full mb-6"
      />
      
      {/* Items skeleton */}
      <View
        style={{ backgroundColor: colors.surfaceContainerHighest }}
        className="w-32 h-4 rounded mb-3"
      />
      {[1, 2, 3].map((i) => (
        <View key={i} className="mb-3">
          <CardSkeleton />
        </View>
      ))}
    </View>
  );
}

export default function EditFoodLogScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const logId = Number(id);

  const { data: activeChild, isLoading: isLoadingChild } = useActiveChild();
  const childId = activeChild?.id || 0;

  // Fetch existing food log
  const { data: foodLogDetail, isLoading: isLoadingDetail } = useFoodLogDetail(childId, logId);

  // Update mutation
  const { mutate: updateLog, isPending: isUpdating } = useUpdateFoodLog(childId, logId);

  // Form state
  const [selectedMeal, setSelectedMeal] = useState('Pagi');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedFoodItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Search hook
  const { data: searchResults, isLoading: isSearching } = useFoodSearch(searchQuery);

  // Initialize form with existing data
  useEffect(() => {
    if (foodLogDetail && !isInitialized) {
      setSelectedDate(new Date(foodLogDetail.log_date + 'T00:00:00'));
      setSelectedMeal(mealTimeToDisplay[foodLogDetail.meal_time] || 'Pagi');
      setNotes(foodLogDetail.notes || '');
      setSelectedItems(
        foodLogDetail.items.map((item) => ({
          food: item.food,
          quantity: item.quantity,
        }))
      );
      setIsInitialized(true);
    }
  }, [foodLogDetail, isInitialized]);

  // Handle date change
  const onDateChange = useCallback((event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  // Handle adding food from search results
  const handleAddFood = useCallback((food: Food) => {
    const existingItem = selectedItems.find((item) => item.food.id === food.id);

    if (existingItem) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.food.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setSelectedItems([...selectedItems, { food, quantity: 1 }]);
    }

    setSearchQuery('');
    setShowSearchResults(false);
  }, [selectedItems]);

  // Handle quantity change
  const handleQuantityChange = useCallback((foodId: number, delta: number) => {
    setSelectedItems(
      selectedItems
        .map((item) => {
          if (item.food.id === foodId) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) {
              return null as any;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean)
    );
  }, [selectedItems]);

  // Calculate total nutrition
  const totalNutrition = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.food.nutrition.calories * item.quantity,
        protein: acc.protein + item.food.nutrition.protein * item.quantity,
        fat: acc.fat + item.food.nutrition.fat * item.quantity,
        carbohydrate: acc.carbohydrate + item.food.nutrition.carbohydrate * item.quantity,
      }),
      { calories: 0, protein: 0, fat: 0, carbohydrate: 0 }
    );
  }, [selectedItems]);

  // Handle save
  const handleSave = useCallback(() => {
    if (selectedItems.length === 0) {
      Alert.alert(
        'Makanan Belum Dipilih',
        'Silakan pilih minimal satu makanan untuk disimpan.',
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

    const items: FoodLogItemInput[] = selectedItems.map((item) => ({
      food_id: item.food.id,
      quantity: item.quantity,
      serving_size: item.food.serving_size,
    }));

    const dateString = selectedDate.toISOString().split('T')[0];

    updateLog(
      {
        log_date: dateString,
        meal_time: displayToMealTime[selectedMeal],
        notes: notes.trim() || undefined,
        items,
      },
      {
        onSuccess: () => {
          Alert.alert(
            'Berhasil!',
            'Catatan makanan berhasil diperbarui.',
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        },
        onError: (error) => {
          let title = 'Gagal Menyimpan';
          let message = 'Terjadi kesalahan saat menyimpan perubahan.';

          if (error instanceof ApiError) {
            if (error.status === 422) {
              title = 'Data Tidak Valid';
              message = error.message || 'Silakan periksa kembali data yang dimasukkan.';
            } else if (error.status === 401) {
              title = 'Sesi Berakhir';
              message = 'Silakan login kembali untuk melanjutkan.';
            } else if (error.status === 403) {
              title = 'Akses Ditolak';
              message = 'Anda tidak memiliki izin untuk mengedit catatan ini.';
            } else {
              message = error.message;
            }
          }

          Alert.alert(title, message, [{ text: 'Mengerti', style: 'default' }]);
        },
      }
    );
  }, [selectedItems, selectedDate, selectedMeal, notes, updateLog, router]);

  // Handle back
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const isLoading = isLoadingChild || isLoadingDetail;

  // Loading state
  if (isLoading || !foodLogDetail) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.surface }} className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={handleBack}
            className="w-11 h-11 items-center justify-center"
            accessibilityLabel="Kembali"
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={{ color: colors.onSurface }} className="text-lg font-bold">
            Edit Makanan
          </Text>
          <View className="w-11" />
        </View>
        <EditScreenSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.surface }} className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={handleBack}
          className="w-11 h-11 items-center justify-center"
          accessibilityLabel="Kembali"
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={{ color: colors.onSurface }} className="text-lg font-bold">
          Edit Makanan
        </Text>
        <View className="w-11" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        <View className="px-6 pt-2">
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
              marginBottom: 16,
            }}
          >
            <MaterialIcons
              name="event"
              size={20}
              color={colors.onSurfaceVariant}
              style={{ position: 'absolute', left: 16 }}
            />
            <Text style={{ color: colors.onSurface, fontSize: 14, fontWeight: '500' }}>
              {formatDateIndonesian(selectedDate)}
            </Text>
            <MaterialIcons
              name="arrow-drop-down"
              size={24}
              color={colors.onSurfaceVariant}
              style={{ position: 'absolute', right: 12 }}
            />
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

          {/* Meal Time Selector */}
          <View
            style={{
              backgroundColor: colors.surfaceContainerHigh,
              flexDirection: 'row',
              padding: 6,
              borderRadius: 9999,
              marginBottom: 16,
            }}
          >
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
          <View className="relative mb-4">
            <View
              style={{ backgroundColor: colors.surfaceContainerHigh }}
              className="flex-row w-full items-center rounded-2xl h-14 shadow-sm overflow-hidden"
            >
              <View className="pl-4 pr-2">
                <MaterialIcons name="search" size={24} color={colors.onSurfaceVariant} />
              </View>
              <TextInput
                style={{ color: colors.onSurface }}
                className="flex-1 bg-transparent text-base font-medium h-full"
                placeholder="Tambah makanan..."
                placeholderTextColor={colors.onSurfaceVariant}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setShowSearchResults(true)}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                  className="pr-4"
                >
                  <MaterialIcons name="close" size={20} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
              )}
            </View>

            {/* Search Results Dropdown */}
            {showSearchResults && searchQuery.length >= 2 && (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  marginTop: 8,
                  maxHeight: 300,
                  borderWidth: 1,
                  borderColor: colors.outline,
                }}
                className="shadow-lg"
              >
                {isSearching && (
                  <View className="p-4 items-center">
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                )}

                {!isSearching && searchResults?.data && searchResults.data.length > 0 && (
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
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

          {/* Notes Input */}
          <View className="mb-6">
            <Text
              style={{ color: colors.onSurfaceVariant }}
              className="text-sm font-bold uppercase tracking-wider pl-1 mb-2"
            >
              Catatan (Opsional)
            </Text>
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
              <Text
                style={{ color: colors.onSurfaceVariant }}
                className="text-sm font-bold uppercase tracking-wider pl-1"
              >
                Makanan Terpilih ({selectedItems.length})
              </Text>

              {selectedItems.map((item) => (
                <View
                  key={item.food.id}
                  style={{ backgroundColor: colors.surfaceContainerHigh }}
                  className="flex-row items-center justify-between p-3 pr-4 rounded-2xl shadow-sm"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      style={{ backgroundColor: getCategoryColor(item.food.category) + '30' }}
                      className="w-12 h-12 rounded-xl items-center justify-center"
                    >
                      <MaterialIcons
                        name={getCategoryIcon(item.food.category) as any}
                        size={24}
                        color={getCategoryColor(item.food.category)}
                      />
                    </View>
                    <View className="flex-1">
                      <Text style={{ color: colors.onSurface }} className="font-bold text-base">
                        {item.food.name}
                      </Text>
                      <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">
                        {item.food.serving_size} gram • {(item.food.nutrition.calories * item.quantity).toFixed(0)} kkal
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{ backgroundColor: colors.surfaceContainerLowest }}
                    className="flex-row items-center rounded-full p-1 h-9"
                  >
                    <TouchableOpacity
                      onPress={() => handleQuantityChange(item.food.id, -1)}
                      style={{ backgroundColor: colors.surfaceContainerHigh }}
                      className="w-7 h-7 items-center justify-center rounded-full shadow-sm active:scale-95"
                    >
                      <MaterialIcons name="remove" size={16} color={colors.onSurface} />
                    </TouchableOpacity>
                    <Text
                      style={{ color: colors.onSurface }}
                      className="w-8 text-center text-sm font-bold"
                    >
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleQuantityChange(item.food.id, 1)}
                      style={{ backgroundColor: colors.primary }}
                      className="w-7 h-7 items-center justify-center rounded-full shadow-sm active:scale-95"
                    >
                      <MaterialIcons name="add" size={16} color={colors.onPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Empty state */}
          {selectedItems.length === 0 && (
            <View className="items-center py-8">
              <View
                style={{ backgroundColor: colors.surfaceContainerHigh }}
                className="w-16 h-16 rounded-full items-center justify-center mb-3"
              >
                <MaterialIcons name="restaurant" size={28} color={colors.onSurfaceVariant} />
              </View>
              <Text style={{ color: colors.onSurfaceVariant }} className="text-sm text-center">
                Belum ada makanan dipilih.{'\n'}Cari dan tambahkan makanan di atas.
              </Text>
            </View>
          )}

          {/* Nutrition Summary Card */}
          {selectedItems.length > 0 && (
            <View
              style={{ backgroundColor: colors.secondaryContainer }}
              className="p-4 rounded-3xl relative overflow-hidden shadow-sm mb-6"
            >
              <Text style={{ color: colors.onSecondaryContainer }} className="text-sm font-bold mb-3">
                Ringkasan Nutrisi
              </Text>

              {/* Nutrition Grid */}
              <View className="flex-row flex-wrap gap-2">
                <View
                  className="flex-1 min-w-[40%] items-center p-2"
                  style={{ backgroundColor: colors.surface + '30', borderRadius: 12 }}
                >
                  <Text style={{ color: colors.onSecondaryContainer }} className="text-xs font-medium">
                    Energi
                  </Text>
                  <Text style={{ color: colors.onSecondaryContainer }} className="text-lg font-bold">
                    {totalNutrition.calories.toFixed(0)}
                  </Text>
                  <Text style={{ color: colors.onSecondaryContainer }} className="text-[10px]">
                    kkal
                  </Text>
                </View>

                <View
                  className="flex-1 min-w-[40%] items-center p-2"
                  style={{ backgroundColor: colors.surface + '30', borderRadius: 12 }}
                >
                  <Text style={{ color: colors.onSecondaryContainer }} className="text-xs font-medium">
                    Protein
                  </Text>
                  <Text style={{ color: colors.onSecondaryContainer }} className="text-lg font-bold">
                    {totalNutrition.protein.toFixed(1)}
                  </Text>
                  <Text style={{ color: colors.onSecondaryContainer }} className="text-[10px]">
                    gr
                  </Text>
                </View>

                <View
                  className="flex-1 min-w-[40%] items-center p-2"
                  style={{ backgroundColor: colors.surface + '30', borderRadius: 12 }}
                >
                  <Text style={{ color: colors.onSecondaryContainer }} className="text-xs font-medium">
                    Lemak
                  </Text>
                  <Text style={{ color: colors.onSecondaryContainer }} className="text-lg font-bold">
                    {totalNutrition.fat.toFixed(1)}
                  </Text>
                  <Text style={{ color: colors.onSecondaryContainer }} className="text-[10px]">
                    gr
                  </Text>
                </View>

                <View
                  className="flex-1 min-w-[40%] items-center p-2"
                  style={{ backgroundColor: colors.surface + '30', borderRadius: 12 }}
                >
                  <Text style={{ color: colors.onSecondaryContainer }} className="text-xs font-medium">
                    Karbo
                  </Text>
                  <Text style={{ color: colors.onSecondaryContainer }} className="text-lg font-bold">
                    {totalNutrition.carbohydrate.toFixed(1)}
                  </Text>
                  <Text style={{ color: colors.onSecondaryContainer }} className="text-[10px]">
                    gr
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={isUpdating || selectedItems.length === 0}
            style={{
              backgroundColor: isUpdating || selectedItems.length === 0 ? colors.outline : colors.primary,
            }}
            className="w-full flex-row items-center justify-center gap-2 active:scale-[0.98] rounded-full py-4 shadow-lg"
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <>
                <MaterialIcons name="check-circle" size={24} color={colors.onPrimary} />
                <Text style={{ color: colors.onPrimary }} className="font-bold text-lg">
                  Simpan Perubahan
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
