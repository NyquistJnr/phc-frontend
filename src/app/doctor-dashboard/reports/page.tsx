"use client";

import ComprehensiveReportsView from "@/src/components/generic/reports/ComprehensiveReportsView";
import Header from "@/src/components/doctorDashboard/generics/Header";

export default function DoctorReportsPage() {
  const breadcrumbs = [
    { label: "Reports", active: true },
  ];

  return (
    <ComprehensiveReportsView
      HeaderComponent={<Header title="Reports" breadcrumbs={breadcrumbs} />}
    />
  );
}
