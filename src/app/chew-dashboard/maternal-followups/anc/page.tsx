import AncVisits from "@/src/components/chewDashboard/maternal-care/AncVisitsPage";
import { Suspense } from "react";

export default function AncVisitsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AncVisits />
    </Suspense>
  );
}
