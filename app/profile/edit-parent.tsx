import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useUpdateProfileWithAvatar } from '@/services/hooks/use-auth';
import { getAvatarUrl } from '@/config/env';
import { ImagePickerButton } from '@/components/ImagePickerButton';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditParentScreen() {
    const { colors } = useTheme();
    const { user, refreshUser } = useAuth();
    const { mutate: updateProfile, isPending: isSaving } = useUpdateProfileWithAvatar();

    // Initialize form with user data (convert avatar_url to full URL for display)
    const [fullName, setFullName] = useState(user?.name || '');
    const [email] = useState(user?.email || ''); // Email is read-only
    const [avatarUri, setAvatarUri] = useState<string | null>(getAvatarUrl(user?.avatar_url));
    const [pushNotifications, setPushNotifications] = useState(user?.push_notifications ?? true);
    const [weeklyReport, setWeeklyReport] = useState(user?.weekly_report ?? false);

    // Track the original avatar URL to detect changes
    const originalAvatarUrl = getAvatarUrl(user?.avatar_url);

    const handleSave = () => {
        updateProfile({
            data: {
                name: fullName,
                push_notifications: pushNotifications,
                weekly_report: weeklyReport,
            },
            avatarUri: avatarUri !== originalAvatarUrl ? avatarUri : undefined,
        }, {
            onSuccess: () => {
                refreshUser();
                router.back();
            },
            onError: () => {
                Alert.alert('Error', 'Failed to update profile. Please try again.');
            }
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
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold tracking-tight">Edit Profile</Text>
                <View className="w-10 h-10" />
            </View>

            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Title */}
                <View className="items-center mt-2 mb-6">
                    <Text style={{ color: colors.onSurface }} className="text-2xl font-bold mb-1 text-center">Your Account</Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm text-center">Update your personal details and settings.</Text>
                </View>

                {/* Avatar */}
                <View className="items-center mb-8">
                    <ImagePickerButton
                        value={avatarUri}
                        onSelect={setAvatarUri}
                        onRemove={() => setAvatarUri(null)}
                        shape="circle"
                        size={96}
                        placeholderIcon="person"
                    />
                </View>

                {/* Account Form */}
                <View className="gap-4">
                    {/* Full Name */}
                    <View className="gap-1.5">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium ml-1">Full Name</Text>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center rounded-xl px-4 py-3">
                            <MaterialIcons name="badge" size={20} color={colors.outline} />
                            <TextInput
                                style={{ color: colors.onSurface }}
                                className="flex-1 ml-3 text-base"
                                placeholder="Your Name"
                                placeholderTextColor={colors.outline}
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>
                    </View>

                    {/* Email (Read-only) */}
                    <View className="gap-1.5">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium ml-1">Email Address</Text>
                        <View style={{ backgroundColor: colors.surfaceContainerHigh, opacity: 0.6 }} className="flex-row items-center rounded-xl px-4 py-3">
                            <MaterialIcons name="mail" size={20} color={colors.outline} />
                            <TextInput
                                style={{ color: colors.onSurface }}
                                className="flex-1 ml-3 text-base"
                                placeholder="email@example.com"
                                placeholderTextColor={colors.outline}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                editable={false}
                            />
                        </View>
                    </View>
                </View>

                {/* Preferences Section */}
                <View className="mt-8">
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-bold uppercase tracking-wider mb-3 ml-1">Preferences</Text>
                    <View className="gap-3">
                        {/* Push Notifications */}
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center justify-between p-4 rounded-xl">
                            <View className="flex-row items-center gap-3">
                                <View style={{ backgroundColor: colors.primaryContainer }} className="w-9 h-9 rounded-full items-center justify-center">
                                    <MaterialIcons name="notifications" size={18} color={colors.primary} />
                                </View>
                                <View>
                                    <Text style={{ color: colors.onSurface }} className="text-sm font-semibold">Push Notifications</Text>
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">Alerts for milestones & tips</Text>
                                </View>
                            </View>
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                                trackColor={{ false: colors.surfaceContainerHighest, true: colors.primaryContainer }}
                                thumbColor={pushNotifications ? colors.primary : colors.outline}
                            />
                        </View>

                        {/* Weekly Report */}
                        <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center justify-between p-4 rounded-xl">
                            <View className="flex-row items-center gap-3">
                                <View style={{ backgroundColor: colors.tertiaryContainer }} className="w-9 h-9 rounded-full items-center justify-center">
                                    <MaterialIcons name="mark-email-unread" size={18} color={colors.tertiary} />
                                </View>
                                <View>
                                    <Text style={{ color: colors.onSurface }} className="text-sm font-semibold">Weekly Report</Text>
                                    <Text style={{ color: colors.onSurfaceVariant }} className="text-xs">Receive growth summary via email</Text>
                                </View>
                            </View>
                            <Switch
                                value={weeklyReport}
                                onValueChange={setWeeklyReport}
                                trackColor={{ false: colors.surfaceContainerHighest, true: colors.tertiaryContainer }}
                                thumbColor={weeklyReport ? colors.tertiary : colors.outline}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={{ backgroundColor: colors.surface }} className="absolute bottom-0 left-0 right-0 p-4 pb-8">
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isSaving}
                    style={{ backgroundColor: isSaving ? colors.surfaceContainerHigh : colors.primary }}
                    className="w-full py-4 rounded-xl flex-row items-center justify-center gap-2"
                >
                    {isSaving ? (
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
