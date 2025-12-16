import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AnthropometryInputScreen() {
    const [measurementDate, setMeasurementDate] = useState('12 Oktober 2023');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [headCircumference, setHeadCircumference] = useState('');
    const [isLying, setIsLying] = useState(false);
    const [location, setLocation] = useState<'posyandu' | 'home' | 'clinic'>('posyandu');

    const handleSave = () => {
        // Logic to save anthropometry data
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-background-dark pt-12">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center justify-between p-4 pb-2 bg-background-dark/95">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back-ios-new" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-lg font-bold leading-tight tracking-tight text-white flex-1 text-center pr-10">
                    Input Antropometri
                </Text>
            </View>

            {/* Main Content */}
            <ScrollView
                className="flex-1 px-5 pt-2"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Date Section */}
                <View className="mb-6">
                    <Text className="text-sm font-medium mb-2 text-gray-300">Tanggal Pengukuran</Text>
                    <View className="relative">
                        <TextInput
                            className="w-full h-14 rounded-xl border border-[#6a5a2f] bg-[#352d18] px-4 text-base font-semibold text-white"
                            value={measurementDate}
                            onChangeText={setMeasurementDate}
                            editable={false}
                        />
                        <View className="absolute right-4 top-0 bottom-0 justify-center">
                            <MaterialIcons name="calendar-today" size={20} color="#FAC638" />
                        </View>
                    </View>
                </View>

                {/* Measurement Section */}
                <View className="gap-6">
                    {/* Weight (BB) */}
                    <View>
                        <Text className="text-sm font-medium mb-2 text-gray-300">Berat Badan (BB)</Text>
                        <View className="flex-row w-full items-stretch rounded-xl border border-[#6a5a2f] bg-[#352d18] overflow-hidden h-14">
                            <TextInput
                                className="flex-1 bg-transparent px-4 text-lg font-bold text-white"
                                placeholder="0"
                                placeholderTextColor="#ccbc8e"
                                keyboardType="decimal-pad"
                                value={weight}
                                onChangeText={setWeight}
                            />
                            <View className="bg-[#2c2616] px-4 items-center justify-center border-l border-[#6a5a2f]">
                                <Text className="text-sm font-bold text-[#ccbc8e]">kg</Text>
                            </View>
                        </View>
                    </View>

                    {/* Height (TB) */}
                    <View>
                        <Text className="text-sm font-medium mb-2 text-gray-300">Tinggi Badan (TB)</Text>
                        <View className="flex-row w-full items-stretch rounded-xl border border-[#6a5a2f] bg-[#352d18] overflow-hidden h-14">
                            <TextInput
                                className="flex-1 bg-transparent px-4 text-lg font-bold text-white"
                                placeholder="0"
                                placeholderTextColor="#ccbc8e"
                                keyboardType="decimal-pad"
                                value={height}
                                onChangeText={setHeight}
                            />
                            <View className="bg-[#2c2616] px-4 items-center justify-center border-l border-[#6a5a2f]">
                                <Text className="text-sm font-bold text-[#ccbc8e]">cm</Text>
                            </View>
                        </View>
                        {/* Checkbox for lying measurement */}
                        <TouchableOpacity
                            onPress={() => setIsLying(!isLying)}
                            className="flex-row items-center gap-3 mt-3"
                        >
                            <View className={`h-5 w-5 rounded-md border-2 items-center justify-center ${isLying ? 'bg-primary border-primary' : 'border-[#6a5a2f] bg-transparent'}`}>
                                {isLying && <MaterialIcons name="check" size={14} color="#231e0f" />}
                            </View>
                            <Text className="text-sm text-[#ccbc8e]">Pengukuran Terlentang</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Head Circumference (LK) */}
                    <View>
                        <Text className="text-sm font-medium mb-2 text-gray-300">Lingkar Kepala (LK)</Text>
                        <View className="flex-row w-full items-stretch rounded-xl border border-[#6a5a2f] bg-[#352d18] overflow-hidden h-14">
                            <TextInput
                                className="flex-1 bg-transparent px-4 text-lg font-bold text-white"
                                placeholder="0"
                                placeholderTextColor="#ccbc8e"
                                keyboardType="decimal-pad"
                                value={headCircumference}
                                onChangeText={setHeadCircumference}
                            />
                            <View className="bg-[#2c2616] px-4 items-center justify-center border-l border-[#6a5a2f]">
                                <Text className="text-sm font-bold text-[#ccbc8e]">cm</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Divider */}
                <View className="h-px bg-[#3a321f] my-8" />

                {/* Location Section */}
                <View className="mb-8">
                    <Text className="text-base font-bold mb-4 text-white">Lokasi Pengukuran</Text>
                    <View className="gap-3">
                        {/* Posyandu */}
                        <TouchableOpacity
                            onPress={() => setLocation('posyandu')}
                            className={`flex-row items-center justify-between p-4 rounded-xl border bg-[#352d18] ${location === 'posyandu' ? 'border-primary' : 'border-[#6a5a2f]'}`}
                        >
                            <View className="flex-row items-center gap-3">
                                <View className="bg-primary/10 p-2 rounded-lg">
                                    <MaterialIcons name="people" size={24} color="#FAC638" />
                                </View>
                                <Text className="font-medium text-gray-200">Posyandu</Text>
                            </View>
                            <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${location === 'posyandu' ? 'border-primary bg-primary' : 'border-gray-500'}`}>
                                {location === 'posyandu' && <View className="h-2 w-2 rounded-full bg-background-dark" />}
                            </View>
                        </TouchableOpacity>

                        {/* Home */}
                        <TouchableOpacity
                            onPress={() => setLocation('home')}
                            className={`flex-row items-center justify-between p-4 rounded-xl border bg-[#352d18] ${location === 'home' ? 'border-primary' : 'border-[#6a5a2f]'}`}
                        >
                            <View className="flex-row items-center gap-3">
                                <View className="bg-[#2c2616] p-2 rounded-lg">
                                    <MaterialIcons name="home" size={24} color="#ccbc8e" />
                                </View>
                                <Text className="font-medium text-gray-200">Mandiri / Di Rumah</Text>
                            </View>
                            <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${location === 'home' ? 'border-primary bg-primary' : 'border-gray-500'}`}>
                                {location === 'home' && <View className="h-2 w-2 rounded-full bg-background-dark" />}
                            </View>
                        </TouchableOpacity>

                        {/* Clinic */}
                        <TouchableOpacity
                            onPress={() => setLocation('clinic')}
                            className={`flex-row items-center justify-between p-4 rounded-xl border bg-[#352d18] ${location === 'clinic' ? 'border-primary' : 'border-[#6a5a2f]'}`}
                        >
                            <View className="flex-row items-center gap-3">
                                <View className="bg-[#2c2616] p-2 rounded-lg">
                                    <MaterialIcons name="medical-services" size={24} color="#ccbc8e" />
                                </View>
                                <Text className="font-medium text-gray-200">Klinik / Dokter</Text>
                            </View>
                            <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${location === 'clinic' ? 'border-primary bg-primary' : 'border-gray-500'}`}>
                                {location === 'clinic' && <View className="h-2 w-2 rounded-full bg-background-dark" />}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Photo Upload Section */}
                <View className="mb-6">
                    <Text className="text-sm font-medium mb-2 text-gray-300">
                        Foto Bukti <Text className="text-gray-500 font-normal ml-1">(Opsional)</Text>
                    </Text>
                    <TouchableOpacity className="border-2 border-dashed border-[#6a5a2f] rounded-xl p-6 items-center justify-center gap-2 bg-transparent">
                        <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                            <MaterialIcons name="add-a-photo" size={24} color="#FAC638" />
                        </View>
                        <Text className="text-sm text-[#ccbc8e] text-center font-medium">
                            Ketuk untuk ambil foto atau upload
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <View className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent pt-10">
                <TouchableOpacity
                    onPress={handleSave}
                    className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-lg active:scale-[0.99]"
                    style={{ shadowColor: '#FAC638', shadowOpacity: 0.2 }}
                >
                    <Text className="text-background-dark font-bold text-base tracking-wide">SIMPAN DATA</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
