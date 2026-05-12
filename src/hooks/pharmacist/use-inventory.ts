import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  InventoryFilters,
  ExpiringFilters,
  RefillPayload,
  CreateDrugPayload,
} from "@/src/components/pharmacist-dashboard/inventory/type";

export function useInventoryStats() {
  const api = useApi();

  return useQuery({
    queryKey: ["inventory-stats"],
    queryFn: async () => {
      const res = await api.get<any>("/inventory/stats/");
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useInventoryDrugs(filters: InventoryFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["inventory-drugs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.search) params.append("search", filters.search);
      if (filters.status && filters.status !== "All Status") {
        params.append("status", filters.status);
      }
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const res = await api.get<any>(`/inventory/drugs/?${params.toString()}`);
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function useExpiryAnalysisStats(filters: {
  start_date?: string;
  end_date?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["expiry-analysis-stats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const res = await api.get<any>(
        `/inventory/stats/expiry-analysis/?${params.toString()}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useExpiringDrugs(filters: ExpiringFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["expiring-drugs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.search) params.append("search", filters.search);
      if (filters.unit && filters.unit !== "All Unit")
        params.append("unit", filters.unit);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const res = await api.get<any>(
        `/inventory/drugs/expiring/?${params.toString()}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function useDrugDetail(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["drug-detail", id],
    queryFn: async () => {
      const res = (await api.get(`/inventory/drugs/${id}/`)) as any;
      return res?.data?.data || res?.data || res;
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useCreateDrug() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDrugPayload) => {
      return (await api.post(`/inventory/drugs/`, payload)) as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-drugs"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
    },
  });
}

export function useRefillDrug() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: RefillPayload;
    }) => {
      return (await api.post(`/inventory/drugs/${id}/refill/`, payload)) as any;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["drug-detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["inventory-drugs"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
    },
  });
}
