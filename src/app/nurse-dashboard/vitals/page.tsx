import { Suspense } from "react";
import Vitals from "@/src/components/nurse-dashboard/vitals/Vitals";

export default function VitalsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Vitals />
    </Suspense>
  );
}
