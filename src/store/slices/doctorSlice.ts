import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mockApi } from '../../mock/api';
import type { Appointment, InteractionWarning, Medicine, PatientSummary, Prescription } from '../../types';

interface DoctorState {
  patients: PatientSummary[];
  appointments: Appointment[];
  catalog: Medicine[];
  draftMedicines: Medicine[];
  draftDiagnosis: string;
  warnings: InteractionWarning[];
  checkingInteractions: boolean;
  savedPrescription: Prescription | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  patients: [],
  appointments: [],
  catalog: [],
  draftMedicines: [],
  draftDiagnosis: '',
  warnings: [],
  checkingInteractions: false,
  savedPrescription: null,
  loading: false,
  error: null,
};

export const loadDoctorDashboard = createAsyncThunk('doctor/loadDashboard', async () => {
  const [patients, appointments, catalog] = await Promise.all([
    mockApi.getPatients(),
    mockApi.getAppointments(),
    mockApi.getMedicineCatalog(),
  ]);
  return { patients, appointments, catalog };
});

export const checkInteractions = createAsyncThunk(
  'doctor/checkInteractions',
  (selected: Medicine[]) => mockApi.checkInteractions(selected),
);

export const savePrescription = createAsyncThunk(
  'doctor/savePrescription',
  (draft: Omit<Prescription, 'id'>) => mockApi.savePrescription(draft),
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setDiagnosis(state, action: PayloadAction<string>) {
      state.draftDiagnosis = action.payload;
    },
    toggleDraftMedicine(state, action: PayloadAction<Medicine>) {
      const exists = state.draftMedicines.some((m) => m.id === action.payload.id);
      state.draftMedicines = exists
        ? state.draftMedicines.filter((m) => m.id !== action.payload.id)
        : [...state.draftMedicines, action.payload];
    },
    resetDraft(state) {
      state.draftMedicines = [];
      state.draftDiagnosis = '';
      state.warnings = [];
      state.savedPrescription = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDoctorDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadDoctorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.patients;
        state.appointments = action.payload.appointments;
        state.catalog = action.payload.catalog;
      })
      .addCase(loadDoctorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Could not load practice data';
      })
      .addCase(checkInteractions.pending, (state) => {
        state.checkingInteractions = true;
      })
      .addCase(checkInteractions.fulfilled, (state, action) => {
        state.checkingInteractions = false;
        state.warnings = action.payload;
      })
      .addCase(savePrescription.fulfilled, (state, action) => {
        state.savedPrescription = action.payload;
      });
  },
});

export const { setDiagnosis, toggleDraftMedicine, resetDraft } = doctorSlice.actions;
export default doctorSlice.reducer;
