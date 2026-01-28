import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Animated } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { FoodLogItem } from '@/types';
import { getCategoryIcon, getCategoryColor, asIconName } from '@/utils/food-category-helpers';

export interface FoodLogItemCardProps {
  item: FoodLogItem;
  onPress?: () => void;
}

export function FoodLogItemCard({ item, onPress }: FoodLogItemCardProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const categoryIcon = getCategoryIcon(item.food.category);
  const categoryColor = getCategoryColor(item.food.category);

  const handlePress = () => {
    setExpanded(!expanded);
    onPress?.();
  };

  const totalGrams = item.quantity * item.serving_size;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{ backgroundColor: colors.surfaceContainerHigh }}
      className="rounded-2xl p-4 mb-3"
    >
      {/* Main row: Icon + Name + Calories */}
      <View className="flex-row items-center">
        {/* Category icon */}
        <View
          style={{ backgroundColor: categoryColor + '20' }}
          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
        >
          <MaterialIcons name={asIconName(categoryIcon)} size={22} color={categoryColor} />
        </View>

        {/* Food name and serving info */}
        <View className="flex-1">
          <Text
            style={{ color: colors.onSurface }}
            className="font-semibold text-base"
            numberOfLines={1}
          >
            {item.food.name}
          </Text>
          <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mt-0.5">
            {item.quantity} × {item.serving_size}g = {totalGrams.toFixed(0)}g
          </Text>
        </View>

        {/* Calories (prominent) */}
        <View className="items-end">
          <Text style={{ color: colors.primary }} className="text-lg font-bold">
            {item.nutrition.calories.toFixed(0)}
          </Text>
          <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
            kkal
          </Text>
        </View>

        {/* Expand indicator */}
        <MaterialIcons
          name={expanded ? 'expand-less' : 'expand-more'}
          size={24}
          color={colors.onSurfaceVariant}
          style={{ marginLeft: 8 }}
        />
      </View>

      {/* Expanded nutrition details */}
      {expanded && (
        <View
          className="mt-4 pt-4"
          style={{ borderTopWidth: 1, borderTopColor: colors.outline + '30' }}
        >
          <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium mb-3">
            Detail Nutrisi
          </Text>
          <View className="flex-row flex-wrap">
            {/* Protein */}
            <View className="w-1/3 items-center mb-3">
              <Text style={{ color: colors.onSurface }} className="text-base font-bold">
                {item.nutrition.protein.toFixed(1)}
              </Text>
              <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
                Protein (g)
              </Text>
            </View>

            {/* Fat */}
            <View className="w-1/3 items-center mb-3">
              <Text style={{ color: colors.onSurface }} className="text-base font-bold">
                {item.nutrition.fat.toFixed(1)}
              </Text>
              <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
                Lemak (g)
              </Text>
            </View>

            {/* Carbohydrate */}
            <View className="w-1/3 items-center mb-3">
              <Text style={{ color: colors.onSurface }} className="text-base font-bold">
                {item.nutrition.carbohydrate.toFixed(1)}
              </Text>
              <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
                Karbo (g)
              </Text>
            </View>

            {/* Fiber (optional) */}
            {item.nutrition.fiber !== undefined && (
              <View className="w-1/3 items-center">
                <Text style={{ color: colors.onSurface }} className="text-base font-bold">
                  {item.nutrition.fiber.toFixed(1)}
                </Text>
                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
                  Serat (g)
                </Text>
              </View>
            )}

            {/* Sugar (optional) */}
            {item.nutrition.sugar !== undefined && (
              <View className="w-1/3 items-center">
                <Text style={{ color: colors.onSurface }} className="text-base font-bold">
                  {item.nutrition.sugar.toFixed(1)}
                </Text>
                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
                  Gula (g)
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default FoodLogItemCard;
