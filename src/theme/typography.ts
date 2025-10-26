import {Platform, TextStyle} from 'react-native';

const fontFamily = Platform.select({
  ios: {
    regular: 'SF Pro Text',
    medium: 'SF Pro Text',
    semibold: 'SF Pro Text',
    bold: 'SF Pro Text',
    display: 'SF Pro Display',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    semibold: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    display: 'Roboto',
  },
  default: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    display: 'System',
  },
});

export const typography = {
  // Display styles
  displayLarge: {
    fontFamily: fontFamily?.display,
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontFamily: fontFamily?.display,
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily: fontFamily?.display,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },

  // Headline styles
  headlineLarge: {
    fontFamily: fontFamily?.semibold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: fontFamily?.semibold,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: fontFamily?.semibold,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },

  // Title styles
  titleLarge: {
    fontFamily: fontFamily?.semibold,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: fontFamily?.medium,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: fontFamily?.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
  },

  // Body styles
  bodyLarge: {
    fontFamily: fontFamily?.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: fontFamily?.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: fontFamily?.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.4,
  },

  // Label styles
  labelLarge: {
    fontFamily: fontFamily?.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: fontFamily?.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: fontFamily?.medium,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.5,
  },
} as const;

export type Typography = typeof typography;
