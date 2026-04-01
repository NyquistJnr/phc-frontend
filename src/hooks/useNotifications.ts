import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./use-api";

export interface NotificationChange {
  new: string | null;
  old: string | null;
}

export interface Notification {
  id: string;
  actor_name: string;
  facility: string;
  facility_name: string;
  action: string;
  module: string;
  ip_address: string;
  endpoint: string;
  target_object_id: string;
  changes: Record<string, NotificationChange>;
  timestamp: string;
  is_read: boolean;
}

export interface NotificationResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
  stats: {
    read: number;
    unread: number;
  };
}

export function useNotifications(page = 1, pageSize = 10) {
  const api = useApi();

  return useQuery({
    queryKey: ["notifications", page, pageSize],
    queryFn: async () => {
      return await api.get<NotificationResponse>(
        `/api/v1/auth/notifications/?page=${page}&page_size=${pageSize}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    refetchInterval: 60 * 1000,
  });
}

export function useMarkNotificationRead() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.patch(`/api/v1/auth/notifications/${id}/mark-read/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
