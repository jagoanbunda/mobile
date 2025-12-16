import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function InputScreen() {
    const { colors } = useTheme();
    const [selectedMeal, setSelectedMeal] = useState('Pagi');

    const MealButton = ({ name, isSelected }: { name: string, isSelected: boolean }) => (
        <TouchableOpacity
            onPress={() => setSelectedMeal(name)}
            style={{ backgroundColor: isSelected ? colors.primary : colors.surfaceContainerHigh }}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-transform active:scale-95 ${isSelected ? 'shadow-lg' : ''}`}
        >
            <Text style={{ color: isSelected ? colors.onPrimary : colors.onSurface }} className="text-sm font-bold leading-normal">{name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {/* Header */}
                <View style={{ backgroundColor: colors.surface }} className="flex-none pt-4 pb-2 px-6 z-20">
                    <View className="flex justify-center mb-4 items-center">
                        <View style={{ backgroundColor: colors.outlineVariant }} className="h-1.5 w-12 rounded-full opacity-50" />
                    </View>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text style={{ color: colors.onSurface }} className="tracking-tight text-[28px] font-bold leading-tight">Catat Makanan</Text>
                        <TouchableOpacity>
                            <Text style={{ color: colors.primary }} className="text-sm font-medium">Tutup</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Calendar Strip - Compact */}
                    <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center justify-between rounded-xl p-3 mb-2">
                        <TouchableOpacity className="p-1">
                            <MaterialIcons name="chevron-left" size={20} color={colors.textMuted} />
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={{ backgroundColor: idx === 2 ? colors.primary : 'transparent' }}
                                    className={`items-center px-2 py-1 rounded-lg`}
                                >
                                    <Text style={{ color: idx === 2 ? colors.onPrimary : colors.onSurfaceVariant }} className="text-[10px] font-bold">{day}</Text>
                                    <Text style={{ color: idx === 2 ? colors.onPrimary : colors.onSurface, opacity: idx !== 2 ? 0.5 : 1 }} className="text-sm font-bold">{22 + idx}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity className="p-1">
                            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1 px-6 pt-2 pb-32">
                    {/* Meal Time Selector */}
                    <View className="flex-row gap-3 pb-4">
                        {['Pagi', 'Siang', 'Sore', 'Malam'].map((meal) => (
                            <MealButton key={meal} name={meal} isSelected={selectedMeal === meal} />
                        ))}
                    </View>

                    {/* Search Bar */}
                    <View className="relative mb-6 mt-2">
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row w-full items-center rounded-2xl h-14 shadow-sm overflow-hidden">
                            <View className="pl-4 pr-2">
                                <MaterialIcons name="search" size={24} color={colors.textMuted} />
                            </View>
                            <TextInput
                                style={{ color: colors.onSurface }}
                                className="flex-1 bg-transparent text-base font-medium h-full"
                                placeholder="Cari makanan..."
                                placeholderTextColor={colors.onSurfaceVariant}
                            />
                        </View>
                    </View>

                    {/* Selected Food List */}
                    <View className="gap-4 mb-6">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-bold uppercase tracking-wider pl-1">Makanan Terpilih</Text>

                        {/* Food Item 1 */}
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center justify-between p-3 pr-4 rounded-2xl shadow-sm">
                            <View className="flex-row items-center gap-3">
                                <View className="w-12 h-12 rounded-xl bg-orange-100 items-center justify-center">
                                    <MaterialIcons name="rice-bowl" size={24} color="#EA580C" />
                                </View>
                                <View>
                                    <Text style={{ color: colors.onSurface }} className="font-bold text-base">Nasi Putih</Text>
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">100 gram • 130 kkal</Text>
                                </View>
                            </View>
                            <View style={{ backgroundColor: colors.surfaceContainerLowest }} className="flex-row items-center rounded-full p-1 h-9">
                                <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerHigh }} className="w-7 h-7 items-center justify-center rounded-full shadow-sm active:scale-95">
                                    <MaterialIcons name="remove" size={16} color={colors.onSurface} />
                                </TouchableOpacity>
                                <Text style={{ color: colors.onSurface }} className="w-8 text-center text-sm font-bold">1</Text>
                                <TouchableOpacity style={{ backgroundColor: colors.primary }} className="w-7 h-7 items-center justify-center rounded-full shadow-sm active:scale-95">
                                    <MaterialIcons name="add" size={16} color={colors.onPrimary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Food Item 2 */}
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center justify-between p-3 pr-4 rounded-2xl shadow-sm">
                            <View className="flex-row items-center gap-3">
                                <View className="w-12 h-12 rounded-xl bg-yellow-100 items-center justify-center">
                                    <MaterialIcons name="egg" size={24} color="#CA8A04" />
                                </View>
                                <View>
                                    <Text style={{ color: colors.onSurface }} className="font-bold text-base">Telur Rebus</Text>
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">1 Butir (Large) • 78 kkal</Text>
                                </View>
                            </View>
                            <View style={{ backgroundColor: colors.surfaceContainerLowest }} className="flex-row items-center rounded-full p-1 h-9">
                                <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerHigh }} className="w-7 h-7 items-center justify-center rounded-full shadow-sm active:scale-95">
                                    <MaterialIcons name="remove" size={16} color={colors.onSurface} />
                                </TouchableOpacity>
                                <Text style={{ color: colors.onSurface }} className="w-8 text-center text-sm font-bold">2</Text>
                                <TouchableOpacity style={{ backgroundColor: colors.primary }} className="w-7 h-7 items-center justify-center rounded-full shadow-sm active:scale-95">
                                    <MaterialIcons name="add" size={16} color={colors.onPrimary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Add More Button */}
                    <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerLow }} className="flex-row items-center justify-center gap-2 py-3 rounded-2xl mb-6 active:bg-black/5 shadow-sm">
                        <MaterialIcons name="add-circle-outline" size={20} color={colors.textMuted} />
                        <Text style={{ color: colors.onSurfaceVariant }} className="font-bold">Tambah Menu Lain</Text>
                    </TouchableOpacity>

                    {/* Nutrition Summary Card */}
                    <View style={{ backgroundColor: colors.secondaryContainer }} className="p-5 rounded-3xl relative overflow-hidden shadow-sm">
                        <Text style={{ color: colors.onSecondaryContainer }} className="text-sm font-medium mb-3 relative z-10">Ringkasan Nutrisi (Estimasi)</Text>
                        <View className="flex-row gap-6 relative z-10">
                            <View>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mb-1">Total Kalori</Text>
                                <Text style={{ color: colors.onSecondaryContainer }} className="text-2xl font-bold"><Text style={{ color: colors.primary }}>286</Text> <Text style={{ color: colors.onSurfaceVariant }} className="text-base font-medium">kkal</Text></Text>
                            </View>
                            <View style={{ backgroundColor: colors.outline }} className="w-px h-10" />
                            <View>
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mb-1">Total Protein</Text>
                                <Text style={{ color: colors.onSecondaryContainer }} className="text-2xl font-bold"><Text style={{ color: colors.primary }}>14.5</Text> <Text style={{ color: colors.onSurfaceVariant }} className="text-base font-medium">gram</Text></Text>
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity style={{ backgroundColor: colors.primary }} className="w-full flex-row items-center justify-center gap-2 active:scale-[0.98] rounded-full py-4 shadow-lg mt-6">
                        <MaterialIcons name="check-circle" size={24} color={colors.onPrimary} />
                        <Text style={{ color: colors.onPrimary }} className="font-bold text-lg">Simpan Asupan</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
