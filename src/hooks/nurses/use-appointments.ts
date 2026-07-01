import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  AppointmentFilters,
  AppointmentsResponse,
} from "@/src/components/nurse-dashboard/appointments/type";
import { PaginatedResponse } from "@/src/types/custom-pagination";

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
      const res = await api.get<any>(`/appointments/appointments/${id}/`);
      return res?.data?.data || res?.data || res;
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useAppointmentVitals(appointmentId: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["appointment-vitals", appointmentId],
    queryFn: async () => {
      const res = await api.get<any>(
        `/appointments/vitals/?page=1&page_size=10&appointment_id=${appointmentId}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: !!appointmentId && api.isAuthenticated && !api.isLoading,
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

export function useCreateAppointment() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      patient: string;
      assigned_to: string;
      appointment_date: string;
      appointment_time: string;
      visit_type: string;
      reason_for_visit: string;
      notes: string;
    }) => {
      return await api.post("/appointments/appointments/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useCreateAncAppointment() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      return await api.post("/maternal-care/appointment-for-anc/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useCreatePncAppointment() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      return await api.post("/maternal-care/appointment-for-pnc/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useSearchPatients(searchTerm: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["patients", "search", searchTerm],
    queryFn: async () => {
      const searchParam = searchTerm
        ? `&search=${encodeURIComponent(searchTerm)}`
        : "";

      const res = await api.get<PaginatedResponse<any>>(
        `/patients/?page=1&page_size=10${searchParam}`,
      );
      return res.results || [];
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useFacilityStaff(searchTerm: string = "") {
  const api = useApi();

  return useQuery({
    queryKey: ["facility-staff", "search", searchTerm],
    queryFn: async () => {
      const searchParam = searchTerm
        ? `&search=${encodeURIComponent(searchTerm)}`
        : "";

      const res = await api.get<PaginatedResponse<any>>(
        `/users/facility-users/?is_active=true&role=MEDICALS&page=1&page_size=10${searchParam}`,
      );
      return res.results || [];
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useCreateVital() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      appointment: string;
      temperature: string;
      blood_pressure: string;
      pulse_rate: number;
      respiratory_rate: number;
      weight_kg: string;
      height_cm: string;
      spo2: number;
      notes: string;
    }) => {
      return await api.post("/appointments/vitals/", payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointment-vitals", variables.appointment],
      });
      queryClient.invalidateQueries({
        queryKey: ["appointment", variables.appointment],
      });
    },
  });
}

export function useUpdateVital() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<{
        appointment: string;
        temperature: string;
        blood_pressure: string;
        pulse_rate: number;
        respiratory_rate: number;
        weight_kg: string;
        height_cm: string;
        spo2: number;
        notes: string;
      }>;
    }) => {
      return await api.patch(`/appointments/vitals/${id}/`, payload);
    },
    onSuccess: (_, variables) => {
      if (variables.payload.appointment) {
        queryClient.invalidateQueries({
          queryKey: ["appointment-vitals", variables.payload.appointment],
        });
        queryClient.invalidateQueries({
          queryKey: ["appointment", variables.payload.appointment],
        });
      }
    },
  });
}

export function useDeleteVital() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string; appointmentId?: string }) => {
      return await api.delete(`/appointments/vitals/${id}/`);
    },
    onSuccess: (_, variables) => {
      if (variables.appointmentId) {
        queryClient.invalidateQueries({
          queryKey: ["appointment-vitals", variables.appointmentId],
        });
        queryClient.invalidateQueries({
          queryKey: ["appointment", variables.appointmentId],
        });
      }
    },
  });
}

export function usePatientChildren(patientId: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["patient-children", patientId],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<any>>(
        `/patients/${patientId}/children/?page=1&page_size=50`,
      );
      return res.results || [];
    },
    enabled: !!patientId && api.isAuthenticated && !api.isLoading,
  });
}
