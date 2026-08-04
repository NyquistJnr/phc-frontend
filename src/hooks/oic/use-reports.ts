import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";

export interface OicReportDateParams {
  startDate?: string;
  endDate?: string;
}

function buildParams({ startDate, endDate }: OicReportDateParams) {
  const params = new URLSearchParams();
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);
  return params;
}

const QUERY_OPTS = {
  staleTime: 60 * 1000,
  gcTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
} as const;

// ── 1. OIC Dashboard Cards ───────────────────────────────────────────────────

export interface MonthlyReportingStatus {
  month: string;
  status: string;
}

export interface OicDashboardResponse {
  start_date: string;
  end_date: string;
  total_patients: number;
  anc_attendance: number;
  deliveries: number;
  immunizations: number;
  referrals: number;
  drug_stock_alerts: number;
  maternal_deaths: number;
  neonatal_deaths: number;
  monthly_reporting_status: MonthlyReportingStatus;
}

export function useOicDashboardReport(params: OicReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["oicReports", "dashboard", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<OicDashboardResponse>(`/reports/oic/dashboard/${qs ? `?${qs}` : ""}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 2. Facility Summary ──────────────────────────────────────────────────────

export interface AttendanceTrendPoint {
  date: string;
  count: number;
}

export interface PatientAttendance {
  total_appointments: number;
  trend: AttendanceTrendPoint[];
}

export interface GenderDistributionItem {
  sex: string;
  label: string;
  count: number;
}

export interface AgeDistributionItem {
  age_group: string;
  count: number;
}

export interface TopDiseaseItem {
  disease: string;
  count: number;
  percentage: number;
}

export interface ReferralStatistics {
  sent: number;
  received: number;
  completed: number;
  completion_rate: number;
}

export interface ServiceUtilizationItem {
  visit_type: string;
  label: string;
  count: number;
}

export interface FacilitySummaryResponse {
  start_date: string;
  end_date: string;
  patient_attendance: PatientAttendance;
  gender_distribution: GenderDistributionItem[];
  age_distribution: AgeDistributionItem[];
  top_diseases: TopDiseaseItem[];
  referral_statistics: ReferralStatistics;
  service_utilization: ServiceUtilizationItem[];
}

export function useFacilitySummaryReport(params: OicReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["oicReports", "facility-summary", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<FacilitySummaryResponse>(`/reports/oic/facility-summary/${qs ? `?${qs}` : ""}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 3. Maternal Health ───────────────────────────────────────────────────────

export interface MaternalHealthResponse {
  start_date: string;
  end_date: string;
  anc_1: number;
  anc_repeat: number;
  anc_4: number;
  deliveries: number;
  stillbirths: number;
  low_birth_weight: number;
  maternal_deaths: number;
  neonatal_deaths: number;
  iptp_coverage: number;
}

export function useMaternalHealthReport(params: OicReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["oicReports", "maternal-health", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<MaternalHealthResponse>(`/reports/oic/maternal-health/${qs ? `?${qs}` : ""}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 4. Child Health ──────────────────────────────────────────────────────────

export interface ImmunizationCoverageItem {
  vaccine: string;
  count: number;
}

export interface ChildHealthResponse {
  start_date: string;
  end_date: string;
  immunization_coverage: ImmunizationCoverageItem[];
  growth_monitoring: number;
  sam: number;
  vitamin_a: number;
  deworming: number;
}

export function useChildHealthReport(params: OicReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["oicReports", "child-health", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<ChildHealthResponse>(`/reports/oic/child-health/${qs ? `?${qs}` : ""}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 5. Family Planning (placeholder module) ─────────────────────────────────

export interface FamilyPlanningResponse {
  start_date: string;
  end_date: string;
  new_clients: number;
  repeat_clients: number;
  methods_used: unknown[];
  commodity_distribution: unknown[];
  counselling_sessions: number;
}

export function useFamilyPlanningReport(params: OicReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["oicReports", "family-planning", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<FamilyPlanningResponse>(`/reports/oic/family-planning/${qs ? `?${qs}` : ""}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 6. Disease Surveillance ──────────────────────────────────────────────────

export type OicDiseaseSeverity = "CRITICAL" | "MODERATE" | "LOW" | null;

export interface DiseaseSurveillanceItem {
  disease: string;
  cases: number;
  severity: OicDiseaseSeverity;
  is_epidemic_prone: boolean;
  in_registry: boolean;
}

export interface DiseaseSurveillanceResponse {
  start_date: string;
  end_date: string;
  results: DiseaseSurveillanceItem[];
}

export function useDiseaseSurveillanceReport(params: OicReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["oicReports", "disease-surveillance", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<DiseaseSurveillanceResponse>(`/reports/oic/disease-surveillance/${qs ? `?${qs}` : ""}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 7. Referrals ──────────────────────────────────────────────────────────────

export interface ReferralDestinationItem {
  destination: string;
  count: number;
}

export interface ReferralsResponse {
  start_date: string;
  end_date: string;
  total_referrals: number;
  completed_referrals: number;
  emergency_referrals: number;
  ambulance_referrals: number;
  average_referral_time_hours: number;
  referral_destinations: ReferralDestinationItem[];
}

export function useReferralsReport(params: OicReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["oicReports", "referrals", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<ReferralsResponse>(`/reports/oic/referrals/${qs ? `?${qs}` : ""}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 8. Adverse Events ─────────────────────────────────────────────────────────

export type OicAdverseSeverity = "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING" | "FATAL";

export interface AdverseFacilitySummary {
  total_adverse_events: number;
  severe_events: number;
  resolved: number;
  pending: number;
}

export interface AdverseByDrugItem {
  drug: string;
  count: number;
}

export interface AdverseBySeverityItem {
  severity: OicAdverseSeverity;
  count: number;
}

export interface AdverseTrendPoint {
  date: string;
  count: number;
}

export interface AdverseEventsResponse {
  start_date: string;
  end_date: string;
  facility_summary: AdverseFacilitySummary;
  by_department: unknown[];
  by_drug: AdverseByDrugItem[];
  by_severity: AdverseBySeverityItem[];
  trend_chart: AdverseTrendPoint[];
}

export function useAdverseEventsReport(params: OicReportDateParams = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ["oicReports", "adverse-events", params],
    queryFn: async () => {
      const qs = buildParams(params).toString();
      return await api.get<AdverseEventsResponse>(`/reports/oic/adverse-events/${qs ? `?${qs}` : ""}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}

// ── 9. Monthly NHMIS Summary ─────────────────────────────────────────────────

export interface NhmisFacility {
  id: string;
  name: string;
  code: string;
  lga: string;
}

export interface NhmisMaternalHealth {
  anc_1: number;
  anc_repeat: number;
  anc_4: number;
  deliveries: number;
  stillbirths: number;
  low_birth_weight: number;
  maternal_deaths: number;
  neonatal_deaths: number;
  iptp_coverage: number;
}

export interface NhmisChildHealth {
  immunization_coverage: ImmunizationCoverageItem[];
  growth_monitoring: number;
  sam: number;
  vitamin_a: number;
  deworming: number;
}

export interface NhmisFamilyPlanning {
  new_clients: number;
  repeat_clients: number;
  methods_used: unknown[];
  commodity_distribution: unknown[];
  counselling_sessions: number;
}

export interface NhmisDiseaseSurveillance {
  results: DiseaseSurveillanceItem[];
}

export interface NhmisReferrals {
  total_referrals: number;
  completed_referrals: number;
  emergency_referrals: number;
  ambulance_referrals: number;
  average_referral_time_hours: number;
  referral_destinations: ReferralDestinationItem[];
}

export interface NhmisAdverseEvents {
  facility_summary: AdverseFacilitySummary;
  by_department: unknown[];
  by_drug: AdverseByDrugItem[];
  by_severity: AdverseBySeverityItem[];
  trend_chart: AdverseTrendPoint[];
}

export interface NhmisDrugLogistics {
  drug_stock_alerts: number;
}

export interface MonthlyNhmisSummaryResponse {
  month: string;
  start_date: string;
  end_date: string;
  facility: NhmisFacility;
  maternal_health: NhmisMaternalHealth;
  child_health: NhmisChildHealth;
  family_planning: NhmisFamilyPlanning;
  disease_surveillance: NhmisDiseaseSurveillance;
  referrals: NhmisReferrals;
  adverse_events: NhmisAdverseEvents;
  drug_logistics: NhmisDrugLogistics;
}

export function useMonthlyNhmisSummaryReport(month?: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["oicReports", "monthly-nhmis-summary", month],
    queryFn: async () => {
      const qs = month ? `?month=${month}` : "";
      return await api.get<MonthlyNhmisSummaryResponse>(`/reports/oic/monthly-nhmis-summary/${qs}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    ...QUERY_OPTS,
  });
}
