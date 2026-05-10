export type PrescriptionStatus =
  | "Dispensed"
  | "Pending"
  | "cancelled"
  | "Out of stock"
  | "Partially";

export type PrescriptionRow = {
  prescribedId: string;
  patientId: string;
  patientName: string;
  medications: string;
  prescribedBy: string;
  date: string;
  status: PrescriptionStatus;
};

export const prescriptionBadgeColors: Record<
  PrescriptionStatus,
  { bg: string; text: string }
> = {
  Dispensed: { bg: "#DDF2EA", text: "#00A556" },
  Pending: { bg: "#FFF1DE", text: "#2E2E2E" },
  cancelled: { bg: "#FFE5E5", text: "#FF1F1F" },
  "Out of stock": { bg: "#FFE5E5", text: "#FF1F1F" },
  Partially: { bg: "#E2E7FF", text: "#046C3F" },
};

export const PRESCRIPTIONS: PrescriptionRow[] = [
  "Dispensed",
  "Dispensed",
  "Pending",
  "cancelled",
  "Out of stock",
  "Partially",
  "Partially",
  "Dispensed",
  "Pending",
  "Pending",
].map((status) => ({
  prescribedId: "PRC-PLT-000234",
  patientId: "PAT-PLT-000234",
  patientName: "Emeka Dike",
  medications: "3 items",
  prescribedBy: "Dr Emeka Dike",
  date: "12 Mar 2026",
  status: status as PrescriptionStatus,
}));

export const DRUG_OPTIONS = [
  "Amlodipine 10mg",
  "Azithromycin 500mg",
  "Sumatriptan 50mg",
  "Insulin Glargine 100IU",
  "Paracetamol 1g",
  "Warfarin 5mg",
  "Amoxicillin Susp",
  "Artemether-Lumefantrine",
  "Amoxicillin 500mg",
  "Metformin 500mg",
  "Paracetamol 500mg",
  "Ibuprofen 400mg",
  "Atorvastatin 40mg",
  "Azithromycin 500mg",
  "Salbutamol Inhaler",
];

export const FREQUENCY_OPTIONS = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Start once",
];

export const PAYMENT_OPTIONS = ["Cash", "POS", "Transfer"];

export type PharmacyInventoryStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type PharmacyInventoryRow = {
  drugName: string;
  batch: string;
  unit: string;
  qty: number;
  threshold: number;
  price: string;
  expiry: string;
  status: PharmacyInventoryStatus;
  updated: string;
};

export const PHARMACY_INVENTORY: PharmacyInventoryRow[] = [
  {
    drugName: "Amlodipine 10mg",
    batch: "A-2299",
    unit: "Tablet",
    qty: 34,
    threshold: 15,
    price: "NGN 1,500",
    expiry: "2030-01-01",
    status: "In Stock",
    updated: "2 days ago",
  },
  {
    drugName: "Azithromycin 500mg",
    batch: "B-1187",
    unit: "Capsule",
    qty: 13,
    threshold: 20,
    price: "NGN 3,000",
    expiry: "2030-01-01",
    status: "In Stock",
    updated: "3 days ago",
  },
  {
    drugName: "Metformin 500mg",
    batch: "B-3402",
    unit: "Bottle",
    qty: 56,
    threshold: 15,
    price: "NGN 1,500",
    expiry: "2030-01-01",
    status: "Low Stock",
    updated: "7 days ago",
  },
  {
    drugName: "Sumatriptan 50mg",
    batch: "B-7781",
    unit: "Vial",
    qty: 123,
    threshold: 10,
    price: "NGN 2,500",
    expiry: "2030-01-01",
    status: "Out of Stock",
    updated: "26 May 2026",
  },
  {
    drugName: "Insulin Glargine 100IU",
    batch: "B-9920",
    unit: "Ampoule",
    qty: 234,
    threshold: 20,
    price: "NGN 4,500",
    expiry: "2030-01-01",
    status: "Out of Stock",
    updated: "26 May 2026",
  },
  {
    drugName: "Paracetamol 1g",
    batch: "B-9920",
    unit: "Sachet",
    qty: 34,
    threshold: 20,
    price: "NGN 10,500",
    expiry: "2030-01-01",
    status: "In Stock",
    updated: "26 May 2026",
  },
  {
    drugName: "Warfarin 5mg",
    batch: "B-9920",
    unit: "Inhaler",
    qty: 76,
    threshold: 20,
    price: "NGN 5,500",
    expiry: "2030-01-01",
    status: "In Stock",
    updated: "26 May 2026",
  },
  {
    drugName: "Warfarin 5mg",
    batch: "B-9920",
    unit: "Tube",
    qty: 56,
    threshold: 20,
    price: "NGN 1,500",
    expiry: "2030-01-01",
    status: "In Stock",
    updated: "26 May 2026",
  },
  {
    drugName: "Warfarin 5mg",
    batch: "B-9920",
    unit: "Tube",
    qty: 78,
    threshold: 15,
    price: "NGN 1,500",
    expiry: "2030-01-01",
    status: "Low Stock",
    updated: "26 May 2026",
  },
  {
    drugName: "Warfarin 5mg",
    batch: "B-9920",
    unit: "Tube",
    qty: 23,
    threshold: 25,
    price: "NGN 1,500",
    expiry: "2030-01-01",
    status: "Low Stock",
    updated: "26 May 2026",
  },
];

export type ExpiringDrugRow = {
  drugName: string;
  batch: string;
  unit: string;
  qty: number;
  expiry: string;
  daysLeft: number;
};

export const EXPIRING_DRUGS: ExpiringDrugRow[] = [
  {
    drugName: "Amlodipine 10mg",
    batch: "A-2299",
    unit: "Tablet",
    qty: 34,
    expiry: "2028-01-10",
    daysLeft: 60,
  },
  {
    drugName: "Azithromycin 500mg",
    batch: "B-1187",
    unit: "Capsule",
    qty: 13,
    expiry: "2028-01-10",
    daysLeft: 34,
  },
  {
    drugName: "Metformin 500mg",
    batch: "B-3402",
    unit: "Bottle",
    qty: 56,
    expiry: "2028-01-10",
    daysLeft: 90,
  },
  {
    drugName: "Sumatriptan 50mg",
    batch: "B-7781",
    unit: "Vial",
    qty: 123,
    expiry: "2028-01-10",
    daysLeft: 123,
  },
  {
    drugName: "Insulin Glargine 100IU",
    batch: "B-9920",
    unit: "Ampoule",
    qty: 234,
    expiry: "2028-01-10",
    daysLeft: 234,
  },
  {
    drugName: "Paracetamol 1g",
    batch: "B-9920",
    unit: "Sachet",
    qty: 34,
    expiry: "2028-01-10",
    daysLeft: 345,
  },
  {
    drugName: "Warfarin 5mg",
    batch: "B-9920",
    unit: "Inhaler",
    qty: 76,
    expiry: "2028-01-10",
    daysLeft: 565,
  },
  {
    drugName: "Warfarin 5mg",
    batch: "B-9920",
    unit: "Tube",
    qty: 56,
    expiry: "2028-01-10",
    daysLeft: 343,
  },
  {
    drugName: "Warfarin 5mg",
    batch: "B-9920",
    unit: "Tube",
    qty: 78,
    expiry: "2028-01-10",
    daysLeft: 24,
  },
  {
    drugName: "Warfarin 5mg",
    batch: "B-9920",
    unit: "Tube",
    qty: 23,
    expiry: "2028-01-10",
    daysLeft: 567,
  },
];

export const PHARMACY_PATIENTS = [
  {
    patientId: "PAT-PLT-000234",
    patientName: "Emeka Dike",
    ageGender: "45 / F",
    lastPrescription: "12 Mar 2026",
    status: "Active",
  },
  {
    patientId: "PAT-PLT-000235",
    patientName: "Amina Yusuf",
    ageGender: "34 / F",
    lastPrescription: "12 Mar 2026",
    status: "Active",
  },
  {
    patientId: "PAT-PLT-000236",
    patientName: "Liam O'Connor",
    ageGender: "52 / M",
    lastPrescription: "11 Mar 2026",
    status: "Active",
  },
];

export const PHARMACY_PAYMENTS = [
  {
    paymentId: "PAY-PLT-000234",
    patientName: "Emeka Dike",
    amount: "NGN 4,500",
    method: "POS",
    date: "12 Mar 2026",
    status: "Completed",
  },
  {
    paymentId: "PAY-PLT-000235",
    patientName: "Amina Yusuf",
    amount: "NGN 2,100",
    method: "Cash",
    date: "12 Mar 2026",
    status: "Pending",
  },
];

export const ADVERSE_EVENTS = [
  {
    reportId: "ADR-PLT-000234",
    patientName: "John Eze",
    drug: "Amoxicillin",
    reaction: "Rash",
    reportedBy: "Paul Ayo",
    severity: "Mild",
    date: "26 May 2026",
    status: "Reported",
  },
  {
    reportId: "ADR-PLT-000234",
    patientName: "Jane Nwoye",
    drug: "Paracetamol",
    reaction: "Vomiting",
    reportedBy: "Paul Ayo",
    severity: "Mild",
    date: "26 May 2026",
    status: "Pending",
  },
  {
    reportId: "ADR-PLT-000234",
    patientName: "John Eze",
    drug: "Paracetamol",
    reaction: "Vomiting",
    reportedBy: "Paul Ayo",
    severity: "Moderate",
    date: "26 May 2026",
    status: "Resolved",
  },
  {
    reportId: "ADR-PLT-000234",
    patientName: "John Eze",
    drug: "Paracetamol",
    reaction: "Vomiting",
    reportedBy: "Paul Ayo",
    severity: "Severe",
    date: "26 May 2026",
    status: "Reported",
  },
  {
    reportId: "ADR-PLT-000234",
    patientName: "John Eze",
    drug: "Paracetamol",
    reaction: "Vomiting",
    reportedBy: "Paul Ayo",
    severity: "Severe",
    date: "26 May 2026",
    status: "Pending",
  },
];
