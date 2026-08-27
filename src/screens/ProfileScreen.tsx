import { StyleSheet, Switch, View } from 'react-native';
import { useState } from 'react';
import { Button, Card, IconTile, Screen, Text } from '../components';
import { signOut } from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { colors, spacing } from '../theme';

export function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [reminders, setReminders] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  return (
    <Screen title="Profile" subtitle="Account, privacy and preferences">
      <Card style={styles.row}>
        <IconTile name="person-outline" tint={user?.avatarColor ?? colors.pastel.sky} size={56} />
        <View style={styles.text}>
          <Text variant="h2">{user?.name}</Text>
          <Text variant="caption" tone="secondary">
            {user?.phone} · {user?.role}
          </Text>
        </View>
      </Card>

      <Text variant="h2">Preferences</Text>
      <Card style={styles.row}>
        <View style={styles.text}>
          <Text variant="bodyStrong">Medicine reminders</Text>
          <Text variant="caption" tone="secondary">
            Push notification before every scheduled dose
          </Text>
        </View>
        <Switch value={reminders} onValueChange={setReminders} trackColor={{ true: colors.secondary.teal, false: colors.surface.border }} />
      </Card>
      <Card style={styles.row}>
        <View style={styles.text}>
          <Text variant="bodyStrong">Biometric unlock</Text>
          <Text variant="caption" tone="secondary">
            Require Face ID / fingerprint to open records
          </Text>
        </View>
        <Switch value={biometrics} onValueChange={setBiometrics} trackColor={{ true: colors.secondary.teal, false: colors.surface.border }} />
      </Card>

      <Text variant="h2">Data & consent</Text>
      <Card style={styles.text}>
        <Text variant="bodyStrong">Sharing consent</Text>
        <Text variant="caption" tone="secondary">
          2 active grants · Dr. Meera Kulkarni, Sahyadri Diagnostics
        </Text>
      </Card>

      <Button label="Log out" variant="danger" onPress={() => dispatch(signOut())} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: 4 },
});
