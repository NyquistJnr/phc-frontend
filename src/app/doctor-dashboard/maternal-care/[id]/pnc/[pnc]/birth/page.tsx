"use client";

import { Suspense } from "react";
import Birth from "@/src/components/doctorDashboard/maternalCare/Birth";

export default function BirthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Birth />
    </Suspense>
  );
}
