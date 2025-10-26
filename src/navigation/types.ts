import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Blueprint} from '@database';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  BlueprintEditor: {blueprintId: string};
  BlueprintDetail: {blueprintId: string};
  Settings: undefined;
  ProjectDetail: {projectId: string};
  Export: {blueprintId: string};
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  Projects: undefined;
  More: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
