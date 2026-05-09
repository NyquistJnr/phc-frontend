import { Suspense } from "react";
import EditFacilityDetails from "@/src/components/adminDashboard/facility-management/EditFacilityDetails";

export default function EditFacilityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditFacilityDetails />
    </Suspense>
  );
}
