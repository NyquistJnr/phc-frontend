import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import { PaginatedResponse } from "@/src/types/custom-pagination";

export interface HealthPromotion {
  id: string;
  promotion_id: string;
  title: string;
  type: string;
  location: string;
  target_audience: string;
  expected_participants: number;
  start_date: string;
  end_date: string;
  assigned_to: string[];
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface PostActivityReport {
  id: string;
  report_id: string;
  health_promotion: string;
  number_of_participants: number;
  male_count: number;
  female_count: number;
  follow_up_required: boolean;
  key_messages_delivered: string;
  outcome_summary: string;
  challenges: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  
  // Frontend virtual properties, populated if backend supports expanding relations
  promotion_title?: string;
  promotion_type?: string;
  promotion_start_date?: string;
  promotion_end_date?: string;
}

export interface HealthPromotionFilters {
  page?: number;
  page_size?: number;
  status?: string;
  type?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}

export function useHealthPromotions(filters: HealthPromotionFilters) {
  const api = useApi();

  return useQuery<PaginatedResponse<HealthPromotion>>({
    queryKey: ["health-promotions", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size) params.append("page_size", String(filters.page_size));
      if (filters.status && filters.status !== "All Status") params.append("status", filters.status);
      if (filters.type && filters.type !== "All Type") params.append("type", filters.type);
      if (filters.search) params.append("search", filters.search);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      return await api.get<PaginatedResponse<HealthPromotion>>(
        `/nurse/health-promotions/?${params.toString()}`
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useHealthPromotion(id: string) {
  const api = useApi();

  return useQuery<HealthPromotion>({
    queryKey: ["health-promotion", id],
    queryFn: async () => {
      const res = await api.get<any>(`/nurse/health-promotions/${id}/`);
      return res?.data?.data || res?.data || res;
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useCreateHealthPromotion() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<HealthPromotion>) => {
      return await api.post("/nurse/health-promotions/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-promotions"] });
    },
  });
}

export function useUpdateHealthPromotion() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<HealthPromotion> }) => {
      return await api.patch(`/nurse/health-promotions/${id}/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["health-promotions"] });
      queryClient.invalidateQueries({ queryKey: ["health-promotion", variables.id] });
    },
  });
}

export function useDeleteHealthPromotion() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/nurse/health-promotions/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-promotions"] });
    },
  });
}

// ---------------- Post Activities ----------------

export function usePostActivities(filters: HealthPromotionFilters) {
  const api = useApi();

  return useQuery<PaginatedResponse<PostActivityReport>>({
    queryKey: ["post-activities", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size) params.append("page_size", String(filters.page_size));
      if (filters.status && filters.status !== "All Status") params.append("status", filters.status);
      if (filters.type && filters.type !== "All Type") params.append("type", filters.type);
      if (filters.search) params.append("search", filters.search);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      return await api.get<PaginatedResponse<PostActivityReport>>(
        `/nurse/post-activities/?${params.toString()}`
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function usePostActivity(id: string) {
  const api = useApi();

  return useQuery<PostActivityReport>({
    queryKey: ["post-activity", id],
    queryFn: async () => {
      const res = await api.get<any>(`/nurse/post-activities/${id}/`);
      return res?.data?.data || res?.data || res;
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useCreatePostActivity() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<PostActivityReport>) => {
      return await api.post("/nurse/post-activities/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-activities"] });
    },
  });
}

export function useUpdatePostActivity() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<PostActivityReport> }) => {
      return await api.patch(`/nurse/post-activities/${id}/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["post-activities"] });
      queryClient.invalidateQueries({ queryKey: ["post-activity", variables.id] });
    },
  });
}

export function useDeletePostActivity() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/nurse/post-activities/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-activities"] });
    },
  });
}

// ---------------- Staff Fetching ----------------

export function useFacilityStaffForPromotion(searchTerm: string = "") {
  const api = useApi();

  return useQuery({
    queryKey: ["facility-staff", "role-staff", searchTerm],
    queryFn: async () => {
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "";
      const res = await api.get<PaginatedResponse<any>>(
        `/users/facility-users/?is_active=true&role=STAFF&page=1&page_size=10${searchParam}`
      );
      return res.results || [];
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

