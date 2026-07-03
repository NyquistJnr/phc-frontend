import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  PharmacyActivitiesFilters,
  PharmacyActivitiesResponse,
  PharmacyDashboardDateFilters,
  PharmacyDashboardStats,
  PharmacyPieChartStats,
} from "@/src/components/pharmacist-dashboard/home/type";

type ApiEnvelope<T> = {
  data?: T | ApiEnvelope<T>;
};

function unwrapApiData<T>(response: unknown): T {
  const envelope = response as ApiEnvelope<T>;
  const firstData = envelope.data;

  if (firstData && typeof firstData === "object" && "data" in firstData) {
    return (firstData as ApiEnvelope<T>).data as T;
  }

  return (firstData ?? response) as T;
}

function appendDateFilters(
  params: URLSearchParams,
  filters: PharmacyDashboardDateFilters,
) {
  if (filters.start_date) params.append("start_date", filters.start_date);
  if (filters.end_date) params.append("end_date", filters.end_date);
}

export function usePharmacyDashboardStats(
  filters: PharmacyDashboardDateFilters,
) {
  const api = useApi();

  return useQuery({
    queryKey: ["pharmacy-dashboard-stats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      appendDateFilters(params, filters);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<unknown>(`/prescriptions/stats/${queryString}`);
      return unwrapApiData<PharmacyDashboardStats>(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function usePharmacyActivities(filters: PharmacyActivitiesFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["pharmacy-activities", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));

      const res = await api.get<unknown>(
        `/prescriptions/activities/?${params.toString()}`,
      );
      return unwrapApiData<PharmacyActivitiesResponse>(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function usePharmacyPieChartStats(
  filters: PharmacyDashboardDateFilters,
) {
  const api = useApi();

  return useQuery({
    queryKey: ["pharmacy-pie-chart-stats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      appendDateFilters(params, filters);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<unknown>(
        `/prescriptions/stats/pie-chart/${queryString}`,
      );
      return unwrapApiData<PharmacyPieChartStats>(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}
