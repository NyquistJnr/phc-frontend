import React, { Suspense } from "react";
import DeliveryVisitsPage from "@/src/components/chewDashboard/maternal-care/DeliveryVisitsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeliveryVisitsPage />
    </Suspense>
  );
}
