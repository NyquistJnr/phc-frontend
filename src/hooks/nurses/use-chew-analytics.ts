import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/src/hooks/use-api";
import { PaginatedResponse } from "@/src/types/custom-pagination";

// 1. CHEW Stats
export function useChewStats(startDate?: string, endDate?: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["chew-stats", { startDate, endDate }],
    queryFn: async () => {
      let params = "";
      if (startDate) params += `?start_date=${startDate}`;
      if (endDate) params += `${params ? "&" : "?"}end_date=${endDate}`;
      
      const res = await api.get<any>(`/nurse/chew-stats/${params}`);
      return res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

// 2. Health Promotions Today
export function useHealthPromotionsToday() {
  const api = useApi();

  return useQuery({
    queryKey: ["health-promotions-today"],
    queryFn: async () => {
      const res = await api.get<any>(`/nurse/health-promotions/today/`);
      return res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

// 3. CHEW Activity Report Stats
export function useChewActivityReportsStats(startDate?: string, endDate?: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["chew-activity-reports-stats", { startDate, endDate }],
    queryFn: async () => {
      let params = "";
      if (startDate) params += `?start_date=${startDate}`;
      if (endDate) params += `${params ? "&" : "?"}end_date=${endDate}`;
      
      const res = await api.get<any>(`/nurse/chew-activity-reports/stats/${params}`);
      return res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

// 4. Entire Activity Report List
interface ChewActivityReportsFilters {
  start_date?: string;
  end_date?: string;
  search?: string;
  activity_type?: string;
  page?: number;
  page_size?: number;
}

export function useChewActivityReports(filters: ChewActivityReportsFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["chew-activity-reports", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (filters.start_date) queryParams.append("start_date", filters.start_date);
      if (filters.end_date) queryParams.append("end_date", filters.end_date);
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.activity_type) queryParams.append("activity_type", filters.activity_type);
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.page_size) queryParams.append("page_size", filters.page_size.toString());

      const qs = queryParams.toString();
      const res = await api.get<PaginatedResponse<any>>(`/nurse/chew-activity-reports/${qs ? "?" + qs : ""}`);
      return res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}
