import { Suspense } from "react";
import Laboratory from "@/src/components/doctorDashboard/laboratory/Laboratory";

export default function LaboratoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Laboratory />
    </Suspense>
  );
}
