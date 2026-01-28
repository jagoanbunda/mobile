import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';

export interface EmptyFoodLogsProps {
  onAddPress?: () => void;
  message?: string;
}

export function EmptyFoodLogs({
  onAddPress,
  message = 'Belum ada catatan makanan',
}: EmptyFoodLogsProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      {/* Icon */}
      <View
        style={{ backgroundColor: colors.surfaceContainerHigh }}
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
      >
        <MaterialIcons name="restaurant-menu" size={48} color={colors.onSurfaceVariant} />
      </View>

      {/* Message */}
      <Text
        style={{ color: colors.onSurfaceVariant }}
        className="text-lg font-medium text-center mb-2"
      >
        {message}
      </Text>
      <Text
        style={{ color: colors.onSurfaceVariant }}
        className="text-sm text-center opacity-70 mb-6"
      >
        Mulai catat makanan anak untuk memantau asupan nutrisi harian
      </Text>

      {/* Add button (optional) */}
      {onAddPress && (
        <TouchableOpacity
          onPress={onAddPress}
          style={{ backgroundColor: colors.primary }}
          className="flex-row items-center px-6 py-3 rounded-full"
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={20} color={colors.onPrimary} />
          <Text style={{ color: colors.onPrimary }} className="font-semibold ml-2">
            Tambah Catatan
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default EmptyFoodLogs;
