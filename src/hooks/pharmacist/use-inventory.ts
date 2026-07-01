import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  InventoryFilters,
  ExpiringFilters,
  RefillPayload,
  CreateDrugPayload,
  DispensePayload,
  DrugDetail,
  ExpiringDrugItem,
  ExpiryAnalysisStatsResponse,
  InventoryDrugsResponse,
  InventoryStatsResponse,
} from "@/src/components/pharmacist-dashboard/inventory/type";

const PHARMACY_INVENTORY_CATEGORY = "DRUG";
const PHARMACY_DRUG_CLASSIFICATION = "NORMAL";

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

function getCreatedDrugId(response: unknown) {
  return unwrapApiData<Partial<DrugDetail>>(response).id;
}

export function useInventoryStats() {
  const api = useApi();

  return useQuery({
    queryKey: ["inventory-stats", PHARMACY_INVENTORY_CATEGORY],
    queryFn: async () => {
      const params = new URLSearchParams({
        inventory_category: PHARMACY_INVENTORY_CATEGORY,
      });
      const res = await api.get<unknown>(
        `/inventory/stats/comprehensive/?${params.toString()}`,
      );
      return unwrapApiData<InventoryStatsResponse>(res);
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
      params.append(
        "inventory_category",
        filters.inventory_category || PHARMACY_INVENTORY_CATEGORY,
      );
      if (filters.drug_classification) {
        params.append("drug_classification", filters.drug_classification);
      }
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size) {
        params.append("page_size", String(filters.page_size));
      }
      if (filters.search) params.append("search", filters.search);
      if (filters.status && filters.status !== "All Status") {
        params.append("status", filters.status);
      }
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const res = await api.get<unknown>(
        `/inventory/items/?${params.toString()}`,
      );
      return unwrapApiData<InventoryDrugsResponse>(res);
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
    queryKey: [
      "expiry-analysis-stats",
      PHARMACY_INVENTORY_CATEGORY,
      filters,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        inventory_category: PHARMACY_INVENTORY_CATEGORY,
      });
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const res = await api.get<unknown>(
        `/inventory/stats/expiry/?${params.toString()}`,
      );
      return unwrapApiData<ExpiryAnalysisStatsResponse>(res);
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
      params.append(
        "inventory_category",
        filters.inventory_category || PHARMACY_INVENTORY_CATEGORY,
      );
      if (filters.drug_classification) {
        params.append("drug_classification", filters.drug_classification);
      }
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size) {
        params.append("page_size", String(filters.page_size));
      }
      if (filters.search) params.append("search", filters.search);
      if (filters.item_type && filters.item_type !== "All Unit") {
        params.append("item_type", filters.item_type);
      }
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const res = await api.get<unknown>(
        `/inventory/items/expiring/?${params.toString()}`,
      );
      return unwrapApiData<{
        count: number;
        total_pages: number;
        current_page: number;
        next: string | null;
        previous: string | null;
        results: ExpiringDrugItem[];
      }>(res);
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
      const res = await api.get<unknown>(`/inventory/items/${id}/`);
      return unwrapApiData<DrugDetail>(res);
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useCreateDrug() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDrugPayload) => {
      const body: Record<string, unknown> = {
        ...payload,
        inventory_category:
          payload.inventory_category || PHARMACY_INVENTORY_CATEGORY,
      };
      // Only include drug_classification when category is DRUG
      if (body.inventory_category === "DRUG") {
        body.drug_classification =
          payload.drug_classification || PHARMACY_DRUG_CLASSIFICATION;
      } else {
        delete body.drug_classification;
      }
      // Omit schedule_rules when null/undefined (only send for IMMUNIZATION drugs)
      if (!payload.schedule_rules) {
        delete body.schedule_rules;
      }
      const res = await api.post<unknown>(`/inventory/items/`, body);
      return {
        response: res,
        id: getCreatedDrugId(res),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-drugs"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
    },
  });
}

export function useDispenseDrug() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: DispensePayload;
    }) => {
      return await api.post(`/inventory/items/${id}/dispense/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["drug-detail", variables.id] });
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
      return await api.post(`/inventory/items/${id}/refill/`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["drug-detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["inventory-drugs"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
      queryClient.invalidateQueries({ queryKey: ["expiring-drugs"] });
      queryClient.invalidateQueries({ queryKey: ["expiry-analysis-stats"] });
    },
  });
}
