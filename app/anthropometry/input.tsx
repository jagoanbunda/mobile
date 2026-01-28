import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { useCreateAnthropometry } from '@/services/hooks/use-anthropometry';
import { ApiError } from '@/services/api/errors';
import { MeasurementLocation } from '@/types';
import { ImagePickerButton } from '@/components/ImagePickerButton';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AnthropometryInputScreen() {
    const { colors } = useTheme();
    const { data: child, isLoading: isLoadingChild } = useActiveChild();
    const childId = child?.id ?? 0;
    
    const { mutate: createAnthropometry, isPending } = useCreateAnthropometry(childId);

    const [measurementDate, setMeasurementDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [headCircumference, setHeadCircumference] = useState('');
    const [isLying, setIsLying] = useState(false);
    const [location, setLocation] = useState<MeasurementLocation>('posyandu');
    const [notes, setNotes] = useState('');
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setMeasurementDate(selectedDate);
        }
    };

    const handleSave = () => {
        // Validation
        if (!weight || !height) {
            Alert.alert('Error', 'Berat badan dan tinggi badan wajib diisi.');
            return;
        }

        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);

        if (isNaN(weightNum) || weightNum <= 0 || weightNum > 100) {
            Alert.alert('Error', 'Berat badan tidak valid. Masukkan nilai antara 0-100 kg.');
            return;
        }

        if (isNaN(heightNum) || heightNum <= 0 || heightNum > 200) {
            Alert.alert('Error', 'Tinggi badan tidak valid. Masukkan nilai antara 0-200 cm.');
            return;
        }

        const data = {
            measurement_date: measurementDate.toISOString().split('T')[0],
            weight: weightNum,
            height: heightNum,
            head_circumference: headCircumference ? parseFloat(headCircumference) : undefined,
            is_lying: isLying,
            measurement_location: location,
            notes: notes || undefined,
            photo_url: photoUri || undefined,
        };

        createAnthropometry(data, {
            onSuccess: (measurement) => {
                Alert.alert(
                    'Berhasil',
                    'Data antropometri berhasil disimpan.',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    Alert.alert('Error', error.message);
                } else {
                    Alert.alert('Error', 'Gagal menyimpan data. Silakan coba lagi.');
                }
            },
        });
    };

    // Loading state
    if (isLoadingChild) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    // No child state
    if (!child) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 items-center justify-center px-8">
                    <MaterialIcons name="child-care" size={64} color={colors.onSurfaceVariant} />
                    <Text style={{ color: colors.onSurface }} className="text-xl font-bold mt-4 text-center">
                        Belum Ada Data Anak
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ backgroundColor: colors.primary }}
                        className="mt-6 px-6 py-3 rounded-xl"
                    >
                        <Text style={{ color: colors.onPrimary }} className="font-bold">Kembali</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

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
                {/* Child Info */}
                <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="p-4 rounded-xl mb-6 flex-row items-center gap-3">
                    <MaterialIcons name="child-care" size={24} color={colors.primary} />
                    <View>
                        <Text style={{ color: colors.onSurface }} className="font-bold">{child.name}</Text>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">
                            {child.age?.label || 'Usia tidak diketahui'}
                        </Text>
                    </View>
                </View>

                {/* Date Section */}
                <View className="mb-6">
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium mb-2">Tanggal Pengukuran</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={{ backgroundColor: colors.surfaceContainerHigh }}
                        className="flex-row items-center rounded-xl px-4 py-3.5"
                    >
                        <Text style={{ color: colors.onSurface }} className="flex-1 text-base font-semibold">
                            {formatDate(measurementDate)}
                        </Text>
                        <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={measurementDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                    />
                )}

                {/* Measurement Section */}
                <View className="gap-5">
                    {/* Weight (BB) */}
                    <View>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium mb-2">
                            Berat Badan (BB) <Text style={{ color: colors.error }}>*</Text>
                        </Text>
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
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium mb-2">
                            Tinggi Badan (TB) <Text style={{ color: colors.error }}>*</Text>
                        </Text>
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

                        {/* Hospital */}
                        <TouchableOpacity
                            onPress={() => setLocation('hospital')}
                            style={{
                                backgroundColor: location === 'hospital' ? colors.primaryContainer : colors.surfaceContainerHigh
                            }}
                            className="flex-row items-center justify-between p-4 rounded-xl"
                        >
                            <View className="flex-row items-center gap-3">
                                <View style={{ backgroundColor: location === 'hospital' ? colors.primary : colors.surfaceContainerHighest }} className="p-2 rounded-lg">
                                    <MaterialIcons name="local-hospital" size={24} color={location === 'hospital' ? colors.onPrimary : colors.tertiary} />
                                </View>
                                <Text style={{ color: location === 'hospital' ? colors.onPrimaryContainer : colors.onSurface }} className="font-medium">Rumah Sakit</Text>
                            </View>
                            <View style={{
                                borderColor: location === 'hospital' ? colors.primary : colors.outline,
                                backgroundColor: location === 'hospital' ? colors.primary : 'transparent'
                            }} className="h-5 w-5 rounded-full border-2 items-center justify-center">
                                {location === 'hospital' && <View style={{ backgroundColor: colors.onPrimary }} className="h-2 w-2 rounded-full" />}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Notes Section */}
                <View className="mb-6">
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium mb-2">
                        Catatan <Text style={{ color: colors.outline }} className="font-normal">(Opsional)</Text>
                    </Text>
                    <TextInput
                        style={{ backgroundColor: colors.surfaceContainerHigh, color: colors.onSurface }}
                        className="w-full rounded-xl p-4 min-h-[80px]"
                        placeholder="Tambahkan catatan..."
                        placeholderTextColor={colors.outline}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>

                {/* Photo Upload Section */}
                <View className="mb-6">
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium mb-2">
                        Foto Bukti <Text style={{ color: colors.outline }} className="font-normal">(Opsional)</Text>
                    </Text>
                    <View className="items-center">
                        <ImagePickerButton
                            value={photoUri}
                            onSelect={setPhotoUri}
                            onRemove={() => setPhotoUri(null)}
                            shape="square"
                            size={120}
                            placeholderIcon="add-a-photo"
                            placeholderIconSize={32}
                        />
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mt-2 text-center">
                            Ketuk untuk ambil foto atau upload
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <View style={{ backgroundColor: colors.surface }} className="absolute bottom-0 left-0 w-full p-5 pb-8">
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isPending || !weight || !height}
                    style={{ 
                        backgroundColor: colors.primary,
                        opacity: (isPending || !weight || !height) ? 0.5 : 1
                    }}
                    className="w-full h-14 rounded-xl items-center justify-center flex-row gap-2"
                >
                    {isPending ? (
                        <ActivityIndicator size="small" color={colors.onPrimary} />
                    ) : (
                        <MaterialIcons name="check" size={24} color={colors.onPrimary} />
                    )}
                    <Text style={{ color: colors.onPrimary }} className="font-bold text-base tracking-wide">
                        {isPending ? 'MENYIMPAN...' : 'SIMPAN DATA'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
