import { Colors, ThemeColors } from '@/constants/colors';
import React, { createContext, useContext } from 'react';

// Simplified theme context - light theme only
interface ThemeContextType {
    colors: ThemeColors;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Always use light theme
    const value: ThemeContextType = {
        colors: Colors,
        isDark: false,
    };

    return (
        <ThemeContext.Provider value={value}>
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
