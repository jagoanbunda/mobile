import { useTheme } from '@/context/ThemeContext';
import { useCreateChild } from '@/services/hooks/use-children';
import { ApiError } from '@/services/api/errors';
import { CreateChildRequest, Gender } from '@/types';
import { ImagePickerButton } from '@/components/ImagePickerButton';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Parse DD/MM/YYYY string to Date object
const parseDateString = (dateStr: string): Date | null => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    const date = new Date(year, month, day);
    // Validate the date is valid
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
        return null;
    }
    return date;
};

// Format Date object to DD/MM/YYYY string
const formatDateForDisplay = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export default function AddChildScreen() {
    const { colors } = useTheme();
    const { mutate: createChild, isPending } = useCreateChild();

    const [babyName, setBabyName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [birthWeight, setBirthWeight] = useState('');
    const [birthHeight, setBirthHeight] = useState('');
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const formatDateForApi = (dateStr: string): string => {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return dateStr;
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!babyName.trim()) {
            newErrors.name = 'Nama anak wajib diisi';
        }

        if (!dateOfBirth.trim()) {
            newErrors.birthday = 'Tanggal lahir wajib diisi';
        } else {
            // Validate date format DD/MM/YYYY
            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            if (!dateRegex.test(dateOfBirth)) {
                newErrors.birthday = 'Format tanggal harus DD/MM/YYYY';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDateOfBirth(formatDateForDisplay(selectedDate));
            if (errors.birthday) setErrors({ ...errors, birthday: '' });
        }
    };

    // Get the initial date for date picker (parsed from text or today minus 1 year)
    const getPickerDate = (): Date => {
        const parsed = parseDateString(dateOfBirth);
        if (parsed) return parsed;
        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() - 1);
        return defaultDate;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        const data: CreateChildRequest = {
            name: babyName.trim(),
            birthday: formatDateForApi(dateOfBirth),
            gender: gender as Gender,
        };

        // Add optional fields if provided
        if (birthWeight) {
            data.birth_weight = parseFloat(birthWeight);
        }
        if (birthHeight) {
            data.birth_height = parseFloat(birthHeight);
        }
        if (avatarUri) {
            data.avatar_url = avatarUri;
        }

        createChild(data, {
            onSuccess: () => {
                router.replace('/(tabs)');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    const validationErrors = error.validationErrors;
                    if (validationErrors) {
                        // Map API validation errors to form fields
                        const apiErrors: Record<string, string> = {};
                        Object.entries(validationErrors).forEach(([field, messages]) => {
                            apiErrors[field] = messages[0];
                        });
                        setErrors(apiErrors);
                    } else {
                        Alert.alert('Error', error.message || 'Gagal menambahkan anak');
                    }
                } else {
                    Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
                }
            },
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ backgroundColor: colors.surface }} className="flex-row items-center justify-between p-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ backgroundColor: colors.surfaceContainerHigh }}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back-ios-new" size={20} color={colors.onSurface} />
                </TouchableOpacity>
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold tracking-tight">Add Baby Profile</Text>
                <View className="w-10" />
            </View>

            {/* Progress Indicator */}
            <View className="w-full flex-row justify-center py-2">
                <View className="flex-row items-center gap-3">
                    <View style={{ backgroundColor: colors.primary, opacity: 0.4 }} className="h-2 w-2 rounded-full" />
                    <View style={{ backgroundColor: colors.primary }} className="h-2 w-8 rounded-full" />
                    <View style={{ backgroundColor: colors.primary, opacity: 0.4 }} className="h-2 w-2 rounded-full" />
                </View>
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Headline */}
                <View className="items-center mt-4 mb-8">
                    <Text style={{ color: colors.onSurface }} className="text-2xl font-bold mb-2 text-center">
                        Tell us about your little one
                    </Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-base text-center">
                        We'll use this to track their growth milestones.
                    </Text>
                </View>

                {/* Avatar Uploader */}
                <View className="items-center mb-8">
                    <ImagePickerButton
                        value={avatarUri}
                        onSelect={setAvatarUri}
                        onRemove={() => setAvatarUri(null)}
                        shape="circle"
                        size={112}
                        placeholderIcon="face"
                    />
                </View>

                {/* Form Fields */}
                <View className="gap-6">
                    {/* Baby's Name */}
                    <View className="gap-2">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-semibold ml-1">Baby's Name</Text>
                        <TextInput
                            style={{ backgroundColor: colors.surfaceContainerHigh, color: colors.onSurface }}
                            className="w-full rounded-xl px-4 py-3.5"
                            placeholder="e.g. Noah Anderson"
                            placeholderTextColor={colors.outline}
                            value={babyName}
                            onChangeText={(text) => {
                                setBabyName(text);
                                if (errors.name) setErrors({ ...errors, name: '' });
                            }}
                        />
                        {errors.name && (
                            <Text style={{ color: colors.error }} className="text-xs ml-1">{errors.name}</Text>
                        )}
                    </View>

                    {/* Date of Birth */}
                    <View className="gap-2">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-semibold ml-1">Date of Birth</Text>
                        <View className="flex-row items-center gap-2">
                            <TextInput
                                style={{ backgroundColor: colors.surfaceContainerHigh, color: colors.onSurface }}
                                className="flex-1 rounded-xl px-4 py-3.5"
                                placeholder="DD/MM/YYYY"
                                placeholderTextColor={colors.outline}
                                value={dateOfBirth}
                                onChangeText={(text) => {
                                    setDateOfBirth(text);
                                    if (errors.birthday) setErrors({ ...errors, birthday: '' });
                                }}
                                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
                            />
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={{ backgroundColor: colors.surfaceContainerHigh }}
                                className="w-12 h-12 rounded-xl items-center justify-center"
                            >
                                <MaterialIcons name="calendar-today" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                        {errors.birthday && (
                            <Text style={{ color: colors.error }} className="text-xs ml-1">{errors.birthday}</Text>
                        )}
                        {showDatePicker && (
                            <DateTimePicker
                                value={getPickerDate()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDateChange}
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    {/* Gender Selector */}
                    <View className="gap-2">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-semibold ml-1">Gender</Text>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row gap-3 p-1 rounded-xl">
                            <TouchableOpacity
                                onPress={() => setGender('male')}
                                style={{ backgroundColor: gender === 'male' ? colors.primary : 'transparent' }}
                                className="flex-1 py-3 rounded-lg items-center justify-center flex-row gap-2"
                            >
                                <MaterialIcons name="male" size={18} color={gender === 'male' ? colors.onPrimary : colors.onSurfaceVariant} />
                                <Text style={{ color: gender === 'male' ? colors.onPrimary : colors.onSurfaceVariant }} className="text-sm font-bold">
                                    Boy
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setGender('female')}
                                style={{ backgroundColor: gender === 'female' ? colors.primary : 'transparent' }}
                                className="flex-1 py-3 rounded-lg items-center justify-center flex-row gap-2"
                            >
                                <MaterialIcons name="female" size={18} color={gender === 'female' ? colors.onPrimary : colors.onSurfaceVariant} />
                                <Text style={{ color: gender === 'female' ? colors.onPrimary : colors.onSurfaceVariant }} className="text-sm font-bold">
                                    Girl
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Birth Measurements */}
                    <View className="flex-row gap-4">
                        {/* Birth Weight */}
                        <View className="flex-1 gap-2">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-semibold ml-1">Birth Weight</Text>
                            <View className="relative">
                                <TextInput
                                    style={{ backgroundColor: colors.surfaceContainerHigh, color: colors.onSurface }}
                                    className="w-full rounded-xl pl-4 pr-12 py-3.5"
                                    placeholder="0.0"
                                    placeholderTextColor={colors.outline}
                                    keyboardType="decimal-pad"
                                    value={birthWeight}
                                    onChangeText={setBirthWeight}
                                />
                                <View className="absolute right-4 top-0 bottom-0 justify-center">
                                    <Text style={{ color: colors.outline }} className="text-sm font-medium">kg</Text>
                                </View>
                            </View>
                        </View>

                        {/* Birth Height */}
                        <View className="flex-1 gap-2">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-semibold ml-1">Birth Height</Text>
                            <View className="relative">
                                <TextInput
                                    style={{ backgroundColor: colors.surfaceContainerHigh, color: colors.onSurface }}
                                    className="w-full rounded-xl pl-4 pr-12 py-3.5"
                                    placeholder="0"
                                    placeholderTextColor={colors.outline}
                                    keyboardType="number-pad"
                                    value={birthHeight}
                                    onChangeText={setBirthHeight}
                                />
                                <View className="absolute right-4 top-0 bottom-0 justify-center">
                                    <Text style={{ color: colors.outline }} className="text-sm font-medium">cm</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={{ backgroundColor: colors.surface }} className="absolute bottom-0 left-0 right-0 p-4 pb-8">
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isPending}
                    style={{ backgroundColor: isPending ? colors.surfaceContainerHighest : colors.primary }}
                    className="w-full py-4 rounded-xl shadow-lg flex-row items-center justify-center gap-2"
                >
                    {isPending ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <>
                            <Text style={{ color: colors.onPrimary }} className="font-bold text-lg">Save & Continue</Text>
                            <MaterialIcons name="arrow-forward" size={20} color={colors.onPrimary} />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
