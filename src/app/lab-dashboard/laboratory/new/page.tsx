import { Suspense } from "react";
import NewLabResult from "@/src/components/lab-dashboard/laboratory/EnterResultNew";

export default function NewLabResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewLabResult />
    </Suspense>
  );
}
