import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card, CountUp, IconTile, Screen, SkeletonCard, StatusBadge, Text } from '../components';
import { loadDoctorDashboard } from '../store/slices/doctorSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { colors, motion, spacing } from '../theme';
import type { AppStackParamList } from '../navigation/types';

const tools = [
  { key: 'OcrScanner', label: 'OCR scanner', icon: 'scan-outline', tint: colors.pastel.peach },
  { key: 'QrScan', label: 'Patient QR', icon: 'qr-code-outline', tint: colors.pastel.sky },
  { key: 'NewPrescription', label: 'New Rx', icon: 'create-outline', tint: colors.pastel.mint },
  { key: 'AiChat', label: 'AI assistant', icon: 'sparkles-outline', tint: colors.pastel.lavender },
] as const;

export function DoctorHomeScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const user = useAppSelector((s) => s.auth.user);
  const { patients, appointments, loading } = useAppSelector((s) => s.doctor);

  useEffect(() => {
    dispatch(loadDoctorDashboard());
  }, [dispatch]);

  const stats = useMemo(
    () => [
      { id: 's1', label: 'Today', value: appointments.filter((a) => a.status !== 'cancelled').length },
      { id: 's2', label: 'Patients', value: patients.length },
      { id: 's3', label: 'Pending Rx', value: appointments.filter((a) => a.status === 'pending').length },
    ],
    [appointments, patients],
  );

  return (
    <Screen title={user?.name ?? 'Doctor'} subtitle="Clinic dashboard">
      <View style={styles.row}>
        {stats.map((stat) => (
          <Card key={stat.id} style={styles.stat}>
            <CountUp value={stat.value} />
            <Text variant="caption" tone="secondary">
              {stat.label}
            </Text>
          </Card>
        ))}
      </View>

      <Text variant="h2">Quick tools</Text>
      <View style={styles.grid}>
        {tools.map((tool, index) => (
          <Animated.View
            key={tool.key}
            entering={FadeInDown.delay(index * motion.stagger.list).duration(motion.duration.base)}
            style={styles.gridItem}
          >
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                tool.key === 'NewPrescription'
                  ? navigation.navigate('NewPrescription', { patientId: patients[0]?.id ?? 'pat-001' })
                  : navigation.navigate(tool.key)
              }
            >
              <Card style={styles.action}>
                <IconTile name={tool.icon} tint={tool.tint} />
                <Text variant="bodyStrong">{tool.label}</Text>
              </Card>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      <Text variant="h2">Today&apos;s queue</Text>
      {loading ? (
        <SkeletonCard />
      ) : (
        appointments.slice(0, 4).map((appointment) => (
          <Pressable
            key={appointment.id}
            accessibilityRole="button"
            onPress={() => navigation.navigate('PatientRecord', { patientId: appointment.patientId })}
          >
            <Card style={styles.queueRow}>
              <View style={styles.queueText}>
                <Text variant="bodyStrong">{appointment.patientName}</Text>
                <Text variant="caption" tone="secondary">
                  {new Date(appointment.startsAt).toLocaleTimeString('en-IN', { timeStyle: 'short' })} · {appointment.reason}
                </Text>
              </View>
              <StatusBadge status={appointment.status} />
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, gap: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gridItem: { flexGrow: 1, flexBasis: '46%' },
  action: { gap: spacing.sm },
  queueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  queueText: { flex: 1, gap: 2 },
});
