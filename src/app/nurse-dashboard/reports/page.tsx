"use client";

import ComprehensiveReportsView from "@/src/components/generic/reports/ComprehensiveReportsView";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";

export default function NurseReportsPage() {
  const breadcrumbs = [
    { label: "Reports", active: true },
  ];

  return (
    <ComprehensiveReportsView
      HeaderComponent={<NurseDashboardHeader title="Reports" breadcrumbs={breadcrumbs} />}
    />
  );
}
