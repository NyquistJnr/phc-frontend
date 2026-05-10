import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import { EpisodeBaby } from "@/src/components/nurse-dashboard/maternal-care/type";

export interface CreateAncVisitPayload {
  attendance_type: string;
  hiv_status: string;
  vdrl_syphilis: string;
  hepatitis_b: string;
  hemoglobin: string;
  urinalysis: string;
  tt_dose_given: string;
  iptp_dose_given: string;
  iron_folate_given: boolean;
  risk_factors: string;
  notes: string;
  episode: string;
  appointment: string;
}

export function useCreateAncVisit() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAncVisitPayload) => {
      return await api.post("/maternal-care/anc-visits/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anc-visits"] });
    },
  });
}

export function useCreatePncVisit() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      return await api.post("/maternal-care/pnc-visits/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pnc-visits"] });
    },
  });
}

export function useCreateNewbornAssessment() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      return await api.post("/maternal-care/pnc-newborn-assessments/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pnc-newborn-assessments"] });
      queryClient.invalidateQueries({ queryKey: ["pnc-visit"] });
    },
  });
}

export function useRecordDelivery() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      episodeId,
      payload,
    }: {
      episodeId: string;
      payload: any;
    }) => {
      return await api.post(
        `/maternal-care/episodes/${episodeId}/record-delivery/`,
        payload,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

export function useEpisodeBabies(episodeId: string, page = 1, pageSize = 10) {
  const api = useApi();

  return useQuery({
    queryKey: ["episode-babies", episodeId, page, pageSize],
    queryFn: async () => {
      const res = await api.get<any>(
        `/maternal-care/episodes/${episodeId}/babies/?page=${page}&page_size=${pageSize}`,
      );
      return (res?.data?.data || res?.data || res) as EpisodeBaby[];
    },
    enabled: !!episodeId && api.isAuthenticated && !api.isLoading,
  });
}
