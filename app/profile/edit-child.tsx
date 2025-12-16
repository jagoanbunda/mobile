import Colors from '@/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditChildScreen() {
    const [childName, setChildName] = useState('Leo Anderson');
    const [dateOfBirth, setDateOfBirth] = useState('2021-08-15');
    const [gender, setGender] = useState<'male' | 'female'>('male');

    const handleSave = () => {
        // Logic to save child profile changes
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
                <Text className="text-lg font-bold text-white tracking-tight">Edit Child Profile</Text>
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
                    <Text className="text-2xl font-bold text-white mb-2 text-center">Child's Profile</Text>
                    <Text className="text-white/60 text-base text-center">Update your child's personal details.</Text>
                </View>

                {/* Avatar */}
                <View className="items-center mb-10">
                    <TouchableOpacity className="relative">
                        <View className="w-32 h-32 rounded-full bg-primary/5 border-2 border-dashed border-primary/30 items-center justify-center overflow-hidden">
                            <MaterialIcons name="child-care" size={56} color="rgba(250,198,56,0.8)" />
                        </View>
                        <View className="absolute bottom-1 right-1 bg-primary w-10 h-10 rounded-full items-center justify-center shadow-lg border-4 border-background-dark">
                            <MaterialIcons name="camera-alt" size={20} color={Colors.backgroundDark} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <View className="gap-6">
                    {/* Child's Full Name */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-white/80 ml-1">Child's Full Name</Text>
                        <View className="relative">
                            <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                                <MaterialIcons name="face" size={20} color="rgba(255,255,255,0.4)" />
                            </View>
                            <TextInput
                                className="w-full bg-[#2d2616] rounded-xl pl-11 pr-4 py-3.5 text-white"
                                placeholder="Child's Name"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={childName}
                                onChangeText={setChildName}
                            />
                        </View>
                    </View>

                    {/* Date of Birth */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-white/80 ml-1">Date of Birth</Text>
                        <View className="relative">
                            <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                                <MaterialIcons name="cake" size={20} color="rgba(255,255,255,0.4)" />
                            </View>
                            <TextInput
                                className="w-full bg-[#2d2616] rounded-xl pl-11 pr-4 py-3.5 text-white"
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={dateOfBirth}
                                onChangeText={setDateOfBirth}
                            />
                        </View>
                    </View>

                    {/* Gender */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-white/80 ml-1">Gender</Text>
                        <View className="flex-row gap-3 p-1 bg-white/5 rounded-xl">
                            <TouchableOpacity
                                onPress={() => setGender('male')}
                                className={`flex-1 py-3 rounded-lg items-center justify-center flex-row gap-2 ${gender === 'male' ? 'bg-primary' : ''}`}
                            >
                                <MaterialIcons name="male" size={18} color={gender === 'male' ? '#2d1f1f' : 'rgba(255,255,255,0.6)'} />
                                <Text className={`text-sm font-bold ${gender === 'male' ? 'text-background-dark' : 'text-white/60'}`}>
                                    Male
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setGender('female')}
                                className={`flex-1 py-3 rounded-lg items-center justify-center flex-row gap-2 ${gender === 'female' ? 'bg-primary' : ''}`}
                            >
                                <MaterialIcons name="female" size={18} color={gender === 'female' ? '#2d1f1f' : 'rgba(255,255,255,0.6)'} />
                                <Text className={`text-sm font-bold ${gender === 'female' ? 'text-background-dark' : 'text-white/60'}`}>
                                    Female
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Info Card */}
                    <View className="flex-row gap-3 p-4 bg-primary/10 rounded-xl border border-primary/20 mt-4">
                        <MaterialIcons name="info" size={20} color={Colors.primary} />
                        <Text className="flex-1 text-sm text-white/70 leading-relaxed">
                            Accurate information helps us provide better growth insights and personalized recommendations for{' '}
                            <Text className="font-bold text-primary">{childName.split(' ')[0]}</Text>.
                        </Text>
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
                    <MaterialIcons name="check" size={20} color={Colors.backgroundDark} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
