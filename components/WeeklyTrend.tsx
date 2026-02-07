import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useNutritionTrends } from '@/services/hooks/use-nutrition-trends';
import { NutrientTrendCard } from './NutrientTrendCard';

interface WeeklyTrendProps {
    childId: number;
}

/**
 * WeeklyTrend Component
 * 
 * Displays nutrient trend cards for Calories, Protein, and Carbohydrates.
 * Uses useNutritionTrends hook to fetch data.
 */
export function WeeklyTrend({ childId }: WeeklyTrendProps) {
    const { colors } = useTheme();
    const { data, isLoading, error } = useNutritionTrends(childId);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={[styles.title, { color: colors.onSurface }]}>Tren Mingguan</Text>
                <ActivityIndicator color={colors.primary} />
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={styles.container}>
                <Text style={[styles.title, { color: colors.onSurface }]}>Tren Mingguan</Text>
                <Text style={{ color: colors.error }}>Gagal memuat data</Text>
            </View>
        );
    }

    const { weekly } = data.data;

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.onSurface }]}>Tren Mingguan</Text>
            <View style={styles.cardsRow}>
                <NutrientTrendCard
                    label="Kalori"
                    value={Math.round(weekly.calories.average)}
                    unit="kcal"
                    trend={weekly.calories.trend_direction}
                    icon="local-fire-department"
                    color="#FF5722"
                />
                <NutrientTrendCard
                    label="Protein"
                    value={Math.round(weekly.protein.average)}
                    unit="g"
                    trend={weekly.protein.trend_direction}
                    icon="egg"
                    color="#8BC34A"
                />
                <NutrientTrendCard
                    label="Karbohidrat"
                    value={Math.round(weekly.carbohydrate.average)}
                    unit="g"
                    trend={weekly.carbohydrate.trend_direction}
                    icon="grain"
                    color="#FFC107"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    cardsRow: {
        flexDirection: 'row',
        gap: 8,
    },
});

export default WeeklyTrend;
