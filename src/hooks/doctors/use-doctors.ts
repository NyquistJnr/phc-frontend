import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../use-api"; // Adjust this import path as needed
import type {
  ApiEnvelope,
  CreateDoctorLabRequestPayload,
  CreateDoctorPrescriptionPayload,
  DoctorMaternalVisitFilters,
  DoctorPrescriptionFilters,
} from "./type";

export {
  usePatients as useDoctorPatients,
  usePatientDetails as useDoctorPatientDetails,
  usePatientHistory as useDoctorPatientHistory,
  usePatientLabRequests as useDoctorPatientLabRequests,
  usePatientPrescriptions as useDoctorPatientPrescriptions,
  usePatientReferrals as useDoctorPatientReferrals,
  usePatients as useDoctorSearchPatients,
} from "../nurses/use-patients";

export {
  useAppointments as useDoctorAppointments,
  useAppointment as useDoctorAppointment,
  useSearchPatients as useDoctorAppointmentPatientSearch,
  useFacilityStaff as useDoctorFacilityStaff,
} from "../nurses/use-appointments";

export {
  useReferrals as useDoctorReferrals,
  useCreateReferral as useCreateDoctorReferral,
  useReferralById as useDoctorReferralById,
  useUpdateReferralStatus as useUpdateDoctorReferralStatus,
} from "../nurses/use-referrals";

export {
  useImmunizationRecords as useDoctorImmunizationRecords,
  useCreateImmunization as useCreateDoctorImmunization,
  useVaccines as useDoctorVaccines,
  useUpdateImmunizationStatus as useUpdateDoctorImmunizationStatus,
  useImmunizationRecord as useDoctorImmunizationRecord,
} from "../nurses/use-immunization";

export {
  useCreateAncVisit as useDoctorCreateAncVisit,
  useCreatePncVisit as useDoctorCreatePncVisit,
  useCreateNewbornAssessment as useDoctorCreateNewbornAssessment,
  useRecordDelivery as useDoctorRecordDelivery,
  useEpisodeBabies as useDoctorEpisodeBabies,
} from "../nurses/use-anc-pnc";

export {
  useEpisodes as useDoctorMaternalCareEpisodes,
  useCreateEpisode as useDoctorCreateMaternalEpisode,
  useAncVisitDetails as useDoctorAncVisitDetails,
  usePncVisitDetails as useDoctorPncVisitDetails,
} from "../nurses/use-maternal-care";

export {
  useNotifications as useDoctorNotifications,
  useMarkNotificationRead as useDoctorMarkNotificationRead,
} from "../system/use-notifications";

export {
  useProfile as useDoctorProfile,
  useUpdateProfile as useUpdateDoctorProfile,
} from "../useProfile";

function unwrapApiResponse<T = unknown>(response: ApiEnvelope<T> | T): T {
  const envelope = response as ApiEnvelope<T>;
  const data = envelope?.data;
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data?: T }).data as T;
  }
  return (data ?? response) as T;
}

function buildQueryString(filters: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All Status") {
      params.append(key, String(value));
    }
  });
  return params.toString() ? `?${params.toString()}` : "";
}

export function useDoctorAncVisits(filters: DoctorMaternalVisitFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["doctorAncVisits", filters],
    queryFn: async () => {
      const queryString = buildQueryString(filters);
      const res = await api.get<ApiEnvelope>(`/maternal-care/anc-visits/${queryString}`);
      return unwrapApiResponse(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function useDoctorPncVisits(filters: DoctorMaternalVisitFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["doctorPncVisits", filters],
    queryFn: async () => {
      const queryString = buildQueryString(filters);
      const res = await api.get<ApiEnvelope>(`/maternal-care/pnc-visits/${queryString}`);
      return unwrapApiResponse(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

// 1. Get Doctor Alerts
export function useDoctorAlerts() {
  const api = useApi();

  return useQuery({
    queryKey: ["doctorAlerts"],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope>(`/doctor/alerts/`);
      // Matches the wrapper unwrapping from your previous examples
      return unwrapApiResponse(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

// 2. Get All Laboratory Requests
export function useDoctorLabRequests(filters: {
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
  search?: string;
  status?: "PENDING" | "PARTIAL" | "COMPLETED" | "CANCELLED" | string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["doctorLabRequests", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size) params.append("page_size", String(filters.page_size));
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);

      // Append `?` only if parameters exist
      const queryString = params.toString() ? `?${params.toString()}` : "";
      
      const res = await api.get<ApiEnvelope>(`/doctor/lab-requests/${queryString}`);
      return unwrapApiResponse(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

// 3. Get Pending Lab Requests
export function useDoctorPendingLabs(filters: {
  page?: number;
  page_size?: number;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["doctorPendingLabs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.page) params.append("page", String(filters.page));
      if (filters.page_size) params.append("page_size", String(filters.page_size));

      const queryString = params.toString() ? `?${params.toString()}` : "";

      const res = await api.get<ApiEnvelope>(`/doctor/pending-labs/${queryString}`);
      return unwrapApiResponse(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

// 4. Get Doctor Stats
export function useDoctorStats(filters: {
  start_date?: string;
  end_date?: string;
}) {
  const api = useApi();

  return useQuery({
    queryKey: ["doctorStats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const queryString = params.toString() ? `?${params.toString()}` : "";

      const res = await api.get<ApiEnvelope>(`/doctor/stats/${queryString}`);
      return unwrapApiResponse(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
  });
}

export function useDoctorPrescriptions(filters: DoctorPrescriptionFilters) {
  const api = useApi();

  return useQuery({
    queryKey: ["doctorPrescriptions", filters],
    queryFn: async () => {
      const queryString = buildQueryString(filters);
      const res = await api.get<ApiEnvelope>(`/prescriptions/records/${queryString}`);
      return unwrapApiResponse(res);
    },
    enabled: api.isAuthenticated && !api.isLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateDoctorPrescription() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDoctorPrescriptionPayload) => {
      return await api.post("/prescriptions/records/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorPrescriptions"] });
      queryClient.invalidateQueries({ queryKey: ["patientPrescriptions"] });
    },
  });
}

export function useCreateDoctorLabRequest() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDoctorLabRequestPayload) => {
      return await api.post("/doctor/lab-requests/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorLabRequests"] });
      queryClient.invalidateQueries({ queryKey: ["doctorPendingLabs"] });
    },
  });
}

export function useRequestDoctorLabRepeat() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      labRequestId,
      notes,
    }: {
      labRequestId: string;
      notes?: string;
    }) => {
      return await api.post(`/doctor/lab-requests/${labRequestId}/repeat/`, {
        notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorLabRequests"] });
      queryClient.invalidateQueries({ queryKey: ["doctorPendingLabs"] });
    },
  });
}
