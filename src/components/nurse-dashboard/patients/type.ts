export interface PatientFilters {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface PatientProfile {
  id: string;
  patient_id: string;
  age: number;
  age_group: string;
  sex: string;
  blood_group: string;
  insurance_status: string;
  date_of_birth: string;
}

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email?: string;
  phone_number: string;
  address: string;
  state: string;
  is_active: boolean;
  profile: PatientProfile;
  created_at: string;
  updated_at: string;
}

export interface PaginatedPatientsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: Patient[];
}

export interface PatientAppointment {
  id: string;
  appointment_id: string;
  patient_name: string;
  patient_display_id: string;
  assigned_staff_name: string;
  appointment_date: string;
  appointment_time: string;
  visit_type: string;
  status: string;
  reason_for_visit: string;
  notes: string;
  created_at: string;
}

export interface PatientLabTest {
  id: string;
  test_name: string;
  test_status: string;
  result_value: string | null;
  result_unit: string | null;
}

export interface PatientLabRequest {
  id: string;
  request_id: string;
  patient_name: string;
  requested_by_name: string;
  status: string;
  created_at: string;
  tests: PatientLabTest[];
}

export interface PatientPrescriptionItem {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PatientPrescription {
  id: string;
  prescription_id: string;
  prescribed_by_name: string;
  status: string;
  created_at: string;
  items: PatientPrescriptionItem[];
}

export interface PatientReferral {
  id: string;
  referral_id: string;
  referring_facility_name: string;
  receiving_facility_name: string;
  referred_by_name: string;
  referral_type: string;
  reason_for_referral: string;
  status: string;
  created_at: string;
}

export interface TabFilters {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export interface CreatePatientPayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email?: string;
  phone_number: string;
  address: string;
  state: string;
  is_active: boolean;
  sex: string;
  date_of_birth: string;
  lga?: string;
  ward?: string;
  next_of_kin_name: string;
  next_of_kin_phone: string;
  insurance_status?: string;
  insurance_provider?: string;
  insurance_package?: string;
  coverage_status?: string;
  allergies?: string;
  chronic_conditions?: string;
  notes?: string;
  blood_group?: string;
  genotype?: string;
}
