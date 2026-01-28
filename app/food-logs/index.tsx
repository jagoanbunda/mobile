import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, Href } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { useFoodLogs, useNutritionSummary } from '@/services/hooks/use-foods';
import { FoodLog, MealTime } from '@/types';

// Components
import { FoodLogCard } from '@/components/FoodLogCard';
import { NutritionSummaryCard } from '@/components/NutritionSummaryCard';
import { MealTimeFilter } from '@/components/MealTimeFilter';
import { DateRangePicker } from '@/components/DateRangePicker';
import { EmptyFoodLogs } from '@/components/EmptyFoodLogs';
import { DateSectionHeader } from '@/components/DateSectionHeader';
import { CardSkeleton } from '@/components/Skeleton';

// Utilities
import { groupFoodLogsByDate, getDefaultDateRange, formatToDateString } from '@/utils/food-log-helpers';

/**
 * Food Log Skeleton Loader
 */
function FoodLogListSkeleton() {
  const { colors } = useTheme();

  return (
    <View className="px-4 py-2">
      {/* Summary skeleton */}
      <View
        style={{ backgroundColor: colors.surfaceContainerHigh }}
        className="rounded-2xl p-4 mb-4"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="gap-1">
            <View
              style={{ backgroundColor: colors.surfaceContainerHighest }}
              className="w-32 h-5 rounded"
            />
            <View
              style={{ backgroundColor: colors.surfaceContainerHighest }}
              className="w-24 h-3 rounded mt-1"
            />
          </View>
          <View
            style={{ backgroundColor: colors.surfaceContainerHighest }}
            className="w-16 h-6 rounded-full"
          />
        </View>
        <View className="flex-row gap-3">
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{ backgroundColor: colors.surfaceContainerHighest }}
              className="flex-1 h-20 rounded-xl"
            />
          ))}
        </View>
      </View>

      {/* Section header skeleton */}
      <View
        style={{ backgroundColor: colors.surfaceContainerHighest }}
        className="w-40 h-5 rounded mb-3"
      />

      {/* Card skeletons */}
      {[1, 2, 3].map((i) => (
        <View key={i} className="mb-3">
          <CardSkeleton />
        </View>
      ))}
    </View>
  );
}

export function FoodLogsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: activeChild, isLoading: isLoadingChild } = useActiveChild();
  const childId = activeChild?.id || 0;

  // Filter state
  const defaultRange = getDefaultDateRange();
  const [startDate, setStartDate] = useState(() => new Date(defaultRange.start + 'T00:00:00'));
  const [endDate, setEndDate] = useState(() => new Date(defaultRange.end + 'T00:00:00'));
  const [selectedMealTime, setSelectedMealTime] = useState<MealTime | 'all'>('all');

  // Build query params
  const queryParams = useMemo(
    () => ({
      start_date: formatToDateString(startDate),
      end_date: formatToDateString(endDate),
      meal_time: selectedMealTime === 'all' ? undefined : selectedMealTime,
      per_page: 50,
    }),
    [startDate, endDate, selectedMealTime]
  );

  // Fetch food logs
  const {
    data: foodLogsData,
    isLoading: isLoadingLogs,
    isFetching,
    refetch,
  } = useFoodLogs(childId, queryParams);

  // Fetch nutrition summary for the period (weekly by default)
  const { data: nutritionSummary, isLoading: isLoadingSummary } = useNutritionSummary(childId, {
    period: 'week',
  });

  // Transform to sections
  const sections = useMemo(
    () => groupFoodLogsByDate(foodLogsData?.data ?? []),
    [foodLogsData?.data]
  );

  // Handlers
  const handleFoodLogPress = useCallback(
    (foodLog: FoodLog) => {
      router.push(`/food-logs/${foodLog.id}` as Href);
    },
    [router]
  );

  const handleAddPress = useCallback(() => {
    router.push('/(tabs)/input');
  }, [router]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Loading state
  const isLoading = isLoadingChild || isLoadingLogs;

  // Render section header
  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <DateSectionHeader title={section.title} />
    ),
    []
  );

  // Render food log item
  const renderItem = useCallback(
    ({ item }: { item: FoodLog }) => (
      <View
        className="px-4 mb-3"
        accessible
        accessibilityLabel={`${item.meal_time_label} pada ${item.log_date}, ${item.items.length} item, ${item.totals.calories.toFixed(0)} kalori`}
        accessibilityHint="Ketuk untuk melihat detail"
      >
        <FoodLogCard
          foodLog={item}
          onPress={() => handleFoodLogPress(item)}
        />
      </View>
    ),
    [handleFoodLogPress]
  );

  // Key extractor
  const keyExtractor = useCallback((item: FoodLog) => item.id.toString(), []);

  // List header (filters + summary)
  const ListHeaderComponent = useMemo(
    () => (
      <View className="px-4 pt-4">
        {/* Nutrition Summary */}
        {nutritionSummary && !isLoadingSummary && (
          <View className="mb-4">
            <NutritionSummaryCard summary={nutritionSummary} showMealBreakdown />
          </View>
        )}

        {/* Date Range Picker */}
        <View className="mb-4">
          <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium mb-2">
            Rentang Tanggal
          </Text>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </View>

        {/* Meal Time Filter */}
        <View className="mb-4">
          <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium mb-2">
            Waktu Makan
          </Text>
          <MealTimeFilter
            value={selectedMealTime}
            onChange={setSelectedMealTime}
            variant="chip"
          />
        </View>
      </View>
    ),
    [nutritionSummary, isLoadingSummary, startDate, endDate, selectedMealTime, colors]
  );

  // Empty state
  const ListEmptyComponent = useMemo(
    () =>
      !isLoading ? (
        <EmptyFoodLogs
          onAddPress={handleAddPress}
          message={
            selectedMealTime !== 'all'
              ? `Tidak ada catatan ${
                  selectedMealTime === 'breakfast'
                    ? 'sarapan'
                    : selectedMealTime === 'lunch'
                      ? 'makan siang'
                      : selectedMealTime === 'dinner'
                        ? 'makan malam'
                        : 'camilan'
                } untuk periode ini`
              : 'Belum ada catatan makanan untuk periode ini'
          }
        />
      ) : null,
    [isLoading, selectedMealTime, handleAddPress]
  );

  // Loading screen
  if (isLoading && !foodLogsData) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.surface }} className="flex-1">
        {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
          accessibilityLabel="Kembali"
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={{ color: colors.onSurface }} className="text-lg font-bold">
          Riwayat Makanan
        </Text>
        <View className="w-11" />
      </View>
        <FoodLogListSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.surface }} className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
          accessibilityLabel="Kembali"
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={{ color: colors.onSurface }} className="text-lg font-bold">
          Riwayat Makanan
        </Text>
        <TouchableOpacity
          onPress={handleAddPress}
          className="w-11 h-11 items-center justify-center"
          accessibilityLabel="Tambah catatan makanan"
        >
          <MaterialIcons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Food Logs List */}
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 24,
          flexGrow: sections.length === 0 ? 1 : undefined,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        // Performance optimizations
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        // Accessibility
        accessibilityLabel="Daftar riwayat makanan"
      />

      {/* Loading overlay for subsequent fetches */}
      {isFetching && !isLoading && (
        <View
          className="absolute bottom-6 left-0 right-0 items-center"
          pointerEvents="none"
        >
          <View
            style={{ backgroundColor: colors.surfaceContainerHigh }}
            className="flex-row items-center px-4 py-2 rounded-full shadow-lg"
          >
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs ml-2">
              Memuat...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default FoodLogsScreen;
