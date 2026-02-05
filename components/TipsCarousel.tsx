import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import type { PersonalizedTip, TipCategory } from '@/types/dashboard';

/** Props for TipsCarousel component */
export interface TipsCarouselProps {
    /** Array of personalized tips to display */
    tips: PersonalizedTip[];
    /** Section title (Indonesian default) */
    title?: string;
}

/** Card dimensions */
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.75);
const CARD_GAP = 12;
const CARD_HEIGHT = 100;

/** Category accent colors for visual distinction */
const categoryColors: Record<TipCategory, string> = {
    reminder: '#2196F3',   // Blue
    nutrition: '#4CAF50',  // Green
    development: '#9C27B0', // Purple
    health: '#F44336',     // Red
};

/**
 * Single tip card with emoji icon and message
 */
function TipCard({
    tip,
}: {
    tip: PersonalizedTip;
}) {
    const { colors } = useTheme();
    const accentColor = categoryColors[tip.category];

    return (
        <View
            style={[
                styles.card,
                {
                    width: CARD_WIDTH,
                    backgroundColor: colors.surfaceContainerLowest,
                    borderLeftColor: accentColor,
                },
            ]}
            testID={`tip-card-${tip.category}`}
        >
            {/* Emoji Icon */}
            <Text style={styles.icon}>{tip.icon}</Text>

            {/* Tip Message */}
            <Text
                style={[styles.message, { color: colors.onSurface }]}
                numberOfLines={3}
                ellipsizeMode="tail"
            >
                {tip.message}
            </Text>
        </View>
    );
}

/**
 * Horizontal scrollable carousel of personalized tip cards.
 * Features snap-to-card scrolling and pagination dots.
 *
 * @example
 * ```tsx
 * <TipsCarousel
 *   tips={[
 *     { icon: '📝', message: 'Jangan lupa mencatat makanan anak hari ini', category: 'reminder' },
 *     { icon: '🥗', message: 'Asupan serat masih kurang', category: 'nutrition' },
 *   ]}
 * />
 * ```
 */
export function TipsCarousel({
    tips,
    title = 'Tips untuk Anda',
}: TipsCarouselProps) {
    const { colors } = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);

    // Track scroll position to update pagination dots
    const handleScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));
            setActiveIndex(Math.max(0, Math.min(index, tips.length - 1)));
        },
        [tips.length]
    );

    // Empty state
    if (tips.length === 0) {
        return (
            <View style={styles.container} testID="tips-carousel-empty">
                <Text style={[styles.title, { color: colors.onSurface }]}>
                    {title}
                </Text>
                <View
                    style={[
                        styles.emptyContainer,
                        { backgroundColor: colors.surfaceContainerLow },
                    ]}
                >
                    <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
                        Tidak ada tips saat ini
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container} testID="tips-carousel">
            {/* Section Title */}
            <Text style={[styles.title, { color: colors.onSurface }]}>
                {title}
            </Text>

            {/* Horizontal Carousel */}
            <FlatList
                data={tips}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + CARD_GAP}
                decelerationRate="fast"
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
                keyExtractor={(_, index) => `tip-${index}`}
                renderItem={({ item }) => <TipCard tip={item} />}
            />

            {/* Pagination Dots */}
            {tips.length > 1 && (
                <View style={styles.pagination} testID="pagination-dots">
                    {tips.map((_, index) => (
                        <View
                            key={index}
                            testID={`dot-${index}`}
                            style={[
                                styles.dot,
                                { backgroundColor: colors.outlineVariant },
                                index === activeIndex && [
                                    styles.dotActive,
                                    { backgroundColor: colors.primary },
                                ],
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    listContent: {
        paddingHorizontal: 16,
    },
    card: {
        height: CARD_HEIGHT,
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 4,
        // Subtle shadow for depth
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    icon: {
        fontSize: 24,
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 24,
        borderRadius: 4,
    },
    emptyContainer: {
        marginHorizontal: 16,
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default TipsCarousel;
