import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../components';
import { colors, componentTokens, diagonal, elevation, gradientStops, motion } from '../theme';

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  PatientHome: 'home-outline',
  DoctorHome: 'grid-outline',
  AdminHome: 'stats-chart-outline',
  Reports: 'document-text-outline',
  Patients: 'people-outline',
  Appointments: 'calendar-outline',
  Profile: 'person-outline',
  AiTools: 'sparkles',
};

const labels: Record<string, string> = {
  PatientHome: 'Home',
  DoctorHome: 'Dashboard',
  AdminHome: 'Overview',
  Reports: 'Reports',
  Patients: 'Patients',
  Appointments: 'Visits',
  Profile: 'Profile',
  AiTools: 'AI',
};

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const halo = useSharedValue(0);

  useEffect(() => {
    halo.value = withRepeat(
      withTiming(1, { duration: motion.duration.loop, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [halo]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + halo.value * 0.35,
    transform: [{ scale: 1 + halo.value * 0.12 }],
  }));

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <View style={[styles.bar, elevation('lg')]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const isCenter = route.name === 'AiTools';
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          if (isCenter) {
            return (
              <Pressable key={route.key} onPress={onPress} style={styles.centerSlot} accessibilityRole="button">
                <Animated.View style={[styles.halo, haloStyle]} />
                <LinearGradient
                  colors={gradientStops.aiHalo}
                  start={diagonal.start}
                  end={diagonal.end}
                  style={[styles.fab, elevation('md')]}
                >
                  <Ionicons name={icons.AiTools} size={26} color={colors.text.inverse} />
                </LinearGradient>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              style={styles.slot}
            >
              <Ionicons
                name={icons[route.name] ?? 'ellipse-outline'}
                size={22}
                color={focused ? colors.primary.blue : colors.text.tertiary}
              />
              <Text variant="caption" tone={focused ? 'brand' : 'tertiary'}>
                {labels[route.name] ?? route.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.base,
    borderRadius: componentTokens.bottomNav.radius,
    height: componentTokens.bottomNav.height,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
  slot: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  centerSlot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: {
    width: componentTokens.bottomNav.fabSize,
    height: componentTokens.bottomNav.fabSize,
    borderRadius: componentTokens.bottomNav.fabSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  halo: {
    position: 'absolute',
    width: componentTokens.bottomNav.fabSize + 16,
    height: componentTokens.bottomNav.fabSize + 16,
    borderRadius: (componentTokens.bottomNav.fabSize + 16) / 2,
    backgroundColor: colors.secondary.teal,
    marginBottom: 28,
  },
});
