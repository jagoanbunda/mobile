import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Mock questions data
const questions = [
    {
        id: 1,
        domain: 'Komunikasi',
        domainColor: '#2563EB',
        question: 'Apakah anak bisa menyebutkan minimal 2 kata untuk meminta sesuatu?',
        hint: 'Contoh: "mau minum", "minta susu"',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFkUwnVOKng70MVTlwF8hf3SvINi_pPhf1p6DNVolH9owd3qpsN8LlgOUPUQ_mZwdEq8OuQxloE8z_cDvM3meZq1lVu8JVUhjTA5D7acYpjbhIs-ilLL5vHOw5XnoiJIjV-41j12gZbC7U55hgeQVarxUuZQW3ScsZF1BQDtEurqkxp-8-dMqh9dKVSWcBEbhiVLida-4Us7JaUk18ubFdf_q1fZXHNcRgVoWb1Xb_XNHSRs1P-shFSAKmCTb539fGAOa4N7F9umI',
    },
    {
        id: 2,
        domain: 'Motorik Halus',
        domainColor: '#9333EA',
        question: 'Apakah anak bisa menyusun 3 balok ke atas tanpa jatuh?',
        hint: 'Amati gerakan anak dengan seksama. Jangan bantu menyusun balok.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFkUwnVOKng70MVTlwF8hf3SvINi_pPhf1p6DNVolH9owd3qpsN8LlgOUPUQ_mZwdEq8OuQxloE8z_cDvM3meZq1lVu8JVUhjTA5D7acYpjbhIs-ilLL5vHOw5XnoiJIjV-41j12gZbC7U55hgeQVarxUuZQW3ScsZF1BQDtEurqkxp-8-dMqh9dKVSWcBEbhiVLida-4Us7JaUk18ubFdf_q1fZXHNcRgVoWb1Xb_XNHSRs1P-shFSAKmCTb539fGAOa4N7F9umI',
    },
    {
        id: 3,
        domain: 'Motorik Kasar',
        domainColor: '#EA580C',
        question: 'Apakah anak bisa berjalan mundur minimal 3 langkah?',
        hint: 'Minta anak berjalan mundur tanpa berpegangan.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFkUwnVOKng70MVTlwF8hf3SvINi_pPhf1p6DNVolH9owd3qpsN8LlgOUPUQ_mZwdEq8OuQxloE8z_cDvM3meZq1lVu8JVUhjTA5D7acYpjbhIs-ilLL5vHOw5XnoiJIjV-41j12gZbC7U55hgeQVarxUuZQW3ScsZF1BQDtEurqkxp-8-dMqh9dKVSWcBEbhiVLida-4Us7JaUk18ubFdf_q1fZXHNcRgVoWb1Xb_XNHSRs1P-shFSAKmCTb539fGAOa4N7F9umI',
    },
];

const childData = {
    name: 'Ananda Rizky',
    age: '24 Bulan',
    screeningAge: '24 Bulan',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMlymQ-A11UJdpVD6FzTQKd6nqjXVju5ztuJFHzyarGVtjPyz0BQXEK-RCGbMRVbN-LzFpO-PE0BISafrXDinVM2kXNB5QOjjV0j8oQQ6AXgtqmmgO_FHkyOO5ISfqh2zu46eaG7fKp2PF994MC3RwsNgQL583wBshfBBABlXuy8z5ARrCKAcSFUnY6Dwsd7wuRWnjja58_-BodVGsqKhcHunPFYjkiXK6JgWZ7a65cGGnCXDXHv5RjXQq9dpcI_nm-DwUUfjQUgo',
};

export default function QuestionnaireScreen() {
    const { colors } = useTheme();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const question = questions[currentQuestion];
    const selectedAnswer = answers[question.id];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const handleAnswer = (answer: string) => {
        setAnswers({ ...answers, [question.id]: answer });
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            router.push('/screening/result');
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ backgroundColor: colors.surface }} className="flex-row items-center justify-between px-4 py-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ backgroundColor: colors.surfaceContainerHigh }}
                    className="w-10 h-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
                </TouchableOpacity>
                <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight flex-1 text-center">ASQ-3 Screening</Text>
                <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center gap-1 px-3 py-2 rounded-full">
                    <MaterialIcons name="print" size={18} color={colors.primary} />
                    <Text style={{ color: colors.primary }} className="text-sm font-bold">Cetak</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Child Profile */}
                <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center gap-4 rounded-2xl p-4 mb-4">
                    <Image source={{ uri: childData.photo }} className="w-14 h-14 rounded-full" contentFit="cover" />
                    <View className="flex-1 gap-1">
                        <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight">{childData.name}</Text>
                        <View className="flex-row flex-wrap gap-x-4 gap-y-1">
                            <View className="flex-row items-center gap-1">
                                <MaterialIcons name="cake" size={14} color={colors.onSurfaceVariant} />
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">{childData.age}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <MaterialIcons name="track-changes" size={14} color={colors.primary} />
                                <Text style={{ color: colors.primary }} className="text-sm font-bold">Screening: {childData.screeningAge}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Progress Bar */}
                <View className="gap-2 mb-4">
                    <View className="flex-row justify-between items-end">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium">Progress</Text>
                        <Text style={{ color: colors.onSurface }} className="text-sm font-bold">Pertanyaan {currentQuestion + 1} dari {questions.length}</Text>
                    </View>
                    <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="h-3 w-full rounded-full overflow-hidden">
                        <View style={{ backgroundColor: colors.primary, width: `${progress}%` }} className="h-3 rounded-full" />
                    </View>
                </View>

                {/* Question Card */}
                <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-2xl overflow-hidden mb-4">
                    <View className="relative w-full aspect-[4/3]">
                        <Image source={{ uri: question.image }} className="w-full h-full" contentFit="cover" />
                        <View className="absolute top-4 left-4">
                            <View style={{ backgroundColor: question.domainColor }} className="px-3 py-1.5 rounded-full">
                                <Text className="text-xs font-bold text-white uppercase tracking-wider">{question.domain}</Text>
                            </View>
                        </View>
                    </View>
                    <View className="p-5 gap-3">
                        <Text style={{ color: colors.onSurface }} className="text-xl font-bold leading-snug tracking-tight">
                            {question.question}
                        </Text>
                        <View className="flex-row items-start gap-2">
                            <MaterialIcons name="info-outline" size={18} color={colors.onSurfaceVariant} />
                            <Text style={{ color: colors.onSurfaceVariant }} className="text-sm italic leading-relaxed flex-1">
                                {question.hint}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Answer Buttons */}
                <View className="gap-3">
                    <TouchableOpacity
                        onPress={() => handleAnswer('YA')}
                        style={{
                            backgroundColor: selectedAnswer === 'YA' ? colors.primaryContainer : colors.surfaceContainerHigh,
                            borderColor: selectedAnswer === 'YA' ? colors.primary : colors.surfaceContainerHighest,
                            borderWidth: 2,
                        }}
                        className="flex-row items-center gap-4 rounded-xl p-4"
                    >
                        <View style={{ backgroundColor: selectedAnswer === 'YA' ? colors.primary : colors.surfaceContainerHighest }} className="w-10 h-10 items-center justify-center rounded-full">
                            <MaterialIcons name="check" size={24} color={selectedAnswer === 'YA' ? colors.onPrimary : colors.onSurfaceVariant} />
                        </View>
                        <Text style={{ color: selectedAnswer === 'YA' ? colors.primary : colors.onSurface }} className="text-base font-bold flex-1">YA</Text>
                        {selectedAnswer === 'YA' && <View style={{ backgroundColor: colors.primary }} className="w-2.5 h-2.5 rounded-full" />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleAnswer('KADANG')}
                        style={{
                            backgroundColor: selectedAnswer === 'KADANG' ? colors.tertiaryContainer : colors.surfaceContainerHigh,
                            borderColor: selectedAnswer === 'KADANG' ? colors.tertiary : colors.surfaceContainerHighest,
                            borderWidth: 2,
                        }}
                        className="flex-row items-center gap-4 rounded-xl p-4"
                    >
                        <View style={{ backgroundColor: selectedAnswer === 'KADANG' ? colors.tertiary : colors.surfaceContainerHighest }} className="w-10 h-10 items-center justify-center rounded-full">
                            <MaterialIcons name="timelapse" size={24} color={selectedAnswer === 'KADANG' ? colors.onTertiary : colors.onSurfaceVariant} />
                        </View>
                        <Text style={{ color: selectedAnswer === 'KADANG' ? colors.tertiary : colors.onSurface }} className="text-base font-bold flex-1">KADANG-KADANG</Text>
                        {selectedAnswer === 'KADANG' && <View style={{ backgroundColor: colors.tertiary }} className="w-2.5 h-2.5 rounded-full" />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleAnswer('TIDAK')}
                        style={{
                            backgroundColor: selectedAnswer === 'TIDAK' ? colors.errorContainer : colors.surfaceContainerHigh,
                            borderColor: selectedAnswer === 'TIDAK' ? colors.error : colors.surfaceContainerHighest,
                            borderWidth: 2,
                        }}
                        className="flex-row items-center gap-4 rounded-xl p-4"
                    >
                        <View style={{ backgroundColor: selectedAnswer === 'TIDAK' ? colors.error : colors.surfaceContainerHighest }} className="w-10 h-10 items-center justify-center rounded-full">
                            <MaterialIcons name="close" size={24} color={selectedAnswer === 'TIDAK' ? colors.onError : colors.onSurfaceVariant} />
                        </View>
                        <Text style={{ color: selectedAnswer === 'TIDAK' ? colors.error : colors.onSurface }} className="text-base font-bold flex-1">TIDAK</Text>
                        {selectedAnswer === 'TIDAK' && <View style={{ backgroundColor: colors.error }} className="w-2.5 h-2.5 rounded-full" />}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Footer Navigation */}
            <View style={{ backgroundColor: colors.surface }} className="absolute bottom-0 left-0 w-full px-4 pb-8 pt-4">
                <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="flex-row items-center justify-between gap-3 rounded-2xl p-2">
                    <TouchableOpacity
                        onPress={handlePrev}
                        disabled={currentQuestion === 0}
                        style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
                        className="flex-row items-center justify-center gap-1 px-5 py-3 rounded-xl"
                    >
                        <MaterialIcons name="chevron-left" size={20} color={colors.onSurface} />
                        <Text style={{ color: colors.onSurface }} className="text-sm font-bold">Prev</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ backgroundColor: colors.surfaceContainerHigh }} className="w-10 h-10 items-center justify-center rounded-full">
                        <MaterialIcons name="grid-view" size={20} color={colors.onSurfaceVariant} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleNext}
                        disabled={!selectedAnswer}
                        style={{ backgroundColor: selectedAnswer ? colors.primary : colors.surfaceContainerHigh, opacity: selectedAnswer ? 1 : 0.5 }}
                        className="flex-1 flex-row items-center justify-center gap-1 px-6 py-3 rounded-xl"
                    >
                        <Text style={{ color: selectedAnswer ? colors.onPrimary : colors.onSurfaceVariant }} className="text-sm font-bold">
                            {currentQuestion === questions.length - 1 ? 'Selesai' : 'Next'}
                        </Text>
                        <MaterialIcons name="chevron-right" size={20} color={selectedAnswer ? colors.onPrimary : colors.onSurfaceVariant} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
