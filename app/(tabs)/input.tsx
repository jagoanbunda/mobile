import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function InputScreen() {
    const [selectedMeal, setSelectedMeal] = useState('Pagi');

    const MealButton = ({ name, isSelected }: { name: string, isSelected: boolean }) => (
        <TouchableOpacity
            onPress={() => setSelectedMeal(name)}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-transform active:scale-95 ${isSelected ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-[#352d18]'}`}
        >
            <Text className={`text-sm font-bold leading-normal ${isSelected ? 'text-background-dark' : 'text-white'}`}>{name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-dark pt-12">
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {/* Header */}
                <View className="flex-none pt-4 pb-2 px-6 bg-background-dark z-20">
                    <View className="flex justify-center mb-4 items-center">
                        <View className="h-1.5 w-12 rounded-full bg-[#6a5a2f] opacity-50" />
                    </View>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white tracking-tight text-[28px] font-bold leading-tight">Catat Makanan</Text>
                        <TouchableOpacity>
                            <Text className="text-sm font-medium text-primary">Tutup</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Calendar Strip - Compact */}
                    <View className="flex-row items-center justify-between bg-[#2c2616] rounded-xl p-3 mb-2">
                        <TouchableOpacity className="p-1">
                            <MaterialIcons name="chevron-left" size={20} color="#ccbc8e" />
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    className={`items-center px-2 py-1 rounded-lg ${idx === 2 ? 'bg-primary' : ''}`}
                                >
                                    <Text className={`text-[10px] font-bold ${idx === 2 ? 'text-background-dark' : 'text-[#ccbc8e]'}`}>{day}</Text>
                                    <Text className={`text-sm font-bold ${idx === 2 ? 'text-background-dark' : 'text-white'} ${idx !== 2 ? 'opacity-50' : ''}`}>{22 + idx}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity className="p-1">
                            <MaterialIcons name="chevron-right" size={20} color="#ccbc8e" />
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
                        <View className="flex-row w-full items-center rounded-2xl h-14 bg-[#2c2616] shadow-sm overflow-hidden border border-[#6a5a2f]">
                            <View className="pl-4 pr-2">
                                <MaterialIcons name="search" size={24} color="#ccbc8e" />
                            </View>
                            <TextInput
                                className="flex-1 bg-transparent text-white text-base font-medium h-full"
                                placeholder="Cari makanan..."
                                placeholderTextColor="#ccbc8e80"
                            />
                        </View>
                    </View>

                    {/* Selected Food List */}
                    <View className="gap-4 mb-6">
                        <Text className="text-sm font-bold text-[#ccbc8e] uppercase tracking-wider pl-1">Makanan Terpilih</Text>

                        {/* Food Item 1 */}
                        <View className="flex-row items-center justify-between p-3 pr-4 rounded-2xl bg-[#2c2616] shadow-sm border border-[#6a5a2f]">
                            <View className="flex-row items-center gap-3">
                                <View className="w-12 h-12 rounded-xl bg-orange-500/20 items-center justify-center">
                                    <MaterialIcons name="rice-bowl" size={24} color="#FB923C" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-base">Nasi Putih</Text>
                                    <Text className="text-[#ccbc8e] text-xs font-medium">100 gram • 130 kkal</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center bg-background-dark rounded-full p-1 h-9">
                                <TouchableOpacity className="w-7 h-7 items-center justify-center rounded-full bg-[#352d18] shadow-sm active:scale-95">
                                    <MaterialIcons name="remove" size={16} color="#fff" />
                                </TouchableOpacity>
                                <Text className="w-8 text-center text-sm font-bold text-white">1</Text>
                                <TouchableOpacity className="w-7 h-7 items-center justify-center rounded-full bg-primary shadow-sm active:scale-95">
                                    <MaterialIcons name="add" size={16} color="#231e0f" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Food Item 2 */}
                        <View className="flex-row items-center justify-between p-3 pr-4 rounded-2xl bg-[#2c2616] shadow-sm border border-[#6a5a2f]">
                            <View className="flex-row items-center gap-3">
                                <View className="w-12 h-12 rounded-xl bg-yellow-500/20 items-center justify-center">
                                    <MaterialIcons name="egg" size={24} color="#FBBF24" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-base">Telur Rebus</Text>
                                    <Text className="text-[#ccbc8e] text-xs font-medium">1 Butir (Large) • 78 kkal</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center bg-background-dark rounded-full p-1 h-9">
                                <TouchableOpacity className="w-7 h-7 items-center justify-center rounded-full bg-[#352d18] shadow-sm active:scale-95">
                                    <MaterialIcons name="remove" size={16} color="#fff" />
                                </TouchableOpacity>
                                <Text className="w-8 text-center text-sm font-bold text-white">2</Text>
                                <TouchableOpacity className="w-7 h-7 items-center justify-center rounded-full bg-primary shadow-sm active:scale-95">
                                    <MaterialIcons name="add" size={16} color="#231e0f" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Add More Button */}
                    <TouchableOpacity className="flex-row items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[#6a5a2f] mb-6 active:bg-white/5">
                        <MaterialIcons name="add-circle-outline" size={20} color="#ccbc8e" />
                        <Text className="text-[#ccbc8e] font-bold">Tambah Menu Lain</Text>
                    </TouchableOpacity>

                    {/* Nutrition Summary Card */}
                    <View className="p-5 rounded-3xl bg-[#352d18] relative overflow-hidden border border-[#6a5a2f]">
                        {/* Decorative Blur */}
                        <View className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-10 -mt-10" />

                        <Text className="text-white text-sm font-medium mb-3 relative z-10">Ringkasan Nutrisi (Estimasi)</Text>
                        <View className="flex-row gap-6 relative z-10">
                            <View>
                                <Text className="text-[#ccbc8e] text-xs mb-1">Total Kalori</Text>
                                <Text className="text-2xl font-bold text-white"><Text className="text-primary">286</Text> <Text className="text-base font-medium text-[#ccbc8e]">kkal</Text></Text>
                            </View>
                            <View className="w-px h-10 bg-[#6a5a2f]" />
                            <View>
                                <Text className="text-[#ccbc8e] text-xs mb-1">Total Protein</Text>
                                <Text className="text-2xl font-bold text-white"><Text className="text-primary">14.5</Text> <Text className="text-base font-medium text-[#ccbc8e]">gram</Text></Text>
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity className="w-full flex-row items-center justify-center gap-2 bg-primary active:scale-[0.98] rounded-full py-4 shadow-lg shadow-primary/25 mt-6">
                        <MaterialIcons name="check-circle" size={24} color="#231e0f" />
                        <Text className="text-background-dark font-bold text-lg">Simpan Asupan</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
