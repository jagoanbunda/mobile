import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TipsCarousel } from '@/components/TipsCarousel';
import type { PersonalizedTip } from '@/types/dashboard';

// Mock ThemeContext
jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        colors: {
            primary: '#416936',
            onSurface: '#1A1C19',
            onSurfaceVariant: '#44483E',
            surfaceContainerLowest: '#FFFFFF',
            surfaceContainerLow: '#F7FAEE',
            outlineVariant: '#C4C8BB',
        },
    }),
}));

describe('TipsCarousel', () => {
    // Test data
    const mockTips: PersonalizedTip[] = [
        {
            icon: '📝',
            message: 'Jangan lupa mencatat makanan anak hari ini',
            category: 'reminder',
        },
        {
            icon: '🥗',
            message: 'Asupan serat masih kurang, tambahkan sayur dan buah',
            category: 'nutrition',
        },
        {
            icon: '🧒',
            message: 'Saatnya melakukan screening perkembangan',
            category: 'development',
        },
    ];

    describe('rendering', () => {
        it('renders carousel with tips', () => {
            render(<TipsCarousel tips={mockTips} />);

            expect(screen.getByTestId('tips-carousel')).toBeTruthy();
        });

        it('displays Indonesian section title', () => {
            render(<TipsCarousel tips={mockTips} />);

            expect(screen.getByText('Tips untuk Anda')).toBeTruthy();
        });

        it('displays custom title when provided', () => {
            render(<TipsCarousel tips={mockTips} title="Tips Harian" />);

            expect(screen.getByText('Tips Harian')).toBeTruthy();
        });

        it('renders tip cards with emoji icons', () => {
            render(<TipsCarousel tips={mockTips} />);

            expect(screen.getByText('📝')).toBeTruthy();
            expect(screen.getByText('🥗')).toBeTruthy();
            expect(screen.getByText('🧒')).toBeTruthy();
        });

        it('renders tip messages', () => {
            render(<TipsCarousel tips={mockTips} />);

            expect(
                screen.getByText('Jangan lupa mencatat makanan anak hari ini')
            ).toBeTruthy();
            expect(
                screen.getByText('Asupan serat masih kurang, tambahkan sayur dan buah')
            ).toBeTruthy();
        });

        it('renders tip cards with category test IDs', () => {
            render(<TipsCarousel tips={mockTips} />);

            expect(screen.getByTestId('tip-card-reminder')).toBeTruthy();
            expect(screen.getByTestId('tip-card-nutrition')).toBeTruthy();
            expect(screen.getByTestId('tip-card-development')).toBeTruthy();
        });
    });

    describe('empty state', () => {
        it('renders empty state when no tips', () => {
            render(<TipsCarousel tips={[]} />);

            expect(screen.getByTestId('tips-carousel-empty')).toBeTruthy();
        });

        it('displays Indonesian empty message', () => {
            render(<TipsCarousel tips={[]} />);

            expect(screen.getByText('Tidak ada tips saat ini')).toBeTruthy();
        });

        it('still shows title in empty state', () => {
            render(<TipsCarousel tips={[]} />);

            expect(screen.getByText('Tips untuk Anda')).toBeTruthy();
        });
    });

    describe('pagination dots', () => {
        it('renders pagination dots for multiple tips', () => {
            render(<TipsCarousel tips={mockTips} />);

            expect(screen.getByTestId('pagination-dots')).toBeTruthy();
            expect(screen.getByTestId('dot-0')).toBeTruthy();
            expect(screen.getByTestId('dot-1')).toBeTruthy();
            expect(screen.getByTestId('dot-2')).toBeTruthy();
        });

        it('does not render pagination for single tip', () => {
            render(<TipsCarousel tips={[mockTips[0]]} />);

            expect(screen.queryByTestId('pagination-dots')).toBeNull();
        });

        it('does not render pagination in empty state', () => {
            render(<TipsCarousel tips={[]} />);

            expect(screen.queryByTestId('pagination-dots')).toBeNull();
        });
    });

    describe('scroll behavior', () => {
        it('renders horizontal FlatList', () => {
            render(<TipsCarousel tips={mockTips} />);

            // The carousel exists and can receive scroll events
            const carousel = screen.getByTestId('tips-carousel');
            expect(carousel).toBeTruthy();
        });
    });

    describe('category colors', () => {
        it('renders all category types correctly', () => {
            const allCategories: PersonalizedTip[] = [
                { icon: '📝', message: 'Reminder tip', category: 'reminder' },
                { icon: '🥗', message: 'Nutrition tip', category: 'nutrition' },
                { icon: '🧒', message: 'Development tip', category: 'development' },
                { icon: '❤️', message: 'Health tip', category: 'health' },
            ];

            render(<TipsCarousel tips={allCategories} />);

            expect(screen.getByTestId('tip-card-reminder')).toBeTruthy();
            expect(screen.getByTestId('tip-card-nutrition')).toBeTruthy();
            expect(screen.getByTestId('tip-card-development')).toBeTruthy();
            expect(screen.getByTestId('tip-card-health')).toBeTruthy();
        });
    });
});
