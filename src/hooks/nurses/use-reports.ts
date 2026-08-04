import { useQuery } from "@tanstack/react-query";
import useApi from "@/src/hooks/useApi";

export interface NurseReportDateParams {
  startDate?: string;
  endDate?: string;
}

export interface NursePaginatedReportParams extends NurseReportDateParams {
  page?: number;
  pageSize?: number;
}

interface BasePaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
  start_date: string;
  end_date: string;
}

// 1. Vital Signs Report
export interface VitalSignsRow {
  patient: string;
  date: string;
  temperature: number | null;
  blood_pressure: string | null;
  pulse: number | null;
  respiratory_rate: number | null;
  weight: number | null;
  height: number | null;
  bmi: number | null;
  recorded_by: string;
}

export interface VitalSignsResponse extends BasePaginatedResponse<VitalSignsRow> {
  summary_cards: {
    total_vital_assessments: number;
    high_blood_pressure_cases: number;
    fever_cases: number;
    abnormal_pulse_cases: number;
    abnormal_respiratory_rate_cases: number;
  };
}

export const useVitalSignsReport = (params: NursePaginatedReportParams) => {
  const api = useApi();
  return useQuery({
    queryKey: ["nurse-reports-vital-signs", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.startDate) searchParams.append("start_date", params.startDate);
      if (params.endDate) searchParams.append("end_date", params.endDate);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.pageSize) searchParams.append("page_size", params.pageSize.toString());

      const { data } = await api.get(`/api/v1/reports/nurse/vital-signs/?${searchParams.toString()}`);
      return data.data as VitalSignsResponse;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 2. Immunization Report
export interface ImmunizationRow {
  patient: string;
  vaccine: string;
  dose: number;
  date_administered: string;
  batch_number: string | null;
  next_due_date: string | null;
  status: string; // COMPLETED, PENDING, MISSED
}

export interface ImmunizationResponse extends BasePaginatedResponse<ImmunizationRow> {
  summary_cards: {
    total_vaccinations: number;
    fully_immunized_children: number;
    missed_appointments: number;
    vaccines_administered_by_type: { vaccine: string; count: number }[];
  };
}

export const useImmunizationReport = (params: NursePaginatedReportParams) => {
  const api = useApi();
  return useQuery({
    queryKey: ["nurse-reports-immunization", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.startDate) searchParams.append("start_date", params.startDate);
      if (params.endDate) searchParams.append("end_date", params.endDate);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.pageSize) searchParams.append("page_size", params.pageSize.toString());

      const { data } = await api.get(`/api/v1/reports/nurse/immunization/?${searchParams.toString()}`);
      return data.data as ImmunizationResponse;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 3. Postnatal Care Report
export interface PNCReportRow {
  mother: string;
  baby: string | null;
  delivery_date: string | null;
  visit_type: string;
  findings: string | null;
  complications: string | null;
  follow_up_status: string; // OVERDUE, DUE_TODAY, PENDING, COMPLETE
}

export interface PNCReportResponse extends BasePaginatedResponse<PNCReportRow> {
  summary_cards: {
    total_pnc_visits: number;
    mothers_reviewed: number;
    babies_reviewed: number;
    complications_identified: number;
    follow_ups_due: number;
  };
}

export const usePncReport = (params: NursePaginatedReportParams) => {
  const api = useApi();
  return useQuery({
    queryKey: ["nurse-reports-pnc", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.startDate) searchParams.append("start_date", params.startDate);
      if (params.endDate) searchParams.append("end_date", params.endDate);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.pageSize) searchParams.append("page_size", params.pageSize.toString());

      const { data } = await api.get(`/api/v1/reports/nurse/postnatal-care/?${searchParams.toString()}`);
      return data.data as PNCReportResponse;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 4. Maternal Care Report (ANC)
export interface MaternalCareRow {
  patient: string;
  anc_visit: number;
  gestational_age_weeks: number | null;
  blood_pressure: string | null;
  hb_status: string;
  iptp_dose: string | null;
  hiv_status: string | null;
  risk_level: string; // HIGH, LOW
}

export interface MaternalCareResponse extends BasePaginatedResponse<MaternalCareRow> {
  summary_cards: {
    anc_1_visits: number;
    repeat_anc_visits: number;
    high_risk_pregnancies: number;
    iptp_coverage: number;
    hiv_tests_conducted: number;
  };
}

export const useMaternalCareReport = (params: NursePaginatedReportParams) => {
  const api = useApi();
  return useQuery({
    queryKey: ["nurse-reports-maternal-care", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.startDate) searchParams.append("start_date", params.startDate);
      if (params.endDate) searchParams.append("end_date", params.endDate);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.pageSize) searchParams.append("page_size", params.pageSize.toString());

      const { data } = await api.get(`/api/v1/reports/nurse/maternal-care/?${searchParams.toString()}`);
      return data.data as MaternalCareResponse;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 5. Follow-ups Report
export interface FollowUpRow {
  patient: string;
  reason_for_followup: string;
  due_date: string;
  status: string; // OVERDUE, DUE_TODAY, PENDING, COMPLETED
  assigned_nurse: string | null;
  outcome: string | null;
}

export interface FollowUpsResponse extends BasePaginatedResponse<FollowUpRow> {
  summary_cards: {
    due_today: number;
    overdue: number;
    completed: number;
    pending: number;
  };
}

export const useFollowUpsReport = (params: NursePaginatedReportParams) => {
  const api = useApi();
  return useQuery({
    queryKey: ["nurse-reports-follow-ups", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.startDate) searchParams.append("start_date", params.startDate);
      if (params.endDate) searchParams.append("end_date", params.endDate);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.pageSize) searchParams.append("page_size", params.pageSize.toString());

      const { data } = await api.get(`/api/v1/reports/nurse/follow-ups/?${searchParams.toString()}`);
      return data.data as FollowUpsResponse;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 6. Health Education Report
export interface HealthEducationRow {
  session_date: string;
  topic: string;
  audience: string;
  number_of_participants: number;
  facilitator: string;
  location: string;
}

export interface HealthEducationResponse extends BasePaginatedResponse<HealthEducationRow> {
  summary_cards: {
    sessions_conducted: number;
    total_participants: number;
    most_covered_topics: { title: string; count: number }[]; // Note: the API response structure says top 5 titles, we'll map whatever comes back as `{ title, count }` or `{ topic, count }` depending on real data, but let's assume `{ title, count }` if not explicitly given, or `{ topic, count }` like vaccines. Wait, the doc says "most_covered_topics is the top 5 session titles by count". Let's assume `{ title: string, count: number }`. Wait, Doctor reports had `{ topic: string, count: number }` for vaccines it was `{ vaccine, count }`. I will use `{ title: string, count: number }` and if it fails I'll check it. Let's use `any` for `most_covered_topics` array item if not sure, but let's guess `{ title: string, count: number }` or `{ topic: string, count: number }`. I will use `Record<string, any>` to be safe, or just `any`.
    // Actually, I'll type it loosely as `any[]` and inspect it in the component if needed.
    // The API doc doesn't show the inside shape of most_covered_topics. Let's define it as `{ title: string, count: number }` for now.
  };
}

export const useHealthEducationReport = (params: NursePaginatedReportParams) => {
  const api = useApi();
  return useQuery({
    queryKey: ["nurse-reports-health-education", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.startDate) searchParams.append("start_date", params.startDate);
      if (params.endDate) searchParams.append("end_date", params.endDate);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.pageSize) searchParams.append("page_size", params.pageSize.toString());

      const { data } = await api.get(`/api/v1/reports/nurse/health-education/?${searchParams.toString()}`);
      // Patch the most_covered_topics typing if necessary, but we'll cast.
      return data.data as HealthEducationResponse;
    },
    staleTime: 5 * 60 * 1000,
  });
};
