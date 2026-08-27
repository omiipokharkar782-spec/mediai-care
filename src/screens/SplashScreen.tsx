import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { Button, Card, IconTile, Text } from '../components';
import { colors, diagonal, gradientStops, motion, spacing } from '../theme';
import type { AuthStackParamList } from '../navigation/types';
import type { Role } from '../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const roles: { role: Role; title: string; blurb: string; icon: 'heart-outline' | 'medkit-outline' | 'shield-checkmark-outline'; tint: string }[] = [
  { role: 'patient', title: 'I am a Patient', blurb: 'Records, reminders and an AI health companion', icon: 'heart-outline', tint: colors.pastel.peach },
  { role: 'doctor', title: 'I am a Doctor', blurb: 'Prescribe, scan and review patients faster', icon: 'medkit-outline', tint: colors.pastel.mint },
  { role: 'admin', title: 'I am an Admin', blurb: 'Compliance, audit logs and onboarding', icon: 'shield-checkmark-outline', tint: colors.pastel.lavender },
];

export function SplashScreen({ navigation }: Props) {
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, { duration: motion.duration.slow, easing: Easing.out(Easing.cubic) });
    logoOpacity.value = withTiming(1, { duration: motion.duration.slow });
  }, [logoOpacity, logoScale]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradientStops.brand} start={diagonal.start} end={diagonal.end} style={styles.glow} />
      <Animated.View style={[styles.brand, logoStyle]}>
        <IconTile name="pulse-outline" tint={colors.surface.base} color={colors.primary.blue} size={84} />
        <Text variant="display">MediAI Care</Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(motion.duration.instant).duration(motion.duration.base)}>
        <Text tone="secondary" align="center">
          Hospital-grade records with the warmth of a wellness companion.
        </Text>
      </Animated.View>

      <View style={styles.roles}>
        {roles.map((item, index) => (
          <Animated.View
            key={item.role}
            entering={FadeInDown.delay(200 + index * motion.stagger.tagline).duration(motion.duration.base)}
          >
            <Card style={styles.roleCard} level="sm">
              <IconTile name={item.icon} tint={item.tint} color={colors.text.primary} />
              <View style={styles.roleText}>
                <Text variant="bodyStrong">{item.title}</Text>
                <Text variant="caption" tone="secondary">
                  {item.blurb}
                </Text>
              </View>
              <Button
                label="Continue"
                fullWidth={false}
                variant={item.role === 'patient' ? 'primary' : 'secondary'}
                onPress={() => navigation.navigate('Login', { role: item.role })}
              />
            </Card>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.muted, padding: spacing.lg, justifyContent: 'center', gap: spacing.lg },
  glow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.12 },
  brand: { alignItems: 'center', gap: spacing.md },
  roles: { gap: spacing.md },
  roleCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  roleText: { flex: 1, gap: 2 },
});
