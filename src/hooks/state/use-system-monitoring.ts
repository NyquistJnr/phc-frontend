import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

function appendDateParams(params: URLSearchParams, { startDate, endDate }: DateRangeParams) {
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);
}

// ── 1. Dashboard Overview Stats ─────────────────────────────────────────────

export interface OverviewStats {
  start_date: string;
  end_date: string;
  total_active_users: number;
  active_facilities: { active: number; total: number };
  total_logins: number;
  active_sessions: string;
  active_sessions_minutes: number;
}

export function useOverviewStats({ startDate, endDate }: DateRangeParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: ["usageAnalyticsOverview", startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      appendDateParams(params, { startDate, endDate });
      const qs = params.toString();
      return await api.get<OverviewStats>(`/stats/overview/${qs ? `?${qs}` : ""}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// ── 2. User Activity Trend ──────────────────────────────────────────────────

export interface UserActivityTrendPoint {
  date: string;
  active_users: number;
  logins: number;
}

export interface UserActivityTrendResponse {
  start_date: string;
  end_date: string;
  results: UserActivityTrendPoint[];
}

export function useUserActivityTrend({ startDate, endDate }: DateRangeParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: ["userActivityTrend", startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      appendDateParams(params, { startDate, endDate });
      const qs = params.toString();
      return await api.get<UserActivityTrendResponse>(
        `/stats/user-activity-trend/${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// ── 3. Module Usage ─────────────────────────────────────────────────────────

export interface ModuleUsageRow {
  module: string;
  label: string;
  count: number;
  percentage: number;
}

export interface ModuleUsageResponse {
  start_date: string;
  end_date: string;
  results: ModuleUsageRow[];
}

export function useModuleUsage({ startDate, endDate }: DateRangeParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: ["moduleUsage", startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      appendDateParams(params, { startDate, endDate });
      const qs = params.toString();
      return await api.get<ModuleUsageResponse>(`/stats/module-usage/${qs ? `?${qs}` : ""}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// ── Shared pagination params ────────────────────────────────────────────────

export interface UsePaginatedStatsParams extends DateRangeParams {
  page?: number;
  pageSize?: number;
}

// ── 4. Top Active Facilities (Paginated) ────────────────────────────────────

export interface TopActiveFacility {
  facility_id: string;
  facility_name: string;
  usage_count: number;
  percentage: number;
}

export interface TopActiveFacilitiesResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: TopActiveFacility[];
}

export function useTopActiveFacilities({
  page = 1,
  pageSize = 10,
  startDate,
  endDate,
}: UsePaginatedStatsParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: ["topActiveFacilities", page, pageSize, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      appendDateParams(params, { startDate, endDate });
      return await api.get<TopActiveFacilitiesResponse>(
        `/stats/top-active-facilities/?${params.toString()}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// ── 5. Facility Usage Table (Paginated) ─────────────────────────────────────

export interface FacilityUsageRow {
  facility_id: string;
  facility_name: string;
  number_of_users: number;
  number_of_logins: number;
  last_active: string;
  status: "Active" | "Low Activity" | "Inactive";
}

export interface FacilityUsageTableResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: FacilityUsageRow[];
}

export function useFacilityUsageTable({
  page = 1,
  pageSize = 10,
  startDate,
  endDate,
}: UsePaginatedStatsParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: ["facilityUsageTable", page, pageSize, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      appendDateParams(params, { startDate, endDate });
      return await api.get<FacilityUsageTableResponse>(
        `/stats/facility-usage-table/?${params.toString()}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
