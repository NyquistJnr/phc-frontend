"use client";

import { Building2, Building, Users, Calendar } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import MetricCard from "@/src/components/adminDashboard/generics/MetricCard";
import {
  BarChartSkeleton,
  DonutSkeleton,
  FacilityComplianceRows,
  PeriodDropdown,
} from "@/src/components/stateDashboard/generics/ChartSkeletons";
import { useSession } from "next-auth/react";

const WEEK_BAR_HEIGHTS = [72, 55, 88, 40, 78, 60, 48];
const WEEK_BAR_LABELS = ["Sept 10", "Sept 11", "Sept 12", "Sept 13", "Sept 14", "Sept 15", "Sept 16"];

interface ActiveAlertItemProps {
  title: string;
  facility: string;
  time: string;
  borderColor: string;
  bgColor: string;
  titleColor: string;
}

function ActiveAlertItem({ title, facility, time, borderColor, bgColor, titleColor }: ActiveAlertItemProps) {
  return (
    <div className={`p-3 sm:p-4 rounded-xl border-l-4 ${borderColor} ${bgColor}`}>
      <div className="flex justify-between items-start gap-2">
        <p className={`text-sm font-bold ${titleColor} leading-snug`}>{title}</p>
        <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap shrink-0">{time}</span>
      </div>
      <p className="text-xs text-gray-500 font-medium mt-0.5">{facility}</p>
    </div>
  );
}

export default function StateDashboardHome() {
  const breadcrumbs = [{ label: "", active: true }];
  const { data: session } = useSession();
  const firstName = session?.user?.first_name || "User";

  const alerts: ActiveAlertItemProps[] = [];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0 overflow-hidden">
      <Header title="Dashboard" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 space-y-6 sm:space-y-8">

        {/* Welcome Row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium font-inter text-gray-900 tracking-tight">
              Welcome {firstName}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
              Here is your State-wide overview for today
            </p>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                Today&apos;s Date
              </p>
              <p className="text-sm font-bold text-gray-800">
                {new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <MetricCard icon={Building2} title="Total Facilities" value="0" colorClass="bg-[#046C3F]" />
          <MetricCard icon={Building} title="Active Facilities" value="0" colorClass="bg-white border border-gray-100" />
          <MetricCard icon={Users} title="Total Registered Patients" value="0" colorClass="bg-white border border-gray-100" />
        </div>

        {/* Patient Volume Trend + Active Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-4xl shadow-sm border border-gray-100 flex flex-col min-h-80">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-[#101928]">Patient Volume Trend</h3>
              <PeriodDropdown label="This Week" />
            </div>
            <BarChartSkeleton bars={WEEK_BAR_HEIGHTS} labels={WEEK_BAR_LABELS} />
          </div>

          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-4xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-[#101928]">Active Alerts</h3>
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${alerts.length > 0 ? "bg-red-100 text-red-600" : "bg-red-50 text-red-400"}`}>
                {alerts.length} Active
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium mb-5">Facility and operational warnings</p>
            <div className="space-y-3 flex-1">
              {alerts.length > 0 ? (
                alerts.map((alert, i) => <ActiveAlertItem key={i} {...alert} />)
              ) : (
                <div className="flex-1 flex items-center justify-center py-10">
                  <p className="text-sm text-gray-300 font-medium text-center">No active alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reporting Compliance + Facilities Compliant */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-4xl shadow-sm border border-gray-100 flex flex-col min-h-80">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-[#101928]">Reporting Compliance</h3>
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

          <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-4xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-[#101928]">Facilities compliant (≥80%)</h3>
              <PeriodDropdown label="This Week" />
            </div>
            <FacilityComplianceRows />
          </div>
        </div>

      </div>
    </div>
  );
}
