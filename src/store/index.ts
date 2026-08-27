import { configureStore } from '@reduxjs/toolkit';
import admin from './slices/adminSlice';
import ai from './slices/aiSlice';
import auth from './slices/authSlice';
import doctor from './slices/doctorSlice';
import patient from './slices/patientSlice';

export const store = configureStore({
  reducer: { auth, patient, doctor, admin, ai },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
