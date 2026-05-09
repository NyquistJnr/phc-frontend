import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";

export interface VitalsListFilters {
  page?: number;
  page_size?: number;
  search?: string;
  visit_type?: string;
  priority?: string;
  status?: string;
}

export function useVitalsList(filters: VitalsListFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["vitalsList", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.search) params.append("search", filters.search);
      if (filters.visit_type && filters.visit_type !== "All Visit Types") {
        params.append("visit_type", filters.visit_type);
      }
      if (filters.priority && filters.priority !== "All Priority") {
        params.append("priority", filters.priority);
      }
      if (filters.status && filters.status !== "All Status") {
        params.append("status", filters.status);
      }

      const res = await api.get<any>(
        `/appointments/vitals/?${params.toString()}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}
