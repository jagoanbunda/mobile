import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityRings } from '@/components/ActivityRings';
import { useTheme } from '@/context/ThemeContext';
import type { ProgressRingsData, ProgressRingData } from '@/types/dashboard';

export interface ProgressRingSectionProps {
    /** Nutrition progress data for 5 metrics */
    data: ProgressRingsData | null;
    /** Show skeleton loading state */
    isLoading?: boolean;
}

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
    miniStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
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
