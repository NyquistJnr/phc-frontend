"use client";

import { Suspense } from "react";
import PncNewBornAssessment from "@/src/components/chewDashboard/maternal-care/PncNewBornAssessment";

export default function PncDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PncNewBornAssessment />
    </Suspense>
  );
}
