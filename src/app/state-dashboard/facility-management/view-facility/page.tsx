"use client";
import { Suspense } from "react";
import ViewFacility from "@/src/components/stateDashboard/facility-management/ViewFacility";

export default function ViewFacilityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewFacility />
    </Suspense>
  );
}


