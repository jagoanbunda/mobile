import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// MUST use exact same spring config as QuickActions
const springConfig = { damping: 15, stiffness: 150 };

export interface PillButtonProps {
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
}

export function PillButton({ label, icon, onPress, variant = 'primary' }: PillButtonProps) {
    const { colors } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const isPrimary = variant === 'primary';

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={() => { scale.value = withSpring(0.95, springConfig); }}
            onPressOut={() => { scale.value = withSpring(1, springConfig); }}
            style={[
                styles.button,
                {
                    backgroundColor: isPrimary ? colors.primaryContainer : colors.surfaceContainerLow,
                },
                animatedStyle,
            ]}
        >
            <MaterialIcons
                name={icon}
                size={18}
                color={isPrimary ? colors.primary : colors.onSurfaceVariant}
            />
            <Text
                style={[
                    styles.label,
                    { color: isPrimary ? colors.primary : colors.onSurfaceVariant },
                ]}
            >
                {label}
            </Text>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20, // Pill shape
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default PillButton;
