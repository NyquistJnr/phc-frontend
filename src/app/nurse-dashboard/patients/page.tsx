"use client";

import { Suspense } from "react";
import Patients from "@/src/components/nurse-dashboard/patients/Patients";

export default function PatientsPage() {
  return (
    <Suspense fallback={<>Loading...</>}>
      <Patients />
    </Suspense>
  );
}
