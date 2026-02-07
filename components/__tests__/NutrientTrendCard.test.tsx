import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NutrientTrendCard } from '@/components/NutrientTrendCard';

// Mock ThemeContext
jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        colors: {
            surfaceContainerHigh: '#E8EAE0',
            onSurface: '#1A1C18',
            primary: '#416936',
            error: '#BA1A1A',
            tertiary: '#386666',
        },
    }),
}));

// Mock MaterialIcons
jest.mock('@expo/vector-icons/MaterialIcons', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return function MockMaterialIcons({ name }: { name: string }) {
        return <Text testID={`icon-${name}`}>{name}</Text>;
    };
});

describe('NutrientTrendCard', () => {
    it('renders label text', () => {
        render(
            <NutrientTrendCard 
                label="Kalori"
                value={1200}
                unit="kcal"
                trend="stable"
                icon="local-fire-department"
                color="#FF9800"
            />
        );
        expect(screen.getByText('Kalori')).toBeTruthy();
    });

    it('renders value with unit', () => {
        render(
            <NutrientTrendCard 
                label="Protein"
                value={45}
                unit="g"
                trend="stable"
                icon="fitness-center"
                color="#4CAF50"
            />
        );
        expect(screen.getByText('45')).toBeTruthy();
        expect(screen.getByText('g')).toBeTruthy();
    });

    it('shows correct trend arrow for up direction', () => {
        render(
            <NutrientTrendCard 
                label="Lemak"
                value={30}
                unit="g"
                trend="up"
                icon="water-drop"
                color="#FFC107"
            />
        );
        expect(screen.getByTestId('icon-trending-up')).toBeTruthy();
    });

    it('shows correct trend arrow for down direction', () => {
        render(
            <NutrientTrendCard 
                label="Karbohidrat"
                value={150}
                unit="g"
                trend="down"
                icon="grain"
                color="#795548"
            />
        );
        expect(screen.getByTestId('icon-trending-down')).toBeTruthy();
    });
});
