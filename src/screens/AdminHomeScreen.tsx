import { StyleSheet, Switch, View } from 'react-native';
import { Card, CountUp, Screen, Text } from '../components';
import { toggleAuditLog } from '../store/slices/adminSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { colors, spacing } from '../theme';

export function AdminHomeScreen() {
  const dispatch = useAppDispatch();
  const { stats, auditLogEnabled } = useAppSelector((s) => s.admin);

  return (
    <Screen title="Platform overview" subtitle="Usage, compliance and onboarding">
      <View style={styles.grid}>
        {stats.map((stat) => (
          <Card key={stat.id} style={styles.gridItem}>
            <CountUp value={stat.value} />
            <Text variant="caption" tone="secondary">
              {stat.label}
            </Text>
          </Card>
        ))}
      </View>

      <Text variant="h2">Compliance</Text>
      <Card style={styles.row}>
        <View style={styles.rowText}>
          <Text variant="bodyStrong">HIPAA-aligned audit logging</Text>
          <Text variant="caption" tone="secondary">
            Records every read/write on patient data with actor and purpose.
          </Text>
        </View>
        <Switch
          value={auditLogEnabled}
          onValueChange={() => {
            dispatch(toggleAuditLog());
          }}
          trackColor={{ true: colors.secondary.teal, false: colors.surface.border }}
        />
      </Card>
      <Card style={styles.rowText}>
        <Text variant="bodyStrong">Consent management</Text>
        <Text variant="caption" tone="secondary">
          4 pending consent renewals · 0 expired grants
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gridItem: { flexGrow: 1, flexBasis: '46%', gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowText: { flex: 1, gap: 4 },
});
