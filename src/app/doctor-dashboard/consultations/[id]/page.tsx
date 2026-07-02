import { Suspense } from "react";
import ConsultationWorkspace from "@/src/components/doctorDashboard/consultations/ConsultationWorkspace";

export default function ConsultationDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConsultationWorkspace />
    </Suspense>
  );
}
