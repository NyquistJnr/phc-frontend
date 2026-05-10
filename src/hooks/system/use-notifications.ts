import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useApi } from "../use-api";

export interface Notification {
  id: string;
  actor_name: string;
  facility_name: string;
  action: string;
  module: string;
  ip_address: string;
  endpoint: string;
  timestamp: string;
  is_read: boolean;
  changes: Record<string, { old: any; new: any }>;
}

export interface NotificationsResponse {
  results: Notification[];
  count: number;
  total_pages: number;
  current_page: number;
  stats: {
    read: number;
    unread: number;
  };
}

export function useNotifications(filters: any) {
  const api = useApi();
  const { status } = useSession();
  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", filters],
    enabled: api.isAuthenticated && !api.isLoading,
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
      const res = await api.get<any>(
        `/system/notifications/?${params.toString()}`,
      );
      return res.data?.data || res.data || res;
    },
  });
}

export function useMarkNotificationRead() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch<any>(
        `/system/notifications/${id}/mark-read/`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
