import { Suspense } from "react";
import PatientList from "@/src/components/doctorDashboard/patients/PatientList";

export default function PatientsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientList />
    </Suspense>
  );
}
