import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { FoodLog } from '@/types';

// Helper function to format date in Indonesian
const formatDateIndonesian = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00');
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${dayName}, ${day} ${month}`;
};

// Get icon for meal time
const getMealTimeIcon = (mealTime: string): keyof typeof MaterialIcons.glyphMap => {
    const icons: Record<string, keyof typeof MaterialIcons.glyphMap> = {
        breakfast: 'wb-sunny',
        lunch: 'light-mode',
        dinner: 'nights-stay',
        snack: 'cookie',
    };
    return icons[mealTime] || 'restaurant';
};

// Get color for meal time
const getMealTimeColor = (mealTime: string): string => {
    const colors: Record<string, string> = {
        breakfast: '#F59E0B', // amber
        lunch: '#22C55E', // green
        dinner: '#6366F1', // indigo
        snack: '#EC4899', // pink
    };
    return colors[mealTime] || '#6B7280';
};

export interface FoodLogCardProps {
    foodLog: FoodLog;
    onPress?: () => void;
}

export function FoodLogCard({ foodLog, onPress }: FoodLogCardProps) {
    const { colors } = useTheme();
    const mealColor = getMealTimeColor(foodLog.meal_time);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{ backgroundColor: colors.surfaceContainerHigh }}
            className="rounded-2xl p-4 mb-3"
        >
            {/* Header: Meal time + Date */}
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                    <View
                        style={{ backgroundColor: mealColor + '20' }}
                        className="w-10 h-10 rounded-xl items-center justify-center"
                    >
                        <MaterialIcons
                            name={getMealTimeIcon(foodLog.meal_time)}
                            size={22}
                            color={mealColor}
                        />
                    </View>
                    <View>
                        <Text style={{ color: colors.onSurface }} className="font-bold text-base">
                            {foodLog.meal_time_label}
                        </Text>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">
                            {formatDateIndonesian(foodLog.log_date)}
                        </Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-1">
                    <MaterialIcons name="restaurant-menu" size={14} color={colors.onSurfaceVariant} />
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">
                        {foodLog.items.length} item
                    </Text>
                </View>
            </View>

            {/* Nutrition Summary */}
            <View className="flex-row justify-between">
                <View className="flex-1 items-center">
                    <Text style={{ color: colors.primary }} className="text-lg font-bold">
                        {foodLog.totals.calories.toFixed(0)}
                    </Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
                        kkal
                    </Text>
                </View>
                <View className="flex-1 items-center">
                    <Text style={{ color: colors.onSurface }} className="text-lg font-bold">
                        {foodLog.totals.protein.toFixed(1)}
                    </Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
                        protein
                    </Text>
                </View>
                <View className="flex-1 items-center">
                    <Text style={{ color: colors.onSurface }} className="text-lg font-bold">
                        {foodLog.totals.fat.toFixed(1)}
                    </Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
                        lemak
                    </Text>
                </View>
                <View className="flex-1 items-center">
                    <Text style={{ color: colors.onSurface }} className="text-lg font-bold">
                        {foodLog.totals.carbohydrate.toFixed(1)}
                    </Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
                        karbo
                    </Text>
                </View>
            </View>

            {/* Notes preview (if exists) */}
            {foodLog.notes && (
                <View className="mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.outline + '30' }}>
                    <Text
                        style={{ color: colors.onSurfaceVariant }}
                        className="text-xs italic"
                        numberOfLines={1}
                    >
                        {foodLog.notes}
                    </Text>
                </View>
            )}

            {/* Arrow indicator */}
            {onPress && (
                <View className="absolute right-3 top-1/2" style={{ marginTop: -8 }}>
                    <MaterialIcons name="chevron-right" size={20} color={colors.onSurfaceVariant} />
                </View>
            )}
        </TouchableOpacity>
    );
}

export default FoodLogCard;
