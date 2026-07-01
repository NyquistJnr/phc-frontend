export interface InventoryStatsResponse {
  total_items: number;
  low_stock_items: number;
  out_of_stock_items: number;
  expiring_soon_items: number;
}

export interface ActiveBatch {
  id?: string;
  batch_number?: string;
  initial_quantity?: number;
  remaining_quantity?: number;
  purchased_date?: string;
  expiry_date?: string;
  supplier?: string;
  cost_price?: string;
  note?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DrugStockItem {
  id: string;
  name: string;
  inventory_category: string;
  drug_classification: string;
  item_type: string;
  threshold_type: string;
  global_threshold: number;
  schedule_rules: string;
  total_stock: number;
  status: string;
  active_batches?: ActiveBatch[];
}

export interface InventoryDrugsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: DrugStockItem[];
}

export interface InventoryFilters {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  inventory_category?: string;
  drug_classification?: string;
}

export interface ExpiryAnalysisStatsResponse {
  expiring_30_days: number;
  expiring_60_days: number;
  expiring_90_days: number;
  total_tracked_batches: number;
}

export interface ExpiringDrugItem {
  id: string;
  item_name: string;
  category: string;
  batch_number: string;
  item_type: string;
  remaining_quantity: number;
  expiry_date: string;
  days_left: number;
  supplier: string;
}

export interface ExpiringFilters {
  page?: number;
  page_size?: number;
  search?: string;
  item_type?: string;
  inventory_category?: string;
  drug_classification?: string;
  start_date?: string;
  end_date?: string;
}

export type DrugDetail = DrugStockItem;

export interface RefillPayload {
  batch_number: string;
  initial_quantity: number;
  purchased_date: string;
  expiry_date?: string;
  supplier: string;
  cost_price: string;
  note?: string;
}

export type ScheduleRules =
  | { type: "ONCE" }
  | { type: "RECURRING"; interval_days: number }
  | { type: "VARIABLE_SEQUENCE"; intervals_in_days: number[] };

export interface CreateDrugPayload {
  name: string;
  inventory_category: string;
  drug_classification?: string | null;
  item_type: string;
  threshold_type: string;
  global_threshold: number;
  schedule_rules?: ScheduleRules | null;
}

export interface DispensePayload {
  quantity: number;
  patient_id?: string;
  previous_doses_count?: number;
  note?: string;
}
