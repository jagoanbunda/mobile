import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { ApiError, NetworkError, UnauthorizedError, ServerError } from '@/services/api/errors';

interface NetworkErrorViewProps {
    error: Error | null;
    onRetry?: () => void;
    compact?: boolean;
}

/**
 * Get user-friendly error message
 */
function getErrorMessage(error: Error | null): { title: string; message: string; icon: keyof typeof MaterialIcons.glyphMap } {
    if (!error) {
        return {
            title: 'Terjadi Kesalahan',
            message: 'Silakan coba lagi.',
            icon: 'error-outline',
        };
    }

    if (error instanceof NetworkError) {
        return {
            title: 'Tidak Ada Koneksi',
            message: 'Periksa koneksi internet Anda dan coba lagi.',
            icon: 'wifi-off',
        };
    }

    if (error instanceof UnauthorizedError) {
        return {
            title: 'Sesi Berakhir',
            message: 'Silakan login kembali untuk melanjutkan.',
            icon: 'lock-outline',
        };
    }

    if (error instanceof ServerError) {
        return {
            title: 'Server Error',
            message: 'Terjadi kesalahan pada server. Coba lagi nanti.',
            icon: 'cloud-off',
        };
    }

    if (error instanceof ApiError) {
        return {
            title: 'Gagal Memuat Data',
            message: error.message || 'Terjadi kesalahan saat memuat data.',
            icon: 'error-outline',
        };
    }

    // Generic error
    return {
        title: 'Terjadi Kesalahan',
        message: error.message || 'Silakan coba lagi.',
        icon: 'error-outline',
    };
}

/**
 * Network error view component
 */
export function NetworkErrorView({ error, onRetry, compact = false }: NetworkErrorViewProps) {
    const { colors } = useTheme();
    const { title, message, icon } = getErrorMessage(error);

    if (compact) {
        return (
            <View style={{ backgroundColor: colors.errorContainer }} className="rounded-xl p-4 flex-row items-center gap-3">
                <MaterialIcons name={icon} size={24} color={colors.error} />
                <View className="flex-1">
                    <Text style={{ color: colors.onErrorContainer }} className="font-bold text-sm">
                        {title}
                    </Text>
                    <Text style={{ color: colors.onErrorContainer }} className="text-xs opacity-80">
                        {message}
                    </Text>
                </View>
                {onRetry && (
                    <TouchableOpacity
                        onPress={onRetry}
                        style={{ backgroundColor: colors.error }}
                        className="px-3 py-1.5 rounded-lg"
                    >
                        <Text style={{ color: colors.onError }} className="text-xs font-bold">
                            Coba Lagi
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-xl p-8 items-center">
            <View style={{ backgroundColor: colors.errorContainer }} className="w-20 h-20 rounded-full items-center justify-center mb-4">
                <MaterialIcons name={icon} size={40} color={colors.error} />
            </View>
            <Text style={{ color: colors.onSurface }} className="text-lg font-bold text-center">
                {title}
            </Text>
            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm text-center mt-2">
                {message}
            </Text>
            {onRetry && (
                <TouchableOpacity
                    onPress={onRetry}
                    style={{ backgroundColor: colors.primary }}
                    className="mt-6 px-6 py-3 rounded-xl flex-row items-center gap-2"
                >
                    <MaterialIcons name="refresh" size={20} color={colors.onPrimary} />
                    <Text style={{ color: colors.onPrimary }} className="font-bold">
                        Coba Lagi
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

/**
 * Empty state view component
 */
interface EmptyStateViewProps {
    icon?: keyof typeof MaterialIcons.glyphMap;
    title: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyStateView({ 
    icon = 'inbox', 
    title, 
    message, 
    actionLabel, 
    onAction 
}: EmptyStateViewProps) {
    const { colors } = useTheme();

    return (
        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-xl p-8 items-center">
            <View style={{ backgroundColor: colors.primaryContainer }} className="w-20 h-20 rounded-full items-center justify-center mb-4">
                <MaterialIcons name={icon} size={40} color={colors.primary} />
            </View>
            <Text style={{ color: colors.onSurface }} className="text-lg font-bold text-center">
                {title}
            </Text>
            {message && (
                <Text style={{ color: colors.onSurfaceVariant }} className="text-sm text-center mt-2">
                    {message}
                </Text>
            )}
            {actionLabel && onAction && (
                <TouchableOpacity
                    onPress={onAction}
                    style={{ backgroundColor: colors.primary }}
                    className="mt-6 px-6 py-3 rounded-xl flex-row items-center gap-2"
                >
                    <MaterialIcons name="add" size={20} color={colors.onPrimary} />
                    <Text style={{ color: colors.onPrimary }} className="font-bold">
                        {actionLabel}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

export default NetworkErrorView;
