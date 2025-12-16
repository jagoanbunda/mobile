/**
 * Material 3 Color System
 * 
 * Sage Green Palette from ColorHunt:
 * - #96A78D (Sage Dark)
 * - #B6CEB4 (Sage Medium)
 * - #D9E9CF (Sage Light)
 * - #F0F0F0 (Off-White)
 * 
 * Following Android Material 3 color guidelines:
 * https://developer.android.com/design/ui/mobile/guides/styles/color
 */

export type ThemeMode = 'light' | 'dark' | 'system';

// ===================
// LIGHT THEME (M3 Color Roles)
// ===================
export const LightColors = {
    // === PRIMARY ===
    primary: '#96A78D',              // Main brand color
    onPrimary: '#FFFFFF',            // Text/icons on primary
    primaryContainer: '#D9E9CF',     // Container using primary
    onPrimaryContainer: '#1a2a1a',   // Text on primary container

    // === SECONDARY ===
    secondary: '#B6CEB4',            // Supporting color
    onSecondary: '#1a2a1a',          // Text on secondary
    secondaryContainer: '#E8F0E6',   // Container using secondary
    onSecondaryContainer: '#2a3a2a', // Text on secondary container

    // === TERTIARY ===
    tertiary: '#7a8a7a',             // Accent for contrast
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#C9D9C7',
    onTertiaryContainer: '#2a3a2a',

    // === ERROR ===
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',

    // === SURFACE (Backgrounds) ===
    surface: '#F0F0F0',              // Main background
    onSurface: '#1a2a1a',            // Text on surface
    surfaceVariant: '#E0E8DE',       // Variant for cards/sheets
    onSurfaceVariant: '#3a4a3a',     // Text on variant
    surfaceDim: '#D9E1D7',           // Dimmed surface
    surfaceBright: '#FAFAFA',        // Bright surface
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F5F5F5',
    surfaceContainer: '#EFEFEF',     // Default container
    surfaceContainerHigh: '#E8E8E8',
    surfaceContainerHighest: '#E0E0E0',

    // === OUTLINE ===
    outline: '#96A78D',              // Borders, dividers
    outlineVariant: '#C9D1C7',       // Subtle borders

    // === INVERSE ===
    inverseSurface: '#2a3a2a',
    inverseOnSurface: '#F0F0F0',
    inversePrimary: '#D9E9CF',

    // === SCRIM & SHADOW ===
    scrim: '#000000',
    shadow: '#000000',

    // === STATUS COLORS ===
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',

    // === LEGACY MAPPINGS (for backward compatibility) ===
    background: '#F0F0F0',
    backgroundAlt: '#E0E8DE',
    card: '#FFFFFF',
    cardAlt: '#F5F5F5',
    border: '#96A78D',
    borderMuted: '#C9D1C7',
    text: '#1a2a1a',
    textSecondary: '#3a4a3a',
    textMuted: '#5a6a5a',
    textInverted: '#FFFFFF',

    // === TAB BAR ===
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#C9D1C7',
    tabBarActive: '#96A78D',
    tabBarInactive: '#5a6a5a',
};

// ===================
// DARK THEME (M3 Color Roles)
// ===================
export const DarkColors = {
    // === PRIMARY ===
    primary: '#D9E9CF',              // Primary in dark (lighter)
    onPrimary: '#1a2a1a',            // Text on primary
    primaryContainer: '#5a6a5a',     // Container
    onPrimaryContainer: '#E8F0E6',   // Text on container

    // === SECONDARY ===
    secondary: '#B6CEB4',
    onSecondary: '#1a2a1a',
    secondaryContainer: '#4a5a4a',
    onSecondaryContainer: '#D9E9CF',

    // === TERTIARY ===
    tertiary: '#C9D9C7',
    onTertiary: '#1a2a1a',
    tertiaryContainer: '#5a6a5a',
    onTertiaryContainer: '#E8F0E6',

    // === ERROR ===
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',

    // === SURFACE (Backgrounds) ===
    surface: '#1a2a1a',              // Dark sage background
    onSurface: '#E8F0E6',            // Light text
    surfaceVariant: '#3a4a3a',       // Variant for cards
    onSurfaceVariant: '#C9D1C7',
    surfaceDim: '#121a12',
    surfaceBright: '#3a4a3a',
    surfaceContainerLowest: '#0d150d',
    surfaceContainerLow: '#1a2a1a',
    surfaceContainer: '#2a3a2a',     // Default container
    surfaceContainerHigh: '#3a4a3a',
    surfaceContainerHighest: '#4a5a4a',

    // === OUTLINE ===
    outline: '#8a9a8a',
    outlineVariant: '#4a5a4a',

    // === INVERSE ===
    inverseSurface: '#E8F0E6',
    inverseOnSurface: '#1a2a1a',
    inversePrimary: '#96A78D',

    // === SCRIM & SHADOW ===
    scrim: '#000000',
    shadow: '#000000',

    // === STATUS COLORS ===
    success: '#4ade80',
    warning: '#fbbf24',
    info: '#60a5fa',

    // === LEGACY MAPPINGS ===
    background: '#1a2a1a',
    backgroundAlt: '#2a3a2a',
    card: '#2a3a2a',
    cardAlt: '#3a4a3a',
    border: '#4a5a4a',
    borderMuted: '#3a4a3a',
    text: '#E8F0E6',
    textSecondary: '#C9D1C7',
    textMuted: '#8a9a8a',
    textInverted: '#1a2a1a',

    // === TAB BAR ===
    tabBarBackground: '#1a2a1a',
    tabBarBorder: '#3a4a3a',
    tabBarActive: '#D9E9CF',
    tabBarInactive: '#8a9a8a',
};

// Type for theme colors
export type ThemeColors = typeof LightColors;

// Legacy Colors export (defaults to dark)
export const Colors = DarkColors;

export default Colors;
