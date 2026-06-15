import { Suspense } from "react";
import PncVisits from "@/src/components/doctorDashboard/maternalCare/PncVisitsPage";

export default function PncVisitsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PncVisits />
    </Suspense>
  );
}
