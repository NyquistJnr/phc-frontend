"use client";

import { Suspense } from "react";
import Prescriptions from "@/src/components/pharmacist-dashboard/prescriptions/Prescriptions";

export default function PharmacistPrescriptionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Prescriptions />
    </Suspense>
  );
}
