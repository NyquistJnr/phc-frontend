"use client";

import { Suspense } from "react";
import CreateAncVisit from "@/src/components/nurse-dashboard/maternal-care/AncVisitForm";

export default function MaternalCarePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAncVisit />
    </Suspense>
  );
}
