import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Button, Card, Input, Screen, SegmentedControl, Text } from '../components';
import {
  checkInteractions,
  loadDoctorDashboard,
  resetDraft,
  savePrescription,
  setDiagnosis,
  toggleDraftMedicine,
} from '../store/slices/doctorSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { colors, motion, radius, spacing } from '../theme';
import type { AppStackParamList } from '../navigation/types';
import type { PrescriptionKind } from '../types';

type Props = NativeStackScreenProps<AppStackParamList, 'NewPrescription'>;

export function NewPrescriptionScreen({ route, navigation }: Props) {
  const dispatch = useAppDispatch();
  const { catalog, draftMedicines, draftDiagnosis, warnings, checkingInteractions, savedPrescription } = useAppSelector(
    (s) => s.doctor,
  );
  const doctor = useAppSelector((s) => s.auth.user);
  const [kind, setKind] = useState<PrescriptionKind>('clinical');

  useEffect(() => {
    if (catalog.length === 0) dispatch(loadDoctorDashboard());
    return () => {
      dispatch(resetDraft());
    };
  }, [catalog.length, dispatch]);

  useEffect(() => {
    dispatch(checkInteractions(draftMedicines));
  }, [dispatch, draftMedicines]);

  const visible = catalog.filter((m) => m.kind === kind);

  return (
    <Screen
      title="New prescription"
      subtitle="AI checks interactions as you build"
      right={<Button label="Back" variant="ghost" fullWidth={false} onPress={() => navigation.goBack()} />}
    >
      <Input label="Diagnosis" value={draftDiagnosis} onChangeText={(v) => dispatch(setDiagnosis(v))} placeholder="e.g. Stage-1 hypertension" />

      <SegmentedControl<PrescriptionKind>
        value={kind}
        onChange={setKind}
        options={[
          { value: 'clinical', label: 'Clinical' },
          { value: 'ayurvedic', label: 'Ayurvedic' },
        ]}
      />

      {visible.map((medicine) => {
        const selected = draftMedicines.some((m) => m.id === medicine.id);
        return (
          <Pressable key={medicine.id} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} onPress={() => dispatch(toggleDraftMedicine(medicine))}>
            <Card style={[styles.row, selected && styles.rowSelected]}>
              <View style={styles.text}>
                <Text variant="bodyStrong">{medicine.name}</Text>
                <Text variant="caption" tone="secondary">
                  {medicine.dosage} · {medicine.frequency} · {medicine.durationDays} days
                </Text>
              </View>
              <Text variant="caption" tone={selected ? 'brand' : 'tertiary'}>
                {selected ? 'Added' : 'Add'}
              </Text>
            </Card>
          </Pressable>
        );
      })}

      {checkingInteractions ? (
        <Text variant="caption" tone="secondary">
          Checking drug interactions…
        </Text>
      ) : null}

      {warnings.map((warning) => (
        <InteractionCard key={warning.id} title={`${warning.drugA} + ${warning.drugB}`} severity={warning.severity} description={warning.description} advice={warning.advice} />
      ))}

      <Button
        label={savedPrescription ? 'Saved' : 'Save prescription'}
        disabled={draftMedicines.length === 0 || !draftDiagnosis}
        onPress={() =>
          dispatch(
            savePrescription({
              patientId: route.params.patientId,
              doctorName: doctor?.name ?? 'Dr. Meera Kulkarni',
              issuedAt: new Date().toISOString().slice(0, 10),
              kind,
              diagnosis: draftDiagnosis,
              medicines: draftMedicines,
            }),
          )
        }
      />
    </Screen>
  );
}

function InteractionCard({
  title,
  severity,
  description,
  advice,
}: {
  title: string;
  severity: 'low' | 'moderate' | 'high';
  description: string;
  advice: string;
}) {
  const shake = useSharedValue(0);

  useEffect(() => {
    shake.value = withSequence(
      withTiming(-2, { duration: 60 }),
      withTiming(2, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
  }, [shake]);

  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: motion.duration.loop }), -1, true);
  }, [pulse]);

  const animated = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
    borderColor: severity === 'high' ? colors.status.danger : colors.status.warning,
    opacity: 0.75 + pulse.value * 0.25,
  }));

  return (
    <Animated.View style={[styles.warning, animated]}>
      <Text variant="bodyStrong" tone={severity === 'high' ? 'danger' : 'warning'}>
        {severity.toUpperCase()} · {title}
      </Text>
      <Text variant="caption" tone="secondary">
        {description}
      </Text>
      <Text variant="caption">{advice}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowSelected: { borderColor: colors.primary.blue, backgroundColor: colors.pastel.sky },
  text: { flex: 1, gap: 2 },
  warning: {
    gap: 4,
    padding: spacing.base,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    backgroundColor: '#FFF7EC',
  },
});
