import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, EmptyState, IconTile, Input, Screen, SkeletonCard, Text } from '../components';
import { loadDoctorDashboard } from '../store/slices/doctorSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { spacing } from '../theme';
import type { AppStackParamList } from '../navigation/types';

export function PatientsScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { patients, loading } = useAppSelector((s) => s.doctor);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (patients.length === 0) dispatch(loadDoctorDashboard());
  }, [dispatch, patients.length]);

  const filtered = patients.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Screen title="Patients" subtitle={`${patients.length} under your care`}>
      <Input label="Search" value={query} onChangeText={setQuery} placeholder="Name" />
      {loading ? <SkeletonCard /> : null}
      {!loading && filtered.length === 0 ? (
        <EmptyState icon="people-outline" title="No patients found" message="Try a different name or scan a patient QR code." />
      ) : null}
      {filtered.map((patient) => (
        <Pressable
          key={patient.id}
          accessibilityRole="button"
          onPress={() => navigation.navigate('PatientRecord', { patientId: patient.id })}
        >
          <Card style={styles.row}>
            <IconTile name="person-outline" tint={patient.avatarColor} />
            <View style={styles.text}>
              <Text variant="bodyStrong">{patient.name}</Text>
              <Text variant="caption" tone="secondary">
                {patient.age} yrs · {patient.bloodGroup} · {patient.conditions.join(', ') || 'No chronic conditions'}
              </Text>
            </View>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: 2 },
});
