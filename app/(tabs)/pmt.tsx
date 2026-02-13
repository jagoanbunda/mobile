import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { useCurrentMonthPmtProgress, useTodayPmtSchedule, usePmtSchedules } from '@/services/hooks/use-pmt';
import { NetworkErrorView, EmptyStateView } from '@/components/NetworkErrorView';
import { CardSkeleton, ListItemSkeleton } from '@/components/Skeleton';
import { RequireChild } from '@/components/RequireChild';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

export default function PMTTabScreen() {
    const { colors } = useTheme();

    const { data: child, isLoading: isLoadingChild, hasChildren } = useActiveChild();
    const childId = child?.id ?? 0;

    const { data: progress, isLoading: isLoadingProgress, isError: isProgressError, error: progressError, refetch: refetchProgress } = useCurrentMonthPmtProgress(childId);
    const { data: todaySchedule, isLoading: isLoadingToday } = useTodayPmtSchedule(childId);
    const { data: schedules, isLoading: isLoadingSchedules } = usePmtSchedules(childId);

    const isLoading = isLoadingChild || isLoadingProgress || isLoadingToday || isLoadingSchedules;
    const isError = isProgressError;

    // Get last 3 logged schedules for history
    const recentHistory = schedules?.filter(s => s.is_logged).slice(0, 3) ?? [];

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View testID="loading-indicator" className="flex-1 px-4 pt-4 pb-6 gap-6">
                    <View className="flex-row items-center justify-between pb-2">
                        <Text style={{ color: colors.onSurface }} className="text-2xl font-bold tracking-tight">PMT</Text>
                    </View>
                    <CardSkeleton />
                    <View className="gap-4">
                        <ListItemSkeleton />
                        <ListItemSkeleton />
                        <ListItemSkeleton />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // No children registered - show RequireChild prompt
    if (!hasChildren) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <RequireChild message="Tambahkan data anak terlebih dahulu untuk melihat program PMT.">
                    <View />
                </RequireChild>
            </SafeAreaView>
        );
    }

    // Error state
    if (isError) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 p-4">
                    <NetworkErrorView error={progressError} onRetry={refetchProgress} />
                </View>
            </SafeAreaView>
        );
    }

    // Empty state
    if (!progress) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 items-center justify-center p-4">
                    <EmptyStateView 
                        icon="event-busy"
                        title="Tidak Ada Program PMT"
                        message="Belum ada program PMT yang aktif untuk anak ini."
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-4 pb-2 mb-4">
                <Text style={{ color: colors.onSurface }} className="text-2xl font-bold tracking-tight">PMT</Text>
                <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerHigh }} className="w-10 h-10 rounded-full items-center justify-center">
                    <MaterialIcons name="notifications" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            >
                {/* Status Card */}
                <View style={{ backgroundColor: colors.card }} className="rounded-2xl p-5 mb-6 shadow-sm">
                    <View className="flex-row items-center gap-3 mb-4">
                        <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center">
                            <MaterialIcons name="verified" size={24} color="#16A34A" />
                        </View>
                        <View>
                            <Text style={{ color: colors.onSurface }} className="text-lg font-bold">Program PMT Aktif</Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">Hari ke-{progress.summary.total_logged} dari {progress.summary.total_scheduled} hari</Text>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="mb-2">
                        <View className="flex-row justify-between mb-1">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">Progress</Text>
                            <Text style={{ color: colors.onSurface }} className="text-xs font-bold">{Math.floor(progress.summary.compliance_rate)}%</Text>
                        </View>
                        <View style={{ backgroundColor: colors.outlineVariant }} className="h-3 w-full rounded-full overflow-hidden">
                            <View style={{ backgroundColor: colors.primary, width: `${Math.floor(progress.summary.compliance_rate)}%` }} className="h-full rounded-full" />
                        </View>
                    </View>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">{progress.summary.pending} hari lagi</Text>
                </View>

                {/* Quick Actions */}
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold mb-4">Aksi Cepat</Text>
                <View className="flex-row gap-3 mb-6">
                    <TouchableOpacity
                        onPress={() => router.push('/pmt/report')}
                        style={{ backgroundColor: colors.primary }}
                        className="flex-1 py-4 rounded-xl items-center justify-center"
                    >
                        <MaterialIcons name="add-a-photo" size={24} color={colors.onPrimary} />
                        <Text style={{ color: colors.onPrimary }} className="font-bold mt-2">Lapor Hari Ini</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/pmt/history')}
                        style={{ backgroundColor: colors.card }}
                        className="flex-1 py-4 rounded-xl items-center justify-center shadow-sm"
                    >
                        <MaterialIcons name="history" size={24} color={colors.primary} />
                        <Text style={{ color: colors.onSurface }} className="font-bold mt-2">Riwayat</Text>
                    </TouchableOpacity>
                </View>

                {/* Today's Menu */}
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold mb-4">Menu Hari Ini</Text>
                <View style={{ backgroundColor: colors.card }} className="rounded-xl p-4 mb-6 shadow-sm">
                    <View className="flex-row items-center gap-4">
                        <View style={{ backgroundColor: colors.secondaryContainer }} className="w-12 h-12 rounded-lg items-center justify-center">
                            <MaterialIcons name="restaurant-menu" size={24} color={colors.primary} />
                        </View>
                        <View className="flex-1">
                            <Text style={{ color: colors.onSurface }} className="font-bold">
                                {todaySchedule ? (todaySchedule.menu?.name ?? 'Menu belum ditentukan') : 'Tidak ada jadwal hari ini'}
                            </Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">
                                {todaySchedule ? 'Disiapkan oleh Kader Posyandu' : 'Silakan cek kembali besok'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Recent History */}
                <View className="flex-row items-center justify-between mb-4">
                    <Text style={{ color: colors.onSurface }} className="text-lg font-bold">Riwayat Terakhir</Text>
                    <TouchableOpacity onPress={() => router.push('/pmt/history')}>
                        <Text style={{ color: colors.primary }} className="text-sm font-bold">Lihat Semua</Text>
                    </TouchableOpacity>
                </View>

                <View className="gap-3">
                    {recentHistory.map((schedule, index) => {
                        const portionColors: Record<string, { bg: string; text: string; icon: string }> = {
                            habis: { bg: 'bg-green-100', text: 'text-green-700', icon: '#16A34A' },
                            half: { bg: 'bg-orange-100', text: 'text-orange-700', icon: '#EA580C' },
                            quarter: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '#CA8A04' },
                            none: { bg: 'bg-red-100', text: 'text-red-700', icon: '#DC2626' },
                        };
                        const portionLabels: Record<string, string> = {
                            habis: 'Habis',
                            half: '1/2 Porsi',
                            quarter: '1/4 Porsi',
                            none: 'Tidak Makan',
                        };
                        const portionIcons: Record<string, string> = {
                            habis: 'check-circle',
                            half: 'timelapse',
                            quarter: 'timelapse',
                            none: 'cancel',
                        };
                        const portion = schedule.log?.portion ?? 'none';
                        const color = portionColors[portion] ?? portionColors.none;
                        const label = portionLabels[portion] ?? portionLabels.none;
                        const iconName = portionIcons[portion] ?? portionIcons.none;

                        return (
                            <View key={schedule.id} style={{ backgroundColor: colors.card }} className="rounded-xl p-4 shadow-sm">
                                <View className="flex-row justify-between items-start">
                                    <View>
                                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs uppercase tracking-wide">
                                            {schedule.scheduled_date}
                                        </Text>
                                        <Text style={{ color: colors.onSurface }} className="font-bold mt-1">{schedule.menu?.name ?? 'Menu tidak tersedia'}</Text>
                                    </View>
                                    <View className={`flex-row items-center gap-1 px-2.5 py-1 rounded-full ${color.bg}`}>
                                        <MaterialIcons name={iconName as keyof typeof MaterialIcons.glyphMap} size={14} color={color.icon} />
                                        <Text className={`text-xs font-bold ${color.text}`}>{label}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                    {recentHistory.length === 0 && (
                        <View style={{ backgroundColor: colors.card }} className="rounded-xl p-4 shadow-sm">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-center">
                                Belum ada riwayat konsumsi
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
