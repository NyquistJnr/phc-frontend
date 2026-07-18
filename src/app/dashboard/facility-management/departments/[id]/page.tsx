import DepartmentDetails from "@/src/components/adminDashboard/facility-management/departments/DepartmentDetails";

export default async function DepartmentDetailsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  return <DepartmentDetails departmentId={resolvedParams.id} />;
}
