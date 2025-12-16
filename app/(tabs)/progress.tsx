import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';

type ChartType = 'BB/U' | 'TB/U' | 'BB/TB';

// Mock Data untuk anak usia 0-27 bulan (Ananda Rizky)
const mockData = {
    child: {
        name: 'Ananda Rizky',
        age: '2 Tahun 3 Bulan',
        gender: 'Laki-laki',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMlymQ-A11UJdpVD6FzTQKd6nqjXVju5ztuJFHzyarGVtjPyz0BQXEK-RCGbMRVbN-LzFpO-PE0BISafrXDinVM2kXNB5QOjjV0j8oQQ6AXgtqmmgO_FHkyOO5ISfqh2zu46eaG7fKp2PF994MC3RwsNgQL583wBshfBBABlXuy8z5ARrCKAcSFUnY6Dwsd7wuRWnjja58_-BodVGsqKhcHunPFYjkiXK6JgWZ7a65cGGnCXDXHv5RjXQq9dpcI_nm-DwUUfjQUgo',
    },
    measurements: [
        { ageMonths: 21, weight: 10.2, height: 82.5, date: 'Jul 2023' },
        { ageMonths: 22, weight: 10.8, height: 84.0, date: 'Aug 2023' },
        { ageMonths: 23, weight: 11.4, height: 85.5, date: 'Sep 2023' },
        { ageMonths: 24, weight: 11.9, height: 87.0, date: 'Oct 2023' },
        { ageMonths: 25, weight: 12.3, height: 88.0, date: 'Nov 2023' },
        { ageMonths: 26, weight: 12.5, height: 89.0, date: 'Dec 2023' },
    ],
    whoStandards: {
        weight: { median: 12.2, minus2SD: 10.0, plus2SD: 14.5 },
        height: { median: 87.1, minus2SD: 82.5, plus2SD: 92.0 },
    },
    currentStats: {
        weight: { value: 12.5, zScore: -0.2, status: 'Normal' },
        height: { value: 89.0, zScore: 0.3, status: 'Normal' },
        headCircumference: { value: 48.5, zScore: -0.1, status: 'Normal' },
    }
};

const getChartCoordinates = (measurements: typeof mockData.measurements, type: ChartType) => {
    const minWeight = 8, maxWeight = 16;
    const minHeight = 78, maxHeight = 96;

    return measurements.map((m, idx) => {
        const x = 10 + (idx * 18);
        let y: number;

        if (type === 'BB/U') {
            y = 100 - ((m.weight - minWeight) / (maxWeight - minWeight)) * 100;
        } else if (type === 'TB/U') {
            y = 100 - ((m.height - minHeight) / (maxHeight - minHeight)) * 100;
        } else {
            const expectedWeight = (m.height - 45) * 0.15 + 3;
            y = 100 - ((m.weight / expectedWeight) * 50);
        }

        return { x, y: Math.max(5, Math.min(95, y)) };
    });
};

export default function ProgressScreen() {
    const { colors } = useTheme();
    const [selectedChart, setSelectedChart] = useState<ChartType>('BB/U');

    const chartPoints = getChartCoordinates(mockData.measurements, selectedChart);
    const pathData = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

    const yLabels = selectedChart === 'BB/U'
        ? ['16kg', '14kg', '12kg', '10kg', '8kg']
        : selectedChart === 'TB/U'
            ? ['96cm', '92cm', '88cm', '84cm', '80cm']
            : ['120%', '110%', '100%', '90%', '80%'];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center justify-between p-4 pb-2">
                <Text style={{ color: colors.onSurface }} className="text-2xl font-bold tracking-tight">Progress</Text>
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
                <View style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outlineVariant }} className="p-4 rounded-2xl shadow-sm border mb-6 flex-row items-center gap-4">
                    <Image
                        source={{ uri: mockData.child.photo }}
                        className="w-12 h-12 rounded-full"
                        contentFit="cover"
                    />
                    <View className="flex-1">
                        <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight">{mockData.child.name}</Text>
                        <View className="flex-row items-center gap-2 mt-0.5">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">{mockData.child.age}</Text>
                            <View style={{ backgroundColor: colors.outline }} className="w-1 h-1 rounded-full" />
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">{mockData.child.gender}</Text>
                        </View>
                    </View>
                    <View className="px-3 py-1.5 rounded-full bg-green-100 border border-green-200">
                        <Text className="text-xs font-bold text-green-700">Gizi Baik</Text>
                    </View>
                </View>

                {/* Chart Type Selector */}
                <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row gap-2 mb-4 p-1 rounded-xl">
                    {(['BB/U', 'TB/U', 'BB/TB'] as ChartType[]).map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setSelectedChart(type)}
                            style={{ backgroundColor: selectedChart === type ? colors.primary : 'transparent' }}
                            className="flex-1 py-2.5 rounded-lg items-center"
                        >
                            <Text style={{ color: selectedChart === type ? colors.onPrimary : colors.onSurfaceVariant }} className="text-sm font-bold">
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Growth Chart */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name="show-chart" size={20} color={colors.primary} />
                            <Text style={{ color: colors.onSurface }} className="text-base font-bold">
                                Grafik {selectedChart === 'BB/U' ? 'Berat / Umur' : selectedChart === 'TB/U' ? 'Tinggi / Umur' : 'Berat / Tinggi'}
                            </Text>
                        </View>
                    </View>

                    {/* Chart Container */}
                    <View style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outlineVariant }} className="rounded-2xl p-4 shadow-sm border">
                        {/* Legend */}
                        <View className="flex-row items-center gap-3 justify-center mb-4">
                            <View className="flex-row items-center gap-1">
                                <View className="w-2 h-2 rounded-full bg-green-500" />
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">Normal (-2 to +2 SD)</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <View style={{ backgroundColor: colors.primary }} className="w-3 h-3 rounded-full border-2 border-white" />
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">{mockData.child.name}</Text>
                            </View>
                        </View>

                        {/* SVG Chart */}
                        <View className="relative w-full aspect-[16/9]">
                            {/* Y-Axis Labels */}
                            <View className="absolute left-0 top-0 bottom-6 w-8 justify-between pr-1">
                                {yLabels.map((label, idx) => (
                                    <Text key={idx} style={{ color: colors.onSurfaceVariant }} className="text-[8px] font-medium text-right">{label}</Text>
                                ))}
                            </View>

                            {/* Chart Area */}
                            <View style={{ borderColor: colors.outlineVariant }} className="absolute left-8 top-0 right-0 bottom-6 border-l border-b">
                                <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {[0, 25, 50, 75, 100].map((y) => (
                                        <Line key={y} x1="0" y1={y} x2="100" y2={y} stroke={colors.outlineVariant} strokeWidth="0.5" strokeDasharray="4 2" />
                                    ))}
                                    <Path d="M0,70 L100,60" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
                                    <Path d="M0,30 L100,20" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
                                    <Path d={pathData} fill="none" stroke={colors.primary} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </Svg>
                            </View>

                            {/* X-Axis Labels */}
                            <View className="absolute left-8 right-0 bottom-0 h-6 flex-row justify-between pt-1 px-1">
                                {mockData.measurements.map((m, idx) => (
                                    <Text key={idx} style={{ color: colors.onSurfaceVariant }} className="text-[8px] font-medium">{m.date.split(' ')[0]}</Text>
                                ))}
                            </View>
                        </View>

                        {/* Latest Value Display */}
                        <View style={{ borderColor: colors.outlineVariant }} className="mt-3 pt-3 border-t flex-row justify-center gap-6">
                            <View className="items-center">
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] uppercase">Terakhir</Text>
                                <Text style={{ color: colors.primary }} className="text-lg font-bold">
                                    {selectedChart === 'BB/U'
                                        ? `${mockData.measurements[mockData.measurements.length - 1].weight} kg`
                                        : selectedChart === 'TB/U'
                                            ? `${mockData.measurements[mockData.measurements.length - 1].height} cm`
                                            : '102%'}
                                </Text>
                            </View>
                            <View className="items-center">
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] uppercase">Z-Score</Text>
                                <Text className="text-lg font-bold text-green-600">
                                    {selectedChart === 'BB/U'
                                        ? mockData.currentStats.weight.zScore
                                        : selectedChart === 'TB/U'
                                            ? mockData.currentStats.height.zScore
                                            : '+0.2'} SD
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Current Stats */}
                <View className="mb-6">
                    <Text style={{ color: colors.onSurface }} className="text-base font-bold mb-3">Statistik Terkini</Text>
                    <View className="flex-row gap-3">
                        <View style={{ backgroundColor: colors.secondaryContainer, borderColor: colors.outlineVariant }} className="flex-1 rounded-xl p-4 border">
                            <View className="flex-row items-center gap-2 mb-2">
                                <MaterialIcons name="monitor-weight" size={18} color={colors.primary} />
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">Berat Badan</Text>
                            </View>
                            <Text style={{ color: colors.onSecondaryContainer }} className="text-2xl font-bold">{mockData.currentStats.weight.value} <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">kg</Text></Text>
                            <Text className="text-xs text-green-600 font-semibold mt-1">Z-Score: {mockData.currentStats.weight.zScore} SD</Text>
                        </View>
                        <View style={{ backgroundColor: colors.secondaryContainer, borderColor: colors.outlineVariant }} className="flex-1 rounded-xl p-4 border">
                            <View className="flex-row items-center gap-2 mb-2">
                                <MaterialIcons name="height" size={18} color={colors.primary} />
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">Tinggi Badan</Text>
                            </View>
                            <Text style={{ color: colors.onSecondaryContainer }} className="text-2xl font-bold">{mockData.currentStats.height.value} <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">cm</Text></Text>
                            <Text className="text-xs text-green-600 font-semibold mt-1">Z-Score: {mockData.currentStats.height.zScore} SD</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => router.push('/anthropometry/input')}
                        style={{ backgroundColor: colors.primary }}
                        className="flex-1 py-4 rounded-xl items-center justify-center flex-row gap-2"
                    >
                        <MaterialIcons name="add" size={20} color={colors.onPrimary} />
                        <Text style={{ color: colors.onPrimary }} className="font-bold">Input Data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/anthropometry/growth-chart')}
                        style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outlineVariant }}
                        className="flex-1 py-4 rounded-xl items-center justify-center flex-row gap-2 border"
                    >
                        <MaterialIcons name="history" size={20} color={colors.primary} />
                        <Text style={{ color: colors.onSurface }} className="font-bold">Riwayat</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
