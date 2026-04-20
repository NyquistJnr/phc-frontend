"use client";

import Link from "next/link";
import { ArrowRight, Users, Building2, LogIn, UserCheck, ChevronDown } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";

// ── Dummy data ────────────────────────────────────────────────────────────────


const MONTHLY_BARS = [
  { month: "January", active: 52, total: 72 },
  { month: "February", active: 65, total: 80 },
  { month: "March", active: 60, total: 78 },
  { month: "April", active: 42, total: 60 },
  { month: "May", active: 78, total: 88 },
  { month: "June", active: 35, total: 50 },
  { month: "July", active: 72, total: 82 },
  { month: "August", active: 88, total: 92 },
  { month: "September", active: 55, total: 70 },
  { month: "October", active: 62, total: 75 },
  { month: "November", active: 50, total: 65 },
  { month: "December", active: 80, total: 90 },
];

const Y_LABELS = [500, 400, 300, 200, 100, 0];

const MODULE_DATA = [
  { label: "Patient Records", color: "#046C3F", pct: 45 },
  { label: "Patient Registry", color: "#1AC073", pct: 35 },
  { label: "Pharmacy", color: "#FFD66B", pct: 20 },
];

const TOP_FACILITIES = [
  "PHC Ikeja",
  "Oregun PHC",
  "PHC Surulere",
  "Aguda PHC",
  "Ebute Metta PHC",
  "Yaba PHC",
  "Ajah PHC",
];

export const FACILITY_USAGE_DATA = [
  { id: "FAC-PLT-001", name: "PHC Ikeja", users: 34, logins: 12, lastActive: "Today", status: "Active" },
  { id: "FAC-PLT-002", name: "PHC Surulere", users: 56, logins: 45, lastActive: "Yesterday", status: "Low Activity" },
  { id: "FAC-PLT-003", name: "PHC Ajah", users: 1392, logins: 987, lastActive: "3 days ago", status: "Active" },
  { id: "FAC-PLT-004", name: "Oregun PHC", users: 345, logins: 235, lastActive: "last week", status: "Inactive" },
  { id: "FAC-PLT-005", name: "Aguda PHC", users: 123, logins: 98, lastActive: "last month", status: "Active" },
  { id: "FAC-PLT-006", name: "Ebute Metta PHC", users: 87, logins: 54, lastActive: "last month", status: "Active" },
  { id: "FAC-PLT-007", name: "Yaba PHC", users: 210, logins: 176, lastActive: "2 days ago", status: "Active" },
  { id: "FAC-PLT-008", name: "Mushin PHC", users: 65, logins: 43, lastActive: "3 days ago", status: "Low Activity" },
  { id: "FAC-PLT-009", name: "Isolo PHC", users: 145, logins: 112, lastActive: "Today", status: "Active" },
  { id: "FAC-PLT-010", name: "Kosofe PHC", users: 98, logins: 67, lastActive: "Yesterday", status: "Active" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function PeriodDropdown({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <div
      className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md cursor-pointer shrink-0 ${
        light ? "bg-white/20 text-white hover:bg-white/30" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
      } transition-colors`}
    >
      {label} <ChevronDown size={12} />
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  dark?: boolean;
}

function MetricCard({ label, value, icon, dark = false }: MetricCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 flex flex-col justify-between ${
        dark ? "bg-[#046C3F]" : "bg-white border border-gray-100 shadow-sm"
      }`}
      style={{ minHeight: "140px" }}
    >
      {/* Top row: icon + period */}
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: dark ? "rgba(255,255,255,0.18)" : "#E8F7F0" }}
        >
          {icon}
        </div>
        <PeriodDropdown label="This Week" light={dark} />
      </div>

      {/* Bottom: label + value */}
      <div className="mt-3">
        <p
          className="text-sm font-medium mb-1.5"
          style={{ color: dark ? "rgba(255,255,255,0.75)" : "#6B7280" }}
        >
          {label}
        </p>
        <p
          className="text-3xl font-bold leading-none"
          style={{ color: dark ? "#ffffff" : "#111827" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ActivityTrendChart() {
  const maxTotal = Math.max(...MONTHLY_BARS.map((b) => b.total));
  return (
    <div className="flex flex-col h-56">
      <div className="flex flex-1 gap-1.5">
        {/* Y-axis */}
        <div className="flex flex-col justify-between pb-6 pr-2 shrink-0">
          {Y_LABELS.map((v) => (
            <span key={v} className="text-[10px] text-gray-300 font-medium leading-none">
              {v}
            </span>
          ))}
        </div>
        {/* Bars */}
        <div className="flex-1 flex items-end gap-1 pb-6">
          {MONTHLY_BARS.map((b) => (
            <div key={b.month} className="flex-1 flex flex-col items-center justify-end h-full">
              <div
                className="w-full rounded-t-md relative overflow-hidden"
                style={{ height: `${(b.total / maxTotal) * 100}%`, backgroundColor: "#E8F7F0" }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-md"
                  style={{ height: `${(b.active / b.total) * 100}%`, backgroundColor: "#046C3F" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* X-axis */}
      <div className="flex gap-1 pl-8">
        {MONTHLY_BARS.map((b) => (
          <div key={b.month} className="flex-1 text-center">
            <span className="text-[9px] text-gray-400 font-medium" style={{ writingMode: "horizontal-tb" }}>
              {b.month.slice(0, 3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart() {
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = 42;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = MODULE_DATA.map((d) => {
    const dash = (d.pct / 100) * circumference;
    const gap = circumference - dash;
    const seg = { ...d, dash, gap, offset };
    offset += dash;
    return seg;
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth={18} />
        {segments.map((seg) => (
          <circle
            key={seg.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={18}
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
      </svg>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {MODULE_DATA.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[11px] text-gray-500 font-medium">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBars() {
  return (
    <div className="space-y-3 flex-1">
      {TOP_FACILITIES.map((name, i) => (
        <div key={name} className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium w-36 shrink-0 truncate">{name}</span>
          <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#046C3F]"
              style={{ width: `${78 - i * 2}%`, transition: "width 0.6s ease" }}
            />
          </div>
          <span className="text-sm text-gray-500 font-medium w-8 text-right shrink-0">
            {78 - i * 2}%
          </span>
        </div>
      ))}
    </div>
  );
}

function statusStyle(status: string) {
  if (status === "Active") return "bg-[#D2F1DF] text-[#046C3F]";
  if (status === "Low Activity") return "bg-[#FFF3CD] text-[#B45309]";
  return "bg-[#FFE0E0] text-[#D32F2F]";
}

// ── Main component ────────────────────────────────────────────────────────────

export default function UsageAnalytics() {
  const breadcrumbs = [
    { label: "System Monitoring" },
    { label: "Usage Analytics", active: true },
  ];

  const previewRows = FACILITY_USAGE_DATA.slice(0, 5);

  return (
    <div className="flex-1 flex flex-col">
      <Header title="System Monitoring" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 space-y-6">
        {/* Page title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Usage Analytics</h2>
          <p className="text-gray-500 text-sm mt-1">System usage trends and login activity</p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            dark
            label="Total Active Users"
            value="1,837"
            icon={<Users size={20} className="text-white" />}
          />
          <MetricCard
            label="Active Facilities"
            value="47/100"
            icon={<Building2 size={20} className="text-[#046C3F]" />}
          />
          <MetricCard
            label="Total Logins"
            value="247"
            icon={<LogIn size={20} className="text-[#046C3F]" />}
          />
          <MetricCard
            label="Active Sessions"
            value="2hrs 34min"
            icon={<UserCheck size={20} className="text-[#046C3F]" />}
          />
        </div>

        {/* Activity Trend chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-sm">User Activity Trend</h3>
            <PeriodDropdown label="This Year" />
          </div>
          <ActivityTrendChart />
        </div>

        {/* Module Usage + Top Active Facilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Module Usage donut */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-sm">Module Usage</h3>
              <PeriodDropdown label="This Week" />
            </div>
            <DonutChart />
          </div>

          {/* Top Active Facilities */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-sm">Top Active Facilities Usage</h3>
              <PeriodDropdown label="This Week" />
            </div>
            <HorizontalBars />
          </div>
        </div>

        {/* Facility Usage Table preview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
            <h3 className="font-bold text-gray-800 text-sm">Facility Usage Table</h3>
            <Link
              href="/state-dashboard/system-monitoring/facility-usage"
              className="flex items-center gap-1 text-xs font-semibold text-[#046C3F] hover:underline"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-50">
                  {["Facility ID", "Facility Name", "Users", "Logins", "Last Active", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3">
                      <span className="flex items-center gap-1">
                        {h}
                        <svg width="10" height="12" viewBox="0 0 10 12" className="opacity-30">
                          <path d="M5 0L9 4H1L5 0Z" fill="currentColor" />
                          <path d="M5 12L1 8H9L5 12Z" fill="currentColor" />
                        </svg>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {previewRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{row.id}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{row.name}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{row.users.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{row.logins}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{row.lastActive}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusStyle(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
