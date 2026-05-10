export type CreateDoctorLabRequestPayload = {
  patient: string;
  appointment?: string;
  requested_by?: string;
  sample_type?: string;
  test_type: string;
  priority: string;
  clinical_notes?: string;
};

export type DoctorMaternalVisitFilters = {
  episode_id?: string;
  page?: number;
  page_size?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  attendance_type?: string;
  outcome?: string;
};

export type ApiEnvelope<T = unknown> = {
  data?: T | { data?: T };
};
