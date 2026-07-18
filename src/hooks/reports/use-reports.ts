import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/src/hooks/use-api";

export function useDailyActivity(params?: {
  start_date?: string;
  end_date?: string;
  page?: number;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["reports", "daily-activity", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.start_date) searchParams.append("start_date", params.start_date);
      if (params?.end_date) searchParams.append("end_date", params.end_date);
      if (params?.page) searchParams.append("page", params.page.toString());

      const qs = searchParams.toString();
      const res = await api.get<any>(`/reports/daily-activity/${qs ? `?${qs}` : ""}`);
      return res?.data?.data || res?.data || res;
    },
    enabled: !!params?.start_date && !!params?.end_date && api.isAuthenticated && !api.isLoading, // Enforce required start/end date
  });
}

export function useComprehensiveModules(params?: {
  start_date?: string;
  end_date?: string;
  modules?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["reports", "comprehensive-modules", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.start_date) searchParams.append("start_date", params.start_date);
      if (params?.end_date) searchParams.append("end_date", params.end_date);
      if (params?.modules) searchParams.append("modules", params.modules);

      const qs = searchParams.toString();
      const res = await api.get<any>(`/reports/comprehensive-modules/${qs ? `?${qs}` : ""}`);
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useModuleCompletionPercentages(params?: {
  start_date?: string;
  end_date?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["reports", "module-completion-percentages", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.start_date) searchParams.append("start_date", params.start_date);
      if (params?.end_date) searchParams.append("end_date", params.end_date);

      const qs = searchParams.toString();
      const res = await api.get<any>(`/reports/module-completion-percentages/${qs ? `?${qs}` : ""}`);
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}
