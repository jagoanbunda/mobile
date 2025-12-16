import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const resultData = {
    child: {
        name: 'Ananda Rizky',
        age: '24 Bulan',
        gender: 'Laki-laki',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCneOqf5Hu70YeaSWtdsy33AkF1GLiIIdJYpXTzK8EVidyILR8jMcAxp035pJpAUf8fTivAR5jfUHJwAf_W-lX-64wsAwtGTf1KkUp6K5IGyvaZ4YjwZ298KW7RYZgkKWqWiy7AnR_G08Z8IFkOMjtUpOvMkNM5PD7qSVjps8WdSQfPmGjwMgeGJ0M18A2Z9WsAW_ey8qhaGNqqdoEBUo7Ro-GjgrcUh7lEzZ_9GBssn_Zj9RHCLZ9TZx6TqGEtK76Y5mO3KVqFRo',
    },
    overallStatus: 'Sesuai',
    overallMessage: 'Perkembangan Sesuai Umur',
    overallDescription: 'Secara umum perkembangan anak sangat baik. Tidak ditemukan indikasi keterlambatan yang signifikan.',
    domains: [
        { name: 'Komunikasi', icon: 'chat-bubble', color: '#2563EB', score: 55, cutoff: 25.17, status: 'Sesuai', percentage: 85 },
        { name: 'Motorik Kasar', icon: 'directions-run', color: '#EA580C', score: 60, cutoff: 38.00, status: 'Sesuai', percentage: 90 },
        { name: 'Motorik Halus', icon: 'edit', color: '#9333EA', score: 35, cutoff: 35.00, status: 'Pantau', percentage: 45, warning: 'Skor berada pada ambang batas. Disarankan untuk memberikan stimulasi tambahan pada aktivitas menggambar dan menyusun balok.' },
        { name: 'Pemecahan Masalah', icon: 'extension', color: '#DC2626', score: 50, cutoff: 30.00, status: 'Sesuai', percentage: 75 },
        { name: 'Personal Sosial', icon: 'people', color: '#059669', score: 45, cutoff: 25.00, status: 'Sesuai', percentage: 80 },
    ],
    recommendations: [
        'Ajak anak berbicara saat melakukan aktivitas sehari-hari (mandi, makan) untuk melatih kosa kata.',
        'Berikan kesempatan anak untuk memegang sendok dan makan sendiri untuk melatih motorik halus.',
        'Sediakan kertas dan krayon besar, biarkan anak mencoret-coret bebas.',
    ],
};

export default function ScreeningResultScreen() {
    const { colors } = useTheme();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Sesuai': return { bg: colors.primaryContainer, text: colors.onPrimaryContainer, bar: colors.primary };
            case 'Pantau': return { bg: colors.tertiaryContainer, text: colors.onTertiaryContainer, bar: colors.tertiary };
            case 'Perlu Rujukan': return { bg: colors.errorContainer, text: colors.error, bar: colors.error };
            default: return { bg: colors.surfaceContainerHigh, text: colors.onSurface, bar: colors.outline };
        }
    };

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
                        <Image source={{ uri: resultData.child.photo }} className="w-16 h-16 rounded-full" contentFit="cover" />
                        <View className="justify-center">
                            <Text style={{ color: colors.onSurface }} className="text-xl font-bold leading-tight">{resultData.child.name}</Text>
                            <View className="flex-row items-center gap-3 mt-1.5">
                                <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="flex-row items-center gap-1 px-2 py-0.5 rounded">
                                    <MaterialIcons name="calendar-today" size={14} color={colors.onSurfaceVariant} />
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-semibold">{resultData.child.age}</Text>
                                </View>
                                <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="flex-row items-center gap-1 px-2 py-0.5 rounded">
                                    <MaterialIcons name="face" size={14} color={colors.onSurfaceVariant} />
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-semibold">{resultData.child.gender}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Overall Result Banner */}
                    <View>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold mb-3 uppercase tracking-wider px-1">Hasil Keseluruhan</Text>
                        <View style={{ backgroundColor: colors.primaryContainer }} className="p-5 rounded-2xl flex-row items-start gap-4">
                            <View style={{ backgroundColor: colors.primary }} className="w-10 h-10 rounded-full items-center justify-center mt-1">
                                <MaterialIcons name="verified" size={24} color={colors.onPrimary} />
                            </View>
                            <View className="flex-1">
                                <Text style={{ color: colors.onPrimaryContainer }} className="font-bold text-lg leading-tight">{resultData.overallMessage}</Text>
                                <Text style={{ color: colors.onPrimaryContainer }} className="text-sm mt-1.5 leading-relaxed opacity-80">{resultData.overallDescription}</Text>
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
                            {resultData.domains.map((domain, idx) => {
                                const statusColors = getStatusColor(domain.status);

                                return (
                                    <View
                                        key={idx}
                                        style={{
                                            backgroundColor: colors.surfaceContainerHigh,
                                            borderColor: domain.status === 'Pantau' ? colors.tertiary : 'transparent',
                                            borderWidth: domain.status === 'Pantau' ? 1 : 0,
                                        }}
                                        className="p-4 rounded-xl"
                                    >
                                        <View className="flex-row justify-between items-center mb-3">
                                            <View className="flex-row items-center gap-2.5">
                                                <View style={{ backgroundColor: `${domain.color}20` }} className="p-1.5 rounded-lg">
                                                    <MaterialIcons name={domain.icon as any} size={18} color={domain.color} />
                                                </View>
                                                <Text style={{ color: colors.onSurface }} className="font-bold">{domain.name}</Text>
                                            </View>
                                            <View style={{ backgroundColor: statusColors.bg }} className="px-2.5 py-1 rounded-full">
                                                <Text style={{ color: statusColors.text }} className="text-xs font-bold">{domain.status}</Text>
                                            </View>
                                        </View>
                                        {/* Progress Bar */}
                                        <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="relative h-2.5 w-full rounded-full mb-2.5 overflow-hidden">
                                            <View style={{ left: `${(domain.cutoff / 60) * 100}%` }} className="absolute top-0 bottom-0 w-0.5 bg-black/20 z-10" />
                                            <View style={{ backgroundColor: statusColors.bar, width: `${domain.percentage}%` }} className="absolute top-0 left-0 h-full rounded-full" />
                                        </View>
                                        <View className="flex-row justify-between">
                                            <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">Skor: <Text className="text-base">{domain.score}</Text></Text>
                                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">Cutoff: {domain.cutoff}</Text>
                                        </View>
                                        {domain.warning && (
                                            <View style={{ backgroundColor: colors.tertiaryContainer }} className="mt-3 p-2.5 rounded-lg flex-row gap-2 items-start">
                                                <MaterialIcons name="info" size={16} color={colors.tertiary} />
                                                <Text style={{ color: colors.onTertiaryContainer }} className="text-xs leading-tight flex-1">{domain.warning}</Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Recommendations */}
                    <View>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold mb-3 uppercase tracking-wider px-1">Rekomendasi Pengasuhan</Text>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-2xl overflow-hidden">
                            <View style={{ backgroundColor: colors.primaryContainer }} className="p-4 flex-row items-center gap-3">
                                <View style={{ backgroundColor: colors.primary }} className="p-1.5 rounded-full">
                                    <MaterialIcons name="lightbulb" size={18} color={colors.onPrimary} />
                                </View>
                                <Text style={{ color: colors.onPrimaryContainer }} className="text-sm font-bold">Tips Stimulasi Usia {resultData.child.age}</Text>
                            </View>
                            <View className="p-4 pt-5 gap-4">
                                {resultData.recommendations.map((rec, idx) => (
                                    <View key={idx} className="flex-row gap-3 items-start">
                                        <MaterialIcons name="check" size={18} color={colors.primary} />
                                        <Text style={{ color: colors.onSurface }} className="text-sm leading-relaxed flex-1">{rec}</Text>
                                    </View>
                                ))}
                                <TouchableOpacity style={{ borderColor: colors.outline }} className="w-full mt-2 py-2.5 rounded-xl border flex-row justify-center items-center gap-2">
                                    <Text style={{ color: colors.primary }} className="text-sm font-bold">Lihat Semua Rekomendasi</Text>
                                    <MaterialIcons name="arrow-forward" size={18} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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
