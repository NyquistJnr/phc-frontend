"use client";

import { useState, useEffect, useRef } from "react";
import { Search, UploadCloud, Loader2, Calendar } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import CustomDateFilter from "@/src/components/adminDashboard/generics/Date";
import { useAuditLogs, AuditLog } from "@/src/hooks/useAuditLogs";

const ITEMS_PER_PAGE = 10;

const formatTimestamp = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toISOString().replace("T", " ").substring(0, 19);
};

const getStatusStyles = (action: string) => {
  const normalizedAction = action?.toUpperCase();
  switch (normalizedAction) {
    case "CREATE":
    case "LOGIN":
      return { label: "Success", classes: "bg-[#D2F1DF] text-[#046C3F]" };
    case "UPDATE":
      return { label: "Info", classes: "bg-[#E0F2FE] text-[#0284C7]" };
    case "DELETE":
    case "SUSPEND":
    case "FAILED_LOGIN":
      return { label: "Critical", classes: "bg-[#FEE2E2] text-[#DC2626]" };
    default:
      return { label: "Normal", classes: "bg-gray-100 text-gray-600" };
  }
};

export default function AuditLogs() {
  const [searchInput, setSearchInput]         = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [moduleFilter, setModuleFilter]       = useState("All");
  const [actionFilter, setActionFilter]       = useState("All");
  const [currentPage, setCurrentPage]         = useState(1);
  const [dateFilterOpen, setDateFilterOpen]   = useState(false);
  const [startDate, setStartDate]             = useState<string | undefined>();
  const [endDate, setEndDate]                 = useState<string | undefined>();

  const dateFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(e.target as Node)) {
        setDateFilterOpen(false);
      }
    };
    if (dateFilterOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dateFilterOpen]);

  const { data, isLoading } = useAuditLogs({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    module: moduleFilter === "All" ? undefined : moduleFilter,
    action: actionFilter === "All" ? undefined : actionFilter,
    search: debouncedSearch || undefined,
    startDate,
    endDate,
  });

  const logs = data?.results || [];
  const totalPages = data?.total_pages || 1;

  const columns: Column<AuditLog>[] = [
    {
      key: "actor_name",
      label: "User",
      sortable: true,
      render: (row) => row.actor_name || "Unknown User",
    },
    { key: "action", label: "Action", sortable: true },
    { key: "module", label: "Module", sortable: true },
    {
      key: "timestamp",
      label: "Timestamp",
      sortable: true,
      className: "font-mono text-sm",
      render: (row) => formatTimestamp(row.timestamp),
    },
    { key: "ip_address", label: "IP Address", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => {
        const config = getStatusStyles(row.action);
        return (
          <span
            className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${config.classes}`}
          >
            {config.label}
          </span>
        );
      },
    },
  ];

  const breadcrumbs = [
    { label: "System Monitoring" },
    { label: "Audit Log", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="System Monitoring" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        {/* Page Title & Export */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
            <p className="text-gray-600 text-sm">
              Track user actions, logins, role changes, and record access
            </p>
          </div>
          <button className="bg-[#046C3F] text-white px-5 sm:px-6 py-3 rounded-xl font-semibold flex items-center gap-3 hover:bg-[#035a34] transition-colors shadow-sm self-start">
            <UploadCloud size={20} />
            Export
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Controls */}
          <div className="p-4 sm:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 text-lg">Recent Audit Logs</h3>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search Logs..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#1AC073]"
                />
              </div>

              <FilterDropdown
                label="All Modules"
                options={["All", "Authentication", "User Management", "Security", "System"]}
                selected={moduleFilter}
                onChange={(v) => { setModuleFilter(v); setCurrentPage(1); }}
              />

              <FilterDropdown
                label="All Actions"
                options={["All", "CREATE", "UPDATE", "DELETE", "LOGIN", "SUSPEND"]}
                selected={actionFilter}
                onChange={(v) => { setActionFilter(v); setCurrentPage(1); }}
              />

              {/* Date Range Picker */}
              <div className="relative" ref={dateFilterRef}>
                <button
                  onClick={() => setDateFilterOpen(!dateFilterOpen)}
                  className={`px-3 sm:px-4 py-2 border rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                    dateFilterOpen || startDate
                      ? "border-[#046C3F] text-[#046C3F] bg-[#E8F7F0]"
                      : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
                  }`}
                >
                  <Calendar size={14} />
                  {startDate && endDate
                    ? `${startDate.substring(5)} to ${endDate.substring(5)}`
                    : startDate
                      ? startDate
                      : "Date Range"}
                </button>

                {dateFilterOpen && (
                  <div className="absolute right-0 top-full mt-2 z-[100]">
                    <CustomDateFilter
                      onApply={(start, end) => {
                        setStartDate(start);
                        setEndDate(end);
                        setCurrentPage(1);
                        setDateFilterOpen(false);
                      }}
                      onClear={() => {
                        setStartDate(undefined);
                        setEndDate(undefined);
                        setCurrentPage(1);
                        setDateFilterOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
              <p className="text-sm font-medium">Loading audit logs...</p>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={logs}
                emptyMessage={
                  debouncedSearch
                    ? "No logs match your search criteria."
                    : "No audit logs found."
                }
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
