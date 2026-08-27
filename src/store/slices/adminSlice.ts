import { createSlice } from '@reduxjs/toolkit';
import { adminStats } from '../../mock/data';

interface AdminState {
  stats: { id: string; label: string; value: number }[];
  auditLogEnabled: boolean;
}

const initialState: AdminState = {
  stats: adminStats,
  auditLogEnabled: true,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    toggleAuditLog(state) {
      state.auditLogEnabled = !state.auditLogEnabled;
    },
  },
});

export const { toggleAuditLog } = adminSlice.actions;
export default adminSlice.reducer;
