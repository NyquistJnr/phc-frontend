import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  EpisodeFilters,
  EpisodesResponse,
  CreateEpisodePayload,
  EpisodeResult,
  AncVisitsResponse,
  PncVisitsResponse,
  MaternalVisitFilters,
} from "@/src/components/nurse-dashboard/maternal-care/type";

export function useEpisodes(filters: EpisodeFilters) {
  const api = useApi();

  return useQuery<EpisodesResponse>({
    queryKey: ["maternal-episodes", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.status && filters.status !== "All Status") {
        params.append("status", filters.status);
      }
      if (filters.search) params.append("search", filters.search);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      const res = await api.get<any>(
        `/maternal-care/episodes/?${params.toString()}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateEpisode() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateEpisodePayload) => {
      return await api.post("/maternal-care/episodes/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maternal-episodes"] });
    },
  });
}

export function useUpdateEpisodeStatus() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await api.patch(`/maternal-care/episodes/${id}/update-status/`, {
        status,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["maternal-episodes"] });
      queryClient.invalidateQueries({
        queryKey: ["maternal-episode", variables.id],
      });
    },
  });
}

export function useDeleteEpisode() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/maternal-care/episodes/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maternal-episodes"] });
    },
  });
}

export function useEpisodeDetails(id: string) {
  const api = useApi();

  return useQuery<EpisodeResult>({
    queryKey: ["maternal-episode", id],
    queryFn: async () => {
      const res = await api.get<any>(`/maternal-care/episodes/${id}/`);
      return res?.data?.data || res?.data || res;
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function useAncVisits(filters: MaternalVisitFilters) {
  const api = useApi();

  return useQuery<AncVisitsResponse>({
    queryKey: ["anc-visits", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.episode_id) params.append("episode_id", filters.episode_id);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.attendance_type && filters.attendance_type !== "All Types") {
        params.append("attendance_type", filters.attendance_type.toUpperCase());
      }

      const res = await api.get<any>(
        `/maternal-care/anc-visits/?${params.toString()}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: !!filters.episode_id && api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function usePncVisits(filters: MaternalVisitFilters) {
  const api = useApi();

  return useQuery<PncVisitsResponse>({
    queryKey: ["pnc-visits", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.episode_id) params.append("episode_id", filters.episode_id);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.outcome && filters.outcome !== "All Outcomes") {
        params.append("outcome", filters.outcome.toUpperCase());
      }

      const res = await api.get<any>(
        `/maternal-care/pnc-visits/?${params.toString()}`,
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: !!filters.episode_id && api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}
