"use client";

import ComprehensiveReportsView from "@/src/components/generic/reports/ComprehensiveReportsView";
import ChewDashboardHeader from "@/src/components/chewDashboard/generics/ChewDashboardHeader";

export default function ChewReportsPage() {
  const breadcrumbs = [
    { label: "Reports", active: true },
  ];

  return (
    <ComprehensiveReportsView
      HeaderComponent={<ChewDashboardHeader title="Reports" breadcrumbs={breadcrumbs} />}
    />
  );
}
