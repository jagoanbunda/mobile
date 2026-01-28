import { useTheme } from '@/context/ThemeContext';
import { useLogin } from '@/services/hooks/use-auth';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const { colors } = useTheme();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const loginMutation = useLogin();

    const handleLogin = async () => {
        setError(null);
        
        // Validation
        if (!email.trim()) {
            setError('Email is required');
            return;
        }
        
        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        
        if (!password) {
            setError('Password is required');
            return;
        }
        
        try {
            await loginMutation.mutateAsync({ email, password });
            // authService.login already stores token via tokenStorage
            // Navigate to dashboard
            router.replace('/(tabs)');
        } catch (err: unknown) {
            const apiError = err as { status?: number; getFirstError?: () => string | null; message?: string };
            if (apiError?.status === 422) {
                // Validation error from API
                setError(apiError.getFirstError?.() || 'Invalid credentials');
            } else if (apiError?.status === 401) {
                setError('Invalid email or password');
            } else {
                setError(apiError?.message || 'Login failed. Please try again.');
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                <View className="flex-1 px-6 pt-4 pb-6">
                    {/* Header Image & Logo Area */}
                    <View className="mb-6 rounded-xl h-[180px] overflow-hidden relative shadow-lg">
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqoISqsvcZsvsQAxjYLR7aQAXwQTSsoq6aYpSZM5ALL4XJAlticc3rUFYqLlu8VeWKqM9zI4YlE1ta6tbcx1a_wkPNm1lA6Ru-5FSyHmBsCyPJ-AkU5D2Uy1kNRU0dFlfDPj8ygLmosCgTUrebtkZ-p00bIWq6JWaLFHTd5O5NklWPVtYKkDiQuzLdxj_dplnepvxml3SFc-bPA0CZwD2OYPHEvk4DdVoqk2xvkFYMhsRObloGFODKS5kiBe9pVW9CK6fM4B0g1tI" }}
                            className="w-full h-full"
                            contentFit="cover"
                        />
                        {/* Logo */}
                        <View className="absolute bottom-4 left-4 z-10">
                            <View style={{ backgroundColor: colors.primary }} className="w-12 h-12 rounded-full items-center justify-center shadow-lg">
                                <MaterialIcons name="spa" size={28} color={colors.onPrimary} />
                            </View>
                        </View>
                    </View>

                    {/* Headline */}
                    <View className="mb-6">
                        <Text style={{ color: colors.onSurface }} className="tracking-tight text-[32px] font-bold leading-tight">
                            Welcome to <Text style={{ color: colors.primary }}>KREANOVA</Text>
                        </Text>
                        <Text style={{ color: colors.onSurfaceVariant }} className="mt-2 text-base font-medium">
                            Monitor your child's growth journey.
                        </Text>
                    </View>

                    {/* Login Form */}
                    <View className="gap-4">
                        {/* Email Input */}
                        <View style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outline }} className="flex-row w-full items-center rounded-xl border h-14">
                            <TextInput
                                style={{ color: colors.onSurface }}
                                className="flex-1 text-base px-4"
                                placeholder="Email or Username"
                                placeholderTextColor={colors.onSurfaceVariant}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <View className="pr-4">
                                <MaterialIcons name="mail" size={20} color={colors.onSurfaceVariant} />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outline }} className="flex-row w-full items-center rounded-xl border h-14">
                            <TextInput
                                style={{ color: colors.onSurface }}
                                className="flex-1 text-base px-4"
                                placeholder="Password"
                                placeholderTextColor={colors.onSurfaceVariant}
                                secureTextEntry={!passwordVisible}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setPasswordVisible(!passwordVisible)}
                                className="pr-4"
                            >
                                <MaterialIcons
                                    name={passwordVisible ? "visibility" : "visibility-off"}
                                    size={20}
                                    color={colors.onSurfaceVariant}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Forgot Password */}
                        <View className="items-end">
                            <TouchableOpacity>
                                <Text style={{ color: colors.primary }} className="text-sm font-semibold">
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Error Display */}
                        {error && (
                            <View style={{ backgroundColor: colors.errorContainer }} className="p-3 rounded-xl">
                                <Text style={{ color: colors.onErrorContainer }} className="text-sm text-center">{error}</Text>
                            </View>
                        )}

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loginMutation.isPending}
                            style={{ 
                                backgroundColor: loginMutation.isPending ? colors.surfaceContainerHigh : colors.primary,
                                opacity: loginMutation.isPending ? 0.7 : 1 
                            }}
                            className="mt-2 w-full h-14 rounded-full items-center justify-center shadow-lg active:scale-[0.98]"
                        >
                            {loginMutation.isPending ? (
                                <ActivityIndicator color={colors.onSurface} />
                            ) : (
                                <Text style={{ color: colors.onPrimary }} className="font-bold text-lg">Log In</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Social Login Divider */}
                    <View className="relative py-6 items-center justify-center">
                        <View style={{ backgroundColor: colors.outlineVariant }} className="absolute w-full h-px" />
                        <View style={{ backgroundColor: colors.surface }} className="px-4">
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">Or continue with</Text>
                        </View>
                    </View>

                    {/* Social Buttons */}
                    <View className="flex-row gap-4 justify-center">
                        <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outline }} className="h-12 w-12 rounded-full border items-center justify-center">
                            <Image
                                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuChm69aYpXCVx2UyNVqBYiLQ-HvKKqqXGCinCcmwRg5gc3bQl_61r_gNS-titySNbMwLulPRF5dBSZCIOwhw5maJWwoH0O80bYLQ9hM2jVZfoFkMBUx9KKGrJJxLvB5ytDYgK0-1wCfLb4Y61zQ7RJzgoU0wXFm0Nb6RYAVyg9HIDph77g1-bDcxIfJICqUN28clX0mhDuScyN6uqyfc6zXHqQ2doFmYvG1-tq8FdkLFqTIwypR1cZpFRS0TQRAgY-c7x2vbngCpf8" }}
                                className="w-6 h-6"
                                contentFit="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outline }} className="h-12 w-12 rounded-full border items-center justify-center">
                            <Image
                                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ2CY01_TJ9EzXYNi9j46faU7CChXbTZQYiBrl7Pt__IWZ44KOSi3RepJsfNO8tAa9-rn2MgUcxPA8YOoVkTKaQuY5hk2h7pBYxafMxx9-GqXGxfeqZrrIJ5Ixvj-TzVk0GZqxolOa2gYAt75O3QijBK4UD7trQ0qRgOjDrE7-v8myDgpeaLtQuoZVkcIp9qitkNEvr6_Z7Jad68qNEUxDjSJxultROyy-UgEtMk-60SPpPNdDhAUA-10LfVRApa1tIcocFWZOF6I" }}
                                className="w-6 h-6"
                                contentFit="contain"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Register Link */}
                    <View className="mt-auto pt-6 items-center">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">
                            Don't have an account?{' '}
                            <Text
                                onPress={() => router.push('/auth/register')}
                                style={{ color: colors.primary }}
                                className="font-bold"
                            >
                                Sign Up
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* iOS Home Indicator Bar */}
            <View style={{ backgroundColor: colors.surface }} className="w-full items-center pb-2 pt-2">
                <View style={{ backgroundColor: colors.outlineVariant }} className="h-1.5 w-32 rounded-full" />
            </View>
        </SafeAreaView>
    );
}
