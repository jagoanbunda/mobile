/**
 * Color Theme Configuration
 * 
 * Based on Android Reply App Theme from Material 3 Documentation
 * Light theme only - warm cream/beige/olive palette
 * 
 * Reference: https://developer.android.com/develop/ui/compose/designsystems/material3
 */

// ===================
// COLORS (Single Light Theme)
// ===================
export const Colors = {
    // === PRIMARY (Dark Forest Green - Image 0) ===
    primary: '#416936',              // Dark Green (approx match to Image 0 Primary)
    onPrimary: '#FFFFFF',
    primaryContainer: '#C3E8B6',     // Light Green Container (Image 0)
    onPrimaryContainer: '#0D2006',

    // === SECONDARY (Olive Grey - Image 0) ===
    secondary: '#59614F',            // Dark Olive Grey
    onSecondary: '#FFFFFF',
    secondaryContainer: '#DDECD3',   // Light Olive/Beige Container (Image 0)
    onSecondaryContainer: '#171D12',

    // === TERTIARY (Deep Teal - Image 0) ===
    tertiary: '#3A6560',             // Deep Teal Blue
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#BDEBE6',    // Light Cyan Container
    onTertiaryContainer: '#00201E',

    // === ERROR ===
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',

    // === SURFACE (Warm Paper - User Req) ===
    surface: '#FDFDF6',              // Warm off-white base
    onSurface: '#1A1C19',
    surfaceVariant: '#E1E5D9',       // Matches new palette tone
    onSurfaceVariant: '#44483E',
    surfaceDim: '#D9DBD1',
    surfaceBright: '#FDFDF6',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F7FAEE',
    surfaceContainer: '#F2F5EA',     // Card Background (Filled)
    surfaceContainerHigh: '#ECEFE5',
    surfaceContainerHighest: '#E6E9DF',

    // === OUTLINE (Muted) ===
    outline: '#74796D',
    outlineVariant: '#C4C8BB',

    // === INVERSE ===
    inverseSurface: '#2F312D',
    inverseOnSurface: '#F0F2E7',
    inversePrimary: '#A8D29C',

    // === SCRIM ===
    scrim: '#000000',
    shadow: '#000000',

    // === UTILITIES / STATUS ===
    success: '#416936', // Aligned with Primary
    warning: '#CA8A04', // Gold
    info: '#3A6560',    // Aligned with Tertiary

    // === LEGACY MAPPINGS (Mapped to new system) ===
    background: '#FDFDF6',           // Maps to surface
    backgroundAlt: '#F2F5EA',        // Maps to surfaceContainer
    card: '#F2F5EA',                 // Maps to surfaceContainer (Filled Card)
    cardAlt: '#F2F5EA',              // Maps to surfaceContainer
    border: '#C4C8BB',               // Maps to outlineVariant
    borderMuted: '#E1E5D9',          // Maps to surfaceVariant
    text: '#1A1C19',                 // Maps to onSurface
    textSecondary: '#44483E',        // Maps to onSurfaceVariant
    textMuted: '#74796D',            // Maps to outline
    textInverted: '#FFFFFF',         // Maps to onPrimary/White

    // === TAB BAR ===
    tabBarBackground: '#FDFDF6',     // Blends with surface
    tabBarBorder: '#E1E5D9',
    tabBarActive: '#416936',
    tabBarInactive: '#74796D',
};

// For backward compatibility with useTheme
export const LightColors = Colors;
export const DarkColors = Colors; // Same as light (no dark theme)

export type ThemeColors = typeof Colors;
export type ThemeMode = 'light' | 'dark' | 'system';

export default Colors;
