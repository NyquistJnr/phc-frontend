"use client";

import { Suspense } from "react";
import CreateAncVisit from "@/src/components/chewDashboard/maternal-care/AncVisitForm";

export default function MaternalCarePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAncVisit />
    </Suspense>
  );
}
