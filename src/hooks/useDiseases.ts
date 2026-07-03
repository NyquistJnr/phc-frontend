import { useQuery } from "@tanstack/react-query";
import { useApi } from "./use-api";

export type DiseaseSeverity = "CRITICAL" | "MODERATE" | "LOW";

export interface Disease {
  id: string;
  name: string;
  severity: DiseaseSeverity;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiseasesResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: Disease[];
}

export interface UseDiseasesParams {
  page?: number;
  pageSize?: number;
  severity?: string;
  search?: string;
}

export function useDiseases({
  page = 1,
  pageSize = 10,
  severity,
  search,
}: UseDiseasesParams = {}) {
  const api = useApi();

  return useQuery({
    queryKey: ["diseases", page, pageSize, severity, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      if (severity && severity !== "All") params.append("severity", severity);
      if (search) params.append("search", search);

      return await api.get<DiseasesResponse>(
        `/registry/diseases/?${params.toString()}`,
      );
    },
    enabled: api.isAuthenticated && !api.isLoading,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
