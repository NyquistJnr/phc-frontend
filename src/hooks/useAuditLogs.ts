import { useQuery } from "@tanstack/react-query";
import { useApi } from "./use-api";

export interface AuditLog {
  id: string;
  actor_name: string;
  facility: string;
  facility_name: string;
  action: string;
  module: string;
  ip_address: string;
  endpoint: string;
  target_object_id: string;
  changes: any;
  timestamp: string;
  is_read: boolean;
}

export interface AuditLogsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: AuditLog[];
}

export function useAuditLogs(page = 1, pageSize = 10) {
  const api = useApi();

  return useQuery({
    queryKey: ["auditLogs", page, pageSize],

    queryFn: async () => {
      return await api.get<AuditLogsResponse>(
        `/api/v1/auth/audit-logs/?page=${page}&page_size=${pageSize}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
