import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./use-api";

export interface Department {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  head: string | null;
}

export interface DepartmentsResponse {
  count: number;
  total_pages?: number;
  current_page?: number;
  next: string | null;
  previous: string | null;
  results: Department[];
}

export interface DepartmentMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  staff_id?: string;
  is_active?: boolean;
  position: string;
}

export interface DepartmentMembersResponse {
  count: number;
  total_pages?: number;
  current_page?: number;
  next: string | null;
  previous: string | null;
  results: DepartmentMember[];
}

interface BaseApiResponse<T> {
  status: string;
  message: string;
  data: T;
  errors: any;
}

export function useDepartments({ search, isActive }: { search?: string; isActive?: boolean } = {}) {
  const api = useApi();

  return useQuery({
    queryKey: ["departments", search, isActive],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (isActive !== undefined) params.append("is_active", String(isActive));
      
      const query = params.toString();
      const res = await api.get<BaseApiResponse<DepartmentsResponse>>(`/departments/${query ? `?${query}` : ""}`);
      return res.data || (res as any); // Fallback in case it's not wrapped
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useDepartment(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["department", id],
    queryFn: async () => {
      const res = await api.get<BaseApiResponse<Department>>(`/departments/${id}/`);
      return res.data || (res as any);
    },
    enabled: api.isAuthenticated && !api.isLoading && !!id,
  });
}

export function useCreateDepartment() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Department>) => {
      return await api.post(`/departments/`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useUpdateDepartment(id: string) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Department>) => {
      return await api.patch(`/departments/${id}/`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department", id] });
    },
  });
}

export function useDeleteDepartment() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/departments/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useDepartmentMembers(departmentId: string, search?: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["departmentMembers", departmentId, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const query = params.toString();
      
      const res = await api.get<BaseApiResponse<DepartmentMembersResponse>>(
        `/departments/${departmentId}/members/${query ? `?${query}` : ""}`
      );
      return res.data || (res as any);
    },
    enabled: api.isAuthenticated && !api.isLoading && !!departmentId,
  });
}

export function useAddDepartmentMembers(departmentId: string) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      return await api.post(`/departments/${departmentId}/add-members/`, { user_ids: userIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departmentMembers", departmentId] });
    },
  });
}

export function useRemoveDepartmentMembers(departmentId: string) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      return await api.post(`/departments/${departmentId}/remove-members/`, { user_ids: userIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departmentMembers", departmentId] });
    },
  });
}
