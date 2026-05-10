"use client";

import { Suspense } from "react";
import AncDetail from "@/src/components/nurse-dashboard/maternal-care/AncDetail";

export default function AncDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AncDetail />
    </Suspense>
  );
}
