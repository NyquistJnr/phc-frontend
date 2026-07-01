export interface InventoryFilters {
  page?: number;
  page_size?: number;
  name?: string;
  description?: string;
  drug_classification?: "NORMAL" | "IMMUNIZATION" | string;
  inventory_category?: "DRUG" | "LAB_EQUIPMENT" | "CONSUMABLE" | string;
  status?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | string;
  search?: string;
  start_date?: string;
  end_date?: string;
}

export interface ExpiringFilters {
  page?: number;
  page_size?: number;
  drug_classification?: string;
  inventory_category?: string;
}

export interface InventoryStatsFilters {
  drug_classification?: string;
  inventory_category?: string;
  start_date?: string;
  end_date?: string;
  expiry_days?: number;
}

export interface InventoryItem {
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
  active_batches?: ActiveInventoryBatch[];
}

export interface ActiveInventoryBatch {
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

export interface PaginatedInventoryItems {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: InventoryItem[];
}

export interface CreateInventoryItemPayload {
  name: string;
  inventory_category: string;
  drug_classification?: string | null;
  item_type: string;
  threshold_type: string;
  global_threshold: number;
  schedule_rules?: null;
}

export interface RefillItemPayload {
  batch_number: string;
  initial_quantity: number;
  purchased_date: string;
  expiry_date?: string;
  supplier: string;
  cost_price: string;
  note?: string;
}

export interface ExpiringItem {
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

export interface PaginatedExpiringItems {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: ExpiringItem[];
}

export interface ComprehensiveStats {
  total_items: number;
  low_stock_items: number;
  out_of_stock_items: number;
  expiring_soon_items: number;
}

export interface ExpiryStats {
  expiring_30_days: number;
  expiring_60_days: number;
  expiring_90_days: number;
  total_tracked_batches: number;
}
