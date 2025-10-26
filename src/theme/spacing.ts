export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const hitSlop = {
  small: {top: 8, bottom: 8, left: 8, right: 8},
  medium: {top: 12, bottom: 12, left: 12, right: 12},
  large: {top: 16, bottom: 16, left: 16, right: 16},
} as const;

export const layout = {
  screenPadding: spacing.md,
  cardPadding: spacing.md,
  listItemPadding: spacing.md,
  minTouchTarget: 44,
} as const;
