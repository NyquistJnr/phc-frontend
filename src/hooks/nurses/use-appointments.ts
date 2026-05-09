import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";

export interface AppointmentResult {
  id: string;
  appointment_id: string;
  patient: string;
  patient_name: string;
  patient_display_id: string;
  assigned_to: string;
  assigned_staff_name: string;
  appointment_date: string;
  appointment_time: string;
  visit_type: string;
  status: string;
  priority: string;
  reason_for_visit: string;
  notes: string | null;
  created_by: string;
  created_by_name: string;
  created_at: string;
}

export interface AppointmentsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: AppointmentResult[];
}

export interface AppointmentFilters {
  page?: number;
  page_size?: number;
  status?: string;
  visit_type?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}

export function useAppointments(filters: AppointmentFilters) {
  const api = useApi();

  return useQuery<AppointmentsResponse>({
    queryKey: ["appointments", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.status && filters.status !== "All Status")
        params.append("status", filters.status);
      if (filters.visit_type && filters.visit_type !== "All Visit Type")
        params.append("visit_type", filters.visit_type);
      if (filters.search) params.append("search", filters.search);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      return await api.get<AppointmentsResponse>(
        `/appointments/appointments/?${params.toString()}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}
