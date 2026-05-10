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
