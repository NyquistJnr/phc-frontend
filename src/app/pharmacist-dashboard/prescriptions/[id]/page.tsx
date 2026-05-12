"use client";

import { Suspense } from "react";
import PharmacistPrescriptionsDetail from "@/src/components/pharmacist-dashboard/prescriptions/PrescriptionsDetail";

export default function PharmacistPrescriptionsDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PharmacistPrescriptionsDetail />
    </Suspense>
  );
}
