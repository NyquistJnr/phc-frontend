import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import type { ApiEnvelope, CreateDoctorLabRequestPayload } from "./type";

export {
  useAppointments as useDoctorAppointments,
  useAppointment as useDoctorAppointment,
  useSearchPatients as useDoctorAppointmentPatientSearch,
  useFacilityStaff as useDoctorFacilityStaff,
} from "../nurses/use-appointments";

export {
  useNotifications as useDoctorNotifications,
  useMarkNotificationRead as useDoctorMarkNotificationRead,
} from "../system/use-notifications";

export {
  useProfile as useDoctorProfile,
  useUpdateProfile as useUpdateDoctorProfile,
} from "../useProfile";

export type LabTestItem = {
  id: string;
  test_name: string;
  linked_item?: string;
  linked_item_name?: string;
  sample_type?: string;
  test_status: string;
  result_value?: string | null;
  result_unit?: string | null;
  test_method?: string | null;
  result_interpretation?: string | null;
  result_notes?: string | null;
  result_date?: string | null;
};

export type LabRequestRecord = {
  id: string;
  request_id: string;
  patient: string;
  patient_name: string;
  patient_display_id: string;
  appointment: string;
  recorded_by: string;
  requested_by: string;
  requested_by_name: string;
  priority: "NORMAL" | "URGENT" | "STAT";
  clinical_notes?: string;
  status: "PENDING" | "PARTIAL" | "COMPLETED" | "CANCELLED";
  created_at: string;
  tests: LabTestItem[];
};

export type PaginatedResponse<T> = {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

function unwrapApiResponse<T = unknown>(response: ApiEnvelope<T> | T): T {
  const envelope = response as ApiEnvelope<T>;
  const data = envelope?.data;
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data?: T }).data as T;
  }
  return (data ?? response) as T;
}

export function useDoctorAlerts() {
  const api = useApi();

  return useQuery({
    queryKey: ["doctorAlerts"],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope>(`/doctor/alerts/`);
      return unwrapApiResponse(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useDoctorLabRequests(filters: {
  page?: number;
  page_size?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  priority?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["doctorLabRequests", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.search) params.append("search", filters.search);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      if (filters.status && filters.status !== "All Status") {
        params.append("status", filters.status);
      }

      if (filters.priority) params.append("priority", filters.priority);

      const queryString = params.toString() ? `?${params.toString()}` : "";

      const res = await api.get<ApiEnvelope>(
        `/laboratory/requests/${queryString}`,
      );
      return unwrapApiResponse(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useDoctorPendingLabs(filters: {
  page?: number;
  page_size?: number;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["doctorPendingLabs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));

      const queryString = params.toString() ? `?${params.toString()}` : "";

      const res = await api.get<ApiEnvelope>(
        `/doctor/pending-labs/${queryString}`,
      );
      return unwrapApiResponse(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useDoctorStats(filters: {
  start_date?: string;
  end_date?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["doctorStats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const queryString = params.toString() ? `?${params.toString()}` : "";

      const res = await api.get<ApiEnvelope>(`/doctor/stats/${queryString}`);
      return unwrapApiResponse(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useCreateDoctorLabRequest() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDoctorLabRequestPayload) => {
      return await api.post("/doctor/lab-requests/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorLabRequests"] });
      queryClient.invalidateQueries({ queryKey: ["doctorPendingLabs"] });
    },
  });
}

export function useRequestDoctorLabRepeat() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      labRequestId,
      notes,
    }: {
      labRequestId: string;
      notes?: string;
    }) => {
      return await api.post(`/doctor/lab-requests/${labRequestId}/repeat/`, {
        notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorLabRequests"] });
      queryClient.invalidateQueries({ queryKey: ["doctorPendingLabs"] });
    },
  });
}

export function useLabRequestById(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["labRequest", id],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope>(`/laboratory/requests/${id}/`);
      return unwrapApiResponse(res);
    },
    enabled: api.isAuthenticated && !api.isLoading && !!id,
  });
}
