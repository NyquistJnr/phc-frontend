"use client";

import { Suspense } from "react";
import ExpiringTracking from "@/src/components/pharmacist-dashboard/inventory/ExpiringTracking";

export default function ExpiringTrackingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExpiringTracking />
    </Suspense>
  );
}
