import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface QuickActionsProps {
    isPmtEnrolled?: boolean;
}

type ActionItem = {
    id: string;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    route: '/input' | '/progress' | '/pmt';
};

const springConfig = { damping: 15, stiffness: 150 };

interface ActionButtonProps {
    action: ActionItem;
    colors: ReturnType<typeof useTheme>['colors'];
    onPress: (route: ActionItem['route']) => void;
}

function ActionButton({ action, colors, onPress }: ActionButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            onPress={() => onPress(action.route)}
            onPressIn={() => { scale.value = withSpring(0.95, springConfig); }}
            onPressOut={() => { scale.value = withSpring(1, springConfig); }}
            style={[
                styles.button,
                {
                    backgroundColor: colors.surfaceContainerLow,
                    shadowColor: colors.shadow,
                },
                animatedStyle,
            ]}
        >
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: colors.primaryContainer },
                ]}
            >
                <MaterialIcons
                    name={action.icon}
                    size={24}
                    color={colors.primary}
                />
            </View>
            <Text
                style={[styles.label, { color: colors.onSurfaceVariant }]}
                numberOfLines={1}
            >
                {action.label}
            </Text>
        </AnimatedPressable>
    );
}

export function QuickActions({ isPmtEnrolled = false }: QuickActionsProps) {
    const { colors } = useTheme();
    const router = useRouter();

    const actions: ActionItem[] = [
        { id: 'log-meal', label: 'Catat Makan', icon: 'restaurant', route: '/input' },
        { id: 'view-logs', label: 'Lihat Riwayat', icon: 'history', route: '/progress' },
    ];

    if (isPmtEnrolled) {
        actions.push({ id: 'log-pmt', label: 'Catat PMT', icon: 'local-dining', route: '/pmt' });
    }

    const handlePress = (route: ActionItem['route']) => {
        router.push(route);
    };

    return (
        <View style={styles.container}>
            {actions.map((action) => (
                <ActionButton
                    key={action.id}
                    action={action}
                    colors={colors}
                    onPress={handlePress}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 12,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default QuickActions;
