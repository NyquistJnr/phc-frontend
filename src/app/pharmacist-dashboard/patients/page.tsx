import { Suspense } from "react";
import PharmacistPatients from "@/src/components/pharmacist-dashboard/patients/Patients";

export default function PharmacistPatientsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PharmacistPatients />
    </Suspense>
  );
}
