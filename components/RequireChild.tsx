import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';

interface RequireChildProps {
  children: ReactNode;
  /**
   * Custom message to display when no child is registered
   * @default "Anda belum menambahkan data anak."
   */
  message?: string;
  /**
   * Whether to show loading state while checking for children
   * @default true
   */
  showLoading?: boolean;
}

/**
 * Wrapper component that prompts user to add a child if none exists.
 * Used on screens that require child data (Progress, Screening, PMT).
 *
 * This is a non-blocking prompt - it shows a friendly message with
 * a button to add a child, rather than preventing access entirely.
 */
export function RequireChild({
  children,
  message = 'Anda belum menambahkan data anak.',
  showLoading = true,
}: RequireChildProps) {
  const { colors } = useTheme();
  const { hasChildren, isLoading } = useActiveChild();

  // While loading, optionally show nothing (parent handles skeleton)
  if (isLoading && showLoading) {
    return null;
  }

  // If no children, show prompt
  if (!hasChildren) {
    return (
      <View
        style={{ backgroundColor: colors.surface }}
        className="flex-1 items-center justify-center px-8"
      >
        <View
          style={{ backgroundColor: colors.surfaceContainerHigh }}
          className="w-20 h-20 rounded-full items-center justify-center mb-6"
        >
          <MaterialIcons name="child-care" size={40} color={colors.primary} />
        </View>

        <Text
          style={{ color: colors.onSurface }}
          className="text-xl font-bold text-center mb-2"
        >
          Belum Ada Data Anak
        </Text>

        <Text
          style={{ color: colors.onSurfaceVariant }}
          className="text-base text-center mb-8"
        >
          {message}
        </Text>

        <TouchableOpacity
          onPress={() => router.push('/profile/add-child')}
          style={{ backgroundColor: colors.primary }}
          className="px-8 py-4 rounded-xl flex-row items-center gap-2"
        >
          <MaterialIcons name="add" size={20} color={colors.onPrimary} />
          <Text
            style={{ color: colors.onPrimary }}
            className="font-bold text-base"
          >
            Tambah Anak
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  // Has children - render the actual content
  return <>{children}</>;
}

export default RequireChild;
