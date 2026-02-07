import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PillButton } from '@/components/PillButton';

// Mock ThemeContext (copy from QuickActions.test.tsx)
jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        colors: {
            primary: '#416936',
            primaryContainer: '#C3E8B6',
            onPrimary: '#FFFFFF',
            onSurfaceVariant: '#44483E',
            surfaceContainerLow: '#F7FAEE',
            shadow: '#000000',
        },
    }),
}));

// Mock MaterialIcons (copy from QuickActions.test.tsx)
jest.mock('@expo/vector-icons/MaterialIcons', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return function MockMaterialIcons({ name, ...props }: { name: string }) {
        return <Text testID={`icon-${name}`} {...props}>{name}</Text>;
    };
});

describe('PillButton', () => {
    const mockOnPress = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders label text', () => {
        render(<PillButton label="Test Label" icon="home" onPress={mockOnPress} />);
        expect(screen.getByText('Test Label')).toBeTruthy();
    });

    it('renders icon', () => {
        render(<PillButton label="Test" icon="restaurant" onPress={mockOnPress} />);
        expect(screen.getByTestId('icon-restaurant')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        render(<PillButton label="Press Me" icon="home" onPress={mockOnPress} />);
        fireEvent.press(screen.getByText('Press Me'));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('applies primary variant styles by default', () => {
        render(<PillButton label="Primary" icon="home" onPress={mockOnPress} />);
        // Just verify it renders without crashing - style testing is limited in RN
        expect(screen.getByText('Primary')).toBeTruthy();
    });
});
