"use client";

import { Suspense } from "react";
import DrugStockListing from "@/src/components/pharmacist-dashboard/inventory/DrugStockListing";

export default function PharmacistInventoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DrugStockListing />
    </Suspense>
  );
}
