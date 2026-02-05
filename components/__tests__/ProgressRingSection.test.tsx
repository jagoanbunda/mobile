import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { View } from 'react-native';
import { ProgressRingSection } from '@/components/ProgressRingSection';
import type { ProgressRingsData } from '@/types/dashboard';

// Mock ThemeContext
jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        colors: {
            primary: '#416936',
            onSurface: '#1A1C19',
            onSurfaceVariant: '#44483E',
            surfaceContainerHighest: '#E6E9DF',
            surfaceContainer: '#F2F6EC',
        },
    }),
}));

// Mock ActivityRings
jest.mock('@/components/ActivityRings', () => {
    const { View } = require('react-native');
    return {
        ActivityRings: () => <View testID="activity-rings" />,
    };
});

// Mock MaterialIcons
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

const createMockData = (overrides?: Partial<ProgressRingsData>): ProgressRingsData => ({
    calories: { current: 850, target: 1350, percentage: 63, unit: 'kcal' },
    protein: { current: 25, target: 40, percentage: 62, unit: 'g' },
    carbs: { current: 120, target: 200, percentage: 60, unit: 'g' },
    fat: { current: 30, target: 50, percentage: 60, unit: 'g' },
    fiber: { current: 8, target: 15, percentage: 53, unit: 'g' },
    ...overrides,
});

describe('ProgressRingSection', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('rendering with data', () => {
        it('renders activity rings and mini stats', () => {
            const data = createMockData();
            render(<ProgressRingSection data={data} />);

            // Verify ActivityRings component is present
            expect(screen.getByTestId('activity-rings')).toBeTruthy();
            
            // Verify Mini Stats labels
            expect(screen.getByText('Lemak')).toBeTruthy();
            expect(screen.getByText('Serat')).toBeTruthy();
        });

        it('displays correct values for fat and fiber', () => {
            const data = createMockData();
            render(<ProgressRingSection data={data} />);

            expect(screen.getByText('30/50 g')).toBeTruthy(); // Fat
            expect(screen.getByText('8/15 g')).toBeTruthy(); // Fiber
        });
    });

    describe('loading state', () => {
        it('shows skeleton layout when isLoading is true', () => {
            const data = createMockData();
            const { toJSON } = render(<ProgressRingSection data={data} isLoading={true} />);

            // Should not render actual content
            expect(screen.queryByTestId('activity-rings')).toBeNull();
            expect(screen.queryByText('Lemak')).toBeNull();
            
            // Snapshot shows skeleton structure (basic check)
            expect(toJSON()).toBeTruthy();
        });
    });

    describe('null/empty data handling', () => {
        it('returns null when data is null', () => {
            const { toJSON } = render(<ProgressRingSection data={null} />);
            expect(toJSON()).toBeNull();
        });
    });

    describe('partial data handling', () => {
        it('renders only available mini stats', () => {
             const partialData = {
                calories: { current: 850, target: 1350, percentage: 63, unit: 'kcal' },
                protein: { current: 25, target: 40, percentage: 62, unit: 'g' },
                carbs: { current: 120, target: 200, percentage: 60, unit: 'g' },
                // fat missing
                fiber: { current: 8, target: 15, percentage: 53, unit: 'g' },
            } as unknown as ProgressRingsData;

            render(<ProgressRingSection data={partialData} />);

            expect(screen.getByText('Serat')).toBeTruthy();
            expect(screen.queryByText('Lemak')).toBeNull();
        });
    });
});
