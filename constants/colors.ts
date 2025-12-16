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
    primary: '#E88888',           // Slightly darker coral for better visibility
    primaryMuted: '#F5AFAF',

    // Backgrounds
    background: '#FFF9F9',        // Very soft pink-white
    backgroundAlt: '#FFF5F5',

    // Cards/Surfaces
    card: '#FFFFFF',              // White cards on soft pink background
    cardAlt: '#FFF0F0',           // Very soft pink for alt cards

    // Borders
    border: '#F5AFAF50',          // Soft pink border
    borderMuted: '#E8888830',

    // Text
    text: '#3d2a2a',              // Dark brown for good readability
    textSecondary: '#6b5555',
    textMuted: '#8a7070',
    textInverted: '#FFFFFF',

    // Status
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Tab bar specific
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#F5AFAF50',
    tabBarActive: '#E88888',
    tabBarInactive: '#8a7070',
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
