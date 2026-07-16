import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";
import { AncVisitsResponse } from "@/src/components/nurse-dashboard/maternal-care/type";

export interface AncVisitsListFilters {
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  attendance_type?: string;
  search?: string;
}

export function useAllAncVisits(filters: AncVisitsListFilters) {
  const api = useApi();

  return useQuery<AncVisitsResponse>({
    queryKey: ["all-anc-visits", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.search) params.append("search", filters.search);

      if (filters.attendance_type && filters.attendance_type !== "All Types") {
        params.append("attendance_type", filters.attendance_type.toUpperCase());
      }

      const res = await api.get<any>(
        `/maternal-care/anc-visits/?${params.toString()}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}
