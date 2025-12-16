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
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold mb-3 uppercase tracking-wider px-1">Hasil Keseluruhan</Text>
                        <View style={{ backgroundColor: colors.primaryContainer }} className="p-5 rounded-2xl flex-row items-start gap-4">
                            <View style={{ backgroundColor: colors.primary }} className="w-10 h-10 rounded-full items-center justify-center mt-1">
                                <MaterialIcons name="verified" size={24} color={colors.onPrimary} />
                            </View>
                            <View className="flex-1">
                                <Text style={{ color: colors.onPrimaryContainer }} className="font-bold text-lg leading-tight">{resultData.overallMessage}</Text>
                                <Text style={{ color: colors.onPrimaryContainer }} className="text-sm mt-1.5 leading-relaxed opacity-80">{resultData.overallDescription}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Domain Breakdown */}
                    <View>
                        <View className="flex-row justify-between items-end mb-4 px-1">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold uppercase tracking-wider">Detail Per Domain</Text>
                            <TouchableOpacity>
                                <Text style={{ color: colors.primary }} className="text-xs font-bold">Lihat Grafik Lengkap</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="gap-3">
                            {resultData.domains.map((domain, idx) => {
                                const statusColors = getStatusColor(domain.status);

                                return (
                                    <View
                                        key={idx}
                                        style={{
                                            backgroundColor: colors.surfaceContainerHigh,
                                            borderColor: domain.status === 'Pantau' ? colors.tertiary : 'transparent',
                                            borderWidth: domain.status === 'Pantau' ? 1 : 0,
                                        }}
                                        className="p-4 rounded-xl"
                                    >
                                        <View className="flex-row justify-between items-center mb-3">
                                            <View className="flex-row items-center gap-2.5">
                                                <View style={{ backgroundColor: `${domain.color}20` }} className="p-1.5 rounded-lg">
                                                    <MaterialIcons name={domain.icon as any} size={18} color={domain.color} />
                                                </View>
                                                <Text style={{ color: colors.onSurface }} className="font-bold">{domain.name}</Text>
                                            </View>
                                            <View style={{ backgroundColor: statusColors.bg }} className="px-2.5 py-1 rounded-full">
                                                <Text style={{ color: statusColors.text }} className="text-xs font-bold">{domain.status}</Text>
                                            </View>
                                        </View>
                                        {/* Progress Bar */}
                                        <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="relative h-2.5 w-full rounded-full mb-2.5 overflow-hidden">
                                            <View style={{ left: `${(domain.cutoff / 60) * 100}%` }} className="absolute top-0 bottom-0 w-0.5 bg-black/20 z-10" />
                                            <View style={{ backgroundColor: statusColors.bar, width: `${domain.percentage}%` }} className="absolute top-0 left-0 h-full rounded-full" />
                                        </View>
                                        <View className="flex-row justify-between">
                                            <Text style={{ color: colors.onSurface }} className="text-xs font-semibold">Skor: <Text className="text-base">{domain.score}</Text></Text>
                                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">Cutoff: {domain.cutoff}</Text>
                                        </View>
                                        {domain.warning && (
                                            <View style={{ backgroundColor: colors.tertiaryContainer }} className="mt-3 p-2.5 rounded-lg flex-row gap-2 items-start">
                                                <MaterialIcons name="info" size={16} color={colors.tertiary} />
                                                <Text style={{ color: colors.onTertiaryContainer }} className="text-xs leading-tight flex-1">{domain.warning}</Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Recommendations */}
                    <View>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold mb-3 uppercase tracking-wider px-1">Rekomendasi Pengasuhan</Text>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-2xl overflow-hidden">
                            <View style={{ backgroundColor: colors.primaryContainer }} className="p-4 flex-row items-center gap-3">
                                <View style={{ backgroundColor: colors.primary }} className="p-1.5 rounded-full">
                                    <MaterialIcons name="lightbulb" size={18} color={colors.onPrimary} />
                                </View>
                                <Text style={{ color: colors.onPrimaryContainer }} className="text-sm font-bold">Tips Stimulasi Usia {resultData.child.age}</Text>
                            </View>
                            <View className="p-4 pt-5 gap-4">
                                {resultData.recommendations.map((rec, idx) => (
                                    <View key={idx} className="flex-row gap-3 items-start">
                                        <MaterialIcons name="check" size={18} color={colors.primary} />
                                        <Text style={{ color: colors.onSurface }} className="text-sm leading-relaxed flex-1">{rec}</Text>
                                    </View>
                                ))}
                                <TouchableOpacity style={{ borderColor: colors.outline }} className="w-full mt-2 py-2.5 rounded-xl border flex-row justify-center items-center gap-2">
                                    <Text style={{ color: colors.primary }} className="text-sm font-bold">Lihat Semua Rekomendasi</Text>
                                    <MaterialIcons name="arrow-forward" size={18} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={{ backgroundColor: colors.surface }} className="absolute bottom-0 left-0 w-full p-4 pb-8">
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/screening')}
                    style={{ backgroundColor: colors.primary }}
                    className="w-full items-center justify-center py-4 rounded-xl"
                >
                    <Text style={{ color: colors.onPrimary }} className="font-extrabold text-base">KEMBALI KE TUMBUH KEMBANG</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
