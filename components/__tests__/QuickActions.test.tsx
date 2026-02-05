import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { QuickActions } from '@/components/QuickActions';

// Mock ThemeContext
jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        colors: {
            primary: '#416936',
            primaryContainer: '#C3E8B6',
            onSurfaceVariant: '#44483E',
            surfaceContainerLow: '#F7FAEE',
            surfaceContainerHigh: '#ECEFE5',
            shadow: '#000000',
        },
    }),
}));

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Mock MaterialIcons
jest.mock('@expo/vector-icons/MaterialIcons', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return function MockMaterialIcons({ name, ...props }: { name: string }) {
        return <Text testID={`icon-${name}`} {...props}>{name}</Text>;
    };
});

describe('QuickActions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('rendering', () => {
        it('renders two buttons by default (without PMT)', () => {
            render(<QuickActions />);

            expect(screen.getByText('Catat Makan')).toBeTruthy();
            expect(screen.getByText('Lihat Riwayat')).toBeTruthy();
            expect(screen.queryByText('Catat PMT')).toBeNull();
        });

        it('renders three buttons when isPmtEnrolled is true', () => {
            render(<QuickActions isPmtEnrolled={true} />);

            expect(screen.getByText('Catat Makan')).toBeTruthy();
            expect(screen.getByText('Lihat Riwayat')).toBeTruthy();
            expect(screen.getByText('Catat PMT')).toBeTruthy();
        });

        it('renders correct icons for each button', () => {
            render(<QuickActions isPmtEnrolled={true} />);

            expect(screen.getByTestId('icon-restaurant')).toBeTruthy();
            expect(screen.getByTestId('icon-history')).toBeTruthy();
            expect(screen.getByTestId('icon-local-dining')).toBeTruthy();
        });
    });

    describe('navigation', () => {
        it('navigates to /input when Catat Makan is pressed', () => {
            render(<QuickActions />);

            fireEvent.press(screen.getByText('Catat Makan'));

            expect(mockPush).toHaveBeenCalledWith('/input');
        });

        it('navigates to /progress when Lihat Riwayat is pressed', () => {
            render(<QuickActions />);

            fireEvent.press(screen.getByText('Lihat Riwayat'));

            expect(mockPush).toHaveBeenCalledWith('/progress');
        });

        it('navigates to /pmt when Catat PMT is pressed', () => {
            render(<QuickActions isPmtEnrolled={true} />);

            fireEvent.press(screen.getByText('Catat PMT'));

            expect(mockPush).toHaveBeenCalledWith('/pmt');
        });
    });

    describe('conditional rendering', () => {
        it('does not show PMT button when isPmtEnrolled is false', () => {
            render(<QuickActions isPmtEnrolled={false} />);

            expect(screen.queryByText('Catat PMT')).toBeNull();
            expect(screen.queryByTestId('icon-local-dining')).toBeNull();
        });

        it('does not show PMT button when isPmtEnrolled is undefined', () => {
            render(<QuickActions />);

            expect(screen.queryByText('Catat PMT')).toBeNull();
        });
    });
});
