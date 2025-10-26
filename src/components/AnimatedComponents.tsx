import React from 'react';
import {View, ViewStyle, TextStyle, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  interpolate,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TapGestureHandler,
  LongPressGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  FlingGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {useTheme} from '@hooks/useTheme';

// Reanimated Spring Configuration
export const SPRING_CONFIG = {
  stiffness: 240,
  damping: 18,
};

// Reanimated Timing Configuration
export const TIMING_CONFIG = {
  duration: 260,
  easing: Easing.out(Easing.cubic),
};

// Motion Worklets
export const onPressScaleSpring = (scale: Animated.SharedValue<number>) => {
  'worklet';
  scale.value = withSpring(0.96, SPRING_CONFIG);
};

export const onReleaseScaleSpring = (scale: Animated.SharedValue<number>) => {
  'worklet';
  scale.value = withSpring(1, SPRING_CONFIG);
};

export const onFocusTransition = (
  opacity: Animated.SharedValue<number>,
  translateY: Animated.SharedValue<number>
) => {
  'worklet';
  opacity.value = withTiming(1, TIMING_CONFIG);
  translateY.value = withSpring(0, SPRING_CONFIG);
};

export const onDismissSwipe = (
  translateX: Animated.SharedValue<number>,
  opacity: Animated.SharedValue<number>,
  threshold: number
) => {
  'worklet';
  if (Math.abs(translateX.value) > threshold) {
    translateX.value = withTiming(
      translateX.value > 0 ? 500 : -500,
      TIMING_CONFIG
    );
    opacity.value = withTiming(0, TIMING_CONFIG);
    return true;
  } else {
    translateX.value = withSpring(0, SPRING_CONFIG);
    return false;
  }
};

export const onRevealFling = (
  translateY: Animated.SharedValue<number>,
  revealed: Animated.SharedValue<number>
) => {
  'worklet';
  if (translateY.value < -50) {
    revealed.value = withSpring(1, SPRING_CONFIG);
  } else {
    revealed.value = withSpring(0, SPRING_CONFIG);
  }
};

// Animated Component with Press Scale
interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  onPress,
  style,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.75);

  const tapGestureEvent = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onStart: () => {
      scale.value = withSpring(0.96, SPRING_CONFIG);
      opacity.value = withTiming(1, {duration: 100});
    },
    onEnd: () => {
      scale.value = withSpring(1, SPRING_CONFIG);
      opacity.value = withTiming(0.75, {duration: 100});
      if (onPress) {
        runOnJS(onPress)();
      }
    },
    onFail: () => {
      scale.value = withSpring(1, SPRING_CONFIG);
      opacity.value = withTiming(0.75, {duration: 100});
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}, {translateY: -8 * (opacity.value - 0.75) * 4}],
    opacity: opacity.value,
  }));

  return (
    <TapGestureHandler onGestureEvent={tapGestureEvent}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </TapGestureHandler>
  );
};

// Swipeable Component
interface SwipeableComponentProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  style?: ViewStyle;
}

export const SwipeableComponent: React.FC<SwipeableComponentProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  style,
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
    },
    onActive: (event, context: any) => {
      translateX.value = context.startX + event.translationX;
      opacity.value = interpolate(
        Math.abs(translateX.value),
        [0, threshold],
        [1, 0.5]
      );
    },
    onEnd: (event) => {
      const shouldDismiss = onDismissSwipe(translateX, opacity, threshold);
      if (shouldDismiss) {
        if (event.translationX > 0 && onSwipeRight) {
          runOnJS(onSwipeRight)();
        } else if (event.translationX < 0 && onSwipeLeft) {
          runOnJS(onSwipeLeft)();
        }
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
    opacity: opacity.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

// Pinchable/Zoomable Component
interface PinchableComponentProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  style?: ViewStyle;
}

export const PinchableComponent: React.FC<PinchableComponentProps> = ({
  children,
  minScale = 0.5,
  maxScale = 3,
  style,
}) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startScale = savedScale.value;
    },
    onActive: (event, context: any) => {
      const newScale = context.startScale * event.scale;
      scale.value = Math.max(minScale, Math.min(maxScale, newScale));
    },
    onEnd: () => {
      savedScale.value = scale.value;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <PinchGestureHandler onGestureEvent={pinchGestureEvent}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </PinchGestureHandler>
  );
};
