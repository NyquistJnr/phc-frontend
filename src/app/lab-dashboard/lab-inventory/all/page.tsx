import { Suspense } from "react";
import AllInventoryItems from "@/src/components/lab-dashboard/lab-inventory/AllInventoryItems";

export default function LabInventoryAllPage() {
  return (
    <Suspense fallback={null}>
      <AllInventoryItems />
    </Suspense>
  );
}
