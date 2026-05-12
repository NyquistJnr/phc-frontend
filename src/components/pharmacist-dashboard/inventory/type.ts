export interface InventoryStatsResponse {
  total_drugs: number;
  low_stock_items: number;
  out_of_stock: number;
  expiring_soon: number;
}

export interface DrugStockItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  global_threshold: number;
  total_stock: number;
  status: string;
  active_batches_count: number;
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
}

export interface ExpiryAnalysisStatsResponse {
  expiring_30_days: number;
  expiring_60_days: number;
  expiring_90_days: number;
  total_tracked_batches: number;
}

export interface ExpiringDrugItem {
  id: string;
  drug_name: string;
  category: string;
  batch_number: string;
  unit: string;
  remaining_quantity: number;
  expiry_date: string;
  days_left: number;
  supplier: string;
}

export interface ExpiringFilters {
  page?: number;
  page_size?: number;
  search?: string;
  unit?: string;
  start_date?: string;
  end_date?: string;
}

export interface ActiveBatch {
  id: string;
  batch_number: string;
  initial_quantity: number;
  remaining_quantity: number;
  purchased_date: string;
  expiry_date: string;
  supplier: string;
  cost_price: string;
  note: string;
  created_at: string;
}

export interface DrugDetail {
  id: string;
  name: string;
  category: string;
  unit: string;
  global_threshold: number;
  total_stock: number;
  status: string;
  active_batches_count: number;
  active_batches: ActiveBatch[];
}

export interface RefillPayload {
  batch_number: string;
  initial_quantity: number;
  purchased_date: string;
  expiry_date: string;
  supplier: string;
  cost_price: string;
  note: string;
}

export interface CreateDrugPayload {
  name: string;
  category: string;
  unit: string;
  global_threshold: number;
}
