import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { getAvatarUrl } from '@/config/env';
import { Child } from '@/types';

interface ChildDropdownProps {
  /**
   * Whether to show the dropdown chevron
   * @default true
   */
  showChevron?: boolean;
  /**
   * Size of the avatar
   * @default 40
   */
  avatarSize?: number;
}

/**
 * Compact child switcher dropdown for the home header.
 * Shows the active child's avatar with a dropdown to switch between children.
 */
export function ChildDropdown({
  showChevron = true,
  avatarSize = 40,
}: ChildDropdownProps) {
  const { colors } = useTheme();
  const { data: activeChild, children, selectChild, hasChildren } = useActiveChild();
  const [isOpen, setIsOpen] = useState(false);

  // If no children, show add child button
  if (!hasChildren) {
    return (
      <TouchableOpacity
        onPress={() => router.push('/profile/add-child')}
        style={{ backgroundColor: colors.primaryContainer }}
        className="flex-row items-center px-3 py-2 rounded-full gap-2"
      >
        <MaterialIcons name="add" size={18} color={colors.onPrimaryContainer} />
        <Text
          style={{ color: colors.onPrimaryContainer }}
          className="text-sm font-medium"
        >
          Tambah Anak
        </Text>
      </TouchableOpacity>
    );
  }

  const handleSelectChild = async (child: Child) => {
    try {
      await selectChild(child.id);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to select child:', error);
    }
  };

  // Render avatar or placeholder
  const renderAvatar = (child: Child | null, size: number) => {
    if (!child) {
      return (
        <View
          style={{
            width: size,
            height: size,
            backgroundColor: colors.surfaceContainerHigh,
          }}
          className="rounded-full items-center justify-center"
        >
          <MaterialIcons
            name="person"
            size={size * 0.6}
            color={colors.onSurfaceVariant}
          />
        </View>
      );
    }

    const resolvedUrl = getAvatarUrl(child.avatar_url);
    if (resolvedUrl) {
      return (
        <Image
          source={{ uri: resolvedUrl }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
          placeholder={colors.surfaceContainerHigh}
          transition={200}
        />
      );
    }

    // Placeholder with initials
    const initials = child.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <View
        style={{
          width: size,
          height: size,
          backgroundColor: colors.primaryContainer,
        }}
        className="rounded-full items-center justify-center"
      >
        <Text
          style={{ color: colors.onPrimaryContainer }}
          className="font-bold"
        >
          {initials}
        </Text>
      </View>
    );
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="flex-row items-center gap-1"
        activeOpacity={0.7}
      >
        {renderAvatar(activeChild, avatarSize)}
        {showChevron && (
          <MaterialIcons
            name="keyboard-arrow-down"
            size={20}
            color={colors.onSurfaceVariant}
          />
        )}
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          onPress={() => setIsOpen(false)}
          className="flex-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <View className="flex-1 justify-start pt-24 px-4">
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View
                style={{
                  backgroundColor: colors.surfaceContainer,
                  borderColor: colors.outlineVariant,
                }}
                className="rounded-2xl border overflow-hidden max-h-80"
              >
                {/* Header */}
                <View
                  style={{ backgroundColor: colors.surfaceContainerHigh }}
                  className="px-4 py-3 border-b"
                >
                  <Text
                    style={{ color: colors.onSurface }}
                    className="font-bold text-base"
                  >
                    Pilih Anak
                  </Text>
                </View>

                {/* Children List */}
                <ScrollView className="max-h-52">
                  {children?.map((child: Child) => (
                    <TouchableOpacity
                      key={child.id}
                      onPress={() => handleSelectChild(child)}
                      className="flex-row items-center px-4 py-3 gap-3"
                      style={{
                        backgroundColor:
                          child.id === activeChild?.id
                            ? colors.primaryContainer
                            : 'transparent',
                      }}
                    >
                      {renderAvatar(child, 36)}
                      <View className="flex-1">
                        <Text
                          style={{ color: colors.onSurface }}
                          className="font-medium"
                        >
                          {child.name}
                        </Text>
                        <Text
                          style={{ color: colors.onSurfaceVariant }}
                          className="text-xs"
                        >
                          {child.age.months} bulan
                        </Text>
                      </View>
                      {child.id === activeChild?.id && (
                        <MaterialIcons
                          name="check"
                          size={20}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Footer Actions */}
                <View
                  style={{
                    borderTopColor: colors.outlineVariant,
                    backgroundColor: colors.surfaceContainerHigh,
                  }}
                  className="border-t"
                >
                  <TouchableOpacity
                    onPress={() => {
                      setIsOpen(false);
                      router.push('/profile/add-child');
                    }}
                    className="flex-row items-center px-4 py-3 gap-3"
                  >
                    <View
                      style={{ backgroundColor: colors.primary }}
                      className="w-9 h-9 rounded-full items-center justify-center"
                    >
                      <MaterialIcons
                        name="add"
                        size={20}
                        color={colors.onPrimary}
                      />
                    </View>
                    <Text
                      style={{ color: colors.primary }}
                      className="font-medium"
                    >
                      Tambah Anak Baru
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export default ChildDropdown;
