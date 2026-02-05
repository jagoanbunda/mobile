import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { WeeklyTrend } from '@/components/WeeklyTrend';
import type { WeeklyTrendData } from '@/types/dashboard';

// Mock ThemeContext
jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        colors: {
            primary: '#416936',
            onSurface: '#1A1C19',
            onSurfaceVariant: '#44483E',
            surfaceContainerHigh: '#ECEFE5',
        },
    }),
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => {
    const React = require('react');
    const { View } = require('react-native');

    return {
        __esModule: true,
        default: ({ children, ...props }: any) => (
            <View testID="svg" {...props}>{children}</View>
        ),
        Svg: ({ children, ...props }: any) => (
            <View testID="svg" {...props}>{children}</View>
        ),
        Path: (props: any) => <View testID="path" {...props} />,
    };
});

// Sample test data
const mockUpTrendData: WeeklyTrendData = {
    weeks: [
        { week_start: '2026-01-01', week_end: '2026-01-07', average_calories: 1200 },
        { week_start: '2026-01-08', week_end: '2026-01-14', average_calories: 1300 },
        { week_start: '2026-01-15', week_end: '2026-01-21', average_calories: 1350 },
        { week_start: '2026-01-22', week_end: '2026-01-28', average_calories: 1400 },
    ],
    trend_direction: 'up',
};

const mockDownTrendData: WeeklyTrendData = {
    weeks: [
        { week_start: '2026-01-01', week_end: '2026-01-07', average_calories: 1400 },
        { week_start: '2026-01-08', week_end: '2026-01-14', average_calories: 1350 },
        { week_start: '2026-01-15', week_end: '2026-01-21', average_calories: 1250 },
        { week_start: '2026-01-22', week_end: '2026-01-28', average_calories: 1200 },
    ],
    trend_direction: 'down',
};

const mockStableTrendData: WeeklyTrendData = {
    weeks: [
        { week_start: '2026-01-01', week_end: '2026-01-07', average_calories: 1300 },
        { week_start: '2026-01-08', week_end: '2026-01-14', average_calories: 1310 },
        { week_start: '2026-01-15', week_end: '2026-01-21', average_calories: 1295 },
        { week_start: '2026-01-22', week_end: '2026-01-28', average_calories: 1300 },
    ],
    trend_direction: 'stable',
};

describe('WeeklyTrend', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('rendering', () => {
        it('renders with default title', () => {
            render(<WeeklyTrend data={mockUpTrendData} />);

            expect(screen.getByText('Tren Mingguan')).toBeTruthy();
        });

        it('renders with custom title', () => {
            render(<WeeklyTrend data={mockUpTrendData} title="Nutrisi Minggu Ini" />);

            expect(screen.getByText('Nutrisi Minggu Ini')).toBeTruthy();
        });

        it('renders SVG sparkline', () => {
            render(<WeeklyTrend data={mockUpTrendData} />);

            expect(screen.getByTestId('svg')).toBeTruthy();
            expect(screen.getByTestId('path')).toBeTruthy();
        });
    });

    describe('trend direction indicators', () => {
        it('displays up arrow and Meningkat for upward trend', () => {
            render(<WeeklyTrend data={mockUpTrendData} />);

            expect(screen.getByText('↑')).toBeTruthy();
            expect(screen.getByText('Meningkat')).toBeTruthy();
        });

        it('displays down arrow and Menurun for downward trend', () => {
            render(<WeeklyTrend data={mockDownTrendData} />);

            expect(screen.getByText('↓')).toBeTruthy();
            expect(screen.getByText('Menurun')).toBeTruthy();
        });

        it('displays right arrow and Stabil for stable trend', () => {
            render(<WeeklyTrend data={mockStableTrendData} />);

            expect(screen.getByText('→')).toBeTruthy();
            expect(screen.getByText('Stabil')).toBeTruthy();
        });
    });

    describe('percentage calculation', () => {
        it('calculates positive percentage change correctly', () => {
            // 1200 -> 1400 = +16.67% ≈ +17%
            render(<WeeklyTrend data={mockUpTrendData} />);

            expect(screen.getByText('+17%')).toBeTruthy();
        });

        it('calculates negative percentage change correctly', () => {
            // 1400 -> 1200 = -14.29% ≈ -14%
            render(<WeeklyTrend data={mockDownTrendData} />);

            expect(screen.getByText('-14%')).toBeTruthy();
        });

        it('calculates stable percentage change correctly', () => {
            // 1300 -> 1300 = 0%
            render(<WeeklyTrend data={mockStableTrendData} />);

            expect(screen.getByText('0%')).toBeTruthy();
        });
    });

    describe('edge cases', () => {
        it('handles single week data point', () => {
            const singleWeekData: WeeklyTrendData = {
                weeks: [
                    { week_start: '2026-01-01', week_end: '2026-01-07', average_calories: 1200 },
                ],
                trend_direction: 'stable',
            };

            render(<WeeklyTrend data={singleWeekData} />);

            expect(screen.getByText('Tren Mingguan')).toBeTruthy();
            expect(screen.getByText('0%')).toBeTruthy();
        });

        it('handles zero starting calories', () => {
            const zeroStartData: WeeklyTrendData = {
                weeks: [
                    { week_start: '2026-01-01', week_end: '2026-01-07', average_calories: 0 },
                    { week_start: '2026-01-08', week_end: '2026-01-14', average_calories: 1000 },
                ],
                trend_direction: 'up',
            };

            render(<WeeklyTrend data={zeroStartData} />);

            // Should show 100% when starting from zero
            expect(screen.getByText('+100%')).toBeTruthy();
        });

        it('handles uniform values across all weeks', () => {
            const uniformData: WeeklyTrendData = {
                weeks: [
                    { week_start: '2026-01-01', week_end: '2026-01-07', average_calories: 1000 },
                    { week_start: '2026-01-08', week_end: '2026-01-14', average_calories: 1000 },
                    { week_start: '2026-01-15', week_end: '2026-01-21', average_calories: 1000 },
                    { week_start: '2026-01-22', week_end: '2026-01-28', average_calories: 1000 },
                ],
                trend_direction: 'stable',
            };

            render(<WeeklyTrend data={uniformData} />);

            expect(screen.getByText('0%')).toBeTruthy();
            expect(screen.getByText('Stabil')).toBeTruthy();
        });
    });
});
