import { Suspense } from "react";
import Immunization from "@/src/components/nurse-dashboard/immunization/Immunization";

export default function ImmunizationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Immunization />
    </Suspense>
  );
}
