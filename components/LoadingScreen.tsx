import React from 'react';
import { ActivityIndicator, View, Text, SafeAreaView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface LoadingScreenProps {
    message?: string;
}

/**
 * Full-screen loading indicator
 */
export function LoadingScreen({ message = 'Memuat...' }: LoadingScreenProps) {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 48 }}>
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.onSurfaceVariant }} className="mt-4 text-sm">
                    {message}
                </Text>
            </View>
        </SafeAreaView>
    );
}

export default LoadingScreen;
