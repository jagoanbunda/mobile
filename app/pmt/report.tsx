import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type PortionType = 'habis' | 'half' | 'less_half' | 'none';

export default function PMTReportScreen() {
    const { colors } = useTheme();
    const [portion, setPortion] = useState<PortionType>('habis');
    const [notes, setNotes] = useState('');

    const handleSubmit = () => {
        router.back();
    };

    const PortionOption = ({
        value,
        label,
        icon,
        isSelected
    }: {
        value: PortionType;
        label: string;
        icon: keyof typeof MaterialIcons.glyphMap;
        isSelected: boolean;
    }) => (
        <TouchableOpacity
            onPress={() => setPortion(value)}
            style={{
                backgroundColor: isSelected ? colors.primaryContainer : colors.surfaceContainerHigh
            }}
            className="flex-1 items-center justify-center p-4 rounded-lg"
        >
            <MaterialIcons
                name={icon}
                size={24}
                color={isSelected ? colors.primary : colors.onSurfaceVariant}
                style={{ marginBottom: 8 }}
            />
            <Text style={{ color: isSelected ? colors.onPrimaryContainer : colors.onSurface }} className="text-sm font-bold">{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ backgroundColor: colors.surface }} className="flex-row items-center p-4 pb-2 justify-between">
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ backgroundColor: colors.surfaceContainerHigh }}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
                </TouchableOpacity>
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
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
                    <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-stretch justify-between gap-4 rounded-xl p-4">
                        <View className="flex-1 gap-1">
                            <Text style={{ color: colors.onSurface }} className="text-base font-bold leading-tight">
                                Senin, 24 Oktober 2023
                            </Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-normal">
                                Program Hari ke-14
                            </Text>
                        </View>
                        <View style={{ backgroundColor: colors.primaryContainer }} className="w-12 h-12 items-center justify-center rounded-lg">
                            <MaterialIcons name="calendar-month" size={24} color={colors.primary} />
                        </View>
                    </View>
                </View>

                {/* Menu Info */}
                <View style={{ backgroundColor: colors.surface }} className="flex-row items-center gap-4 px-4 py-2">
                    <View style={{ backgroundColor: colors.primaryContainer }} className="w-12 h-12 items-center justify-center rounded-lg">
                        <MaterialIcons name="restaurant-menu" size={24} color={colors.primary} />
                    </View>
                    <View className="flex-1">
                        <Text style={{ color: colors.onSurface }} className="text-base font-bold leading-normal">Menu Hari Ini</Text>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-normal leading-normal">
                            Bubur Kacang Hijau + Telur Rebus
                        </Text>
                    </View>
                </View>

                <View className="h-4" />

                {/* Photo Upload */}
                <View className="px-4">
                    <TouchableOpacity style={{ borderColor: colors.outlineVariant }} className="items-center gap-4 rounded-xl border-2 border-dashed px-6 py-8">
                        <View className="items-center gap-2">
                            <View style={{ backgroundColor: colors.primaryContainer }} className="p-3 rounded-full mb-2">
                                <MaterialIcons name="photo-camera" size={30} color={colors.primary} />
                            </View>
                            <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight tracking-tight text-center">
                                Upload Foto Anak Makan
                            </Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-normal text-center">
                                Pastikan wajah dan makanan terlihat
                            </Text>
                        </View>
                        <View style={{ backgroundColor: colors.primary }} className="px-6 py-2.5 rounded-lg">
                            <Text style={{ color: colors.onPrimary }} className="text-sm font-bold">Ambil Foto</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="h-2" />

                {/* Portion Section */}
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight tracking-tight px-4 text-left pb-3 pt-6">
                    Porsi yang dimakan
                </Text>

                {/* Portion Selector Grid */}
                <View className="px-4 flex-row flex-wrap gap-3">
                    <View className="flex-row gap-3 w-full">
                        <PortionOption value="habis" label="Habis" icon="check-circle" isSelected={portion === 'habis'} />
                        <PortionOption value="half" label="1/2 Porsi" icon="pie-chart" isSelected={portion === 'half'} />
                    </View>
                    <View className="flex-row gap-3 w-full">
                        <PortionOption value="less_half" label="< 1/2 Porsi" icon="timelapse" isSelected={portion === 'less_half'} />
                        <PortionOption value="none" label="Gk Mau" icon="cancel" isSelected={portion === 'none'} />
                    </View>
                </View>

                {/* Notes Section */}
                <View className="px-4 pt-6">
                    <Text style={{ color: colors.onSurface }} className="text-sm font-bold mb-2">
                        Catatan Tambahan (Opsional)
                    </Text>
                    <TextInput
                        style={{ backgroundColor: colors.surfaceContainerHigh, color: colors.onSurface }}
                        className="w-full rounded-xl p-4 min-h-[100px]"
                        placeholder="Ada keluhan atau catatan lain?"
                        placeholderTextColor={colors.outline}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>
            </ScrollView>

            {/* Footer Button */}
            <View style={{ backgroundColor: colors.surface }} className="absolute bottom-0 left-0 right-0 p-4 pb-8">
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={{ backgroundColor: colors.primary }}
                    className="w-full h-14 rounded-xl items-center justify-center"
                >
                    <Text style={{ color: colors.onPrimary }} className="text-base font-bold leading-normal tracking-wide">
                        KIRIM LAPORAN
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
