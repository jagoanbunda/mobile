import React from 'react';
import { View, Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { WeeklyTrend } from '@/components/WeeklyTrend';

// Mock ThemeContext
jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        colors: {
            primary: '#416936',
            onSurface: '#1A1C19',
            onSurfaceVariant: '#44483E',
            surfaceContainerHigh: '#ECEFE5',
            error: '#BA1A1A',
        },
    }),
}));

// Mock useNutritionTrends hook
const mockGetNutritionTrends = jest.fn();
jest.mock('@/services/hooks/use-nutrition-trends', () => ({
    useNutritionTrends: (childId: number) => mockGetNutritionTrends(childId),
}));

// Mock NutrientTrendCard to simplify testing content
jest.mock('@/components/NutrientTrendCard', () => {
    const { View, Text } = require('react-native');
    return {
        NutrientTrendCard: ({ label, value, unit, trend }: any) => (
            <View 
                testID={`card-${label}`}
                // @ts-ignore
                label={label}
            >
                <Text>{label}: {value} {unit} ({trend})</Text>
            </View>
        ),
    };
});

describe('WeeklyTrend', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state correctly', () => {
        mockGetNutritionTrends.mockReturnValue({
            isLoading: true,
            data: null,
            error: null,
        });

        render(<WeeklyTrend childId={1} />);
        expect(screen.getByText('Tren Mingguan')).toBeTruthy();
        // ActivityIndicator is hard to find by text, usually check for existence or absence of content
    });

    it('renders error state correctly', () => {
        mockGetNutritionTrends.mockReturnValue({
            isLoading: false,
            data: null,
            error: new Error('Failed to fetch'),
        });

        render(<WeeklyTrend childId={1} />);
        expect(screen.getByText('Gagal memuat data')).toBeTruthy();
    });

    it('renders three nutrient trend cards with correct data', () => {
        mockGetNutritionTrends.mockReturnValue({
            isLoading: false,
            data: {
                data: {
                    weekly: {
                        calories: { average: 1500, trend_direction: 'up', weeks: [] },
                        protein: { average: 45, trend_direction: 'stable', weeks: [] },
                        carbohydrate: { average: 200, trend_direction: 'down', weeks: [] },
                        fat: { average: 50, trend_direction: 'stable', weeks: [] },
                    }
                }
            },
            error: null,
        });

        render(<WeeklyTrend childId={1} />);

        // Check for labels (using the mock text)
        expect(screen.getByText('Kalori: 1500 kcal (up)')).toBeTruthy();
        expect(screen.getByText('Protein: 45 g (stable)')).toBeTruthy();
        expect(screen.getByText('Karbohidrat: 200 g (down)')).toBeTruthy();
    });

    it('handles rounding of values correctly', () => {
        mockGetNutritionTrends.mockReturnValue({
            isLoading: false,
            data: {
                data: {
                    weekly: {
                        calories: { average: 1500.6, trend_direction: 'up', weeks: [] },
                        protein: { average: 45.2, trend_direction: 'stable', weeks: [] },
                        carbohydrate: { average: 200.9, trend_direction: 'down', weeks: [] },
                        fat: { average: 50, trend_direction: 'stable', weeks: [] },
                    }
                }
            },
            error: null,
        });

        render(<WeeklyTrend childId={1} />);

        // 1500.6 -> 1501
        expect(screen.getByText(/Kalori: 1501/)).toBeTruthy();
        // 45.2 -> 45
        expect(screen.getByText(/Protein: 45/)).toBeTruthy();
        // 200.9 -> 201
        expect(screen.getByText(/Karbohidrat: 201/)).toBeTruthy();
    });
});
