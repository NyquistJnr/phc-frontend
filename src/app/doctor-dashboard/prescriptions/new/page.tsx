import { Suspense } from "react";
import CreatePrescription from "@/src/components/doctorDashboard/prescriptions/CreatePrescription";

export default function NewPrescriptionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePrescription />
    </Suspense>
  );
}
