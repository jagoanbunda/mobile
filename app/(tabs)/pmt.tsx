import Colors from '@/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PMTTabScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background-dark pt-12">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-4 pb-2 mb-4">
                <Text className="text-2xl font-bold text-white tracking-tight">PMT</Text>
                <TouchableOpacity className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
                    <MaterialIcons name="notifications" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            >
                {/* Status Card */}
                <View className="bg-[#3d2a2a] rounded-2xl p-5 border border-[#5a4040] mb-6">
                    <View className="flex-row items-center gap-3 mb-4">
                        <View className="w-12 h-12 rounded-full bg-green-900/30 items-center justify-center">
                            <MaterialIcons name="verified" size={24} color="#4ADE80" />
                        </View>
                        <View>
                            <Text className="text-lg font-bold text-white">Program PMT Aktif</Text>
                            <Text className="text-sm text-[#d4a0a0]">Hari ke-14 dari 30 hari</Text>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="mb-2">
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-xs text-[#d4a0a0]">Progress</Text>
                            <Text className="text-xs font-bold text-white">46%</Text>
                        </View>
                        <View className="h-3 w-full bg-[#5a4040]/50 rounded-full overflow-hidden">
                            <View className="h-full bg-primary rounded-full" style={{ width: '46%' }} />
                        </View>
                    </View>
                    <Text className="text-xs text-[#d4a0a0]">16 hari lagi</Text>
                </View>

                {/* Quick Actions */}
                <Text className="text-lg font-bold text-white mb-4">Aksi Cepat</Text>
                <View className="flex-row gap-3 mb-6">
                    <TouchableOpacity
                        onPress={() => router.push('/pmt/report')}
                        className="flex-1 bg-primary py-4 rounded-xl items-center justify-center"
                    >
                        <MaterialIcons name="add-a-photo" size={24} color={Colors.textInverted} />
                        <Text className="text-background-dark font-bold mt-2">Lapor Hari Ini</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/pmt/history')}
                        className="flex-1 bg-[#4a3535] py-4 rounded-xl items-center justify-center border border-[#5a4040]"
                    >
                        <MaterialIcons name="history" size={24} color={Colors.primary} />
                        <Text className="text-white font-bold mt-2">Riwayat</Text>
                    </TouchableOpacity>
                </View>

                {/* Today's Menu */}
                <Text className="text-lg font-bold text-white mb-4">Menu Hari Ini</Text>
                <View className="bg-[#3d2a2a] rounded-xl p-4 border border-[#5a4040] mb-6">
                    <View className="flex-row items-center gap-4">
                        <View className="w-12 h-12 rounded-lg bg-[#4a3f21] items-center justify-center">
                            <MaterialIcons name="restaurant-menu" size={24} color={Colors.primary} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold">Bubur Kacang Hijau + Telur Rebus</Text>
                            <Text className="text-sm text-[#d4a0a0]">Disiapkan oleh Kader Posyandu</Text>
                        </View>
                    </View>
                </View>

                {/* Recent History */}
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-bold text-white">Riwayat Terakhir</Text>
                    <TouchableOpacity onPress={() => router.push('/pmt/history')}>
                        <Text className="text-sm font-bold text-primary">Lihat Semua</Text>
                    </TouchableOpacity>
                </View>

                <View className="gap-3">
                    {/* History Item 1 */}
                    <View className="bg-[#3d2a2a] rounded-xl p-4 border border-[#5a4040]">
                        <View className="flex-row justify-between items-start">
                            <View>
                                <Text className="text-xs text-[#d4a0a0] uppercase tracking-wide">Kemarin</Text>
                                <Text className="text-white font-bold mt-1">Sup Ayam Jagung</Text>
                            </View>
                            <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/20">
                                <MaterialIcons name="check-circle" size={14} color="#4ADE80" />
                                <Text className="text-xs font-bold text-green-400">Habis</Text>
                            </View>
                        </View>
                    </View>

                    {/* History Item 2 */}
                    <View className="bg-[#3d2a2a] rounded-xl p-4 border border-[#5a4040]">
                        <View className="flex-row justify-between items-start">
                            <View>
                                <Text className="text-xs text-[#d4a0a0] uppercase tracking-wide">2 hari lalu</Text>
                                <Text className="text-white font-bold mt-1">Puding Buah Naga</Text>
                            </View>
                            <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20">
                                <MaterialIcons name="timelapse" size={14} color="#FB923C" />
                                <Text className="text-xs font-bold text-orange-400">1/2 Porsi</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
