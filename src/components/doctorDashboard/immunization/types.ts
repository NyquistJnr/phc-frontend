export type ViewMode = "records" | "register";

export type ImmunizationStatus = "COMPLETED" | "PENDING";
export type SessionType = "FIXED" | "OUTREACH" | "MOBILE";

export type ImmunizationRecordApi = {
  id: string;
  patient: string;
  patient_name: string;
  patient_display_id: string;
  appointment: string;
  facility: string;
  session_type: SessionType;
  state: string;
  lga: string;
  ward: string;
  site_name: string;
  vaccine_given: string;
  vaccine_name: string;
  date_of_visit: string;
  status: ImmunizationStatus;
  age_at_vaccination: string;
  notes: string;
  administered_by: string;
  administered_by_name: string;
  created_at: string;
  updated_at: string;
};

export type ImmunizationFilters = {
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
  session_type?: string;
  status?: string;
};

export type ImmunizationResponseData = {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: ImmunizationRecordApi[];
};

export type ImmunizationRegistrationPayload = {
  session_type: string;
  site_name: string;
  state: string;
  lga: string;
  ward: string;
  vaccine_given_id: string;
  date_of_visit: string;
  notes: string;
  patient_id?: string;
  new_patient_data?: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    sex: string;
    next_of_kin_name: string;
    next_of_kin_phone: string;
  };
};

export type Drug = {
  id: string;
  name: string;
  category: string;
  unit: string;
  global_threshold: number;
  total_stock: number;
  status: string;
  active_batches_count: number;
};

export type DrugInventoryResponse = {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: Drug[];
};

export type RegistrationFormState = {
  sessionType: string;
  state: string;
  lga: string;
  ward: string;
  siteName: string;
  vaccineGivenId: string;
  dateOfVisit: string;
  notes: string;
  patientSearchInput: string;
  patientId: string;
  patientDisplayId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
};
