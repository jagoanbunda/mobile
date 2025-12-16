import { Stack, router } from 'expo-router';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';

export default function ScreeningScreen() {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-20">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10">
                    <MaterialIcons name="arrow-back" size={24} className="text-slate-900 dark:text-white" color="#333" />
                </TouchableOpacity>
                <Text className="text-lg font-bold leading-tight flex-1 text-center text-slate-900 dark:text-white">KPSP Screening</Text>
                <TouchableOpacity className="flex-row items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 active:bg-black/5 dark:active:bg-white/10">
                    <Text className="text-sm font-bold text-primary">Cetak</Text>
                    <MaterialIcons name="print" size={20} color="#FAC638" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 pt-2 pb-32" showsVerticalScrollIndicator={false}>
                {/* Child Profile */}
                <View className="flex-row items-center gap-4 rounded-xl bg-white dark:bg-card-dark p-4 shadow-sm border border-slate-200 dark:border-white/5 mb-6">
                    <View className="w-14 h-14 shrink-0 overflow-hidden rounded-full bg-slate-200">
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMlymQ-A11UJdpVD6FzTQKd6nqjXVju5ztuJFHzyarGVtjPyz0BQXEK-RCGbMRVbN-LzFpO-PE0BISafrXDinVM2kXNB5QOjjV0j8oQQ6AXgtqmmgO_FHkyOO5ISfqh2zu46eaG7fKp2PF994MC3RwsNgQL583wBshfBBABlXuy8z5ARrCKAcSFUnY6Dwsd7wuRWnjja58_-BodVGsqKhcHunPFYjkiXK6JgWZ7a65cGGnCXDXHv5RjXQq9dpcI_nm-DwUUfjQUgo" }}
                            className="w-full h-full"
                            contentFit="cover"
                        />
                    </View>
                    <View className="flex-1 gap-1">
                        <Text className="text-lg font-bold leading-tight text-slate-900 dark:text-white">Budi Santoso</Text>
                        <View className="flex-row flex-wrap gap-x-4 gap-y-1">
                            <View className="flex-row items-center gap-1">
                                <MaterialIcons name="cake" size={16} className="text-slate-500 dark:text-slate-400" color="#888" />
                                <Text className="text-sm text-slate-500 dark:text-slate-400">35 Months</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <MaterialIcons name="track-changes" size={16} color="#FAC638" />
                                <Text className="text-sm font-bold text-primary">Screening: 36 Months</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Progress Bar */}
                <View className="gap-2 mb-6">
                    <View className="flex-row justify-between items-end">
                        <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">Progress</Text>
                        <Text className="text-sm font-bold text-slate-900 dark:text-white">Question 3 of 10</Text>
                    </View>
                    <View className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <View className="h-3 rounded-full bg-primary w-[30%]"></View>
                    </View>
                </View>

                {/* Question Card */}
                <View className="rounded-xl bg-white dark:bg-card-dark overflow-hidden shadow-sm border border-slate-200 dark:border-white/5 mb-4">
                    <View className="relative w-full aspect-[4/3] bg-slate-100 dark:bg-black/20">
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFkUwnVOKng70MVTlwF8hf3SvINi_pPhf1p6DNVolH9owd3qpsN8LlgOUPUQ_mZwdEq8OuQxloE8z_cDvM3meZq1lVu8JVUhjTA5D7acYpjbhIs-ilLL5vHOw5XnoiJIjV0r_FHkyOO5ISfqh2zu46eaG7fKp2PF994MC3RwsNgQL583wBshfBBABlXuy8z5ARrCKAcSFUnY6Dwsd7wuRWnjja58_-BodVGsqKhcHunPFYjkiXK6JgWZ7a65cGGnCXDXHv5RjXQq9dpcI_nm-DwUUfjQUgo" }}
                            className="w-full h-full"
                            contentFit="cover"
                        />
                        <View className="absolute top-4 left-4">
                            <View className="px-3 py-1 rounded-full bg-black/60 border border-white/10">
                                <Text className="text-xs font-bold text-white uppercase tracking-wider">Motorik Halus</Text>
                            </View>
                        </View>
                    </View>
                    <View className="p-5 gap-4">
                        <View className="gap-2">
                            <Text className="text-xl font-bold leading-snug tracking-tight text-slate-900 dark:text-white">
                                Can the child stack 3 blocks on top of each other without them falling?
                            </Text>
                            <View className="flex-row items-start gap-2">
                                <MaterialIcons name="info-outline" size={18} className="text-slate-500 dark:text-slate-400 mt-0.5" color="#888" />
                                <Text className="text-slate-500 dark:text-slate-400 text-sm italic leading-relaxed flex-1">
                                    Observe the child's movement carefully. Do not help them stack the blocks.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Answers */}
                <View className="gap-3 pb-24">
                    <TouchableOpacity
                        onPress={() => setSelectedAnswer('YA')}
                        className={`flex-row items-center gap-4 rounded-xl border-2 p-3 transition-all active:bg-slate-50 dark:active:bg-slate-800 ${selectedAnswer === 'YA' ? 'border-primary bg-primary/10 dark:bg-primary/20' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-card-dark'}`}
                    >
                        <View className={`w-10 h-10 items-center justify-center rounded-full ${selectedAnswer === 'YA' ? 'bg-primary' : 'bg-slate-100 dark:bg-black/40'}`}>
                            <MaterialIcons name="check" size={24} color={selectedAnswer === 'YA' ? '#000' : '#94A3B8'} />
                        </View>
                        <Text className={`text-base font-bold flex-1 ${selectedAnswer === 'YA' ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>YA</Text>
                        {selectedAnswer === 'YA' && <View className="w-2 h-2 rounded-full bg-primary"></View>}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelectedAnswer('KADANG')}
                        className={`flex-row items-center gap-4 rounded-xl border-2 p-3 transition-all active:bg-slate-50 dark:active:bg-slate-800 ${selectedAnswer === 'KADANG' ? 'border-blue-400 bg-blue-400/10 dark:bg-blue-400/20' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-card-dark'}`}
                    >
                        <View className={`w-10 h-10 items-center justify-center rounded-full ${selectedAnswer === 'KADANG' ? 'bg-blue-400' : 'bg-slate-100 dark:bg-black/40'}`}>
                            <MaterialIcons name="timelapse" size={24} color={selectedAnswer === 'KADANG' ? '#fff' : '#94A3B8'} />
                        </View>
                        <Text className={`text-base font-bold flex-1 ${selectedAnswer === 'KADANG' ? 'text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>KADANG-KADANG</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelectedAnswer('TIDAK')}
                        className={`flex-row items-center gap-4 rounded-xl border-2 p-3 transition-all active:bg-slate-50 dark:active:bg-slate-800 ${selectedAnswer === 'TIDAK' ? 'border-red-500 bg-red-500/10 dark:bg-red-500/20' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-card-dark'}`}
                    >
                        <View className={`w-10 h-10 items-center justify-center rounded-full ${selectedAnswer === 'TIDAK' ? 'bg-red-500' : 'bg-slate-100 dark:bg-black/40'}`}>
                            <MaterialIcons name="close" size={24} color={selectedAnswer === 'TIDAK' ? '#fff' : '#94A3B8'} />
                        </View>
                        <Text className={`text-base font-bold flex-1 ${selectedAnswer === 'TIDAK' ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'}`}>TIDAK</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Footer Navigation */}
            <View className="absolute bottom-0 left-0 w-full px-4 pb-6 pt-2 z-50">
                <View className="flex-row items-center justify-between gap-4 rounded-lg bg-[#231e0f]/90 dark:bg-[#1c2b18]/90 backdrop-blur-xl p-2 border border-white/5 shadow-2xl">
                    <TouchableOpacity className="flex-row items-center justify-center gap-2 rounded-full px-5 py-3 active:bg-white/5">
                        <MaterialIcons name="chevron-left" size={20} color="white" />
                        <Text className="text-sm font-bold text-white">Prev</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/5 active:bg-white/10">
                        <MaterialIcons name="grid-view" size={20} className="text-slate-300" color="#cbd5e1" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/screening/result')}
                        className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 shadow-lg shadow-primary/30 active:opacity-90"
                    >
                        <Text className="text-sm font-bold text-black">Next</Text>
                        <MaterialIcons name="chevron-right" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
