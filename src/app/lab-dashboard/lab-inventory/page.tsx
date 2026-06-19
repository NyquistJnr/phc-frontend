import { Suspense } from "react";
import Inventory from "@/src/components/lab-dashboard/lab-inventory/Inventory";

export default function LabInventoryPage() {
  return (
    <Suspense fallback={null}>
      <Inventory />
    </Suspense>
  );
}
