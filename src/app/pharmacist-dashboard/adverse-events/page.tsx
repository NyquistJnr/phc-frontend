"use client";

import { Suspense } from "react";
import AdverseEvents from "@/src/components/pharmacist-dashboard/adverse-events/AdverseEvents";

export default function PharmacistAdverseEventsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdverseEvents />
    </Suspense>
  );
}
