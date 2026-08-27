import { View, type ViewProps } from 'react-native';
import { colors, componentTokens, elevation } from '../theme';

interface Props extends ViewProps {
  level?: 'xs' | 'sm' | 'md' | 'lg';
  padded?: boolean;
  tint?: string;
}

export function Card({ level = 'sm', padded = true, tint, style, ...rest }: Props) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: tint ?? colors.surface.base,
          borderRadius: componentTokens.card.radius,
          borderWidth: componentTokens.card.borderWidth,
          borderColor: colors.surface.border,
          padding: padded ? componentTokens.card.padding : 0,
        },
        elevation(level),
        style,
      ]}
    />
  );
}
