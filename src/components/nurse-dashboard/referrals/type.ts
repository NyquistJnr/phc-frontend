export type ReferralStatus = "PENDING" | "ACCEPTED" | "REJECTED";
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
  receiving_facility: string;
  receiving_facility_name: string;
  referred_by: string;
  referred_by_name: string;
  referral_type: string;
  reason_for_referral: string;
  clinical_summary: string;
  status: ReferralStatus;
  direction: string;
  created_at: string;
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
}
