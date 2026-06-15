import { Suspense } from "react";
import AncVisits from "@/src/components/doctorDashboard/maternalCare/AncVisitsPage";

export default function AncVisitsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AncVisits />
    </Suspense>
  );
}
