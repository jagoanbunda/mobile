import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditChildScreen() {
    const { colors } = useTheme();
    const [childName, setChildName] = useState('Leo Anderson');
    const [dateOfBirth, setDateOfBirth] = useState('2021-08-15');
    const [gender, setGender] = useState<'male' | 'female'>('male');

    const handleSave = () => {
        router.back();
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
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold tracking-tight">Edit Child Profile</Text>
                <View className="w-10 h-10" />
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
                    <TouchableOpacity className="relative">
                        <View style={{ backgroundColor: colors.primaryContainer, borderColor: colors.primary }} className="w-28 h-28 rounded-full border-2 border-dashed items-center justify-center overflow-hidden">
                            <MaterialIcons name="child-care" size={48} color={colors.primary} />
                        </View>
                        <View style={{ backgroundColor: colors.primary }} className="absolute bottom-1 right-1 w-9 h-9 rounded-full items-center justify-center">
                            <MaterialIcons name="camera-alt" size={18} color={colors.onPrimary} />
                        </View>
                    </TouchableOpacity>
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
                                onChangeText={setChildName}
                            />
                        </View>
                    </View>

                    {/* Date of Birth */}
                    <View className="gap-1.5">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium ml-1">Date of Birth</Text>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center rounded-xl px-4 py-3">
                            <MaterialIcons name="cake" size={20} color={colors.outline} />
                            <TextInput
                                style={{ color: colors.onSurface }}
                                className="flex-1 ml-3 text-base"
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor={colors.outline}
                                value={dateOfBirth}
                                onChangeText={setDateOfBirth}
                            />
                        </View>
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
                            <Text style={{ color: colors.tertiary }} className="font-bold">{childName.split(' ')[0]}</Text>.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={{ backgroundColor: colors.surface }} className="absolute bottom-0 left-0 right-0 p-4 pb-8">
                <TouchableOpacity
                    onPress={handleSave}
                    style={{ backgroundColor: colors.primary }}
                    className="w-full py-4 rounded-xl flex-row items-center justify-center gap-2"
                >
                    <Text style={{ color: colors.onPrimary }} className="font-bold text-base">Save Changes</Text>
                    <MaterialIcons name="check" size={20} color={colors.onPrimary} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
