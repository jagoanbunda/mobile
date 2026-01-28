import { useTheme } from '@/context/ThemeContext';
import { 
    useNotificationsInfinite, 
    useMarkNotificationAsRead, 
    useMarkAllNotificationsAsRead,
    useDeleteNotification,
    useUnreadNotificationCount 
} from '@/services/hooks/use-notifications';
import { Notification, NotificationType } from '@/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, Alert, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}

function getNotificationIcon(type: NotificationType): keyof typeof MaterialIcons.glyphMap {
    switch (type) {
        case 'pmt_reminder':
            return 'restaurant';
        case 'screening_reminder':
            return 'assignment';
        case 'measurement_reminder':
            return 'straighten';
        case 'general':
        default:
            return 'notifications';
    }
}

function getNotificationRoute(notification: Notification): string | null {
    const { type, data } = notification;

    switch (type) {
        case 'pmt_reminder':
            if (data.schedule_id) {
                return `/pmt/report?scheduleId=${data.schedule_id}`;
            }
            return '/pmt';
        case 'screening_reminder':
            if (data.screening_id) {
                return `/screening/result?id=${data.screening_id}`;
            }
            return '/screening';
        case 'measurement_reminder':
            return '/anthropometry/input';
        default:
            return null;
    }
}

export default function NotificationsScreen() {
    const { colors } = useTheme();

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    } = useNotificationsInfinite({ per_page: 20 });

    const { data: unreadCount = 0 } = useUnreadNotificationCount();
    const markAsReadMutation = useMarkNotificationAsRead();
    const markAllAsReadMutation = useMarkAllNotificationsAsRead();
    const deleteMutation = useDeleteNotification();

    // Flatten pages
    const notifications = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.data);
    }, [data]);

    const handleNotificationPress = useCallback(async (notification: Notification) => {
        // Mark as read if unread
        if (!notification.is_read) {
            markAsReadMutation.mutate(notification.id);
        }

        // Navigate to relevant screen
        const route = getNotificationRoute(notification);
        if (route) {
            router.push(route as never);
        }
    }, [markAsReadMutation]);

    const handleMarkAllRead = useCallback(() => {
        if (unreadCount > 0) {
            markAllAsReadMutation.mutate();
        }
    }, [unreadCount, markAllAsReadMutation]);

    const handleDelete = useCallback((notification: Notification) => {
        Alert.alert(
            'Hapus Notifikasi',
            'Hapus notifikasi ini?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => deleteMutation.mutate(notification.id),
                },
            ]
        );
    }, [deleteMutation]);

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ color: colors.onSurfaceVariant }} className="mt-4 text-sm">
                        Memuat notifikasi...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ backgroundColor: colors.surface }} className="flex-row items-center p-4 pb-2 justify-between">
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ backgroundColor: colors.surfaceContainerHigh }}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
                </TouchableOpacity>
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
                    Notifikasi
                </Text>
                {unreadCount > 0 ? (
                    <TouchableOpacity
                        onPress={handleMarkAllRead}
                        disabled={markAllAsReadMutation.isPending}
                        className="px-3 py-2"
                    >
                        {markAllAsReadMutation.isPending ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <Text style={{ color: colors.primary }} className="text-sm font-medium">
                                Tandai Dibaca
                            </Text>
                        )}
                    </TouchableOpacity>
                ) : (
                    <View className="w-10" />
                )}
            </View>

            {/* Unread Count Badge */}
            {unreadCount > 0 && (
                <View style={{ backgroundColor: colors.primaryContainer }} className="mx-4 mb-3 px-4 py-2 rounded-lg flex-row items-center gap-2">
                    <MaterialIcons name="mark-email-unread" size={18} color={colors.primary} />
                    <Text style={{ color: colors.onPrimaryContainer }} className="text-sm font-medium">
                        {unreadCount} notifikasi belum dibaca
                    </Text>
                </View>
            )}

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 40 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={() => refetch()}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
                onScrollEndDrag={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
                    if (isCloseToBottom) {
                        handleLoadMore();
                    }
                }}
            >
                {notifications.length > 0 ? (
                    <View className="gap-2">
                        {notifications.map((notification) => {
                            const icon = getNotificationIcon(notification.type);
                            const hasAction = getNotificationRoute(notification) !== null;

                            return (
                                <TouchableOpacity
                                    key={notification.id}
                                    onPress={() => handleNotificationPress(notification)}
                                    onLongPress={() => handleDelete(notification)}
                                    style={{
                                        backgroundColor: notification.is_read
                                            ? colors.surfaceContainerHigh
                                            : colors.primaryContainer,
                                        opacity: deleteMutation.isPending ? 0.5 : 1,
                                    }}
                                    className="rounded-xl p-4"
                                    disabled={deleteMutation.isPending}
                                >
                                    <View className="flex-row gap-3">
                                        {/* Icon */}
                                        <View
                                            style={{
                                                backgroundColor: notification.is_read
                                                    ? colors.surfaceContainerHighest
                                                    : colors.primary,
                                            }}
                                            className="w-10 h-10 rounded-full items-center justify-center"
                                        >
                                            <MaterialIcons
                                                name={icon}
                                                size={20}
                                                color={notification.is_read ? colors.onSurfaceVariant : colors.onPrimary}
                                            />
                                        </View>

                                        {/* Content */}
                                        <View className="flex-1">
                                            <View className="flex-row items-start justify-between gap-2">
                                                <Text
                                                    style={{
                                                        color: notification.is_read
                                                            ? colors.onSurface
                                                            : colors.onPrimaryContainer,
                                                    }}
                                                    className="text-sm font-bold flex-1"
                                                    numberOfLines={2}
                                                >
                                                    {notification.title}
                                                </Text>
                                                {!notification.is_read && (
                                                    <View style={{ backgroundColor: colors.primary }} className="w-2 h-2 rounded-full mt-1.5" />
                                                )}
                                            </View>
                                            <Text
                                                style={{
                                                    color: notification.is_read
                                                        ? colors.onSurfaceVariant
                                                        : colors.onPrimaryContainer,
                                                }}
                                                className="text-sm mt-1 opacity-90"
                                                numberOfLines={3}
                                            >
                                                {notification.body}
                                            </Text>
                                            <View className="flex-row items-center justify-between mt-2">
                                                <Text
                                                    style={{
                                                        color: notification.is_read
                                                            ? colors.outline
                                                            : colors.onPrimaryContainer,
                                                    }}
                                                    className="text-xs opacity-70"
                                                >
                                                    {formatTimeAgo(notification.created_at)}
                                                </Text>
                                                {hasAction && (
                                                    <View className="flex-row items-center gap-1">
                                                        <Text
                                                            style={{
                                                                color: notification.is_read
                                                                    ? colors.primary
                                                                    : colors.onPrimaryContainer,
                                                            }}
                                                            className="text-xs font-medium"
                                                        >
                                                            Lihat
                                                        </Text>
                                                        <MaterialIcons
                                                            name="chevron-right"
                                                            size={16}
                                                            color={notification.is_read ? colors.primary : colors.onPrimaryContainer}
                                                        />
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                        {/* Load more indicator */}
                        {isFetchingNextPage && (
                            <View className="py-4 items-center">
                                <ActivityIndicator size="small" color={colors.primary} />
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-sm mt-2">
                                    Memuat lebih banyak...
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-xl p-8 items-center mt-4">
                        <View style={{ backgroundColor: colors.primaryContainer }} className="w-20 h-20 rounded-full items-center justify-center mb-4">
                            <MaterialIcons name="notifications-off" size={40} color={colors.primary} />
                        </View>
                        <Text style={{ color: colors.onSurface }} className="text-lg font-bold text-center">
                            Tidak Ada Notifikasi
                        </Text>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm text-center mt-2">
                            Notifikasi tentang PMT, screening, dan pengukuran akan muncul di sini.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
