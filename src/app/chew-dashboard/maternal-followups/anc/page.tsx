import AncVisits from "@/src/components/chewDashboard/maternal-care/AncVisitsPage";
import { Suspense } from "react";

export default function AncVisitsPage() {
  return (
    <Suspense fallback={null}>
      <AncVisits />
    </Suspense>
  );
}
