export const lightColors = {
  // Primary palette
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#4DA3FF',

  // Secondary palette
  secondary: '#5856D6',
  secondaryDark: '#3634A3',
  secondaryLight: '#7D7AEA',

  // Neutral palette
  background: '#FFFFFF',
  surface: '#F2F2F7',
  surfaceVariant: '#E5E5EA',

  // Text colors
  text: '#000000',
  textSecondary: '#3C3C43',
  textTertiary: '#8E8E93',
  textDisabled: '#C7C7CC',

  // Semantic colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',

  // UI elements
  border: '#C6C6C8',
  divider: '#E5E5EA',
  overlay: 'rgba(0, 0, 0, 0.4)',
  shadow: 'rgba(0, 0, 0, 0.1)',

  // Specific use cases
  cardBackground: '#FFFFFF',
  inputBackground: '#FFFFFF',
  buttonText: '#FFFFFF',
} as const;

export const darkColors = {
  // Primary palette
  primary: '#0A84FF',
  primaryDark: '#0051D5',
  primaryLight: '#4DA3FF',

  // Secondary palette
  secondary: '#5E5CE6',
  secondaryDark: '#3634A3',
  secondaryLight: '#7D7AEA',

  // Neutral palette
  background: '#000000',
  surface: '#1C1C1E',
  surfaceVariant: '#2C2C2E',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  textDisabled: '#48484A',

  // Semantic colors
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#64D2FF',

  // UI elements
  border: '#38383A',
  divider: '#2C2C2E',
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: 'rgba(0, 0, 0, 0.3)',

  // Specific use cases
  cardBackground: '#1C1C1E',
  inputBackground: '#1C1C1E',
  buttonText: '#FFFFFF',
} as const;

export type ColorScheme = typeof lightColors;
