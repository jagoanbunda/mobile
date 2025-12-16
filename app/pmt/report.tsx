import Colors from '@/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type PortionType = 'habis' | 'half' | 'less_half' | 'none';

export default function PMTReportScreen() {
    const [portion, setPortion] = useState<PortionType>('habis');
    const [notes, setNotes] = useState('');

    const handleSubmit = () => {
        // Logic to submit PMT report
        router.back();
    };

    const PortionOption = ({
        value,
        label,
        icon,
        iconColor
    }: {
        value: PortionType;
        label: string;
        icon: keyof typeof MaterialIcons.glyphMap;
        iconColor: string;
    }) => (
        <TouchableOpacity
            onPress={() => setPortion(value)}
            className={`flex-1 items-center justify-center p-4 rounded-lg bg-[#4a3535] border-2 ${portion === value ? 'border-primary bg-primary/5' : 'border-transparent'}`}
        >
            <MaterialIcons name={icon} size={24} color={iconColor} style={{ marginBottom: 8 }} />
            <Text className="text-sm font-bold text-white">{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-dark pt-12">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-background-dark p-4 pb-2 justify-between">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-12 h-12 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">
                    Lapor PMT
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Status Card */}
                <View className="p-4">
                    <View className="flex-row items-stretch justify-between gap-4 rounded-lg bg-[#4a3535] p-4 shadow-sm">
                        <View className="flex-1 gap-1">
                            <Text className="text-white text-base font-bold leading-tight">
                                Senin, 24 Oktober 2023
                            </Text>
                            <Text className="text-[#d4a0a0] text-sm font-normal">
                                Program Hari ke-14
                            </Text>
                        </View>
                        <View className="w-12 h-12 items-center justify-center bg-[#4a3f21] rounded-lg">
                            <MaterialIcons name="calendar-month" size={24} color={Colors.primary} />
                        </View>
                    </View>
                </View>

                {/* Menu Info */}
                <View className="flex-row items-center gap-4 bg-background-dark px-4 py-2">
                    <View className="w-12 h-12 items-center justify-center rounded-lg bg-[#4a3f21]">
                        <MaterialIcons name="restaurant-menu" size={24} color={Colors.primary} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white text-base font-bold leading-normal">Menu Hari Ini</Text>
                        <Text className="text-[#d4a0a0] text-sm font-normal leading-normal">
                            Bubur Kacang Hijau + Telur Rebus
                        </Text>
                    </View>
                </View>

                <View className="h-4" />

                {/* Photo Upload */}
                <View className="px-4">
                    <TouchableOpacity className="items-center gap-6 rounded-lg border-2 border-dashed border-[#5a4040] bg-transparent px-6 py-10">
                        <View className="items-center gap-2">
                            <View className="bg-[#4a3f21] p-3 rounded-full mb-2">
                                <MaterialIcons name="photo-camera" size={30} color="#fff" />
                            </View>
                            <Text className="text-white text-lg font-bold leading-tight tracking-tight text-center">
                                Upload Foto Anak Makan
                            </Text>
                            <Text className="text-gray-400 text-sm font-normal text-center">
                                Pastikan wajah dan makanan terlihat
                            </Text>
                        </View>
                        <View className="bg-primary px-6 py-2.5 rounded-lg shadow-sm">
                            <Text className="text-background-dark text-sm font-bold">Ambil Foto</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="h-2" />

                {/* Portion Section */}
                <Text className="text-white text-lg font-bold leading-tight tracking-tight px-4 text-left pb-3 pt-6">
                    Porsi yang dimakan
                </Text>

                {/* Portion Selector Grid */}
                <View className="px-4 flex-row flex-wrap gap-3">
                    <View className="flex-row gap-3 w-full">
                        <PortionOption value="habis" label="Habis" icon="check-circle" iconColor="#22C55E" />
                        <PortionOption value="half" label="1/2 Porsi" icon="pie-chart" iconcolor={Colors.primary} />
                    </View>
                    <View className="flex-row gap-3 w-full">
                        <PortionOption value="less_half" label="< 1/2 Porsi" icon="timelapse" iconColor="#FB923C" />
                        <PortionOption value="none" label="Gk Mau" icon="cancel" iconColor="#F87171" />
                    </View>
                </View>

                {/* Notes Section */}
                <View className="px-4 pt-6">
                    <Text className="text-sm font-bold text-white mb-2">
                        Catatan Tambahan (Opsional)
                    </Text>
                    <TextInput
                        className="w-full rounded-lg bg-[#4a3535] p-4 text-white min-h-[100px]"
                        placeholder="Ada keluhan atau catatan lain?"
                        placeholderTextColor="#d4a0a080"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>
            </ScrollView>

            {/* Footer Button */}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-background-dark border-t border-transparent">
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="w-full h-12 bg-primary rounded-lg items-center justify-center shadow active:opacity-90"
                >
                    <Text className="text-background-dark text-base font-bold leading-normal tracking-wide">
                        KIRIM LAPORAN
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
