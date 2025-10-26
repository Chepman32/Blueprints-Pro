import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from '@navigation';
import {useTheme} from '@hooks/useTheme';
import {ErrorBoundary} from './components/ErrorBoundary';
import {useBlueprintStore} from '@store/blueprintStore';

// Ignore specific warnings in development
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const App = () => {
  const theme = useTheme();
  const loadBlueprints = useBlueprintStore((state) => state.loadBlueprints);

  useEffect(() => {
    // Load initial data
    loadBlueprints();
  }, [loadBlueprints]);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <StatusBar
            barStyle={theme.isDark ? 'light-content' : 'dark-content'}
            backgroundColor={theme.colors.background}
          />
          <NavigationContainer
            theme={{
              dark: theme.isDark,
              colors: {
                primary: theme.colors.primary,
                background: theme.colors.background,
                card: theme.colors.surface,
                text: theme.colors.text,
                border: theme.colors.border,
                notification: theme.colors.error,
              },
            }}>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default App;
