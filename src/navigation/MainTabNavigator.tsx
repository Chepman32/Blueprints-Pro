import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from './types';
import {useTheme} from '@hooks/useTheme';
import {View, Text, StyleSheet} from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerLargeTitle: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'Blueprints Pro',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          headerTitle: 'Library',
          tabBarLabel: 'Library',
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          headerTitle: 'Projects',
          tabBarLabel: 'Projects',
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          headerTitle: 'More',
          tabBarLabel: 'More',
        }}
      />
    </Tab.Navigator>
  );
};

// Placeholder screens
const HomeScreen = () => {
  const theme = useTheme();
  return (
    <View style={[styles.screen, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.text, {color: theme.colors.text}]}>Home Screen</Text>
    </View>
  );
};

const LibraryScreen = () => {
  const theme = useTheme();
  return (
    <View style={[styles.screen, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.text, {color: theme.colors.text}]}>Library Screen</Text>
    </View>
  );
};

const ProjectsScreen = () => {
  const theme = useTheme();
  return (
    <View style={[styles.screen, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.text, {color: theme.colors.text}]}>Projects Screen</Text>
    </View>
  );
};

const MoreScreen = () => {
  const theme = useTheme();
  return (
    <View style={[styles.screen, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.text, {color: theme.colors.text}]}>More Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
});
