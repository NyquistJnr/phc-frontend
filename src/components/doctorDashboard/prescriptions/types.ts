export type PrescriptionItem = {
  id?: string;
  drug?: string;
  drug_name?: string;
  medication_name?: string;
  custom_drug_name?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
};

export type PrescriptionRecord = {
  id: string;
  prescription_id?: string;
  patient?: string;
  patient_id?: string;
  patient_name?: string;
  patient_display_id?: string;
  appointment?: string;
  appointment_id?: string;
  prescribed_by_name?: string;
  priority?: string;
  instructions?: string;
  status?: string;
  created_at?: string;
  items?: PrescriptionItem[];
};

export type PaginatedResponse<T> = {
  count?: number;
  total_pages?: number;
  current_page?: number;
  results?: T[];
};
