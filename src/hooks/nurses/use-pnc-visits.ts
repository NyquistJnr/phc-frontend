import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";
import { PncVisitsResponse } from "@/src/components/nurse-dashboard/maternal-care/type";

export interface PncVisitsListFilters {
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  outcome?: string;
}

export function useAllPncVisits(filters: PncVisitsListFilters) {
  const api = useApi();

  return useQuery<PncVisitsResponse>({
    queryKey: ["all-pnc-visits", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      if (filters.outcome && filters.outcome !== "All Outcomes") {
        params.append("outcome", filters.outcome.toUpperCase());
      }

      const res = await api.get<any>(
        `/maternal-care/pnc-visits/?${params.toString()}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}
