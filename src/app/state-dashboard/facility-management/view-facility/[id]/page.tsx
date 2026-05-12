"use client";

import { Suspense } from "react";
import FacilityDetail from "@/src/components/stateDashboard/facility-management/FacilityDetail";

export default function FacilityDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FacilityDetail />
    </Suspense>
  );
}
