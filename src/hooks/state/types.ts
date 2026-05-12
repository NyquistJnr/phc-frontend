export interface Facility {
  id: string;
  code: string;
  name: string;
  facility_type: string;
  state: string;
  lga: string;
  ward: string | null;
  address: string;
  level: string;
  manager: string | null;            // uuid
  it_admin: string | null;           // uuid
  manager_name: string | null;
  it_admin_name: string | null;
  patient_count: number | null;
  staff_count: number | null;
  is_active: boolean;
  suspended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateFacilityPayload {
  name: string;
  facility_type: string;
  lga: string;
  ward?: string;
  address: string;
  level: string;
  manager_first_name: string;
  manager_last_name: string;
  manager_email: string;
  manager_phone: string;
  it_admin_first_name: string;
  it_admin_last_name: string;
  it_admin_email: string;
  it_admin_phone: string;
}

export type PatchFacilityPayload = Partial<CreateFacilityPayload>;

export interface FacilityFilters {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: string;   // "true" | "false" (API takes string)
  lga?: string;
  state?: string;
  ward?: string;
}

// Users (verify for both staff and patient)

export type RoleEnum =
  | "ADMIN"
  | "FACILITY_IT_ADMIN"
  | "OFFICER_IN_CHARGE"
  | "DOCTOR"
  | "PHARMACIST"
  | "LAB_TECHNICIAN"
  | "NURSE"
  | "CHEW"
  | "PATIENT";

export interface FacilityUser {
  id: string;
  staff_id: string | null;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
  phone_number: string | null;
  role: RoleEnum;
  is_active: boolean;
  suspended_at: string | null;
  last_login: string | null;
  created_at: string;
}

export interface InviteUserPayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone_number?: string;
  role: RoleEnum;
  facility_id: string;   // required for state-admin invite
}

export interface UserFilters {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
  is_active?: string;    // "true" | "false"
  start_date?: string;   // YYYY-MM-DD
  end_date?: string;
}

// Shared 
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
