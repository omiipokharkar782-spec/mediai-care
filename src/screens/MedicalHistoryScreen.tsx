import { useEffect, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Card, EmptyState, Screen, SkeletonCard, Text } from '../components';
import { loadPatientDashboard } from '../store/slices/patientSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { colors, spacing } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'MedicalHistory'>;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function MedicalHistoryScreen({ route, navigation }: Props) {
  const dispatch = useAppDispatch();
  const { history, loading } = useAppSelector((s) => s.patient);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (history.length === 0) dispatch(loadPatientDashboard(route.params.patientId));
  }, [dispatch, history.length, route.params.patientId]);

  return (
    <Screen
      title="Medical history"
      subtitle="Every visit, in one timeline"
      right={<Button label="Back" variant="ghost" fullWidth={false} onPress={() => navigation.goBack()} />}
    >
      {loading ? <SkeletonCard /> : null}
      {!loading && history.length === 0 ? (
        <EmptyState icon="time-outline" title="Nothing recorded yet" message="Consultations and diagnoses will build your timeline." />
      ) : null}

      {history.map((entry) => {
        const open = expanded === entry.id;
        return (
          <Pressable
            key={entry.id}
            accessibilityRole="button"
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setExpanded(open ? null : entry.id);
            }}
          >
            <Card style={styles.card}>
              <View style={styles.row}>
                <View style={styles.rowText}>
                  <Text variant="bodyStrong">{entry.title}</Text>
                  <Text variant="caption" tone="secondary">
                    {entry.date}
                  </Text>
                </View>
                <Ionicons
                  name={open ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.text.tertiary}
                />
              </View>
              <Text tone="secondary">{entry.summary}</Text>
              {open ? (
                <View style={styles.details}>
                  {entry.details.map((detail) => (
                    <View key={detail} style={styles.bulletRow}>
                      <View style={styles.bullet} />
                      <Text variant="caption" tone="secondary">
                        {detail}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </Card>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowText: { flex: 1, gap: 2 },
  details: { gap: 6, paddingTop: spacing.sm },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary.blue },
});
