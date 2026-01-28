import React, { useState } from 'react';
import { View, TouchableOpacity, Alert, ActionSheetIOS, Platform, Modal, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';

interface ImagePickerButtonProps {
    /** Current image URI (local file or remote URL) */
    value?: string | null;
    /** Callback when a new image is selected */
    onSelect: (uri: string) => void;
    /** Callback when the image is removed */
    onRemove?: () => void;
    /** Shape of the image container */
    shape?: 'circle' | 'square';
    /** Size of the image container in pixels */
    size?: number;
    /** Placeholder icon name (MaterialIcons) */
    placeholderIcon?: keyof typeof MaterialIcons.glyphMap;
    /** Placeholder icon size */
    placeholderIconSize?: number;
    /** Whether the picker is disabled */
    disabled?: boolean;
}

/**
 * Reusable image picker button with camera/gallery options.
 * Shows a placeholder when no image is selected, or a preview with remove option when an image is present.
 */
export function ImagePickerButton({
    value,
    onSelect,
    onRemove,
    shape = 'circle',
    size = 112,
    placeholderIcon = 'face',
    placeholderIconSize = 48,
    disabled = false,
}: ImagePickerButtonProps) {
    const { colors } = useTheme();
    const [showAndroidPicker, setShowAndroidPicker] = useState(false);

    const borderRadius = shape === 'circle' ? size / 2 : 12;
    const badgeSize = size * 0.32;
    const badgeIconSize = badgeSize * 0.5;

    const requestCameraPermission = async (): Promise<boolean> => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Izin Diperlukan',
                'Aplikasi memerlukan akses kamera untuk mengambil foto. Silakan aktifkan di pengaturan.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const requestMediaLibraryPermission = async (): Promise<boolean> => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Izin Diperlukan',
                'Aplikasi memerlukan akses galeri untuk memilih foto. Silakan aktifkan di pengaturan.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const takePhoto = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            onSelect(result.assets[0].uri);
        }
    };

    const pickFromGallery = async () => {
        const hasPermission = await requestMediaLibraryPermission();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            onSelect(result.assets[0].uri);
        }
    };

    const handlePress = () => {
        if (disabled) return;

        if (Platform.OS === 'ios') {
            const options = value
                ? ['Ambil Foto', 'Pilih dari Galeri', 'Hapus Foto', 'Batal']
                : ['Ambil Foto', 'Pilih dari Galeri', 'Batal'];

            const destructiveButtonIndex = value ? 2 : undefined;
            const cancelButtonIndex = value ? 3 : 2;

            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex,
                    destructiveButtonIndex,
                },
                (buttonIndex) => {
                    if (buttonIndex === 0) {
                        takePhoto();
                    } else if (buttonIndex === 1) {
                        pickFromGallery();
                    } else if (value && buttonIndex === 2) {
                        onRemove?.();
                    }
                }
            );
        } else {
            setShowAndroidPicker(true);
        }
    };

    const handleAndroidOption = (option: 'camera' | 'gallery' | 'remove') => {
        setShowAndroidPicker(false);
        if (option === 'camera') {
            takePhoto();
        } else if (option === 'gallery') {
            pickFromGallery();
        } else if (option === 'remove') {
            onRemove?.();
        }
    };

    return (
        <>
            <TouchableOpacity
                onPress={handlePress}
                disabled={disabled}
                activeOpacity={0.7}
                className="relative"
            >
                <View
                    style={{
                        width: size,
                        height: size,
                        borderRadius,
                        backgroundColor: colors.surfaceContainerHigh,
                        borderColor: colors.outline,
                        borderWidth: value ? 0 : 2,
                        borderStyle: value ? 'solid' : 'dashed',
                        opacity: disabled ? 0.5 : 1,
                    }}
                    className="items-center justify-center overflow-hidden"
                >
                    {value ? (
                        <Image
                            source={{ uri: value }}
                            style={{ width: size, height: size }}
                            contentFit="cover"
                            transition={200}
                        />
                    ) : (
                        <MaterialIcons
                            name={placeholderIcon}
                            size={placeholderIconSize}
                            color={colors.outline}
                        />
                    )}
                </View>

                {/* Badge button */}
                <View
                    style={{
                        backgroundColor: colors.primary,
                        width: badgeSize,
                        height: badgeSize,
                        borderRadius: badgeSize / 2,
                    }}
                    className="absolute bottom-0 right-0 items-center justify-center shadow-lg"
                >
                    <MaterialIcons
                        name={value ? 'edit' : 'add-a-photo'}
                        size={badgeIconSize}
                        color={colors.onPrimary}
                    />
                </View>
            </TouchableOpacity>

            {/* Android Action Sheet Modal */}
            {Platform.OS === 'android' && (
                <Modal
                    visible={showAndroidPicker}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowAndroidPicker(false)}
                >
                    <Pressable
                        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                        onPress={() => setShowAndroidPicker(false)}
                    >
                        <View className="flex-1 justify-end">
                            <View
                                style={{ backgroundColor: colors.surfaceContainerHigh }}
                                className="rounded-t-3xl pb-8"
                            >
                                <View className="items-center py-3">
                                    <View
                                        style={{ backgroundColor: colors.outlineVariant }}
                                        className="w-12 h-1 rounded-full"
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={() => handleAndroidOption('camera')}
                                    className="flex-row items-center px-6 py-4 gap-4"
                                >
                                    <MaterialIcons name="camera-alt" size={24} color={colors.onSurface} />
                                    <Text style={{ color: colors.onSurface }} className="text-base">
                                        Ambil Foto
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleAndroidOption('gallery')}
                                    className="flex-row items-center px-6 py-4 gap-4"
                                >
                                    <MaterialIcons name="photo-library" size={24} color={colors.onSurface} />
                                    <Text style={{ color: colors.onSurface }} className="text-base">
                                        Pilih dari Galeri
                                    </Text>
                                </TouchableOpacity>

                                {value && onRemove && (
                                    <TouchableOpacity
                                        onPress={() => handleAndroidOption('remove')}
                                        className="flex-row items-center px-6 py-4 gap-4"
                                    >
                                        <MaterialIcons name="delete" size={24} color={colors.error} />
                                        <Text style={{ color: colors.error }} className="text-base">
                                            Hapus Foto
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    onPress={() => setShowAndroidPicker(false)}
                                    className="flex-row items-center px-6 py-4 gap-4 mt-2"
                                >
                                    <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-base">
                                        Batal
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            )}
        </>
    );
}

export default ImagePickerButton;
