import PncVisits from "@/src/components/doctorDashboard/maternalCare/PncVisitsPage";
import { Suspense } from "react";

export default function PncVisitsPage() {
  return (
    <Suspense fallback={null}>
      <PncVisits />
    </Suspense>
  );
}
