import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { colors, componentTokens } from '../theme';

interface Props {
  name: keyof typeof Ionicons.glyphMap;
  tint?: string;
  color?: string;
  size?: number;
}

export function IconTile({ name, tint = colors.pastel.sky, color = colors.primary.blue, size }: Props) {
  const tileSize = size ?? componentTokens.iconTile.size;
  return (
    <View style={[styles.tile, { backgroundColor: tint, width: tileSize, height: tileSize }]}>
      <Ionicons name={name} size={componentTokens.iconTile.iconSize} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: componentTokens.iconTile.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
