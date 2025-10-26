import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {schema} from './schema';
import {Blueprint, Annotation, Layer, Project, ProjectBlueprint} from './models';
import {Platform} from 'react-native';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'BlueprintsPro',
  jsi: Platform.OS === 'ios',
  onSetUpError: error => {
    console.error('Database setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Blueprint, Annotation, Layer, Project, ProjectBlueprint],
});

export * from './models';
export {schema};
