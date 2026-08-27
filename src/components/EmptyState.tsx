import { StyleSheet, View } from 'react-native';
import { IconTile } from './IconTile';
import { Text } from './Text';
import { colors, spacing } from '../theme';
import type { Ionicons } from '@expo/vector-icons';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

export function EmptyState({ icon, title, message }: Props) {
  return (
    <View style={styles.wrapper}>
      <IconTile name={icon} tint={colors.pastel.lavender} color="#6C5CE7" size={72} />
      <Text variant="h2" align="center">
        {title}
      </Text>
      <Text tone="secondary" align="center">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
});
