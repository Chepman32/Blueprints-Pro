# Blueprints Pro — Offline Blueprint Annotation

## Software Design Document (SDD)

> Production-ready SDD for a **fully offline** iOS-first app built with **React Native**, **Reanimated**, and **React Native Skia**. This document emphasizes exhaustive **UI/UX**, gesture-first navigation, rich animated micro-interactions, local-only data, and IAP monetization. All features are implementable with JavaScript/React Native tooling. No external APIs required.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Platform & Stack](#2-platform--stack)
3. [Information Architecture](#3-information-architecture)
4. [UI/UX — Screen-by-Screen](#4-uiux--screen-by-screen)
5. [Visual System](#5-visual-system)
6. [Motion & Interactions](#6-motion--interactions)
7. [Local Data Model](#7-local-data-model)
8. [State Management](#8-state-management)
9. [Monetization (IAP)](#9-monetization-iap)
10. [Performance Budgets](#10-performance-budgets)
11. [Offline-First Guarantees](#11-offline-first-guarantees)
12. [Appendix: Expanded UI Component Catalog](#appendix-1-expanded-ui-component-catalog)
13. [Appendix: Motion Specification Snippets](#appendix-2-motion-specification-snippets)
14. [Appendix: Local Data Samples](#appendix-3-local-data-samples)

---

## 1. Product Overview

**Blueprints Pro** is an offline-first iOS application for blueprint annotation. Users can import blueprint images, add markups, measurements, and notes, organize work in layers, and export annotated PDFs—all without requiring an internet connection.

### 1.1 Value Propositions

- **Works Entirely Offline**: Deterministic behavior regardless of connectivity
- **Gesture-Oriented UX**: Physics-based animations and intuitive touch interactions
- **Privacy-First**: User data never leaves device unless explicitly exported
- **Production-Ready**: Designed to be shippable with complete feature set

### 1.2 Core Use Cases

1. **Import Blueprint**: User selects an image from device library or camera
2. **Annotate**: Add markups, measurements, and text notes using gesture-based tools
3. **Layer Management**: Organize annotations across multiple layers with visibility controls
4. **Project Organization**: Group related blueprints into projects
5. **Export**: Generate PDF, Markdown, or JSON exports with annotations
6. **Premium Features**: Unlock advanced capabilities via In-App Purchase

### 1.3 Non-Goals

- No social graph or sharing features
- No cloud sync or server-side compute
- No real-time collaboration
- No network-dependent functionality
- No time estimations in UI or documentation

---

## 2. Platform & Stack

### 2.1 Core Technologies

- **React Native** 0.75+ with New Architecture (Fabric/TurboModules)
- **TypeScript** for type safety
- **React Navigation** (native-stack + custom gesture pager)
- **Reanimated 3** for animations
- **React Native Gesture Handler** for gesture recognition
- **React Native Skia** (@shopify/react-native-skia) for custom visuals, particles, charts

### 2.2 Data & Storage

- **SQLite** with WatermelonDB or Drizzle-RN for local database
- **React Native FS** (RNFS) for binary asset storage
- **AsyncStorage** for simple key-value preferences

### 2.3 Device Features

- **Local Notifications**: UNUserNotificationCenter via RN bridge
- **In-App Purchases**: react-native-iap (consumables, non-consumables, subscriptions)
- **Camera & Photo Library**: react-native-image-picker
- **Document Sharing**: react-native-share

### 2.4 Build & Development

- **Metro** bundler with custom configuration
- **Babel** with module resolver
- **ESLint** + **Prettier** for code quality
- **Jest** for unit testing
- **Detox** for E2E testing
- **GitHub Actions** for CI/CD

---

## 3. Information Architecture

### 3.1 Navigation Structure

```
App Root
├── Splash Screen (animated, physics-based)
├── Main Tabs
│   ├── Home (Recent blueprints)
│   ├── Library (All blueprints)
│   ├── Projects (Project organization)
│   └── More (Settings, About, IAP)
├── Blueprint Editor (Modal/Full-screen)
├── Blueprint Detail (Stack)
├── Project Detail (Stack)
├── Settings (Stack)
└── Export (Modal)
```

### 3.2 User Flows

#### Primary Flow: Annotate Blueprint
1. Launch app → Home tab
2. Tap "+" to import blueprint
3. Select image from photo library
4. Enter blueprint details (title, description)
5. Open in editor
6. Use gesture tools to add annotations
7. Manage layers (create, toggle visibility, reorder)
8. Save and return to library
9. Export to PDF/Markdown/JSON

#### Secondary Flow: Project Management
1. Navigate to Projects tab
2. Create new project
3. Add blueprints to project
4. Organize blueprint order
5. Export entire project

---

## 4. UI/UX — Screen-by-Screen

### 4.1 Splash Screen

**Purpose**: Brand introduction with physics-based animation

**Components**:
- Logo particles that scatter and reassemble (Skia)
- Spring physics for logo assembly
- Smooth fade-out transition

**Animation Spec**:
- Duration: 2000ms total
- Phase 1 (0-400ms): Particle explosion
- Phase 2 (400-1400ms): Logo assembly with spring
- Phase 3 (1400-2000ms): Fade out

**Implementation**:
```typescript
const SplashScreen: React.FC<{onComplete: () => void}>
```

### 4.2 Home Tab

**Purpose**: Quick access to recent blueprints

**Layout**:
- Large header: "Blueprints Pro"
- Search bar with animated focus
- Grid of recent blueprint cards (3 columns on iPhone, 4 on iPad)
- Floating "+" button for new blueprint

**Gestures**:
- Tap card → Navigate to blueprint detail
- Long-press card → Context menu (share, delete, favorite)
- Pull-to-refresh → Reload recent list
- Swipe card left → Quick delete

**Animations**:
- Card entrance: Staggered fade-in with spring
- Press feedback: Scale down to 0.96
- Hover (iPad): Subtle lift with shadow increase

### 4.3 Library Tab

**Purpose**: Browse all blueprints with search and filtering

**Layout**:
- Header with search bar
- Filter chips (All, Favorites, Recent, By Project)
- List/Grid toggle button
- Blueprint cards with metadata

**Features**:
- Real-time search (debounced 300ms)
- Sort options (date, name, size)
- Batch selection mode
- Empty state with onboarding

**Gestures**:
- Pinch → Toggle between list/grid view
- Swipe card → Actions (edit, share, delete)
- Long-press → Batch selection mode

### 4.4 Blueprint Editor

**Purpose**: Primary annotation interface

**Layout**:
- Full-screen canvas
- Blueprint image as background
- Annotation overlay layers
- Tool palette (bottom sheet)
- Layer panel (side drawer)
- Top bar (back, save, export, undo/redo)

**Tools**:
1. **Markup Tool**: Freehand drawing with adjustable stroke width and color
2. **Shape Tool**: Rectangle, circle, line, arrow
3. **Measurement Tool**: Distance with calibration
4. **Text Tool**: Add notes with font size control
5. **Eraser**: Remove specific annotations
6. **Selection Tool**: Move, resize, rotate annotations

**Gestures**:
- Pan with one finger → Draw/annotate
- Pan with two fingers → Move canvas
- Pinch → Zoom canvas (0.5x - 5x)
- Double-tap → Zoom to fit / zoom to 100%
- Three-finger tap → Undo
- Three-finger swipe → Redo

**Layers Panel**:
- List of layers with names
- Visibility toggle (eye icon)
- Lock toggle (lock icon)
- Opacity slider
- Drag to reorder
- Color indicator

**Animations**:
- Tool selection: Spring scale + color fade
- Layer panel slide-in: Smooth translate with damping
- Drawing feedback: Real-time path rendering with Skia

### 4.5 Blueprint Detail

**Purpose**: View blueprint metadata and quick actions

**Layout**:
- Hero image (blueprint preview)
- Title and description
- Metadata cards (size, created date, annotation count)
- Action buttons (edit, share, delete)
- Related project link

**Gestures**:
- Pan down → Dismiss to previous screen
- Tap hero image → Full-screen preview
- Pinch on preview → Zoom

### 4.6 Projects Tab

**Purpose**: Organize blueprints into projects

**Layout**:
- Header with "+" button
- Project cards with:
  - Thumbnail (first blueprint or custom)
  - Title and description
  - Blueprint count badge
  - Progress indicator

**Gestures**:
- Tap card → Open project detail
- Swipe left → Delete project
- Long-press → Edit project

### 4.7 Project Detail

**Purpose**: Manage blueprints within a project

**Layout**:
- Project header (title, description, cover image)
- Blueprint list with drag handles
- Add blueprint button

**Features**:
- Reorder blueprints by dragging
- Remove blueprints from project
- Export entire project

**Gestures**:
- Long-press + drag → Reorder blueprints
- Swipe blueprint → Remove from project

### 4.8 Settings

**Purpose**: App configuration and preferences

**Sections**:
1. **Appearance**
   - Theme: Light/Dark/Auto
   - Grid density
   - Default tool settings

2. **Storage**
   - Used space indicator
   - Clear cache button
   - Export all data

3. **Premium**
   - IAP status
   - Restore purchases
   - Manage subscription

4. **About**
   - App version
   - Privacy policy
   - Terms of service
   - Contact support

### 4.9 Export Modal

**Purpose**: Export blueprint or project in various formats

**Layout**:
- Format selection (PDF, Markdown, JSON)
- Options panel:
  - Include annotations (toggle)
  - Include layers (toggle)
  - Include metadata (toggle)
  - Quality selector (PDF only)
- Preview button
- Share/Save buttons

**Formats**:
1. **PDF**: High-quality PDF with annotations rendered
2. **Markdown**: Text-based format with annotation list
3. **JSON**: Structured data for integration

---

## 5. Visual System

### 5.1 Color Tokens

#### Light Theme
```typescript
const lightColors = {
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#4DA3FF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#3C3C43',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  border: '#C6C6C8',
  divider: '#E5E5EA',
  overlay: 'rgba(0, 0, 0, 0.4)',
};
```

#### Dark Theme
```typescript
const darkColors = {
  primary: '#0A84FF',
  primaryDark: '#0051D5',
  primaryLight: '#4DA3FF',
  secondary: '#5E5CE6',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#64D2FF',
  border: '#38383A',
  divider: '#2C2C2E',
  overlay: 'rgba(0, 0, 0, 0.6)',
};
```

### 5.2 Typography

**Font Family**:
- iOS: SF Pro Text / SF Pro Display
- Android: Roboto / Roboto Condensed

**Type Scale**:
```typescript
const typography = {
  displayLarge: { fontSize: 57, lineHeight: 64, fontWeight: '700' },
  displayMedium: { fontSize: 45, lineHeight: 52, fontWeight: '700' },
  displaySmall: { fontSize: 36, lineHeight: 44, fontWeight: '600' },
  headlineLarge: { fontSize: 32, lineHeight: 40, fontWeight: '600' },
  headlineMedium: { fontSize: 28, lineHeight: 36, fontWeight: '600' },
  headlineSmall: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
  titleLarge: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  titleMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  titleSmall: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  labelMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: '500' },
};
```

### 5.3 Spacing

**8pt Grid System**:
```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};
```

### 5.4 Iconography

**Vector Icons** rendered via Skia:
- Line style with 2px stroke
- 24x24pt standard size
- Consistent optical weight

**Icon Set**:
- Plus, Minus, Close, Checkmark
- Arrow (up, down, left, right)
- Layers, Eye (visible/hidden), Lock
- Share, Export, Delete
- Settings, Info, Search
- Grid, List, Filter, Sort

### 5.5 Elevation & Shadows

**Shadow Presets**:
```typescript
const shadows = {
  small: { shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, shadowOpacity: 0.1 },
  medium: { shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, shadowOpacity: 0.12 },
  large: { shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, shadowOpacity: 0.15 },
};
```

### 5.6 Border Radius

```typescript
const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
```

---

## 6. Motion & Interactions

### 6.1 Animation Principles

1. **Physics-Based**: Spring animations for natural feel
2. **Responsive**: Immediate feedback to user input
3. **Contextual**: Animations guide attention and communicate state
4. **Performance**: 60fps target on all devices

### 6.2 Gesture Vocabulary

| Gesture | Context | Action |
|---------|---------|--------|
| Tap | Buttons, cards | Select, activate |
| Long-press | Cards, items | Context menu, drag start |
| Double-tap | Canvas | Zoom toggle |
| Pan (1 finger) | Canvas, lists | Draw, scroll |
| Pan (2 fingers) | Canvas | Move viewport |
| Pinch | Canvas, images | Zoom in/out |
| Rotate | Canvas (advanced) | Rotate annotation |
| Swipe left/right | Cards | Quick actions |
| Swipe down | Modals | Dismiss |
| 3-finger tap | Editor | Undo |
| 3-finger swipe | Editor | Redo |

### 6.3 Animation Configurations

**Spring Presets**:
```typescript
const springs = {
  gentle: { stiffness: 120, damping: 20 },
  bouncy: { stiffness: 180, damping: 12 },
  snappy: { stiffness: 240, damping: 18 },
  stiff: { stiffness: 400, damping: 30 },
};
```

**Timing Presets**:
```typescript
const timings = {
  quick: { duration: 200, easing: Easing.out(Easing.cubic) },
  normal: { duration: 300, easing: Easing.out(Easing.cubic) },
  slow: { duration: 500, easing: Easing.out(Easing.cubic) },
};
```

### 6.4 Micro-Interactions

#### Press Feedback
- Scale to 0.96 on press start
- Spring back to 1.0 on release
- Duration: 220-360ms

#### Card Hover (iPad)
- Elevate with shadow increase
- Subtle scale to 1.02
- Border highlight

#### Loading States
- Skeleton screens with shimmer effect
- Spinner with rotation animation
- Progress bars with spring fill

#### Haptic Feedback
- Light impact on button press
- Medium impact on selection
- Heavy impact on errors
- Selection feedback on drag

### 6.5 Splash Screen Animation

**Sequence**:
1. **Particles Explode** (0-400ms):
   - 30-50 particles scatter from center
   - Velocity: random 2-5 units
   - Skia rendering with blur

2. **Logo Assembles** (400-1400ms):
   - Particles converge to logo shape
   - Spring physics (stiffness: 240, damping: 18)
   - Path morphing for smooth transition

3. **Fade Out** (1400-2000ms):
   - Logo and particles fade to 0
   - Simultaneous with app content fade-in

---

## 7. Local Data Model

### 7.1 Database Schema

#### Blueprint
```typescript
interface Blueprint {
  id: string; // UUID
  title: string;
  description?: string;
  imageUri: string; // Local file path
  thumbnailUri?: string; // Cached thumbnail
  width: number; // Image dimensions
  height: number;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Annotation
```typescript
interface Annotation {
  id: string;
  blueprintId: string; // Foreign key
  layerId: string; // Foreign key
  type: 'markup' | 'measurement' | 'note';
  data: string; // JSON serialized annotation data
  positionX: number;
  positionY: number;
  color: string;
  strokeWidth?: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Layer
```typescript
interface Layer {
  id: string;
  blueprintId: string;
  name: string;
  color: string; // Identifier color
  isVisible: boolean;
  isLocked: boolean;
  opacity: number; // 0-1
  order: number; // Display order
  createdAt: Date;
  updatedAt: Date;
}
```

#### Project
```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  thumbnailUri?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### ProjectBlueprint (Join Table)
```typescript
interface ProjectBlueprint {
  id: string;
  projectId: string;
  blueprintId: string;
  order: number;
  createdAt: Date;
}
```

### 7.2 Relationships

```
Project 1:N ProjectBlueprint N:1 Blueprint
Blueprint 1:N Layer
Blueprint 1:N Annotation
Layer 1:N Annotation
```

### 7.3 Indexes

- `Blueprint.createdAt` (DESC)
- `Blueprint.updatedAt` (DESC)
- `Blueprint.isFavorite` + `Blueprint.updatedAt`
- `Annotation.blueprintId`
- `Annotation.layerId`
- `Layer.blueprintId` + `Layer.order`
- `ProjectBlueprint.projectId`

---

## 8. State Management

### 8.1 Zustand Stores

#### Theme Store
```typescript
interface ThemeStore {
  mode: 'light' | 'dark' | 'auto';
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}
```

#### Blueprint Store
```typescript
interface BlueprintStore {
  selectedBlueprint: Blueprint | null;
  blueprints: Blueprint[];
  loadBlueprints: () => Promise<void>;
  createBlueprint: (data: CreateBlueprintInput) => Promise<Blueprint>;
  updateBlueprint: (id: string, data: UpdateBlueprintInput) => Promise<void>;
  deleteBlueprint: (id: string) => Promise<void>;
  searchBlueprints: (query: string) => Promise<Blueprint[]>;
}
```

#### Editor Store
```typescript
interface EditorStore {
  activeTool: Tool;
  activeLayer: Layer | null;
  layers: Layer[];
  annotations: Annotation[];
  canvasTransform: Transform;
  setActiveTool: (tool: Tool) => void;
  setActiveLayer: (layer: Layer) => void;
  addAnnotation: (annotation: CreateAnnotationInput) => Promise<void>;
  updateAnnotation: (id: string, data: UpdateAnnotationInput) => Promise<void>;
  deleteAnnotation: (id: string) => Promise<void>;
  undo: () => void;
  redo: () => void;
}
```

### 8.2 Selectors

```typescript
// Derived state with selectors
const visibleLayers = useEditorStore(state =>
  state.layers.filter(l => l.isVisible)
);

const annotationsByLayer = useEditorStore(state =>
  state.annotations.filter(a => a.layerId === state.activeLayer?.id)
);
```

---

## 9. Monetization (IAP)

### 9.1 Products

#### Non-Consumable
- **Pro Unlock** ($9.99): One-time purchase
  - Unlimited blueprints (free: 5)
  - Unlimited projects (free: 2)
  - Advanced export options
  - Priority support

#### Consumable
- **Premium Pack 1** ($2.99): 10 additional blueprint slots
- **Premium Pack 2** ($4.99): 20 additional blueprint slots

#### Subscriptions
- **Monthly** ($4.99/month): Pro features + cloud backup (future)
- **Yearly** ($39.99/year): Pro features + cloud backup (future)

### 9.2 Implementation

```typescript
// IAPService.ts
class IAPService {
  async initialize(): Promise<void>;
  async getProducts(): Promise<Product[]>;
  async purchaseProduct(productId: string): Promise<Purchase>;
  async restorePurchases(): Promise<Purchase[]>;
  async isPremiumUnlocked(): Promise<boolean>;
}
```

### 9.3 Paywall Placement

- After 5th blueprint creation
- On project creation beyond limit
- On advanced export attempt
- Settings → Premium section

---

## 10. Performance Budgets

### 10.1 Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| App Launch (cold) | < 2s | Time to interactive |
| App Launch (warm) | < 500ms | Time to interactive |
| Animation FPS | 60fps | Reanimated profiler |
| Interaction Response | < 100ms | Touch to visual feedback |
| List Scroll | 60fps | FlatList performance |
| Blueprint Load | < 500ms | Image to display |
| Database Query | < 50ms | SQLite query time |
| Export (PDF) | < 2s | For typical blueprint |
| Memory Usage | < 150MB | Typical session |
| Binary Size (iOS) | < 30MB | App Store download |

### 10.2 Optimization Strategies

1. **Images**:
   - Generate thumbnails on import
   - Lazy load full-resolution images
   - Cache decoded images in memory
   - Use progressive JPEG for previews

2. **Animations**:
   - Run on UI thread with Reanimated worklets
   - Use `useAnimatedStyle` for transforms
   - Avoid expensive operations in animation loop

3. **Lists**:
   - Use `FlatList` with `getItemLayout`
   - Implement `windowSize` and `maxToRenderPerBatch`
   - Memoize list items with `React.memo`

4. **Database**:
   - Batch inserts/updates
   - Use prepared statements
   - Index frequently queried columns
   - Paginate large result sets

5. **Bundle Size**:
   - Code splitting for large features
   - Tree-shaking unused dependencies
   - Hermes bytecode compilation

---

## 11. Offline-First Guarantees

### 11.1 Design Principles

1. **No Network Calls**: Zero HTTP requests in production code
2. **Local Storage**: All data persists to SQLite + file system
3. **Deterministic**: App behavior identical offline and online
4. **Export-Only Sharing**: User explicitly exports/shares data

### 11.2 Data Persistence

**SQLite Database**:
- Transaction-based writes
- ACID compliance
- Encrypted with SQLCipher (optional)
- Regular backups to device storage

**File System**:
- Blueprint images in Documents directory
- Thumbnails in Caches directory
- Exports in temporary directory (cleared after share)

**AsyncStorage**:
- User preferences
- Theme settings
- Onboarding state
- IAP receipts (cached)

### 11.3 Error Handling

```typescript
// Graceful degradation
try {
  await database.write(/* ... */);
} catch (error) {
  // Show user-friendly error
  // Queue for retry
  // Log locally (no external logging)
}
```

---

## Appendix 1: Expanded UI Component Catalog

### Component 1.1
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication
- **Props**:
  - prop1: `imageUri` (string)
  - prop2: `color` (string)
  - prop3: `length` (number)
  - prop4: `enum` (string)
  - prop5: `imageUri` (string)
  - prop6: `length` (number)
  - prop7: `number` (number)
  - prop8: `angle` (number)
- **Gestures**: edgeSwipe, pan, hover, drag
- **Animation hooks** (Reanimated worklets): `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order
- **Offline behavior**: deterministic rendering with cached assets only

### Component 1.2
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication
- **Props**:
  - prop1: `number` (number)
  - prop2: `boolean` (boolean)
  - prop3: `length` (number)
  - prop4: `number` (number)
  - prop5: `length` (number)
  - prop6: `length` (number)
  - prop7: `enum` (string)
  - prop8: `enum` (string)
- **Gestures**: longPress, edgeSwipe, pressAndHold, pressAndHold
- **Animation hooks**: `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order
- **Offline behavior**: deterministic rendering with cached assets only

### Component 1.3
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication
- **Props**:
  - prop1: `icon` (string)
  - prop2: `number` (number)
  - prop3: `number` (number)
  - prop4: `opacity` (number)
  - prop5: `length` (number)
  - prop6: `icon` (string)
  - prop7: `string` (string)
  - prop8: `enum` (string)
- **Gestures**: edgeSwipe, pinch, fling, longPress
- **Animation hooks**: `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order
- **Offline behavior**: deterministic rendering with cached assets only

### Components 1.4 - 1.70

[Following the same pattern, each component (1.4 through 1.70) includes:]
- Purpose statement
- Props with types (8 props each with mix of: imageUri, color, length, number, angle, icon, string, enum, boolean, opacity)
- Gestures (various combinations of: tap, doubleTap, longPress, pan, pinch, rotate, swipe, fling, drag, hover, pressAndHold, edgeSwipe, scroll)
- Animation hooks (onFocusTransition, onPressScaleSpring, onDismissSwipe, onRevealFling)
- Skia usage details
- Accessibility features
- Offline behavior

_[Components 1.4-1.70 follow identical structure with varying prop types and gesture combinations as specified in the original SDD]_

---

## Appendix 2: Motion Specification Snippets

### Motion 1-1
- **Trigger**: user gesture
- **Duration**: 220–360ms (eased); spring stiffness 180–320, damping 14–22
- **Reanimated pseudo-code**:
  ```typescript
  const t = useSharedValue(0);
  const onGesture = useAnimatedGestureHandler({
    onStart: () => {
      t.value = withSpring(1, { stiffness: 240, damping: 18 })
    },
    onEnd: () => {
      t.value = withTiming(0, { duration: 260, easing: Easing.out(Easing.cubic) })
    },
  });
  const style = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 + 0.06 * t.value },
      { translateY: -8 * t.value }
    ],
    opacity: 0.75 + 0.25 * t.value
  }));
  ```
- **Skia drawing**: interpolate shadow sigma and elevation with `t` for depth illusion; use clipped rounded rectangles for smooth reveals

### Motion 1-2 through Motion 1-10

[Following the same pattern for motions 1-2 through 1-10, each includes:]
- Trigger specification
- Duration and spring configuration
- Reanimated worklet pseudo-code
- Skia drawing instructions

_[Motions 1-2 through 1-10 use the same spring/timing configuration with variations in transform and opacity values]_

---

## Appendix 3: Local Data Samples

### Sample 1.1
```json
{
  "id": "1-1",
  "title": "Local entity 1",
  "updatedAt": "2025-03-02T10:00:00Z",
  "offline": true
}
```

### Sample 1.2
```json
{
  "id": "1-2",
  "title": "Local entity 2",
  "updatedAt": "2025-03-03T10:00:00Z",
  "offline": true
}
```

### Samples 1.3 - 1.20

[Following the same pattern, samples 1.3 through 1.20 include incrementing IDs, titles, and dates]

_[Samples continue with sequential IDs from 1-3 to 1-20, dates incrementing daily from 2025-03-04 to 2025-03-21]_

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-XX | Development Team | Initial production-ready SDD |

---

**End of Software Design Document**

This SDD serves as the authoritative specification for Blueprints Pro. All implementation decisions should reference this document. Any deviations must be documented and approved through the change control process.
