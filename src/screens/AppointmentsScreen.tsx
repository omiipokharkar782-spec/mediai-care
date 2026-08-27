import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Card, EmptyState, Screen, StatusBadge, Text } from '../components';
import { loadDoctorDashboard } from '../store/slices/doctorSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { colors, radius, spacing } from '../theme';

function startOfWeekDays(): Date[] {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

export function AppointmentsScreen() {
  const dispatch = useAppDispatch();
  const { appointments } = useAppSelector((s) => s.doctor);
  const role = useAppSelector((s) => s.auth.role);
  const user = useAppSelector((s) => s.auth.user);
  const days = useMemo(() => startOfWeekDays(), []);
  const [selected, setSelected] = useState(days[0].toDateString());

  useEffect(() => {
    if (appointments.length === 0) dispatch(loadDoctorDashboard());
  }, [appointments.length, dispatch]);

  const scoped = role === 'patient' ? appointments.filter((a) => a.patientId === user?.id) : appointments;
  const visible = scoped.filter((a) => new Date(a.startsAt).toDateString() === selected);

  return (
    <Screen title="Appointments" subtitle="Week at a glance">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
        {days.map((day) => {
          const key = day.toDateString();
          const active = key === selected;
          return (
            <Pressable key={key} accessibilityRole="button" onPress={() => setSelected(key)}>
              <View style={[styles.day, active && styles.dayActive]}>
                <Text variant="caption" tone={active ? 'inverse' : 'secondary'}>
                  {day.toLocaleDateString('en-IN', { weekday: 'short' })}
                </Text>
                <Text variant="bodyStrong" tone={active ? 'inverse' : 'primary'}>
                  {day.getDate()}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {visible.length === 0 ? (
        <EmptyState icon="calendar-outline" title="Nothing scheduled" message="Pick another day or book a new consultation." />
      ) : null}

      {visible.map((appointment) => (
        <Card key={appointment.id} style={styles.row}>
          <View style={styles.time}>
            <Text variant="bodyStrong" tone="brand">
              {new Date(appointment.startsAt).toLocaleTimeString('en-IN', { timeStyle: 'short' })}
            </Text>
          </View>
          <View style={styles.text}>
            <Text variant="bodyStrong">{role === 'patient' ? appointment.doctorName : appointment.patientName}</Text>
            <Text variant="caption" tone="secondary">
              {appointment.reason}
            </Text>
          </View>
          <StatusBadge status={appointment.status} />
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  strip: { gap: spacing.sm, paddingVertical: spacing.xs },
  day: {
    width: 56,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    backgroundColor: colors.surface.base,
    borderWidth: 1,
    borderColor: colors.surface.border,
    gap: 2,
  },
  dayActive: { backgroundColor: colors.primary.blue, borderColor: colors.primary.blue },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  time: { width: 64 },
  text: { flex: 1, gap: 2 },
});
