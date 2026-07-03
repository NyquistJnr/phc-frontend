import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  AdverseEventFilters,
  AdverseEventReport,
  AdverseEventsResponse,
  CreateAdverseEventPayload,
  UpdateAdverseEventPayload,
} from "@/src/components/pharmacist-dashboard/adverse-events/type";
import { PaginatedResponse } from "@/src/types/custom-pagination";

export interface FacilityStaffMember {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}

type ApiEnvelope<T> = {
  data?: T | ApiEnvelope<T>;
};

function unwrapApiData<T>(response: unknown): T {
  const envelope = response as ApiEnvelope<T>;
  const firstData = envelope.data;

  if (firstData && typeof firstData === "object" && "data" in firstData) {
    return (firstData as ApiEnvelope<T>).data as T;
  }

  return (firstData ?? response) as T;
}

export function useAdverseEvents(filters: AdverseEventFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["adverse-events", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.patient_id) params.append("patient_id", filters.patient_id);
      if (filters.status && filters.status !== "All Status") {
        params.append("status", filters.status);
      }
      if (filters.severity && filters.severity !== "All Severity") {
        params.append("severity", filters.severity);
      }
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.search) params.append("search", filters.search);

      const res = await api.get<unknown>(
        `/adverse-events/reports/?${params.toString()}`,
      );
      return unwrapApiData<AdverseEventsResponse>(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function useAdverseEventDetail(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["adverse-event-detail", id],
    queryFn: async () => {
      const res = await api.get<unknown>(`/adverse-events/reports/${id}/`);
      return unwrapApiData<AdverseEventReport>(res);
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useCreateAdverseEvent() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAdverseEventPayload) => {
      const res = await api.post<unknown>("/adverse-events/reports/", payload);
      return unwrapApiData<AdverseEventReport>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adverse-events"] });
    },
  });
}

export function useUpdateAdverseEvent() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdverseEventPayload;
    }) => {
      const res = await api.patch<unknown>(
        `/adverse-events/reports/${id}/`,
        payload,
      );
      return unwrapApiData<AdverseEventReport>(res);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["adverse-event-detail", variables.id], data);
      queryClient.invalidateQueries({ queryKey: ["adverse-events"] });
    },
  });
}

export function useDeleteAdverseEvent() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/adverse-events/reports/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adverse-events"] });
    },
  });
}

// Facility-staff search for the optional "Reported By" field — same endpoint
// as useFacilityStaff (nurses/use-appointments.ts) but scoped to STAFF rather
// than MEDICALS, since anyone filing on someone else's behalf may not be
// clinical staff.
export function useReportingStaff(searchTerm: string = "") {
  const api = useApi();

  return useQuery({
    queryKey: ["facility-staff", "reporting", searchTerm],
    queryFn: async () => {
      const searchParam = searchTerm
        ? `&search=${encodeURIComponent(searchTerm)}`
        : "";

      const res = await api.get<PaginatedResponse<FacilityStaffMember>>(
        `/users/facility-users/?is_active=true&role=STAFF&page=1&page_size=10${searchParam}`,
      );
      return res.results || [];
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}
