import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { useFoodLogDetail, useDeleteFoodLog } from '@/services/hooks/use-foods';
import { FoodLogItem } from '@/types';

// Components
import { FoodLogItemCard } from '@/components/FoodLogItemCard';
import { Skeleton, CardSkeleton } from '@/components/Skeleton';

// Utilities
import { formatDateIndonesian } from '@/utils/food-log-helpers';

/**
 * Get meal time icon
 */
const getMealTimeIcon = (mealTime: string): keyof typeof MaterialIcons.glyphMap => {
  const icons: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    breakfast: 'wb-sunny',
    lunch: 'light-mode',
    dinner: 'nights-stay',
    snack: 'cookie',
  };
  return icons[mealTime] || 'restaurant';
};

/**
 * Get meal time color
 */
const getMealTimeColor = (mealTime: string): string => {
  const colors: Record<string, string> = {
    breakfast: '#F59E0B', // amber
    lunch: '#22C55E', // green
    dinner: '#6366F1', // indigo
    snack: '#EC4899', // pink
  };
  return colors[mealTime] || '#6B7280';
};

/**
 * Loading skeleton for detail screen
 */
function DetailSkeleton() {
  const { colors } = useTheme();

  return (
    <View className="px-4 py-4">
      {/* Header skeleton */}
      <View className="items-center mb-6">
        <View
          style={{ backgroundColor: colors.surfaceContainerHighest }}
          className="w-16 h-16 rounded-2xl mb-3"
        />
        <View
          style={{ backgroundColor: colors.surfaceContainerHighest }}
          className="w-32 h-6 rounded mb-2"
        />
        <View
          style={{ backgroundColor: colors.surfaceContainerHighest }}
          className="w-48 h-4 rounded"
        />
      </View>

      {/* Items skeleton */}
      {[1, 2, 3].map((i) => (
        <View key={i} className="mb-3">
          <CardSkeleton />
        </View>
      ))}
    </View>
  );
}

export function FoodLogDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const logId = Number(id);

  const { data: activeChild, isLoading: isLoadingChild } = useActiveChild();
  const childId = activeChild?.id || 0;

  // Fetch food log detail
  const { data: foodLog, isLoading: isLoadingDetail } = useFoodLogDetail(childId, logId);

  // Delete mutation
  const deleteMutation = useDeleteFoodLog(childId);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handlers
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleEdit = useCallback(() => {
    router.push(`/food-logs/edit/${logId}` as Href);
  }, [router, logId]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Hapus Catatan Makanan',
      'Apakah Anda yakin ingin menghapus catatan makanan ini? Tindakan ini tidak dapat dibatalkan.',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteMutation.mutateAsync(logId);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus catatan makanan. Silakan coba lagi.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  }, [deleteMutation, logId, router]);

  const isLoading = isLoadingChild || isLoadingDetail;
  const mealColor = foodLog ? getMealTimeColor(foodLog.meal_time) : '#6B7280';

  // Loading state
  if (isLoading || !foodLog) {
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
            Detail Makanan
          </Text>
          <View className="w-11" />
        </View>
        <DetailSkeleton />
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
          Detail Makanan
        </Text>
        <TouchableOpacity
          onPress={handleEdit}
          className="w-11 h-11 items-center justify-center"
          accessibilityLabel="Edit catatan makanan"
        >
          <MaterialIcons name="edit" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Meal Header */}
        <View className="items-center px-4 pt-4 pb-6">
          {/* Meal time icon */}
          <View
            style={{ backgroundColor: mealColor + '20' }}
            className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
          >
            <MaterialIcons
              name={getMealTimeIcon(foodLog.meal_time)}
              size={32}
              color={mealColor}
            />
          </View>

          {/* Meal time label */}
          <Text style={{ color: colors.onSurface }} className="text-xl font-bold mb-1">
            {foodLog.meal_time_label}
          </Text>

          {/* Date and item count */}
          <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">
            {formatDateIndonesian(foodLog.log_date)} • {foodLog.items.length} item
          </Text>
        </View>

        {/* Food Items */}
        <View className="px-4">
          <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium mb-3">
            Daftar Makanan
          </Text>
          {foodLog.items.map((item: FoodLogItem) => (
            <View
              key={item.id}
              accessible
              accessibilityLabel={`${item.food.name}, ${item.nutrition.calories.toFixed(0)} kalori, ${item.nutrition.protein.toFixed(1)} gram protein`}
            >
              <FoodLogItemCard item={item} />
            </View>
          ))}
        </View>

        {/* Notes Section */}
        {foodLog.notes && (
          <View className="px-4 mt-6">
            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium mb-2">
              Catatan
            </Text>
            <View
              style={{ backgroundColor: colors.surfaceContainerHigh }}
              className="rounded-xl p-4"
            >
              <Text style={{ color: colors.onSurface }} className="text-sm leading-5">
                {foodLog.notes}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar with Nutrition Summary */}
      <View
        style={{
          backgroundColor: colors.surfaceContainerHigh,
          borderTopWidth: 1,
          borderTopColor: colors.outline + '30',
        }}
        className="px-4 pt-4 pb-6"
      >
        {/* Nutrition Totals */}
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 items-center">
            <Text style={{ color: colors.primary }} className="text-xl font-bold">
              {foodLog.totals.calories.toFixed(0)}
            </Text>
            <Text
              style={{ color: colors.onSurfaceVariant }}
              className="text-[10px]"
              accessibilityLabel={`Total kalori: ${foodLog.totals.calories.toFixed(0)} kilokalori`}
            >
              Kalori
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text style={{ color: colors.onSurface }} className="text-xl font-bold">
              {foodLog.totals.protein.toFixed(1)}
            </Text>
            <Text
              style={{ color: colors.onSurfaceVariant }}
              className="text-[10px]"
              accessibilityLabel={`Total protein: ${foodLog.totals.protein.toFixed(1)} gram`}
            >
              Protein (g)
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text style={{ color: colors.onSurface }} className="text-xl font-bold">
              {foodLog.totals.fat.toFixed(1)}
            </Text>
            <Text
              style={{ color: colors.onSurfaceVariant }}
              className="text-[10px]"
              accessibilityLabel={`Total lemak: ${foodLog.totals.fat.toFixed(1)} gram`}
            >
              Lemak (g)
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text style={{ color: colors.onSurface }} className="text-xl font-bold">
              {foodLog.totals.carbohydrate.toFixed(1)}
            </Text>
            <Text
              style={{ color: colors.onSurfaceVariant }}
              className="text-[10px]"
              accessibilityLabel={`Total karbohidrat: ${foodLog.totals.carbohydrate.toFixed(1)} gram`}
            >
              Karbo (g)
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          {/* Delete Button */}
          <TouchableOpacity
            onPress={handleDelete}
            disabled={isDeleting}
            style={{ backgroundColor: colors.errorContainer }}
            className="flex-1 flex-row items-center justify-center py-3 rounded-xl"
            accessibilityLabel="Hapus catatan makanan"
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color={colors.error} />
            ) : (
              <>
                <MaterialIcons name="delete" size={20} color={colors.error} />
                <Text style={{ color: colors.error }} className="font-semibold ml-2">
                  Hapus
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Edit Button */}
          <TouchableOpacity
            onPress={handleEdit}
            style={{ backgroundColor: colors.primary }}
            className="flex-1 flex-row items-center justify-center py-3 rounded-xl"
            accessibilityLabel="Edit catatan makanan"
          >
            <MaterialIcons name="edit" size={20} color={colors.onPrimary} />
            <Text style={{ color: colors.onPrimary }} className="font-semibold ml-2">
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default FoodLogDetailScreen;
