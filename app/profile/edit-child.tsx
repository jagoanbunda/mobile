import { useTheme } from '@/context/ThemeContext';
import { useActiveChild, useUpdateChild, useDeleteChild } from '@/services/hooks/use-children';
import { ApiError } from '@/services/api/errors';
import { UpdateChildRequest, Gender } from '@/types';
import { ImagePickerButton } from '@/components/ImagePickerButton';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Stack, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Parse YYYY-MM-DD or DD/MM/YYYY string to Date object
const parseDateString = (dateStr: string): Date | null => {
    // Try YYYY-MM-DD format first (API format)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    // Try DD/MM/YYYY format
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
        const parts = dateStr.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
    return null;
};

// Format Date object to YYYY-MM-DD string (API format)
const formatDateForApi = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Format Date object to DD/MM/YYYY string (display format)
const formatDateForDisplay = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export default function EditChildScreen() {
    const { colors } = useTheme();
    const { data: child, isLoading: isLoadingChild } = useActiveChild();
    const { mutate: updateChild, isPending: isUpdating } = useUpdateChild(child?.id ?? 0);
    const { mutate: deleteChild, isPending: isDeleting } = useDeleteChild();

    const [childName, setChildName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize form when child data loads
    useEffect(() => {
        if (child) {
            setChildName(child.name);
            // Convert API date format to display format
            const parsed = parseDateString(child.birthday);
            setDateOfBirth(parsed ? formatDateForDisplay(parsed) : child.birthday);
            setGender(child.gender as 'male' | 'female');
            setAvatarUri(child.avatar_url || null);
        }
    }, [child]);

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!childName.trim()) {
            newErrors.name = 'Nama anak wajib diisi';
        }

        if (!dateOfBirth.trim()) {
            newErrors.birthday = 'Tanggal lahir wajib diisi';
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

    // Get the initial date for date picker
    const getPickerDate = (): Date => {
        const parsed = parseDateString(dateOfBirth);
        if (parsed) return parsed;
        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() - 1);
        return defaultDate;
    };

    const handleSave = () => {
        if (!child || !validateForm()) return;

        // Convert display format (DD/MM/YYYY) to API format (YYYY-MM-DD)
        const parsedDate = parseDateString(dateOfBirth);
        const birthdayForApi = parsedDate ? formatDateForApi(parsedDate) : dateOfBirth;

        const data: UpdateChildRequest = {
            name: childName.trim(),
            birthday: birthdayForApi,
            gender: gender as Gender,
        };

        if (avatarUri) {
            data.avatar_url = avatarUri;
        }

        updateChild(data, {
            onSuccess: () => {
                router.back();
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    const validationErrors = error.validationErrors;
                    if (validationErrors) {
                        const apiErrors: Record<string, string> = {};
                        Object.entries(validationErrors).forEach(([field, messages]) => {
                            apiErrors[field] = messages[0];
                        });
                        setErrors(apiErrors);
                    } else {
                        Alert.alert('Error', error.message || 'Gagal memperbarui data anak');
                    }
                } else {
                    Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
                }
            },
        });
    };

    const handleDelete = () => {
        if (!child) return;

        Alert.alert(
            'Hapus Profil Anak',
            `Apakah Anda yakin ingin menghapus profil ${child.name}? Semua data terkait akan dihapus.`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => {
                        deleteChild(child.id, {
                            onSuccess: () => {
                                router.replace('/(tabs)');
                            },
                            onError: (error) => {
                                Alert.alert(
                                    'Error',
                                    error instanceof ApiError ? error.message : 'Gagal menghapus profil anak'
                                );
                            },
                        });
                    },
                },
            ]
        );
    };

    // Loading state
    if (isLoadingChild) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
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
                <View className="flex-1 items-center justify-center px-8">
                    <Text style={{ color: colors.onSurface }} className="text-lg text-center mb-4">
                        Tidak ada profil anak yang tersedia
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.replace('/profile/add-child')}
                        style={{ backgroundColor: colors.primary }}
                        className="px-6 py-3 rounded-xl"
                    >
                        <Text style={{ color: colors.onPrimary }} className="font-bold">Tambah Anak</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const isPending = isUpdating || isDeleting;

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
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold tracking-tight">Edit Child Profile</Text>
                <TouchableOpacity
                    onPress={handleDelete}
                    disabled={isPending}
                    className="w-10 h-10 items-center justify-center"
                >
                    <MaterialIcons name="delete-outline" size={24} color={colors.error} />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Title */}
                <View className="items-center mt-2 mb-6">
                    <Text style={{ color: colors.onSurface }} className="text-2xl font-bold mb-1 text-center">Child's Profile</Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm text-center">Update your child's personal details.</Text>
                </View>

                {/* Avatar */}
                <View className="items-center mb-10">
                    <ImagePickerButton
                        value={avatarUri}
                        onSelect={setAvatarUri}
                        onRemove={() => setAvatarUri(null)}
                        shape="circle"
                        size={112}
                        placeholderIcon="child-care"
                    />
                </View>

                {/* Form */}
                <View className="gap-5">
                    {/* Child's Full Name */}
                    <View className="gap-1.5">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium ml-1">Child's Full Name</Text>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center rounded-xl px-4 py-3">
                            <MaterialIcons name="face" size={20} color={colors.outline} />
                            <TextInput
                                style={{ color: colors.onSurface }}
                                className="flex-1 ml-3 text-base"
                                placeholder="Child's Name"
                                placeholderTextColor={colors.outline}
                                value={childName}
                                onChangeText={(text) => {
                                    setChildName(text);
                                    if (errors.name) setErrors({ ...errors, name: '' });
                                }}
                            />
                        </View>
                        {errors.name && (
                            <Text style={{ color: colors.error }} className="text-xs ml-1">{errors.name}</Text>
                        )}
                    </View>

                    {/* Date of Birth */}
                    <View className="gap-1.5">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium ml-1">Date of Birth</Text>
                        <View className="flex-row items-center gap-2">
                            <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-1 flex-row items-center rounded-xl px-4 py-3">
                                <MaterialIcons name="cake" size={20} color={colors.outline} />
                                <TextInput
                                    style={{ color: colors.onSurface }}
                                    className="flex-1 ml-3 text-base"
                                    placeholder="DD/MM/YYYY"
                                    placeholderTextColor={colors.outline}
                                    value={dateOfBirth}
                                    onChangeText={(text) => {
                                        setDateOfBirth(text);
                                        if (errors.birthday) setErrors({ ...errors, birthday: '' });
                                    }}
                                    keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
                                />
                            </View>
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

                    {/* Gender */}
                    <View className="gap-1.5">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium ml-1">Gender</Text>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row gap-2 p-1.5 rounded-xl">
                            <TouchableOpacity
                                onPress={() => setGender('male')}
                                style={{ backgroundColor: gender === 'male' ? colors.primary : 'transparent' }}
                                className="flex-1 py-3 rounded-lg items-center justify-center flex-row gap-2"
                            >
                                <MaterialIcons name="male" size={18} color={gender === 'male' ? colors.onPrimary : colors.onSurfaceVariant} />
                                <Text style={{ color: gender === 'male' ? colors.onPrimary : colors.onSurfaceVariant }} className="text-sm font-bold">
                                    Male
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setGender('female')}
                                style={{ backgroundColor: gender === 'female' ? colors.primary : 'transparent' }}
                                className="flex-1 py-3 rounded-lg items-center justify-center flex-row gap-2"
                            >
                                <MaterialIcons name="female" size={18} color={gender === 'female' ? colors.onPrimary : colors.onSurfaceVariant} />
                                <Text style={{ color: gender === 'female' ? colors.onPrimary : colors.onSurfaceVariant }} className="text-sm font-bold">
                                    Female
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Info Card */}
                    <View style={{ backgroundColor: colors.tertiaryContainer }} className="flex-row gap-3 p-4 rounded-xl mt-2">
                        <MaterialIcons name="info" size={20} color={colors.tertiary} />
                        <Text style={{ color: colors.onTertiaryContainer }} className="flex-1 text-sm leading-relaxed">
                            Accurate information helps us provide better growth insights and personalized recommendations for{' '}
                            <Text style={{ color: colors.tertiary }} className="font-bold">{childName.split(' ')[0] || 'your child'}</Text>.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={{ backgroundColor: colors.surface }} className="absolute bottom-0 left-0 right-0 p-4 pb-8">
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isPending}
                    style={{ backgroundColor: isPending ? colors.surfaceContainerHighest : colors.primary }}
                    className="w-full py-4 rounded-xl flex-row items-center justify-center gap-2"
                >
                    {isPending ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <>
                            <Text style={{ color: colors.onPrimary }} className="font-bold text-base">Save Changes</Text>
                            <MaterialIcons name="check" size={20} color={colors.onPrimary} />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
