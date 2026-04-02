import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

export interface ResetPasswordPayload {
  uidb64: string;
  token: string;
  new_password: string;
  confirm_password: string;
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      return await apiClient.post(`/api/v1/auth/reset-password/`, payload);
    },
  });
}
