"use client";

import { Suspense } from "react";
import FacilityUsersDetail from "@/src/components/stateDashboard/facility-management/FacilityInformation";

export default function FacilityUsersDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FacilityUsersDetail />
    </Suspense>
  );
}
