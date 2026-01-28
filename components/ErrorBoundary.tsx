import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log to error reporting service
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: 48 }}>
                    <View className="flex-1 items-center justify-center px-8">
                        <View className="w-24 h-24 rounded-full bg-red-100 items-center justify-center mb-6">
                            <MaterialIcons name="error-outline" size={48} color="#EF4444" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Terjadi Kesalahan
                        </Text>
                        <Text className="text-base text-gray-500 text-center mb-6">
                            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
                        </Text>
                        {__DEV__ && this.state.error && (
                            <View className="bg-gray-100 rounded-lg p-4 mb-6 w-full">
                                <Text className="text-sm text-gray-700 font-mono">
                                    {this.state.error.message}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity
                            onPress={this.handleRetry}
                            className="bg-blue-500 px-8 py-4 rounded-xl flex-row items-center gap-2"
                        >
                            <MaterialIcons name="refresh" size={24} color="white" />
                            <Text className="font-bold text-base text-white">Coba Lagi</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
