import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./use-api";

export interface UserProfile {
  id: string;
  staff_id: string | null;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  profile_picture: string | null;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  profile_picture?: string;
}

export function useProfile() {
  const api = useApi();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await api.get<UserProfile>(`/api/v1/auth/profile/`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ProfileUpdatePayload) => {
      return await api.patch(`/api/v1/auth/profile/`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
