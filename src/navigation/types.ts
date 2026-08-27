import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Login: { role: 'patient' | 'doctor' | 'admin' };
};

export type PatientTabParamList = {
  PatientHome: undefined;
  Reports: undefined;
  AiTools: undefined;
  Appointments: undefined;
  Profile: undefined;
};

export type DoctorTabParamList = {
  DoctorHome: undefined;
  Appointments: undefined;
  AiTools: undefined;
  Patients: undefined;
  Profile: undefined;
};

export type AdminTabParamList = {
  AdminHome: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  PatientTabs: NavigatorScreenParams<PatientTabParamList>;
  DoctorTabs: NavigatorScreenParams<DoctorTabParamList>;
  AdminTabs: NavigatorScreenParams<AdminTabParamList>;
  Prescriptions: { patientId: string };
  MedicalHistory: { patientId: string };
  PatientRecord: { patientId: string };
  NewPrescription: { patientId: string };
  OcrScanner: undefined;
  QrScan: undefined;
  AiChat: undefined;
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;
