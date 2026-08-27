import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card, CountUp, IconTile, Screen, SkeletonCard, StatusBadge, Text } from '../components';
import { loadPatientDashboard } from '../store/slices/patientSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { appointments } from '../mock/data';
import { colors, motion, spacing } from '../theme';
import type { AppStackParamList } from '../navigation/types';

const quickActions = [
  { key: 'Prescriptions', label: 'Prescriptions', icon: 'reader-outline', tint: colors.pastel.sky },
  { key: 'MedicalHistory', label: 'History', icon: 'time-outline', tint: colors.pastel.lavender },
  { key: 'OcrScanner', label: 'Scan Rx', icon: 'scan-outline', tint: colors.pastel.peach },
  { key: 'AiChat', label: 'Ask AI', icon: 'sparkles-outline', tint: colors.pastel.mint },
] as const;

export function PatientHomeScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const user = useAppSelector((s) => s.auth.user);
  const { vitals, loading } = useAppSelector((s) => s.patient);
  const nextVisit = appointments.find((a) => a.status !== 'cancelled');

  useEffect(() => {
    dispatch(loadPatientDashboard(user?.id ?? 'pat-001'));
  }, [dispatch, user?.id]);

  return (
    <Screen title={`Namaste, ${user?.name.split(' ')[0] ?? 'there'}`} subtitle="Here is today's health snapshot">
      <View style={styles.grid}>
        {quickActions.map((action, index) => (
          <Animated.View
            key={action.key}
            entering={FadeInDown.delay(index * motion.stagger.list).duration(motion.duration.base)}
            style={styles.gridItem}
          >
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                action.key === 'OcrScanner' || action.key === 'AiChat'
                  ? navigation.navigate(action.key)
                  : navigation.navigate(action.key, { patientId: user?.id ?? 'pat-001' })
              }
            >
              <Card style={styles.action}>
                <IconTile name={action.icon} tint={action.tint} />
                <Text variant="bodyStrong">{action.label}</Text>
              </Card>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      <Text variant="h2">Vitals</Text>
      {loading ? (
        <SkeletonCard />
      ) : (
        <View style={styles.grid}>
          {vitals.map((vital) => (
            <Card key={vital.id} style={styles.gridItem}>
              <Text variant="caption" tone="secondary">
                {vital.label}
              </Text>
              <View style={styles.vitalRow}>
                <CountUp value={vital.value} />
                <Text tone="tertiary">{vital.unit}</Text>
              </View>
            </Card>
          ))}
        </View>
      )}

      <Text variant="h2">Next appointment</Text>
      {nextVisit ? (
        <Card style={styles.visit}>
          <View style={styles.visitText}>
            <Text variant="bodyStrong">{nextVisit.doctorName}</Text>
            <Text variant="caption" tone="secondary">
              {new Date(nextVisit.startsAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </Text>
            <Text variant="caption" tone="tertiary">
              {nextVisit.reason}
            </Text>
          </View>
          <StatusBadge status={nextVisit.status} />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gridItem: { flexGrow: 1, flexBasis: '46%' },
  action: { gap: spacing.sm },
  vitalRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  visit: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  visitText: { flex: 1, gap: 2 },
});
