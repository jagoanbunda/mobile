import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Helper function to format date in Indonesian
const formatDateIndonesian = (date: Date): string => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
};

export default function InputScreen() {
    const { colors } = useTheme();
    const [selectedMeal, setSelectedMeal] = useState('Pagi');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
        if (date) {
            setSelectedDate(date);
        }
    };

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
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {/* Header */}
                <View style={{ backgroundColor: colors.surface }} className="flex-none pt-4 pb-2 px-6 z-20">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text style={{ color: colors.onSurface }} className="tracking-tight text-[28px] font-bold leading-tight">Catat Makanan</Text>
                    </View>

                    {/* Date Display Bar - Tappable */}
                    <Pressable
                        onPress={() => setShowDatePicker(true)}
                        style={{
                            backgroundColor: colors.surfaceContainerHigh,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 12,
                            height: 48,
                            paddingHorizontal: 16,
                            marginBottom: 8
                        }}
                    >
                        <MaterialIcons name="event" size={20} color={colors.onSurfaceVariant} style={{ position: 'absolute', left: 16 }} />
                        <Text style={{ color: colors.onSurface, fontSize: 14, fontWeight: '500' }}>
                            {formatDateIndonesian(selectedDate)}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color={colors.onSurfaceVariant} style={{ position: 'absolute', right: 12 }} />
                    </Pressable>

                    {/* Date Picker Modal */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onDateChange}
                        />
                    )}
                </View>

                {/* Content */}
                <View className="flex-1 px-6 pt-2 pb-32">
                    {/* Meal Time Selector - Pill Style */}
                    <View style={{ backgroundColor: colors.surfaceContainerHigh, flexDirection: 'row', padding: 6, borderRadius: 9999, marginBottom: 16 }}>
                        {['Pagi', 'Siang', 'Malam'].map((meal) => (
                            <Pressable
                                key={meal}
                                onPress={() => setSelectedMeal(meal)}
                                style={{
                                    flex: 1,
                                    backgroundColor: selectedMeal === meal ? colors.primary : 'transparent',
                                    paddingVertical: 8,
                                    borderRadius: 9999,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: selectedMeal === meal ? colors.onPrimary : colors.onSurfaceVariant,
                                        fontSize: 14,
                                        fontWeight: '500',
                                    }}
                                >
                                    {meal}
                                </Text>
                            </Pressable>
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

                    {/* Nutrition Summary Card - Table Layout */}
                    <View style={{ backgroundColor: colors.secondaryContainer }} className="p-4 rounded-3xl relative overflow-hidden shadow-sm">
                        <Text style={{ color: colors.onSecondaryContainer }} className="text-sm font-bold mb-3">Ringkasan Nutrisi</Text>

                        {/* Table Header */}
                        <View className="flex-row pb-2 border-b" style={{ borderBottomColor: colors.outlineVariant }}>
                            <Text style={{ color: colors.onSurfaceVariant }} className="flex-[2] text-[10px] font-medium">Nama Makanan</Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="flex-1 text-[10px] font-medium text-center">Berat{"\n"}(gr)</Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="flex-1 text-[10px] font-medium text-center">Energi{"\n"}(kkal)</Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="flex-1 text-[10px] font-medium text-center">Protein{"\n"}(gr)</Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="flex-1 text-[10px] font-medium text-center">Lemak{"\n"}(gr)</Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="flex-1 text-[10px] font-medium text-center">Karbo{"\n"}(gr)</Text>
                        </View>

                        {/* Table Row 1 */}
                        <View className="flex-row py-2 border-b" style={{ borderBottomColor: colors.outlineVariant + '50' }}>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-[2] text-xs font-medium">Nasi</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs text-center">50</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs text-center">50</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs text-center">2</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs text-center">5</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs text-center">97</Text>
                        </View>

                        {/* Table Row 2 */}
                        <View className="flex-row py-2 border-b" style={{ borderBottomColor: colors.outlineVariant }}>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-[2] text-xs font-medium">Ayam</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs text-center">45</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs text-center">60</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs text-center">4</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs text-center">4</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs text-center">0</Text>
                        </View>

                        {/* Total Row */}
                        <View className="flex-row pt-3 border-t" style={{ borderTopColor: colors.outline }}>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-[2] text-xs font-bold">Total</Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="flex-1 text-xs text-center">-</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs font-bold text-center">125</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs font-bold text-center">6</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs font-bold text-center">12</Text>
                            <Text style={{ color: colors.onSecondaryContainer }} className="flex-1 text-xs font-bold text-center">98</Text>
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
