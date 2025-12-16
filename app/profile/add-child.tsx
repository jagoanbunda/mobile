import Colors from '@/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddChildScreen() {
    const [babyName, setBabyName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState<'boy' | 'girl'>('boy');
    const [birthWeight, setBirthWeight] = useState('');
    const [birthHeight, setBirthHeight] = useState('');

    const handleSave = () => {
        // Logic to save child profile
        router.replace('/(tabs)');
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
                <Text className="text-lg font-bold text-white tracking-tight">Add Baby Profile</Text>
                <View className="w-10" />
            </View>

            {/* Progress Indicator */}
            <View className="w-full flex-row justify-center py-2">
                <View className="flex-row items-center gap-3">
                    <View className="h-2 w-2 rounded-full bg-primary/40" />
                    <View className="h-2 w-8 rounded-full bg-primary" />
                    <View className="h-2 w-2 rounded-full bg-primary/40" />
                </View>
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Headline */}
                <View className="items-center mt-4 mb-8">
                    <Text className="text-2xl font-bold text-white mb-2 text-center">
                        Tell us about your little one
                    </Text>
                    <Text className="text-white/60 text-base text-center">
                        We'll use this to track their growth milestones.
                    </Text>
                </View>

                {/* Avatar Uploader */}
                <View className="items-center mb-8">
                    <TouchableOpacity className="relative">
                        <View className="w-28 h-28 rounded-full bg-white/5 border-2 border-dashed border-white/20 items-center justify-center overflow-hidden">
                            <MaterialIcons name="face" size={48} color="rgba(255,255,255,0.2)" />
                        </View>
                        <View className="absolute bottom-0 right-0 bg-primary w-9 h-9 rounded-full items-center justify-center shadow-lg border-2 border-background-dark">
                            <MaterialIcons name="add-a-photo" size={18} color={Colors.textInverted} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View className="gap-6">
                    {/* Baby's Name */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-white/80 ml-1">Baby's Name</Text>
                        <TextInput
                            className="w-full bg-[#2d2616] rounded-xl px-4 py-3.5 text-white"
                            placeholder="e.g. Noah Anderson"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={babyName}
                            onChangeText={setBabyName}
                        />
                    </View>

                    {/* Date of Birth */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-white/80 ml-1">Date of Birth</Text>
                        <TextInput
                            className="w-full bg-[#2d2616] rounded-xl px-4 py-3.5 text-white"
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={dateOfBirth}
                            onChangeText={setDateOfBirth}
                            keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
                        />
                    </View>

                    {/* Gender Selector */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-white/80 ml-1">Gender</Text>
                        <View className="flex-row gap-3 p-1 bg-white/5 rounded-xl">
                            <TouchableOpacity
                                onPress={() => setGender('boy')}
                                className={`flex-1 py-3 rounded-lg items-center justify-center flex-row gap-2 ${gender === 'boy' ? 'bg-primary' : ''}`}
                            >
                                <MaterialIcons name="male" size={18} color={gender === 'boy' ? '#2d1f1f' : 'rgba(255,255,255,0.6)'} />
                                <Text className={`text-sm font-bold ${gender === 'boy' ? 'text-background-dark' : 'text-white/60'}`}>
                                    Boy
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setGender('girl')}
                                className={`flex-1 py-3 rounded-lg items-center justify-center flex-row gap-2 ${gender === 'girl' ? 'bg-primary' : ''}`}
                            >
                                <MaterialIcons name="female" size={18} color={gender === 'girl' ? '#2d1f1f' : 'rgba(255,255,255,0.6)'} />
                                <Text className={`text-sm font-bold ${gender === 'girl' ? 'text-background-dark' : 'text-white/60'}`}>
                                    Girl
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Birth Measurements */}
                    <View className="flex-row gap-4">
                        {/* Birth Weight */}
                        <View className="flex-1 gap-2">
                            <Text className="text-sm font-semibold text-white/80 ml-1">Birth Weight</Text>
                            <View className="relative">
                                <TextInput
                                    className="w-full bg-[#2d2616] rounded-xl pl-4 pr-12 py-3.5 text-white"
                                    placeholder="0.0"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    keyboardType="decimal-pad"
                                    value={birthWeight}
                                    onChangeText={setBirthWeight}
                                />
                                <View className="absolute right-4 top-0 bottom-0 justify-center">
                                    <Text className="text-sm font-medium text-white/40">kg</Text>
                                </View>
                            </View>
                        </View>

                        {/* Birth Height */}
                        <View className="flex-1 gap-2">
                            <Text className="text-sm font-semibold text-white/80 ml-1">Birth Height</Text>
                            <View className="relative">
                                <TextInput
                                    className="w-full bg-[#2d2616] rounded-xl pl-4 pr-12 py-3.5 text-white"
                                    placeholder="0"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    keyboardType="number-pad"
                                    value={birthHeight}
                                    onChangeText={setBirthHeight}
                                />
                                <View className="absolute right-4 top-0 bottom-0 justify-center">
                                    <Text className="text-sm font-medium text-white/40">cm</Text>
                                </View>
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
                    <Text className="text-background-dark font-bold text-lg">Save & Continue</Text>
                    <MaterialIcons name="arrow-forward" size={20} color={Colors.textInverted} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
