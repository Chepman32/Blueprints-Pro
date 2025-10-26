/**
 * Physics-Based Animated Splash Screen
 * Features particle system with Skia and Reanimated physics
 */

import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {Canvas, Circle, Group, BlurMask, LinearGradient, vec} from '@shopify/react-native-skia';
import {useTheme} from '@hooks/useTheme';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({onComplete}) => {
  const theme = useTheme();

  // Animation values
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const particlesOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);

  // Generate particles
  const particles: Particle[] = React.useMemo(() => {
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;
    const particleCount = 30;

    return Array.from({length: particleCount}, (_, i) => {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 2 + Math.random() * 3;

      return {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        radius: 3 + Math.random() * 5,
        color: theme.colors.primary,
      };
    });
  }, [theme.colors.primary]);

  useEffect(() => {
    // Phase 1: Logo explosion (particles scatter)
    particlesOpacity.value = withTiming(1, {duration: 300});

    // Phase 2: Logo assembles with spring physics
    logoScale.value = withDelay(
      400,
      withSequence(
        withSpring(1.2, {
          stiffness: 180,
          damping: 12,
        }),
        withSpring(1, {
          stiffness: 240,
          damping: 18,
        })
      )
    );

    logoOpacity.value = withDelay(
      400,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      })
    );

    logoRotation.value = withDelay(
      400,
      withSpring(360, {
        stiffness: 100,
        damping: 20,
      })
    );

    // Phase 3: Particles fade out
    particlesOpacity.value = withDelay(
      1000,
      withTiming(0, {duration: 400})
    );

    // Phase 4: Complete and fade out
    overlayOpacity.value = withDelay(
      2000,
      withTiming(
        0,
        {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            runOnJS(onComplete)();
          }
        }
      )
    );
  }, [
    logoScale,
    logoOpacity,
    logoRotation,
    particlesOpacity,
    overlayOpacity,
    onComplete,
  ]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: logoScale.value},
      {rotate: `${logoRotation.value}deg`},
    ],
    opacity: logoOpacity.value,
  }));

  const particlesAnimatedStyle = useAnimatedStyle(() => ({
    opacity: particlesOpacity.value,
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: theme.colors.background},
        overlayAnimatedStyle,
      ]}>
      {/* Particles */}
      <Animated.View style={[StyleSheet.absoluteFill, particlesAnimatedStyle]}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Group>
            {particles.map((particle, index) => {
              // Animate particle position using time-based calculation
              const time = index * 0.1;
              const x = particle.x + particle.vx * 50 * Math.sin(time);
              const y = particle.y + particle.vy * 50 * Math.sin(time);

              return (
                <Circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={particle.radius}
                  color={particle.color}
                  opacity={0.8}>
                  <BlurMask blur={3} style="normal" />
                </Circle>
              );
            })}
          </Group>
        </Canvas>
      </Animated.View>

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Canvas style={{width: 120, height: 120}}>
          <Group>
            {/* Logo shape with gradient */}
            <Circle cx={60} cy={60} r={50}>
              <LinearGradient
                start={vec(0, 0)}
                end={vec(120, 120)}
                colors={[theme.colors.primary, theme.colors.secondary]}
              />
              <BlurMask blur={2} style="solid" />
            </Circle>

            {/* Inner circle */}
            <Circle cx={60} cy={60} r={35} color={theme.colors.background} />

            {/* Blueprint lines */}
            <Circle cx={60} cy={60} r={30} color={theme.colors.primary} style="stroke" strokeWidth={2} />
            <Circle cx={60} cy={60} r={20} color={theme.colors.primary} style="stroke" strokeWidth={2} />
          </Group>
        </Canvas>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
