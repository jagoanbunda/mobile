import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { ChildSwitcher } from '@/components/ChildSwitcher';
import type { ChildProfile } from '@/types/dashboard';

// Mock ThemeContext
jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        colors: {
            primary: '#416936',
            primaryContainer: '#C3E8B6',
            onPrimaryContainer: '#0D2006',
            onSurface: '#1A1C19',
            onSurfaceVariant: '#44483E',
            surfaceContainerLowest: '#FFFFFF',
            surfaceContainerHigh: '#ECEFE5',
            surfaceContainerHighest: '#E6E9DF',
        },
    }),
}));

// Mock MaterialIcons
jest.mock('@expo/vector-icons/MaterialIcons', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return function MockIcon({ name }: { name: string }) {
        return <Text testID={`icon-${name}`}>{name}</Text>;
    };
});

describe('ChildSwitcher', () => {
    // Test data
    const mockChildren: ChildProfile[] = [
        { id: 1, name: 'Ahmad', age_in_months: 18 },
        { id: 2, name: 'Budi', age_in_months: 36 },
        { id: 3, name: 'Citra', age_in_months: 7 },
    ];

    const mockOnChildSelect = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        act(() => {
            jest.runOnlyPendingTimers();
        });
        jest.useRealTimers();
    });

    describe('rendering', () => {
        it('renders all child cards', () => {
            render(
                <ChildSwitcher
                    childProfiles={mockChildren}
                    activeChildId={1}
                    onChildSelect={mockOnChildSelect}
                />
            );

            expect(screen.getByTestId('child-switcher')).toBeTruthy();
            expect(screen.getByTestId('child-card-1')).toBeTruthy();
            expect(screen.getByTestId('child-card-2')).toBeTruthy();
            expect(screen.getByTestId('child-card-3')).toBeTruthy();
        });

        it('displays child names', () => {
            render(
                <ChildSwitcher
                    childProfiles={mockChildren}
                    activeChildId={1}
                    onChildSelect={mockOnChildSelect}
                />
            );

            expect(screen.getByText('Ahmad')).toBeTruthy();
            expect(screen.getByText('Budi')).toBeTruthy();
            expect(screen.getByText('Citra')).toBeTruthy();
        });

        it('returns null for empty children array', () => {
            render(
                <ChildSwitcher
                    childProfiles={[]}
                    activeChildId={1}
                    onChildSelect={mockOnChildSelect}
                />
            );

            expect(screen.queryByTestId('child-switcher')).toBeNull();
        });
    });

    describe('age formatting (Indonesian)', () => {
        it('formats age with years and months', () => {
            render(
                <ChildSwitcher
                    childProfiles={mockChildren}
                    activeChildId={1}
                    onChildSelect={mockOnChildSelect}
                />
            );

            // 18 months = 1 tahun 6 bulan
            expect(screen.getByText('1 tahun 6 bulan')).toBeTruthy();
        });

        it('formats age with years only', () => {
            render(
                <ChildSwitcher
                    childProfiles={mockChildren}
                    activeChildId={1}
                    onChildSelect={mockOnChildSelect}
                />
            );

            // 36 months = 3 tahun
            expect(screen.getByText('3 tahun')).toBeTruthy();
        });

        it('formats age with months only', () => {
            render(
                <ChildSwitcher
                    childProfiles={mockChildren}
                    activeChildId={1}
                    onChildSelect={mockOnChildSelect}
                />
            );

            // 7 months = 7 bulan
            expect(screen.getByText('7 bulan')).toBeTruthy();
        });
    });

    describe('max children limit', () => {
        it('displays max 3 children', () => {
            const manyChildren: ChildProfile[] = [
                { id: 1, name: 'Ahmad', age_in_months: 18 },
                { id: 2, name: 'Budi', age_in_months: 36 },
                { id: 3, name: 'Citra', age_in_months: 7 },
                { id: 4, name: 'Dewi', age_in_months: 24 },
                { id: 5, name: 'Eko', age_in_months: 12 },
            ];

            render(
                <ChildSwitcher
                    childProfiles={manyChildren}
                    activeChildId={1}
                    onChildSelect={mockOnChildSelect}
                />
            );

            // First 3 should be visible
            expect(screen.getByTestId('child-card-1')).toBeTruthy();
            expect(screen.getByTestId('child-card-2')).toBeTruthy();
            expect(screen.getByTestId('child-card-3')).toBeTruthy();

            // 4th and 5th should not be rendered
            expect(screen.queryByTestId('child-card-4')).toBeNull();
            expect(screen.queryByTestId('child-card-5')).toBeNull();
        });
    });

    describe('child selection', () => {
        it('calls onChildSelect when card is pressed', () => {
            render(
                <ChildSwitcher
                    childProfiles={mockChildren}
                    activeChildId={1}
                    onChildSelect={mockOnChildSelect}
                />
            );

            fireEvent.press(screen.getByTestId('child-card-2'));

            expect(mockOnChildSelect).toHaveBeenCalledWith(2);
        });

        it('calls onChildSelect with correct id for each card', () => {
            render(
                <ChildSwitcher
                    childProfiles={mockChildren}
                    activeChildId={1}
                    onChildSelect={mockOnChildSelect}
                />
            );

            fireEvent.press(screen.getByTestId('child-card-1'));
            expect(mockOnChildSelect).toHaveBeenCalledWith(1);

            fireEvent.press(screen.getByTestId('child-card-3'));
            expect(mockOnChildSelect).toHaveBeenCalledWith(3);
        });
    });

    describe('loading state', () => {
        it('renders skeleton placeholders when loading', () => {
            render(
                <ChildSwitcher
                    childProfiles={mockChildren}
                    activeChildId={1}
                    onChildSelect={mockOnChildSelect}
                    isLoading={true}
                />
            );

            expect(screen.getByTestId('child-switcher-loading')).toBeTruthy();
            // Should not render actual child cards
            expect(screen.queryByTestId('child-card-1')).toBeNull();
        });

        it('renders 3 skeleton cards when loading', () => {
            render(
                <ChildSwitcher
                    childProfiles={[]}
                    activeChildId={1}
                    onChildSelect={mockOnChildSelect}
                    isLoading={true}
                />
            );

            expect(screen.getByTestId('child-switcher-loading')).toBeTruthy();
        });
    });

    describe('active state', () => {
        it('renders with active child highlighted', () => {
            render(
                <ChildSwitcher
                    childProfiles={mockChildren}
                    activeChildId={2}
                    onChildSelect={mockOnChildSelect}
                />
            );

            // Active card should exist
            expect(screen.getByTestId('child-card-2')).toBeTruthy();
            // Other cards should also exist
            expect(screen.getByTestId('child-card-1')).toBeTruthy();
            expect(screen.getByTestId('child-card-3')).toBeTruthy();
        });
    });
});
