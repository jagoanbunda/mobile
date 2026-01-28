import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { Food } from '@/types';
import { getCategoryIcon, getCategoryColor, asIconName } from '@/utils/food-category-helpers';

export interface SystemFoodCardProps {
  food: Food;
  onSelect: (food: Food) => void;
  showExpandedDetails?: boolean;
}

export function SystemFoodCard({ food, onSelect, showExpandedDetails = true }: SystemFoodCardProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const categoryIcon = getCategoryIcon(food.category);
  const categoryColor = getCategoryColor(food.category);

  const handlePress = () => {
    onSelect(food);
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View
      style={{ backgroundColor: colors.surfaceContainerHigh }}
      className="rounded-2xl mb-3 overflow-hidden"
    >
      {/* Main content - tappable */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className="p-4"
        accessibilityLabel={`${food.name}, ${food.nutrition.calories} kalori per ${food.serving_size} gram`}
        accessibilityHint="Ketuk untuk memilih makanan ini"
      >
        <View className="flex-row items-center">
          {/* Category icon with colored background */}
          <View
            style={{ backgroundColor: categoryColor + '20' }}
            className="w-12 h-12 rounded-xl items-center justify-center mr-3"
          >
            <MaterialIcons name={asIconName(categoryIcon)} size={24} color={categoryColor} />
          </View>

          {/* Food info */}
          <View className="flex-1">
            {/* Name and badge row */}
            <View className="flex-row items-center gap-2">
              <Text
                style={{ color: colors.onSurface }}
                className="font-semibold text-base flex-1"
                numberOfLines={1}
              >
                {food.name}
              </Text>
              {/* System/Custom badge */}
              <View
                style={{
                  backgroundColor: food.is_system ? colors.primaryContainer : colors.tertiaryContainer,
                }}
                className="px-2 py-0.5 rounded-full"
              >
                <Text
                  style={{
                    color: food.is_system ? colors.onPrimaryContainer : colors.onTertiaryContainer,
                  }}
                  className="text-[10px] font-medium"
                >
                  {food.is_system ? 'Sistem' : 'Custom'}
                </Text>
              </View>
            </View>

            {/* Serving size */}
            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mt-0.5">
              {food.serving_size}g per porsi • {food.category}
            </Text>

            {/* Compact macro display (P/L/K) */}
            <View className="flex-row items-center gap-3 mt-2">
              <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">
                <Text style={{ color: colors.primary }} className="font-medium">
                  {food.nutrition.protein.toFixed(0)}
                </Text>
                g P
              </Text>
              <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">
                <Text style={{ color: colors.onSurface }} className="font-medium">
                  {food.nutrition.fat.toFixed(0)}
                </Text>
                g L
              </Text>
              <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">
                <Text style={{ color: colors.onSurface }} className="font-medium">
                  {food.nutrition.carbohydrate.toFixed(0)}
                </Text>
                g K
              </Text>
            </View>
          </View>

          {/* Calories - prominent */}
          <View className="items-end ml-3">
            <Text style={{ color: colors.primary }} className="text-2xl font-bold">
              {food.nutrition.calories.toFixed(0)}
            </Text>
            <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
              kkal
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Expandable details toggle */}
      {showExpandedDetails && (
        <>
          <TouchableOpacity
            onPress={handleExpand}
            className="flex-row items-center justify-center py-2"
            style={{ borderTopWidth: 1, borderTopColor: colors.outline + '20' }}
            accessibilityLabel={expanded ? 'Sembunyikan detail nutrisi' : 'Tampilkan detail nutrisi'}
          >
            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mr-1">
              {expanded ? 'Sembunyikan detail' : 'Lihat detail nutrisi'}
            </Text>
            <MaterialIcons
              name={expanded ? 'expand-less' : 'expand-more'}
              size={18}
              color={colors.onSurfaceVariant}
            />
          </TouchableOpacity>

          {/* Expanded nutrition details */}
          {expanded && (
            <View
              className="px-4 pb-4"
              accessibilityLabel="Detail nutrisi lengkap"
            >
              <View className="flex-row flex-wrap">
                {/* Calories */}
                <View className="w-1/3 items-center mb-3">
                  <MaterialIcons name="local-fire-department" size={18} color="#EF4444" />
                  <Text style={{ color: colors.onSurface }} className="text-base font-bold mt-1">
                    {food.nutrition.calories.toFixed(0)}
                  </Text>
                  <Text
                    style={{ color: colors.onSurfaceVariant }}
                    className="text-[10px]"
                    accessibilityLabel={`Kalori: ${food.nutrition.calories.toFixed(0)} kilokalori`}
                  >
                    Kalori
                  </Text>
                </View>

                {/* Protein */}
                <View className="w-1/3 items-center mb-3">
                  <MaterialIcons name="fitness-center" size={18} color="#3B82F6" />
                  <Text style={{ color: colors.onSurface }} className="text-base font-bold mt-1">
                    {food.nutrition.protein.toFixed(1)}
                  </Text>
                  <Text
                    style={{ color: colors.onSurfaceVariant }}
                    className="text-[10px]"
                    accessibilityLabel={`Protein: ${food.nutrition.protein.toFixed(1)} gram`}
                  >
                    Protein (g)
                  </Text>
                </View>

                {/* Fat */}
                <View className="w-1/3 items-center mb-3">
                  <MaterialIcons name="opacity" size={18} color="#F59E0B" />
                  <Text style={{ color: colors.onSurface }} className="text-base font-bold mt-1">
                    {food.nutrition.fat.toFixed(1)}
                  </Text>
                  <Text
                    style={{ color: colors.onSurfaceVariant }}
                    className="text-[10px]"
                    accessibilityLabel={`Lemak: ${food.nutrition.fat.toFixed(1)} gram`}
                  >
                    Lemak (g)
                  </Text>
                </View>

                {/* Carbohydrate */}
                <View className="w-1/3 items-center">
                  <MaterialIcons name="grain" size={18} color="#22C55E" />
                  <Text style={{ color: colors.onSurface }} className="text-base font-bold mt-1">
                    {food.nutrition.carbohydrate.toFixed(1)}
                  </Text>
                  <Text
                    style={{ color: colors.onSurfaceVariant }}
                    className="text-[10px]"
                    accessibilityLabel={`Karbohidrat: ${food.nutrition.carbohydrate.toFixed(1)} gram`}
                  >
                    Karbo (g)
                  </Text>
                </View>

                {/* Fiber (if available) */}
                {food.nutrition.fiber !== undefined && (
                  <View className="w-1/3 items-center">
                    <MaterialIcons name="eco" size={18} color="#84CC16" />
                    <Text style={{ color: colors.onSurface }} className="text-base font-bold mt-1">
                      {food.nutrition.fiber.toFixed(1)}
                    </Text>
                    <Text
                      style={{ color: colors.onSurfaceVariant }}
                      className="text-[10px]"
                      accessibilityLabel={`Serat: ${food.nutrition.fiber.toFixed(1)} gram`}
                    >
                      Serat (g)
                    </Text>
                  </View>
                )}

                {/* Sugar (if available) */}
                {food.nutrition.sugar !== undefined && (
                  <View className="w-1/3 items-center">
                    <MaterialIcons name="cookie" size={18} color="#EC4899" />
                    <Text style={{ color: colors.onSurface }} className="text-base font-bold mt-1">
                      {food.nutrition.sugar.toFixed(1)}
                    </Text>
                    <Text
                      style={{ color: colors.onSurfaceVariant }}
                      className="text-[10px]"
                      accessibilityLabel={`Gula: ${food.nutrition.sugar.toFixed(1)} gram`}
                    >
                      Gula (g)
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

export default SystemFoodCard;
