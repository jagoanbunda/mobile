/**
 * Centralized Color Theme Configuration
 * 
 * This file contains both light and dark theme variants.
 * The app automatically uses the appropriate theme based on user preference.
 */

export type ThemeMode = 'light' | 'dark' | 'system';

// ===================
// LIGHT THEME COLORS
// ===================
export const LightColors = {
    // Primary
    primary: '#F5AFAF',
    primaryMuted: '#e8a0a0',

    // Backgrounds
    background: '#FCF8F8',
    backgroundAlt: '#FBEFEF',

    // Cards/Surfaces
    card: '#FFFFFF',
    cardAlt: '#F9DFDF',

    // Borders
    border: '#F5AFAF40',
    borderMuted: '#00000010',

    // Text
    text: '#2d1f1f',
    textSecondary: '#6b5555',
    textMuted: '#9a8585',
    textInverted: '#FFFFFF',

    // Status
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Tab bar specific
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#F5AFAF40',
    tabBarActive: '#F5AFAF',
    tabBarInactive: '#9a8585',
};

// ===================
// DARK THEME COLORS
// ===================
export const DarkColors = {
    // Primary
    primary: '#F5AFAF',
    primaryMuted: '#d4a0a0',

    // Backgrounds
    background: '#2d1f1f',
    backgroundAlt: '#3d2a2a',

    // Cards/Surfaces
    card: '#3d2a2a',
    cardAlt: '#4a3535',

    // Borders
    border: '#5a4040',
    borderMuted: '#ffffff10',

    // Text
    text: '#FFFFFF',
    textSecondary: '#d4a0a0',
    textMuted: '#a08585',
    textInverted: '#2d1f1f',

    // Status
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Tab bar specific
    tabBarBackground: '#2d1f1f',
    tabBarBorder: '#5a4040',
    tabBarActive: '#F5AFAF',
    tabBarInactive: '#d4a0a0',
};

// Type for theme colors
export type ThemeColors = typeof LightColors;

// Legacy Colors export for backward compatibility (defaults to dark)
export const Colors = DarkColors;

export default Colors;
