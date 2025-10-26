import React, {ReactNode} from 'react';
import {View, StyleSheet, ViewStyle, Pressable} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import {Canvas, RoundedRect, Shadow} from '@shopify/react-native-skia';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
  elevation?: number;
  interactive?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  onLongPress,
  style,
  elevation = 2,
  interactive = true,
}) => {
  const theme = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, 0.98]);
    const translateY = interpolate(pressed.value, [0, 1], [0, 2]);

    return {
      transform: [{scale}, {translateY}],
    };
  });

  const handlePressIn = () => {
    if (interactive && onPress) {
      pressed.value = withSpring(1, {
        stiffness: 240,
        damping: 18,
      });
    }
  };

  const handlePressOut = () => {
    if (interactive && onPress) {
      pressed.value = withSpring(0, {
        stiffness: 240,
        damping: 18,
      });
    }
  };

  const shadowOpacity = theme.isDark ? 0.3 : 0.1;

  return (
    <AnimatedPressable
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.cardBackground,
          shadowColor: theme.colors.shadow,
          shadowOffset: {width: 0, height: elevation},
          shadowOpacity: shadowOpacity,
          shadowRadius: elevation * 2,
          elevation: elevation,
        },
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'none'}>
      {children}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
  },
});
