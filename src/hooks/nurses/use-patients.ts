import { useQuery } from "@tanstack/react-query";
import { useApi } from "../use-api";
import {
  PaginatedPatientsResponse,
  PatientFilters,
} from "@/src/components/nurse-dashboard/patients/type";
import {
  Patient,
  PatientAppointment,
  PatientLabRequest,
  PatientPrescription,
  PatientReferral,
  TabFilters,
} from "@/src/components/nurse-dashboard/patients/type";
import { PaginatedResponse } from "@/src/types/custom-pagination";

export function usePatients(filters: PatientFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["patients", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.search) params.append("search", filters.search);

      const res = await api.get<any>(`/patients/?${params.toString()}`);
      return (res?.data?.data || res?.data || res) as PaginatedPatientsResponse;
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function usePatientDetails(id: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["patientDetails", id],
    queryFn: async () => {
      const res = await api.get<any>(`/patients/${id}/`);
      return (res?.data?.data || res?.data || res) as Patient;
    },
    enabled: !!id && api.isAuthenticated && !api.isLoading,
  });
}

export function usePatientHistory(patientId: string, filters: TabFilters) {
  const api = useApi();
  return useQuery({
    queryKey: ["patientHistory", patientId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const res = await api.get<any>(
        `/nurse/patients/${patientId}/appointments/?${params.toString()}`,
      );
      return (res?.data?.data ||
        res?.data ||
        res) as PaginatedResponse<PatientAppointment>;
    },
    enabled: !!patientId && api.isAuthenticated,
  });
}

export function usePatientLabRequests(patientId: string, filters: TabFilters) {
  const api = useApi();
  return useQuery({
    queryKey: ["patientLabs", patientId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.search) params.append("search", filters.search);
      if (filters.status && filters.status !== "All Status")
        params.append("status", filters.status.toUpperCase());

      const res = await api.get<any>(
        `/nurse/patients/${patientId}/lab-requests/?${params.toString()}`,
      );
      return (res?.data?.data ||
        res?.data ||
        res) as PaginatedResponse<PatientLabRequest>;
    },
    enabled: !!patientId && api.isAuthenticated,
  });
}

export function usePatientPrescriptions(
  patientId: string,
  filters: TabFilters,
) {
  const api = useApi();
  return useQuery({
    queryKey: ["patientPrescriptions", patientId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.search) params.append("search", filters.search);
      if (filters.status && filters.status !== "All Status")
        params.append("status", filters.status.toUpperCase());

      const res = await api.get<any>(
        `/nurse/patients/${patientId}/prescriptions/?${params.toString()}`,
      );
      return (res?.data?.data ||
        res?.data ||
        res) as PaginatedResponse<PatientPrescription>;
    },
    enabled: !!patientId && api.isAuthenticated,
  });
}

export function usePatientReferrals(patientId: string, filters: TabFilters) {
  const api = useApi();
  return useQuery({
    queryKey: ["patientReferrals", patientId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size)
        params.append("page_size", String(filters.page_size));
      if (filters.status && filters.status !== "All Status")
        params.append("status", filters.status.toUpperCase());

      const res = await api.get<any>(
        `/nurse/patients/${patientId}/referrals/?${params.toString()}`,
      );
      return (res?.data?.data ||
        res?.data ||
        res) as PaginatedResponse<PatientReferral>;
    },
    enabled: !!patientId && api.isAuthenticated,
  });
}
