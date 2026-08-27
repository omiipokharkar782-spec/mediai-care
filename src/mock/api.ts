import {
  appointments,
  chatSeed,
  history,
  interactionRules,
  medicineCatalog,
  ocrSampleText,
  patients,
  prescriptions,
  reports,
  vitals,
} from './data';
import type {
  Appointment,
  ChatMessage,
  HistoryEntry,
  InteractionWarning,
  Medicine,
  OcrResult,
  PatientSummary,
  Prescription,
  Report,
  Role,
  Vital,
} from '../types';

const LATENCY_MS = 450;

function delay<T>(payload: T, ms: number = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(payload), ms));
}

function id(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface OtpSession {
  requestId: string;
  expiresInSec: number;
}

export const mockApi = {
  requestOtp(phone: string): Promise<OtpSession> {
    if (!/^[0-9+ ]{10,16}$/.test(phone)) {
      return Promise.reject(new Error('Enter a valid mobile number'));
    }
    return delay({ requestId: id('otp'), expiresInSec: 120 });
  },

  verifyOtp(code: string, role: Role): Promise<{ token: string; role: Role }> {
    if (code.length !== 6) {
      return Promise.reject(new Error('OTP must be 6 digits'));
    }
    return delay({ token: id('jwt'), role });
  },

  getVitals(): Promise<Vital[]> {
    return delay(vitals);
  },

  getPatients(): Promise<PatientSummary[]> {
    return delay(patients);
  },

  getPatient(patientId: string): Promise<PatientSummary | undefined> {
    return delay(patients.find((p) => p.id === patientId));
  },

  getPrescriptions(patientId: string): Promise<Prescription[]> {
    return delay(prescriptions.filter((p) => p.patientId === patientId));
  },

  getReports(patientId: string): Promise<Report[]> {
    return delay(reports.filter((r) => r.patientId === patientId));
  },

  uploadReport(patientId: string, title: string): Promise<Report> {
    const report: Report = {
      id: id('rep'),
      patientId,
      title,
      category: 'lab',
      uploadedAt: new Date().toISOString().slice(0, 10),
      sizeKb: 320,
      status: 'processing',
    };
    return delay(report, 900);
  },

  getHistory(patientId: string): Promise<HistoryEntry[]> {
    return delay(history.filter((h) => h.patientId === patientId));
  },

  getAppointments(): Promise<Appointment[]> {
    return delay(appointments);
  },

  getMedicineCatalog(): Promise<Medicine[]> {
    return delay(medicineCatalog, 200);
  },

  checkInteractions(selected: Medicine[]): Promise<InteractionWarning[]> {
    const names = selected.map((m) => m.name);
    const hits = interactionRules.filter(
      (rule) => names.includes(rule.drugA) && names.includes(rule.drugB),
    );
    return delay(hits, 600);
  },

  savePrescription(draft: Omit<Prescription, 'id'>): Promise<Prescription> {
    return delay({ ...draft, id: id('rx') }, 700);
  },

  runOcr(): Promise<OcrResult> {
    return delay(
      {
        rawText: ocrSampleText,
        medicines: [medicineCatalog[0], medicineCatalog[2]],
        confidence: 0.93,
      },
      1600,
    );
  },

  seedChat(): Promise<ChatMessage[]> {
    return delay(chatSeed, 150);
  },

  askAssistant(question: string): Promise<ChatMessage> {
    const answer = buildAnswer(question);
    return delay(
      { id: id('msg'), author: 'assistant' as const, text: answer, createdAt: new Date().toISOString() },
      1200,
    );
  },
};

function buildAnswer(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('lipid') || q.includes('report')) {
    return 'Your 18 Aug lipid profile shows LDL 132 mg/dL (slightly high) and HDL 46 mg/dL. Atorvastatin 10 mg at night is already covering this; recheck in 6 weeks.';
  }
  if (q.includes('dose') || q.includes('medicine')) {
    return 'Next dose: Amlodipine 5 mg tomorrow morning at 8:00. Atorvastatin 10 mg is due tonight at 22:00.';
  }
  if (q.includes('appointment') || q.includes('book')) {
    return 'Dr. Meera Kulkarni has slots on 29 Aug at 09:30 and 11:15. Say "book 09:30" and I will confirm it.';
  }
  if (q.includes('diet') || q.includes('bp')) {
    return 'For stage-1 hypertension: keep sodium under 5 g/day, add potassium-rich foods (banana, spinach), and walk 30 minutes on 5 days a week.';
  }
  return 'I have noted that. I can explain reports, track medicines, and manage appointments — this is guidance only, not a diagnosis. Please confirm with Dr. Kulkarni.';
}
