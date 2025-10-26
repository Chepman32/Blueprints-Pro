/**
 * Application Constants
 */

import {Platform} from 'react-native';

export const APP_CONFIG = {
  name: 'Blueprints Pro',
  version: '1.0.0',
  buildNumber: 1,
  bundleId: Platform.select({
    ios: 'com.blueprintspro',
    android: 'com.blueprintspro',
  }),
};

export const ANIMATION_CONFIG = {
  defaultDuration: 300,
  quickDuration: 150,
  slowDuration: 500,
  springStiffness: 240,
  springDamping: 18,
  pressScale: 0.96,
  hoverScale: 1.02,
};

export const PERFORMANCE_CONFIG = {
  maxListItems: 100,
  imageCacheSize: 50,
  debounceDelay: 300,
  throttleDelay: 100,
  batchSize: 10,
  targetFPS: 60,
};

export const DATABASE_CONFIG = {
  name: 'BlueprintsPro',
  version: 1,
  maxCachedRecords: 1000,
};

export const EXPORT_CONFIG = {
  formats: ['pdf', 'markdown', 'json'] as const,
  defaultFormat: 'pdf' as const,
  maxExportSize: 50 * 1024 * 1024, // 50MB
};

export const IAP_CONFIG = {
  products: {
    proUnlock: 'com.blueprintspro.pro_unlock',
    premiumPack1: 'com.blueprintspro.premium_pack_1',
    premiumPack2: 'com.blueprintspro.premium_pack_2',
  },
  subscriptions: {
    monthly: 'com.blueprintspro.monthly',
    yearly: 'com.blueprintspro.yearly',
  },
};

export const NOTIFICATION_CONFIG = {
  channels: {
    default: 'blueprints-pro-default',
    reminders: 'blueprints-pro-reminders',
    exports: 'blueprints-pro-exports',
  },
};

export const GESTURE_CONFIG = {
  minPinchScale: 0.5,
  maxPinchScale: 5.0,
  minFlingVelocity: 500,
  swipeThreshold: 100,
  longPressDelay: 500,
  doubleTapDelay: 300,
};

export const ACCESSIBILITY_CONFIG = {
  minTouchTarget: 44,
  minContrastRatio: 4.5,
  maxScaleFactor: 3.0,
  defaultFontScale: 1.0,
};

export const STORAGE_KEYS = {
  theme: 'theme-storage',
  settings: 'settings-storage',
  onboarding: 'onboarding-completed',
  lastSync: 'last-sync-timestamp',
  proUnlocked: 'pro-unlocked',
};

export const ERROR_MESSAGES = {
  generic: 'An error occurred. Please try again.',
  network: 'Network error. Please check your connection.',
  storage: 'Storage error. Please check available space.',
  permission: 'Permission denied. Please enable in Settings.',
  export: 'Export failed. Please try again.',
  import: 'Import failed. Please check the file format.',
  purchase: 'Purchase failed. Please try again.',
};

export const SUCCESS_MESSAGES = {
  saved: 'Saved successfully',
  exported: 'Exported successfully',
  imported: 'Imported successfully',
  deleted: 'Deleted successfully',
  purchased: 'Purchase successful',
};

export const FEATURE_FLAGS = {
  enableAdvancedEditing: true,
  enableCloudSync: false, // Offline-first app
  enableAnalytics: false, // Privacy-first app
  enableCrashReporting: false, // Privacy-first app
  enableBetaFeatures: __DEV__,
};

export const LIMITS = {
  maxBlueprintsPerProject: 100,
  maxAnnotationsPerBlueprint: 500,
  maxLayersPerBlueprint: 20,
  maxProjectsTotal: 50,
  maxBlueprintSizeMB: 25,
  maxTitleLength: 100,
  maxDescriptionLength: 500,
};

export const FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/jpg'],
  exports: ['application/pdf', 'text/markdown', 'application/json'],
};

export const URLS = {
  support: 'https://blueprintspro.com/support',
  privacy: 'https://blueprintspro.com/privacy',
  terms: 'https://blueprintspro.com/terms',
  website: 'https://blueprintspro.com',
};
