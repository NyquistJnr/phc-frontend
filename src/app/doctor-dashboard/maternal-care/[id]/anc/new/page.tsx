"use client";

import { Suspense } from "react";
import CreateAncVisit from "@/src/components/doctorDashboard/maternalCare/AncVisitForm";

export default function CreateAncVisitPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAncVisit />
    </Suspense>
  );
}
