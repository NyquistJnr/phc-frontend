import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  InventoryFilters,
  CreateInventoryItemPayload,
  InventoryItem,
  PaginatedInventoryItems,
  RefillItemPayload,
  ExpiringFilters,
  PaginatedExpiringItems,
  InventoryStatsFilters,
  ComprehensiveStats,
  ExpiryStats,
} from "@/src/components/lab-dashboard/lab-inventory/types";

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

function getCreatedInventoryItemId(response: unknown) {
  const item = unwrapApiData<Partial<InventoryItem>>(response);
  return item.id;
}

// INVENTORY ITEMS

export function useInventoryItems(filters: InventoryFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["inventory-items", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.name) params.append("name", filters.name);
      if (filters.description)
        params.append("description", filters.description);
      if (filters.drug_classification)
        params.append("drug_classification", filters.drug_classification);
      if (filters.inventory_category)
        params.append("inventory_category", filters.inventory_category);
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<unknown>(`/inventory/items/${queryString}`);

      return unwrapApiData<PaginatedInventoryItems>(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function useInventoryItemById(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["inventory-item", id],
    queryFn: async () => {
      const res = await api.get<unknown>(`/inventory/items/${id}/`);
      return unwrapApiData<InventoryItem>(res);
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useExpiringInventoryItems(filters: ExpiringFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["inventory-items-expiring", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.drug_classification)
        params.append("drug_classification", filters.drug_classification);
      if (filters.inventory_category)
        params.append("inventory_category", filters.inventory_category);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<unknown>(
        `/inventory/items/expiring/${queryString}`,
      );

      return unwrapApiData<PaginatedExpiringItems>(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

// STATISTICS

export function useComprehensiveInventoryStats(filters: InventoryStatsFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["inventory-stats-comprehensive", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.drug_classification)
        params.append("drug_classification", filters.drug_classification);
      if (filters.inventory_category)
        params.append("inventory_category", filters.inventory_category);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.expiry_days)
        params.append("expiry_days", String(filters.expiry_days));

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<unknown>(
        `/inventory/stats/comprehensive/${queryString}`,
      );

      return unwrapApiData<ComprehensiveStats>(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useExpiryInventoryStats(
  filters: Pick<InventoryStatsFilters, "start_date" | "end_date">,
) {
  const api = useApi();

  return useQuery({
    queryKey: ["inventory-stats-expiry", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<unknown>(
        `/inventory/stats/expiry/${queryString}`,
      );

      return unwrapApiData<ExpiryStats>(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useFacilityInventoryStats(
  facilityId: string,
  filters: InventoryStatsFilters,
) {
  const api = useApi();

  return useQuery({
    queryKey: ["inventory-stats-facility", facilityId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.drug_classification)
        params.append("drug_classification", filters.drug_classification);
      if (filters.inventory_category)
        params.append("inventory_category", filters.inventory_category);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.expiry_days)
        params.append("expiry_days", String(filters.expiry_days));

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<unknown>(
        `/inventory/stats/facility/${facilityId}/${queryString}`,
      );

      return unwrapApiData<ComprehensiveStats>(res);
    },
    enabled: !!facilityId && api.isAuthenticated && !api.isLoading,
  });
}

export function useCreateInventoryItem() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateInventoryItemPayload) => {
      const res = await api.post<unknown>("/inventory/items/", payload);
      return {
        response: res,
        id: getCreatedInventoryItemId(res),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({
        queryKey: ["inventory-stats-comprehensive"],
      });
    },
  });
}

export function useUpdateInventoryItem() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateInventoryItemPayload;
    }) => {
      return await api.put(`/inventory/items/${id}/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({
        queryKey: ["inventory-item", variables.id],
      });
    },
  });
}

export function usePatchInventoryItem() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateInventoryItemPayload>;
    }) => {
      return await api.patch(`/inventory/items/${id}/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({
        queryKey: ["inventory-item", variables.id],
      });
    },
  });
}

export function useDeleteInventoryItem() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/inventory/items/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items-expiring"] });
      queryClient.invalidateQueries({
        queryKey: ["inventory-stats-comprehensive"],
      });
    },
  });
}

export function useDispenseInventoryItem() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.post(`/inventory/items/${id}/dispense/`, {});
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-item", id] });
      queryClient.invalidateQueries({
        queryKey: ["inventory-stats-comprehensive"],
      });
    },
  });
}

export function useRefillInventoryItem() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: RefillItemPayload;
    }) => {
      return await api.post(`/inventory/items/${id}/refill/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({
        queryKey: ["inventory-item", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["inventory-items-expiring"] });
      queryClient.invalidateQueries({
        queryKey: ["inventory-stats-comprehensive"],
      });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats-expiry"] });
    },
  });
}
