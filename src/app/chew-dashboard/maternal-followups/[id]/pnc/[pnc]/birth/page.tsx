"use client";

import { Suspense } from "react";
import Birth from "@/src/components/chewDashboard/maternal-care/Birth";

export default function MaternalCarePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Birth />
    </Suspense>
  );
}
