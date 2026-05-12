export interface PrescriptionItem {
  id: string;
  drug: string;
  custom_drug_name: string | null;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PrescriptionOrder {
  id: string;
  prescription_id: string;
  patient: string;
  patient_name: string;
  patient_display_id: string;
  appointment: string;
  prescribed_by: string;
  prescribed_by_name: string;
  priority: string;
  instructions: string;
  status: "PENDING" | "PARTIAL" | "DISPENSED" | "CANCELLED";
  created_at: string;
  items: PrescriptionItem[];
}

export interface PrescriptionOrdersResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: PrescriptionOrder[];
}

export interface PrescriptionFilters {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}
