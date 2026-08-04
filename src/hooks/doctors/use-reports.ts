import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";

export interface DoctorReportDateParams {
  startDate?: string;
  endDate?: string;
}

import { AdverseSeverity, AdverseStatus } from "@/src/hooks/state/use-reports";

export interface DoctorPaginatedReportParams extends DoctorReportDateParams {
  page?: number;
  pageSize?: number;
}

function buildParams({ startDate, endDate }: DoctorReportDateParams) {
  const params = new URLSearchParams();
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);
  return params;
}

function buildPaginatedParams({ startDate, endDate, page = 1, pageSize = 10 }: DoctorPaginatedReportParams) {
  const params = buildParams({ startDate, endDate });
  params.append("page", page.toString());
  params.append("page_size", pageSize.toString());
  return params;
}

const QUERY_OPTS = {
  staleTime: 60 * 1000,
  gcTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
} as const;

// ── 1. Consultation Report ──────────────────────────────────────────────────

export interface ConsultationSummaryResponse {
  start_date: string;
  end_date: string;
  total_consultations: number;
  diagnosis_distribution: { diagnosis: string; count: number }[];
  treatment_provided: { treatment: string; count: number }[];
  referral_status: { status: string; label: string; count: number }[];
  consultation_outcome: { outcome: string; count: number }[];
}

export function useConsultationSummaryReport(params: DoctorReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["doctorReports", "consultation-summary", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<ConsultationSummaryResponse>(
        `/reports/doctor/consultation-summary/${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 2. Disease Morbidity Report ──────────────────────────────────────────────

export interface DiseaseMorbidityRow {
  disease: string;
  male: number;
  female: number;
  under_5: number;
  above_5: number;
  total: number;
}

export interface DiseaseMorbidityResponse {
  start_date: string;
  end_date: string;
  results: DiseaseMorbidityRow[];
}

export function useDiseaseMorbidityReport(params: DoctorReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["doctorReports", "disease-morbidity", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<DiseaseMorbidityResponse>(
        `/reports/doctor/disease-morbidity/${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 3. Referral Report ───────────────────────────────────────────────────────

export interface ReferralReportRow {
  referral_id: string;
  patient: string;
  referral_date: string;
  reason: string;
  receiving_facility: string;
  status: string;
  status_label: string;
  urgency: string;
}

export interface ReferralReportResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  start_date: string;
  end_date: string;
  results: ReferralReportRow[];
}

export function useReferralReport(params: DoctorPaginatedReportParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["doctorReports", "referrals", params],
    queryFn: async () => {
      const qs = buildPaginatedParams(params).toString();
      return await api.get<ReferralReportResponse>(
        `/reports/doctor/referrals/?${qs}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 4. Adverse Events Report ─────────────────────────────────────────────────

export interface AdverseEventRow {
  event_id: string;
  patient: string;
  encounter_date: string;
  medicine_treatment: string;
  adverse_event: string;
  severity: AdverseSeverity;
  action_taken: string | null;
  reported_by: string;
  status: AdverseStatus;
}

export interface AdverseEventsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  start_date: string;
  end_date: string;
  results: AdverseEventRow[];
}

export function useAdverseEventsReport(params: DoctorPaginatedReportParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["doctorReports", "adverse-events", params],
    queryFn: async () => {
      const qs = buildPaginatedParams(params).toString();
      return await api.get<AdverseEventsResponse>(
        `/reports/doctor/adverse-events/?${qs}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 5. Clinical Outcome Report ───────────────────────────────────────────────

export interface ClinicalOutcomeResponse {
  start_date: string;
  end_date: string;
  recovered: number;
  admitted: number;
  transferred: number;
  referred: number;
  deaths: number;
}

export function useClinicalOutcomesReport(params: DoctorReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["doctorReports", "clinical-outcomes", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<ClinicalOutcomeResponse>(
        `/reports/doctor/clinical-outcomes/${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}
