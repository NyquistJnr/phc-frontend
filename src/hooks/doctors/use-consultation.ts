import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";

export interface MyAppointmentsFilters {
  start_date?: string;
  end_date?: string;
  search?: string;
  status?: string;
  visit_type?: string;
}

export interface ConsultationFilters {
  appointment_id?: string;
  patient_id?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface ConsultationPayload {
  appointment: string;
  chief_complaint?: string;
  presenting_complaint?: string;
  history_of_present_complaint?: string;
  past_medical_history?: string;
  examination_findings?: string;
  primary_diagnosis?: string;
  secondary_diagnosis?: string;
  treatment_plan?: string;
  additional_notes?: string;
}

export function useMyAppointments(filters: MyAppointmentsFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["my-appointments", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);
      if (filters.visit_type) params.append("visit_type", filters.visit_type);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<any>(
        `/appointments/appointments/my-appointments/${queryString}`,
      );

      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useConsultations(filters: ConsultationFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["consultation-records", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.appointment_id)
        params.append("appointment_id", filters.appointment_id);
      if (filters.patient_id) params.append("patient_id", filters.patient_id);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<any>(`/consultations/records/${queryString}`);

      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useConsultationById(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["consultation-record", id],
    queryFn: async () => {
      const res = await api.get<any>(`/consultations/records/${id}/`);
      return res?.data?.data || res?.data || res;
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useConsultationByAppointmentId(appointmentId: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["consultation-by-appointment", appointmentId],
    queryFn: async () => {
      const res = await api.get<any>(
        `/consultations/records/by-appointment/${appointmentId}/`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: !!appointmentId && api.isAuthenticated && !api.isLoading,
    retry: false,
  });
}

export function useCreateConsultation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ConsultationPayload) => {
      return await api.post("/consultations/records/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultation-records"] });
    },
  });
}

export function useUpdateConsultation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ConsultationPayload;
    }) => {
      return await api.put(`/consultations/records/${id}/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["consultation-records"] });
      queryClient.invalidateQueries({
        queryKey: ["consultation-record", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "consultation-by-appointment",
          variables.payload.appointment,
        ],
      });
    },
  });
}

export function usePatchConsultation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ConsultationPayload>;
    }) => {
      return await api.patch(`/consultations/records/${id}/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["consultation-records"] });
      queryClient.invalidateQueries({
        queryKey: ["consultation-record", variables.id],
      });
      if (variables.payload.appointment) {
        queryClient.invalidateQueries({
          queryKey: [
            "consultation-by-appointment",
            variables.payload.appointment,
          ],
        });
      }
    },
  });
}

export function useDeleteConsultation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/consultations/records/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultation-records"] });
    },
  });
}

export function useAppointmentById(id: string) {
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
        `/appointments/vitals/?page=1&page_size=1&appointment_id=${appointmentId}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: !!appointmentId && api.isAuthenticated && !api.isLoading,
  });
}
