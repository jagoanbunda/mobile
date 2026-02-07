import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const { colors } = useTheme();
    const { login, isAuthenticated } = useAuth();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)');
        }
    }, [isAuthenticated]);

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

        setIsLoading(true);
        try {
            await login({ email, password });
            // Navigation is automatic via conditional rendering in root layout
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
        } finally {
            setIsLoading(false);
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
                <View className="flex-1 px-6 pt-6 pb-8">
                    {/* Header Image & Logo Area */}
                    <View className="mb-8 rounded-2xl h-[220px] overflow-hidden relative">
                        <Image
                            source={require('@/assets/images/login-header.jpg')}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                            transition={300}
                        />

                        {/* Logo */}
                        <View className="absolute bottom-4 left-4 z-10">
                            <View className="w-14 h-14 rounded-full items-center justify-center shadow-lg overflow-hidden" style={{ backgroundColor: colors.surface }}>
                                <Image
                                    source={require('@/assets/images/logo.png')}
                                    style={{ width: 48, height: 48 }}
                                    contentFit="contain"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Headline */}
                    <View className="mb-8">
                        <Text style={{ color: colors.onSurface }} className="tracking-wide text-4xl font-bold leading-tight">
                            Welcome to <Text style={{ color: colors.primary }}>JagoanBunda</Text>
                        </Text>
                        <Text style={{ color: colors.onSurfaceVariant }} className="mt-3 text-lg font-medium">
                            Monitor your child&apos;s growth journey.
                        </Text>
                    </View>

                    {/* Login Form */}
                    <View className="gap-6">
                        {/* Email Input */}
                        <View style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outline }} className="flex-row w-full items-center rounded-2xl border h-14 shadow-sm">
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
                                <MaterialIcons name="mail" size={22} color={colors.onSurfaceVariant} />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outline }} className="flex-row w-full items-center rounded-2xl border h-14 shadow-sm">
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
                                    size={22}
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
                            <View style={{ backgroundColor: colors.errorContainer }} className="p-4 rounded-2xl">
                                <Text style={{ color: colors.onErrorContainer }} className="text-sm text-center font-medium">{error}</Text>
                            </View>
                        )}

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isLoading}
                            style={{
                                backgroundColor: isLoading ? colors.surfaceContainerHigh : colors.primary,
                                opacity: isLoading ? 0.7 : 1
                            }}
                            className="mt-4 w-full h-16 rounded-full items-center justify-center shadow-xl active:scale-[0.97]"
                        >
                            {isLoading ? (
                                <ActivityIndicator color={colors.onSurface} />
                            ) : (
                                <Text style={{ color: colors.onPrimary }} className="font-bold text-xl tracking-wide">Log In</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Register Link */}
                    <View className="mt-auto pt-6 items-center">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">
                            Don&apos;t have an account?{' '}
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
