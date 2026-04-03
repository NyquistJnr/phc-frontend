"use client";

import Header from "@/src/components/adminDashboard/generics/header";
import {
  BarChartSkeleton,
  DonutSkeleton,
  FacilityComplianceRows,
  PeriodDropdown,
} from "@/src/components/stateDashboard/generics/ChartSkeletons";

// 12 monthly bars — varying heights for skeleton visual interest
const YEAR_BAR_HEIGHTS = [55, 70, 45, 80, 60, 75, 50, 85, 65, 70, 55, 80];
const YEAR_BAR_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function FacilityPerformance() {
  const breadcrumbs = [
    { label: "Facility Management" },
    { label: "Performance", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0 overflow-hidden">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 space-y-6 sm:space-y-8">

        {/* Page heading */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Facility Performance</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Patient volume and compliance metrics</p>
        </div>

        {/* Patient Volume Trend — full width */}
        <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-4xl shadow-sm border border-gray-100 flex flex-col min-h-80">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-base font-bold text-[#101928]">Patient Volume Trend</h3>
            <PeriodDropdown label="This Year" />
          </div>
          <BarChartSkeleton bars={YEAR_BAR_HEIGHTS} labels={YEAR_BAR_LABELS} />
        </div>

        {/* Reporting Compliance + Facilities Compliant */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

          {/* Reporting Compliance */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-4xl shadow-sm border border-gray-100 flex flex-col min-h-80">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base font-bold text-[#101928]">Reporting Compliance</h3>
              <PeriodDropdown label="This Week" />
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#046C3F]" />
                <span className="text-[11px] text-gray-500 font-medium">Compliance Rate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1AC073]" />
                <span className="text-[11px] text-gray-500 font-medium">Submitted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFD66B]" />
                <span className="text-[11px] text-gray-500 font-medium">Pending</span>
              </div>
            </div>
            <DonutSkeleton />
          </div>

          {/* Facilities Compliant ≥80% */}
          <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-4xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-base font-bold text-[#101928]">Facilities compliant (≥80%)</h3>
              <PeriodDropdown label="This Week" />
            </div>
            <FacilityComplianceRows />
          </div>
        </div>

      </div>
    </div>
  );
}
