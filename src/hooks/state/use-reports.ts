import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";

export interface StateReportDateParams {
  startDate?: string;
  endDate?: string;
}

export interface StatePaginatedReportParams extends StateReportDateParams {
  page?: number;
  pageSize?: number;
}

function buildParams({ startDate, endDate }: StateReportDateParams) {
  const params = new URLSearchParams();
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);
  return params;
}

function buildPaginatedParams({ startDate, endDate, page = 1, pageSize = 10 }: StatePaginatedReportParams) {
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

// ── 1. Facility Performance ─────────────────────────────────────────────────

export interface FacilityPerformanceRow {
  facility_id: string;
  facility: string;
  facility_code: string;
  lga: string;
  patients_seen: number;
  reports_submitted: number;
  reporting_timeliness: number;
  referral_rate: number;
  performance_score: number;
}

export interface FacilityPerformanceResponse {
  start_date: string;
  end_date: string;
  results: FacilityPerformanceRow[];
}

export function useFacilityPerformanceReport(params: StateReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["stateReports", "facility-performance", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<FacilityPerformanceResponse>(
        `/reports/state-admin/facility-performance/${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 2. Maternal Health ──────────────────────────────────────────────────────

export interface MaternalHealthRow {
  facility_id: string;
  facility: string;
  lga: string;
  anc_1: number;
  anc_4: number;
  deliveries: number;
  maternal_deaths: number;
  neonatal_deaths: number;
  iptp_coverage: number;
}

export interface MaternalHealthChartPoint {
  facility: string;
  anc_1: number;
  anc_4: number;
  iptp_coverage: number;
}

export interface MaternalHealthResponse {
  start_date: string;
  end_date: string;
  results: MaternalHealthRow[];
  state_comparison_chart: MaternalHealthChartPoint[];
}

export function useMaternalHealthReport(params: StateReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["stateReports", "maternal-health", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<MaternalHealthResponse>(
        `/reports/state-admin/maternal-health/${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 3. Child Health ──────────────────────────────────────────────────────────

export interface ChildHealthRow {
  facility_id: string;
  facility: string;
  lga: string;
  bcg: number;
  penta_1: number;
  penta_3: number;
  measles: number;
  sam_cases: number;
  growth_monitoring: number;
}

export interface ChildHealthResponse {
  start_date: string;
  end_date: string;
  results: ChildHealthRow[];
}

export function useChildHealthReport(params: StateReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["stateReports", "child-health", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<ChildHealthResponse>(
        `/reports/state-admin/child-health/${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 4. Disease Surveillance (paginated) ─────────────────────────────────────

export type DiseaseTrend = "INCREASING" | "DECREASING" | "STABLE";
export type AlertLevel = "CRITICAL" | "MODERATE" | "LOW";

export interface DiseaseSurveillanceRow {
  disease: string;
  cases: number;
  lga: string;
  facility: string;
  trend: DiseaseTrend;
  alert_level: AlertLevel;
}

export interface StateTrendPoint {
  date: string;
  cases: number;
}

export interface LgaHeatmapPoint {
  lga: string;
  cases: number;
}

export interface OutbreakIndicator {
  disease: string;
  cases: number;
  alert_level: AlertLevel;
  facilities_affected: number;
}

export interface DiseaseSurveillanceResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  start_date: string;
  end_date: string;
  results: DiseaseSurveillanceRow[];
  state_trend_chart: StateTrendPoint[];
  lga_heatmap: LgaHeatmapPoint[];
  outbreak_indicators: OutbreakIndicator[];
}

export function useDiseaseSurveillanceReport(params: StatePaginatedReportParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["stateReports", "disease-surveillance", params],
    queryFn: async () => {
      const qs = buildPaginatedParams(params).toString();
      return await api.get<DiseaseSurveillanceResponse>(
        `/reports/state-admin/disease-surveillance/?${qs}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 5. Drug Logistics ────────────────────────────────────────────────────────

export interface DrugLogisticsRow {
  facility_id: string;
  facility: string;
  lga: string;
  stock_outs: number;
  vaccine_wastage: number;
  cold_chain_status: string;
  tracer_drug_availability: number;
}

export interface DrugLogisticsResponse {
  start_date: string;
  end_date: string;
  results: DrugLogisticsRow[];
}

export function useDrugLogisticsReport(params: StateReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["stateReports", "drug-logistics", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<DrugLogisticsResponse>(
        `/reports/state-admin/drug-logistics/${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 6. Human Resources ───────────────────────────────────────────────────────

export interface HumanResourcesRow {
  facility_id: string;
  facility: string;
  lga: string;
  nurses: number;
  chos: number;
  chews: number;
  doctors: number;
  attendance_percent: number;
}

export interface HumanResourcesResponse {
  start_date: string;
  end_date: string;
  results: HumanResourcesRow[];
}

export function useHumanResourcesReport(params: StateReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["stateReports", "human-resources", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<HumanResourcesResponse>(
        `/reports/state-admin/human-resources/${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 7. Financial Summary (placeholder module) ───────────────────────────────

export interface FinancialSummaryRow {
  facility_id: string;
  facility: string;
  lga: string;
  revenue: number;
  expenditure: number;
  bhcpf_funds: number;
  balance: number;
}

export interface FinancialSummaryResponse {
  start_date: string;
  end_date: string;
  results: FinancialSummaryRow[];
}

export function useFinancialSummaryReport(params: StateReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["stateReports", "financial-summary", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<FinancialSummaryResponse>(
        `/reports/state-admin/financial-summary/${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 8. Referral Analytics ────────────────────────────────────────────────────

export interface ReferralAnalyticsRow {
  facility_id: string;
  facility: string;
  lga: string;
  referrals_sent: number;
  referrals_received: number;
  ambulance_referrals: number;
  completion_rate: number;
  average_referral_time_hours: number;
}

export interface ReferralAnalyticsResponse {
  start_date: string;
  end_date: string;
  results: ReferralAnalyticsRow[];
}

export function useReferralAnalyticsReport(params: StateReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["stateReports", "referral-analytics", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<ReferralAnalyticsResponse>(
        `/reports/state-admin/referral-analytics/${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 9. Adverse Events (paginated) ────────────────────────────────────────────

export type AdverseSeverity = "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING" | "FATAL";
export type AdverseStatus = "REPORTED" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";

export interface AdverseEventRow {
  event_id: string;
  facility: string | null;
  patient: string;
  drug_treatment: string;
  adverse_event: string;
  severity: AdverseSeverity;
  status: AdverseStatus;
  date_reported: string;
}

export interface AdverseEventsSummaryCards {
  total_adverse_events: number;
  severe_events: number;
  resolved: number;
  pending: number;
  most_common_drug: string | null;
  most_common_reaction: string | null;
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
  summary_cards: AdverseEventsSummaryCards;
}

export function useAdverseEventsReport(params: StatePaginatedReportParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["stateReports", "adverse-events", params],
    queryFn: async () => {
      const qs = buildPaginatedParams(params).toString();
      return await api.get<AdverseEventsResponse>(
        `/reports/state-admin/adverse-events/?${qs}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}
