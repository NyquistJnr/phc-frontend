import { useQuery } from "@tanstack/react-query";
import { useApi } from "./use-api";

// 1. Dashboard Stats
export interface ITAdminDashboardStats {
  total_users: number;
  system_alert_count: number;
  system_uptime: string;
}

export function useItAdminDashboardStats(startDate?: string, endDate?: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["itAdminDashboardStats", startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      
      const queryString = params.toString() ? `?${params.toString()}` : "";
      return await api.get<ITAdminDashboardStats>(`/facilities/it-admin/stats/${queryString}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

// 2. System Status
export interface ITAdminSystemStatus {
  server_health: {
    status: string;
    percentage: string;
  };
  database_status: {
    status: string;
    percentage: string;
  };
  error_alerts: {
    count: string;
    percentage: string;
  };
  system_uptime: {
    uptime: string;
    percentage: string;
  };
}

export function useItAdminSystemStatus() {
  const api = useApi();

  return useQuery({
    queryKey: ["itAdminSystemStatus"],
    queryFn: async () => {
      return await api.get<ITAdminSystemStatus>("/facilities/it-admin/system-status/");
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

// 3. Real-Time User Activity
export interface ITAdminUserActivity {
  active_users: number;
  login_attempts: number;
  failed_logins: number;
}

export function useItAdminUserActivity(startDate?: string, endDate?: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["itAdminUserActivity", startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      return await api.get<ITAdminUserActivity>(`/facilities/it-admin/user-activity/${queryString}`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

// 4. System Alerts
export interface SystemAlert {
  title: string;
  description: string;
}

export interface ITAdminSystemAlerts {
  alerts: SystemAlert[];
}

export function useItAdminSystemAlerts() {
  const api = useApi();

  return useQuery({
    queryKey: ["itAdminSystemAlerts"],
    queryFn: async () => {
      return await api.get<ITAdminSystemAlerts>("/facilities/it-admin/system-alerts/");
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}
