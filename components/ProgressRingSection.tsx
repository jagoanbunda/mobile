import { ActivityRings } from '@/components/ActivityRings';
import { useTheme } from '@/context/ThemeContext';
import type { ProgressRingData, ProgressRingsData } from '@/types/dashboard';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PillButton } from './PillButton';

export interface ProgressRingSectionProps {
    /** Nutrition progress data for 5 metrics */
    data: ProgressRingsData | null;
    /** Show skeleton loading state */
    isLoading?: boolean;
}

const STAT_ITEMS = [
    { key: 'calories' as const, label: 'Kalori', color: '#FF5722' },
    { key: 'protein' as const, label: 'Protein', color: '#8BC34A' },
    { key: 'carbs' as const, label: 'Karbohidrat', color: '#FFC107' },
];

const BOTTOM_METRICS = [
    { key: 'fat' as const, label: 'Lemak', iconName: 'water-drop' as const, color: '#FF9800' },
    { key: 'fiber' as const, label: 'Serat', iconName: 'eco' as const, color: '#4CAF50' },
];

function formatValueDisplay(ringData: ProgressRingData): string {
    const current = Math.round(ringData.current);
    const target = Math.round(ringData.target);
    return `${current}/${target} ${ringData.unit}`;
}

function MiniStat({
    label,
    value,
    icon,
    color
}: {
    label: string;
    value: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    color: string;
}) {
    const { colors } = useTheme();

    return (
        <View style={[styles.miniStatCard, { backgroundColor: colors.surfaceContainer }]}>
            <View style={styles.miniStatHeader}>
                <MaterialIcons name={icon} size={20} color={color} />
                <Text style={[styles.miniStatLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
            </View>
            <Text style={[styles.miniStatValue, { color: colors.onSurface }]}>{value}</Text>
        </View>
    );
}

function SkeletonLayout() {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.ringsContainer}>
                {/* Placeholder for rings - just a large circle */}
                <View style={[styles.skeletonRing, { backgroundColor: colors.surfaceContainerHighest }]} />
            </View>
            <View style={styles.miniStatsRow}>
                <View style={[styles.skeletonCard, { backgroundColor: colors.surfaceContainerHighest }]} />
                <View style={[styles.skeletonCard, { backgroundColor: colors.surfaceContainerHighest }]} />
            </View>
        </View>
    );
}

export function ProgressRingSection({ data, isLoading }: ProgressRingSectionProps) {
    const { colors } = useTheme();
    const router = useRouter();

    if (isLoading) {
        return <SkeletonLayout />;
    }

    if (!data) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Top Section: Activity Rings */}
            <View style={styles.ringsContainer}>
                <ActivityRings data={data} />
            </View>

            {/* Stats Row - Calories, Protein, Carbs */}
            <View style={styles.statsRow} testID="stats-row">
                {STAT_ITEMS.map((item) => (
                    <View key={item.key} style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.onSurface }]}>
                            {Math.round(data[item.key].current)}/{Math.round(data[item.key].target)}
                        </Text>
                        <View style={styles.statLabelRow}>
                            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>{item.label}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Bottom Section: Mini Stats (Fat & Fiber) */}
            <View style={styles.miniStatsRow}>
                {BOTTOM_METRICS.map((metric) => {
                    const metricData = data[metric.key];
                    if (!metricData) return null;

                    return (
                        <MiniStat
                            key={metric.key}
                            label={metric.label}
                            value={formatValueDisplay(metricData)}
                            icon={metric.iconName}
                            color={metric.color}
                        />
                    );
                })}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
                <PillButton
                    label="Catat Makanan"
                    icon="restaurant"
                    onPress={() => router.push('/input')}
                    variant="primary"
                />
                <PillButton
                    label="Lihat Riwayat"
                    icon="history"
                    onPress={() => router.push('/food-logs')}
                    variant="secondary"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 24,
    },
    ringsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
        paddingHorizontal: 8,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    statLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    colorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    miniStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginTop: 16,
    },
    miniStatCard: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    miniStatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    miniStatLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    miniStatValue: {
        fontSize: 14,
        fontWeight: '600',
        paddingLeft: 28, // Align with text start (icon size + gap)
    },
    skeletonRing: {
        width: 180,
        height: 180,
        borderRadius: 90,
        opacity: 0.5,
    },
    skeletonCard: {
        flex: 1,
        height: 72,
        borderRadius: 12,
        opacity: 0.5,
    },
});

export default ProgressRingSection;
