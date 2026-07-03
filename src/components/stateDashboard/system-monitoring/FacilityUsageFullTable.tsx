"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import {
  useFacilityUsageTable,
  FacilityUsageRow,
} from "@/src/hooks/state/use-system-monitoring";
import { statusStyle } from "./UsageAnalytics";

const ITEMS_PER_PAGE = 13;

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

export default function FacilityUsageFullTable() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [range, setRange] = useState(defaultRange);

  const { data, isLoading } = useFacilityUsageTable({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    startDate: range.start,
    endDate: range.end,
  });

  const rows = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

  const breadcrumbs = [
    { label: "User Management" },
    { label: "Usage Analytics", href: "/state-dashboard/system-monitoring" },
    { label: "View All table", active: true },
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
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Title + Export */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Facility Usage table</h2>
          <div className="flex items-center gap-3">
            <DateRangeFilter
              startDate={range.start}
              endDate={range.end}
              label="Last 30 Days"
              onApply={(start, end) => {
                setRange({ start, end });
                setCurrentPage(1);
              }}
              onClear={() => {
                setRange(defaultRange());
                setCurrentPage(1);
              }}
            />
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#046C3F] text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-[#035a34] transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
            <h3 className="font-bold text-gray-800 text-sm">Facility Usage Table</h3>
          </div>

          <DataTable
            columns={columns}
            data={rows}
            emptyMessage={isLoading ? "Loading facility usage…" : "No facility usage found."}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
