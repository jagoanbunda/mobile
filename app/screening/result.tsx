import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useChild } from '@/services/hooks/use-children';
import { useScreeningResults } from '@/services/hooks/use-screenings';
import { NetworkErrorView } from '@/components/NetworkErrorView';

export default function ScreeningResultScreen() {
    const { colors } = useTheme();
    const params = useLocalSearchParams<{ screeningId?: string; childId?: string }>();
    const screeningId = params.screeningId ? parseInt(params.screeningId) : 0;
    const childId = params.childId ? parseInt(params.childId) : 0;

    // Redirect if missing params
    useEffect(() => {
        if (!screeningId || !childId) {
            router.replace('/(tabs)/screening');
        }
    }, [screeningId, childId]);

    // Fetch data
    const { data: childData, isLoading: isLoadingChild } = useChild(childId);
    const {
        data: resultsData,
        isLoading: isLoadingResults,
        isError,
        error,
        refetch,
    } = useScreeningResults(childId, screeningId);

    const isLoading = isLoadingChild || isLoadingResults;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Sesuai':
            case 'Sesuai Harapan':
                return { bg: colors.primaryContainer, text: colors.onPrimaryContainer, bar: colors.primary };
            case 'Pantau':
            case 'Perlu Pemantauan':
                return { bg: colors.tertiaryContainer, text: colors.onTertiaryContainer, bar: colors.tertiary };
            case 'Perlu Rujukan':
                return { bg: colors.errorContainer, text: colors.error, bar: colors.error };
            default:
                return { bg: colors.surfaceContainerHigh, text: colors.onSurface, bar: colors.outline };
        }
    };

    const getOverallStatusDisplay = (status: string | undefined) => {
        switch (status) {
            case 'sesuai':
                return {
                    message: 'Perkembangan Sesuai Umur',
                    description: 'Secara umum perkembangan anak sangat baik.',
                    icon: 'verified' as const,
                    bg: colors.primaryContainer,
                    iconBg: colors.primary,
                };
            case 'pantau':
                return {
                    message: 'Perlu Pemantauan',
                    description: 'Beberapa aspek perkembangan perlu dipantau lebih lanjut.',
                    icon: 'warning' as const,
                    bg: colors.tertiaryContainer,
                    iconBg: colors.tertiary,
                };
            case 'perlu_rujukan':
                return {
                    message: 'Perlu Rujukan',
                    description: 'Disarankan untuk berkonsultasi dengan tenaga kesehatan.',
                    icon: 'error' as const,
                    bg: colors.errorContainer,
                    iconBg: colors.error,
                };
            default:
                return {
                    message: 'Hasil Screening',
                    description: 'Lihat detail hasil di bawah.',
                    icon: 'assignment' as const,
                    bg: colors.surfaceContainerHigh,
                    iconBg: colors.primary,
                };
        }
    };

    const domainIcons: Record<string, string> = {
        communication: 'chat-bubble',
        gross_motor: 'directions-run',
        fine_motor: 'edit',
        problem_solving: 'extension',
        personal_social: 'people',
    };

    const overallStatus = getOverallStatusDisplay(resultsData?.screening?.overall_status);

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ color: colors.onSurfaceVariant }} className="mt-4 text-sm">
                        Memuat hasil screening...
                    </Text>
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ backgroundColor: colors.surface }} className="flex-row items-center p-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ backgroundColor: colors.surfaceContainerHigh }}
                    className="p-2 rounded-full"
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
                </TouchableOpacity>
                <Text style={{ color: colors.onSurface }} className="flex-1 text-center font-bold text-lg tracking-tight">Hasil Screening</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Celebratory Header */}
                <View className="items-center pt-4 pb-6 px-4">
                    <View style={{ backgroundColor: colors.primary }} className="w-20 h-20 rounded-full items-center justify-center mb-4">
                        <MaterialIcons name="check-circle" size={48} color={colors.onPrimary} />
                    </View>
                    <Text style={{ color: colors.onSurface }} className="text-[28px] font-extrabold leading-tight text-center tracking-tight">Skrining Selesai!</Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-base font-medium leading-normal pt-2 text-center">Data tumbuh kembang anak berhasil disimpan.</Text>
                </View>

                <View className="gap-6 px-4">
                    {/* Patient Card */}
                    <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="p-5 rounded-2xl flex-row items-center gap-4">
                        <Image source={{ uri: childData?.avatar_url ?? 'https://via.placeholder.com/100' }} className="w-16 h-16 rounded-full" contentFit="cover" />
                        <View className="justify-center">
                            <Text style={{ color: colors.onSurface }} className="text-xl font-bold leading-tight">{childData?.name ?? ''}</Text>
                            <View className="flex-row items-center gap-3 mt-1.5">
                                <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="flex-row items-center gap-1 px-2 py-0.5 rounded">
                                    <MaterialIcons name="calendar-today" size={14} color={colors.onSurfaceVariant} />
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-semibold">{childData?.age?.label ?? ''}</Text>
                                </View>
                                <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="flex-row items-center gap-1 px-2 py-0.5 rounded">
                                    <MaterialIcons name="face" size={14} color={colors.onSurfaceVariant} />
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-semibold">{childData?.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Overall Result Banner */}
                    <View>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold mb-3 uppercase tracking-wider px-1">Hasil Keseluruhan</Text>
                        <View style={{ backgroundColor: overallStatus.bg }} className="p-5 rounded-2xl flex-row items-start gap-4">
                            <View style={{ backgroundColor: overallStatus.iconBg }} className="w-10 h-10 rounded-full items-center justify-center mt-1">
                                <MaterialIcons name={overallStatus.icon} size={24} color={colors.onPrimary} />
                            </View>
                            <View className="flex-1">
                                <Text style={{ color: colors.onPrimaryContainer }} className="font-bold text-lg leading-tight">{overallStatus.message}</Text>
                                <Text style={{ color: colors.onPrimaryContainer }} className="text-sm mt-1.5 leading-relaxed opacity-80">{overallStatus.description}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Domain Breakdown */}
                    <View>
                        <View className="flex-row justify-between items-end mb-4 px-1">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold uppercase tracking-wider">Detail Per Domain</Text>
                            <TouchableOpacity>
                                <Text style={{ color: colors.primary }} className="text-xs font-bold">Lihat Grafik Lengkap</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="gap-3">
                            {resultsData?.results.map((result, idx) => {
                                const statusColors = getStatusColor(result.status_label);
                                const iconName = domainIcons[result.domain.code] ?? 'help-outline';
                                const percentage = Math.min((result.total_score / 60) * 100, 100);
                                const isPantau = result.status === 'pantau' || result.status_label === 'Perlu Pemantauan';

                                return (
                                    <View
                                        key={idx}
                                        style={{
                                            backgroundColor: colors.surfaceContainerHigh,
                                            borderColor: isPantau ? colors.tertiary : 'transparent',
                                            borderWidth: isPantau ? 1 : 0,
                                        }}
                                        className="p-4 rounded-xl"
                                    >
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
                                        <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="relative h-2.5 w-full rounded-full mb-2.5 overflow-hidden">
                                            <View style={{ left: `${(result.cutoff_score / 60) * 100}%` }} className="absolute top-0 bottom-0 w-0.5 bg-black/20 z-10" />
                                            <View style={{ backgroundColor: statusColors.bar, width: `${percentage}%` }} className="absolute top-0 left-0 h-full rounded-full" />
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

                    {/* Recommendations */}
                    {resultsData?.recommendations && resultsData.recommendations.length > 0 && (
                        <View>
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold mb-3 uppercase tracking-wider px-1">
                                Rekomendasi Pengasuhan
                            </Text>
                            <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-2xl overflow-hidden">
                                <View style={{ backgroundColor: colors.primaryContainer }} className="p-4 flex-row items-center gap-3">
                                    <View style={{ backgroundColor: colors.primary }} className="p-1.5 rounded-full">
                                        <MaterialIcons name="lightbulb" size={18} color={colors.onPrimary} />
                                    </View>
                                    <Text style={{ color: colors.onPrimaryContainer }} className="text-sm font-bold">
                                        Tips Stimulasi Usia {childData?.age?.label ?? ''}
                                    </Text>
                                </View>
                                <View className="p-4 pt-5 gap-4">
                                    {resultsData.recommendations.map((rec, idx) => (
                                        <View key={idx} className="flex-row gap-3 items-start">
                                            <MaterialIcons name="check" size={18} color={colors.primary} />
                                            <Text style={{ color: colors.onSurface }} className="text-sm leading-relaxed flex-1">
                                                {rec.description}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={{ backgroundColor: colors.surface }} className="absolute bottom-0 left-0 w-full p-4 pb-8">
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/screening')}
                    style={{ backgroundColor: colors.primary }}
                    className="w-full items-center justify-center py-4 rounded-xl"
                >
                    <Text style={{ color: colors.onPrimary }} className="font-extrabold text-base">KEMBALI KE TUMBUH KEMBANG</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
