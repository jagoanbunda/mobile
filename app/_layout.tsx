import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="profile/add-child" />
        <Stack.Screen name="profile/edit-child" />
        <Stack.Screen name="profile/edit-parent" />
        <Stack.Screen name="anthropometry/input" />
        <Stack.Screen name="anthropometry/growth-chart" />
        <Stack.Screen name="screening/questionnaire" />
        <Stack.Screen name="screening/result" />
        <Stack.Screen name="pmt/report" />
        <Stack.Screen name="pmt/history" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
