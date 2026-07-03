"use client";

import { useState } from "react";
import Header from "@/src/components/stateDashboard/generics/Header";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import {
  useFailedLoginsByUser,
  useFailedLoginsByFacility,
  useFailedLoginsUnknownEmails,
  FailedLoginsByUserRow,
  FailedLoginsByFacilityRow,
  FailedLoginsUnknownEmailRow,
} from "@/src/hooks/state/use-auth-activity";

const ITEMS_PER_PAGE = 10;

type Tab = "user" | "facility" | "unknown";

const TABS: { key: Tab; label: string }[] = [
  { key: "user", label: "By User" },
  { key: "facility", label: "By Facility" },
  { key: "unknown", label: "Unknown Emails" },
];

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

const userColumns: Column<FailedLoginsByUserRow>[] = [
  { key: "name", label: "Name", render: (row) => row.name || "Unknown User" },
  { key: "email", label: "Email" },
  { key: "staff_id", label: "Staff ID" },
  { key: "failed_attempts", label: "Failed Attempts" },
];

const facilityColumns: Column<FailedLoginsByFacilityRow>[] = [
  { key: "facility_name", label: "Facility" },
  { key: "failed_attempts", label: "Failed Attempts" },
];

const unknownColumns: Column<FailedLoginsUnknownEmailRow>[] = [
  { key: "attempted_email", label: "Attempted Email" },
  { key: "failed_attempts", label: "Failed Attempts" },
];

export default function AuthActivity() {
  const [tab, setTab] = useState<Tab>("user");
  const [currentPage, setCurrentPage] = useState(1);
  const [range, setRange] = useState(defaultRange);

  const userQuery = useFailedLoginsByUser({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    startDate: range.start,
    endDate: range.end,
    enabled: tab === "user",
  });
  const facilityQuery = useFailedLoginsByFacility({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    startDate: range.start,
    endDate: range.end,
    enabled: tab === "facility",
  });
  const unknownQuery = useFailedLoginsUnknownEmails({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    startDate: range.start,
    endDate: range.end,
    enabled: tab === "unknown",
  });

  const activeQuery = tab === "user" ? userQuery : tab === "facility" ? facilityQuery : unknownQuery;
  const totalPages = activeQuery.data?.total_pages || 1;

  const breadcrumbs = [
    { label: "System Monitoring" },
    { label: "Auth Activity", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="System Monitoring" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Auth Activity</h1>
            <p className="text-gray-600 text-sm">Failed login attempts by user, facility, and unrecognized email</p>
          </div>
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
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 pt-4 sm:pt-6 flex items-center gap-1 border-b border-gray-50">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
                  tab === t.key
                    ? "text-[#046C3F] border-b-2 border-[#046C3F]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "user" && (
            <DataTable
              columns={userColumns}
              data={userQuery.data?.results || []}
              emptyMessage={userQuery.isLoading ? "Loading…" : "No failed logins in this range."}
            />
          )}
          {tab === "facility" && (
            <DataTable
              columns={facilityColumns}
              data={facilityQuery.data?.results || []}
              emptyMessage={facilityQuery.isLoading ? "Loading…" : "No failed logins in this range."}
            />
          )}
          {tab === "unknown" && (
            <DataTable
              columns={unknownColumns}
              data={unknownQuery.data?.results || []}
              emptyMessage={unknownQuery.isLoading ? "Loading…" : "No unrecognized login attempts in this range."}
            />
          )}

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
