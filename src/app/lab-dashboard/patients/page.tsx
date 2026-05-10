import { Suspense } from "react";
import Patients from "@/src/components/lab-dashboard/patients/Patients";

export default function LabPatientsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Patients />
    </Suspense>
  );
}
