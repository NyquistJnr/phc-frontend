import { Suspense } from "react";
import Prescriptions from "@/src/components/doctorDashboard/prescriptions/Prescriptions";

export default function PrescriptionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Prescriptions />
    </Suspense>
  );
}
