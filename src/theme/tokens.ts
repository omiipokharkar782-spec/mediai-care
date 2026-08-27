import raw from '../../design-tokens/tokens.json';

export const tokens = raw;

export const colors = tokens.color;
export const gradients = tokens.gradient;
export const radius = tokens.radius;
export const spacing = tokens.spacing;
export const motion = tokens.motion;
export const componentTokens = tokens.component;

type ElevationLevel = keyof typeof tokens.elevation;

export type ShadowStyle = {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
  elevation: number;
};

export function elevation(level: ElevationLevel): ShadowStyle {
  const e = tokens.elevation[level];
  return {
    shadowColor: e.shadowColor,
    shadowOpacity: e.shadowOpacity,
    shadowRadius: e.shadowRadius,
    shadowOffset: { width: 0, height: e.shadowOffsetY },
    elevation: e.androidElevation,
  };
}

const platformFamily: Record<string, string> = {
  heading: 'System',
  body: 'System',
  numeric: 'System',
};

type ScaleKey = keyof typeof tokens.typography.scale;

export type TextStyleToken = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700';
  fontVariant?: ('tabular-nums')[];
};

export function typeStyle(key: ScaleKey): TextStyleToken {
  const s = tokens.typography.scale[key];
  return {
    fontFamily: platformFamily[s.family] ?? 'System',
    fontSize: s.size,
    lineHeight: s.lineHeight,
    fontWeight: s.weight as TextStyleToken['fontWeight'],
    ...(s.family === 'numeric' ? { fontVariant: ['tabular-nums' as const] } : {}),
  };
}

export const gradientStops = {
  brand: gradients.brand.stops as [string, string],
  primaryCta: gradients.primaryCta.stops as [string, string],
  aiHalo: gradients.aiHalo.stops as [string, string],
};

// 135deg diagonal in Expo LinearGradient coordinates.
export const diagonal = { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
