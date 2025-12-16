import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Mock data for last screening result
const mockScreeningData = {
    child: {
        name: 'Ananda Rizky',
        age: '2 Tahun 3 Bulan',
        gender: 'Laki-laki',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMlymQ-A11UJdpVD6FzTQKd6nqjXVju5ztuJFHzyarGVtjPyz0BQXEK-RCGbMRVbN-LzFpO-PE0BISafrXDinVM2kXNB5QOjjV0j8oQQ6AXgtqmmgO_FHkyOO5ISfqh2zu46eaG7fKp2PF994MC3RwsNgQL583wBshfBBABlXuy8z5ARrCKAcSFUnY6Dwsd7wuRWnjja58_-BodVGsqKhcHunPFYjkiXK6JgWZ7a65cGGnCXDXHv5RjXQq9dpcI_nm-DwUUfjQUgo',
    },
    lastScreening: {
        date: '12 Oktober 2023',
        ageAtScreening: '24 Bulan',
        overallStatus: 'Sesuai',
        domains: [
            { name: 'Komunikasi', icon: 'chat-bubble', color: '#2563EB', score: 55, cutoff: 25.17, status: 'Sesuai' },
            { name: 'Motorik Kasar', icon: 'directions-run', color: '#EA580C', score: 60, cutoff: 38.00, status: 'Sesuai' },
            { name: 'Motorik Halus', icon: 'edit', color: '#9333EA', score: 35, cutoff: 35.00, status: 'Pantau' },
            { name: 'Pemecahan Masalah', icon: 'extension', color: '#DC2626', score: 50, cutoff: 30.00, status: 'Sesuai' },
            { name: 'Personal Sosial', icon: 'people', color: '#059669', score: 45, cutoff: 25.00, status: 'Sesuai' },
        ],
    },
};

export default function ScreeningTabScreen() {
    const { colors } = useTheme();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Sesuai': return { bg: colors.primaryContainer, text: colors.onPrimaryContainer };
            case 'Pantau': return { bg: colors.tertiaryContainer, text: colors.onTertiaryContainer };
            case 'Perlu Rujukan': return { bg: colors.errorContainer, text: colors.error };
            default: return { bg: colors.surfaceContainerHigh, text: colors.onSurface };
        }
    };

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
                        source={{ uri: mockScreeningData.child.photo }}
                        className="w-14 h-14 rounded-full"
                        contentFit="cover"
                    />
                    <View className="flex-1">
                        <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight">{mockScreeningData.child.name}</Text>
                        <View className="flex-row items-center gap-2 mt-0.5">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">{mockScreeningData.child.age}</Text>
                            <View style={{ backgroundColor: colors.outline }} className="w-1 h-1 rounded-full" />
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">{mockScreeningData.child.gender}</Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: colors.primaryContainer }} className="px-3 py-1.5 rounded-full">
                        <Text style={{ color: colors.onPrimaryContainer }} className="text-xs font-bold">Sesuai Umur</Text>
                    </View>
                </View>

                {/* Last Screening Summary */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text style={{ color: colors.onSurface }} className="text-base font-bold">Hasil Screening Terakhir</Text>
                        <View className="flex-row items-center gap-1">
                            <MaterialIcons name="calendar-today" size={14} color={colors.onSurfaceVariant} />
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">{mockScreeningData.lastScreening.date}</Text>
                        </View>
                    </View>

                    {/* Overall Result Banner */}
                    <View style={{ backgroundColor: colors.primaryContainer }} className="p-4 rounded-2xl flex-row items-center gap-4 mb-4">
                        <View style={{ backgroundColor: colors.primary }} className="w-12 h-12 rounded-full items-center justify-center">
                            <MaterialIcons name="verified" size={28} color={colors.onPrimary} />
                        </View>
                        <View className="flex-1">
                            <Text style={{ color: colors.onPrimaryContainer }} className="font-bold text-lg leading-tight">Perkembangan Sesuai Umur</Text>
                            <Text style={{ color: colors.onPrimaryContainer }} className="text-sm mt-0.5 opacity-80">Usia screening: {mockScreeningData.lastScreening.ageAtScreening}</Text>
                        </View>
                    </View>

                    {/* Domain Scores */}
                    <View className="gap-3">
                        {mockScreeningData.lastScreening.domains.map((domain, idx) => {
                            const statusColors = getStatusColor(domain.status);
                            const progressWidth = Math.min((domain.score / 60) * 100, 100);

                            return (
                                <View key={idx} style={{ backgroundColor: colors.surfaceContainerHigh }} className="p-4 rounded-xl">
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
                                    <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="h-2 rounded-full overflow-hidden mb-2">
                                        <View
                                            style={{ backgroundColor: domain.status === 'Pantau' ? colors.tertiary : colors.primary, width: `${progressWidth}%` }}
                                            className="h-full rounded-full"
                                        />
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">Skor: <Text className="text-base">{domain.score}</Text></Text>
                                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">Cutoff: {domain.cutoff}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Recommendations Preview */}
                <View className="mb-6">
                    <Text style={{ color: colors.onSurface }} className="text-base font-bold mb-3">Rekomendasi Stimulasi</Text>
                    <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-2xl overflow-hidden">
                        <View style={{ backgroundColor: colors.primaryContainer }} className="p-4 flex-row items-center gap-3">
                            <View style={{ backgroundColor: colors.primary }} className="p-2 rounded-full">
                                <MaterialIcons name="lightbulb" size={18} color={colors.onPrimary} />
                            </View>
                            <Text style={{ color: colors.onPrimaryContainer }} className="text-sm font-bold">Tips Stimulasi Usia 24 Bulan</Text>
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
                                onPress={() => router.push('/screening/result')}
                                style={{ borderColor: colors.outline }}
                                className="mt-2 py-2.5 rounded-xl border flex-row justify-center items-center gap-2"
                            >
                                <Text style={{ color: colors.primary }} className="text-sm font-bold">Lihat Semua</Text>
                                <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Start New Screening Button */}
                <TouchableOpacity
                    onPress={() => router.push('/screening/questionnaire')}
                    style={{ backgroundColor: colors.primary }}
                    className="py-4 rounded-xl flex-row items-center justify-center gap-2"
                >
                    <MaterialIcons name="play-arrow" size={24} color={colors.onPrimary} />
                    <Text style={{ color: colors.onPrimary }} className="font-bold text-base">Mulai Tes ASQ-3 Baru</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
