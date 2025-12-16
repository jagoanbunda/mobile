import Colors from '@/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const [role, setRole] = useState<'Parent' | 'Health Worker'>('Parent');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Logic for authentication would go here
        // For prototype, navigate to tabs (dashboard)
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView className="flex-1 bg-background-dark pt-12">
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
                        {/* Gradient Overlay */}
                        <View className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent" />
                        {/* Logo */}
                        <View className="absolute bottom-4 left-4 z-10">
                            <View className="w-12 h-12 rounded-full bg-primary items-center justify-center shadow-lg">
                                <MaterialIcons name="spa" size={28} color={Colors.backgroundDark} />
                            </View>
                        </View>
                    </View>

                    {/* Headline */}
                    <View className="mb-6">
                        <Text className="text-white tracking-tight text-[32px] font-bold leading-tight">
                            Welcome to <Text className="text-primary">KREANOVA</Text>
                        </Text>
                        <Text className="text-[#a0c695] mt-2 text-base font-medium">
                            Monitor your child's growth journey.
                        </Text>
                    </View>

                    {/* Role Selector */}
                    <View className="mb-6">
                        <View className="flex-row h-12 w-full items-center justify-center rounded-full bg-[#1f2b1b] p-1 border border-[#406336]">
                            <TouchableOpacity
                                onPress={() => setRole('Parent')}
                                className={`flex-1 items-center justify-center rounded-full h-full ${role === 'Parent' ? 'bg-primary shadow-md' : ''}`}
                            >
                                <Text className={`text-sm font-bold ${role === 'Parent' ? 'text-background-dark' : 'text-[#a0c695]'}`}>
                                    Parent
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setRole('Health Worker')}
                                className={`flex-1 items-center justify-center rounded-full h-full ${role === 'Health Worker' ? 'bg-primary shadow-md' : ''}`}
                            >
                                <Text className={`text-sm font-bold ${role === 'Health Worker' ? 'text-background-dark' : 'text-[#a0c695]'}`}>
                                    Health Worker
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login Form */}
                    <View className="gap-4">
                        {/* Email Input */}
                        <View className="flex-row w-full items-center rounded-xl border border-[#406336] bg-[#20321b] h-14">
                            <TextInput
                                className="flex-1 text-base text-white px-4"
                                placeholder="Email or Username"
                                placeholderTextColor="#a0c695"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <View className="pr-4">
                                <MaterialIcons name="mail" size={20} color="#a0c695" />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View className="flex-row w-full items-center rounded-xl border border-[#406336] bg-[#20321b] h-14">
                            <TextInput
                                className="flex-1 text-base text-white px-4"
                                placeholder="Password"
                                placeholderTextColor="#a0c695"
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
                                    color="#a0c695"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Forgot Password */}
                        <View className="items-end">
                            <TouchableOpacity>
                                <Text className="text-sm font-semibold text-primary">
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            className="mt-2 w-full h-14 rounded-full bg-primary items-center justify-center shadow-lg active:scale-[0.98]"
                            style={{ shadowColor: '#4cdf20', shadowOpacity: 0.3, shadowRadius: 15 }}
                        >
                            <Text className="text-background-dark font-bold text-lg">Log In</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Social Login Divider */}
                    <View className="relative py-6 items-center justify-center">
                        <View className="absolute w-full h-px bg-[#406336]" />
                        <View className="bg-background-dark px-4">
                            <Text className="text-sm text-[#a0c695]">Or continue with</Text>
                        </View>
                    </View>

                    {/* Social Buttons */}
                    <View className="flex-row gap-4 justify-center">
                        <TouchableOpacity className="h-12 w-12 rounded-full bg-[#1f2b1b] border border-[#406336] items-center justify-center">
                            <Image
                                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuChm69aYpXCVx2UyNVqBYiLQ-HvKKqqXGCinCcmwRg5gc3bQl_61r_gNS-titySNbMwLulPRF5dBSZCIOwhw5maJWwoH0O80bYLQ9hM2jVZfoFkMBUx9KKGrJJxLvB5ytDYgK0-1wCfLb4Y61zQ7RJzgoU0wXFm0Nb6RYAVyg9HIDph77g1-bDcxIfJICqUN28clX0mhDuScyN6uqyfc6zXHqQ2doFmYvG1-tq8FdkLFqTIwypR1cZpFRS0TQRAgY-c7x2vbngCpf8" }}
                                className="w-6 h-6"
                                contentFit="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity className="h-12 w-12 rounded-full bg-[#1f2b1b] border border-[#406336] items-center justify-center">
                            <Image
                                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ2CY01_TJ9EzXYNi9j46faU7CChXbTZQYiBrl7Pt__IWZ44KOSi3RepJsfNO8tAa9-rn2MgUcxPA8YOoVkTKaQuY5hk2h7pBYxafMxx9-GqXGxfeqZrrIJ5Ixvj-TzVk0GZqxolOa2gYAt75O3QijBK4UD7trQ0qRgOjDrE7-v8myDgpeaLtQuoZVkcIp9qitkNEvr6_Z7Jad68qNEUxDjSJxultROyy-UgEtMk-60SPpPNdDhAUA-10LfVRApa1tIcocFWZOF6I" }}
                                className="w-6 h-6"
                                contentFit="contain"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Register Link */}
                    <View className="mt-auto pt-6 items-center">
                        <Text className="text-[#a0c695] text-sm">
                            Don't have an account?{' '}
                            <Text
                                onPress={() => router.push('/auth/register')}
                                className="font-bold text-primary"
                            >
                                Sign Up
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* iOS Home Indicator Bar */}
            <View className="w-full items-center pb-2 pt-2 bg-background-dark">
                <View className="h-1.5 w-32 rounded-full bg-white/20" />
            </View>
        </SafeAreaView>
    );
}
