import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { useAnthropometryInfinite, useDeleteAnthropometry } from '@/services/hooks/use-anthropometry';
import { Anthropometry } from '@/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import React, { useMemo, useCallback, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Alert, RefreshControl } from 'react-native';

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatMonthYear(dateString: string): string {
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
    });
}

function getStatusColor(status: string, colors: ReturnType<typeof useTheme>['colors']): { bg: string; text: string } {
    const normalized = status.toLowerCase();
    if (normalized.includes('baik') || normalized === 'normal') {
        return { bg: colors.primaryContainer, text: colors.onPrimaryContainer };
    }
    if (normalized.includes('kurang') || normalized.includes('stunted') || normalized.includes('wasting')) {
        return { bg: colors.errorContainer, text: colors.onErrorContainer };
    }
    if (normalized.includes('lebih') || normalized.includes('obesitas')) {
        return { bg: colors.tertiaryContainer, text: colors.onTertiaryContainer };
    }
    return { bg: colors.surfaceContainerHighest, text: colors.onSurfaceVariant };
}

export default function AnthropometryHistoryScreen() {
    const { colors } = useTheme();
    const { data: child, isLoading: isLoadingChild } = useActiveChild();
    const childId = child?.id ?? 0;

    const {
        data,
        isLoading: isLoadingMeasurements,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    } = useAnthropometryInfinite(childId, { per_page: 20 });

    const deleteMutation = useDeleteAnthropometry(childId);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const isLoading = isLoadingChild || isLoadingMeasurements;

    // Flatten pages
    const measurements = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.data);
    }, [data]);

    // Group measurements by month
    const groupedMeasurements = useMemo(() => {
        return measurements.reduce((acc, measurement) => {
            const month = measurement.measurement_date.substring(0, 7); // YYYY-MM
            if (!acc[month]) acc[month] = [];
            acc[month].push(measurement);
            return acc;
        }, {} as Record<string, Anthropometry[]>);
    }, [measurements]);

    const handleDelete = useCallback((measurement: Anthropometry) => {
        Alert.alert(
            'Hapus Pengukuran',
            `Hapus data pengukuran tanggal ${formatDate(measurement.measurement_date)}?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        setDeletingId(measurement.id);
                        try {
                            await deleteMutation.mutateAsync(measurement.id);
                        } catch {
                            Alert.alert('Error', 'Gagal menghapus data. Silakan coba lagi.');
                        } finally {
                            setDeletingId(null);
                        }
                    },
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
                        Memuat riwayat pengukuran...
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
                    Riwayat Pengukuran
                </Text>
                <TouchableOpacity
                    onPress={() => router.push('/anthropometry/input')}
                    style={{ backgroundColor: colors.primary }}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="add" size={24} color={colors.onPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
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
                {/* Summary Stats */}
                <View className="flex-row gap-3 mb-5">
                    <View style={{ backgroundColor: colors.primaryContainer }} className="flex-1 p-4 rounded-xl items-center">
                        <MaterialIcons name="straighten" size={24} color={colors.primary} />
                        <Text style={{ color: colors.onPrimaryContainer }} className="text-2xl font-bold mt-1">
                            {measurements.length}
                        </Text>
                        <Text style={{ color: colors.onPrimaryContainer }} className="text-xs">Total Pengukuran</Text>
                    </View>
                    {measurements[0] && (
                        <>
                            <View style={{ backgroundColor: colors.tertiaryContainer }} className="flex-1 p-4 rounded-xl items-center">
                                <MaterialIcons name="monitor-weight" size={24} color={colors.tertiary} />
                                <Text style={{ color: colors.onTertiaryContainer }} className="text-2xl font-bold mt-1">
                                    {measurements[0].weight.toFixed(1)}
                                </Text>
                                <Text style={{ color: colors.onTertiaryContainer }} className="text-xs">BB Terakhir (kg)</Text>
                            </View>
                            <View style={{ backgroundColor: colors.secondaryContainer }} className="flex-1 p-4 rounded-xl items-center">
                                <MaterialIcons name="height" size={24} color={colors.secondary} />
                                <Text style={{ color: colors.onSecondaryContainer }} className="text-2xl font-bold mt-1">
                                    {measurements[0].height.toFixed(1)}
                                </Text>
                                <Text style={{ color: colors.onSecondaryContainer }} className="text-xs">TB Terakhir (cm)</Text>
                            </View>
                        </>
                    )}
                </View>

                {/* History Section */}
                <View className="gap-3">
                    {Object.keys(groupedMeasurements).length > 0 ? (
                        Object.entries(groupedMeasurements)
                            .sort(([a], [b]) => b.localeCompare(a)) // Newest first
                            .map(([month, monthMeasurements]) => (
                                <View key={month} className="gap-3">
                                    {/* Month Header */}
                                    <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="px-3 py-2 rounded-lg">
                                        <Text style={{ color: colors.onSurface }} className="font-bold">
                                            {formatMonthYear(month)}
                                        </Text>
                                    </View>

                                    {/* Month's Measurements */}
                                    {monthMeasurements
                                        .sort((a, b) => b.measurement_date.localeCompare(a.measurement_date))
                                        .map((measurement) => {
                                            const nutritionalColor = getStatusColor(measurement.status.nutritional, colors);
                                            const isDeleting = deletingId === measurement.id;

                                            return (
                                                <View
                                                    key={measurement.id}
                                                    style={{ backgroundColor: colors.surfaceContainerHigh, opacity: isDeleting ? 0.5 : 1 }}
                                                    className="rounded-xl overflow-hidden"
                                                >
                                                    <View className="p-4 gap-3">
                                                        {/* Date and Status */}
                                                        <View className="flex-row justify-between items-start">
                                                            <View className="flex-1">
                                                                <Text style={{ color: colors.outline }} className="text-xs font-medium uppercase tracking-wide">
                                                                    {formatDate(measurement.measurement_date)}
                                                                </Text>
                                                                {measurement.measurement_location && (
                                                                    <View className="flex-row items-center gap-1 mt-1">
                                                                        <MaterialIcons name="place" size={14} color={colors.outline} />
                                                                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs capitalize">
                                                                            {measurement.measurement_location}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </View>
                                                            <View style={{ backgroundColor: nutritionalColor.bg }} className="px-2.5 py-1 rounded-full">
                                                                <Text style={{ color: nutritionalColor.text }} className="text-xs font-semibold">
                                                                    {measurement.status.nutritional}
                                                                </Text>
                                                            </View>
                                                        </View>

                                                        {/* Measurements Grid */}
                                                        <View className="flex-row gap-3">
                                                            <View className="flex-1 flex-row items-center gap-2">
                                                                <View style={{ backgroundColor: colors.primaryContainer }} className="w-8 h-8 rounded-full items-center justify-center">
                                                                    <MaterialIcons name="monitor-weight" size={16} color={colors.primary} />
                                                                </View>
                                                                <View>
                                                                    <Text style={{ color: colors.onSurface }} className="text-base font-bold">
                                                                        {measurement.weight.toFixed(1)} kg
                                                                    </Text>
                                                                    <Text style={{ color: colors.outline }} className="text-xs">Berat</Text>
                                                                </View>
                                                            </View>
                                                            <View className="flex-1 flex-row items-center gap-2">
                                                                <View style={{ backgroundColor: colors.tertiaryContainer }} className="w-8 h-8 rounded-full items-center justify-center">
                                                                    <MaterialIcons name="height" size={16} color={colors.tertiary} />
                                                                </View>
                                                                <View>
                                                                    <Text style={{ color: colors.onSurface }} className="text-base font-bold">
                                                                        {measurement.height.toFixed(1)} cm
                                                                    </Text>
                                                                    <Text style={{ color: colors.outline }} className="text-xs">Tinggi</Text>
                                                                </View>
                                                            </View>
                                                            {measurement.head_circumference && (
                                                                <View className="flex-1 flex-row items-center gap-2">
                                                                    <View style={{ backgroundColor: colors.secondaryContainer }} className="w-8 h-8 rounded-full items-center justify-center">
                                                                        <MaterialIcons name="face" size={16} color={colors.secondary} />
                                                                    </View>
                                                                    <View>
                                                                        <Text style={{ color: colors.onSurface }} className="text-base font-bold">
                                                                            {measurement.head_circumference.toFixed(1)} cm
                                                                        </Text>
                                                                        <Text style={{ color: colors.outline }} className="text-xs">LK</Text>
                                                                    </View>
                                                                </View>
                                                            )}
                                                        </View>

                                                        {/* Z-Scores Summary */}
                                                        <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="p-3 rounded-lg flex-row justify-between">
                                                            <View className="items-center">
                                                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">BB/U</Text>
                                                                <Text style={{ color: colors.onSurface }} className="text-sm font-bold">
                                                                    {measurement.z_scores.weight_for_age.toFixed(1)}
                                                                </Text>
                                                            </View>
                                                            <View className="items-center">
                                                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">TB/U</Text>
                                                                <Text style={{ color: colors.onSurface }} className="text-sm font-bold">
                                                                    {measurement.z_scores.height_for_age.toFixed(1)}
                                                                </Text>
                                                            </View>
                                                            <View className="items-center">
                                                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">BB/TB</Text>
                                                                <Text style={{ color: colors.onSurface }} className="text-sm font-bold">
                                                                    {measurement.z_scores.weight_for_height.toFixed(1)}
                                                                </Text>
                                                            </View>
                                                            <View className="items-center">
                                                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">BMI</Text>
                                                                <Text style={{ color: colors.onSurface }} className="text-sm font-bold">
                                                                    {measurement.bmi.toFixed(1)}
                                                                </Text>
                                                            </View>
                                                        </View>

                                                        {/* Notes if present */}
                                                        {measurement.notes && (
                                                            <View className="flex-row items-start gap-2">
                                                                <MaterialIcons name="sticky-note-2" size={14} color={colors.outline} style={{ marginTop: 2 }} />
                                                                <Text style={{ color: colors.onSurfaceVariant }} className="text-sm italic flex-1">
                                                                    {measurement.notes}
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>

                                                    {/* Actions */}
                                                    <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="flex-row border-t border-gray-200">
                                                        <TouchableOpacity
                                                            onPress={() => router.push(`/anthropometry/input?id=${measurement.id}`)}
                                                            className="flex-1 flex-row items-center justify-center gap-2 py-3"
                                                            disabled={isDeleting}
                                                        >
                                                            <MaterialIcons name="edit" size={18} color={colors.primary} />
                                                            <Text style={{ color: colors.primary }} className="font-medium">Edit</Text>
                                                        </TouchableOpacity>
                                                        <View style={{ backgroundColor: colors.outlineVariant }} className="w-px" />
                                                        <TouchableOpacity
                                                            onPress={() => handleDelete(measurement)}
                                                            className="flex-1 flex-row items-center justify-center gap-2 py-3"
                                                            disabled={isDeleting}
                                                        >
                                                            {isDeleting ? (
                                                                <ActivityIndicator size="small" color={colors.error} />
                                                            ) : (
                                                                <>
                                                                    <MaterialIcons name="delete" size={18} color={colors.error} />
                                                                    <Text style={{ color: colors.error }} className="font-medium">Hapus</Text>
                                                                </>
                                                            )}
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                </View>
                            ))
                    ) : (
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-xl p-6 items-center">
                            <MaterialIcons name="straighten" size={48} color={colors.onSurfaceVariant} />
                            <Text style={{ color: colors.onSurface }} className="font-bold mt-3">Belum Ada Data</Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm text-center mt-1">
                                Mulai catat pengukuran antropometri anak Anda.
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/anthropometry/input')}
                                style={{ backgroundColor: colors.primary }}
                                className="mt-4 px-6 py-3 rounded-xl flex-row items-center gap-2"
                            >
                                <MaterialIcons name="add" size={20} color={colors.onPrimary} />
                                <Text style={{ color: colors.onPrimary }} className="font-bold">Input Pengukuran</Text>
                            </TouchableOpacity>
                        </View>
                    )}

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

                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
