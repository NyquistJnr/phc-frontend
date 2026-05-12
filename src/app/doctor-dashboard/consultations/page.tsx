import { Suspense } from "react";
import Consultation from "@/src/components/doctorDashboard/consultations/Consultation";

export default function ConsultationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Consultation />
    </Suspense>
  );
}
