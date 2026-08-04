"use client";

import { useState } from "react";
import {
  BarChart3,
  LayoutDashboard,
  ClipboardList,
  HeartPulse,
  Baby,
  Users2,
  Bug,
  ArrowRightLeft,
  ShieldAlert,
  CalendarRange,
} from "lucide-react";
import OfficerDashboardHeader from "@/src/components/officerDashboard/generics/OfficerDashboardHeader";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";

import OverviewTab from "./tabs/OverviewTab";
import FacilitySummaryTab from "./tabs/FacilitySummaryTab";
import MaternalHealthTab from "./tabs/MaternalHealthTab";
import ChildHealthTab from "./tabs/ChildHealthTab";
import FamilyPlanningTab from "./tabs/FamilyPlanningTab";
import DiseaseSurveillanceTab from "./tabs/DiseaseSurveillanceTab";
import ReferralsTab from "./tabs/ReferralsTab";
import AdverseEventsTab from "./tabs/AdverseEventsTab";
import MonthlyNhmisSummaryTab from "./tabs/MonthlyNhmisSummaryTab";

function formatToYYYYMMDD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);
  return { start: formatToYYYYMMDD(start), end: formatToYYYYMMDD(end) };
}

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, Component: OverviewTab },
  { id: "facility-summary", label: "Facility Summary", icon: ClipboardList, Component: FacilitySummaryTab },
  { id: "maternal-health", label: "Maternal Health", icon: HeartPulse, Component: MaternalHealthTab },
  { id: "child-health", label: "Child Health", icon: Baby, Component: ChildHealthTab },
  { id: "family-planning", label: "Family Planning", icon: Users2, Component: FamilyPlanningTab },
  { id: "disease-surveillance", label: "Disease Surveillance", icon: Bug, Component: DiseaseSurveillanceTab },
  { id: "referrals", label: "Referrals", icon: ArrowRightLeft, Component: ReferralsTab },
  { id: "adverse-events", label: "Adverse Events", icon: ShieldAlert, Component: AdverseEventsTab },
  { id: "monthly-nhmis-summary", label: "Monthly NHMIS Summary", icon: CalendarRange, Component: MonthlyNhmisSummaryTab },
] as const;

export default function OICReports() {
  const [range, setRange] = useState(defaultRange);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>(TABS[0].id);

  const breadcrumbs = [{ label: "Reports" }, { label: "Facility Reports" }];
  const active = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const ActiveComponent = active.Component;
  const isMonthlySummary = active.id === "monthly-nhmis-summary";

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] min-w-0 overflow-hidden">
      <OfficerDashboardHeader title="Reports" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Hero / period selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[20px] shadow-sm border border-gray-100 print:hidden">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#E8F7F0] flex items-center justify-center shrink-0">
                <BarChart3 size={16} className="text-[#046C3F]" />
              </div>
              <p className="text-sm font-bold text-[#046C3F] uppercase tracking-wider">Facility Health Reporting</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{active.label}</h1>
            <p className="text-gray-500 mt-2 text-sm">
              {isMonthlySummary ? "Official monthly aggregate — pick a month within the report below" : `${getPeriodLabel(range.start, range.end)} · This facility only`}
            </p>
          </div>
          {!isMonthlySummary && (
            <div className="shrink-0 self-start sm:self-auto">
              <DateRangeFilter
                startDate={range.start}
                endDate={range.end}
                label="Select Date Range"
                onApply={(start, end) => setRange({ start, end })}
                onClear={() => setRange(defaultRange())}
              />
            </div>
          )}
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 print:hidden">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-[#046C3F] text-white shadow-md shadow-emerald-900/10"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={16} className={isActive ? "text-white" : "text-gray-400"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active report */}
        <ActiveComponent startDate={range.start} endDate={range.end} />
      </div>
    </div>
  );
}
