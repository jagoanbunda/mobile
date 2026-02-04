import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useMemo } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useActiveChild, useChild } from '@/services/hooks/use-children';
import { useAsq3Questions, useCreateScreening, useSubmitAnswers, useInProgressScreening } from '@/services/hooks/use-screenings';
import { NetworkErrorView } from '@/components/NetworkErrorView';
import { AnswerValue, Asq3Question, ScreeningAnswerInput } from '@/types';

export default function QuestionnaireScreen() {
    const { colors } = useTheme();
    
    // Route params
    const params = useLocalSearchParams<{ 
        screeningId?: string; 
        childId?: string; 
        ageIntervalId?: string; 
    }>();
    const screeningIdParam = params.screeningId ? parseInt(params.screeningId) : undefined;
    const childIdParam = params.childId ? parseInt(params.childId) : 0;
    const ageIntervalIdParam = params.ageIntervalId ? parseInt(params.ageIntervalId) : 0;
    
    // Get child data - use childIdParam OR fallback to activeChild
    const { data: activeChild } = useActiveChild();
    const childId = childIdParam || activeChild?.id || 0;
    const { data: childData } = useChild(childId);
    
    // Check for in-progress screening first
    const { data: inProgressScreening, isLoading: isLoadingInProgress } = useInProgressScreening(childId);
    
    // Mutation to create new screening
    const createScreeningMutation = useCreateScreening(childId);
    
    // Track current screening ID (from param, in-progress, or newly created)
    const [currentScreeningId, setCurrentScreeningId] = useState<number | undefined>(screeningIdParam);
    const [currentAgeIntervalId, setCurrentAgeIntervalId] = useState<number>(ageIntervalIdParam);
    
    // Effect to handle screening setup
    useEffect(() => {
        // If we have a screeningId from params, use it
        if (screeningIdParam) {
            setCurrentScreeningId(screeningIdParam);
            return;
        }
        
        // If there's an in-progress screening, use that
        if (inProgressScreening && !isLoadingInProgress) {
            setCurrentScreeningId(inProgressScreening.id);
            setCurrentAgeIntervalId(inProgressScreening.age_interval.id);
            return;
        }
        
        // Otherwise, create a new screening when childId is valid
        if (childId > 0 && !isLoadingInProgress && !inProgressScreening && !currentScreeningId && !createScreeningMutation.isPending) {
            createScreeningMutation.mutate(undefined, {
                onSuccess: (screening) => {
                    setCurrentScreeningId(screening.id);
                    setCurrentAgeIntervalId(screening.age_interval.id);
                },
                onError: (error) => {
                    console.error('Failed to create screening:', error);
                }
            });
        }
    }, [childId, isLoadingInProgress, inProgressScreening, screeningIdParam, currentScreeningId]);
    
    // Load questions from API
    const { 
        data: questionsData, 
        isLoading: isLoadingQuestions, 
        isError: isQuestionsError, 
        error: questionsError,
        refetch: refetchQuestions 
    } = useAsq3Questions(currentAgeIntervalId);
    
    // Flatten questions from all domains into single ordered array
    const allQuestions = useMemo(() => {
        if (!questionsData?.questions_by_domain) return [];
        
        const questions: Asq3Question[] = [];
        // Sort domains by their order (communication, gross_motor, fine_motor, problem_solving, personal_social)
        const domainOrder = ['communication', 'gross_motor', 'fine_motor', 'problem_solving', 'personal_social'];
        
        for (const domainCode of domainOrder) {
            const domainQuestions = questionsData.questions_by_domain[domainCode] || [];
            questions.push(...domainQuestions.sort((a, b) => a.display_order - b.display_order));
        }
        
        return questions;
    }, [questionsData]);
    
    // Answer state
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, 'YA' | 'KADANG' | 'TIDAK'>>({});
    
    // Map UI answer to API value
    const mapAnswerToApi = (uiAnswer: 'YA' | 'KADANG' | 'TIDAK'): AnswerValue => {
        switch (uiAnswer) {
            case 'YA': return 'yes';
            case 'KADANG': return 'sometimes';
            case 'TIDAK': return 'no';
        }
    };
    
    // Submit answers mutation
    const submitAnswersMutation = useSubmitAnswers(childId, currentScreeningId || 0);
    
    const handleAnswer = (answer: 'YA' | 'KADANG' | 'TIDAK') => {
        const question = allQuestions[currentQuestion];
        if (question) {
            setAnswers({ ...answers, [question.id]: answer });
        }
    };

    const handleNext = () => {
        const question = allQuestions[currentQuestion];
        const selectedAnswer = question ? answers[question.id] : undefined;
        
        if (!selectedAnswer || !question) return;
        
        // Submit this answer to API
        const answerInput: ScreeningAnswerInput = {
            question_id: question.id,
            answer: mapAnswerToApi(selectedAnswer),
        };
        
        submitAnswersMutation.mutate({ answers: [answerInput] }, {
            onSuccess: () => {
                if (currentQuestion < allQuestions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                } else {
                    // All questions answered, navigate to results
                    router.replace({
                        pathname: '/screening/result',
                        params: { 
                            screeningId: currentScreeningId?.toString() || '', 
                            childId: childId.toString() 
                        }
                    });
                }
            },
            onError: (error) => {
                console.error('Failed to submit answer:', error);
            }
        });
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };
    
    // Loading state
    const isLoading = isLoadingInProgress || isLoadingQuestions || createScreeningMutation.isPending || !currentScreeningId;
    
    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ color: colors.onSurfaceVariant }} className="mt-4 text-sm">
                        {createScreeningMutation.isPending ? 'Membuat sesi screening...' : 'Memuat pertanyaan...'}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }
    
    // Error state
    const isError = isQuestionsError || createScreeningMutation.isError;
    const error = questionsError || createScreeningMutation.error;
    
    if (isError) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 p-4">
                    <NetworkErrorView 
                        error={error} 
                        onRetry={() => {
                            if (createScreeningMutation.isError) {
                                createScreeningMutation.reset();
                                // Will auto-retry via useEffect
                            } else {
                                refetchQuestions();
                            }
                        }} 
                    />
                </View>
            </SafeAreaView>
        );
    }
    
    // Safety check for questions
    const question = allQuestions[currentQuestion];
    if (!question) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 items-center justify-center p-4">
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-center">
                        Tidak ada pertanyaan tersedia.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }
    
    const selectedAnswer = answers[question.id];
    const progress = ((currentQuestion + 1) / allQuestions.length) * 100;

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
                    <Image source={{ uri: childData?.avatar_url ?? 'https://via.placeholder.com/100' }} className="w-14 h-14 rounded-full" contentFit="cover" />
                    <View className="flex-1 gap-1">
                        <Text style={{ color: colors.onSurface }} className="text-lg font-bold leading-tight">{childData?.name ?? ''}</Text>
                        <View className="flex-row flex-wrap gap-x-4 gap-y-1">
                            <View className="flex-row items-center gap-1">
                                <MaterialIcons name="cake" size={14} color={colors.onSurfaceVariant} />
                                <Text style={{ color: colors.onSurfaceVariant }} className="text-sm">{childData?.age?.label ?? ''}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <MaterialIcons name="track-changes" size={14} color={colors.primary} />
                                <Text style={{ color: colors.primary }} className="text-sm font-bold">Screening: {questionsData?.age_interval?.age_label ?? ''}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Progress Bar */}
                <View className="gap-2 mb-4">
                    <View className="flex-row justify-between items-end">
                        <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium">Progress</Text>
                        <Text style={{ color: colors.onSurface }} className="text-sm font-bold">Pertanyaan {currentQuestion + 1} dari {allQuestions.length}</Text>
                    </View>
                    <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="h-3 w-full rounded-full overflow-hidden">
                        <View style={{ backgroundColor: colors.primary, width: `${progress}%` }} className="h-3 rounded-full" />
                    </View>
                </View>

                {/* Question Card */}
                <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-2xl overflow-hidden mb-4">
                    <View className="p-5 gap-3">
                        <View style={{ backgroundColor: question.domain.color }} className="self-start px-3 py-1.5 rounded-full mb-2">
                            <Text className="text-xs font-bold text-white uppercase tracking-wider">{question.domain.name}</Text>
                        </View>
                        <Text style={{ color: colors.onSurface }} className="text-xl font-bold leading-snug tracking-tight">
                            {question.question_text}
                        </Text>
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
                        disabled={!selectedAnswer || submitAnswersMutation.isPending}
                        style={{ 
                            backgroundColor: selectedAnswer && !submitAnswersMutation.isPending ? colors.primary : colors.surfaceContainerHigh, 
                            opacity: selectedAnswer && !submitAnswersMutation.isPending ? 1 : 0.5 
                        }}
                        className="flex-1 flex-row items-center justify-center gap-1 px-6 py-3 rounded-xl"
                    >
                        {submitAnswersMutation.isPending ? (
                            <ActivityIndicator size="small" color={colors.onPrimary} />
                        ) : (
                            <>
                                <Text style={{ color: selectedAnswer ? colors.onPrimary : colors.onSurfaceVariant }} className="text-sm font-bold">
                                    {currentQuestion === allQuestions.length - 1 ? 'Selesai' : 'Next'}
                                </Text>
                                <MaterialIcons name="chevron-right" size={20} color={selectedAnswer ? colors.onPrimary : colors.onSurfaceVariant} />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
