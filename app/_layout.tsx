// Load Reactotron in development for API debugging
if (__DEV__) {
  require('@/config/reactotron');
}

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { queryClient } from '@/config/query-client';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Keep the splash screen visible while we check auth state
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { isDark } = useTheme();
  const { isLoading, isAuthenticated } = useAuth();

  // Hide splash screen when auth state is determined
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Keep showing splash screen while loading auth state
  if (isLoading) {
    return null;
  }

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Protected screens - only available when authenticated
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="index" />
            <Stack.Screen
              name="modal"
              options={{ presentation: 'modal', title: 'Modal' }}
            />
            <Stack.Screen name="profile/add-child" />
            <Stack.Screen name="profile/edit-child" />
            <Stack.Screen name="profile/edit-parent" />
            <Stack.Screen name="anthropometry/input" />
            <Stack.Screen name="anthropometry/growth-chart" />
            <Stack.Screen name="screening/questionnaire" />
            <Stack.Screen name="screening/result" />
            <Stack.Screen name="pmt/report" />
            <Stack.Screen name="pmt/history" />
            <Stack.Screen name="anthropometry/history" />
            <Stack.Screen name="notifications/index" />
            <Stack.Screen name="food-logs/index" />
            <Stack.Screen name="food-logs/[id]" />
            <Stack.Screen name="food-logs/edit/[id]" />
            <Stack.Screen name="nutrition/index" />
          </>
        ) : (
          // Auth screens - only available when NOT authenticated
          <>
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
          </>
        )}
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <RootLayoutContent />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
