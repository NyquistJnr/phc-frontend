export interface PharmacyDashboardStats {
  pending_prescriptions: number;
  dispensed: number;
  low_stock_alerts: number;
  adr_reports: number;
}

export type PharmacyActivityType =
  | "DISPENSE"
  | "REFILL"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "ADR_REPORT";

export interface PharmacyActivity {
  activity_type: PharmacyActivityType;
  item_name: string;
  description: string;
  timestamp: string;
}

export interface PharmacyActivitiesResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: PharmacyActivity[];
}

export interface PharmacyPieChartStats {
  dispensed: number;
  refilled: number;
  out_of_stock: number;
}

export interface PharmacyDashboardDateFilters {
  start_date?: string;
  end_date?: string;
}

export interface PharmacyActivitiesFilters {
  page?: number;
  page_size?: number;
}
