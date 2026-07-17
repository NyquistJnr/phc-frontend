export interface AppointmentResult {
  id: string;
  appointment_id: string;
  patient: string;
  patient_name: string;
  patient_display_id: string;
  assigned_to: string;
  assigned_staff_name: string;
  assigned_for_vitals?: string | null;
  assigned_for_vitals_name?: string | null;
  appointment_date: string;
  appointment_time: string;
  visit_type: string;
  status: string;
  priority: string;
  reason_for_visit: string;
  notes: string | null;
  created_by: string;
  created_by_name: string;
  created_at: string;
}

export interface AppointmentsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: AppointmentResult[];
}

export interface AppointmentFilters {
  page?: number;
  page_size?: number;
  status?: string;
  visit_type?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}
