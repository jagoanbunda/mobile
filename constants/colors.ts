/**
 * Centralized Color Theme Configuration
 * 
 * Change colors here to update the entire app's color scheme.
 * All colors are organized by their semantic purpose.
 */

export const Colors = {
    // ===================
    // PRIMARY COLORS
    // ===================
    primary: '#F5AFAF',           // Main accent color (coral/salmon)
    primaryMuted: '#d4a0a0',      // Muted version of primary (for inactive states)

    // ===================
    // BACKGROUND COLORS
    // ===================
    backgroundLight: '#FCF8F8',   // Light mode background
    backgroundDark: '#2d1f1f',    // Dark mode background (main)

    // ===================
    // CARD/SURFACE COLORS
    // ===================
    cardDark: '#3d2a2a',          // Card background (dark mode)
    cardDarkAlt: '#4a3535',       // Alternative card background (slightly lighter)

    // ===================
    // BORDER COLORS
    // ===================
    borderDark: '#5a4040',        // Border color for dark mode

    // ===================
    // TEXT COLORS
    // ===================
    textPrimary: '#FFFFFF',       // Primary text (white)
    textMuted: '#d4a0a0',         // Muted/secondary text
    textMutedAlt: 'rgba(255,255,255,0.6)', // Alternative muted text

    // ===================
    // STATUS COLORS
    // ===================
    success: '#22c55e',           // Green for success states
    warning: '#f59e0b',           // Orange/amber for warnings
    error: '#ef4444',             // Red for errors
    info: '#3b82f6',              // Blue for info

    // ===================
    // UTILITY
    // ===================
    transparent: 'transparent',
    white: '#FFFFFF',
    black: '#000000',
};

// Export individual colors for easy destructuring
export const {
    primary,
    primaryMuted,
    backgroundLight,
    backgroundDark,
    cardDark,
    cardDarkAlt,
    borderDark,
    textPrimary,
    textMuted,
    textMutedAlt,
    success,
    warning,
    error,
    info,
} = Colors;

// Default export for convenience
export default Colors;
