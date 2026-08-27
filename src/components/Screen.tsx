import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { Text } from './Text';

interface Props {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  scroll?: boolean;
  dark?: boolean;
  right?: ReactNode;
}

export function Screen({ title, subtitle, children, scroll = true, dark = false, right }: Props) {
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor: dark ? colors.aiDark.navy : colors.surface.muted }]}
    >
      {title ? (
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text variant="h1" tone={dark ? 'inverse' : 'primary'}>
              {title}
            </Text>
            {subtitle ? (
              <Text tone={dark ? 'tertiary' : 'secondary'}>{subtitle}</Text>
            ) : null}
          </View>
          {right}
        </View>
      ) : null}
      <Body
        style={styles.body}
        {...(scroll ? { contentContainerStyle: styles.scrollContent, showsVerticalScrollIndicator: false } : {})}
      >
        {children}
      </Body>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerText: { flex: 1, gap: 2 },
  body: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.base, paddingBottom: spacing.xxxl },
});
