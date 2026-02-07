import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { useLatestScreening, useInProgressScreening } from '@/services/hooks/use-screenings';
import { NetworkErrorView, EmptyStateView } from '@/components/NetworkErrorView';
import { CardSkeleton, ListItemSkeleton } from '@/components/Skeleton';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

export default function ScreeningTabScreen() {
    const { colors } = useTheme();

    const { data: child, isLoading: isLoadingChild } = useActiveChild();
    const childId = child?.id ?? 0;

    const {
        data: latestScreening,
        isLoading: isLoadingScreening,
        isError,
        error,
        refetch
    } = useLatestScreening(childId);

    const { data: inProgressScreening } = useInProgressScreening(childId);

    const isLoading = isLoadingChild || isLoadingScreening;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Sesuai':
            case 'Sesuai Harapan':
                return { bg: colors.primaryContainer, text: colors.onPrimaryContainer };
            case 'Pantau':
            case 'Perlu Pemantauan':
                return { bg: colors.tertiaryContainer, text: colors.onTertiaryContainer };
            case 'Perlu Rujukan':
                return { bg: colors.errorContainer, text: colors.error };
            default:
                return { bg: colors.surfaceContainerHigh, text: colors.onSurface };
        }
    };

    const domainIcons: Record<string, string> = {
        communication: 'chat-bubble',
        gross_motor: 'directions-run',
        fine_motor: 'edit',
        problem_solving: 'extension',
        personal_social: 'people',
    };

    const getOverallStatusBanner = (status: string | null) => {
        switch (status) {
            case 'Sesuai':
            case 'Sesuai Harapan':
                return {
                    title: 'Perkembangan Sesuai Umur',
                    icon: 'verified' as const,
                    bg: colors.primaryContainer,
                    iconBg: colors.primary,
                    iconColor: colors.onPrimary,
                    textColor: colors.onPrimaryContainer,
                };
            case 'Perlu Pemantauan':
            case 'Pantau':
                return {
                    title: 'Perlu Pemantauan',
                    icon: 'warning' as const,
                    bg: colors.tertiaryContainer,
                    iconBg: colors.tertiary,
                    iconColor: colors.onTertiary,
                    textColor: colors.onTertiaryContainer,
                };
            case 'Perlu Rujukan':
                return {
                    title: 'Perlu Rujukan',
                    icon: 'error' as const,
                    bg: colors.errorContainer,
                    iconBg: colors.error,
                    iconColor: colors.onError,
                    textColor: colors.onErrorContainer,
                };
            default:
                return {
                    title: 'Hasil Screening',
                    icon: 'assignment' as const,
                    bg: colors.surfaceContainerHigh,
                    iconBg: colors.primary,
                    iconColor: colors.onPrimary,
                    textColor: colors.onSurface,
                };
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 px-4 pt-4 pb-6 gap-6">
                    <View className="flex-row items-center justify-between pb-2">
                        <Text style={{ color: colors.onSurface }} className="text-2xl font-bold tracking-tight">Tumbuh Kembang</Text>
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

    // Error state
    if (isError) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 p-4">
                    <NetworkErrorView error={error} onRetry={refetch} />
                </View>
            </SafeAreaView>
        );
    }

    const overallBanner = getOverallStatusBanner(latestScreening?.overall_status_label ?? null);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center justify-between p-4 pb-2">
                <Text style={{ color: colors.onSurface }} className="text-2xl font-bold tracking-tight">Tumbuh Kembang</Text>
                <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerHigh }} className="w-10 h-10 rounded-full items-center justify-center">
                    <MaterialIcons name="notifications" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            >
                {/* Child Profile Card */}
                <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="p-4 rounded-2xl mb-6 flex-row items-center gap-4">
                    <Image
                        source={{ uri: child?.avatar_url ?? 'https://via.placeholder.com/100' }}
                        className="w-14 h-14 rounded-full"
                        contentFit="cover"
                    />
                    <View className="flex-1">
                        <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight">{child?.name ?? ''}</Text>
                        <View className="flex-row items-center gap-2 mt-0.5">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">{child?.age?.label ?? ''}</Text>
                            <View style={{ backgroundColor: colors.outline }} className="w-1 h-1 rounded-full" />
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">{child?.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</Text>
                        </View>
                    </View>
                    {latestScreening?.overall_status_label && (
                        <View style={{ backgroundColor: getStatusColor(latestScreening.overall_status_label).bg }} className="px-3 py-1.5 rounded-full">
                            <Text style={{ color: getStatusColor(latestScreening.overall_status_label).text }} className="text-xs font-bold">{latestScreening.overall_status_label}</Text>
                        </View>
                    )}
                </View>

                {/* Last Screening Summary */}
                {latestScreening ? (
                    <View className="mb-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text style={{ color: colors.onSurface }} className="text-base font-bold">Hasil Screening Terakhir</Text>
                            <View className="flex-row items-center gap-1">
                                <MaterialIcons name="calendar-today" size={14} color={colors.onSurfaceVariant} />
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">{latestScreening.screening_date}</Text>
                            </View>
                        </View>

                        {/* Overall Result Banner */}
                        <View style={{ backgroundColor: overallBanner.bg }} className="p-4 rounded-2xl flex-row items-center gap-4 mb-4">
                            <View style={{ backgroundColor: overallBanner.iconBg }} className="w-12 h-12 rounded-full items-center justify-center">
                                <MaterialIcons name={overallBanner.icon} size={28} color={overallBanner.iconColor} />
                            </View>
                            <View className="flex-1">
                                <Text style={{ color: overallBanner.textColor }} className="font-bold text-lg leading-tight">{overallBanner.title}</Text>
                                <Text style={{ color: overallBanner.textColor }} className="text-sm mt-0.5 opacity-80">Usia screening: {latestScreening.age_interval?.age_label ?? ''}</Text>
                            </View>
                        </View>

                        {/* Domain Scores */}
                        <View className="gap-3">
                            {latestScreening.results.map((result, idx) => {
                                const statusColors = getStatusColor(result.status_label);
                                const progressWidth = Math.min((result.total_score / 60) * 100, 100);
                                const iconName = domainIcons[result.domain.code] ?? 'help-outline';

                                return (
                                    <View key={idx} style={{ backgroundColor: colors.surfaceContainerHigh }} className="p-4 rounded-xl">
                                        <View className="flex-row justify-between items-center mb-3">
                                            <View className="flex-row items-center gap-2.5">
                                                <View style={{ backgroundColor: `${result.domain.color}20` }} className="p-1.5 rounded-lg">
                                                    <MaterialIcons name={iconName as keyof typeof MaterialIcons.glyphMap} size={18} color={result.domain.color} />
                                                </View>
                                                <Text style={{ color: colors.onSurface }} className="font-bold">{result.domain.name}</Text>
                                            </View>
                                            <View style={{ backgroundColor: statusColors.bg }} className="px-2.5 py-1 rounded-full">
                                                <Text style={{ color: statusColors.text }} className="text-xs font-bold">{result.status_label}</Text>
                                            </View>
                                        </View>
                                        {/* Progress Bar */}
                                        <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="h-2 rounded-full overflow-hidden mb-2">
                                            <View
                                                style={{ backgroundColor: result.status_label === 'Perlu Pemantauan' || result.status_label === 'Pantau' ? colors.tertiary : colors.primary, width: `${progressWidth}%` }}
                                                className="h-full rounded-full"
                                            />
                                        </View>
                                        <View className="flex-row justify-between">
                                            <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">Skor: <Text className="text-base">{result.total_score}</Text></Text>
                                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">Cutoff: {result.cutoff_score}</Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                ) : (
                    <View className="mb-6">
                        <Text style={{ color: colors.onSurface }} className="text-base font-bold mb-3">Hasil Screening Terakhir</Text>
                        <EmptyStateView
                            icon="assignment"
                            title="Belum Ada Hasil Screening"
                            message="Belum ada hasil screening untuk anak ini. Mulai tes ASQ-3 untuk mengetahui perkembangan anak."
                        />
                    </View>
                )}

                {/* Recommendations Preview - only show when there's a screening */}
                {latestScreening && (
                    <View className="mb-6">
                        <Text style={{ color: colors.onSurface }} className="text-base font-bold mb-3">Rekomendasi Stimulasi</Text>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-2xl overflow-hidden">
                            <View style={{ backgroundColor: colors.primaryContainer }} className="p-4 flex-row items-center gap-3">
                                <View style={{ backgroundColor: colors.primary }} className="p-2 rounded-full">
                                    <MaterialIcons name="lightbulb" size={18} color={colors.onPrimary} />
                                </View>
                                <Text style={{ color: colors.onPrimaryContainer }} className="text-sm font-bold">Tips Stimulasi Usia {latestScreening.age_interval?.age_label ?? ''}</Text>
                            </View>
                            <View className="p-4 gap-3">
                                <View className="flex-row gap-3 items-start">
                                    <MaterialIcons name="check-circle" size={18} color={colors.primary} />
                                    <Text style={{ color: colors.onSurface }} className="text-sm leading-relaxed flex-1">Ajak anak berbicara saat melakukan aktivitas sehari-hari.</Text>
                                </View>
                                <View className="flex-row gap-3 items-start">
                                    <MaterialIcons name="check-circle" size={18} color={colors.primary} />
                                    <Text style={{ color: colors.onSurface }} className="text-sm leading-relaxed flex-1">Berikan kesempatan anak memegang sendok dan makan sendiri.</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (latestScreening) {
                                            router.push({
                                                pathname: '/screening/result',
                                                params: {
                                                    screeningId: latestScreening.id.toString(),
                                                    childId: childId.toString()
                                                }
                                            });
                                        }
                                    }}
                                    style={{ borderColor: colors.outline }}
                                    className="mt-2 py-2.5 rounded-xl border flex-row justify-center items-center gap-2"
                                >
                                    <Text style={{ color: colors.primary }} className="text-sm font-bold">Lihat Semua</Text>
                                    <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Start New Screening Button */}
                <TouchableOpacity
                    onPress={() => {
                        if (inProgressScreening) {
                            router.push({
                                pathname: '/screening/questionnaire',
                                params: {
                                    screeningId: inProgressScreening.id.toString(),
                                    childId: childId.toString(),
                                    ageIntervalId: inProgressScreening.age_interval.id.toString()
                                }
                            });
                        } else {
                            router.push({
                                pathname: '/screening/questionnaire',
                                params: { childId: childId.toString() }
                            });
                        }
                    }}
                    style={{ backgroundColor: colors.primary }}
                    className="py-4 rounded-xl flex-row items-center justify-center gap-2"
                >
                    <MaterialIcons name="play-arrow" size={24} color={colors.onPrimary} />
                    <Text style={{ color: colors.onPrimary }} className="font-bold text-base">
                        {inProgressScreening ? 'Lanjutkan Tes ASQ-3' : 'Mulai Tes ASQ-3 Baru'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
