import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button, Card, EmptyState, IconTile, Screen, SegmentedControl, SkeletonCard, Text } from '../components';
import { loadPatientDashboard, uploadReport } from '../store/slices/patientSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { colors, motion, spacing } from '../theme';

type Filter = 'all' | 'lab' | 'imaging';

const tints: Record<string, string> = {
  lab: colors.pastel.mint,
  imaging: colors.pastel.sky,
  discharge: colors.pastel.lavender,
};

export function ReportsScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { reports, loading, uploading } = useAppSelector((s) => s.patient);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (reports.length === 0) dispatch(loadPatientDashboard(user?.id ?? 'pat-001'));
  }, [dispatch, reports.length, user?.id]);

  const visible = reports.filter((r) => filter === 'all' || r.category === filter);

  return (
    <Screen title="Reports" subtitle="Labs, scans and discharge summaries">
      <SegmentedControl<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'All' },
          { value: 'lab', label: 'Labs' },
          { value: 'imaging', label: 'Imaging' },
        ]}
      />

      <Button
        label={uploading ? 'Uploading…' : 'Upload a report'}
        disabled={uploading}
        onPress={() => dispatch(uploadReport({ patientId: user?.id ?? 'pat-001', title: 'Thyroid profile' }))}
      />

      {loading ? <SkeletonCard /> : null}
      {!loading && visible.length === 0 ? (
        <EmptyState icon="document-text-outline" title="No reports yet" message="Upload a lab report and the AI will summarise it for you." />
      ) : null}

      {visible.map((report, index) => (
        <Animated.View key={report.id} entering={FadeInDown.delay(index * motion.stagger.list).duration(motion.duration.base)}>
          <Card style={styles.row}>
            <IconTile name={report.category === 'imaging' ? 'body-outline' : 'flask-outline'} tint={tints[report.category]} />
            <View style={styles.text}>
              <Text variant="bodyStrong">{report.title}</Text>
              <Text variant="caption" tone="secondary">
                {report.uploadedAt} · {(report.sizeKb / 1024).toFixed(1)} MB
              </Text>
            </View>
            <Text variant="caption" tone={report.status === 'ready' ? 'success' : 'warning'}>
              {report.status === 'ready' ? 'Ready' : 'Processing'}
            </Text>
          </Card>
        </Animated.View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: 2 },
});
