import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { 
    useCurrentMonthPmtSchedules, 
    useTodayPmtSchedule,
    useCreatePmtLog, 
    useUpdatePmtLog 
} from '@/services/hooks/use-pmt';
import { ApiError } from '@/services/api/errors';
import { PmtPortion, PMT_PORTION_LABEL } from '@/types';
import { ImagePickerButton } from '@/components/ImagePickerButton';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Semantic colors for portion options
const PORTION_COLORS: Record<PmtPortion, string> = {
    habis: '#34D399',      // Green (success)
    half: '#FBBF24',       // Yellow (warning)
    quarter: '#F97316',    // Orange
    none: '#EF4444',       // Red (error)
};

const PORTION_ICONS: Record<PmtPortion, keyof typeof MaterialIcons.glyphMap> = {
    habis: 'check-circle',
    half: 'pie-chart',
    quarter: 'timelapse',
    none: 'cancel',
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function PMTReportScreen() {
    const { colors } = useTheme();
    const { scheduleId } = useLocalSearchParams<{ scheduleId?: string }>();
    
    const { data: child, isLoading: isLoadingChild } = useActiveChild();
    const childId = child?.id ?? 0;
    
    // Get all schedules to find the specific one
    const { data: schedules, isLoading: isLoadingSchedules } = useCurrentMonthPmtSchedules(childId);
    const { data: todaySchedule } = useTodayPmtSchedule(childId);
    
    const { mutate: createLog, isPending: isCreating } = useCreatePmtLog();
    const { mutate: updateLog, isPending: isUpdating } = useUpdatePmtLog();
    
    // Find the schedule - either by ID or use today's schedule
    const schedule = scheduleId 
        ? schedules?.find(s => s.id === Number(scheduleId))
        : todaySchedule;
    
    const [selectedPortion, setSelectedPortion] = useState<PmtPortion | null>(null);
    const [notes, setNotes] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    
    // Initialize form with existing log data
    useEffect(() => {
        if (schedule?.log) {
            setSelectedPortion(schedule.log.portion);
            setNotes(schedule.log.notes || '');
            setPhotoUrl(schedule.log.photo_url || '');
        }
    }, [schedule]);
    
    const isLoading = isLoadingChild || isLoadingSchedules;
    const isPending = isCreating || isUpdating;

    const handleSubmit = () => {
        if (!selectedPortion || !schedule) return;

        const data = {
            portion: selectedPortion,
            photo_url: photoUrl || undefined,
            notes: notes || undefined,
        };

        const onSuccess = () => {
            Alert.alert(
                'Berhasil',
                schedule.is_logged ? 'Log PMT berhasil diperbarui' : 'Konsumsi PMT berhasil dicatat',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        };

        const onError = (error: Error) => {
            if (error instanceof ApiError) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Error', 'Gagal menyimpan. Silakan coba lagi.');
            }
        };

        if (schedule.is_logged) {
            updateLog({ scheduleId: schedule.id, data }, { onSuccess, onError });
        } else {
            createLog({ scheduleId: schedule.id, data }, { onSuccess, onError });
        }
    };

    const PortionOption = ({
        value,
        label,
        isSelected
    }: {
        value: PmtPortion;
        label: string;
        isSelected: boolean;
    }) => {
        const portionColor = PORTION_COLORS[value];
        const icon = PORTION_ICONS[value];

        return (
            <TouchableOpacity
                onPress={() => setSelectedPortion(value)}
                style={{
                    backgroundColor: isSelected ? colors.primaryContainer : colors.surfaceContainerHigh,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected ? portionColor : 'transparent',
                }}
                className="flex-1 items-center justify-center p-4 rounded-xl"
            >
                <View
                    style={{
                        backgroundColor: portionColor,
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8,
                    }}
                >
                    <MaterialIcons
                        name={icon}
                        size={20}
                        color="#FFFFFF"
                    />
                </View>
                <Text style={{ color: isSelected ? colors.onPrimaryContainer : colors.onSurface }} className="text-sm font-bold text-center">{label}</Text>
            </TouchableOpacity>
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ color: colors.onSurfaceVariant }} className="mt-4 text-sm">
                        Memuat data...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // No schedule found
    if (!schedule) {
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
                
                <View className="flex-1 items-center justify-center px-8">
                    <MaterialIcons name="event-busy" size={64} color={colors.onSurfaceVariant} />
                    <Text style={{ color: colors.onSurface }} className="text-xl font-bold mt-4 text-center">
                        Tidak Ada Jadwal PMT
                    </Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm mt-2 text-center">
                        Tidak ada jadwal PMT yang dapat dilaporkan hari ini.
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
            <View style={{ backgroundColor: colors.surface }} className="flex-row items-center p-4 pb-2 justify-between">
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ backgroundColor: colors.surfaceContainerHigh }}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
                </TouchableOpacity>
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
                    {schedule.is_logged ? 'Edit Laporan PMT' : 'Lapor PMT'}
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
                                {formatDate(schedule.scheduled_date)}
                            </Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-normal">
                                {schedule.is_logged ? 'Sudah dilaporkan' : 'Belum dilaporkan'}
                            </Text>
                        </View>
                        <View style={{ backgroundColor: colors.primaryContainer }} className="w-12 h-12 items-center justify-center rounded-lg">
                            <MaterialIcons name="calendar-month" size={24} color={colors.primary} />
                        </View>
                    </View>
                </View>

                {/* Menu Info */}
                <View style={{ backgroundColor: colors.surface }} className="flex-row items-center gap-4 px-4 py-2">
                    {schedule.menu.image_url ? (
                        <Image
                            source={{ uri: schedule.menu.image_url }}
                            className="w-12 h-12 rounded-lg"
                            contentFit="cover"
                        />
                    ) : (
                        <View style={{ backgroundColor: colors.primaryContainer }} className="w-12 h-12 items-center justify-center rounded-lg">
                            <MaterialIcons name="restaurant-menu" size={24} color={colors.primary} />
                        </View>
                    )}
                    <View className="flex-1">
                        <Text style={{ color: colors.onSurface }} className="text-base font-bold leading-normal">Menu Hari Ini</Text>
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-normal leading-normal">
                            {schedule.menu.name}
                        </Text>
                        <Text style={{ color: colors.outline }} className="text-xs mt-0.5">
                            {schedule.menu.calories} kkal · {schedule.menu.protein}g protein
                        </Text>
                    </View>
                </View>

                <View className="h-4" />

                {/* Photo Upload */}
                <View className="px-4">
                    <Text style={{ color: colors.onSurface }} className="text-sm font-bold mb-3">
                        Foto Anak Makan
                    </Text>
                    <View className="items-center">
                        <ImagePickerButton
                            value={photoUrl || null}
                            onSelect={setPhotoUrl}
                            onRemove={() => setPhotoUrl('')}
                            shape="square"
                            size={160}
                            placeholderIcon="photo-camera"
                            placeholderIconSize={40}
                        />
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-xs mt-2 text-center">
                            Pastikan wajah dan makanan terlihat
                        </Text>
                    </View>
                </View>

                <View className="h-2" />

                {/* Portion Section */}
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight tracking-tight px-4 text-left pb-3 pt-6">
                    Porsi yang dimakan
                </Text>

                {/* Portion Selector Grid */}
                <View className="px-4 flex-row flex-wrap gap-3">
                    <View className="flex-row gap-3 w-full">
                        <PortionOption value="habis" label={PMT_PORTION_LABEL.habis} isSelected={selectedPortion === 'habis'} />
                        <PortionOption value="half" label={PMT_PORTION_LABEL.half} isSelected={selectedPortion === 'half'} />
                    </View>
                    <View className="flex-row gap-3 w-full">
                        <PortionOption value="quarter" label={PMT_PORTION_LABEL.quarter} isSelected={selectedPortion === 'quarter'} />
                        <PortionOption value="none" label={PMT_PORTION_LABEL.none} isSelected={selectedPortion === 'none'} />
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
                    disabled={!selectedPortion || isPending}
                    style={{ 
                        backgroundColor: colors.primary,
                        opacity: (!selectedPortion || isPending) ? 0.5 : 1
                    }}
                    className="w-full h-14 rounded-xl items-center justify-center flex-row gap-2"
                >
                    {isPending ? (
                        <ActivityIndicator size="small" color={colors.onPrimary} />
                    ) : (
                        <MaterialIcons name="check" size={24} color={colors.onPrimary} />
                    )}
                    <Text style={{ color: colors.onPrimary }} className="text-base font-bold leading-normal tracking-wide">
                        {isPending ? 'Menyimpan...' : (schedule.is_logged ? 'PERBARUI LAPORAN' : 'KIRIM LAPORAN')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
