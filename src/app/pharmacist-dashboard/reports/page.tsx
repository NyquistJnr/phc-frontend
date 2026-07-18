"use client";

import ComprehensiveReportsView from "@/src/components/generic/reports/ComprehensiveReportsView";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";

export default function PharmacistReportsPage() {
  const breadcrumbs = [
    { label: "Reports", active: true },
  ];

  return (
    <ComprehensiveReportsView
      HeaderComponent={<PharmacistDashboardHeader title="Reports" breadcrumbs={breadcrumbs} />}
    />
  );
}
