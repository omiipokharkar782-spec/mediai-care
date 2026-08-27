import { StyleSheet, Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { colors, typeStyle } from '../theme';

type Variant = 'display' | 'h1' | 'h2' | 'body' | 'bodyStrong' | 'caption' | 'numeric';
type Tone = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'brand' | 'danger' | 'warning' | 'success';

const tones: Record<Tone, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  tertiary: colors.text.tertiary,
  inverse: colors.text.inverse,
  brand: colors.primary.blue,
  danger: colors.status.danger,
  warning: colors.status.warning,
  success: colors.status.success,
};

interface Props extends TextProps {
  variant?: Variant;
  tone?: Tone;
  align?: TextStyle['textAlign'];
}

export function Text({ variant = 'body', tone = 'primary', align, style, ...rest }: Props) {
  return <RNText {...rest} style={[typeStyle(variant), { color: tones[tone], textAlign: align }, style]} />;
}

export const textStyles = StyleSheet.create({});
