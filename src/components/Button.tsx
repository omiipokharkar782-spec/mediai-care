import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, componentTokens, diagonal, elevation, gradientStops, motion } from '../theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  left?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ label, onPress, variant = 'primary', disabled, fullWidth = true, left, style }: Props) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(1 - pressed.value * (1 - componentTokens.button.pressScale), {
          duration: motion.duration.instant,
        }),
      },
    ],
  }));

  const tone = variant === 'ghost' || variant === 'secondary' ? 'brand' : 'inverse';

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      style={[
        styles.base,
        fullWidth && styles.fullWidth,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        disabled && styles.disabled,
        variant === 'primary' && elevation('sm'),
        animatedStyle,
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={gradientStops.primaryCta}
          start={diagonal.start}
          end={diagonal.end}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={styles.content}>
        {left}
        <Text variant="bodyStrong" tone={variant === 'danger' ? 'inverse' : tone}>
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: componentTokens.button.height,
    borderRadius: componentTokens.button.radius,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  fullWidth: { alignSelf: 'stretch' },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  secondary: { borderWidth: 1.5, borderColor: colors.primary.blue, backgroundColor: 'transparent' },
  ghost: { backgroundColor: 'transparent', height: 40 },
  danger: { backgroundColor: colors.status.danger },
  disabled: { opacity: 0.45 },
});
