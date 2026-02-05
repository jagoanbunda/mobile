import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import type { WeeklyTrendData, WeeklyDataPoint, TrendDirection } from '@/types/dashboard';

interface WeeklyTrendProps {
    /** Weekly trend data with 4 weeks of data points */
    data: WeeklyTrendData;
    /** Indonesian title for the component */
    title?: string;
}

/** Trend configuration with arrow, color, and label */
const trendConfig: Record<TrendDirection, { arrow: string; color: string; label: string }> = {
    up: { arrow: '↑', color: '#4CAF50', label: 'Meningkat' },
    down: { arrow: '↓', color: '#F44336', label: 'Menurun' },
    stable: { arrow: '→', color: '#9E9E9E', label: 'Stabil' },
};

/**
 * Generate SVG path data for sparkline from weekly data points
 */
const generateSparklinePath = (values: number[], width: number, height: number): string => {
    if (values.length === 0) return '';
    if (values.length === 1) {
        // Single point - draw a horizontal line in the middle
        const y = height / 2;
        return `M0,${y} L${width},${y}`;
    }

    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1; // Avoid division by zero

    // Add padding to avoid clipping at edges
    const padding = 4;
    const effectiveWidth = width - padding * 2;
    const effectiveHeight = height - padding * 2;

    const points = values.map((val, i) => {
        const x = padding + (i / (values.length - 1)) * effectiveWidth;
        const y = padding + effectiveHeight - ((val - min) / range) * effectiveHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M${points.join(' L')}`;
};

/**
 * Calculate percentage change between first and last week
 */
const calculateChange = (weeks: WeeklyDataPoint[]): number => {
    if (weeks.length < 2) return 0;
    const first = weeks[0].average_calories;
    const last = weeks[weeks.length - 1].average_calories;
    if (first === 0) return last > 0 ? 100 : 0;
    return Math.round(((last - first) / first) * 100);
};

/**
 * WeeklyTrend Component
 * 
 * Mini sparkline chart showing weekly nutrition progress with trend indicator.
 * Displays 4 weeks of data as a clean sparkline with direction arrow and percentage change.
 */
export function WeeklyTrend({ data, title = 'Tren Mingguan' }: WeeklyTrendProps) {
    const { colors } = useTheme();

    const values = data.weeks.map((w) => w.average_calories);
    const percentChange = calculateChange(data.weeks);
    const trend = trendConfig[data.trend_direction];

    // Sparkline dimensions
    const sparklineWidth = 120;
    const sparklineHeight = 40;
    const pathData = generateSparklinePath(values, sparklineWidth, sparklineHeight);

    return (
        <View
            style={{ backgroundColor: colors.surfaceContainerHigh }}
            className="p-4 rounded-2xl"
        >
            {/* Title */}
            <Text
                style={{ color: colors.onSurface }}
                className="text-sm font-semibold mb-3"
            >
                {title}
            </Text>

            {/* Sparkline Chart */}
            <View className="items-center mb-3">
                <Svg
                    width={sparklineWidth}
                    height={sparklineHeight}
                    viewBox={`0 0 ${sparklineWidth} ${sparklineHeight}`}
                >
                    {pathData && (
                        <Path
                            d={pathData}
                            fill="none"
                            stroke={colors.primary}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}
                </Svg>
            </View>

            {/* Trend Indicator */}
            <View className="flex-row items-center justify-center gap-1">
                <Text
                    style={{ color: trend.color }}
                    className="text-lg font-bold"
                >
                    {trend.arrow}
                </Text>
                <Text
                    style={{ color: trend.color }}
                    className="text-sm font-semibold"
                >
                    {percentChange > 0 ? '+' : ''}{percentChange}%
                </Text>
                <Text
                    style={{ color: colors.onSurfaceVariant }}
                    className="text-sm ml-1"
                >
                    {trend.label}
                </Text>
            </View>
        </View>
    );
}

export default WeeklyTrend;
