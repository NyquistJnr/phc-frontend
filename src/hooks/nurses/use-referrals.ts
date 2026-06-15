import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  ReferralFilters,
  ReferralResult,
  ReferralsResponse,
  CreateReferralPayload,
} from "@/src/components/nurse-dashboard/referrals/type";

export function useReferrals(filters: ReferralFilters) {
  const api = useApi();

  return useQuery<ReferralsResponse>({
    queryKey: ["referrals", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.status && filters.status !== "All Status")
        params.append("status", filters.status);
      if (filters.direction && filters.direction !== "All Directions")
        params.append("direction", filters.direction);
      if (filters.search) params.append("search", filters.search);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.appointment_id)
        params.append("appointment_id", filters.appointment_id);

      return await api.get<ReferralsResponse>(
        `/referrals/records/?${params.toString()}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateReferral() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReferralPayload) => {
      return await api.post("/referrals/records/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
}

export function useReferralById(id: string) {
  const api = useApi();

  return useQuery<ReferralResult>({
    queryKey: ["referral", id],
    queryFn: async () => {
      const res = await api.get<any>(`/referrals/records/${id}/`);
      return res?.data?.data || res?.data || res;
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useUpdateReferralStatus() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await api.patch(`/referrals/records/${id}/update-status/`, {
        status,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      queryClient.invalidateQueries({
        queryKey: ["referral", variables.id],
      });
    },
  });
}

export function useDepartments(facilityId: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["departments", facilityId],
    queryFn: async () => {
      const res = await api.get<any>(
        `/departments/?facility=${facilityId}&is_active=true&page=1&page_size=100`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: !!facilityId && api.isAuthenticated && !api.isLoading,
  });
}
