import { ApiError, BackendErrorResponse } from "./api-error";
import { toast } from "react-toastify";

export interface FetchOptions extends RequestInit {
  token?: string | null;
  params?: Record<string, string>;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
}


export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, params, headers, showErrorToast = true, showSuccessToast = false, ...customConfig } = options;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  let urlStr = `${baseUrl}${endpoint}`;

  if (params) {
    const url = new URL(urlStr);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    urlStr = url.toString();
  }

  const defaultHeaders: HeadersInit = {
    Accept: "application/json",
  };

  if (!(customConfig.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  let response: Response;
  try {
    response = await fetch(urlStr, config);
  } catch (error: any) {
    // Catch generic network failures
    const errorMessage = error.message || "Network error. Please check your connection.";
    if (showErrorToast) toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Handle No Content response code (204)
  if (response.status === 204) {
    if (showSuccessToast) toast.success("Operation successful");
    return null as T;
  }

  let data: any;
  const contentType = response.headers.get("content-type");

  try {
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = { status: "success", data: await response.text() };
    }
  } catch (err) {
    if (!response.ok) {
      const errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      if (showErrorToast) toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    return null as T;
  }

  if (!response.ok || data?.status === "error") {
    const errorPayload: BackendErrorResponse = {
      status: data?.status || "error",
      message: data?.message || response.statusText,
      data: data?.data || null,
      errors: data?.errors || null,
    };
    
    if (showErrorToast) toast.error(errorPayload.message);
    throw new ApiError(errorPayload, response.status);
  }

  if (data && typeof data === "object" && data.status === "success" && "data" in data) {
    if (showSuccessToast && data.message) toast.success(data.message);
    return data.data as T;
  }

  if (showSuccessToast && data?.message) toast.success(data.message);
  return data as T;
}


export const apiClient = {
  get: <T>(endpoint: string, options?: FetchOptions) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, body?: any, options?: FetchOptions) => 
    fetchApi<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
  put: <T>(endpoint: string, body?: any, options?: FetchOptions) => 
    fetchApi<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
  patch: <T>(endpoint: string, body?: any, options?: FetchOptions) => 
    fetchApi<T>(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
  delete: <T>(endpoint: string, options?: FetchOptions) => 
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};
