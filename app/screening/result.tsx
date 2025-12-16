import Colors from '@/constants/colors';
import { Stack, router } from 'expo-router';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ScreeningResultScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center p-4 sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-black/5 dark:active:bg-white/10">
                    <MaterialIcons name="arrow-back" size={24} className="text-slate-900 dark:text-white" color="#333" />
                </TouchableOpacity>
                <Text className="flex-1 text-center font-bold text-lg tracking-tight text-slate-900 dark:text-white">Hasil Screening</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 pb-28" showsVerticalScrollIndicator={false}>
                {/* Celebratory Header */}
                <View className="items-center pt-6 pb-8 px-4">
                    <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-5 shadow-xl shadow-primary/20 bg-yellow-400">
                        <MaterialIcons name="check-circle" size={48} color={Colors.textInverted} />
                    </View>
                    <Text className="text-slate-900 dark:text-white tracking-tight text-[28px] font-extrabold leading-tight text-center">Skrining Selesai!</Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-base font-medium leading-normal pt-2 text-center">Data tumbuh kembang anak berhasil disimpan.</Text>
                </View>

                <View className="gap-6 px-4">
                    {/* Patient Card */}
                    <View className="bg-white dark:bg-card-dark p-5 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex-row items-center gap-5">
                        <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-700">
                            <Image
                                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCneOqf5Hu70YeaSWtdsy33AkF1GLiIIdJYpXTzK8EVidyILR8jMcAxp035pJpAUf8fTivAR5jfUHJwAf_W-lX-64wsAwtGTf1KkUp6K5IGyvaZ4YjwZ298KW7RYZgkKWqWiy7AnR_G08Z8IFkOMjtUpOvMkNM5PD7qSVjps8WdSQfPmGjwMgeGJ0M18A2Z9WsAW_ey8qhaGNqqdoEBUo7Ro-GjgrcUh7lEzZ_9GBssn_Zj9RHCLZ9TZx6TqGEtK76Y5mO3KVqFRo" }}
                                className="w-full h-full"
                                contentFit="cover"
                            />
                        </View>
                        <View className="justify-center">
                            <Text className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Ananda Rizky</Text>
                            <View className="flex-row items-center gap-3 mt-1.5">
                                <View className="flex-row items-center gap-1 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">
                                    <MaterialIcons name="calendar-today" size={14} className="text-gray-600 dark:text-gray-300" color="#666" />
                                    <Text className="text-xs font-semibold text-gray-600 dark:text-gray-300">24 Bulan</Text>
                                </View>
                                <View className="flex-row items-center gap-1 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">
                                    <MaterialIcons name="face" size={14} className="text-gray-600 dark:text-gray-300" color="#666" />
                                    <Text className="text-xs font-semibold text-gray-600 dark:text-gray-300">Laki-laki</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Overall Result Banner */}
                    <View>
                        <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider px-1">Hasil Keseluruhan</Text>
                        <View className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 p-5 rounded-xl flex-row items-start gap-4 shadow-sm">
                            <View className="w-10 h-10 rounded-full bg-green-500 items-center justify-center flex-shrink-0 shadow-md shadow-green-500/20 mt-1">
                                <MaterialIcons name="verified" size={24} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-green-700 dark:text-green-400 font-bold text-lg leading-tight">Perkembangan Sesuai Umur</Text>
                                <Text className="text-green-800 dark:text-green-300 text-sm mt-1.5 leading-relaxed">Secara umum perkembangan anak sangat baik. Tidak ditemukan indikasi keterlambatan yang signifikan.</Text>
                            </View>
                        </View>
                    </View>

                    {/* Domain Breakdown */}
                    <View>
                        <View className="flex-row justify-between items-end mb-4 px-1">
                            <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detail Per Domain</Text>
                            <TouchableOpacity>
                                <Text className="text-xs text-yellow-700 dark:text-primary font-bold">Lihat Grafik Lengkap</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="gap-3">
                            {/* Domain 1: Komunikasi */}
                            <View className="bg-white dark:bg-card-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                                <View className="flex-row justify-between items-center mb-3">
                                    <View className="flex-row items-center gap-2.5">
                                        <View className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <MaterialIcons name="chat-bubble" size={20} className="text-blue-600 dark:text-blue-400" color="#2563EB" />
                                        </View>
                                        <Text className="font-bold text-slate-900 dark:text-white">Komunikasi</Text>
                                    </View>
                                    <View className="px-2.5 py-1 rounded-md bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30">
                                        <Text className="text-green-700 dark:text-green-300 text-xs font-bold">Sesuai</Text>
                                    </View>
                                </View>
                                <View className="relative h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full mb-2.5 overflow-hidden">
                                    <View className="absolute top-0 bottom-0 w-0.5 bg-black/20 dark:bg-white/30 z-10 left-[45%]"></View>
                                    <View className="absolute top-0 left-0 h-full bg-green-500 rounded-full w-[85%]"></View>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-xs font-semibold text-slate-900 dark:text-white">Skor: <Text className="text-base">55</Text></Text>
                                    <Text className="text-xs font-medium text-gray-400">Cutoff: 25.17</Text>
                                </View>
                            </View>

                            {/* Domain 2: Motorik Kasar */}
                            <View className="bg-white dark:bg-card-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                                <View className="flex-row justify-between items-center mb-3">
                                    <View className="flex-row items-center gap-2.5">
                                        <View className="p-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                            <MaterialIcons name="directions-run" size={20} className="text-orange-600 dark:text-orange-400" color="#EA580C" />
                                        </View>
                                        <Text className="font-bold text-slate-900 dark:text-white">Motorik Kasar</Text>
                                    </View>
                                    <View className="px-2.5 py-1 rounded-md bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30">
                                        <Text className="text-green-700 dark:text-green-300 text-xs font-bold">Sesuai</Text>
                                    </View>
                                </View>
                                <View className="relative h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full mb-2.5 overflow-hidden">
                                    <View className="absolute top-0 bottom-0 w-0.5 bg-black/20 dark:bg-white/30 z-10 left-[60%]"></View>
                                    <View className="absolute top-0 left-0 h-full bg-green-500 rounded-full w-[90%]"></View>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-xs font-semibold text-slate-900 dark:text-white">Skor: <Text className="text-base">60</Text></Text>
                                    <Text className="text-xs font-medium text-gray-400">Cutoff: 38.00</Text>
                                </View>
                            </View>

                            {/* Domain 3: Motorik Halus */}
                            <View className="bg-white dark:bg-card-dark p-4 rounded-xl border border-primary/40 dark:border-primary/30 shadow-sm ring-1 ring-primary/20">
                                <View className="flex-row justify-between items-center mb-3">
                                    <View className="flex-row items-center gap-2.5">
                                        <View className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <MaterialIcons name="edit" size={20} className="text-purple-600 dark:text-purple-400" color="#9333EA" />
                                        </View>
                                        <Text className="font-bold text-slate-900 dark:text-white">Motorik Halus</Text>
                                    </View>
                                    <View className="px-2.5 py-1 rounded-md bg-primary/20 border border-primary/30">
                                        <Text className="text-yellow-800 dark:text-yellow-200 text-xs font-bold">Pantau</Text>
                                    </View>
                                </View>
                                <View className="relative h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full mb-2.5 overflow-hidden">
                                    <View className="absolute top-0 bottom-0 w-0.5 bg-black/20 dark:bg-white/30 z-10 left-[45%]"></View>
                                    <View className="absolute top-0 left-0 h-full bg-primary rounded-full w-[45%]"></View>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-xs font-semibold text-slate-900 dark:text-white">Skor: <Text className="text-base">35</Text></Text>
                                    <Text className="text-xs font-medium text-gray-400">Cutoff: 35.00</Text>
                                </View>
                                <View className="mt-3 bg-background-light dark:bg-white/5 p-2.5 rounded-lg flex-row gap-2 items-start">
                                    <MaterialIcons name="info" size={16} className="text-yellow-700 dark:text-yellow-500 mt-0.5" color="#B45309" />
                                    <Text className="text-xs text-gray-700 dark:text-gray-300 leading-tight">
                                        Skor berada pada ambang batas. Disarankan untuk memberikan stimulasi tambahan pada aktivitas menggambar dan menyusun balok.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Recommendations */}
                    <View>
                        <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider px-1">Rekomendasi Pengasuhan</Text>
                        <View className="bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                            <View className="p-4 border-b border-gray-100 dark:border-gray-700 bg-primary/10 flex-row items-center gap-3">
                                <View className="p-1 bg-primary/20 rounded-full">
                                    <MaterialIcons name="lightbulb" size={20} className="text-yellow-700 dark:text-primary" color="#B45309" />
                                </View>
                                <Text className="text-sm font-bold text-slate-900 dark:text-white">Tips Stimulasi Usia 24 Bulan</Text>
                            </View>
                            <View className="p-4 pt-5 gap-4">
                                <View className="flex-row gap-3 items-start">
                                    <MaterialIcons name="check" size={18} className="text-green-500 mt-0.5" color="#22C55E" />
                                    <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">Ajak anak berbicara saat melakukan aktivitas sehari-hari (mandi, makan) untuk melatih kosa kata.</Text>
                                </View>
                                <View className="flex-row gap-3 items-start">
                                    <MaterialIcons name="check" size={18} className="text-green-500 mt-0.5" color="#22C55E" />
                                    <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">Berikan kesempatan anak untuk memegang sendok dan makan sendiri untuk melatih motorik halus.</Text>
                                </View>
                                <View className="flex-row gap-3 items-start">
                                    <MaterialIcons name="check" size={18} className="text-green-500 mt-0.5" color="#22C55E" />
                                    <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">Sediakan kertas dan krayon besar, biarkan anak mencoret-coret bebas.</Text>
                                </View>

                                <TouchableOpacity className="w-full mt-2 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-white/5 flex-row justify-center items-center gap-2">
                                    <Text className="text-sm font-bold text-slate-900 dark:text-primary">Lihat Semua Rekomendasi</Text>
                                    <MaterialIcons name="arrow-forward" size={18} className="text-slate-900 dark:text-primary" color="#333" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View className="absolute bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-card-dark/90 backdrop-blur-md border-t border-gray-100 dark:border-white/5 z-40">
                <TouchableOpacity onPress={() => router.push('/(tabs)')} className="w-full bg-primary active:bg-yellow-500 items-center justify-center py-4 rounded-xl shadow-lg shadow-primary/20">
                    <Text className="text-[#2d1f1f] font-extrabold text-base">KEMBALI KE HOME</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
