import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";

export interface UsePaginatedDateParams {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

function buildParams({ page = 1, pageSize = 10, startDate, endDate }: UsePaginatedDateParams) {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);
  return params;
}

export interface PaginatedResult<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface FailedLoginsByUserRow {
  user_id: string;
  email: string;
  name: string;
  staff_id: string;
  failed_attempts: number;
}

export interface FailedLoginsByFacilityRow {
  facility_id: string;
  facility_name: string;
  failed_attempts: number;
}

export interface FailedLoginsUnknownEmailRow {
  attempted_email: string;
  failed_attempts: number;
}

export function useFailedLoginsByUser(params: UsePaginatedDateParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: [
      "failedLoginsByUser",
      params.page,
      params.pageSize,
      params.startDate,
      params.endDate,
    ],
    queryFn: async () =>
      await api.get<PaginatedResult<FailedLoginsByUserRow>>(
        `/stats/failed-logins-by-user/?${buildParams(params).toString()}`,
      ),
    enabled: (params.enabled ?? true) && api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useFailedLoginsByFacility(params: UsePaginatedDateParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: [
      "failedLoginsByFacility",
      params.page,
      params.pageSize,
      params.startDate,
      params.endDate,
    ],
    queryFn: async () =>
      await api.get<PaginatedResult<FailedLoginsByFacilityRow>>(
        `/stats/failed-logins-by-facility/?${buildParams(params).toString()}`,
      ),
    enabled: (params.enabled ?? true) && api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useFailedLoginsUnknownEmails(params: UsePaginatedDateParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: [
      "failedLoginsUnknownEmails",
      params.page,
      params.pageSize,
      params.startDate,
      params.endDate,
    ],
    queryFn: async () =>
      await api.get<PaginatedResult<FailedLoginsUnknownEmailRow>>(
        `/stats/failed-logins-unknown-emails/?${buildParams(params).toString()}`,
      ),
    enabled: (params.enabled ?? true) && api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
