# MediAI Care

AI-powered healthcare companion for Patients, Doctors and Admins — hospital-grade EHR reliability with the warmth of a consumer wellness app.

This repository holds the design system, the API contract and a React Native (Expo) implementation wired to a mock API.

```
design-tokens/tokens.json   Colours, type scale, spacing, radii, elevation, motion — single source of truth
api/schema.graphql          GraphQL contract (auth, patients, prescriptions, reports, appointments, AI, OCR)
api/openapi.yaml            REST equivalent of the same contract
docs/design-system.md       Colour, elevation, typography and component specs
docs/animation-spec.md      Every micro-interaction: trigger, motion, duration, easing, where it lives in code
docs/state-architecture.md  Redux Toolkit slice diagram and the production swap to RTK Query
src/                        React Native app (navigation, components, screens, store, mock API)
```

## Run it

```bash
npm install
npm start        # then press w for web, or scan the QR with Expo Go
```

Sign in with any phone number and any 6-digit OTP; pick Patient, Doctor or Admin on the splash screen to enter that role's navigation stack.

## Screens

Splash/role selection, Login (OTP + password), QR scan, Patient home, Doctor dashboard, Admin overview, Patients list, Prescriptions (Clinical/Ayurvedic), Medical history, Reports, AI health assistant (chat + voice), Appointments, OCR prescription scanner, New prescription builder with live drug-interaction warnings, Patient record (Summary/Timeline/Documents), Profile & settings.

## Architecture

- **State** — Redux Toolkit with role-based slices (`auth`, `patient`, `doctor`, `admin`, `ai`); async thunks call `src/mock/api.ts`, which mirrors the API contract one-to-one so it can be swapped for RTK Query without touching screens.
- **Navigation** — React Navigation: an auth stack until `auth.status === 'authenticated'`, then a role-specific bottom-tab navigator (floating bar with a gradient "AI Tools" FAB) plus detail screens and a full-screen modal group for the scanners.
- **Theme** — `src/theme/tokens.ts` imports `design-tokens/tokens.json` and exposes typed `elevation()`, `typeStyle()` and gradient helpers; no hard-coded hex values in components.
- **Motion** — Reanimated 3 throughout (see the animation spec); Lottie and Rive are reserved for illustrations, the heartbeat refresh loader and the native scanner/waveform.

## Not yet wired

Real backend, Poppins/Inter font files, native camera + ML Kit OCR, Whisper speech-to-text, haptics, push notifications and PDF export. The mock API returns realistic payloads for all of these so the UI is complete and testable today.
