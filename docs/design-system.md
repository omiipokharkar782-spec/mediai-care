# Design System

Tokens live in `design-tokens/tokens.json` and are the single source of truth; `src/theme/tokens.ts` re-exports them typed for React Native (`elevation()`, `typeStyle()`, `gradientStops`).

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| Primary Blue | `#1565C0` -> `#1E5BB8` (135° gradient) | Patient CTAs, headers |
| Secondary Teal | `#2ECC71` | Doctor actions, success |
| Deep Navy (AI Dark) | `#0D1B2A` | Scanner / OCR / AI full-screen tools |
| Alert Amber | `#F5A623` | Drug-interaction warnings |
| Danger Red | `#E74C3C` | Critical alerts, logout |
| Pastel tints | Peach `#FFE3D5`, Mint `#D6F5E3`, Lavender `#E6DFF6`, Sky `#DCEEFB` | Icon-tile backgrounds |
| Surface | `#FFFFFF` / `#F7F9FC`, hairline `#EDF1F7` | Cards, app background |

Gradients run 135° diagonally (logo, splash glow, primary CTA, AI halo).

## Elevation

Four soft levels (`xs`/`sm`/`md`/`lg`) built on `rgba(15,40,80,0.08)`; never a hard shadow. Use `elevation('md')` from the theme rather than hand-rolled shadow props.

## Typography

Poppins for headings (600–700), Inter for body (400–500). Display 32 / H1 24 / H2 20 / Body 15 / Caption 12, line-height 1.4–1.6. Vitals and dosages use the `numeric` style with `fontVariant: ['tabular-nums']` so medical figures stay column-aligned.

> The scaffold maps both families to the platform System font. Add the Poppins/Inter files via `expo-font` and change `platformFamily` in `src/theme/tokens.ts` to switch the whole app over.

## Components

- **Card** — 18 px radius, 1 px `#EDF1F7` border, 16 px padding, `sm` shadow.
- **Button** — Primary (gradient fill), Secondary (outline), Ghost (text), Danger; 48 px tall, 12 px radius, 0.97 press scale.
- **Input** — floating caption label, 12 px radius, brand glow ring on focus.
- **StatusBadge** — pill; Confirmed = teal, Pending = amber, Cancelled = red, Completed = sky.
- **IconTile** — 44 px rounded tile with pastel background and a 24 px outline icon.
- **FloatingTabBar** — floating rounded bar with an elevated centre "AI Tools" FAB and pulsing gradient halo.
- **Skeleton / EmptyState / CountUp / SegmentedControl** — loading, empty and dashboard primitives.
