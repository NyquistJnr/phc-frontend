export interface LabTest {
  id: string;
  test_name: string;
  sample_type: string | null;
  test_status: string;
  result_value: string | null;
  result_unit: string | null;
  test_method: string | null;
  result_interpretation: string | null;
  result_notes: string | null;
  result_date: string | null;
}

export interface LabRequest {
  id: string;
  request_id: string;
  patient: string;
  patient_name: string;
  patient_display_id: string;
  appointment: string;
  recorded_by: string;
  requested_by: string;
  requested_by_name: string;
  priority: string;
  clinical_notes: string;
  status: string;
  created_at: string;
  tests: LabTest[];
}

export interface LabStats {
  pending_lab_requests: number;
  in_progress: number;
  completed: number;
  inventory_alert_count: number;
  inventory_alerts: any[];
}

export interface PaginatedLabRequests {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: LabRequest[];
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  errors: any;
}

export interface LabFilters {
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
}


export interface AdvancedLabRequestFilters {
  page?: number;
  page_size?: number;
  appointment_ID?: string;
  patient_id?: string;
  priority?: "NORMAL" | "URGENT" | string;
  search?: string;
  start_date?: string;
  end_date?: string;
  status?: "PENDING" | "PARTIAL" | "COMPLETED" | "CANCELLED" | string;
}

export interface LabTestFilters {
  page?: number;
  page_size?: number;
  lab_request_id?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
  test_status?: "PENDING" | "SAMPLE_COLLECTED" | "PROCESSING" | "RESULT_READY" | string;
}

export interface StatsFilters {
  start_date?: string;
  end_date?: string;
}

export interface LabTestPayload {
  test_name: string;
  sample_type: string;
}

export interface CreateLabRequestPayload {
  appointment: string;
  requested_by: string;
  priority: string;
  clinical_notes: string;
  tests: LabTestPayload[];
}

export interface UpdateLabRequestPayload {
  patient: string;
  appointment: string;
  recorded_by: string;
  requested_by: string;
  priority: string;
  clinical_notes: string;
  status: string;
}

export interface SubmitTestResultPayload {
  result_value: string;
  result_unit: string;
  test_method: string;
  result_interpretation: string;
  result_notes: string;
}