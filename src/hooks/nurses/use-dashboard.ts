import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";

export function useNurseStats(filters: {
  start_date?: string;
  end_date?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["nurseStats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const res = await api.get<any>(`/nurse/stats/?${params.toString()}`);
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useDashboardVitalsQueue(filters: {
  page?: number;
  page_size?: number;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["dashboardVitals", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));

      const res = await api.get<any>(
        `/appointments/vitals/?${params.toString()}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}
