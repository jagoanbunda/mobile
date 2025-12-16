import Colors from '@/constants/colors';
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

const getStatusBadge = (status: HistoryItemStatus) => {
    switch (status) {
        case 'habis':
            return (
                <View className="flex-row items-center gap-1 rounded-full bg-green-500/20 px-2.5 py-1">
                    <MaterialIcons name="check-circle" size={14} color="#4ADE80" />
                    <Text className="text-xs font-semibold text-green-300">Habis</Text>
                </View>
            );
        case 'half':
            return (
                <View className="flex-row items-center gap-1 rounded-full bg-orange-500/20 px-2.5 py-1">
                    <MaterialIcons name="timelapse" size={14} color="#FB923C" />
                    <Text className="text-xs font-semibold text-orange-300">1/2 Porsi</Text>
                </View>
            );
        case 'none':
            return (
                <View className="flex-row items-center gap-1 rounded-full bg-gray-700 px-2.5 py-1">
                    <MaterialIcons name="cancel" size={14} color="#9CA3AF" />
                    <Text className="text-xs font-semibold text-gray-300">Tidak Lapor</Text>
                </View>
            );
    }
};

export default function PMTHistoryScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background-dark pt-12">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-background-dark p-4 pb-2 justify-between border-b border-white/5">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
                    PMT Riwayat & Program
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            >
                {/* Hero Status Card */}
                <View className="rounded-2xl bg-[#4a3535] shadow-sm overflow-hidden mb-5">
                    {/* Card Header */}
                    <View className="flex-row p-4 gap-4">
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1W8PlX7GmquVFfkiBptSZEyW4r2PRnlCb2Aje31nWK-tIqIYn_Rol-FZgAvD2OfQX-sgKf0n-4hocQMCdcdHfeY18V4Khcf10uL-6S2zk2ke3aytnDL6IDRfcoAXNSCmt7fk4UVtQIpTANr54YCVFWqT7NuDVnofjP5AN0eRxZOL64t3_I05z-6Ntrw3cQl14-RIhp81qYlgrSf4NogEY_8s1vzL0CbiqUt4aymiCmGKGypvwpZDFBlEvlxllOflKwNbxM2ED5KQ" }}
                            className="w-24 h-24 rounded-xl"
                            contentFit="cover"
                        />
                        <View className="flex-1 justify-center gap-1">
                            <View className="flex-row items-center gap-2 mb-1">
                                <View className="px-2 py-0.5 rounded-full bg-green-900/30 border border-green-800">
                                    <Text className="text-green-400 text-xs font-bold uppercase tracking-wider">Aktif</Text>
                                </View>
                            </View>
                            <Text className="text-xl font-bold leading-tight text-white">Program PMT Balita</Text>
                            <View className="flex-row items-center gap-2">
                                <MaterialIcons name="track-changes" size={18} color={Colors.textMuted} />
                                <Text className="text-[#d4a0a0] text-sm">Target: Kejar Tumbuh (BB)</Text>
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-px w-full bg-white/10" />

                    {/* Progress Section */}
                    <View className="p-4 pt-3 gap-2">
                        <View className="flex-row justify-between items-end">
                            <Text className="text-[#d4a0a0] text-sm font-medium">Progress Harian</Text>
                            <Text className="text-white text-sm font-bold">
                                Hari 14 <Text className="text-white/40 font-normal">/ 30</Text>
                            </Text>
                        </View>
                        <View className="relative h-3 w-full rounded-full bg-[#5a4040]/50 overflow-hidden">
                            <View className="absolute top-0 left-0 h-full rounded-full bg-primary" style={{ width: '46%' }} />
                        </View>
                        <Text className="text-white/40 text-xs text-right mt-1">Sisa 16 hari lagi</Text>
                    </View>
                </View>

                {/* Action Panel */}
                <TouchableOpacity className="flex-row items-center justify-between gap-4 rounded-xl border border-primary/30 bg-[#4a3535] p-4 mb-5 active:scale-[0.98]">
                    <View className="flex-row items-center gap-4">
                        <View className="w-10 h-10 items-center justify-center rounded-full bg-primary/10">
                            <MaterialIcons name="calendar-month" size={24} color={Colors.primary} />
                        </View>
                        <View>
                            <Text className="text-white text-base font-bold leading-tight">Jadwal Menu</Text>
                            <Text className="text-[#d4a0a0] text-sm font-normal">Lihat menu bulan depan</Text>
                        </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>

                {/* History Section */}
                <View className="gap-3">
                    <View className="flex-row items-center justify-between px-1">
                        <Text className="text-white text-lg font-bold leading-tight">Riwayat Konsumsi</Text>
                        <TouchableOpacity>
                            <Text className="text-primary text-sm font-semibold">Lihat Semua</Text>
                        </TouchableOpacity>
                    </View>

                    {/* History List */}
                    <View className="gap-3">
                        {historyData.map((item, index) => (
                            <View
                                key={index}
                                className={`flex-col gap-3 rounded-xl bg-[#4a3535] p-4 shadow-sm border border-white/5 ${item.status === 'none' ? 'opacity-80' : ''}`}
                            >
                                <View className="flex-row justify-between items-start">
                                    <View>
                                        <Text className="text-white/40 text-xs font-medium uppercase tracking-wide">{item.date}</Text>
                                        <Text className="text-white text-base font-bold mt-1">{item.menu}</Text>
                                    </View>
                                    {getStatusBadge(item.status)}
                                </View>
                                <View className="h-px w-full bg-white/5" />
                                <View className="flex-row items-center">
                                    <MaterialIcons name="sticky-note-2" size={14} color="rgba(204,188,142,0.7)" style={{ marginRight: 4 }} />
                                    <Text className={`text-sm italic ${item.note ? 'text-[#d4a0a0]' : 'text-white/30'}`}>
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
