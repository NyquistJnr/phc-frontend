// import ViewFacility from "@/src/components/stateDashboard/facility-management/ViewFacility";

// export default function ViewFacilityPage() {
//   return <ViewFacility />;
// }

import type { ComponentType } from "react";
import ViewFacility from "@/src/components/stateDashboard/facility-management/ViewFacility";

const ViewFacilityComponent = ViewFacility as ComponentType<{
  initialPage: number;
  initialSearch: string;
  initialStatus: string;
  initialLevel: string;
}>;

export default async function ViewFacilityPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; level?: string }>;
}) {
  const params = await searchParams;

  return (
    <ViewFacilityComponent
      initialPage={Number(params.page) || 1}
      initialSearch={params.search || ""}
      initialStatus={params.status || "All"}
      initialLevel={params.level || "All"}
    />
  );
}


