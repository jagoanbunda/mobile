import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export interface DateSectionHeaderProps {
  title: string;
}

export function DateSectionHeader({ title }: DateSectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{ backgroundColor: colors.surface }}
      className="py-3 px-4"
    >
      <Text style={{ color: colors.onSurface }} className="font-bold text-base">
        {title}
      </Text>
    </View>
  );
}

export default DateSectionHeader;
