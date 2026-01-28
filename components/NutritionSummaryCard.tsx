import React from 'react';
import { View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { NutritionSummaryResponse } from '@/types';

// Helper to format period label in Indonesian
const formatPeriodLabel = (period: string, startDate: string, endDate: string): string => {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    if (period === 'day') {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return `${days[start.getDay()]}, ${start.getDate()} ${months[start.getMonth()]}`;
    } else if (period === 'week') {
        return `${start.getDate()} - ${end.getDate()} ${months[end.getMonth()]}`;
    } else {
        return `${months[start.getMonth()]} ${start.getFullYear()}`;
    }
};

export interface NutritionSummaryCardProps {
    summary: NutritionSummaryResponse;
    showMealBreakdown?: boolean;
    compact?: boolean;
}

export function NutritionSummaryCard({ summary, showMealBreakdown = false, compact = false }: NutritionSummaryCardProps) {
    const { colors } = useTheme();

    const nutritionItems = [
        { label: 'Kalori', value: summary.totals.calories, unit: 'kkal', icon: 'local-fire-department' as const, color: '#EF4444' },
        { label: 'Protein', value: summary.totals.protein, unit: 'gr', icon: 'fitness-center' as const, color: '#3B82F6' },
        { label: 'Lemak', value: summary.totals.fat, unit: 'gr', icon: 'opacity' as const, color: '#F59E0B' },
        { label: 'Karbo', value: summary.totals.carbohydrate, unit: 'gr', icon: 'grain' as const, color: '#22C55E' },
    ];

    const mealTimeLabels: Record<string, { label: string; icon: keyof typeof MaterialIcons.glyphMap }> = {
        breakfast: { label: 'Sarapan', icon: 'wb-sunny' },
        lunch: { label: 'Makan Siang', icon: 'light-mode' },
        dinner: { label: 'Makan Malam', icon: 'nights-stay' },
        snack: { label: 'Camilan', icon: 'cookie' },
    };

    return (
        <View
            style={{ backgroundColor: colors.surfaceContainerHigh }}
            className={`rounded-2xl ${compact ? 'p-3' : 'p-4'}`}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
                <View>
                    <Text style={{ color: colors.onSurface }} className="font-bold text-base">
                        Ringkasan Nutrisi
                    </Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">
                        {formatPeriodLabel(summary.period, summary.start_date, summary.end_date)}
                    </Text>
                </View>
                <View
                    style={{ backgroundColor: colors.primaryContainer }}
                    className="px-3 py-1 rounded-full"
                >
                    <Text style={{ color: colors.onPrimaryContainer }} className="text-xs font-medium">
                        {summary.total_meals} makan
                    </Text>
                </View>
            </View>

            {/* Main Nutrition Grid */}
            <View className={`flex-row flex-wrap ${compact ? 'gap-2' : 'gap-3'}`}>
                {nutritionItems.map((item) => (
                    <View
                        key={item.label}
                        style={{ backgroundColor: item.color + '15' }}
                        className={`flex-1 min-w-[45%] items-center ${compact ? 'p-2' : 'p-3'} rounded-xl`}
                    >
                        <MaterialIcons name={item.icon} size={compact ? 18 : 22} color={item.color} />
                        <Text style={{ color: colors.onSurface }} className={`${compact ? 'text-lg' : 'text-xl'} font-bold mt-1`}>
                            {item.value.toFixed(item.label === 'Kalori' ? 0 : 1)}
                        </Text>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
                            {item.label} ({item.unit})
                        </Text>
                    </View>
                ))}
            </View>

            {/* Daily Average (for week/month periods) */}
            {summary.daily_average && (
                <View className="mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.outline + '30' }}>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium mb-2">
                        Rata-rata Harian
                    </Text>
                    <View className="flex-row justify-between">
                        <Text style={{ color: colors.onSurface }} className="text-xs">
                            {summary.daily_average.calories.toFixed(0)} kkal
                        </Text>
                        <Text style={{ color: colors.onSurface }} className="text-xs">
                            {summary.daily_average.protein.toFixed(1)}g protein
                        </Text>
                        <Text style={{ color: colors.onSurface }} className="text-xs">
                            {summary.daily_average.fat.toFixed(1)}g lemak
                        </Text>
                        <Text style={{ color: colors.onSurface }} className="text-xs">
                            {summary.daily_average.carbohydrate.toFixed(1)}g karbo
                        </Text>
                    </View>
                </View>
            )}

            {/* Meal Time Breakdown */}
            {showMealBreakdown && summary.by_meal_time && (
                <View className="mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.outline + '30' }}>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium mb-2">
                        Per Waktu Makan
                    </Text>
                    <View className="gap-2">
                        {(Object.entries(summary.by_meal_time) as [string, { count: number; calories: number }][])
                            .filter(([_, data]) => data && data.count > 0)
                            .map(([mealTime, data]) => (
                                <View key={mealTime} className="flex-row items-center justify-between">
                                    <View className="flex-row items-center gap-2">
                                        <MaterialIcons
                                            name={mealTimeLabels[mealTime]?.icon || 'restaurant'}
                                            size={14}
                                            color={colors.onSurfaceVariant}
                                        />
                                        <Text style={{ color: colors.onSurface }} className="text-xs">
                                            {mealTimeLabels[mealTime]?.label || mealTime}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center gap-3">
                                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">
                                            {data.count}x
                                        </Text>
                                        <Text style={{ color: colors.primary }} className="text-xs font-medium">
                                            {data.calories.toFixed(0)} kkal
                                        </Text>
                                    </View>
                                </View>
                            ))}
                    </View>
                </View>
            )}
        </View>
    );
}

export default NutritionSummaryCard;
