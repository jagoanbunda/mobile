/**
 * Material 3 Color System
 * 
 * Inspired by Android Developer Documentation Plant App Theme
 * https://developer.android.com/design/ui/mobile/guides/styles/themes
 * 
 * Color Palette:
 * - Primary (Green accent): #7A8A6E (sage green for checkboxes, icons)
 * - Secondary (Brand/Card): #E8D5C4 (soft beige/pink for cards)
 * - Tertiary (Wallpaper): #5B7CB5 (muted blue for profile accents)
 * - Surface: #F5F5F0 (off-white/cream background)
 */

export type ThemeMode = 'light' | 'dark' | 'system';

// ===================
// LIGHT THEME (M3 Color Roles)
// ===================
export const LightColors = {
    // === PRIMARY (Green - for interactive elements, checkboxes) ===
    primary: '#7A8A6E',              // Sage green
    onPrimary: '#FFFFFF',
    primaryContainer: '#D4E4C8',     // Light sage
    onPrimaryContainer: '#1A2A16',

    // === SECONDARY (Beige/Pink - for cards, containers) ===
    secondary: '#C4A484',            // Warm beige
    onSecondary: '#FFFFFF',
    secondaryContainer: '#F5E6D3',   // Light beige/cream
    onSecondaryContainer: '#3D2E1E',

    // === TERTIARY (Blue - for special accents) ===
    tertiary: '#5B7CB5',             // Muted blue
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#D6E3FF',
    onTertiaryContainer: '#1A2A4A',

    // === ERROR ===
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',

    // === SURFACE (Backgrounds) ===
    surface: '#F5F5F0',              // Off-white/cream
    onSurface: '#1C1B1A',
    surfaceVariant: '#E8E1D9',       // Warm gray
    onSurfaceVariant: '#4A4640',
    surfaceDim: '#E0DDD6',
    surfaceBright: '#FEFCF8',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#FAF8F3',
    surfaceContainer: '#F5F2ED',
    surfaceContainerHigh: '#EFE9E4',
    surfaceContainerHighest: '#E8E1DC',

    // === OUTLINE ===
    outline: '#7A7670',
    outlineVariant: '#CCC5BD',

    // === INVERSE ===
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

    // === LEGACY MAPPINGS ===
    background: '#F5F5F0',
    backgroundAlt: '#EFE9E4',
    card: '#FFFFFF',
    cardAlt: '#F5E6D3',
    border: '#CCC5BD',
    borderMuted: '#E8E1D9',
    text: '#1C1B1A',
    textSecondary: '#4A4640',
    textMuted: '#7A7670',
    textInverted: '#FFFFFF',

    // === TAB BAR ===
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E8E1D9',
    tabBarActive: '#7A8A6E',
    tabBarInactive: '#7A7670',
};

// ===================
// DARK THEME (M3 Color Roles)
// ===================
export const DarkColors = {
    // === PRIMARY ===
    primary: '#B8CCAA',              // Light sage
    onPrimary: '#2A3A24',
    primaryContainer: '#4A5A44',
    onPrimaryContainer: '#D4E4C8',

    // === SECONDARY ===
    secondary: '#E0C8AC',
    onSecondary: '#3D2E1E',
    secondaryContainer: '#5A4A3A',
    onSecondaryContainer: '#F5E6D3',

    // === TERTIARY ===
    tertiary: '#A8C4F0',
    onTertiary: '#1A2A4A',
    tertiaryContainer: '#3A4A6A',
    onTertiaryContainer: '#D6E3FF',

    // === ERROR ===
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',

    // === SURFACE (Dark warm tones, not pure black) ===
    surface: '#141311',              // Very dark warm brown
    onSurface: '#E7E2DC',
    surfaceVariant: '#4A4640',
    onSurfaceVariant: '#CCC5BD',
    surfaceDim: '#141311',
    surfaceBright: '#3A3936',
    surfaceContainerLowest: '#0F0E0C',
    surfaceContainerLow: '#1C1B1A',
    surfaceContainer: '#201F1D',     // Warm dark
    surfaceContainerHigh: '#2B2A27',
    surfaceContainerHighest: '#363532',

    // === OUTLINE ===
    outline: '#948F88',
    outlineVariant: '#4A4640',

    // === INVERSE ===
    inverseSurface: '#E7E2DC',
    inverseOnSurface: '#31302E',
    inversePrimary: '#5A6A4E',

    // === SCRIM ===
    scrim: '#000000',
    shadow: '#000000',

    // === STATUS ===
    success: '#8ABB7A',
    warning: '#C4A45A',
    info: '#7A9ABB',

    // === LEGACY MAPPINGS ===
    background: '#141311',
    backgroundAlt: '#201F1D',
    card: '#201F1D',
    cardAlt: '#2B2A27',
    border: '#4A4640',
    borderMuted: '#363532',
    text: '#E7E2DC',
    textSecondary: '#CCC5BD',
    textMuted: '#948F88',
    textInverted: '#1C1B1A',

    // === TAB BAR ===
    tabBarBackground: '#141311',
    tabBarBorder: '#2B2A27',
    tabBarActive: '#B8CCAA',
    tabBarInactive: '#948F88',
};

// Type for theme colors
export type ThemeColors = typeof LightColors;

// Legacy Colors export (defaults to dark)
export const Colors = DarkColors;

export default Colors;
