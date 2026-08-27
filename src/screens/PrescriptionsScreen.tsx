import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button, Card, EmptyState, Screen, SegmentedControl, SkeletonCard, Text } from '../components';
import { loadPatientDashboard } from '../store/slices/patientSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { colors, motion, radius, spacing } from '../theme';
import type { AppStackParamList } from '../navigation/types';
import type { PrescriptionKind } from '../types';

type Props = NativeStackScreenProps<AppStackParamList, 'Prescriptions'>;

export function PrescriptionsScreen({ route, navigation }: Props) {
  const dispatch = useAppDispatch();
  const { prescriptions, loading } = useAppSelector((s) => s.patient);
  const [kind, setKind] = useState<PrescriptionKind>('clinical');

  useEffect(() => {
    if (prescriptions.length === 0) dispatch(loadPatientDashboard(route.params.patientId));
  }, [dispatch, prescriptions.length, route.params.patientId]);

  const visible = prescriptions.filter((p) => p.kind === kind);

  return (
    <Screen
      title="Prescriptions"
      subtitle="Clinical and Ayurvedic, side by side"
      right={<Button label="Back" variant="ghost" fullWidth={false} onPress={() => navigation.goBack()} />}
    >
      <SegmentedControl<PrescriptionKind>
        value={kind}
        onChange={setKind}
        options={[
          { value: 'clinical', label: 'Clinical' },
          { value: 'ayurvedic', label: 'Ayurvedic' },
        ]}
      />

      {loading ? <SkeletonCard /> : null}
      {!loading && visible.length === 0 ? (
        <EmptyState
          icon="reader-outline"
          title="No prescriptions yet"
          message="Prescriptions issued by your doctor will appear here, ready to export as PDF."
        />
      ) : null}

      {visible.map((prescription, index) => (
        <Animated.View
          key={prescription.id}
          entering={FadeInDown.delay(index * motion.stagger.list).duration(motion.duration.base)}
        >
          <Card style={styles.card}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text variant="bodyStrong">{prescription.diagnosis}</Text>
                <Text variant="caption" tone="secondary">
                  {prescription.doctorName} · {prescription.issuedAt}
                </Text>
              </View>
              <Button label="PDF" variant="secondary" fullWidth={false} onPress={() => undefined} />
            </View>
            {prescription.medicines.map((medicine) => (
              <View key={medicine.id} style={styles.medicine}>
                <Text variant="bodyStrong">{medicine.name}</Text>
                <Text variant="caption" tone="secondary">
                  {medicine.dosage} · {medicine.frequency} · {medicine.durationDays} days
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerText: { flex: 1, gap: 2 },
  medicine: {
    gap: 2,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface.muted,
  },
});
