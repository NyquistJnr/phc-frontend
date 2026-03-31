import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth"; 
import { apiClient } from "./api-client";
import { redirect } from "next/navigation";
import { ApiError } from "./api-error";

interface ExtendedSession {
  access?: string;
  refresh?: string;
  user?: any;
}

export async function getServerApi() {
  const sessionData = await getServerSession(authOptions);
  const session = sessionData as ExtendedSession | null;
  
  const authenticatedFetch = async <T>(
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
         // Server Component detected an invalid/expired token.
         console.warn("🔐 Server API detected invalid token, redirecting to login...");
         redirect('/login');
       }
       throw error;
    }
  };

  return {
    get: <T>(endpoint: string, options?: any) => authenticatedFetch<T>('get', endpoint, undefined, options),
    post: <T>(endpoint: string, body?: any, options?: any) => authenticatedFetch<T>('post', endpoint, body, options),
    put: <T>(endpoint: string, body?: any, options?: any) => authenticatedFetch<T>('put', endpoint, body, options),
    patch: <T>(endpoint: string, body?: any, options?: any) => authenticatedFetch<T>('patch', endpoint, body, options),
    delete: <T>(endpoint: string, options?: any) => authenticatedFetch<T>('delete', endpoint, undefined, options),
    session,
  };
}
