export type DoctorPrescriptionStatus =
  | "Dispensed"
  | "Pending"
  | "Cancelled"
  | "Out of stock";

export type DoctorPrescriptionRow = {
  prescribedId: string;
  patientId: string;
  patientName: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  date: string;
  status: DoctorPrescriptionStatus;
};

export type DoctorPrescriptionApiRow = {
  id?: string;
  prescription_id?: string;
  prescribed_id?: string;
  patient_id?: string;
  patient_name?: string;
  drug_name?: string;
  medications?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  date?: string;
  created_at?: string;
  status?: string;
  patient?: {
    patient_id?: string;
    full_name?: string;
  };
  items?: Array<{
    dosage?: string;
    frequency?: string;
    duration?: string;
  }>;
};

export type DoctorPrescriptionApiPayload = {
  results?: DoctorPrescriptionApiRow[];
  data?: {
    results?: DoctorPrescriptionApiRow[];
  };
  total_pages?: number;
};

export type DoctorLabStatus = "Ready" | "Processing";

export type DoctorLabRow = {
  requestId: string;
  patientId: string;
  patientName: string;
  labTest: string;
  result: string;
  date: string;
  status: DoctorLabStatus;
};

export type DoctorLabApiRow = {
  id?: string;
  lab_request_id?: string;
  request_id?: string;
  patient_id?: string;
  patient_name?: string;
  lab_test?: string;
  test_type?: string;
  test_name?: string;
  result?: string;
  result_value?: string;
  date?: string;
  request_date?: string;
  created_at?: string;
  status?: string;
  patient?: {
    patient_id?: string;
    full_name?: string;
  };
};

export type DoctorLabApiPayload = {
  results?: DoctorLabApiRow[];
  data?: {
    results?: DoctorLabApiRow[];
  };
  total_pages?: number;
};

export type DoctorReferralStatus = "Accepted" | "Pending" | "Rejected";

export type DoctorPrescriptionLine = {
  drug: string;
  dose: string;
  frequency: string;
  duration: string;
};

export type DoctorPatientSummary = {
  patientId: string;
  patientName: string;
  encounterId: string;
  ageGender: string;
  diagnosis: string;
  allergies: string;
  lastVisit: string;
  prescriptions: DoctorPrescriptionLine[];
};

export type DoctorReferralRow = {
  referralId: string;
  patientId: string;
  patientName: string;
  referringFacility: string;
  receivingFacility: string;
  reason: string;
  date: string;
  status: DoctorReferralStatus;
  notes: string;
};

export type DoctorReferralApiRow = {
  id?: string;
  referral_id?: string;
  patient_id?: string;
  patient_name?: string;
  referring_facility?: string;
  receiving_facility?: string;
  referral_type?: string;
  reason?: string;
  clinical_summary?: string;
  notes?: string;
  date?: string;
  referral_date?: string;
  created_at?: string;
  status?: string;
  patient?: {
    patient_id?: string;
    full_name?: string;
  };
  from_facility?: {
    name?: string;
  };
  to_facility?: {
    name?: string;
  };
};

export type DoctorReferralApiPayload = {
  results?: DoctorReferralApiRow[];
  data?: {
    results?: DoctorReferralApiRow[];
  };
  total_pages?: number;
};

export type DoctorReferralForm = {
  patientId: string;
  referringFacility: string;
  receivingFacility: string;
  referralType: string;
  reason: string;
  clinicalSummary: string;
  doctorNotes: string;
  prescriptions: DoctorPrescriptionLine[];
};

export type DoctorPatientListRow = {
  id: string;
  name: string;
  ageGender: string;
  lastVisit: string;
  condition: string;
};

export type DoctorPatientApiRow = {
  id?: string;
  patient_id?: string;
  full_name?: string;
  name?: string;
  age?: number | string;
  gender?: string;
  last_visit?: string;
  condition?: string;
  diagnosis?: string;
};

export type DoctorPatientApiPayload = {
  results?: DoctorPatientApiRow[];
  data?: {
    results?: DoctorPatientApiRow[];
  };
  total_pages?: number;
};
