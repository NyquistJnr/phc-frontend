import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";

export type AlertType =
  | "DISEASE_CRITICAL_DIAGNOSIS"
  | "DISEASE_THRESHOLD_BREACH"
  | "FAILED_LOGIN_SPIKE"
  | "SYSTEM_ERROR_SPIKE"
  | "FACILITY_INACTIVE"
  | "HIGH_SYSTEM_USAGE";

export type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM";

export interface ActiveAlert {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  facility_id: string | null;
  facility_name: string | null;
  disease: string | null;
  detected_at: string;
  metric_value: number;
  threshold_value: number | null;
}

export interface ActiveAlertsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: ActiveAlert[];
}

export interface UseActiveAlertsParams {
  page?: number;
  pageSize?: number;
}

export function useActiveAlerts({ page = 1, pageSize = 10 }: UseActiveAlertsParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: ["activeAlerts", page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      return await api.get<ActiveAlertsResponse>(`/alerts/active/?${params.toString()}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
