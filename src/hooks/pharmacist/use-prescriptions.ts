import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  PrescriptionFilters,
  PrescriptionOrder,
  PrescriptionOrdersResponse,
} from "@/src/components/pharmacist-dashboard/prescriptions/type";

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

export function usePrescriptionOrders(filters: PrescriptionFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["prescription-orders", filters],
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

      const res = await api.get<unknown>(
        `/prescriptions/orders/?${params.toString()}`,
      );
      return unwrapApiData<PrescriptionOrdersResponse>(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function usePrescriptionOrderDetail(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["prescription-detail", id],
    queryFn: async () => {
      const res = await api.get<unknown>(`/prescriptions/orders/${id}/`);
      return unwrapApiData<PrescriptionOrder>(res);
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export interface DispensePrescriptionLineItem {
  drugId: string;
  quantity: number;
  note?: string;
}

export function useDispensePrescriptionOrder() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      patientId,
      items,
    }: {
      orderId: string;
      patientId: string;
      items: DispensePrescriptionLineItem[];
    }) => {
      return await Promise.all(
        items.map((item) =>
          api.post(`/inventory/items/${item.drugId}/dispense/`, {
            quantity: item.quantity,
            patient_id: patientId,
            note: item.note,
          }),
        ),
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["prescription-orders"] });
      queryClient.invalidateQueries({
        queryKey: ["prescription-detail", variables.orderId],
      });
      queryClient.invalidateQueries({ queryKey: ["inventory-drugs"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
    },
  });
}
