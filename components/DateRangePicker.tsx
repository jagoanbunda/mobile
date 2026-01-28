import React, { useState } from 'react';
import { View, Text, Pressable, Platform, Modal } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '@/context/ThemeContext';

// Helper function to format date in Indonesian
const formatDateShort = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
};

const formatDateFull = (date: Date): string => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export interface DateRangePickerProps {
    startDate: Date;
    endDate: Date;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    /** Display mode: 'range' shows both dates, 'single' shows one date */
    mode?: 'range' | 'single';
    /** Maximum selectable date (default: today) */
    maxDate?: Date;
    /** Minimum selectable date */
    minDate?: Date;
}

export function DateRangePicker({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    mode = 'range',
    maxDate = new Date(),
    minDate,
}: DateRangePickerProps) {
    const { colors } = useTheme();
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const handleStartDateChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (date) {
            onStartDateChange(date);
            // If start date is after end date, update end date
            if (date > endDate) {
                onEndDateChange(date);
            }
        }
    };

    const handleEndDateChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (date) {
            // Ensure end date is not before start date
            if (date >= startDate) {
                onEndDateChange(date);
            }
        }
    };

    // Single date mode
    if (mode === 'single') {
        return (
            <View>
                <Pressable
                    onPress={() => setShowStartPicker(true)}
                    style={{
                        backgroundColor: colors.surfaceContainerHigh,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 12,
                        height: 48,
                        paddingHorizontal: 16,
                    }}
                >
                    <MaterialIcons
                        name="event"
                        size={20}
                        color={colors.onSurfaceVariant}
                        style={{ position: 'absolute', left: 16 }}
                    />
                    <Text style={{ color: colors.onSurface, fontSize: 14, fontWeight: '500' }}>
                        {formatDateFull(startDate)}
                    </Text>
                    <MaterialIcons
                        name="arrow-drop-down"
                        size={24}
                        color={colors.onSurfaceVariant}
                        style={{ position: 'absolute', right: 12 }}
                    />
                </Pressable>

                {showStartPicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleStartDateChange}
                        maximumDate={maxDate}
                        minimumDate={minDate}
                    />
                )}
            </View>
        );
    }

    // Range mode
    return (
        <View className="flex-row items-center gap-2">
            {/* Start Date */}
            <Pressable
                onPress={() => setShowStartPicker(true)}
                style={{
                    flex: 1,
                    backgroundColor: colors.surfaceContainerHigh,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    height: 44,
                    paddingHorizontal: 12,
                    gap: 6,
                }}
            >
                <MaterialIcons name="event" size={18} color={colors.onSurfaceVariant} />
                <Text style={{ color: colors.onSurface, fontSize: 13, fontWeight: '500' }}>
                    {formatDateShort(startDate)}
                </Text>
            </Pressable>

            {/* Separator */}
            <MaterialIcons name="arrow-forward" size={16} color={colors.onSurfaceVariant} />

            {/* End Date */}
            <Pressable
                onPress={() => setShowEndPicker(true)}
                style={{
                    flex: 1,
                    backgroundColor: colors.surfaceContainerHigh,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    height: 44,
                    paddingHorizontal: 12,
                    gap: 6,
                }}
            >
                <MaterialIcons name="event" size={18} color={colors.onSurfaceVariant} />
                <Text style={{ color: colors.onSurface, fontSize: 13, fontWeight: '500' }}>
                    {formatDateShort(endDate)}
                </Text>
            </Pressable>

            {/* Date Pickers */}
            {showStartPicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleStartDateChange}
                    maximumDate={maxDate}
                    minimumDate={minDate}
                />
            )}

            {showEndPicker && (
                <DateTimePicker
                    value={endDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleEndDateChange}
                    maximumDate={maxDate}
                    minimumDate={startDate}
                />
            )}
        </View>
    );
}

export default DateRangePicker;
