"use client";

import { Suspense } from "react";
import MaternalCareEpisodeDetails from "@/src/components/doctorDashboard/maternalCare/MaternalCare";

export default function MaternalCarePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MaternalCareEpisodeDetails />
    </Suspense>
  );
}
