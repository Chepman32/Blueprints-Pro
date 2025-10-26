import {useThemeStore} from '@store/themeStore';
import {Theme} from '@theme';

export const useTheme = (): Theme => {
  return useThemeStore((state) => state.theme);
};
