import { DarkColors, LightColors, ThemeColors, ThemeMode } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

const THEME_STORAGE_KEY = '@app_theme_mode';

interface ThemeContextType {
    themeMode: ThemeMode;
    isDark: boolean;
    colors: ThemeColors;
    setThemeMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useSystemColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved theme on mount
    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
                setThemeModeState(savedTheme as ThemeMode);
            }
        } catch (error) {
            console.warn('Failed to load theme preference:', error);
        } finally {
            setIsLoaded(true);
        }
    };

    const setThemeMode = async (mode: ThemeMode) => {
        setThemeModeState(mode);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.warn('Failed to save theme preference:', error);
        }
    };

    const toggleTheme = () => {
        const newMode = isDark ? 'light' : 'dark';
        setThemeMode(newMode);
    };

    // Determine if dark mode based on themeMode and system preference
    const isDark =
        themeMode === 'dark' ||
        (themeMode === 'system' && systemColorScheme === 'dark');

    // Get the appropriate colors
    const colors = isDark ? DarkColors : LightColors;

    // Don't render until theme is loaded to prevent flash
    if (!isLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ themeMode, isDark, colors, setThemeMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// Hook to get just the colors (convenience)
export function useThemeColors(): ThemeColors {
    const { colors } = useTheme();
    return colors;
}

export default ThemeContext;
