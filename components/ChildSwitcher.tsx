import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import type { ChildProfile } from '@/types/dashboard';

/** Props for ChildSwitcher component */
export interface ChildSwitcherProps {
    /** Array of child profiles to display */
    childProfiles: ChildProfile[];
    /** Currently active child ID */
    activeChildId: number;
    /** Callback when a child is selected */
    onChildSelect: (childId: number) => void;
    /** Show skeleton loading state */
    isLoading?: boolean;
}

/** Card dimensions */
const CARD_WIDTH = 120;
const CARD_GAP = 12;

/**
 * Format age in months to Indonesian text
 * @param months - Age in months
 * @returns Formatted age string in Indonesian
 */
const formatAge = (months: number): string => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0 && remainingMonths > 0) {
        return `${years} tahun ${remainingMonths} bulan`;
    }
    if (years > 0) return `${years} tahun`;
    return `${remainingMonths} bulan`;
};

/**
 * Skeleton placeholder card with animated pulse
 */
function SkeletonCard() {
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
                styles.card,
                {
                    width: CARD_WIDTH,
                    backgroundColor: colors.surfaceContainerHighest,
                    opacity,
                },
            ]}
        >
            {/* Avatar placeholder */}
            <View
                style={[
                    styles.skeletonAvatar,
                    { backgroundColor: colors.surfaceContainerHigh },
                ]}
            />
            {/* Name placeholder */}
            <View
                style={[
                    styles.skeletonName,
                    { backgroundColor: colors.surfaceContainerHigh },
                ]}
            />
            {/* Age placeholder */}
            <View
                style={[
                    styles.skeletonAge,
                    { backgroundColor: colors.surfaceContainerHigh },
                ]}
            />
        </Animated.View>
    );
}

/**
 * Child profile card with active state styling
 */
function ChildCard({
    child,
    isActive,
    onPress,
}: {
    child: ChildProfile;
    isActive: boolean;
    onPress: () => void;
}) {
    const { colors } = useTheme();
    const scaleAnim = useRef(new Animated.Value(isActive ? 1.05 : 1)).current;

    useEffect(() => {
        Animated.timing(scaleAnim, {
            toValue: isActive ? 1.05 : 1,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [isActive, scaleAnim]);

    return (
        <TouchableOpacity
            testID={`child-card-${child.id}`}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Animated.View
                style={[
                    styles.card,
                    {
                        width: CARD_WIDTH,
                        backgroundColor: isActive
                            ? colors.primaryContainer
                            : colors.surfaceContainerLowest,
                        transform: [{ scale: scaleAnim }],
                    },
                    isActive && {
                        borderWidth: 2,
                        borderColor: colors.primary,
                        elevation: 6,
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                    },
                ]}
            >
                {/* Avatar Circle */}
                <View
                    style={[
                        styles.avatar,
                        {
                            backgroundColor: isActive
                                ? colors.primary
                                : colors.surfaceContainerHigh,
                        },
                    ]}
                >
                    <MaterialIcons
                        name="child-care"
                        size={24}
                        color={isActive ? colors.onPrimary : colors.onSurfaceVariant}
                    />
                </View>

                {/* Child Name */}
                <Text
                    style={[
                        styles.name,
                        { color: colors.onSurface },
                        isActive && styles.nameActive,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {child.name}
                </Text>

                {/* Age Badge */}
                <View
                    style={[
                        styles.ageBadge,
                        {
                            backgroundColor: isActive
                                ? colors.primaryContainer
                                : colors.surfaceContainerHigh,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.ageText,
                            {
                                color: isActive
                                    ? colors.onPrimaryContainer
                                    : colors.onSurfaceVariant,
                            },
                        ]}
                        numberOfLines={1}
                    >
                        {formatAge(child.age_in_months)}
                    </Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}

/**
 * Horizontal scrollable child profile switcher.
 * Displays max 3 children with active highlight.
 * 
 * @example
 * ```tsx
 * <ChildSwitcher
 *   childProfiles={profiles}
 *   activeChildId={1}
 *   onChildSelect={(id) => setActiveChildId(id)}
 *   isLoading={false}
 * />
 * ```
 */
export function ChildSwitcher({
    childProfiles,
    activeChildId,
    onChildSelect,
    isLoading = false,
}: ChildSwitcherProps) {
    // Show max 3 children
    const displayedChildren = childProfiles.slice(0, 3);

    // Skeleton loading state
    if (isLoading) {
        return (
            <View style={styles.container} testID="child-switcher-loading">
                <View style={styles.skeletonRow}>
                    {[1, 2, 3].map((i) => (
                        <SkeletonCard key={i} />
                    ))}
                </View>
            </View>
        );
    }

    // Empty state
    if (displayedChildren.length === 0) {
        return null;
    }

    return (
        <View style={styles.container} testID="child-switcher">
            <FlatList
                data={displayedChildren}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
                renderItem={({ item }) => (
                    <ChildCard
                        child={item}
                        isActive={item.id === activeChildId}
                        onPress={() => onChildSelect(item.id)}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
    },
    listContent: {
        paddingHorizontal: 16,
    },
    skeletonRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: CARD_GAP,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 140,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    nameActive: {
        fontWeight: '700',
    },
    ageBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ageText: {
        fontSize: 10,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    skeletonAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: 12,
    },
    skeletonName: {
        width: 70,
        height: 14,
        borderRadius: 7,
        marginBottom: 8,
    },
    skeletonAge: {
        width: 60,
        height: 20,
        borderRadius: 10,
    },
});

export default ChildSwitcher;
