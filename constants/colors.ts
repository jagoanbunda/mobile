/**
 * Centralized Color Theme Configuration
 * 
 * Sage Green Palette from ColorHunt:
 * - #96A78D (Sage Dark)
 * - #B6CEB4 (Sage Medium)
 * - #D9E9CF (Sage Light)
 * - #F0F0F0 (Off-White)
 */

export type ThemeMode = 'light' | 'dark' | 'system';

// ===================
// LIGHT THEME COLORS
// ===================
export const LightColors = {
    // Primary
    primary: '#96A78D',           // Sage dark as accent
    primaryMuted: '#B6CEB4',      // Sage medium

    // Backgrounds
    background: '#F0F0F0',        // Off-white
    backgroundAlt: '#D9E9CF',     // Sage light

    // Cards/Surfaces
    card: '#FFFFFF',              // White cards
    cardAlt: '#D9E9CF',           // Sage light for alt cards

    // Borders
    border: '#B6CEB4',            // Sage medium
    borderMuted: '#D9E9CF',       // Sage light

    // Text
    text: '#3a4a3a',              // Dark muted green for readability
    textSecondary: '#5a6a5a',     // Medium green-gray
    textMuted: '#7a8a7a',         // Light green-gray
    textInverted: '#FFFFFF',      // White for dark backgrounds

    // Status
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Tab bar specific
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#D9E9CF',
    tabBarActive: '#96A78D',
    tabBarInactive: '#7a8a7a',
};

// ===================
// DARK THEME COLORS
// ===================
export const DarkColors = {
    // Primary
    primary: '#D9E9CF',           // Sage light as accent (stands out on dark)
    primaryMuted: '#B6CEB4',      // Sage medium

    // Backgrounds
    background: '#5a6a5a',        // Darker sage (derived from #96A78D, darkened)
    backgroundAlt: '#6a7a6a',     // Slightly lighter dark sage

    // Cards/Surfaces
    card: '#7a8a7a',              // Medium-dark sage
    cardAlt: '#8a9a8a',           // Slightly lighter card

    // Borders
    border: '#96A78D',            // Original sage dark
    borderMuted: '#7a8a7a',       // Muted border

    // Text
    text: '#F0F0F0',              // Off-white for dark mode
    textSecondary: '#D9E9CF',     // Sage light
    textMuted: '#B6CEB4',         // Sage medium
    textInverted: '#3a4a3a',      // Dark green for light backgrounds

    // Status
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Tab bar specific
    tabBarBackground: '#5a6a5a',  // Match dark background
    tabBarBorder: '#7a8a7a',
    tabBarActive: '#D9E9CF',      // Sage light
    tabBarInactive: '#B6CEB4',    // Sage medium
};

// Type for theme colors
export type ThemeColors = typeof LightColors;

// Legacy Colors export for backward compatibility (defaults to dark)
export const Colors = DarkColors;

export default Colors;
