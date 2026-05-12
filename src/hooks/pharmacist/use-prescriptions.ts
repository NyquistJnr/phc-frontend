import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  PrescriptionFilters,
  PrescriptionOrder,
} from "@/src/components/pharmacist-dashboard/prescriptions/type";

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

      const res = (await api.get(
        `/prescriptions/orders/?${params.toString()}`,
      )) as any;
      return res?.data?.data || res?.data || res;
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
      const res = (await api.get(`/prescriptions/orders/${id}/`)) as any;
      return (res?.data?.data || res?.data || res) as PrescriptionOrder;
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}
