import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  LabStats,
  PaginatedLabRequests,
  LabFilters,
  AdvancedLabRequestFilters,
  LabTestFilters,
  StatsFilters,
  CreateLabRequestPayload,
  UpdateLabRequestPayload,
  LabTestPayload,
  SubmitTestResultPayload,
} from "@/src/components/lab-dashboard/home/types";

export function useLabStats(filters: {
  start_date?: string;
  end_date?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["laboratory-stats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<any>(
        `/laboratory/stats/overall/${queryString}`,
      );
      let payload = res;
      if (payload?.data?.data?.pending_lab_requests !== undefined) {
        payload = payload.data.data;
      } else if (payload?.data?.pending_lab_requests !== undefined) {
        payload = payload.data;
      }
      return payload as LabStats;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useLabRequests(filters: LabFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["laboratory-requests", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));

      const res = await api.get<any>(
        `/laboratory/requests/?${params.toString()}`,
      );
      let payload = res;
      if (payload?.data?.data?.results !== undefined) {
        payload = payload.data.data;
      } else if (payload?.data?.results !== undefined) {
        payload = payload.data;
      }
      return payload as PaginatedLabRequests;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

// ==========================================
// NEW QUERIES: REQUESTS
// ==========================================

export function useAdvancedLabRequests(filters: AdvancedLabRequestFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["laboratory-requests-advanced", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.appointment_ID)
        params.append("appointment_ID", filters.appointment_ID);
      if (filters.patient_id) params.append("patient_id", filters.patient_id);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.search) params.append("search", filters.search);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.status && filters.status !== "All Status") {
        params.append("status", filters.status);
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<any>(`/laboratory/requests/${queryString}`);
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function useLabRequestById(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["laboratory-request", id],
    queryFn: async () => {
      const res = await api.get<any>(`/laboratory/requests/${id}/`);
      return res?.data?.data || res?.data || res;
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useLabTests(filters: LabTestFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["laboratory-tests", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.lab_request_id)
        params.append("lab_request_id", filters.lab_request_id);
      if (filters.search) params.append("search", filters.search);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.test_status && filters.test_status !== "All Status") {
        params.append("test_status", filters.test_status);
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<any>(`/laboratory/tests/${queryString}`);
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function useLabTestById(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["laboratory-test", id],
    queryFn: async () => {
      const res = await api.get<any>(`/laboratory/tests/${id}/`);
      return res?.data?.data || res?.data || res;
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

// ==========================================
// NEW QUERIES: STATISTICS
// ==========================================

export function useLabRequestStats(filters: StatsFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["laboratory-request-stats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<any>(
        `/laboratory/stats/requests/${queryString}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useLabTestStats(filters: StatsFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["laboratory-test-stats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<any>(`/laboratory/stats/tests/${queryString}`);
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useCreateLabRequest() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLabRequestPayload) => {
      return await api.post("/laboratory/requests/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laboratory-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["laboratory-requests-advanced"],
      });
      queryClient.invalidateQueries({ queryKey: ["laboratory-request-stats"] });
    },
  });
}

export function useUpdateLabRequest() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateLabRequestPayload;
    }) => {
      return await api.put(`/laboratory/requests/${id}/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["laboratory-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["laboratory-requests-advanced"],
      });
      queryClient.invalidateQueries({
        queryKey: ["laboratory-request", variables.id],
      });
    },
  });
}

export function usePatchLabRequest() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UpdateLabRequestPayload>;
    }) => {
      return await api.patch(`/laboratory/requests/${id}/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["laboratory-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["laboratory-requests-advanced"],
      });
      queryClient.invalidateQueries({
        queryKey: ["laboratory-request", variables.id],
      });
    },
  });
}

export function useDeleteLabRequest() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/laboratory/requests/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laboratory-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["laboratory-requests-advanced"],
      });
      queryClient.invalidateQueries({ queryKey: ["laboratory-request-stats"] });
    },
  });
}

export function usePatchLabTest() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<LabTestPayload>;
    }) => {
      return await api.patch(`/laboratory/tests/${id}/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["laboratory-tests"] });
      queryClient.invalidateQueries({
        queryKey: ["laboratory-test", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["laboratory-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["laboratory-requests-advanced"],
      });
    },
  });
}

export function useSubmitLabTestResult() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: SubmitTestResultPayload;
    }) => {
      return await api.patch(`/laboratory/tests/${id}/submit-result/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["laboratory-tests"] });
      queryClient.invalidateQueries({
        queryKey: ["laboratory-test", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["laboratory-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["laboratory-requests-advanced"],
      });
      queryClient.invalidateQueries({ queryKey: ["laboratory-test-stats"] });
    },
  });
}
