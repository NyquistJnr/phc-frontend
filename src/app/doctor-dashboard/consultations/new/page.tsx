import { Suspense } from "react";
import CreateNote from "@/src/components/doctorDashboard/consultations/CreateNote";

export default function NewConsultationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateNote />
    </Suspense>
  );
}
