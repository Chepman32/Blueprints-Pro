import {renderHook, act} from '@testing-library/react-hooks';
import {useThemeStore} from '../themeStore';

describe('ThemeStore', () => {
  beforeEach(() => {
    // Reset store state
    act(() => {
      useThemeStore.setState({
        mode: 'auto',
      });
    });
  });

  it('should initialize with auto mode', () => {
    const {result} = renderHook(() => useThemeStore());
    expect(result.current.mode).toBe('auto');
  });

  it('should toggle theme from light to dark', () => {
    const {result} = renderHook(() => useThemeStore());

    act(() => {
      result.current.setThemeMode('light');
    });
    expect(result.current.mode).toBe('light');
    expect(result.current.theme.isDark).toBe(false);

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.mode).toBe('dark');
    expect(result.current.theme.isDark).toBe(true);
  });

  it('should toggle theme from dark to light', () => {
    const {result} = renderHook(() => useThemeStore());

    act(() => {
      result.current.setThemeMode('dark');
    });
    expect(result.current.mode).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.mode).toBe('light');
  });

  it('should set theme mode to auto', () => {
    const {result} = renderHook(() => useThemeStore());

    act(() => {
      result.current.setThemeMode('auto');
    });
    expect(result.current.mode).toBe('auto');
  });

  it('should return correct theme object', () => {
    const {result} = renderHook(() => useThemeStore());

    act(() => {
      result.current.setThemeMode('light');
    });

    expect(result.current.theme).toHaveProperty('colors');
    expect(result.current.theme).toHaveProperty('typography');
    expect(result.current.theme).toHaveProperty('spacing');
    expect(result.current.theme).toHaveProperty('borderRadius');
    expect(result.current.theme.colors).toHaveProperty('primary');
    expect(result.current.theme.colors).toHaveProperty('background');
  });
});
