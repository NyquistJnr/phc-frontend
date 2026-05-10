"use client";

import { Suspense } from "react";
import PncDetail from "@/src/components/doctorDashboard/maternalCare/PncDetail";

export default function PncDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PncDetail />
    </Suspense>
  );
}
