export type AdverseEventSeverity =
  | "MILD"
  | "MODERATE"
  | "SEVERE"
  | "LIFE_THREATENING"
  | "FATAL";

export type AdverseEventStatus =
  | "REPORTED"
  | "UNDER_REVIEW"
  | "RESOLVED"
  | "CLOSED";

export interface AdverseEventReport {
  id: string;
  event_id: string;
  patient: string;
  patient_name: string;
  patient_display_id: string;
  reported_by: string | null;
  reported_by_name: string | null;
  suspected_drug: string;
  suspected_drug_name: string;
  dosage: string;
  date_of_reaction: string;
  stop_date: string | null;
  reaction_type: string;
  severity: AdverseEventSeverity;
  detailed_symptoms: string;
  status: AdverseEventStatus;
  created_at: string;
  // Detail-endpoint-only fields
  patient_age?: number;
  patient_sex?: string;
}

export interface AdverseEventsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: AdverseEventReport[];
}

export interface AdverseEventFilters {
  page?: number;
  page_size?: number;
  patient_id?: string;
  status?: string;
  severity?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export interface CreateAdverseEventPayload {
  patient: string;
  suspected_drug: string;
  dosage: string;
  date_of_reaction: string;
  stop_date?: string;
  reaction_type: string;
  severity: AdverseEventSeverity;
  detailed_symptoms: string;
  // Only send when filing on behalf of someone else — otherwise the backend
  // auto-fills it from the logged-in user's token.
  reported_by?: string;
}

export type UpdateAdverseEventPayload = Partial<CreateAdverseEventPayload> & {
  status?: AdverseEventStatus;
};
