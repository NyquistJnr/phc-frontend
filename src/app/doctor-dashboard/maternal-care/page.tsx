import { Suspense } from "react";
import MaternalCareEpisodes from "@/src/components/doctorDashboard/maternalCare/MaternalCareEpisodes";

export default function MaternalCarePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MaternalCareEpisodes />
    </Suspense>
  );
}
