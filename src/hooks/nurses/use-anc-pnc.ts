import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";

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
