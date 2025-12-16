import Colors from '@/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

export default function GrowthChartScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background-dark pt-12">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center justify-between p-4 pb-2 bg-background-dark">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full active:bg-white/10">
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 text-white">Riwayat Pengukuran</Text>
            </View>

            <ScrollView
                className="flex-1 px-5 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Child Profile */}
                <View className="bg-[#3d2a2a] p-4 rounded-2xl shadow-sm border border-[#5a4040] mb-6 flex-row items-center gap-4">
                    <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center border-2 border-primary/30 shrink-0">
                        <MaterialIcons name="child-care" size={24} color={Colors.primary} />
                    </View>
                    <View>
                        <Text className="text-lg font-bold text-white leading-tight">Ananda Rizky</Text>
                        <View className="flex-row items-center gap-2 mt-0.5">
                            <Text className="text-xs font-medium text-[#d4a0a0]">2 Tahun 3 Bulan</Text>
                            <View className="w-1 h-1 rounded-full bg-gray-600" />
                            <Text className="text-xs font-medium text-[#d4a0a0]">Laki-laki</Text>
                        </View>
                    </View>
                </View>

                <View className="mb-8">
                    <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name="show-chart" size={20} color={Colors.primary} />
                            <Text className="text-base font-bold text-white">Grafik KMS (BB/U)</Text>
                        </View>
                        <TouchableOpacity className="bg-[#4a3535] flex-row items-center gap-1 border-none py-1 pl-3 pr-2 rounded-full shadow-sm">
                            <Text className="text-xs font-bold text-primary">BB / Umur</Text>
                            <MaterialIcons name="arrow-drop-down" size={20} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Chart Container */}
                    <View className="bg-[#3d2a2a] rounded-2xl p-4 shadow-sm border border-[#5a4040]">
                        {/* Legend */}
                        <View className="flex-row items-center gap-3 justify-center mb-4">
                            <View className="flex-row items-center gap-1">
                                <View className="w-2 h-2 rounded-full bg-green-500" />
                                <Text className="text-[10px] text-[#d4a0a0]">Normal</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <View className="w-2 h-2 rounded-full bg-yellow-400" />
                                <Text className="text-[10px] text-[#d4a0a0]">Risiko</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <View className="w-3 h-3 rounded-full bg-primary border-2 border-[#3d2a2a]" />
                                <Text className="text-[10px] text-[#d4a0a0]">Anak</Text>
                            </View>
                        </View>

                        {/* SVG Chart */}
                        <View className="relative w-full aspect-[16/9]">
                            {/* Y-Axis Labels */}
                            <View className="absolute left-0 top-0 bottom-6 w-6 justify-between pr-1">
                                <Text className="text-[9px] text-[#d4a0a0] font-medium text-right">15kg</Text>
                                <Text className="text-[9px] text-[#d4a0a0] font-medium text-right">12kg</Text>
                                <Text className="text-[9px] text-[#d4a0a0] font-medium text-right">9kg</Text>
                                <Text className="text-[9px] text-[#d4a0a0] font-medium text-right">6kg</Text>
                                <Text className="text-[9px] text-[#d4a0a0] font-medium text-right">3kg</Text>
                            </View>

                            {/* Chart Area */}
                            <View className="absolute left-6 top-0 right-0 bottom-6 border-l border-b border-white/10">
                                <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {/* Grid Lines */}
                                    {[0, 20, 40, 60, 80].map((y) => (
                                        <Line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#5a4040" strokeWidth="0.5" strokeDasharray="4 2" />
                                    ))}

                                    {/* Growth Curves */}
                                    <Path d="M0,80 C20,60 50,40 100,20" fill="none" stroke="#fcd34d" strokeDasharray="4 2" strokeWidth="2" opacity="0.5" />
                                    <Path d="M0,85 C20,65 50,45 100,25" fill="none" stroke="#22c55e" strokeWidth="2" />
                                    <Path d="M0,90 C20,75 50,55 100,35" fill="none" stroke="#fcd34d" strokeDasharray="4 2" strokeWidth="2" opacity="0.5" />

                                    {/* Child Data Line */}
                                    <Path d="M10,85 L30,68 L50,55 L70,30 L90,28" fill="none" stroke="#F5AFAF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />

                                    {/* Data Points */}
                                    <Circle cx="10" cy="85" r="4" fill="#F5AFAF" stroke="#3d2a2a" strokeWidth="2" />
                                    <Circle cx="30" cy="68" r="4" fill="#F5AFAF" stroke="#3d2a2a" strokeWidth="2" />
                                    <Circle cx="50" cy="55" r="4" fill="#F5AFAF" stroke="#3d2a2a" strokeWidth="2" />
                                    <Circle cx="70" cy="30" r="4" fill="#F5AFAF" stroke="#3d2a2a" strokeWidth="2" />
                                    <Circle cx="90" cy="28" r="5" fill="#F5AFAF" stroke="#3d2a2a" strokeWidth="2" />

                                    {/* Tooltip */}
                                    <G x="55" y="5">
                                        <Rect width="40" height="18" rx="4" fill="#4a3535" opacity="0.9" />
                                        <SvgText x="75" y="16" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">12.5 kg</SvgText>
                                    </G>
                                </Svg>
                            </View>

                            {/* X-Axis Labels */}
                            <View className="absolute left-6 right-0 bottom-0 h-6 flex-row justify-between pt-1 px-1">
                                <Text className="text-[9px] text-[#d4a0a0] font-medium">Jul</Text>
                                <Text className="text-[9px] text-[#d4a0a0] font-medium">Aug</Text>
                                <Text className="text-[9px] text-[#d4a0a0] font-medium">Sep</Text>
                                <Text className="text-[9px] text-[#d4a0a0] font-medium">Oct</Text>
                                <Text className="text-[9px] text-[#d4a0a0] font-medium">Nov</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* History List */}
                <View className="flex-row items-center justify-between mb-4 px-1">
                    <Text className="text-base font-bold text-white">Daftar Pengukuran</Text>
                    <TouchableOpacity className="flex-row items-center gap-1">
                        <MaterialIcons name="filter-list" size={16} color={Colors.primary} />
                        <Text className="text-xs font-bold text-primary uppercase tracking-wide">Filter</Text>
                    </TouchableOpacity>
                </View>

                <View className="gap-4">
                    {/* Item 1 */}
                    <View className="bg-[#4a3535] rounded-2xl p-5 border border-[#5a4040] shadow-sm">
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <View className="flex-row items-center gap-2 mb-1">
                                    <MaterialIcons name="calendar-today" size={16} color={Colors.textMuted} />
                                    <Text className="font-bold text-white">12 Oktober 2023</Text>
                                </View>
                                <Text className="text-xs font-medium text-[#d4a0a0] ml-6">Usia: 2 Thn 3 Bln</Text>
                            </View>
                            <View className="px-2.5 py-1 rounded-full bg-green-900/30 border border-green-800/50">
                                <Text className="text-xs font-bold text-green-400">Gizi Baik</Text>
                            </View>
                        </View>
                        {/* Metrics Grid */}
                        <View className="flex-row">
                            <View className="flex-1 items-center px-1 border-r border-white/10">
                                <Text className="text-[10px] uppercase font-bold text-[#d4a0a0] mb-0.5 tracking-wider">Berat (BB)</Text>
                                <View className="flex-row items-baseline gap-0.5">
                                    <Text className="text-lg font-extrabold text-white">12.5</Text>
                                    <Text className="text-xs font-bold text-[#d4a0a0]">kg</Text>
                                </View>
                                <Text className="text-[10px] font-bold text-green-400 mt-1">Normal</Text>
                            </View>
                            <View className="flex-1 items-center px-1 border-r border-white/10">
                                <Text className="text-[10px] uppercase font-bold text-[#d4a0a0] mb-0.5 tracking-wider">Tinggi (TB)</Text>
                                <View className="flex-row items-baseline gap-0.5">
                                    <Text className="text-lg font-extrabold text-white">88.0</Text>
                                    <Text className="text-xs font-bold text-[#d4a0a0]">cm</Text>
                                </View>
                                <Text className="text-[10px] font-bold text-green-400 mt-1">Normal</Text>
                            </View>
                            <View className="flex-1 items-center px-1">
                                <Text className="text-[10px] uppercase font-bold text-[#d4a0a0] mb-0.5 tracking-wider">Kepala (LK)</Text>
                                <View className="flex-row items-baseline gap-0.5">
                                    <Text className="text-lg font-extrabold text-white">48.2</Text>
                                    <Text className="text-xs font-bold text-[#d4a0a0]">cm</Text>
                                </View>
                                <Text className="text-[10px] font-bold text-green-400 mt-1">Normal</Text>
                            </View>
                        </View>
                    </View>

                    {/* Item 2 (Risk) */}
                    <View className="bg-[#4a3535] rounded-2xl p-5 border border-[#5a4040] shadow-sm">
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <View className="flex-row items-center gap-2 mb-1">
                                    <MaterialIcons name="calendar-today" size={16} color={Colors.textMuted} />
                                    <Text className="font-bold text-white">12 Agustus 2023</Text>
                                </View>
                                <Text className="text-xs font-medium text-[#d4a0a0] ml-6">Usia: 2 Thn 1 Bln</Text>
                            </View>
                            <View className="px-2.5 py-1 rounded-full bg-yellow-900/30 border border-yellow-800/50">
                                <Text className="text-xs font-bold text-yellow-400">Risiko Kurang</Text>
                            </View>
                        </View>
                        <View className="flex-row">
                            <View className="flex-1 items-center px-1 border-r border-white/10">
                                <Text className="text-[10px] uppercase font-bold text-[#d4a0a0] mb-0.5 tracking-wider">Berat (BB)</Text>
                                <View className="flex-row items-baseline gap-0.5">
                                    <Text className="text-lg font-extrabold text-white">11.0</Text>
                                    <Text className="text-xs font-bold text-[#d4a0a0]">kg</Text>
                                </View>
                                <Text className="text-[10px] font-bold text-yellow-400 mt-1">Kurang</Text>
                            </View>
                            <View className="flex-1 items-center px-1 border-r border-white/10">
                                <Text className="text-[10px] uppercase font-bold text-[#d4a0a0] mb-0.5 tracking-wider">Tinggi (TB)</Text>
                                <View className="flex-row items-baseline gap-0.5">
                                    <Text className="text-lg font-extrabold text-white">86.0</Text>
                                    <Text className="text-xs font-bold text-[#d4a0a0]">cm</Text>
                                </View>
                            </View>
                            <View className="flex-1 items-center px-1">
                                <Text className="text-[10px] uppercase font-bold text-[#d4a0a0] mb-0.5 tracking-wider">Kepala (LK)</Text>
                                <View className="flex-row items-baseline gap-0.5">
                                    <Text className="text-lg font-extrabold text-white">47.0</Text>
                                    <Text className="text-xs font-bold text-[#d4a0a0]">cm</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="items-center justify-center pt-4 mb-8">
                    <Text className="text-xs font-medium text-[#d4a0a0]/50">Menampilkan 4 data terakhir</Text>
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <View className="absolute bottom-0 left-0 w-full p-5 bg-background-dark z-10 pt-10">
                <TouchableOpacity
                    onPress={() => router.push('/anthropometry/input')}
                    className="w-full h-14 bg-primary active:bg-yellow-500 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                    <MaterialIcons name="add" size={24} color={Colors.backgroundDark} />
                    <Text className="text-background-dark font-bold text-base tracking-wide">TAMBAH DATA BARU</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
