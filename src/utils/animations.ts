/**
 * Animation Utilities
 * Reusable animation configurations and helpers
 */

import {Easing, WithSpringConfig, WithTimingConfig} from 'react-native-reanimated';

// Spring configurations
export const SpringPresets = {
  gentle: {
    stiffness: 120,
    damping: 20,
  } as WithSpringConfig,

  bouncy: {
    stiffness: 180,
    damping: 12,
  } as WithSpringConfig,

  snappy: {
    stiffness: 240,
    damping: 18,
  } as WithSpringConfig,

  stiff: {
    stiffness: 400,
    damping: 30,
  } as WithSpringConfig,
};

// Timing configurations
export const TimingPresets = {
  quick: {
    duration: 200,
    easing: Easing.out(Easing.cubic),
  } as WithTimingConfig,

  normal: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  } as WithTimingConfig,

  slow: {
    duration: 500,
    easing: Easing.out(Easing.cubic),
  } as WithTimingConfig,

  linear: {
    duration: 300,
    easing: Easing.linear,
  } as WithTimingConfig,
};

// Easing functions
export const EasingFunctions = {
  easeInOut: Easing.inOut(Easing.cubic),
  easeOut: Easing.out(Easing.cubic),
  easeIn: Easing.in(Easing.cubic),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1.5),
};

// Scale presets
export const ScalePresets = {
  press: 0.96,
  hover: 1.02,
  active: 1.05,
};

// Opacity presets
export const OpacityPresets = {
  hidden: 0,
  disabled: 0.4,
  dimmed: 0.6,
  visible: 1,
};

// Translation presets
export const TranslationPresets = {
  small: 8,
  medium: 16,
  large: 32,
};

// Duration presets (ms)
export const DurationPresets = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 400,
  verySlow: 600,
};

// Helper to interpolate values
export const interpolate = (
  value: number,
  inputRange: number[],
  outputRange: number[]
): number => {
  'worklet';

  if (value <= inputRange[0]) return outputRange[0];
  if (value >= inputRange[inputRange.length - 1])
    return outputRange[outputRange.length - 1];

  for (let i = 1; i < inputRange.length; i++) {
    if (value <= inputRange[i]) {
      const ratio =
        (value - inputRange[i - 1]) / (inputRange[i] - inputRange[i - 1]);
      return outputRange[i - 1] + ratio * (outputRange[i] - outputRange[i - 1]);
    }
  }

  return outputRange[outputRange.length - 1];
};

// Helper to clamp values
export const clamp = (value: number, min: number, max: number): number => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

// Helper for elastic scrolling effect
export const rubberBandClamp = (
  value: number,
  min: number,
  max: number,
  dampingFactor: number = 0.15
): number => {
  'worklet';

  if (value < min) {
    return min - (min - value) * dampingFactor;
  }

  if (value > max) {
    return max + (value - max) * dampingFactor;
  }

  return value;
};

// Helper for momentum calculation
export const calculateMomentum = (
  velocity: number,
  friction: number = 0.95
): number => {
  'worklet';
  return velocity * friction;
};

// Helper for spring physics
export const springPhysics = (
  position: number,
  target: number,
  velocity: number,
  stiffness: number = 100,
  damping: number = 10
): {position: number; velocity: number} => {
  'worklet';

  const force = (target - position) * stiffness;
  const dampingForce = velocity * damping;
  const acceleration = (force - dampingForce) / 1000;

  const newVelocity = velocity + acceleration;
  const newPosition = position + newVelocity;

  return {
    position: newPosition,
    velocity: newVelocity,
  };
};
