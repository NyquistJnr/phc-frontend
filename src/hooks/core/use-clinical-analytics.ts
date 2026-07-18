import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";

export function useClinicalStats(filters: {
  start_date?: string;
  end_date?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["clinicalStats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const res = await api.get<any>(
        `/core/clinical-stats/?${params.toString()}`
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function usePatientVisitTrend(filters: {
  start_date?: string;
  end_date?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["patientVisitTrend", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const res = await api.get<any>(
        `/core/patient-visit-trend/?${params.toString()}`
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useClinicalActivity(filters: {
  start_date?: string;
  end_date?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["clinicalActivity", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const res = await api.get<any>(
        `/core/clinical-activity/?${params.toString()}`
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useDiseaseOverview(filters: {
  start_date?: string;
  end_date?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["diseaseOverview", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const res = await api.get<any>(
        `/core/disease-overview/?${params.toString()}`
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useRecentAppointments(filters: {
  search?: string;
  page?: number;
  page_size?: number;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["recentAppointments", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));

      const res = await api.get<any>(
        `/core/recent-appointments/?${params.toString()}`
      );
      return res?.data?.data || res?.data || res;
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}
