import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./use-api";

export interface Facility {
  id: string;
  code: string;
  name: string;
  facility_type: string;
  state: string;
  lga: string;
  address: string;
  level: string;
  manager: string | null;
  it_admin: string | null;
  manager_name: string | null;
  it_admin_name: string | null;
  patient_count: number | null;
  staff_count: number | null;
  is_active: boolean;
  suspended_at: string | null;
  created_at: string;
  updated_at: string;
  manager_email: string | null;
  manager_phone: string | null;
  it_admin_email: string | null;
  it_admin_phone: string | null;
}

export interface FacilitiesResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: Facility[];
}

export interface FacilityStats {
  total_facilities: number;
  active_facilities: number;
  suspended_facilities: number;
}

export interface UseFacilitiesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  state?: string;
  lga?: string;
  isActive?: boolean;
}

export interface UpdateFacilityPayload {
  name?: string;
  facility_type?: string;
  lga?: string;
  address?: string;
  level?: string;
  manager_first_name?: string;
  manager_last_name?: string;
  manager_email?: string;
  manager_phone?: string;
  it_admin_first_name?: string;
  it_admin_last_name?: string;
  it_admin_email?: string;
  it_admin_phone?: string;
}

export interface SingleFacilityResponse {
  status: string;
  message: string;
  data: Facility;
  errors: any;
}

export function useFacilities({
  page = 1,
  pageSize = 10,
  search,
  state,
  lga,
  isActive,
}: UseFacilitiesParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: ["facilities", page, pageSize, search, state, lga, isActive],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      if (search) params.append("search", search);
      if (state && state !== "All") params.append("state", state);
      if (lga && lga !== "All") params.append("lga", lga);
      if (isActive !== undefined) params.append("is_active", String(isActive));

      return await api.get<FacilitiesResponse>(
        `/api/v1/facilities/?${params.toString()}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFacilityStats() {
  const api = useApi();

  return useQuery({
    queryKey: ["facilityStats"],
    queryFn: async () => {
      return await api.get<FacilityStats>(
        `/api/v1/facilities/facilities/stats/`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
  });
}

export function useToggleFacilityStatus() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      facilityId,
      isActive,
    }: {
      facilityId: string;
      isActive: boolean;
    }) => {
      return await api.patch(
        `/api/v1/facilities/facilities/${facilityId}/toggle-status/`,
        {
          is_active: isActive,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      queryClient.invalidateQueries({ queryKey: ["facilityStats"] });
    },
  });
}

export function useFacility(id: string | null) {
  const api = useApi();

  return useQuery({
    queryKey: ["facility", id],
    queryFn: async () => {
      return await api.get<Facility>(`/api/v1/facilities/${id}/`);
    },
    enabled: api.isAuthenticated && !api.isLoading && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateFacility(id: string | null) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateFacilityPayload) => {
      return await api.patch(`/api/v1/facilities/${id}/`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facility", id] });
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
  });
}
