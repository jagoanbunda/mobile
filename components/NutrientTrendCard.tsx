import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { TrendDirection } from '@/types/dashboard';

interface NutrientTrendCardProps {
    label: string;
    value: number;
    unit: string;
    trend: TrendDirection;
    icon: keyof typeof MaterialIcons.glyphMap;
    color: string;
}

const trendConfig = {
    up: { arrow: 'trending-up', color: 'primary' },    // Green = positive
    down: { arrow: 'trending-down', color: 'error' },  // Red = needs attention
    stable: { arrow: 'trending-flat', color: 'tertiary' },
} as const;

export function NutrientTrendCard({ label, value, unit, trend, icon, color }: NutrientTrendCardProps) {
    const { colors } = useTheme();
    const trendInfo = trendConfig[trend];
    
    return (
        <View style={[styles.card, { backgroundColor: colors.surfaceContainerHigh }]}>
            <MaterialIcons name={icon} size={24} color={color} />
            <Text style={[styles.value, { color: colors.onSurface }]}>
                {value.toLocaleString()}
            </Text>
            <Text style={[styles.unit, { color: colors.onSurface }]}>{unit}</Text>
            <View style={styles.trendRow}>
                <MaterialIcons 
                    name={trendInfo.arrow as any} 
                    size={16} 
                    color={colors[trendInfo.color]} 
                />
                <Text style={[styles.label, { color: colors.onSurface }]}>{label}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    value: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 4,
    },
    unit: {
        fontSize: 12,
        opacity: 0.7,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
    },
});

export default NutrientTrendCard;
