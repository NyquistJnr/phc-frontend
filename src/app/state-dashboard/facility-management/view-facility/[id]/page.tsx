import FacilityDetail from "@/src/components/stateDashboard/facility-management/FacilityDetail";

export default function FacilityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <FacilityDetail facilityId={params.id} />;
}
