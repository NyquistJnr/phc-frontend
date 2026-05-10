"use client";

import { Suspense } from "react";
import LabHome from "@/src/components/lab-dashboard/home/LabHome";

export default function LabDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LabHome />
    </Suspense>
  );
}
