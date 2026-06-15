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
  vaccines_given_ids: string[];
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
    next_of_kin_relationship: string;
  };
};

export type InventoryItem = {
  id: string;
  name: string;
  inventory_category: string;
  drug_classification: string;
  item_type: string;
  threshold_type: string;
  global_threshold: number;
  schedule_rules: {
    type: string;
    intervals_in_days: number[];
  } | null;
  total_stock: number;
  status: string;
};

export type InventoryItemResponse = {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: InventoryItem[];
};

export type RegistrationFormState = {
  sessionType: string;
  state: string;
  lga: string;
  ward: string;
  routeOfAdministration: string;
  vaccinesGivenIds: string[];
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
  nextOfKinRelationship: string;
};
