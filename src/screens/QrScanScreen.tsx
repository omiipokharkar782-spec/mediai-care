import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Button, Text } from '../components';
import { colors, motion, radius, spacing } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'QrScan'>;

const FRAME = 260;

export function QrScanScreen({ navigation }: Props) {
  const sweep = useSharedValue(0);
  const glow = useSharedValue(0.4);

  useEffect(() => {
    sweep.value = withRepeat(
      withSequence(
        withTiming(1, { duration: motion.duration.loop, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: motion.duration.loop, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    glow.value = withRepeat(withTiming(1, { duration: motion.duration.loop }), -1, true);
  }, [glow, sweep]);

  const laserStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sweep.value * (FRAME - 4) }] }));
  const frameStyle = useAnimatedStyle(() => ({ opacity: 0.5 + glow.value * 0.5 }));

  return (
    <View style={styles.root}>
      <Text variant="h2" tone="inverse" align="center">
        Scan patient QR
      </Text>
      <Text tone="tertiary" align="center">
        Hold the code inside the frame — the record opens automatically.
      </Text>

      <View style={styles.frameWrapper}>
        <Animated.View style={[styles.frame, frameStyle]} />
        <Animated.View style={[styles.laser, laserStyle]} />
      </View>

      <Button label="Enter ID manually" variant="secondary" onPress={() => navigation.goBack()} />
      <Button label="Close" variant="ghost" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.aiDark.navy, padding: spacing.lg, gap: spacing.base, justifyContent: 'center' },
  frameWrapper: { alignSelf: 'center', width: FRAME, height: FRAME, marginVertical: spacing.xl },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.xl,
    borderWidth: 3,
    borderColor: colors.secondary.teal,
  },
  laser: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.secondary.teal,
  },
});
