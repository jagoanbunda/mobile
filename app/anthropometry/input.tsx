import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AnthropometryInputScreen() {
    const { colors } = useTheme();
    const [measurementDate, setMeasurementDate] = useState('12 Oktober 2023');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [headCircumference, setHeadCircumference] = useState('');
    const [isLying, setIsLying] = useState(false);
    const [location, setLocation] = useState<'posyandu' | 'home' | 'clinic'>('posyandu');

    const handleSave = () => {
        router.back();
    };

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
                    <MaterialIcons name="arrow-back-ios-new" size={20} color={colors.onSurface} />
                </TouchableOpacity>
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
                    Input Antropometri
                </Text>
            </View>

            <ScrollView
                className="flex-1 px-5 pt-2"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Date Section */}
                <View className="mb-6">
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium mb-2">Tanggal Pengukuran</Text>
                    <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center rounded-xl px-4 py-3.5">
                        <TextInput
                            style={{ color: colors.onSurface }}
                            className="flex-1 text-base font-semibold"
                            value={measurementDate}
                            onChangeText={setMeasurementDate}
                            editable={false}
                        />
                        <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
                    </View>
                </View>

                {/* Measurement Section */}
                <View className="gap-5">
                    {/* Weight (BB) */}
                    <View>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium mb-2">Berat Badan (BB)</Text>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row w-full items-stretch rounded-xl overflow-hidden h-14">
                            <TextInput
                                style={{ color: colors.onSurface }}
                                className="flex-1 px-4 text-lg font-bold"
                                placeholder="0"
                                placeholderTextColor={colors.outline}
                                keyboardType="decimal-pad"
                                value={weight}
                                onChangeText={setWeight}
                            />
                            <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="px-4 items-center justify-center">
                                <Text style={{ color: colors.primary }} className="text-sm font-bold">kg</Text>
                            </View>
                        </View>
                    </View>

                    {/* Height (TB) */}
                    <View>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium mb-2">Tinggi Badan (TB)</Text>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row w-full items-stretch rounded-xl overflow-hidden h-14">
                            <TextInput
                                style={{ color: colors.onSurface }}
                                className="flex-1 px-4 text-lg font-bold"
                                placeholder="0"
                                placeholderTextColor={colors.outline}
                                keyboardType="decimal-pad"
                                value={height}
                                onChangeText={setHeight}
                            />
                            <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="px-4 items-center justify-center">
                                <Text style={{ color: colors.primary }} className="text-sm font-bold">cm</Text>
                            </View>
                        </View>
                        {/* Checkbox for lying measurement */}
                        <TouchableOpacity
                            onPress={() => setIsLying(!isLying)}
                            className="flex-row items-center gap-3 mt-3"
                        >
                            <View style={{
                                backgroundColor: isLying ? colors.primary : 'transparent',
                                borderColor: isLying ? colors.primary : colors.outline
                            }} className="h-5 w-5 rounded-md border-2 items-center justify-center">
                                {isLying && <MaterialIcons name="check" size={14} color={colors.onPrimary} />}
                            </View>
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">Pengukuran Terlentang</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Head Circumference (LK) */}
                    <View>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium mb-2">Lingkar Kepala (LK)</Text>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row w-full items-stretch rounded-xl overflow-hidden h-14">
                            <TextInput
                                style={{ color: colors.onSurface }}
                                className="flex-1 px-4 text-lg font-bold"
                                placeholder="0"
                                placeholderTextColor={colors.outline}
                                keyboardType="decimal-pad"
                                value={headCircumference}
                                onChangeText={setHeadCircumference}
                            />
                            <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="px-4 items-center justify-center">
                                <Text style={{ color: colors.primary }} className="text-sm font-bold">cm</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Divider */}
                <View style={{ backgroundColor: colors.outlineVariant }} className="h-px my-8" />

                {/* Location Section */}
                <View className="mb-8">
                    <Text style={{ color: colors.onSurface }} className="text-base font-bold mb-4">Lokasi Pengukuran</Text>
                    <View className="gap-3">
                        {/* Posyandu */}
                        <TouchableOpacity
                            onPress={() => setLocation('posyandu')}
                            style={{
                                backgroundColor: location === 'posyandu' ? colors.primaryContainer : colors.surfaceContainerHigh
                            }}
                            className="flex-row items-center justify-between p-4 rounded-xl"
                        >
                            <View className="flex-row items-center gap-3">
                                <View style={{ backgroundColor: location === 'posyandu' ? colors.primary : colors.surfaceContainerHighest }} className="p-2 rounded-lg">
                                    <MaterialIcons name="people" size={24} color={location === 'posyandu' ? colors.onPrimary : colors.primary} />
                                </View>
                                <Text style={{ color: location === 'posyandu' ? colors.onPrimaryContainer : colors.onSurface }} className="font-medium">Posyandu</Text>
                            </View>
                            <View style={{
                                borderColor: location === 'posyandu' ? colors.primary : colors.outline,
                                backgroundColor: location === 'posyandu' ? colors.primary : 'transparent'
                            }} className="h-5 w-5 rounded-full border-2 items-center justify-center">
                                {location === 'posyandu' && <View style={{ backgroundColor: colors.onPrimary }} className="h-2 w-2 rounded-full" />}
                            </View>
                        </TouchableOpacity>

                        {/* Home */}
                        <TouchableOpacity
                            onPress={() => setLocation('home')}
                            style={{
                                backgroundColor: location === 'home' ? colors.primaryContainer : colors.surfaceContainerHigh
                            }}
                            className="flex-row items-center justify-between p-4 rounded-xl"
                        >
                            <View className="flex-row items-center gap-3">
                                <View style={{ backgroundColor: location === 'home' ? colors.primary : colors.surfaceContainerHighest }} className="p-2 rounded-lg">
                                    <MaterialIcons name="home" size={24} color={location === 'home' ? colors.onPrimary : colors.secondary} />
                                </View>
                                <Text style={{ color: location === 'home' ? colors.onPrimaryContainer : colors.onSurface }} className="font-medium">Mandiri / Di Rumah</Text>
                            </View>
                            <View style={{
                                borderColor: location === 'home' ? colors.primary : colors.outline,
                                backgroundColor: location === 'home' ? colors.primary : 'transparent'
                            }} className="h-5 w-5 rounded-full border-2 items-center justify-center">
                                {location === 'home' && <View style={{ backgroundColor: colors.onPrimary }} className="h-2 w-2 rounded-full" />}
                            </View>
                        </TouchableOpacity>

                        {/* Clinic */}
                        <TouchableOpacity
                            onPress={() => setLocation('clinic')}
                            style={{
                                backgroundColor: location === 'clinic' ? colors.primaryContainer : colors.surfaceContainerHigh
                            }}
                            className="flex-row items-center justify-between p-4 rounded-xl"
                        >
                            <View className="flex-row items-center gap-3">
                                <View style={{ backgroundColor: location === 'clinic' ? colors.primary : colors.surfaceContainerHighest }} className="p-2 rounded-lg">
                                    <MaterialIcons name="medical-services" size={24} color={location === 'clinic' ? colors.onPrimary : colors.tertiary} />
                                </View>
                                <Text style={{ color: location === 'clinic' ? colors.onPrimaryContainer : colors.onSurface }} className="font-medium">Klinik / Dokter</Text>
                            </View>
                            <View style={{
                                borderColor: location === 'clinic' ? colors.primary : colors.outline,
                                backgroundColor: location === 'clinic' ? colors.primary : 'transparent'
                            }} className="h-5 w-5 rounded-full border-2 items-center justify-center">
                                {location === 'clinic' && <View style={{ backgroundColor: colors.onPrimary }} className="h-2 w-2 rounded-full" />}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Photo Upload Section */}
                <View className="mb-6">
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium mb-2">
                        Foto Bukti <Text style={{ color: colors.outline }} className="font-normal">(Opsional)</Text>
                    </Text>
                    <TouchableOpacity style={{ borderColor: colors.outlineVariant }} className="border-2 border-dashed rounded-xl p-6 items-center justify-center gap-2">
                        <View style={{ backgroundColor: colors.primaryContainer }} className="w-12 h-12 rounded-full items-center justify-center">
                            <MaterialIcons name="add-a-photo" size={24} color={colors.primary} />
                        </View>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm text-center font-medium">
                            Ketuk untuk ambil foto atau upload
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <View style={{ backgroundColor: colors.surface }} className="absolute bottom-0 left-0 w-full p-5 pb-8">
                <TouchableOpacity
                    onPress={handleSave}
                    style={{ backgroundColor: colors.primary }}
                    className="w-full h-14 rounded-xl items-center justify-center"
                >
                    <Text style={{ color: colors.onPrimary }} className="font-bold text-base tracking-wide">SIMPAN DATA</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
