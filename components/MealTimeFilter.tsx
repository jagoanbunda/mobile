import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { MealTime } from '@/types';

export interface MealTimeOption {
    value: MealTime | 'all';
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
}

const MEAL_TIME_OPTIONS: MealTimeOption[] = [
    { value: 'all', label: 'Semua', icon: 'restaurant' },
    { value: 'breakfast', label: 'Sarapan', icon: 'wb-sunny' },
    { value: 'lunch', label: 'Siang', icon: 'light-mode' },
    { value: 'dinner', label: 'Malam', icon: 'nights-stay' },
    { value: 'snack', label: 'Camilan', icon: 'cookie' },
];

export interface MealTimeFilterProps {
    value: MealTime | 'all';
    onChange: (value: MealTime | 'all') => void;
    /** Show as pill buttons (default) or compact chips */
    variant?: 'pill' | 'chip';
    /** Include "Semua" option */
    showAll?: boolean;
}

export function MealTimeFilter({ 
    value, 
    onChange, 
    variant = 'pill',
    showAll = true 
}: MealTimeFilterProps) {
    const { colors } = useTheme();

    const options = showAll ? MEAL_TIME_OPTIONS : MEAL_TIME_OPTIONS.filter(opt => opt.value !== 'all');

    if (variant === 'chip') {
        return (
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
            >
                {options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <Pressable
                            key={option.value}
                            onPress={() => onChange(option.value)}
                            style={{
                                backgroundColor: isSelected ? colors.primary : colors.surfaceContainerHigh,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                            }}
                        >
                            <MaterialIcons
                                name={option.icon}
                                size={14}
                                color={isSelected ? colors.onPrimary : colors.onSurfaceVariant}
                            />
                            <Text
                                style={{
                                    color: isSelected ? colors.onPrimary : colors.onSurface,
                                    fontSize: 12,
                                    fontWeight: '500',
                                }}
                            >
                                {option.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        );
    }

    // Pill variant (full width, equal distribution)
    return (
        <View
            style={{ backgroundColor: colors.surfaceContainerHigh }}
            className="flex-row p-1.5 rounded-full"
        >
            {options.map((option) => {
                const isSelected = value === option.value;
                return (
                    <Pressable
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        style={{
                            flex: 1,
                            backgroundColor: isSelected ? colors.primary : 'transparent',
                            paddingVertical: 8,
                            borderRadius: 9999,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: isSelected ? colors.onPrimary : colors.onSurfaceVariant,
                                fontSize: 13,
                                fontWeight: '500',
                            }}
                        >
                            {option.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

export default MealTimeFilter;
