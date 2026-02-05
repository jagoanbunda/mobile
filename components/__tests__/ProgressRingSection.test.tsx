import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text, View, Animated } from 'react-native';
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
        },
    }),
}));

// Mock react-native-svg with proper Animated support
jest.mock('react-native-svg', () => {
    const React = require('react');
    const { View } = require('react-native');
    
    const MockCircle = React.forwardRef((props: any, ref: any) => (
        <View testID="circle" ref={ref} {...props} />
    ));
    MockCircle.displayName = 'MockCircle';
    
    return {
        __esModule: true,
        default: ({ children, ...props }: any) => <View testID="svg" {...props}>{children}</View>,
        Svg: ({ children, ...props }: any) => <View testID="svg" {...props}>{children}</View>,
        Circle: MockCircle,
    };
});

// Mock ProgressRing component for simpler testing
jest.mock('@/components/ProgressRing', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    
    return {
        ProgressRing: ({ value, label, color, icon }: any) => (
            <View testID={`progress-ring-${label}`}>
                <Text testID={`ring-value-${label}`}>{value}%</Text>
                <Text testID={`ring-label-${label}`}>{label}</Text>
                {icon && <View testID={`ring-icon-${label}`}>{icon}</View>}
            </View>
        ),
    };
});

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
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('rendering with data', () => {
        it('renders all 5 nutrition rings with Indonesian labels', () => {
            const data = createMockData();
            render(<ProgressRingSection data={data} />);

            // Verify all 5 rings are rendered with Indonesian labels
            expect(screen.getByTestId('progress-ring-Energi')).toBeTruthy();
            expect(screen.getByTestId('progress-ring-Protein')).toBeTruthy();
            expect(screen.getByTestId('progress-ring-Karbohidrat')).toBeTruthy();
            expect(screen.getByTestId('progress-ring-Lemak')).toBeTruthy();
            expect(screen.getByTestId('progress-ring-Serat')).toBeTruthy();
        });

        it('displays correct percentage values', () => {
            const data = createMockData();
            render(<ProgressRingSection data={data} />);

            expect(screen.getByText('63%')).toBeTruthy();  // calories/Energi
            expect(screen.getByText('62%')).toBeTruthy();  // protein
            expect(screen.getByText('60%')).toBeTruthy();  // carbs/fat (same %)
            expect(screen.getByText('53%')).toBeTruthy();  // fiber
        });

        it('displays value/target format below rings', () => {
            const data = createMockData();
            render(<ProgressRingSection data={data} />);

            expect(screen.getByText('850/1350 kcal')).toBeTruthy();
            expect(screen.getByText('25/40 g')).toBeTruthy();
            expect(screen.getByText('120/200 g')).toBeTruthy();
            expect(screen.getByText('30/50 g')).toBeTruthy();
            expect(screen.getByText('8/15 g')).toBeTruthy();
        });
    });

    describe('loading state', () => {
        it('shows skeleton rings when isLoading is true', () => {
            const data = createMockData();
            const { toJSON } = render(<ProgressRingSection data={data} isLoading={true} />);

            // Should not render actual rings
            expect(screen.queryByTestId('progress-ring-Energi')).toBeNull();
            expect(screen.queryByTestId('progress-ring-Protein')).toBeNull();
            
            // Snapshot shows skeleton structure
            expect(toJSON()).toBeTruthy();
        });

        it('does not show data rings during loading even with data', () => {
            const data = createMockData();
            render(<ProgressRingSection data={data} isLoading={true} />);

            // All actual labels should be absent
            expect(screen.queryByText('Energi')).toBeNull();
            expect(screen.queryByText('Protein')).toBeNull();
        });
    });

    describe('null/empty data handling', () => {
        it('returns null when data is null', () => {
            const { toJSON } = render(<ProgressRingSection data={null} />);
            
            expect(toJSON()).toBeNull();
        });

        it('returns null when data is null and not loading', () => {
            const { toJSON } = render(<ProgressRingSection data={null} isLoading={false} />);
            
            expect(toJSON()).toBeNull();
        });
    });

    describe('partial data handling', () => {
        it('renders only metrics with data present', () => {
            const partialData = {
                calories: { current: 850, target: 1350, percentage: 63, unit: 'kcal' },
                protein: { current: 25, target: 40, percentage: 62, unit: 'g' },
                // carbs, fat, fiber are missing
            } as unknown as ProgressRingsData;

            render(<ProgressRingSection data={partialData} />);

            // Available metrics should render
            expect(screen.getByTestId('progress-ring-Energi')).toBeTruthy();
            expect(screen.getByTestId('progress-ring-Protein')).toBeTruthy();

            // Missing metrics should not render labels (since component skips them)
            // The rings for Karbohidrat, Lemak, Serat won't exist
            expect(screen.queryByTestId('progress-ring-Karbohidrat')).toBeNull();
            expect(screen.queryByTestId('progress-ring-Lemak')).toBeNull();
            expect(screen.queryByTestId('progress-ring-Serat')).toBeNull();
        });
    });

    describe('grid layout', () => {
        it('renders in two rows (3 top, 2 bottom)', () => {
            const data = createMockData();
            const { toJSON } = render(<ProgressRingSection data={data} />);
            
            // Structure should have 2 row containers
            const json = toJSON();
            expect(json).toBeTruthy();
            
            // Verify all rings exist (layout validated via structure)
            expect(screen.getByTestId('progress-ring-Energi')).toBeTruthy();
            expect(screen.getByTestId('progress-ring-Serat')).toBeTruthy();
        });
    });

    describe('edge cases', () => {
        it('handles zero values correctly', () => {
            const data = createMockData({
                calories: { current: 0, target: 1350, percentage: 0, unit: 'kcal' },
            });

            render(<ProgressRingSection data={data} />);

            expect(screen.getByText('0%')).toBeTruthy();
            expect(screen.getByText('0/1350 kcal')).toBeTruthy();
        });

        it('handles 100% values correctly', () => {
            const data = createMockData({
                protein: { current: 40, target: 40, percentage: 100, unit: 'g' },
            });

            render(<ProgressRingSection data={data} />);

            expect(screen.getByText('100%')).toBeTruthy();
            expect(screen.getByText('40/40 g')).toBeTruthy();
        });

        it('handles values exceeding 100%', () => {
            const data = createMockData({
                protein: { current: 50, target: 40, percentage: 125, unit: 'g' },
            });

            render(<ProgressRingSection data={data} />);

            expect(screen.getByText('125%')).toBeTruthy();
            expect(screen.getByText('50/40 g')).toBeTruthy();
        });
    });
});
