import { Suspense } from "react";
import Patients from "@/src/components/chewDashboard/patients/Patients";

export default function ChewPatientsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Patients />
    </Suspense>
  );
}
