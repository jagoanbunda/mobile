import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressRing } from '@/components/ProgressRing';
import { useTheme } from '@/context/ThemeContext';
import type { ProgressRingsData, ProgressRingData } from '@/types/dashboard';

export interface ProgressRingSectionProps {
    /** Nutrition progress data for 5 metrics */
    data: ProgressRingsData | null;
    /** Show skeleton loading state */
    isLoading?: boolean;
}

type MetricKey = keyof ProgressRingsData;

interface MetricConfig {
    key: MetricKey;
    label: string;
    icon: string;
    color: string;
}

/**
 * Metric configuration with Indonesian labels
 * Grid layout: 3 top row, 2 bottom row
 */
const metricsConfig: MetricConfig[] = [
    { key: 'calories', label: 'Energi', icon: '🔥', color: '#FF5722' },
    { key: 'protein', label: 'Protein', icon: '🥩', color: '#8BC34A' },
    { key: 'carbs', label: 'Karbohidrat', icon: '🍞', color: '#FFC107' },
    { key: 'fat', label: 'Lemak', icon: '🥑', color: '#FF9800' },
    { key: 'fiber', label: 'Serat', icon: '🥬', color: '#4CAF50' },
];

const RING_SIZE = 60;
const STROKE_WIDTH = 6;

/**
 * Skeleton placeholder ring for loading state
 */
function SkeletonRing() {
    const { colors } = useTheme();
    
    return (
        <View style={styles.metricItem}>
            <View 
                style={[
                    styles.skeletonRing, 
                    { 
                        width: RING_SIZE, 
                        height: RING_SIZE,
                        borderRadius: RING_SIZE / 2,
                        backgroundColor: colors.surfaceContainerHighest,
                    }
                ]} 
            />
            <View 
                style={[
                    styles.skeletonLabel,
                    { backgroundColor: colors.surfaceContainerHighest }
                ]} 
            />
            <View 
                style={[
                    styles.skeletonValue,
                    { backgroundColor: colors.surfaceContainerHighest }
                ]} 
            />
        </View>
    );
}

/**
 * Formats the value display below the ring
 * Example: "850/1350 kcal"
 */
function formatValueDisplay(ringData: ProgressRingData): string {
    const current = Math.round(ringData.current);
    const target = Math.round(ringData.target);
    return `${current}/${target} ${ringData.unit}`;
}

/**
 * ProgressRingSection - Grid of 5 nutrition metric rings
 * 
 * Displays calories, protein, carbs, fat, and fiber progress rings
 * in a 2-row grid layout (3 top, 2 bottom).
 * 
 * Features:
 * - Indonesian labels for all metrics
 * - Animated progress rings with icons
 * - Skeleton loading state
 * - Graceful handling of partial/null data
 */
export function ProgressRingSection({ data, isLoading }: ProgressRingSectionProps) {
    const { colors } = useTheme();

    // Show skeleton grid during loading
    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    {[1, 2, 3].map((i) => <SkeletonRing key={i} />)}
                </View>
                <View style={styles.row}>
                    {[4, 5].map((i) => <SkeletonRing key={i} />)}
                </View>
            </View>
        );
    }

    // No data - render nothing
    if (!data) {
        return null;
    }

    /**
     * Renders a single metric ring with icon, label, and value
     */
    const renderMetric = (metric: MetricConfig) => {
        const ringData = data[metric.key];
        
        // Skip metrics with missing data
        if (!ringData) {
            return null;
        }

        return (
            <View key={metric.key} style={styles.metricItem}>
                <ProgressRing
                    value={ringData.percentage}
                    size={RING_SIZE}
                    strokeWidth={STROKE_WIDTH}
                    color={metric.color}
                    label={metric.label}
                    icon={
                        <Text style={styles.iconText}>
                            {metric.icon}
                        </Text>
                    }
                />
                <Text 
                    style={[
                        styles.valueText,
                        { color: colors.onSurfaceVariant }
                    ]}
                >
                    {formatValueDisplay(ringData)}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Top row: Energi, Protein, Karbohidrat */}
            <View style={styles.row}>
                {metricsConfig.slice(0, 3).map(renderMetric)}
            </View>
            {/* Bottom row: Lemak, Serat */}
            <View style={styles.row}>
                {metricsConfig.slice(3, 5).map(renderMetric)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
    },
    metricItem: {
        alignItems: 'center',
        minWidth: 90,
    },
    iconText: {
        fontSize: 18,
    },
    valueText: {
        marginTop: 4,
        fontSize: 10,
        fontWeight: '500',
        textAlign: 'center',
    },
    skeletonRing: {
        opacity: 0.6,
    },
    skeletonLabel: {
        marginTop: 6,
        width: 50,
        height: 12,
        borderRadius: 4,
        opacity: 0.6,
    },
    skeletonValue: {
        marginTop: 4,
        width: 60,
        height: 10,
        borderRadius: 4,
        opacity: 0.4,
    },
});

export default ProgressRingSection;
