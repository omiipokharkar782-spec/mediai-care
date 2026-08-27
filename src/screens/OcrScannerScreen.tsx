import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Button, Text } from '../components';
import { clearOcr, runOcr } from '../store/slices/aiSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { colors, motion, radius, spacing } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'OcrScanner'>;

const FRAME_HEIGHT = 300;

export function OcrScannerScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { scanning, ocr } = useAppSelector((s) => s.ai);
  const sweep = useSharedValue(0);

  useEffect(() => {
    sweep.value = withRepeat(
      withSequence(
        withTiming(1, { duration: motion.duration.loop, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: motion.duration.loop, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    return () => {
      dispatch(clearOcr());
    };
  }, [dispatch, sweep]);

  const laserStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sweep.value * (FRAME_HEIGHT - 6) }],
    opacity: scanning ? 1 : 0.4,
  }));

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="h1" tone="inverse">
          Prescription scanner
        </Text>
        <Text tone="tertiary">Handwritten Rx is parsed into structured drug, dosage and frequency fields.</Text>

        <View style={styles.frame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
          <Animated.View style={[styles.laser, laserStyle]} />
        </View>

        <Button label={scanning ? 'Scanning…' : 'Capture & extract'} disabled={scanning} onPress={() => dispatch(runOcr())} />

        {ocr ? (
          <Animated.View entering={FadeIn.duration(motion.duration.base)} style={styles.result}>
            <Text variant="h2" tone="inverse">
              Extracted ({Math.round(ocr.confidence * 100)}% confidence)
            </Text>
            {ocr.medicines.map((medicine) => (
              <View key={medicine.id} style={styles.resultRow}>
                <Text tone="inverse">{medicine.name}</Text>
                <Text variant="caption" tone="tertiary">
                  {medicine.dosage} · {medicine.frequency} · {medicine.durationDays} days
                </Text>
              </View>
            ))}
            <Text variant="caption" tone="tertiary">
              {ocr.rawText}
            </Text>
          </Animated.View>
        ) : null}

        <Button label="Close" variant="ghost" onPress={() => navigation.goBack()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.aiDark.navy },
  content: { padding: spacing.lg, gap: spacing.base, paddingTop: spacing.xxl },
  frame: {
    height: FRAME_HEIGHT,
    borderRadius: radius.xl,
    backgroundColor: colors.aiDark.navyElevated,
    overflow: 'hidden',
  },
  corner: { position: 'absolute', width: 34, height: 34, borderColor: colors.secondary.teal },
  tl: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: radius.md },
  tr: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: radius.md },
  bl: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: radius.md },
  br: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: radius.md },
  laser: { position: 'absolute', left: 12, right: 12, height: 3, borderRadius: 2, backgroundColor: colors.secondary.teal },
  result: {
    gap: spacing.sm,
    padding: spacing.base,
    borderRadius: radius.lg,
    backgroundColor: colors.aiDark.navyElevated,
  },
  resultRow: { gap: 2 },
});
