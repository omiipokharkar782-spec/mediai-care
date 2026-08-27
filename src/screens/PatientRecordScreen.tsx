import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Card, EmptyState, IconTile, Screen, SegmentedControl, Text } from '../components';
import { loadDoctorDashboard } from '../store/slices/doctorSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { history, prescriptions, reports } from '../mock/data';
import { colors, spacing } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'PatientRecord'>;
type Tab = 'summary' | 'timeline' | 'documents';

export function PatientRecordScreen({ route, navigation }: Props) {
  const dispatch = useAppDispatch();
  const { patientId } = route.params;
  const { patients } = useAppSelector((s) => s.doctor);
  const [tab, setTab] = useState<Tab>('summary');

  useEffect(() => {
    if (patients.length === 0) dispatch(loadDoctorDashboard());
  }, [dispatch, patients.length]);

  const patient = patients.find((p) => p.id === patientId);
  const patientHistory = history.filter((h) => h.patientId === patientId);
  const patientReports = reports.filter((r) => r.patientId === patientId);
  const patientRx = prescriptions.filter((p) => p.patientId === patientId);

  return (
    <Screen
      title={patient?.name ?? 'Patient'}
      subtitle={patient ? `${patient.age} yrs · ${patient.gender} · ${patient.bloodGroup}` : undefined}
      right={<Button label="Back" variant="ghost" fullWidth={false} onPress={() => navigation.goBack()} />}
    >
      <SegmentedControl<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: 'summary', label: 'Summary' },
          { value: 'timeline', label: 'Timeline' },
          { value: 'documents', label: 'Documents' },
        ]}
      />

      {tab === 'summary' ? (
        <>
          <Card style={styles.block}>
            <Text variant="bodyStrong">Active conditions</Text>
            {(patient?.conditions ?? []).map((condition) => (
              <Text key={condition} tone="secondary">
                · {condition}
              </Text>
            ))}
          </Card>
          <Card style={styles.block}>
            <Text variant="bodyStrong">Current medication</Text>
            {patientRx.flatMap((rx) => rx.medicines).map((medicine) => (
              <Text key={medicine.id} tone="secondary">
                · {medicine.name} {medicine.dosage} ({medicine.frequency})
              </Text>
            ))}
          </Card>
          <Button label="Write new prescription" onPress={() => navigation.navigate('NewPrescription', { patientId })} />
        </>
      ) : null}

      {tab === 'timeline'
        ? patientHistory.map((entry) => (
            <Card key={entry.id} style={styles.block}>
              <Text variant="caption" tone="brand">
                {entry.date}
              </Text>
              <Text variant="bodyStrong">{entry.title}</Text>
              <Text tone="secondary">{entry.summary}</Text>
            </Card>
          ))
        : null}

      {tab === 'documents' ? (
        patientReports.length === 0 ? (
          <EmptyState icon="folder-open-outline" title="No documents" message="Uploaded labs and scans will be listed here." />
        ) : (
          patientReports.map((report) => (
            <Card key={report.id} style={styles.row}>
              <IconTile name="document-text-outline" tint={colors.pastel.sky} />
              <View style={styles.text}>
                <Text variant="bodyStrong">{report.title}</Text>
                <Text variant="caption" tone="secondary">
                  {report.uploadedAt} · {(report.sizeKb / 1024).toFixed(1)} MB
                </Text>
              </View>
            </Card>
          ))
        )
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: 2 },
});
