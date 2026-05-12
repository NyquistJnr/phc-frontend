"use client";

import { Suspense } from "react";
import DrugDetail from "@/src/components/pharmacist-dashboard/inventory/DrugDetail";

export default function PharmacistInventoryDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DrugDetail />
    </Suspense>
  );
}
