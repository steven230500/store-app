import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const theme = {
  colors: {
    // Primary colors
    primary: '#2563EB', // Blue-600
    primaryDark: '#1D4ED8', // Blue-700
    primaryLight: '#3B82F6', // Blue-500

    // Secondary colors
    secondary: '#64748B', // Slate-500
    secondaryDark: '#475569', // Slate-600
    secondaryLight: '#94A3B8', // Slate-400

    // Accent colors
    accent: '#F59E0B', // Amber-500
    accentDark: '#D97706', // Amber-600
    accentLight: '#FCD34D', // Amber-300

    // Status colors
    success: '#10B981', // Emerald-500
    error: '#EF4444', // Red-500
    warning: '#F59E0B', // Amber-500
    info: '#3B82F6', // Blue-500

    // Neutral colors
    background: '#FFFFFF',
    surface: '#F8FAFC', // Slate-50
    surfaceDark: '#F1F5F9', // Slate-100
    card: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Text colors
    text: '#1E293B', // Slate-800
    textSecondary: '#64748B', // Slate-500
    textMuted: '#94A3B8', // Slate-400
    textInverse: '#FFFFFF',

    // Border colors
    border: '#E2E8F0', // Slate-200
    borderLight: '#F1F5F9', // Slate-100
    borderDark: '#CBD5E1', // Slate-300

    // Special colors
    shadow: 'rgba(0, 0, 0, 0.1)',
    backdrop: 'rgba(0, 0, 0, 0.6)',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      huge: 48,
    },
    fontWeight: {
      light: '300' as const,
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
  },

  dimensions: {
    screenWidth,
    screenHeight,
    isSmallScreen: screenWidth < 375,
    isLargeScreen: screenWidth > 414,
  },

  // Responsive breakpoints
  breakpoints: {
    xs: 320,
    sm: 375,
    md: 414,
    lg: 768,
    xl: 1024,
  },

  // Responsive spacing helpers
  responsiveSpacing: {
    xs: (multiplier: number = 1) => theme.spacing.xs * multiplier,
    sm: (multiplier: number = 1) => theme.spacing.sm * multiplier,
    md: (multiplier: number = 1) => theme.spacing.md * multiplier,
    lg: (multiplier: number = 1) => theme.spacing.lg * multiplier,
    xl: (multiplier: number = 1) => theme.spacing.xl * multiplier,
  },

  // Component specific styles
  components: {
    button: {
      height: 48,
      borderRadius: 12,
      paddingHorizontal: 24,
    },
    input: {
      height: 48,
      borderRadius: 8,
      paddingHorizontal: 16,
      borderWidth: 1,
    },
    card: {
      borderRadius: 12,
      padding: 16,
      margin: 8,
    },
  },
};

export type Theme = typeof theme;