"use client";

import { Suspense } from "react";
import PncVisitForm from "@/src/components/chewDashboard/maternal-care/PncVisitForm";

export default function PncVisitFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PncVisitForm />
    </Suspense>
  );
}
