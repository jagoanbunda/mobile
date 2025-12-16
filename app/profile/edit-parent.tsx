import Colors from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditParentScreen() {
    const { themeMode, setThemeMode, colors } = useTheme();
    const [fullName, setFullName] = useState('Sarah Anderson');
    const [email, setEmail] = useState('sarah@example.com');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(false);

    const handleSave = () => {
        // Logic to save parent profile changes
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-background-dark pt-12">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center justify-between p-4 bg-background-dark/95">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back-ios-new" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-white tracking-tight">Edit Profile</Text>
                <TouchableOpacity className="w-10 h-10 items-center justify-center">
                    <MaterialIcons name="more-vert" size={24} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Title */}
                <View className="items-center mt-4 mb-8">
                    <Text className="text-2xl font-bold text-white mb-2 text-center">Your Account</Text>
                    <Text className="text-white/60 text-base text-center">Update your personal details and settings.</Text>
                </View>

                {/* Avatar */}
                <View className="items-center mb-8">
                    <TouchableOpacity className="relative">
                        <View className="w-28 h-28 rounded-full bg-white/5 border-2 border-dashed border-white/20 items-center justify-center overflow-hidden">
                            <MaterialIcons name="person" size={48} color="rgba(255,255,255,0.2)" />
                        </View>
                        <View className="absolute bottom-0 right-0 bg-primary w-9 h-9 rounded-full items-center justify-center shadow-lg border-2 border-background-dark">
                            <MaterialIcons name="edit" size={18} color={Colors.textInverted} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Account Form */}
                <View className="gap-4">
                    {/* Full Name */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-white/80 ml-1">Full Name</Text>
                        <View className="relative">
                            <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                                <MaterialIcons name="badge" size={20} color="rgba(255,255,255,0.4)" />
                            </View>
                            <TextInput
                                className="w-full bg-[#2d2616] rounded-xl pl-11 pr-4 py-3.5 text-white"
                                placeholder="Your Name"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-white/80 ml-1">Email Address</Text>
                        <View className="relative">
                            <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                                <MaterialIcons name="mail" size={20} color="rgba(255,255,255,0.4)" />
                            </View>
                            <TextInput
                                className="w-full bg-[#2d2616] rounded-xl pl-11 pr-4 py-3.5 text-white"
                                placeholder="email@example.com"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>
                </View>

                {/* Security Section */}
                <View className="mt-6">
                    <Text className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4 ml-1">Security</Text>
                    <View className="gap-4">
                        {/* New Password */}
                        <View className="gap-2">
                            <Text className="text-sm font-semibold text-white/80 ml-1">New Password</Text>
                            <View className="relative">
                                <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                                    <MaterialIcons name="lock" size={20} color="rgba(255,255,255,0.4)" />
                                </View>
                                <TextInput
                                    className="w-full bg-[#2d2616] rounded-xl pl-11 pr-12 py-3.5 text-white"
                                    placeholder="••••••••"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    secureTextEntry={!passwordVisible}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute right-4 top-0 bottom-0 justify-center"
                                >
                                    <MaterialIcons
                                        name={passwordVisible ? "visibility" : "visibility-off"}
                                        size={20}
                                        color="rgba(255,255,255,0.4)"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View className="gap-2">
                            <Text className="text-sm font-semibold text-white/80 ml-1">Confirm Password</Text>
                            <View className="relative">
                                <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                                    <MaterialIcons name="lock-reset" size={20} color="rgba(255,255,255,0.4)" />
                                </View>
                                <TextInput
                                    className="w-full bg-[#2d2616] rounded-xl pl-11 pr-4 py-3.5 text-white"
                                    placeholder="••••••••"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    secureTextEntry={!passwordVisible}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Preferences Section */}
                <View className="mt-6">
                    <Text className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4 ml-1">Preferences</Text>
                    <View className="gap-3">
                        {/* Push Notifications */}
                        <View className="flex-row items-center justify-between p-4 bg-[#2d2616] rounded-xl border border-white/5">
                            <View>
                                <View className="flex-row items-center gap-2">
                                    <MaterialIcons name="notifications" size={18} color={Colors.primary} />
                                    <Text className="text-sm font-bold text-white">Push Notifications</Text>
                                </View>
                                <Text className="text-xs text-white/50 mt-0.5">Alerts for milestones & tips</Text>
                            </View>
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                                trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#F5AFAF' }}
                                thumbColor="#fff"
                            />
                        </View>

                        {/* Weekly Report */}
                        <View className="flex-row items-center justify-between p-4 bg-[#2d2616] rounded-xl border border-white/5">
                            <View>
                                <View className="flex-row items-center gap-2">
                                    <MaterialIcons name="mark-email-unread" size={18} color={Colors.primary} />
                                    <Text className="text-sm font-bold text-white">Weekly Report</Text>
                                </View>
                                <Text className="text-xs text-white/50 mt-0.5">Receive growth summary via email</Text>
                            </View>
                            <Switch
                                value={weeklyReport}
                                onValueChange={setWeeklyReport}
                                trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#F5AFAF' }}
                                thumbColor="#fff"
                            />
                        </View>
                    </View>
                </View>

                {/* Appearance Section */}
                <View className="mt-6">
                    <Text className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4 ml-1">Appearance</Text>
                    <View className="gap-3">
                        {/* Theme Selector */}
                        <View className="p-4 bg-[#2d2616] rounded-xl border border-white/5">
                            <View className="flex-row items-center gap-2 mb-3">
                                <MaterialIcons name="palette" size={18} color={Colors.primary} />
                                <Text className="text-sm font-bold text-white">Theme Mode</Text>
                            </View>
                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    onPress={() => setThemeMode('light')}
                                    className={`flex-1 py-3 px-4 rounded-lg flex-row items-center justify-center gap-2 ${themeMode === 'light' ? 'bg-primary' : 'bg-white/5'}`}
                                >
                                    <MaterialIcons
                                        name="light-mode"
                                        size={18}
                                        color={themeMode === 'light' ? Colors.textInverted : 'rgba(255,255,255,0.6)'}
                                    />
                                    <Text className={`text-sm font-bold ${themeMode === 'light' ? 'text-background-dark' : 'text-white/60'}`}>
                                        Light
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setThemeMode('dark')}
                                    className={`flex-1 py-3 px-4 rounded-lg flex-row items-center justify-center gap-2 ${themeMode === 'dark' ? 'bg-primary' : 'bg-white/5'}`}
                                >
                                    <MaterialIcons
                                        name="dark-mode"
                                        size={18}
                                        color={themeMode === 'dark' ? Colors.textInverted : 'rgba(255,255,255,0.6)'}
                                    />
                                    <Text className={`text-sm font-bold ${themeMode === 'dark' ? 'text-background-dark' : 'text-white/60'}`}>
                                        Dark
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setThemeMode('system')}
                                    className={`flex-1 py-3 px-4 rounded-lg flex-row items-center justify-center gap-2 ${themeMode === 'system' ? 'bg-primary' : 'bg-white/5'}`}
                                >
                                    <MaterialIcons
                                        name="settings-brightness"
                                        size={18}
                                        color={themeMode === 'system' ? Colors.textInverted : 'rgba(255,255,255,0.6)'}
                                    />
                                    <Text className={`text-sm font-bold ${themeMode === 'system' ? 'text-background-dark' : 'text-white/60'}`}>
                                        Auto
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-background-dark/80 border-t border-white/5">
                <TouchableOpacity
                    onPress={handleSave}
                    className="w-full bg-primary py-4 rounded-xl shadow-lg flex-row items-center justify-center gap-2 active:scale-[0.98]"
                >
                    <Text className="text-background-dark font-bold text-lg">Save Changes</Text>
                    <MaterialIcons name="check" size={20} color={Colors.textInverted} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
