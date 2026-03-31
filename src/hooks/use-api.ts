"use client";

import { useSession, signOut } from "next-auth/react";
import { useCallback, useMemo } from "react";
import { apiClient } from "../lib/api-client";
import { ApiError } from "../lib/api-error"; 

interface ExtendedSession {
  access?: string;
  refresh?: string;
  user?: any;
}

export function useApi() {
  const { data, status } = useSession();
  const session = data as ExtendedSession | null;
  
  const authenticatedFetch = useCallback(
    async <T>(
      method: 'get' | 'post' | 'put' | 'patch' | 'delete',
      endpoint: string,
      body?: any,
      options?: Parameters<typeof apiClient.get>[1]
    ): Promise<T> => {
      try {
        const token = session?.access;
        
        switch (method) {
          case 'get':
            return await apiClient.get<T>(endpoint, { ...options, token });
          case 'delete':
            return await apiClient.delete<T>(endpoint, { ...options, token });
          case 'post':
            return await apiClient.post<T>(endpoint, body, { ...options, token });
          case 'put':
            return await apiClient.put<T>(endpoint, body, { ...options, token });
          case 'patch':
            return await apiClient.patch<T>(endpoint, body, { ...options, token });
          default:
            throw new Error(`Unsupported API method: ${method}`);
        }
      } catch (error) {
        if (error instanceof ApiError && error.isTokenInvalid) {
          console.warn("🔐 Token invalid detected by useApi. Signing out...");
          signOut({ redirect: true, callbackUrl: '/login' });
        }
        throw error;
      }
    },
    [session]
  );

  return useMemo(() => ({
    get: <T>(endpoint: string, options?: any) => authenticatedFetch<T>('get', endpoint, undefined, options),
    post: <T>(endpoint: string, body?: any, options?: any) => authenticatedFetch<T>('post', endpoint, body, options),
    put: <T>(endpoint: string, body?: any, options?: any) => authenticatedFetch<T>('put', endpoint, body, options),
    patch: <T>(endpoint: string, body?: any, options?: any) => authenticatedFetch<T>('patch', endpoint, body, options),
    delete: <T>(endpoint: string, options?: any) => authenticatedFetch<T>('delete', endpoint, undefined, options),
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  }), [authenticatedFetch, status]);
}
