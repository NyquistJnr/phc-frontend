import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  DrugInventoryResponse,
  ImmunizationFilters,
  ImmunizationRegistrationPayload,
  ImmunizationResponseData,
} from "@/src/components/nurse-dashboard/immunization/type";

export function useImmunizationRecords(filters: ImmunizationFilters) {
  const api = useApi();

  return useQuery<ImmunizationResponseData>({
    queryKey: ["immunization-records", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.search) params.append("search", filters.search);
      if (
        filters.session_type &&
        filters.session_type !== "All Session Types"
      ) {
        params.append("session_type", filters.session_type);
      }
      if (filters.status && filters.status !== "All Status") {
        params.append("status", filters.status);
      }

      const res = await api.get<any>(
        `/immunization/records/?${params.toString()}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateImmunization() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ImmunizationRegistrationPayload) => {
      return await api.post("/immunization/records/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["immunization-records"] });
    },
  });
}

export function useVaccines() {
  const api = useApi();

  return useQuery({
    queryKey: ["inventory-drugs"],
    queryFn: async () => {
      const res = await api.get<any>(`/inventory/drugs/?page=1&page_size=100`);
      return (res?.data?.data || res?.data || res) as DrugInventoryResponse;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useUpdateImmunizationStatus() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await api.patch(`/immunization/records/${id}/`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["immunization-records"] });
    },
  });
}
