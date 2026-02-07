import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { useGrowthChart } from '@/services/hooks/use-anthropometry';
import { getAvatarUrl } from '@/config/env';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { GrowthChartMeasurement } from '@/types';
import { ChartSkeleton, StatCardSkeleton } from '@/components/Skeleton';

type ChartType = 'BB/U' | 'TB/U' | 'BB/TB';

// Helper function to format age
const formatAge = (months: number): string => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0 && remainingMonths > 0) return `${years} Tahun ${remainingMonths} Bulan`;
    if (years > 0) return `${years} Tahun`;
    return `${remainingMonths} Bulan`;
};

// Helper function to format gender
const formatGender = (gender: string | undefined): string => {
    if (!gender) return '';
    if (gender === 'male') return 'Laki-laki';
    if (gender === 'female') return 'Perempuan';
    return gender;
};

// Helper function to format date for X-axis labels
const formatDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return months[date.getMonth()];
};

const getChartCoordinates = (measurements: GrowthChartMeasurement[], type: ChartType) => {
    if (!measurements || measurements.length === 0) return [];
    
    // Calculate min/max values from actual data
    const weights = measurements.map(m => m.weight);
    const heights = measurements.map(m => m.height);
    
    const minWeight = Math.min(...weights) - 2;
    const maxWeight = Math.max(...weights) + 2;
    const minHeight = Math.min(...heights) - 4;
    const maxHeight = Math.max(...heights) + 4;

    return measurements.map((m, idx) => {
        const x = 10 + (idx * (80 / Math.max(measurements.length - 1, 1)));
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
    
    const { data: activeChild, isLoading: isLoadingChild } = useActiveChild();
    const childId = activeChild?.id || 0;
    const { data: growthData, isLoading: isLoadingGrowth } = useGrowthChart(childId);

    const isLoading = isLoadingChild || isLoadingGrowth;

    // Get latest measurement
    const latestMeasurement = growthData?.measurements?.length 
        ? growthData.measurements[growthData.measurements.length - 1] 
        : null;

    // Generate chart path
    const chartPoints = getChartCoordinates(growthData?.measurements || [], selectedChart);
    const pathData = chartPoints.length > 0 
        ? chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
        : '';

    // Y-axis labels based on chart type
    const yLabels = selectedChart === 'BB/U'
        ? ['16', '14', '12', '10', '8']
        : selectedChart === 'TB/U'
            ? ['96', '92', '88', '84', '80']
            : ['120', '110', '100', '90', '80'];

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 px-4 pt-4 pb-6 gap-6">
                    <View className="flex-row items-center justify-between pb-2">
                        <Text style={{ color: colors.onSurface }} className="text-2xl font-bold tracking-tight">Progress</Text>
                    </View>
                    <ChartSkeleton />
                    <View className="flex-row gap-4">
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // Empty state - no measurements
    if (!growthData || growthData.measurements.length === 0) {
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
                <View className="flex-1 items-center justify-center p-6">
                    <MaterialIcons name="straighten" size={64} color={colors.outline} />
                    <Text style={{ color: colors.onSurface }} className="text-lg font-semibold mt-4">
                        Belum ada data pengukuran
                    </Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-center mt-2">
                        Mulai catat perkembangan anak dengan menginput data pertama
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/anthropometry/input')}
                        style={{ backgroundColor: colors.primary }}
                        className="px-6 py-3 rounded-xl mt-6"
                    >
                        <Text style={{ color: colors.onPrimary }} className="font-semibold">
                            Input Data Pertama
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

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
                <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="p-4 rounded-2xl mb-6 flex-row items-center gap-4">
                    {getAvatarUrl(activeChild?.avatar_url) ? (
                        <Image
                            source={{ uri: getAvatarUrl(activeChild?.avatar_url)! }}
                            className="w-12 h-12 rounded-full"
                            contentFit="cover"
                        />
                    ) : (
                        <View style={{ width: 48, height: 48, backgroundColor: colors.surfaceContainerHighest }} className="rounded-full items-center justify-center">
                            <MaterialIcons name="child-care" size={24} color={colors.onSurfaceVariant} />
                        </View>
                    )}
                    <View className="flex-1">
                        <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight">{growthData.child.name}</Text>
                        <View className="flex-row items-center gap-2 mt-0.5">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">
                                {activeChild?.age?.label || formatAge(activeChild?.age?.months || 0)}
                            </Text>
                            <View style={{ backgroundColor: colors.outline }} className="w-1 h-1 rounded-full" />
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">{formatGender(activeChild?.gender)}</Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: colors.primaryContainer }} className="px-3 py-1.5 rounded-full">
                        <Text style={{ color: colors.onPrimaryContainer }} className="text-xs font-bold">Gizi Baik</Text>
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
                            <Text style={{ color: colors.onSurface }} className="text-base font-bold">
                                Grafik {selectedChart === 'BB/U' ? 'Berat / Umur' : selectedChart === 'TB/U' ? 'Tinggi / Umur' : 'Berat / Tinggi'}
                            </Text>
                        </View>
                    </View>

                    {/* Chart Container */}
                    <View style={{ backgroundColor: '#ecefe5' }} className="rounded-2xl p-4">
                        {/* Chart Title */}
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mb-3">
                            {selectedChart === 'BB/U' ? 'Berat badan (kg)' : selectedChart === 'TB/U' ? 'Tinggi badan (cm)' : 'Rasio BB/TB'}
                        </Text>

                        {/* SVG Chart */}
                        <View className="relative w-full" style={{ aspectRatio: 1.4 }}>
                            {/* Y-Axis Labels */}
                            <View className="absolute left-0 top-0 bottom-8 w-6 justify-between">
                                {yLabels.map((label, idx) => (
                                    <Text key={idx} style={{ color: colors.onSurface }} className="text-xs font-semibold">{label}</Text>
                                ))}
                            </View>

                            {/* Z-Score Labels (Right side) */}
                            <View className="absolute right-0 top-0 bottom-8 w-6 justify-between items-end">
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] font-medium">3</Text>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] font-medium">2</Text>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] font-medium">1</Text>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] font-medium">0</Text>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] font-medium">-1</Text>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] font-medium">-2</Text>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] font-medium">-3</Text>
                            </View>

                            {/* Chart Area */}
                            <View className="absolute left-7 top-0 right-7 bottom-8 rounded-xl overflow-hidden">
                                <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {/* Yellow Zone (At Risk - below -2 SD) */}
                                    <Path d="M0,92 C10,90 30,85 50,78 C70,71 90,65 100,60 L100,50 C90,55 70,61 50,68 C30,75 10,80 0,82 Z" fill="#FFC107" opacity="0.3" />

                                    {/* Green Zone (Normal - between -2 and +2 SD) */}
                                    <Path d="M0,82 C10,80 30,75 50,68 C70,61 90,55 100,50 L100,25 C90,30 70,36 50,43 C30,50 10,55 0,57 Z" fill="#4CAF50" opacity="0.3" />

                                    {/* Yellow Zone (At Risk - above +2 SD) */}
                                    <Path d="M0,57 C10,55 30,50 50,43 C70,36 90,30 100,25 L100,15 C90,20 70,26 50,33 C30,40 10,45 0,47 Z" fill="#FFC107" opacity="0.3" />

                                    {/* Grid Lines */}
                                    {[0, 14, 28, 43, 57, 71, 85, 100].map((y) => (
                                        <Line key={y} x1="0" y1={y} x2="100" y2={y} stroke={colors.outlineVariant} strokeWidth="0.3" strokeDasharray="2 2" />
                                    ))}

                                    {/* Vertical Grid Lines */}
                                    {[0, 20, 40, 60, 80, 100].map((x) => (
                                        <Line key={x} x1={x} y1="0" x2={x} y2="100" stroke={colors.outlineVariant} strokeWidth="0.3" strokeDasharray="2 2" />
                                    ))}

                                    {/* Median Line (0 SD) - Dashed */}
                                    <Path d="M0,70 C10,68 30,63 50,56 C70,49 90,43 100,38" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeDasharray="4 2" />

                                    {/* Child Data Line */}
                                    {pathData && (
                                        <Path d={pathData} fill="none" stroke={colors.primary} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                    )}
                                </Svg>
                            </View>

                            {/* X-Axis Labels */}
                            <View className="absolute left-7 right-7 bottom-0 h-8 flex-row justify-between items-start pt-1">
                                {growthData.measurements.slice(-6).map((m, idx) => (
                                    <Text key={idx} style={{ color: colors.onSurface }} className="text-xs font-semibold">{formatDateLabel(m.date)}</Text>
                                ))}
                            </View>
                        </View>

                        {/* Latest Value Display */}
                        <View style={{ borderColor: colors.surfaceContainerHighest }} className="mt-3 pt-3 border-t flex-row justify-center gap-6">
                            <View className="items-center">
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] uppercase">Terakhir</Text>
                                <Text style={{ color: colors.primary }} className="text-lg font-bold">
                                    {selectedChart === 'BB/U'
                                        ? `${latestMeasurement?.weight || 0} kg`
                                        : selectedChart === 'TB/U'
                                            ? `${latestMeasurement?.height || 0} cm`
                                            : '102%'}
                                </Text>
                            </View>
                            <View className="items-center">
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] uppercase">Z-Score</Text>
                                <Text style={{ color: colors.primary }} className="text-lg font-bold">
                                    {selectedChart === 'BB/U'
                                        ? `${latestMeasurement?.weight_for_age_zscore?.toFixed(1) || '0.0'}`
                                        : selectedChart === 'TB/U'
                                            ? `${latestMeasurement?.height_for_age_zscore?.toFixed(1) || '0.0'}`
                                            : `${latestMeasurement?.weight_for_height_zscore?.toFixed(1) || '0.0'}`} SD
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Current Stats */}
                <View className="mb-6">
                    <Text style={{ color: colors.onSurface }} className="text-base font-bold mb-3">Statistik Terkini</Text>
                    <View className="flex-row gap-3">
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-1 rounded-xl p-4">
                            <View className="flex-row items-center gap-2 mb-2">
                                <MaterialIcons name="monitor-weight" size={18} color={colors.primary} />
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">Berat Badan</Text>
                            </View>
                            <Text style={{ color: colors.onSurface }} className="text-2xl font-bold">{latestMeasurement?.weight || 0} <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">kg</Text></Text>
                            <Text style={{ color: colors.primary }} className="text-xs font-semibold mt-1">Z-Score: {latestMeasurement?.weight_for_age_zscore?.toFixed(1) || '0.0'} SD</Text>
                        </View>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-1 rounded-xl p-4">
                            <View className="flex-row items-center gap-2 mb-2">
                                <MaterialIcons name="height" size={18} color={colors.primary} />
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">Tinggi Badan</Text>
                            </View>
                            <Text style={{ color: colors.onSurface }} className="text-2xl font-bold">{latestMeasurement?.height || 0} <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">cm</Text></Text>
                            <Text style={{ color: colors.primary }} className="text-xs font-semibold mt-1">Z-Score: {latestMeasurement?.height_for_age_zscore?.toFixed(1) || '0.0'} SD</Text>
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
                        style={{ backgroundColor: colors.surfaceContainerHigh }}
                        className="flex-1 py-4 rounded-xl items-center justify-center flex-row gap-2"
                    >
                        <MaterialIcons name="history" size={20} color={colors.primary} />
                        <Text style={{ color: colors.onSurface }} className="font-bold">Riwayat</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
