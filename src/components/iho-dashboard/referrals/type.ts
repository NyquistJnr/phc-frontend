export type ReferralStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CALL_CREATED" | "COMPLETED";
export type ReferralDirection = "inbound" | "outbound";

export interface ReferralResult {
  id: string;
  referral_id: string;
  appointment: string;
  patient: string;
  patient_name: string;
  patient_display_id: string;
  referring_facility: string;
  referring_facility_name: string;
  receiving_facility: string | null;
  receiving_facility_name: string | null;
  referred_by: string;
  referred_by_name: string;
  referral_type: string;
  destination_level?: string;
  mode_of_transportation?: string;
  mode_of_referral?: string | null;
  reason_for_referral: string;
  clinical_summary: string;
  status: ReferralStatus;
  direction: string;
  created_at: string;

  target_doctor_email?: string | null;
  target_department_email?: string | null;
  email_subject?: string;
  email_body?: string;

  telemedicine_session?: {
    session_id: string;
    host_join_url: string;
    patient_join_url: string;
    status: string;
    participants?: {
      role: string;
      name: string;
      email: string;
      is_host: boolean;
      join_url: string;
    }[];
  } | null;
}

export interface ReferralsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: ReferralResult[];
}

export interface ReferralFilters {
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
  status?: string;
  direction?: string;
  appointment_id?: string;
}

export interface CreateReferralPayload {
  appointment: string;
  destination_level: string;
  referral_type: string;
  mode_of_transportation: string | null;
  reason_for_referral: string;
  clinical_summary: string;
  receiving_facility: string | null;
  receiving_department: string | null;
  mode_of_referral: string | null;
  target_doctor_email: string | null;
  target_department_email: string | null;
  email_subject: string;
  email_body: string;
}
