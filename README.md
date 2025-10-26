# Blueprints Pro

A production-ready, offline-first iOS application for blueprint annotation built with React Native.

## Features

- **Fully Offline**: Works entirely without internet connectivity
- **Blueprint Annotation**: Rich markup, measurements, and layer management
- **Gesture-First UX**: Intuitive pan, pinch, rotate, and swipe gestures
- **Physics-Based Animations**: Smooth 60fps animations with Reanimated 3
- **Skia Rendering**: High-performance custom graphics with React Native Skia
- **Export Functionality**: Export to PDF, Markdown, and JSON formats
- **In-App Purchases**: Premium features with consumables and subscriptions
- **Local Notifications**: Scheduled reminders and alerts
- **Dark Mode**: Full light/dark theme support
- **Accessibility**: VoiceOver, Dynamic Type, and focus management

## Architecture

### Tech Stack

- **React Native 0.75+** with New Architecture (Fabric/TurboModules)
- **TypeScript** for type safety
- **React Navigation** for routing
- **Zustand** for state management
- **WatermelonDB** for offline-first database
- **Reanimated 3** for animations
- **React Native Gesture Handler** for gestures
- **React Native Skia** for custom rendering
- **React Native IAP** for in-app purchases

### Project Structure

```
src/
├── components/       # Reusable UI components (70+ components)
├── screens/         # Screen components
├── navigation/      # Navigation configuration
├── store/          # Zustand stores
├── database/       # WatermelonDB models and schema
├── services/       # Business logic services (IAP, Export, Notifications)
├── hooks/          # Custom React hooks
├── theme/          # Theme configuration and tokens
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── App.tsx         # Root component
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn 3.6+
- Xcode 14+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS dependencies)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Blueprints-Pro
```

2. Install dependencies:
```bash
yarn install
```

3. Install iOS pods:
```bash
cd ios && pod install && cd ..
```

### Running the App

#### iOS
```bash
yarn ios
```

#### Android
```bash
yarn android
```

### Development

#### Type Checking
```bash
yarn typecheck
```

#### Linting
```bash
yarn lint
```

#### Testing
```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e
```

## Build & Release

### iOS

1. Open `ios/BlueprintsPro.xcworkspace` in Xcode
2. Select your team in Signing & Capabilities
3. Archive the app (Product → Archive)
4. Upload to App Store Connect

### Android

1. Generate release keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias blueprints-pro -keyalg RSA -keysize 2048 -validity 10000
```

2. Build release APK:
```bash
cd android
./gradlew assembleRelease
```

3. The APK will be at `android/app/build/outputs/apk/release/app-release.apk`

## Performance Budgets

- **Animation Frame Rate**: 60fps consistently
- **Interaction Response**: <100ms
- **App Launch Time**: <2s on target devices
- **Memory Usage**: <150MB for typical usage

## Testing

### Unit Tests
- Business logic and utilities
- State management
- Service layer
- Target: >80% code coverage

### Integration Tests
- Database operations
- State persistence
- Navigation flows

### E2E Tests
- Critical user journeys
- Blueprint creation and editing
- Export functionality
- IAP flows

## Accessibility

- Full VoiceOver support with descriptive labels
- Dynamic Type scaling
- Minimum 44pt touch targets
- Semantic color roles
- Focus management

## Privacy & Data

This app operates entirely offline. No user data is transmitted to external servers unless explicitly exported by the user. All data is stored locally on the device using encrypted SQLite databases.

See [PRIVACY.md](./PRIVACY.md) for full privacy policy.

## License

Copyright © 2025. All rights reserved.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## Support

For issues and questions, please open a GitHub issue or contact support@blueprintspro.com
