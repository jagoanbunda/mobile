import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type HistoryItemStatus = 'habis' | 'half' | 'none';

interface HistoryItem {
    date: string;
    menu: string;
    status: HistoryItemStatus;
    note?: string;
}

const historyData: HistoryItem[] = [
    {
        date: 'Senin, 14 Okt 2023',
        menu: 'Sup Ayam Jagung + Telur',
        status: 'habis',
        note: '"Anak sangat suka, makan lahap sekali."'
    },
    {
        date: 'Minggu, 13 Okt 2023',
        menu: 'Puding Buah Naga',
        status: 'half',
        note: '"Sedang tumbuh gigi, agak rewel."'
    },
    {
        date: 'Sabtu, 12 Okt 2023',
        menu: 'Bola-bola Tahu Kukus',
        status: 'none',
    }
];

export default function PMTHistoryScreen() {
    const { colors } = useTheme();

    const getStatusBadge = (status: HistoryItemStatus) => {
        switch (status) {
            case 'habis':
                return (
                    <View style={{ backgroundColor: colors.primaryContainer }} className="flex-row items-center gap-1 rounded-full px-2.5 py-1">
                        <MaterialIcons name="check-circle" size={14} color={colors.primary} />
                        <Text style={{ color: colors.onPrimaryContainer }} className="text-xs font-semibold">Habis</Text>
                    </View>
                );
            case 'half':
                return (
                    <View style={{ backgroundColor: colors.tertiaryContainer }} className="flex-row items-center gap-1 rounded-full px-2.5 py-1">
                        <MaterialIcons name="timelapse" size={14} color={colors.tertiary} />
                        <Text style={{ color: colors.onTertiaryContainer }} className="text-xs font-semibold">1/2 Porsi</Text>
                    </View>
                );
            case 'none':
                return (
                    <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="flex-row items-center gap-1 rounded-full px-2.5 py-1">
                        <MaterialIcons name="cancel" size={14} color={colors.outline} />
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-semibold">Tidak Lapor</Text>
                    </View>
                );
        }
    };

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
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
                    PMT Riwayat & Program
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            >
                {/* Hero Status Card */}
                <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-2xl overflow-hidden mb-5">
                    {/* Card Header */}
                    <View className="flex-row p-4 gap-4">
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1W8PlX7GmquVFfkiBptSZEyW4r2PRnlCb2Aje31nWK-tIqIYn_Rol-FZgAvD2OfQX-sgKf0n-4hocQMCdcdHfeY18V4Khcf10uL-6S2zk2ke3aytnDL6IDRfcoAXNSCmt7fk4UVtQIpTANr54YCVFWqT7NuDVnofjP5AN0eRxZOL64t3_I05z-6Ntrw3cQl14-RIhp81qYlgrSf4NogEY_8s1vzL0CbiqUt4aymiCmGKGypvwpZDFBlEvlxllOflKwNbxM2ED5KQ" }}
                            className="w-24 h-24 rounded-xl"
                            contentFit="cover"
                        />
                        <View className="flex-1 justify-center gap-1">
                            <View className="flex-row items-center gap-2 mb-1">
                                <View style={{ backgroundColor: colors.primaryContainer }} className="px-2 py-0.5 rounded-full">
                                    <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider">Aktif</Text>
                                </View>
                            </View>
                            <Text style={{ color: colors.onSurface }} className="text-xl font-bold leading-tight">Program PMT Balita</Text>
                            <View className="flex-row items-center gap-2">
                                <MaterialIcons name="track-changes" size={18} color={colors.outline} />
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">Target: Kejar Tumbuh (BB)</Text>
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={{ backgroundColor: colors.outlineVariant }} className="h-px w-full" />

                    {/* Progress Section */}
                    <View className="p-4 pt-3 gap-2">
                        <View className="flex-row justify-between items-end">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium">Progress Harian</Text>
                            <Text style={{ color: colors.onSurface }} className="text-sm font-bold">
                                Hari 14 <Text style={{ color: colors.outline }} className="font-normal">/ 30</Text>
                            </Text>
                        </View>
                        <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="relative h-3 w-full rounded-full overflow-hidden">
                            <View style={{ backgroundColor: colors.primary, width: '46%' }} className="absolute top-0 left-0 h-full rounded-full" />
                        </View>
                        <Text style={{ color: colors.outline }} className="text-xs text-right mt-1">Sisa 16 hari lagi</Text>
                    </View>
                </View>

                {/* Action Panel */}
                <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center justify-between gap-4 rounded-xl p-4 mb-5">
                    <View className="flex-row items-center gap-4">
                        <View style={{ backgroundColor: colors.primaryContainer }} className="w-10 h-10 items-center justify-center rounded-full">
                            <MaterialIcons name="calendar-month" size={24} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={{ color: colors.onSurface }} className="text-base font-bold leading-tight">Jadwal Menu</Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-normal">Lihat menu bulan depan</Text>
                        </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
                </TouchableOpacity>

                {/* History Section */}
                <View className="gap-3">
                    <View className="flex-row items-center justify-between px-1">
                        <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight">Riwayat Konsumsi</Text>
                        <TouchableOpacity>
                            <Text style={{ color: colors.primary }} className="text-sm font-semibold">Lihat Semua</Text>
                        </TouchableOpacity>
                    </View>

                    {/* History List */}
                    <View className="gap-3">
                        {historyData.map((item, index) => (
                            <View
                                key={index}
                                style={{ backgroundColor: colors.surfaceContainerHigh, opacity: item.status === 'none' ? 0.7 : 1 }}
                                className="flex-col gap-3 rounded-xl p-4"
                            >
                                <View className="flex-row justify-between items-start">
                                    <View>
                                        <Text style={{ color: colors.outline }} className="text-xs font-medium uppercase tracking-wide">{item.date}</Text>
                                        <Text style={{ color: colors.onSurface }} className="text-base font-bold mt-1">{item.menu}</Text>
                                    </View>
                                    {getStatusBadge(item.status)}
                                </View>
                                <View style={{ backgroundColor: colors.outlineVariant }} className="h-px w-full" />
                                <View className="flex-row items-center">
                                    <MaterialIcons name="sticky-note-2" size={14} color={colors.outline} style={{ marginRight: 4 }} />
                                    <Text style={{ color: item.note ? colors.onSurfaceVariant : colors.outline }} className="text-sm italic">
                                        {item.note || 'Tidak ada catatan.'}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
