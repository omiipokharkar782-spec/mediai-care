export type Role = 'patient' | 'doctor' | 'admin';

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export type PrescriptionKind = 'clinical' | 'ayurvedic';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatarColor: string;
  phone: string;
  email?: string;
}

export interface Vital {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'flat';
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  kind: PrescriptionKind;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorName: string;
  issuedAt: string;
  kind: PrescriptionKind;
  diagnosis: string;
  medicines: Medicine[];
}

export interface Report {
  id: string;
  patientId: string;
  title: string;
  category: 'lab' | 'imaging' | 'discharge';
  uploadedAt: string;
  sizeKb: number;
  status: 'ready' | 'processing';
}

export interface HistoryEntry {
  id: string;
  patientId: string;
  title: string;
  date: string;
  summary: string;
  details: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  startsAt: string;
  reason: string;
  status: AppointmentStatus;
}

export interface ChatMessage {
  id: string;
  author: 'user' | 'assistant';
  text: string;
  createdAt: string;
}

export interface InteractionWarning {
  id: string;
  severity: 'low' | 'moderate' | 'high';
  drugA: string;
  drugB: string;
  description: string;
  advice: string;
}

export interface OcrResult {
  rawText: string;
  medicines: Medicine[];
  confidence: number;
}

export interface PatientSummary {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  lastVisit: string;
  conditions: string[];
  avatarColor: string;
}
