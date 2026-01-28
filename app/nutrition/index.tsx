import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { useNutritionSummary } from '@/services/hooks/use-foods';
import { NutritionSummaryCard } from '@/components/NutritionSummaryCard';
import { CardSkeleton } from '@/components/Skeleton';
import { NutritionPeriod, MealTimeNutrition } from '@/types';

type PeriodOption = {
  value: NutritionPeriod;
  label: string;
};

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: 'day', label: 'Hari' },
  { value: 'week', label: 'Minggu' },
  { value: 'month', label: 'Bulan' },
];

// Meal time configuration for bar chart
const MEAL_TIME_CONFIG: Record<string, { label: string; color: string; icon: keyof typeof MaterialIcons.glyphMap }> = {
  breakfast: { label: 'Sarapan', color: '#F59E0B', icon: 'wb-sunny' },
  lunch: { label: 'Makan Siang', color: '#22C55E', icon: 'light-mode' },
  dinner: { label: 'Makan Malam', color: '#F97316', icon: 'nights-stay' },
  snack: { label: 'Camilan', color: '#A855F7', icon: 'cookie' },
};

/**
 * Skeleton loader for nutrition dashboard
 */
function NutritionDashboardSkeleton() {
  const { colors } = useTheme();

  return (
    <View className="px-4 py-2">
      {/* Period selector skeleton */}
      <View className="flex-row gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={{ backgroundColor: colors.surfaceContainerHighest }}
            className="flex-1 h-10 rounded-full"
          />
        ))}
      </View>

      {/* Summary card skeleton */}
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

      {/* Bar chart skeleton */}
      <View
        style={{ backgroundColor: colors.surfaceContainerHigh }}
        className="rounded-2xl p-4"
      >
        <View
          style={{ backgroundColor: colors.surfaceContainerHighest }}
          className="w-48 h-5 rounded mb-4"
        />
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="flex-row items-center gap-3 mb-3">
            <View
              style={{ backgroundColor: colors.surfaceContainerHighest }}
              className="w-24 h-4 rounded"
            />
            <View
              style={{ backgroundColor: colors.surfaceContainerHighest }}
              className="flex-1 h-6 rounded"
            />
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * Meal Time Bar Chart Component
 */
interface MealTimeBarChartProps {
  byMealTime: {
    breakfast?: MealTimeNutrition;
    lunch?: MealTimeNutrition;
    dinner?: MealTimeNutrition;
    snack?: MealTimeNutrition;
  };
}

function MealTimeBarChart({ byMealTime }: MealTimeBarChartProps) {
  const { colors } = useTheme();

  // Calculate max calories for proportional bars
  const mealData = Object.entries(MEAL_TIME_CONFIG).map(([key, config]) => {
    const data = byMealTime[key as keyof typeof byMealTime];
    return {
      key,
      ...config,
      calories: data?.calories ?? 0,
      count: data?.count ?? 0,
    };
  });

  const maxCalories = Math.max(...mealData.map((m) => m.calories), 1); // Minimum 1 to avoid division by zero

  const BAR_HEIGHT = 24;
  const BAR_GAP = 12;
  const CHART_WIDTH = 200;
  const MIN_BAR_WIDTH = 4; // Minimum visible bar width

  return (
    <View
      style={{ backgroundColor: colors.surfaceContainerHigh }}
      className="rounded-2xl p-4"
    >
      <Text style={{ color: colors.onSurface }} className="font-bold text-base mb-4">
        Distribusi per Waktu Makan
      </Text>

      <View className="gap-3">
        {mealData.map((meal, index) => {
          const barWidth = meal.calories > 0
            ? Math.max((meal.calories / maxCalories) * CHART_WIDTH, MIN_BAR_WIDTH)
            : MIN_BAR_WIDTH;

          return (
            <View key={meal.key} className="flex-row items-center">
              {/* Label */}
              <View className="w-28 flex-row items-center gap-2">
                <MaterialIcons name={meal.icon} size={16} color={meal.color} />
                <Text style={{ color: colors.onSurface }} className="text-xs font-medium">
                  {meal.label}
                </Text>
              </View>

              {/* Bar */}
              <View className="flex-1 flex-row items-center gap-2">
                <Svg height={BAR_HEIGHT} width={CHART_WIDTH + 60}>
                  {/* Background track */}
                  <Rect
                    x={0}
                    y={(BAR_HEIGHT - 12) / 2}
                    width={CHART_WIDTH}
                    height={12}
                    rx={6}
                    fill={colors.surfaceContainerHighest}
                  />
                  {/* Calorie bar */}
                  <Rect
                    x={0}
                    y={(BAR_HEIGHT - 12) / 2}
                    width={barWidth}
                    height={12}
                    rx={6}
                    fill={meal.color}
                    opacity={meal.calories > 0 ? 1 : 0.3}
                  />
                  {/* Calorie value */}
                  <SvgText
                    x={CHART_WIDTH + 8}
                    y={BAR_HEIGHT / 2 + 4}
                    fontSize={11}
                    fontWeight="600"
                    fill={colors.onSurface}
                  >
                    {meal.calories > 0 ? `${meal.calories.toFixed(0)} kkal` : '-'}
                  </SvgText>
                </Svg>
              </View>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View className="mt-4 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.outline + '30' }}>
        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">
          Berdasarkan total kalori yang dikonsumsi per waktu makan
        </Text>
      </View>
    </View>
  );
}

/**
 * Empty state component
 */
function EmptyNutritionState({ periodLabel }: { periodLabel: string }) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View
        style={{ backgroundColor: colors.surfaceContainerHigh }}
        className="w-20 h-20 rounded-full items-center justify-center mb-4"
      >
        <MaterialIcons name="restaurant" size={36} color={colors.onSurfaceVariant} />
      </View>
      <Text style={{ color: colors.onSurface }} className="text-lg font-bold text-center mb-2">
        Belum Ada Data
      </Text>
      <Text style={{ color: colors.onSurfaceVariant }} className="text-sm text-center">
        Belum ada data makanan untuk {periodLabel.toLowerCase()} ini
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/input')}
        style={{ backgroundColor: colors.primary }}
        className="mt-6 px-6 py-3 rounded-full flex-row items-center gap-2"
      >
        <MaterialIcons name="add" size={20} color={colors.onPrimary} />
        <Text style={{ color: colors.onPrimary }} className="font-bold">
          Catat Makanan
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Nutrition Dashboard Screen
 */
export default function NutritionDashboardScreen() {
  const { colors } = useTheme();
  const { data: activeChild, isLoading: isLoadingChild } = useActiveChild();
  const childId = activeChild?.id || 0;

  // Period state - default to week
  const [selectedPeriod, setSelectedPeriod] = useState<NutritionPeriod>('week');

  // Fetch nutrition summary
  const {
    data: nutritionSummary,
    isLoading: isLoadingSummary,
    isFetching,
    refetch,
  } = useNutritionSummary(childId, { period: selectedPeriod });

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Handle period change
  const handlePeriodChange = useCallback((period: NutritionPeriod) => {
    setSelectedPeriod(period);
  }, []);

  // Loading state
  const isLoading = isLoadingChild || isLoadingSummary;

  // Get period label for empty state
  const currentPeriodLabel = useMemo(() => {
    return PERIOD_OPTIONS.find((p) => p.value === selectedPeriod)?.label || 'periode';
  }, [selectedPeriod]);

  // Check if data is empty
  const hasNoData = nutritionSummary?.total_meals === 0;

  // Loading screen
  if (isLoading && !nutritionSummary) {
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
            Ringkasan Nutrisi
          </Text>
          <View className="w-11" />
        </View>
        <NutritionDashboardSkeleton />
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
          Ringkasan Nutrisi
        </Text>
        <View className="w-11" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
          flexGrow: hasNoData ? 1 : undefined,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Period Selector */}
        <View className="flex-row gap-2 mb-4">
          {PERIOD_OPTIONS.map((option) => {
            const isSelected = selectedPeriod === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => handlePeriodChange(option.value)}
                style={{
                  backgroundColor: isSelected ? colors.primary : colors.surfaceContainerHigh,
                }}
                className="flex-1 py-2.5 rounded-full items-center"
                accessibilityLabel={`Pilih periode ${option.label}`}
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={{ color: isSelected ? colors.onPrimary : colors.onSurface }}
                  className="font-semibold text-sm"
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Empty State or Content */}
        {hasNoData ? (
          <EmptyNutritionState periodLabel={currentPeriodLabel} />
        ) : (
          <>
            {/* Nutrition Summary Card */}
            {nutritionSummary && (
              <View className="mb-4">
                <NutritionSummaryCard summary={nutritionSummary} showMealBreakdown />
              </View>
            )}

            {/* Meal Time Bar Chart */}
            {nutritionSummary?.by_meal_time && (
              <MealTimeBarChart byMealTime={nutritionSummary.by_meal_time} />
            )}
          </>
        )}
      </ScrollView>

      {/* Loading overlay for period changes */}
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
