import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";

export interface CreateFacilityPayload {
  name: string;
  facility_type: string;
  lga: string;
  ward: string;
  address: string;
  level: string;
  manager_first_name: string;
  manager_last_name: string;
  manager_email: string;
  manager_phone: string;
  it_admin_first_name: string;
  it_admin_last_name: string;
  it_admin_email: string;
  it_admin_phone: string;
}

export interface FacilityUser {
  id: string;
  staff_id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  suspended_at: string | null;
  last_login: string | null;
  created_at: string;
}

export interface FacilityUsersResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: FacilityUser[];
}

export interface UseFacilityUsersParams {
  facilityId: string;
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export interface InviteUserPayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  facility_id: string;
}

export function useCreateFacility() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateFacilityPayload) => {
      const res = await api.post<any>("/facilities/", payload);

      return res?.data?.data || res?.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
  });
}

export function useLgas(state: string) {
  return useQuery({
    queryKey: ["locations", "lgas", state],
    queryFn: async () => {
      const res = await fetch(`/api/locations?state=${state}&names_only=true`);
      if (!res.ok) throw new Error("Failed to fetch LGAs");
      const data = await res.json();
      return data.lgas as string[];
    },
    enabled: !!state,
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useWards(state: string, lga: string) {
  return useQuery({
    queryKey: ["locations", "wards", state, lga],
    queryFn: async () => {
      const res = await fetch(
        `/api/locations?state=${state}&lga=${lga}&names_only=true`,
      );
      if (!res.ok) throw new Error("Failed to fetch Wards");
      const data = await res.json();
      return data.wards as string[];
    },
    enabled: !!state && !!lga,
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export interface UpdateFacilityPayload {
  name?: string;
  facility_type?: string;
  lga?: string;
  ward?: string;
  address?: string;
  level?: string;
}

export function useUpdateFacility(id: string) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateFacilityPayload) => {
      const res = await api.patch<any>(`/facilities/${id}/`, payload);
      return res?.data?.data || res?.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facility", id] });
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
  });
}

export function useFacilityUsers({
  facilityId,
  page = 1,
  pageSize = 10,
  search,
  role,
  isActive,
}: UseFacilityUsersParams) {
  const api = useApi();

  return useQuery({
    queryKey: [
      "facility-users",
      facilityId,
      page,
      pageSize,
      search,
      role,
      isActive,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      if (search) params.append("search", search);
      if (role && role !== "All Roles") params.append("role", role);
      if (isActive !== undefined) params.append("is_active", String(isActive));

      return await api.get<FacilityUsersResponse>(
        `/users/facilities/${facilityId}/users/?${params.toString()}`,
      );
    },
    enabled: !!facilityId && api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInviteFacilityUser() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InviteUserPayload) => {
      const res = await api.post<any>("/users/state-admin/invite/", payload);
      return res?.data?.data || res?.data || res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["facility-users", variables.facility_id],
      });
    },
  });
}

export function useToggleUserStatus() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      isActive,
    }: {
      userId: string;
      isActive: boolean;
      facilityId: string;
    }) => {
      const res = await api.patch<any>(`/users/${userId}/toggle-status/`, {
        is_active: isActive,
      });
      return res?.data?.data || res?.data || res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["facility-users", variables.facilityId],
      });
    },
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
      const res = await api.patch<any>(
        `/facilities/facilities/${facilityId}/toggle-status/`,
        { is_active: isActive },
      );
      return res?.data?.data || res?.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      queryClient.invalidateQueries({ queryKey: ["facilityStats"] });
    },
  });
}
