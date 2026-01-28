import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

/**
 * Animated skeleton placeholder
 */
export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
    const { colors } = useTheme();
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                {
                    width: typeof width === 'number' ? width : undefined,
                    height,
                    borderRadius,
                    backgroundColor: colors.surfaceContainerHighest,
                    opacity,
                },
                typeof width === 'string' && styles.fullWidth,
                style,
            ]}
        />
    );
}

/**
 * Skeleton for a card item
 */
export function CardSkeleton() {
    const { colors } = useTheme();

    return (
        <View 
            style={{ backgroundColor: colors.surfaceContainerHigh }} 
            className="rounded-xl p-4"
        >
            <View className="flex-row items-center gap-3 mb-4">
                <Skeleton width={48} height={48} borderRadius={24} />
                <View className="flex-1 gap-2">
                    <Skeleton width="60%" height={18} />
                    <Skeleton width="40%" height={14} />
                </View>
            </View>
            <Skeleton width="100%" height={12} style={{ marginBottom: 8 }} />
            <Skeleton width="80%" height={12} />
        </View>
    );
}

/**
 * Skeleton for a list item
 */
export function ListItemSkeleton() {
    const { colors } = useTheme();

    return (
        <View 
            style={{ backgroundColor: colors.surfaceContainerHigh }} 
            className="rounded-xl p-4 flex-row items-center gap-3"
        >
            <Skeleton width={40} height={40} borderRadius={20} />
            <View className="flex-1 gap-2">
                <Skeleton width="70%" height={16} />
                <Skeleton width="50%" height={12} />
            </View>
            <Skeleton width={60} height={24} borderRadius={12} />
        </View>
    );
}

/**
 * Skeleton for a chart/graph
 */
export function ChartSkeleton() {
    const { colors } = useTheme();

    return (
        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-4">
                <Skeleton width="40%" height={20} />
                <Skeleton width={80} height={28} borderRadius={14} />
            </View>
            <Skeleton width="100%" height={180} borderRadius={12} />
        </View>
    );
}

/**
 * Skeleton for a stat card
 */
export function StatCardSkeleton() {
    const { colors } = useTheme();

    return (
        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-xl p-4 flex-1">
            <View className="flex-row items-center gap-2 mb-3">
                <Skeleton width={20} height={20} borderRadius={10} />
                <Skeleton width="60%" height={12} />
            </View>
            <Skeleton width="50%" height={28} style={{ marginBottom: 4 }} />
            <Skeleton width="80%" height={12} />
        </View>
    );
}

/**
 * Skeleton for a profile header
 */
export function ProfileHeaderSkeleton() {
    const { colors } = useTheme();

    return (
        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-xl p-4">
            <View className="flex-row items-center gap-4">
                <Skeleton width={64} height={64} borderRadius={32} />
                <View className="flex-1 gap-2">
                    <Skeleton width="50%" height={22} />
                    <Skeleton width="30%" height={16} />
                </View>
                <Skeleton width={80} height={28} borderRadius={14} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fullWidth: {
        width: '100%',
    },
});

export default Skeleton;
