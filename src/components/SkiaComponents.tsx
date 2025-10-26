import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Canvas,
  Circle,
  RoundedRect,
  Shadow,
  Path,
  LinearGradient,
  vec,
  Skia,
  BlurMask,
  Group,
  Paint,
  useValue,
  runTiming,
  Easing,
} from '@shopify/react-native-skia';
import {useTheme} from '@hooks/useTheme';

// Elevated Card with Skia Shadow
interface SkiaElevatedCardProps {
  width: number;
  height: number;
  elevation?: number;
  borderRadius?: number;
}

export const SkiaElevatedCard: React.FC<SkiaElevatedCardProps> = ({
  width,
  height,
  elevation = 8,
  borderRadius = 16,
}) => {
  const theme = useTheme();

  return (
    <Canvas style={{width, height}}>
      <RoundedRect x={0} y={0} width={width} height={height} r={borderRadius}>
        <Shadow
          dx={0}
          dy={elevation}
          blur={elevation * 2}
          color={theme.isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.15)'}
        />
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, height)}
          colors={
            theme.isDark
              ? ['rgba(40, 40, 40, 1)', 'rgba(20, 20, 20, 1)']
              : ['rgba(255, 255, 255, 1)', 'rgba(245, 245, 247, 1)']
          }
        />
      </RoundedRect>
    </Canvas>
  );
};

// Gradient Background
interface GradientBackgroundProps {
  width: number;
  height: number;
  colors: string[];
  angle?: number;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  width,
  height,
  colors,
  angle = 0,
}) => {
  const radians = (angle * Math.PI) / 180;
  const startX = width / 2 - (Math.cos(radians) * width) / 2;
  const startY = height / 2 - (Math.sin(radians) * height) / 2;
  const endX = width / 2 + (Math.cos(radians) * width) / 2;
  const endY = height / 2 + (Math.sin(radians) * height) / 2;

  return (
    <Canvas style={{width, height}}>
      <RoundedRect x={0} y={0} width={width} height={height} r={0}>
        <LinearGradient
          start={vec(startX, startY)}
          end={vec(endX, endY)}
          colors={colors}
        />
      </RoundedRect>
    </Canvas>
  );
};

// Icon with Skia (Vector rendering)
interface SkiaIconProps {
  size: number;
  color: string;
  name: 'checkmark' | 'close' | 'plus' | 'minus' | 'arrow-right' | 'arrow-left';
}

export const SkiaIcon: React.FC<SkiaIconProps> = ({size, color, name}) => {
  const getPath = () => {
    const center = size / 2;
    const path = Skia.Path.Make();

    switch (name) {
      case 'checkmark':
        path.moveTo(size * 0.2, center);
        path.lineTo(size * 0.4, size * 0.7);
        path.lineTo(size * 0.8, size * 0.3);
        break;
      case 'close':
        path.moveTo(size * 0.2, size * 0.2);
        path.lineTo(size * 0.8, size * 0.8);
        path.moveTo(size * 0.8, size * 0.2);
        path.lineTo(size * 0.2, size * 0.8);
        break;
      case 'plus':
        path.moveTo(center, size * 0.2);
        path.lineTo(center, size * 0.8);
        path.moveTo(size * 0.2, center);
        path.lineTo(size * 0.8, center);
        break;
      case 'minus':
        path.moveTo(size * 0.2, center);
        path.lineTo(size * 0.8, center);
        break;
      case 'arrow-right':
        path.moveTo(size * 0.2, size * 0.3);
        path.lineTo(size * 0.7, center);
        path.lineTo(size * 0.2, size * 0.7);
        break;
      case 'arrow-left':
        path.moveTo(size * 0.8, size * 0.3);
        path.lineTo(size * 0.3, center);
        path.lineTo(size * 0.8, size * 0.7);
        break;
    }

    return path;
  };

  return (
    <Canvas style={{width: size, height: size}}>
      <Path
        path={getPath()}
        color={color}
        style="stroke"
        strokeWidth={2}
        strokeCap="round"
        strokeJoin="round"
      />
    </Canvas>
  );
};

// Particle System (for splash screen)
interface ParticleSystemProps {
  width: number;
  height: number;
  particleCount?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  width,
  height,
  particleCount = 50,
}) => {
  const theme = useTheme();
  const particles = React.useMemo(
    () =>
      Array.from({length: particleCount}, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4 + 1,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      })),
    [width, height, particleCount]
  );

  return (
    <Canvas style={{width, height}}>
      {particles.map((particle, index) => (
        <Circle
          key={index}
          cx={particle.x}
          cy={particle.y}
          r={particle.radius}
          color={theme.colors.primary}
          opacity={0.6}>
          <BlurMask blur={2} style="normal" />
        </Circle>
      ))}
    </Canvas>
  );
};

// Morphing Shape
interface MorphingShapeProps {
  width: number;
  height: number;
  progress: number; // 0 to 1
}

export const MorphingShape: React.FC<MorphingShapeProps> = ({
  width,
  height,
  progress,
}) => {
  const theme = useTheme();

  const getPath = () => {
    const path = Skia.Path.Make();
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    // Interpolate between circle and square
    const corners = 4;
    const angle = (Math.PI * 2) / corners;

    path.moveTo(
      centerX + radius * Math.cos(0),
      centerY + radius * Math.sin(0)
    );

    for (let i = 1; i <= corners; i++) {
      const currentAngle = angle * i;
      const nextX = centerX + radius * Math.cos(currentAngle);
      const nextY = centerY + radius * Math.sin(currentAngle);

      if (progress < 0.5) {
        // Circle to square
        const t = progress * 2;
        path.lineTo(nextX, nextY);
      } else {
        // Square to star
        const t = (progress - 0.5) * 2;
        const innerRadius = radius * (1 - t * 0.5);
        const midAngle = currentAngle - angle / 2;
        const midX = centerX + innerRadius * Math.cos(midAngle);
        const midY = centerY + innerRadius * Math.sin(midAngle);
        path.lineTo(midX, midY);
        path.lineTo(nextX, nextY);
      }
    }

    path.close();
    return path;
  };

  return (
    <Canvas style={{width, height}}>
      <Path path={getPath()} color={theme.colors.primary}>
        <Shadow dx={0} dy={4} blur={8} color="rgba(0, 0, 0, 0.2)" />
      </Path>
    </Canvas>
  );
};
