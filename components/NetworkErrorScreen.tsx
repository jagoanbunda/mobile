import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';

interface NetworkErrorScreenProps {
  message?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function NetworkErrorScreen({
  message = 'Unable to connect. Please check your internet connection.',
  onRetry,
  isRetrying = false,
}: NetworkErrorScreenProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <MaterialIcons name="wifi-off" size={64} color={colors.error} />
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: '600',
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        Connection Error
      </Text>
      <Text
        style={{
          color: colors.onSurfaceVariant,
          fontSize: 14,
          marginTop: 8,
          textAlign: 'center',
        }}
      >
        {message}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        disabled={isRetrying}
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 32,
          paddingVertical: 12,
          borderRadius: 24,
          marginTop: 24,
          opacity: isRetrying ? 0.6 : 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {isRetrying && (
          <ActivityIndicator size="small" color={colors.onPrimary} />
        )}
        <Text
          style={{
            color: colors.onPrimary,
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          {isRetrying ? 'Retrying...' : 'Retry'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default NetworkErrorScreen;
