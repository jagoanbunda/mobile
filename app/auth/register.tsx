import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const { colors } = useTheme();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleRegister = () => {
        router.replace('/profile/add-child');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center p-4 pb-2 justify-between">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
                </TouchableOpacity>
                <View className="flex-row items-center gap-2">
                    <View style={{ backgroundColor: colors.primary }} className="w-8 h-8 rounded-full items-center justify-center">
                        <Text style={{ color: colors.onPrimary }} className="font-bold text-lg">K</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                {/* Title */}
                <View className="px-4 pt-4 pb-6">
                    <Text style={{ color: colors.onSurface }} className="tracking-tight text-[32px] font-bold leading-tight">
                        Join KREANOVA
                    </Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-base font-normal leading-normal pt-2">
                        Create a parent account to monitor your child's growth.
                    </Text>
                </View>

                {/* Form Fields */}
                <View className="px-4 gap-4 pb-4">
                    {/* Full Name */}
                    <View className="gap-2">
                        <Text style={{ color: colors.onSurface }} className="text-sm font-medium">Full Name</Text>
                        <View className="relative">
                            <TextInput
                                style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outline, color: colors.onSurface }}
                                className="w-full rounded-xl border h-14 px-4 pr-12 text-base"
                                placeholder="Enter your full name"
                                placeholderTextColor={colors.onSurfaceVariant}
                                value={fullName}
                                onChangeText={setFullName}
                            />
                            <View className="absolute right-4 top-0 bottom-0 justify-center">
                                <MaterialIcons name="person" size={20} color={colors.textMuted} />
                            </View>
                        </View>
                    </View>

                    {/* Email Address */}
                    <View className="gap-2">
                        <Text style={{ color: colors.onSurface }} className="text-sm font-medium">Email Address</Text>
                        <View className="relative">
                            <TextInput
                                style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outline, color: colors.onSurface }}
                                className="w-full rounded-xl border h-14 px-4 pr-12 text-base"
                                placeholder="Enter your email"
                                placeholderTextColor={colors.onSurfaceVariant}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <View className="absolute right-4 top-0 bottom-0 justify-center">
                                <MaterialIcons name="mail" size={20} color={colors.textMuted} />
                            </View>
                        </View>
                    </View>

                    {/* Password */}
                    <View className="gap-2">
                        <Text style={{ color: colors.onSurface }} className="text-sm font-medium">Password</Text>
                        <View className="relative">
                            <TextInput
                                style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outline, color: colors.onSurface }}
                                className="w-full rounded-xl border h-14 px-4 pr-12 text-base"
                                placeholder="Create a password"
                                placeholderTextColor={colors.onSurfaceVariant}
                                secureTextEntry={!passwordVisible}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setPasswordVisible(!passwordVisible)}
                                className="absolute right-4 top-0 bottom-0 justify-center"
                            >
                                <MaterialIcons
                                    name={passwordVisible ? "visibility" : "visibility-off"}
                                    size={20}
                                    color={colors.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password */}
                    <View className="gap-2">
                        <Text style={{ color: colors.onSurface }} className="text-sm font-medium">Confirm Password</Text>
                        <View className="relative">
                            <TextInput
                                style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outline, color: colors.onSurface }}
                                className="w-full rounded-xl border h-14 px-4 pr-12 text-base"
                                placeholder="Confirm your password"
                                placeholderTextColor={colors.onSurfaceVariant}
                                secureTextEntry={!confirmPasswordVisible}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                className="absolute right-4 top-0 bottom-0 justify-center"
                            >
                                <MaterialIcons
                                    name={confirmPasswordVisible ? "visibility" : "visibility-off"}
                                    size={20}
                                    color={colors.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Terms & Conditions */}
                <View className="px-4 pb-4">
                    <TouchableOpacity
                        onPress={() => setTermsAccepted(!termsAccepted)}
                        className="flex-row items-start gap-3"
                    >
                        <View
                            style={{
                                backgroundColor: termsAccepted ? colors.primary : colors.surfaceContainerHigh,
                                borderColor: termsAccepted ? colors.primary : colors.outline
                            }}
                            className="w-5 h-5 border-2 rounded-md items-center justify-center"
                        >
                            {termsAccepted && <MaterialIcons name="check" size={14} color={colors.onPrimary} />}
                        </View>
                        <View className="flex-1">
                            <Text style={{ color: colors.onSurface }} className="text-sm font-medium">
                                I agree to the Terms & Conditions
                            </Text>
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">
                                Your data is secure with us.
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Sign Up Button */}
                <View className="px-4 pb-4">
                    <TouchableOpacity
                        onPress={handleRegister}
                        style={{ backgroundColor: colors.primary }}
                        className="w-full h-12 rounded-xl items-center justify-center shadow-md active:scale-[0.98]"
                    >
                        <Text style={{ color: colors.onPrimary }} className="text-base font-bold tracking-tight">
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View className="px-4 py-2 flex-row items-center gap-4">
                    <View style={{ backgroundColor: colors.outlineVariant }} className="flex-1 h-px" />
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">Or sign up with</Text>
                    <View style={{ backgroundColor: colors.outlineVariant }} className="flex-1 h-px" />
                </View>

                {/* Social Buttons */}
                <View className="px-4 py-4 flex-row gap-4">
                    <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outline }} className="flex-1 flex-row items-center justify-center gap-3 rounded-xl border p-3">
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDTgev5KwxHCQIbyWTSUhNR_W6pnOWynZaIXnS5KLyOtnMc-Ti5M9Oe1WuXld-ZubbAYiuJIhndEoB2HAFkp-2bhgLU8VS8G6i0uOfwTN4Pv1BLKA9Z9VvFRJBjncIOP0v49x0NUvr0182arVQjLSceVHT051-zBWM_PiMGCCaqXoasvJJWhPvyOELo7Ho1OC_wHadoOGd93An3ZJQNk2wQsf_yOYGrTxJBtWjpFmOF5YCWNdpa4jCW0d_J_H_4TyOm3mE28GeXdM" }}
                            className="w-5 h-5"
                            contentFit="contain"
                        />
                        <Text style={{ color: colors.onSurface }} className="text-sm font-medium">Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outline }} className="flex-1 flex-row items-center justify-center gap-3 rounded-xl border p-3">
                        <MaterialIcons name="apple" size={20} color={colors.onSurface} />
                        <Text style={{ color: colors.onSurface }} className="text-sm font-medium">Apple</Text>
                    </TouchableOpacity>
                </View>

                {/* Spacer */}
                <View className="flex-1" />

                {/* Login Link */}
                <View className="items-center px-4 py-6">
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-normal">
                        Already have an account?{' '}
                        <Text
                            onPress={() => router.push('/auth/login')}
                            style={{ color: colors.primary }}
                            className="font-bold"
                        >
                            Log In
                        </Text>
                    </Text>
                </View>

                <View className="h-4" />
            </ScrollView>
        </SafeAreaView>
    );
}
