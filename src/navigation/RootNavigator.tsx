import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {MainTabNavigator} from './MainTabNavigator';
import {useTheme} from '@hooks/useTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen
        name="BlueprintEditor"
        component={BlueprintEditorPlaceholder}
        options={{
          headerShown: true,
          headerTitle: 'Editor',
          headerLargeTitle: false,
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="BlueprintDetail"
        component={BlueprintDetailPlaceholder}
        options={{
          headerShown: true,
          headerTitle: 'Details',
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsPlaceholder}
        options={{
          headerShown: true,
          headerTitle: 'Settings',
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="ProjectDetail"
        component={ProjectDetailPlaceholder}
        options={{
          headerShown: true,
          headerTitle: 'Project',
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="Export"
        component={ExportPlaceholder}
        options={{
          headerShown: true,
          headerTitle: 'Export',
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

// Placeholder screens (will be implemented later)
import {View, Text, StyleSheet} from 'react-native';

const BlueprintEditorPlaceholder = () => {
  const theme = useTheme();
  return (
    <View style={[styles.placeholder, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.text, {color: theme.colors.text}]}>Blueprint Editor</Text>
    </View>
  );
};

const BlueprintDetailPlaceholder = () => {
  const theme = useTheme();
  return (
    <View style={[styles.placeholder, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.text, {color: theme.colors.text}]}>Blueprint Detail</Text>
    </View>
  );
};

const SettingsPlaceholder = () => {
  const theme = useTheme();
  return (
    <View style={[styles.placeholder, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.text, {color: theme.colors.text}]}>Settings</Text>
    </View>
  );
};

const ProjectDetailPlaceholder = () => {
  const theme = useTheme();
  return (
    <View style={[styles.placeholder, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.text, {color: theme.colors.text}]}>Project Detail</Text>
    </View>
  );
};

const ExportPlaceholder = () => {
  const theme = useTheme();
  return (
    <View style={[styles.placeholder, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.text, {color: theme.colors.text}]}>Export</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});
