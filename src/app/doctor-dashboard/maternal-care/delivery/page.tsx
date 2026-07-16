import React, { Suspense } from "react";
import DeliveryVisitsPage from "@/src/components/doctorDashboard/maternalCare/DeliveryVisitsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeliveryVisitsPage />
    </Suspense>
  );
}
