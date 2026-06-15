import AncVisits from "@/src/components/doctorDashboard/maternalCare/AncVisitsPage";
import { Suspense } from "react";

export default function AncVisitsPage() {
  return (
    <Suspense fallback={null}>
      <AncVisits />
    </Suspense>
  );
}
