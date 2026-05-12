"use client";

import { Suspense } from "react";
import PncDetail from "@/src/components/chewDashboard/maternal-care/PncDetail";

export default function PncDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PncDetail />
    </Suspense>
  );
}
