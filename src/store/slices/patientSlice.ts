import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mockApi } from '../../mock/api';
import type { HistoryEntry, Prescription, Report, Vital } from '../../types';

interface PatientState {
  vitals: Vital[];
  prescriptions: Prescription[];
  reports: Report[];
  history: HistoryEntry[];
  loading: boolean;
  uploading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  vitals: [],
  prescriptions: [],
  reports: [],
  history: [],
  loading: false,
  uploading: false,
  error: null,
};

export const loadPatientDashboard = createAsyncThunk(
  'patient/loadDashboard',
  async (patientId: string) => {
    const [vitals, prescriptions, reports, history] = await Promise.all([
      mockApi.getVitals(),
      mockApi.getPrescriptions(patientId),
      mockApi.getReports(patientId),
      mockApi.getHistory(patientId),
    ]);
    return { vitals, prescriptions, reports, history };
  },
);

export const uploadReport = createAsyncThunk(
  'patient/uploadReport',
  ({ patientId, title }: { patientId: string; title: string }) => mockApi.uploadReport(patientId, title),
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPatientDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPatientDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.vitals = action.payload.vitals;
        state.prescriptions = action.payload.prescriptions;
        state.reports = action.payload.reports;
        state.history = action.payload.history;
      })
      .addCase(loadPatientDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Could not load records';
      })
      .addCase(uploadReport.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadReport.fulfilled, (state, action) => {
        state.uploading = false;
        state.reports.unshift(action.payload);
      })
      .addCase(uploadReport.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.error.message ?? 'Upload failed';
      });
  },
});

export default patientSlice.reducer;
