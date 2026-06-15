import PncVisits from "@/src/components/chewDashboard/maternal-care/PncVisitsPage";
import { Suspense } from "react";

export default function PncVisitsPage() {
  return (
    <Suspense fallback={null}>
      <PncVisits />
    </Suspense>
  );
}
