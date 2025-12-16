import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleRegister = () => {
        // Logic for registration would go here
        // After registration, navigate to add child profile
        router.replace('/profile/add-child');
    };

    return (
        <SafeAreaView className="flex-1 bg-background-dark pt-12">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center p-4 pb-2 justify-between">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                        <Text className="text-background-dark font-bold text-lg">K</Text>
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
                    <Text className="text-white tracking-tight text-[32px] font-bold leading-tight">
                        Join KREANOVA
                    </Text>
                    <Text className="text-[#ccbc8e] text-base font-normal leading-normal pt-2">
                        Create a parent account to monitor your child's growth.
                    </Text>
                </View>

                {/* Form Fields */}
                <View className="px-4 gap-4 pb-4">
                    {/* Full Name */}
                    <View className="gap-2">
                        <Text className="text-white text-sm font-medium">Full Name</Text>
                        <View className="relative">
                            <TextInput
                                className="w-full rounded-xl border border-[#6a5a2f] bg-[#352d18] h-14 px-4 pr-12 text-base text-white"
                                placeholder="Enter your full name"
                                placeholderTextColor="#ccbc8e80"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                            <View className="absolute right-4 top-0 bottom-0 justify-center">
                                <MaterialIcons name="person" size={20} color="#ccbc8e" />
                            </View>
                        </View>
                    </View>

                    {/* Email Address */}
                    <View className="gap-2">
                        <Text className="text-white text-sm font-medium">Email Address</Text>
                        <View className="relative">
                            <TextInput
                                className="w-full rounded-xl border border-[#6a5a2f] bg-[#352d18] h-14 px-4 pr-12 text-base text-white"
                                placeholder="Enter your email"
                                placeholderTextColor="#ccbc8e80"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <View className="absolute right-4 top-0 bottom-0 justify-center">
                                <MaterialIcons name="mail" size={20} color="#ccbc8e" />
                            </View>
                        </View>
                    </View>

                    {/* Password */}
                    <View className="gap-2">
                        <Text className="text-white text-sm font-medium">Password</Text>
                        <View className="relative">
                            <TextInput
                                className="w-full rounded-xl border border-[#6a5a2f] bg-[#352d18] h-14 px-4 pr-12 text-base text-white"
                                placeholder="Create a password"
                                placeholderTextColor="#ccbc8e80"
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
                                    color="#ccbc8e"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password */}
                    <View className="gap-2">
                        <Text className="text-white text-sm font-medium">Confirm Password</Text>
                        <View className="relative">
                            <TextInput
                                className="w-full rounded-xl border border-[#6a5a2f] bg-[#352d18] h-14 px-4 pr-12 text-base text-white"
                                placeholder="Confirm your password"
                                placeholderTextColor="#ccbc8e80"
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
                                    color="#ccbc8e"
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
                        <View className={`w-5 h-5 border-2 rounded-md items-center justify-center ${termsAccepted ? 'bg-primary border-primary' : 'border-[#6a5a2f] bg-[#352d18]'}`}>
                            {termsAccepted && <MaterialIcons name="check" size={14} color="#231e0f" />}
                        </View>
                        <View className="flex-1">
                            <Text className="text-white text-sm font-medium">
                                I agree to the Terms & Conditions
                            </Text>
                            <Text className="text-[#ccbc8e] text-xs">
                                Your data is secure with us.
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Sign Up Button */}
                <View className="px-4 pb-4">
                    <TouchableOpacity
                        onPress={handleRegister}
                        className="w-full h-12 rounded-xl bg-primary items-center justify-center shadow-md active:scale-[0.98]"
                    >
                        <Text className="text-background-dark text-base font-bold tracking-tight">
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View className="px-4 py-2 flex-row items-center gap-4">
                    <View className="flex-1 h-px bg-[#352d18]" />
                    <Text className="text-[#ccbc8e] text-sm">Or sign up with</Text>
                    <View className="flex-1 h-px bg-[#352d18]" />
                </View>

                {/* Social Buttons */}
                <View className="px-4 py-4 flex-row gap-4">
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-3 rounded-xl border border-[#352d18] bg-[#2b2515] p-3">
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDTgev5KwxHCQIbyWTSUhNR_W6pnOWynZaIXnS5KLyOtnMc-Ti5M9Oe1WuXld-ZubbAYiuJIhndEoB2HAFkp-2bhgLU8VS8G6i0uOfwTN4Pv1BLKA9Z9VvFRJBjncIOP0v49x0NUvr0182arVQjLSceVHT051-zBWM_PiMGCCaqXoasvJJWhPvyOELo7Ho1OC_wHadoOGd93An3ZJQNk2wQsf_yOYGrTxJBtWjpFmOF5YCWNdpa4jCW0d_J_H_4TyOm3mE28GeXdM" }}
                            className="w-5 h-5"
                            contentFit="contain"
                        />
                        <Text className="text-sm font-medium text-white">Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-3 rounded-xl border border-[#352d18] bg-[#2b2515] p-3">
                        <MaterialIcons name="apple" size={20} color="#fff" />
                        <Text className="text-sm font-medium text-white">Apple</Text>
                    </TouchableOpacity>
                </View>

                {/* Spacer */}
                <View className="flex-1" />

                {/* Login Link */}
                <View className="items-center px-4 py-6">
                    <Text className="text-[#ccbc8e] text-sm font-normal">
                        Already have an account?{' '}
                        <Text
                            onPress={() => router.push('/auth/login')}
                            className="text-primary font-bold"
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
