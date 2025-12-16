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
    // === PRIMARY (Olive/Sage - for FAB, icons, accents) ===
    primary: '#6B7F5E',              // Olive green
    onPrimary: '#FFFFFF',
    primaryContainer: '#D4E4C8',     // Light sage
    onPrimaryContainer: '#1A2A16',

    // === SECONDARY (Beige/Tan - for selected items, cards) ===
    secondary: '#C4A77D',            // Warm tan
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8D5C0',   // Light beige (selected item bg)
    onSecondaryContainer: '#3D2E1E',

    // === TERTIARY (Coral/Pink - for accents) ===
    tertiary: '#C47D7D',             // Soft coral
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#F5D6D6',
    onTertiaryContainer: '#4A2020',

    // === ERROR ===
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',

    // === SURFACE (Backgrounds) ===
    surface: '#FBF8F3',              // Warm off-white
    onSurface: '#1C1B1A',            // Dark text
    surfaceVariant: '#E8E1D9',       // Warm gray for cards
    onSurfaceVariant: '#4A4640',
    surfaceDim: '#E0DDD6',
    surfaceBright: '#FFFFFF',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F8F5F0',
    surfaceContainer: '#F2EFE9',     // Default container
    surfaceContainerHigh: '#ECE9E3',
    surfaceContainerHighest: '#E6E3DD',

    // === OUTLINE ===
    outline: '#7A7670',              // Border color
    outlineVariant: '#CCC5BD',       // Subtle borders

    // === INVERSE (for contrast elements) ===
    inverseSurface: '#31302E',
    inverseOnSurface: '#F4F0EB',
    inversePrimary: '#B8CCAA',

    // === SCRIM ===
    scrim: '#000000',
    shadow: '#000000',

    // === STATUS ===
    success: '#4A7A3E',
    warning: '#8A6B24',
    info: '#4A6A8A',

    // === LEGACY MAPPINGS (for backward compatibility) ===
    background: '#FBF8F3',
    backgroundAlt: '#F2EFE9',
    card: '#FFFFFF',
    cardAlt: '#F8F5F0',
    border: '#CCC5BD',
    borderMuted: '#E8E1D9',
    text: '#1C1B1A',
    textSecondary: '#4A4640',
    textMuted: '#7A7670',
    textInverted: '#FFFFFF',

    // === TAB BAR ===
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E8E1D9',
    tabBarActive: '#6B7F5E',
    tabBarInactive: '#7A7670',
};

// For backward compatibility with useTheme
export const LightColors = Colors;
export const DarkColors = Colors; // Same as light (no dark theme)

export type ThemeColors = typeof Colors;
export type ThemeMode = 'light' | 'dark' | 'system';

export default Colors;
