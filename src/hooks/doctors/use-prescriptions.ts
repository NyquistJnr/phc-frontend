import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";

export interface PrescriptionFilters {
  page?: number;
  page_size?: number;
  patient_id?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
  status?: "PENDING" | "PARTIAL" | "DISPENSED" | "CANCELLED" | string;
}

export interface PrescriptionItemPayload {
  drug: string;
  custom_drug_name?: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface CreatePrescriptionPayload {
  patient: string;
  appointment: string;
  priority: "NORMAL" | string;
  instructions: string;
  items: PrescriptionItemPayload[];
}

export interface UpdatePrescriptionPayload {
  patient: string;
  appointment: string;
  prescribed_by: string;
  priority: string;
  instructions: string;
  status: string;
}

export function usePrescriptions(filters: PrescriptionFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["prescriptions", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.patient_id) params.append("patient_id", filters.patient_id);
      if (filters.search) params.append("search", filters.search);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.status && filters.status !== "All Status") {
        params.append("status", filters.status);
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";

      const res = await api.get<any>(`/prescriptions/orders/${queryString}`);
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function usePrescriptionById(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["prescription", id],
    queryFn: async () => {
      const res = await api.get<any>(`/prescriptions/orders/${id}/`);
      return res?.data?.data || res?.data || res;
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useCreatePrescription() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePrescriptionPayload) => {
      return await api.post("/prescriptions/orders/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });
}

export function useUpdatePrescription() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePrescriptionPayload;
    }) => {
      return await api.put(`/prescriptions/orders/${id}/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["prescription", variables.id],
      });
    },
  });
}

export function usePatchPrescription() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UpdatePrescriptionPayload>;
    }) => {
      return await api.patch(`/prescriptions/orders/${id}/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["prescription", variables.id],
      });
    },
  });
}

export function useDeletePrescription() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/prescriptions/orders/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });
}
