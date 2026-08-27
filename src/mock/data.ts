import type {
  Appointment,
  ChatMessage,
  HistoryEntry,
  InteractionWarning,
  Medicine,
  PatientSummary,
  Prescription,
  Report,
  User,
  Vital,
} from '../types';

export const currentPatient: User = {
  id: 'pat-001',
  name: 'Aarav Deshmukh',
  role: 'patient',
  avatarColor: '#DCEEFB',
  phone: '+91 98220 11234',
  email: 'aarav.d@example.com',
};

export const currentDoctor: User = {
  id: 'doc-001',
  name: 'Dr. Meera Kulkarni',
  role: 'doctor',
  avatarColor: '#D6F5E3',
  phone: '+91 98220 55678',
  email: 'meera.k@mediai.care',
};

export const currentAdmin: User = {
  id: 'adm-001',
  name: 'Rohit Salunkhe',
  role: 'admin',
  avatarColor: '#E6DFF6',
  phone: '+91 98220 99001',
  email: 'rohit.s@mediai.care',
};

export const vitals: Vital[] = [
  { id: 'v1', label: 'Heart rate', value: 78, unit: 'bpm', trend: 'flat' },
  { id: 'v2', label: 'Systolic BP', value: 126, unit: 'mmHg', trend: 'up' },
  { id: 'v3', label: 'SpO2', value: 98, unit: '%', trend: 'flat' },
  { id: 'v4', label: 'Glucose (F)', value: 104, unit: 'mg/dL', trend: 'down' },
];

export const patients: PatientSummary[] = [
  {
    id: 'pat-001',
    name: 'Aarav Deshmukh',
    age: 34,
    gender: 'male',
    bloodGroup: 'B+',
    lastVisit: '2026-08-18',
    conditions: ['Hypertension', 'Vitamin D deficiency'],
    avatarColor: '#DCEEFB',
  },
  {
    id: 'pat-002',
    name: 'Sanika Patil',
    age: 28,
    gender: 'female',
    bloodGroup: 'O+',
    lastVisit: '2026-08-24',
    conditions: ['PCOS'],
    avatarColor: '#FFE3D5',
  },
  {
    id: 'pat-003',
    name: 'Imran Shaikh',
    age: 51,
    gender: 'male',
    bloodGroup: 'A-',
    lastVisit: '2026-08-25',
    conditions: ['Type 2 diabetes', 'Dyslipidemia'],
    avatarColor: '#E6DFF6',
  },
  {
    id: 'pat-004',
    name: 'Leela Nair',
    age: 63,
    gender: 'female',
    bloodGroup: 'AB+',
    lastVisit: '2026-08-26',
    conditions: ['Osteoarthritis'],
    avatarColor: '#D6F5E3',
  },
];

export const medicineCatalog: Medicine[] = [
  { id: 'med-amlo', name: 'Amlodipine', dosage: '5 mg', frequency: '1-0-0', durationDays: 30, kind: 'clinical' },
  { id: 'med-metf', name: 'Metformin', dosage: '500 mg', frequency: '1-0-1', durationDays: 30, kind: 'clinical' },
  { id: 'med-atorva', name: 'Atorvastatin', dosage: '10 mg', frequency: '0-0-1', durationDays: 30, kind: 'clinical' },
  { id: 'med-warf', name: 'Warfarin', dosage: '3 mg', frequency: '0-0-1', durationDays: 14, kind: 'clinical' },
  { id: 'med-ibu', name: 'Ibuprofen', dosage: '400 mg', frequency: '1-1-1', durationDays: 5, kind: 'clinical' },
  { id: 'med-ashwa', name: 'Ashwagandha churna', dosage: '3 g', frequency: '1-0-1', durationDays: 45, kind: 'ayurvedic' },
  { id: 'med-guggul', name: 'Guggulu', dosage: '500 mg', frequency: '1-0-1', durationDays: 30, kind: 'ayurvedic' },
  { id: 'med-triphala', name: 'Triphala', dosage: '5 g', frequency: '0-0-1', durationDays: 60, kind: 'ayurvedic' },
  { id: 'med-brahmi', name: 'Brahmi vati', dosage: '250 mg', frequency: '1-0-1', durationDays: 30, kind: 'ayurvedic' },
];

export const prescriptions: Prescription[] = [
  {
    id: 'rx-101',
    patientId: 'pat-001',
    doctorName: 'Dr. Meera Kulkarni',
    issuedAt: '2026-08-18',
    kind: 'clinical',
    diagnosis: 'Stage-1 hypertension',
    medicines: [medicineCatalog[0], medicineCatalog[2]],
  },
  {
    id: 'rx-102',
    patientId: 'pat-001',
    doctorName: 'Vaidya S. Joshi',
    issuedAt: '2026-07-02',
    kind: 'ayurvedic',
    diagnosis: 'Stress-induced insomnia',
    medicines: [medicineCatalog[5], medicineCatalog[8]],
  },
  {
    id: 'rx-103',
    patientId: 'pat-003',
    doctorName: 'Dr. Meera Kulkarni',
    issuedAt: '2026-08-25',
    kind: 'clinical',
    diagnosis: 'Type 2 diabetes follow-up',
    medicines: [medicineCatalog[1], medicineCatalog[2]],
  },
];

export const reports: Report[] = [
  { id: 'rep-1', patientId: 'pat-001', title: 'Lipid profile', category: 'lab', uploadedAt: '2026-08-18', sizeKb: 412, status: 'ready' },
  { id: 'rep-2', patientId: 'pat-001', title: 'Chest X-ray PA view', category: 'imaging', uploadedAt: '2026-06-11', sizeKb: 2840, status: 'ready' },
  { id: 'rep-3', patientId: 'pat-001', title: 'CBC with ESR', category: 'lab', uploadedAt: '2026-08-26', sizeKb: 288, status: 'processing' },
  { id: 'rep-4', patientId: 'pat-003', title: 'HbA1c', category: 'lab', uploadedAt: '2026-08-25', sizeKb: 190, status: 'ready' },
  { id: 'rep-5', patientId: 'pat-004', title: 'Knee MRI', category: 'imaging', uploadedAt: '2026-08-26', sizeKb: 5120, status: 'ready' },
];

export const history: HistoryEntry[] = [
  {
    id: 'his-1',
    patientId: 'pat-001',
    title: 'Hypertension diagnosed',
    date: '2026-08-18',
    summary: 'BP 148/94 over three readings; started on Amlodipine 5 mg.',
    details: ['BP 148/94 mmHg', 'ECG normal sinus rhythm', 'Advised low-sodium diet', 'Review in 4 weeks'],
  },
  {
    id: 'his-2',
    patientId: 'pat-001',
    title: 'Seasonal bronchitis',
    date: '2026-06-11',
    summary: 'Productive cough for 6 days, resolved with a 5-day antibiotic course.',
    details: ['Chest X-ray clear', 'Azithromycin 500 mg x 3 days', 'Steam inhalation advised'],
  },
  {
    id: 'his-3',
    patientId: 'pat-001',
    title: 'Annual health check',
    date: '2026-01-20',
    summary: 'All parameters within range except Vitamin D (18 ng/mL).',
    details: ['Vitamin D 18 ng/mL', 'Weekly cholecalciferol 60k IU x 8 weeks'],
  },
];

export const appointments: Appointment[] = [
  { id: 'apt-1', patientId: 'pat-001', patientName: 'Aarav Deshmukh', doctorName: 'Dr. Meera Kulkarni', startsAt: '2026-08-27T09:30:00+05:30', reason: 'BP follow-up', status: 'confirmed' },
  { id: 'apt-2', patientId: 'pat-002', patientName: 'Sanika Patil', doctorName: 'Dr. Meera Kulkarni', startsAt: '2026-08-27T10:15:00+05:30', reason: 'Hormonal panel review', status: 'pending' },
  { id: 'apt-3', patientId: 'pat-003', patientName: 'Imran Shaikh', doctorName: 'Dr. Meera Kulkarni', startsAt: '2026-08-27T11:00:00+05:30', reason: 'Diabetes review', status: 'confirmed' },
  { id: 'apt-4', patientId: 'pat-004', patientName: 'Leela Nair', doctorName: 'Dr. A. Rane', startsAt: '2026-08-28T16:45:00+05:30', reason: 'Knee pain', status: 'cancelled' },
  { id: 'apt-5', patientId: 'pat-001', patientName: 'Aarav Deshmukh', doctorName: 'Vaidya S. Joshi', startsAt: '2026-08-29T18:00:00+05:30', reason: 'Ayurvedic consult', status: 'pending' },
];

export const interactionRules: InteractionWarning[] = [
  {
    id: 'int-1',
    severity: 'high',
    drugA: 'Warfarin',
    drugB: 'Ibuprofen',
    description: 'NSAIDs displace warfarin from plasma proteins and impair platelet function.',
    advice: 'Prefer paracetamol for analgesia; if unavoidable, monitor INR closely.',
  },
  {
    id: 'int-2',
    severity: 'moderate',
    drugA: 'Warfarin',
    drugB: 'Ashwagandha churna',
    description: 'Ayurvedic adaptogen may potentiate anticoagulant effect.',
    advice: 'Check INR after 5 days of co-administration.',
  },
  {
    id: 'int-3',
    severity: 'moderate',
    drugA: 'Metformin',
    drugB: 'Guggulu',
    description: 'Guggulu can add a hypoglycaemic effect to metformin.',
    advice: 'Advise the patient to watch for hypoglycaemia symptoms.',
  },
  {
    id: 'int-4',
    severity: 'low',
    drugA: 'Atorvastatin',
    drugB: 'Guggulu',
    description: 'Overlapping lipid-lowering action; usually clinically insignificant.',
    advice: 'Recheck lipid profile in 6 weeks.',
  },
];

export const chatSeed: ChatMessage[] = [
  {
    id: 'msg-1',
    author: 'assistant',
    text: 'Namaste Aarav. I can explain your reports, remind you about medicines, or book an appointment. What would you like to do?',
    createdAt: '2026-08-27T07:00:00+05:30',
  },
];

export const quickPrompts = [
  'Explain my last lipid profile',
  'When is my next dose?',
  'Book a follow-up',
  'Any diet advice for BP?',
];

export const ocrSampleText = [
  'Rx  Dr. Meera Kulkarni, MD',
  'Tab Amlodipine 5mg  1-0-0  x 30 days',
  'Tab Atorvastatin 10mg  0-0-1  x 30 days',
  'Review after 4 weeks',
].join('\n');

export const adminStats = [
  { id: 'a1', label: 'Active patients', value: 1284 },
  { id: 'a2', label: 'Doctors onboarded', value: 76 },
  { id: 'a3', label: 'Reports processed', value: 5340 },
  { id: 'a4', label: 'AI queries today', value: 912 },
];
