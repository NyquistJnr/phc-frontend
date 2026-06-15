import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";

export function useFacilityUsers(searchTerm: string = "") {
  const api = useApi();
  return useQuery({
    queryKey: ["facility-users", searchTerm],
    queryFn: async () => {
      const searchParam = searchTerm
        ? `&search=${encodeURIComponent(searchTerm)}`
        : "";
      const res = await api.get<any>(
        `/users/facility-users/?page=1&page_size=20&role=STAFF${searchParam}`,
      );
      return (
        res?.data?.data?.results || res?.data?.results || res?.results || []
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useLabEquipment(searchTerm: string = "") {
  const api = useApi();
  return useQuery({
    queryKey: ["lab-equipment", searchTerm],
    queryFn: async () => {
      const searchParam = searchTerm
        ? `&search=${encodeURIComponent(searchTerm)}`
        : "";
      const res = await api.get<any>(
        `/inventory/items/?page=1&page_size=20&inventory_category=LAB_EQUIPMENT${searchParam}`,
      );
      return (
        res?.data?.data?.results || res?.data?.results || res?.results || []
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useAppointmentsSearch(searchTerm: string = "") {
  const api = useApi();
  return useQuery({
    queryKey: ["appointments-search", searchTerm],
    queryFn: async () => {
      const searchParam = searchTerm
        ? `&search=${encodeURIComponent(searchTerm)}`
        : "";
      const res = await api.get<any>(
        `/appointments/appointments/?page=1&page_size=20${searchParam}`,
      );
      return (
        res?.data?.data?.results || res?.data?.results || res?.results || []
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useCreateLabRequest() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      return await api.post("/laboratory/requests/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-lab-requests"] });
    },
  });
}
