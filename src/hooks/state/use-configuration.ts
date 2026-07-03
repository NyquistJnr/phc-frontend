import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";

export interface SystemThresholds {
  disease_compliance_threshold_percent: number;
  failed_login_attempts_threshold: number;
  system_error_threshold: number;
  inactive_facility_threshold_days: number;
  high_usage_threshold_users: number;
  updated_at: string;
}

export function useSystemThresholds() {
  const api = useApi();

  return useQuery({
    queryKey: ["systemThresholds"],
    queryFn: async () => await api.get<SystemThresholds>("/registry/thresholds/"),
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
