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

export interface UseAuditLogsParams {
  page?: number;
  pageSize?: number;
  module?: string;
  action?: string;
  search?: string;
}

export function useAuditLogs({
  page = 1,
  pageSize = 10,
  module,
  action,
  search,
}: UseAuditLogsParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: ["auditLogs", page, pageSize, module, action, search],

    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      if (module && module !== "All") params.append("module", module);
      if (action && action !== "All") params.append("action", action);
      if (search) params.append("search", search);

      return await api.get<AuditLogsResponse>(
        `/api/v1/auth/audit-logs/?${params.toString()}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
