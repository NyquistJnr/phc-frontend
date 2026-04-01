import { useQuery } from "@tanstack/react-query";
import { useApi } from "./use-api";

export interface User {
  id: string;
  staff_id: string | null;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
  phone_number: string | null;
  role: string;
  is_active: boolean;
  suspended_at: string | null;
  last_login: string | null;
  created_at: string;
}

export interface UsersResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export interface UserStats {
  total_users: number;
  active_users: number;
  suspended_users: number;
  total_patients: number;
  total_staffs: number;
}

export interface UseUsersParams {
  page?: number;
  pageSize?: number;
  role?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export function useUsers({
  page = 1,
  pageSize = 10,
  role,
  search,
  startDate,
  endDate,
  isActive,
}: UseUsersParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: [
      "users",
      page,
      pageSize,
      role,
      search,
      startDate,
      endDate,
      isActive,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      if (role && role !== "All") params.append("role", role);
      if (search) params.append("search", search);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      if (isActive !== undefined) params.append("is_active", String(isActive));

      return await api.get<UsersResponse>(
        `/api/v1/auth/facility-users/?${params.toString()}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserStats() {
  const api = useApi();

  return useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      return await api.get<UserStats>(`/api/v1/auth/facility-users/stats/`);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 5 * 60 * 1000,
  });
}
