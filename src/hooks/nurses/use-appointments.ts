import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  AppointmentFilters,
  AppointmentResult,
  AppointmentsResponse,
} from "@/src/components/nurse-dashboard/appointments/type";

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

export function useAppointment(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["appointment", id],
    queryFn: async () => {
      return await api.get<{ data: AppointmentResult }>(
        `/appointments/appointments/${id}/`,
      );
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useDeleteAppointment() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/appointments/appointments/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await api.patch(
        `/appointments/appointments/${id}/update-status/`,
        { status },
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointment", variables.id],
      });
    },
  });
}
