import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { colors, motion, radius } from '../theme';

interface Props {
  height?: number;
  width?: ViewStyle['width'];
  style?: ViewStyle;
}

export function Skeleton({ height = 16, width = '100%', style }: Props) {
  const shimmer = useSharedValue(0.4);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: motion.duration.loop, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [shimmer]);

  const animated = useAnimatedStyle(() => ({ opacity: shimmer.value }));

  return <Animated.View style={[styles.base, { height, width }, animated, style]} />;
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton height={18} width="60%" />
      <Skeleton height={12} width="90%" />
      <Skeleton height={12} width="40%" />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.surface.border, borderRadius: radius.sm },
  card: { gap: 10, padding: 16, borderRadius: radius.lg, backgroundColor: colors.surface.base },
});
