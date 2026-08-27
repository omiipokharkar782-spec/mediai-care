# State Management Architecture

Redux Toolkit store, split into role-based slices plus a cross-role AI slice. Async work goes through `createAsyncThunk` against `src/mock/api.ts`, which is a drop-in stand-in for the GraphQL/REST contract in `api/`.

```
                         ┌────────────────────────────────┐
                         │        <Provider store>        │
                         └───────────────┬────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │             configureStore              │
                    └───┬───────┬───────────┬────────┬────────┘
                        │       │           │        │
                 ┌──────▼──┐ ┌──▼──────┐ ┌──▼─────┐ ┌▼───────┐ ┌─────────┐
                 │  auth   │ │ patient │ │ doctor │ │ admin  │ │   ai    │
                 └────┬────┘ └────┬────┘ └───┬────┘ └───┬────┘ └────┬────┘
                      │           │          │          │           │
   role, user, token  │  vitals   │ patients │  stats   │  messages, ocr,
   otpRequestId       │  rx       │ appts    │  audit   │  listening flags
   status/error       │  reports  │ catalog  │  toggle  │
                      │  history  │ draft Rx │          │
                      │           │ warnings │          │
                      └───────────┴────┬─────┴──────────┘
                                       │
                              ┌────────▼─────────┐
                              │  mockApi (src/   │
                              │  mock/api.ts)    │  ← swap for RTK Query
                              └────────┬─────────┘     against api/schema.graphql
                                       │
                              latency-simulated promises
```

## Slices

| Slice | Owns | Thunks | Consumed by |
| --- | --- | --- | --- |
| `auth` | `role`, `user`, `token`, `otpRequestId`, `status`, `error` | `requestOtp`, `verifyOtp` | Splash, Login, Profile, `RootNavigator` (gates auth vs app stack) |
| `patient` | `vitals`, `prescriptions`, `reports`, `history`, `uploading` | `loadPatientDashboard`, `uploadReport` | PatientHome, Reports, Prescriptions, MedicalHistory |
| `doctor` | `patients`, `appointments`, `catalog`, `draftMedicines`, `draftDiagnosis`, `warnings` | `loadDoctorDashboard`, `checkInteractions`, `savePrescription` | DoctorHome, Patients, PatientRecord, NewPrescription, Appointments |
| `admin` | platform `stats`, `auditLogEnabled` | — | AdminHome |
| `ai` | chat `messages`, `assistantTyping`, `listening`, `ocr`, `scanning` | `seedChat`, `askAssistant`, `runOcr` | AiChat, OcrScanner |

## Navigation gating

`RootNavigator` reads `auth.status`:

- `!== 'authenticated'` -> **AuthStack**: Splash (role selection) -> Login (OTP / password).
- `=== 'authenticated'` -> **AppStack**, whose first screen depends on `auth.role`: `PatientTabs`, `DoctorTabs` or `AdminTabs`. Detail screens (Prescriptions, MedicalHistory, PatientRecord, NewPrescription, AiChat) sit above the tabs; OcrScanner and QrScan live in a full-screen modal group.

## Production swap

Replace `mockApi` with RTK Query endpoints (`createApi` + `graphqlRequestBaseQuery`) mapped one-to-one onto `api/schema.graphql`. The thunks above become generated hooks; slice shapes stay identical, so screens do not change. Auth tokens attach in `prepareHeaders` from `auth.token`, and a 401 triggers the refresh-token mutation before retrying once.
