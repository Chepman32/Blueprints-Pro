import {lightColors, darkColors, ColorScheme} from './colors';
import {typography, Typography} from './typography';
import {spacing, borderRadius, hitSlop, layout} from './spacing';

export interface Theme {
  colors: ColorScheme;
  typography: Typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  hitSlop: typeof hitSlop;
  layout: typeof layout;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  hitSlop,
  layout,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  hitSlop,
  layout,
  isDark: true,
};

export * from './colors';
export * from './typography';
export * from './spacing';
