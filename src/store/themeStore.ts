import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {lightTheme, darkTheme, Theme} from '@theme';
import {Appearance} from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeStore {
  mode: ThemeMode;
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const getThemeForMode = (mode: ThemeMode): Theme => {
  if (mode === 'auto') {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? darkTheme : lightTheme;
  }
  return mode === 'dark' ? darkTheme : lightTheme;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'auto',
      theme: getThemeForMode('auto'),

      setThemeMode: (mode: ThemeMode) => {
        set({
          mode,
          theme: getThemeForMode(mode),
        });
      },

      toggleTheme: () => {
        const currentMode = get().mode;
        const newMode = currentMode === 'dark' ? 'light' : 'dark';
        set({
          mode: newMode,
          theme: getThemeForMode(newMode),
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Listen to system theme changes when in auto mode
Appearance.addChangeListener(() => {
  const store = useThemeStore.getState();
  if (store.mode === 'auto') {
    store.setThemeMode('auto');
  }
});
