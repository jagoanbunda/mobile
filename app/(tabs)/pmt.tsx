import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PMTTabScreen() {
    const { colors } = useTheme();

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
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">Hari ke-14 dari 30 hari</Text>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="mb-2">
                        <View className="flex-row justify-between mb-1">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">Progress</Text>
                            <Text style={{ color: colors.onSurface }} className="text-xs font-bold">46%</Text>
                        </View>
                        <View style={{ backgroundColor: colors.outlineVariant }} className="h-3 w-full rounded-full overflow-hidden">
                            <View style={{ backgroundColor: colors.primary, width: '46%' }} className="h-full rounded-full" />
                        </View>
                    </View>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">16 hari lagi</Text>
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
                            <Text style={{ color: colors.onSurface }} className="font-bold">Bubur Kacang Hijau + Telur Rebus</Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">Disiapkan oleh Kader Posyandu</Text>
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
                    {/* History Item 1 */}
                    <View style={{ backgroundColor: colors.card }} className="rounded-xl p-4 shadow-sm">
                        <View className="flex-row justify-between items-start">
                            <View>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs uppercase tracking-wide">Kemarin</Text>
                                <Text style={{ color: colors.onSurface }} className="font-bold mt-1">Sup Ayam Jagung</Text>
                            </View>
                            <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-green-100">
                                <MaterialIcons name="check-circle" size={14} color="#16A34A" />
                                <Text className="text-xs font-bold text-green-700">Habis</Text>
                            </View>
                        </View>
                    </View>

                    {/* History Item 2 */}
                    <View style={{ backgroundColor: colors.card }} className="rounded-xl p-4 shadow-sm">
                        <View className="flex-row justify-between items-start">
                            <View>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs uppercase tracking-wide">2 hari lalu</Text>
                                <Text style={{ color: colors.onSurface }} className="font-bold mt-1">Puding Buah Naga</Text>
                            </View>
                            <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100">
                                <MaterialIcons name="timelapse" size={14} color="#EA580C" />
                                <Text className="text-xs font-bold text-orange-700">1/2 Porsi</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
