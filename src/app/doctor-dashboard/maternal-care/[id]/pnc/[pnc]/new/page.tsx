"use client";

import { Suspense } from "react";
import PncNewBornAssessment from "@/src/components/doctorDashboard/maternalCare/PncNewBornAssessment";

export default function PncNewBornAssessmentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PncNewBornAssessment />
    </Suspense>
  );
}
