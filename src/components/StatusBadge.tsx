import { StyleSheet, View } from 'react-native';
import { colors, componentTokens } from '../theme';
import type { AppointmentStatus } from '../types';
import { Text } from './Text';

const palette: Record<AppointmentStatus, { bg: string; fg: string; label: string }> = {
  confirmed: { bg: colors.pastel.mint, fg: '#1B7C4A', label: 'Confirmed' },
  pending: { bg: colors.pastel.peach, fg: '#9A5B10', label: 'Pending' },
  cancelled: { bg: '#FBE0DD', fg: '#A32A1D', label: 'Cancelled' },
  completed: { bg: colors.pastel.sky, fg: '#12508F', label: 'Completed' },
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const tone = palette[status];
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
      <Text variant="caption" style={{ color: tone.fg }}>
        {tone.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: componentTokens.badge.radius,
    paddingHorizontal: componentTokens.badge.paddingX,
    paddingVertical: componentTokens.badge.paddingY,
  },
});
