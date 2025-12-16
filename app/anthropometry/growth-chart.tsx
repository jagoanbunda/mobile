import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

export default function GrowthChartScreen() {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ backgroundColor: colors.surface }} className="flex-row items-center justify-between p-4 pb-2">
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ backgroundColor: colors.surfaceContainerHigh }}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
                </TouchableOpacity>
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Riwayat Pengukuran</Text>
            </View>

            <ScrollView
                className="flex-1 px-5 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Child Profile */}
                <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="p-4 rounded-2xl mb-6 flex-row items-center gap-4">
                    <View style={{ backgroundColor: colors.primaryContainer }} className="w-12 h-12 rounded-full items-center justify-center shrink-0">
                        <MaterialIcons name="child-care" size={24} color={colors.primary} />
                    </View>
                    <View>
                        <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight">Ananda Rizky</Text>
                        <View className="flex-row items-center gap-2 mt-0.5">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">2 Tahun 3 Bulan</Text>
                            <View style={{ backgroundColor: colors.outline }} className="w-1 h-1 rounded-full" />
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">Laki-laki</Text>
                        </View>
                    </View>
                </View>

                <View className="mb-8">
                    <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center gap-2">
                            <Text style={{ color: colors.onSurface }} className="text-base font-bold">Grafik WHO</Text>
                        </View>
                        <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerHighest }} className="flex-row items-center gap-1 py-2 pl-4 pr-3 rounded-full">
                            <Text style={{ color: colors.onSurface }} className="text-sm font-medium">Grafik 0 - 24 Bulan</Text>
                            <MaterialIcons name="arrow-drop-down" size={20} color={colors.onSurface} />
                        </TouchableOpacity>
                    </View>

                    {/* Chart Container */}
                    <View style={{ backgroundColor: '#ecefe5' }} className="rounded-2xl p-4">
                        {/* Chart Title */}
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mb-3">Berat badan (kg)</Text>

                        {/* SVG Chart */}
                        <View className="relative w-full" style={{ aspectRatio: 1.4 }}>
                            {/* Y-Axis Labels (Weight in kg) */}
                            <View className="absolute left-0 top-0 bottom-8 w-6 justify-between">
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">8</Text>
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">7</Text>
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">6</Text>
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">5</Text>
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">4</Text>
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">3</Text>
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">2</Text>
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">1</Text>
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
                                    {/* Yellow Zone (At Risk - below -2 SD) - Strip only */}
                                    <Path d="M0,92 C10,90 30,85 50,78 C70,71 90,65 100,60 L100,50 C90,55 70,61 50,68 C30,75 10,80 0,82 Z" fill="#FFC107" opacity="0.3" />

                                    {/* Green Zone (Normal - between -2 and +2 SD) */}
                                    <Path d="M0,82 C10,80 30,75 50,68 C70,61 90,55 100,50 L100,25 C90,30 70,36 50,43 C30,50 10,55 0,57 Z" fill="#4CAF50" opacity="0.3" />

                                    {/* Yellow Zone (At Risk - above +2 SD) - Strip only */}
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
                                    <Path d="M0,88 C20,75 40,62 60,52 Q70,47 80,45" fill="none" stroke={colors.primary} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />

                                    {/* Data Points - Smaller */}
                                    <Circle cx="0" cy="88" r="2.5" fill={colors.primary} stroke="#F8FAF0" strokeWidth="1" />
                                    <Circle cx="80" cy="45" r="3.5" fill={colors.primary} stroke="#F8FAF0" strokeWidth="1.5" />
                                </Svg>
                            </View>

                            {/* X-Axis Labels (Age in months) */}
                            <View className="absolute left-7 right-7 bottom-0 h-8 flex-row justify-between items-start pt-1">
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">0</Text>
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">5</Text>
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">10</Text>
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">15</Text>
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">20</Text>
                                <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">25</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* History List */}
                <View className="flex-row items-center justify-between mb-4 px-1">
                    <Text style={{ color: colors.onSurface }} className="text-base font-bold">Daftar Pengukuran</Text>
                    <TouchableOpacity className="flex-row items-center gap-1">
                        <MaterialIcons name="filter-list" size={16} color={colors.primary} />
                        <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wide">Filter</Text>
                    </TouchableOpacity>
                </View>

                <View className="gap-4">
                    {/* Item 1 */}
                    <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-2xl p-5">
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <View className="flex-row items-center gap-2 mb-1">
                                    <MaterialIcons name="calendar-today" size={16} color={colors.outline} />
                                    <Text style={{ color: colors.onSurface }} className="font-bold">12 Oktober 2023</Text>
                                </View>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium ml-6">Usia: 2 Thn 3 Bln</Text>
                            </View>
                            <View style={{ backgroundColor: colors.primaryContainer }} className="px-2.5 py-1 rounded-full">
                                <Text style={{ color: colors.onPrimaryContainer }} className="text-xs font-bold">Gizi Baik</Text>
                            </View>
                        </View>
                        {/* Metrics Grid */}
                        <View className="flex-row">
                            <View style={{ borderColor: colors.outlineVariant }} className="flex-1 items-center px-1 border-r">
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] uppercase font-bold mb-0.5 tracking-wider">Berat (BB)</Text>
                                <View className="flex-row items-baseline gap-0.5">
                                    <Text style={{ color: colors.onSurface }} className="text-lg font-extrabold">12.5</Text>
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold">kg</Text>
                                </View>
                                <Text style={{ color: colors.primary }} className="text-[10px] font-bold mt-1">Normal</Text>
                            </View>
                            <View style={{ borderColor: colors.outlineVariant }} className="flex-1 items-center px-1 border-r">
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] uppercase font-bold mb-0.5 tracking-wider">Tinggi (TB)</Text>
                                <View className="flex-row items-baseline gap-0.5">
                                    <Text style={{ color: colors.onSurface }} className="text-lg font-extrabold">88.0</Text>
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold">cm</Text>
                                </View>
                                <Text style={{ color: colors.primary }} className="text-[10px] font-bold mt-1">Normal</Text>
                            </View>
                            <View className="flex-1 items-center px-1">
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] uppercase font-bold mb-0.5 tracking-wider">Kepala (LK)</Text>
                                <View className="flex-row items-baseline gap-0.5">
                                    <Text style={{ color: colors.onSurface }} className="text-lg font-extrabold">48.2</Text>
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold">cm</Text>
                                </View>
                                <Text style={{ color: colors.primary }} className="text-[10px] font-bold mt-1">Normal</Text>
                            </View>
                        </View>
                    </View>

                    {/* Item 2 (Risk) */}
                    <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-2xl p-5">
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <View className="flex-row items-center gap-2 mb-1">
                                    <MaterialIcons name="calendar-today" size={16} color={colors.outline} />
                                    <Text style={{ color: colors.onSurface }} className="font-bold">12 Agustus 2023</Text>
                                </View>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium ml-6">Usia: 2 Thn 1 Bln</Text>
                            </View>
                            <View style={{ backgroundColor: colors.tertiaryContainer }} className="px-2.5 py-1 rounded-full">
                                <Text style={{ color: colors.onTertiaryContainer }} className="text-xs font-bold">Risiko Kurang</Text>
                            </View>
                        </View>
                        <View className="flex-row">
                            <View style={{ borderColor: colors.outlineVariant }} className="flex-1 items-center px-1 border-r">
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] uppercase font-bold mb-0.5 tracking-wider">Berat (BB)</Text>
                                <View className="flex-row items-baseline gap-0.5">
                                    <Text style={{ color: colors.onSurface }} className="text-lg font-extrabold">11.0</Text>
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold">kg</Text>
                                </View>
                                <Text style={{ color: colors.warning }} className="text-[10px] font-bold mt-1">Kurang</Text>
                            </View>
                            <View style={{ borderColor: colors.outlineVariant }} className="flex-1 items-center px-1 border-r">
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] uppercase font-bold mb-0.5 tracking-wider">Tinggi (TB)</Text>
                                <View className="flex-row items-baseline gap-0.5">
                                    <Text style={{ color: colors.onSurface }} className="text-lg font-extrabold">86.0</Text>
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold">cm</Text>
                                </View>
                            </View>
                            <View className="flex-1 items-center px-1">
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px] uppercase font-bold mb-0.5 tracking-wider">Kepala (LK)</Text>
                                <View className="flex-row items-baseline gap-0.5">
                                    <Text style={{ color: colors.onSurface }} className="text-lg font-extrabold">47.0</Text>
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold">cm</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="items-center justify-center pt-4 mb-8">
                    <Text style={{ color: colors.outline }} className="text-xs font-medium">Menampilkan 4 data terakhir</Text>
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <View style={{ backgroundColor: colors.surface }} className="absolute bottom-0 left-0 w-full p-5 pb-8">
                <TouchableOpacity
                    onPress={() => router.push('/anthropometry/input')}
                    style={{ backgroundColor: colors.primary }}
                    className="w-full h-14 rounded-xl flex-row items-center justify-center gap-2"
                >
                    <MaterialIcons name="add" size={24} color={colors.onPrimary} />
                    <Text style={{ color: colors.onPrimary }} className="font-bold text-base tracking-wide">TAMBAH DATA BARU</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
