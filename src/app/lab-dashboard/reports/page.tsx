"use client";

import ComprehensiveReportsView from "@/src/components/generic/reports/ComprehensiveReportsView";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";

export default function LabReportsPage() {
  const breadcrumbs = [
    { label: "Reports", active: true },
  ];

  return (
    <ComprehensiveReportsView
      HeaderComponent={<LabDashboardHeader title="Reports" breadcrumbs={breadcrumbs} />}
    />
  );
}
