"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Users, Building2, LogIn, UserCheck } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import MetricCard from "@/src/components/adminDashboard/generics/MetricCard";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import {
  useOverviewStats,
  useUserActivityTrend,
  useModuleUsage,
  useTopActiveFacilities,
  useFacilityUsageTable,
  UserActivityTrendPoint,
  ModuleUsageRow,
  TopActiveFacility,
  FacilityUsageRow,
} from "@/src/hooks/state/use-system-monitoring";

const MODULE_COLORS = ["#046C3F", "#1AC073", "#FFD66B", "#0284C7"];
const ACTIVE_USERS_COLOR = "#046C3F";
const LOGINS_COLOR = "#0284C7";
const MAX_X_LABELS = 10;

function formatToYYYYMMDD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return { start: formatToYYYYMMDD(start), end: formatToYYYYMMDD(end) };
}

function formatAxisLabel(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function niceMax(value: number) {
  if (value <= 0) return 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;
  let niceResidual = 1;
  if (residual > 5) niceResidual = 10;
  else if (residual > 2) niceResidual = 5;
  else if (residual > 1) niceResidual = 2;
  return niceResidual * magnitude;
}

export function statusStyle(status: string) {
  if (status === "Active") return "bg-[#D2F1DF] text-[#046C3F]";
  if (status === "Low Activity") return "bg-[#FFF3CD] text-[#B45309]";
  return "bg-[#FFE0E0] text-[#D32F2F]";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ActivityTrendChart({
  data,
  isLoading,
}: {
  data: UserActivityTrendPoint[];
  isLoading: boolean;
}) {
  const maxValue = useMemo(
    () => niceMax(data.reduce((acc, p) => Math.max(acc, p.active_users, p.logins), 0)),
    [data],
  );

  const yTicks = useMemo(() => {
    const stepCount = 4;
    return Array.from({ length: stepCount + 1 }, (_, i) =>
      Math.round((maxValue / stepCount) * (stepCount - i)),
    );
  }, [maxValue]);

  const labelStride = Math.max(1, Math.ceil(data.length / MAX_X_LABELS));

  if (isLoading) {
    return (
      <div className="h-56 flex items-center justify-center">
        <p className="text-sm text-gray-300 font-medium">Loading chart…</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center">
        <p className="text-sm text-gray-300 font-medium">No activity in this range</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-56">
      <div className="flex flex-1 gap-1.5">
        {/* Y-axis */}
        <div className="flex flex-col justify-between pb-6 pr-2 shrink-0">
          {yTicks.map((v, i) => (
            <span key={i} className="text-[10px] text-gray-300 font-medium leading-none">
              {v}
            </span>
          ))}
        </div>
        {/* Bars */}
        <div className="flex-1 flex items-end gap-1 pb-6">
          {data.map((point) => (
            <div key={point.date} className="flex-1 flex flex-col items-center justify-end h-full">
              <div className="w-full flex items-end justify-center gap-[3px] h-full">
                <div
                  className="flex-1 max-w-[14px] rounded-t-[4px]"
                  style={{
                    height: `${(point.active_users / maxValue) * 100}%`,
                    backgroundColor: ACTIVE_USERS_COLOR,
                  }}
                  title={`Active Users: ${point.active_users}`}
                />
                <div
                  className="flex-1 max-w-[14px] rounded-t-[4px]"
                  style={{
                    height: `${(point.logins / maxValue) * 100}%`,
                    backgroundColor: LOGINS_COLOR,
                  }}
                  title={`Logins: ${point.logins}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* X-axis */}
      <div className="flex gap-1 pl-8">
        {data.map((point, i) => (
          <div key={point.date} className="flex-1 text-center">
            <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap">
              {i % labelStride === 0 ? formatAxisLabel(point.date) : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ data, isLoading }: { data: ModuleUsageRow[]; isLoading: boolean }) {
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = 42;
  const circumference = 2 * Math.PI * r;

  const totalPct = data.reduce((acc, d) => acc + d.percentage, 0);

  const segments = data.reduce<
    Array<ModuleUsageRow & { color: string; dash: number; gap: number; offset: number }>
  >((acc, d, i) => {
    const dash = (d.percentage / 100) * circumference;
    const gap = circumference - dash;
    const offset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    acc.push({ ...d, color: MODULE_COLORS[i % MODULE_COLORS.length], dash, gap, offset });
    return acc;
  }, []);

  if (isLoading) {
    return (
      <div className="h-[188px] flex items-center justify-center">
        <p className="text-sm text-gray-300 font-medium">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth={18} />
        {totalPct > 0 &&
          segments.map((seg) => (
            <circle
              key={seg.module}
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
        {segments.map((seg) => (
          <div key={seg.module} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-[11px] text-gray-500 font-medium">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBars({ data, isLoading }: { data: TopActiveFacility[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="h-[188px] flex items-center justify-center">
        <p className="text-sm text-gray-300 font-medium">Loading…</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[188px] flex items-center justify-center">
        <p className="text-sm text-gray-300 font-medium">No facility usage in this range</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 flex-1">
      {data.map((facility) => (
        <div key={facility.facility_id} className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium w-36 shrink-0 truncate">
            {facility.facility_name}
          </span>
          <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#046C3F]"
              style={{ width: `${facility.percentage}%`, transition: "width 0.6s ease" }}
            />
          </div>
          <span className="text-sm text-gray-500 font-medium w-10 text-right shrink-0">
            {facility.percentage.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function UsageAnalytics() {
  const [range, setRange] = useState(defaultRange);

  const { data: overview, isLoading: overviewLoading } = useOverviewStats({
    startDate: range.start,
    endDate: range.end,
  });
  const { data: trend, isLoading: trendLoading } = useUserActivityTrend({
    startDate: range.start,
    endDate: range.end,
  });
  const { data: moduleUsage, isLoading: moduleUsageLoading } = useModuleUsage({
    startDate: range.start,
    endDate: range.end,
  });
  const { data: topFacilities, isLoading: topFacilitiesLoading } = useTopActiveFacilities({
    page: 1,
    pageSize: 7,
    startDate: range.start,
    endDate: range.end,
  });
  const { data: facilityUsage, isLoading: facilityUsageLoading } = useFacilityUsageTable({
    page: 1,
    pageSize: 5,
    startDate: range.start,
    endDate: range.end,
  });

  const trendResults = trend?.results ?? [];
  const moduleResults = moduleUsage?.results ?? [];
  const topFacilitiesResults = topFacilities?.results ?? [];
  const previewRows = facilityUsage?.results ?? [];

  const breadcrumbs = [
    { label: "System Monitoring" },
    { label: "Usage Analytics", active: true },
  ];

  const columns: Column<FacilityUsageRow>[] = [
    {
      key: "facility_id",
      label: "Facility ID",
      render: (row) => (
        <span className="truncate block max-w-[120px]" title={row.facility_id}>
          {row.facility_id}
        </span>
      ),
    },
    { key: "facility_name", label: "Facility Name" },
    { key: "number_of_users", label: "Users", render: (row) => row.number_of_users.toLocaleString() },
    { key: "number_of_logins", label: "Logins" },
    { key: "last_active", label: "Last Active" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusStyle(row.status)}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="System Monitoring" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 space-y-6">
        {/* Page title */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Usage Analytics</h2>
            <p className="text-gray-500 text-sm mt-1">System usage trends and login activity</p>
          </div>
          <DateRangeFilter
            startDate={range.start}
            endDate={range.end}
            label="Last 30 Days"
            onApply={(start, end) => setRange({ start, end })}
            onClear={() => setRange(defaultRange())}
          />
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={Users}
            title="Total Active Users"
            value={overviewLoading ? "…" : (overview?.total_active_users ?? 0).toLocaleString()}
            colorClass="bg-[#046C3F]"
          />
          <MetricCard
            icon={Building2}
            title="Active Facilities"
            value={
              overviewLoading
                ? "…"
                : `${overview?.active_facilities.active ?? 0}/${overview?.active_facilities.total ?? 0}`
            }
            colorClass="bg-white border border-gray-100"
          />
          <MetricCard
            icon={LogIn}
            title="Total Logins"
            value={overviewLoading ? "…" : (overview?.total_logins ?? 0).toLocaleString()}
            colorClass="bg-white border border-gray-100"
          />
          <MetricCard
            icon={UserCheck}
            title="Active Sessions"
            value={overviewLoading ? "…" : (overview?.active_sessions ?? "0h 0m")}
            colorClass="bg-white border border-gray-100"
          />
        </div>

        {/* Activity Trend chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-sm">User Activity Trend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ACTIVE_USERS_COLOR }} />
                <span className="text-[11px] text-gray-500 font-medium">Active Users</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: LOGINS_COLOR }} />
                <span className="text-[11px] text-gray-500 font-medium">Logins</span>
              </div>
            </div>
          </div>
          <ActivityTrendChart data={trendResults} isLoading={trendLoading} />
        </div>

        {/* Module Usage + Top Active Facilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Module Usage donut */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-sm">Module Usage</h3>
            </div>
            <DonutChart data={moduleResults} isLoading={moduleUsageLoading} />
          </div>

          {/* Top Active Facilities */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-sm">Top Active Facilities Usage</h3>
            </div>
            <HorizontalBars data={topFacilitiesResults} isLoading={topFacilitiesLoading} />
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

          <DataTable
            columns={columns}
            data={previewRows}
            emptyMessage={facilityUsageLoading ? "Loading facility usage…" : "No facility usage found."}
          />
        </div>
      </div>
    </div>
  );
}
