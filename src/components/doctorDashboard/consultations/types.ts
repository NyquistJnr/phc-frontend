export type MyAppointment = {
  id: string;
  appointment_id?: string;
  patient?: string;
  patient_name?: string;
  patient_display_id?: string;
  appointment_date?: string;
  appointment_time?: string;
  visit_type?: string;
  status?: string;
  priority?: string;
  reason_for_visit?: string;
  notes?: string | null;
};

export type ConsultationRecord = {
  id: string;
  appointment: string;
  appointment_id?: string;
  patient_name?: string;
  patient_display_id?: string;
  chief_complaint?: string;
  presenting_complaint?: string;
  history_of_present_complaint?: string;
  past_medical_history?: string;
  examination_findings?: string;
  primary_diagnosis?: string;
  secondary_diagnosis?: string;
  treatment_plan?: string;
  additional_notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type PaginatedResponse<T> = {
  count?: number;
  total_pages?: number;
  current_page?: number;
  results?: T[];
};
