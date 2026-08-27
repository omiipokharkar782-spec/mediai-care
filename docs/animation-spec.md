# MediAI Care — Animation Spec Sheet

Tone: calm, fluid, confidence-inspiring. Never a "hospital app" — a smart companion.
All durations/easings below come from `design-tokens/tokens.json` -> `motion`, and are exposed in code as `motion.duration.*` / `motion.easing.*`.

| Token | Value |
| --- | --- |
| `duration.instant` | 120 ms |
| `duration.fast` | 200 ms |
| `duration.base` | 300 ms |
| `duration.screen` | 350 ms |
| `duration.slow` | 600 ms |
| `duration.count` | 800 ms |
| `duration.loop` | 1500 ms |
| `easing.standard` | cubic-bezier(0.4, 0, 0.2, 1) |
| `easing.decelerate` | cubic-bezier(0, 0, 0.2, 1) |
| `easing.spring` | damping 14 / stiffness 180 / mass 1 |
| `stagger.chips` / `stagger.list` / `stagger.tagline` | 60 / 40 / 100 ms |

## Per micro-interaction

| # | Interaction | Trigger | Motion | Duration | Easing | Implementation |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Splash logo reveal | App launch | Scale 0.8 -> 1.0 + fade 0 -> 1 | 600 ms | decelerate | `SplashScreen` — `withTiming` on shared values |
| 2 | Tagline / role cards | After logo | Slide-up + fade, 100 ms stagger per card | 300 ms | standard | `FadeInDown.delay(i * stagger.tagline)` |
| 3 | Screen push | Navigation to detail | Slide from right (shared-element style morph on native) | 350 ms | standard | native-stack `animation: 'slide_from_right'` |
| 4 | Full-screen AI tool | Open OCR / QR scanner | Fade from bottom over navy veil | 300 ms | decelerate | `AppStack.Group` with `fade_from_bottom` |
| 5 | Scanner corner frame | Scanner mounted | Corner glow pulses 0.5 -> 1.0 opacity, loop | 1500 ms | inOut(ease) | `withRepeat(withTiming(...), -1, true)` |
| 6 | Scanner laser sweep | Scanner mounted | Line travels top <-> bottom of frame | 1500 ms each way | inOut(ease) | `withRepeat(withSequence(...), -1)` |
| 7 | Scan success | OCR returns | Result card fades in (green checkmark morph + haptic tick on device) | 300 ms | decelerate | `FadeIn` + `expo-haptics` (native build) |
| 8 | Voice mic idle | Assistant open | Breathing glow, scale 1.0 -> 1.06 | 1500 ms | inOut(ease) | `AiChatScreen` mic shared value |
| 9 | Voice listening | Tap mic | Ripple expansion + scale 1.0 -> 1.18, live waveform bars driven by amplitude | 1500 ms loop / 350-1000 ms per bar | inOut(ease) | `Waveform` bars, per-bar phase offset 40 ms |
| 10 | Chat typing indicator | Assistant thinking | 3-dot bounce, translateY -4 px | 500 ms loop | inOut(ease) | `TypingDots` |
| 11 | Chat bubbles | Message appended | Slide-up + fade | 200 ms | decelerate | `FadeInUp` |
| 12 | Quick-prompt chips | Chat mounted | Stagger-appear, 60 ms apart | 200 ms | standard | `FadeIn.delay(i * stagger.chips)` |
| 13 | Drug-interaction warning | Interaction detected | Card shake +/-2 px x2 + amber border pulse | 3 x 60 ms shake, 1500 ms pulse loop | standard | `InteractionCard` in `NewPrescriptionScreen` |
| 14 | Dashboard stat cards | Screen load | Count-up 0 -> value, cubic ease-out | 800 ms | ease-out cubic | `CountUp` component |
| 15 | Bottom-nav centre FAB | Always | Gradient halo pulse, scale 1.0 -> 1.12, opacity 0.25 -> 0.6 | 1500 ms | inOut(ease) | `FloatingTabBar` |
| 16 | Bottom-nav FAB tap | Tap | Icon morph (mic <-> stop) | 200 ms | standard | icon swap on `listening` state |
| 17 | Button press | Press in/out | Scale 1.0 -> 0.97 + haptic tick | 120 ms | standard | `Button` (`componentTokens.button.pressScale`) |
| 18 | Input focus | Focus | Border -> brand blue + glow ring fades to 0.25 opacity | 200 ms | standard | `Input` |
| 19 | Accordion row | Tap history row | Height auto-expand, chevron flip | 300 ms | easeInEaseOut | `LayoutAnimation` in `MedicalHistoryScreen` |
| 20 | Skeleton loaders | Data loading | Shimmer opacity 0.4 -> 1.0, loop | 1500 ms | inOut(ease) | `Skeleton` / `SkeletonCard` |
| 21 | List item entrance | List rendered | Slide-up + fade, 40 ms stagger | 300 ms | standard | `FadeInDown.delay(i * stagger.list)` |
| 22 | Upload progress | Report upload | Button label swap + progress bar fill | matches request | linear | `patientSlice.uploading` |
| 23 | Pull-to-refresh | Pull gesture | Heartbeat pulse-line loader (Lottie/Rive), 1 beat per 1200 ms | 1200 ms loop | inOut(ease) | planned: Lottie `heartbeat.json` |
| 24 | Toggle switch | Tap | Spring physics thumb travel | spring(14/180/1) | spring | RN `Switch` (native spring) |
| 25 | Checkbox | Tap | Draw-path checkmark | 200 ms | decelerate | planned: Rive `check.riv` |

## Library allocation

- **Reanimated 3** — every gesture-driven and looping UI animation above (implemented).
- **Lottie** — onboarding illustrations, success states, heartbeat pull-to-refresh loader.
- **Rive** — scanner frame and voice waveform on native builds, where per-frame state machines beat JS-driven values.
- **Moti** — optional sugar over Reanimated for one-off declarative transitions.

## Reduced motion

When the OS "reduce motion" flag is on: keep opacity fades, drop translate/scale, and disable all `withRepeat` loops (scanner laser, halo pulse, waveform) — replace with a static state.
