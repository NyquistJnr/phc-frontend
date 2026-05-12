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
