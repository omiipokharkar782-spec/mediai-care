import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mockApi } from '../../mock/api';
import { currentAdmin, currentDoctor, currentPatient } from '../../mock/data';
import type { Role, User } from '../../types';

interface AuthState {
  role: Role | null;
  user: User | null;
  token: string | null;
  otpRequestId: string | null;
  status: 'idle' | 'requesting-otp' | 'verifying' | 'authenticated';
  error: string | null;
}

const initialState: AuthState = {
  role: null,
  user: null,
  token: null,
  otpRequestId: null,
  status: 'idle',
  error: null,
};

const profiles: Record<Role, User> = {
  patient: currentPatient,
  doctor: currentDoctor,
  admin: currentAdmin,
};

export const requestOtp = createAsyncThunk('auth/requestOtp', (phone: string) => mockApi.requestOtp(phone));

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  ({ code, role }: { code: string; role: Role }) => mockApi.verifyOtp(code, role),
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    selectRole(state, action: PayloadAction<Role>) {
      state.role = action.payload;
      state.error = null;
    },
    signOut() {
      return initialState;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestOtp.pending, (state) => {
        state.status = 'requesting-otp';
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.status = 'idle';
        state.otpRequestId = action.payload.requestId;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message ?? 'Could not send OTP';
      })
      .addCase(verifyOtp.pending, (state) => {
        state.status = 'verifying';
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.user = profiles[action.payload.role];
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message ?? 'Invalid OTP';
      });
  },
});

export const { selectRole, signOut, clearError } = authSlice.actions;
export default authSlice.reducer;
