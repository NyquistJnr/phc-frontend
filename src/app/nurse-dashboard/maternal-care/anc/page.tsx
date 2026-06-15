import { Suspense } from "react";
import AncVisits from "@/src/components/nurse-dashboard/maternal-care/AncVisitsPage";

export default function AncVisitsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AncVisits />
    </Suspense>
  );
}
