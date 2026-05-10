import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  LabStats,
  PaginatedLabRequests,
  LabFilters,
} from "@/src/components/lab-dashboard/home/types";

export function useLabStats(filters: {
  start_date?: string;
  end_date?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["laboratory-stats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<any>(
        `/laboratory/stats/overall/${queryString}`,
      );
      let payload = res;
      if (payload?.data?.data?.pending_lab_requests !== undefined) {
        payload = payload.data.data;
      } else if (payload?.data?.pending_lab_requests !== undefined) {
        payload = payload.data;
      }
      return payload as LabStats;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useLabRequests(filters: LabFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["laboratory-requests", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));

      const res = await api.get<any>(
        `/laboratory/requests/?${params.toString()}`,
      );
      let payload = res;
      if (payload?.data?.data?.results !== undefined) {
        payload = payload.data.data;
      } else if (payload?.data?.results !== undefined) {
        payload = payload.data;
      }
      return payload as PaginatedLabRequests;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}
