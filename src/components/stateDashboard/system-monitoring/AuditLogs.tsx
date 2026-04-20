"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, UploadCloud, Loader2, Calendar } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import CustomDateFilter from "@/src/components/adminDashboard/generics/Date";

interface AuditLogRow {
  [key: string]: unknown;
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  ip_address: string;
  status: string;
}

// TODO: replace with real API data when state-dashboard audit log endpoint is ready
const DUMMY_LOGS: AuditLogRow[] = [
  { id: "1",  user: "Dr. Adaeze Nwosu",        action: "User Login",                       module: "Authentication",  timestamp: "2026-03-08 08:42:15", ip_address: "192.168.1.14", status: "Success"  },
  { id: "2",  user: "System Admin",             action: "Password Reset: Chioma Eze",        module: "Security",        timestamp: "2026-03-08 08:31:02", ip_address: "192.168.1.1",  status: "Warning"  },
  { id: "3",  user: "Fatima Bello",             action: "Role Changed: Nurse → Doctor",      module: "User Management", timestamp: "2026-03-08 08:15:44", ip_address: "192.168.1.1",  status: "Info"     },
  { id: "4",  user: "Unknown (IP: 10.0.0.45)",  action: "Failed Login Attempt",              module: "Authentication",  timestamp: "2026-03-08 07:58:33", ip_address: "192.168.1.18", status: "Critical" },
  { id: "5",  user: "System Admin",             action: "System Settings Updated",           module: "System",          timestamp: "2026-03-08 07:44:00", ip_address: "192.168.1.1",  status: "Info"     },
  { id: "6",  user: "Emeka Okafor",             action: "User Login",                        module: "Authentication",  timestamp: "2026-03-08 07:58:33", ip_address: "192.168.1.1",  status: "Success"  },
  { id: "7",  user: "System Admin",             action: "System Settings Updated",           module: "System",          timestamp: "2026-03-08 07:44:00", ip_address: "192.168.1.1",  status: "Info"     },
  { id: "8",  user: "Unknown (IP: 10.0.0.45)",  action: "Failed Login Attempt",              module: "Authentication",  timestamp: "2026-03-08 07:44:00", ip_address: "192.168.1.1",  status: "Warning"  },
  { id: "9",  user: "System Admin",             action: "System Settings Updated",           module: "System",          timestamp: "2026-03-08 07:44:00", ip_address: "192.168.1.1",  status: "Info"     },
  { id: "10", user: "Dr John .A",               action: "User Login",                        module: "Authentication",  timestamp: "2026-03-08 07:44:00", ip_address: "192.168.1.1",  status: "Success"  },
];

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":  return "bg-[#D2F1DF] text-[#046C3F]";
    case "info":     return "bg-[#E0F2FE] text-[#0284C7]";
    case "warning":  return "bg-[#FFF5EB] text-[#F97316]";
    case "critical": return "bg-[#FEE2E2] text-[#DC2626]";
    default:         return "bg-gray-100 text-gray-600";
  }
};

const ITEMS_PER_PAGE = 10;

export default function AuditLogs() {
  const [searchInput, setSearchInput]     = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [moduleFilter, setModuleFilter]   = useState("All");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [currentPage, setCurrentPage]     = useState(1);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [startDate, setStartDate]         = useState<string | undefined>();
  const [endDate, setEndDate]             = useState<string | undefined>();

  const dateFilterRef = useRef<HTMLDivElement>(null);
  const isLoading = false;

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

  const filteredLogs = useMemo(() => {
    return DUMMY_LOGS.filter((log) => {
      const matchSearch =
        !debouncedSearch ||
        log.user.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        log.action.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        log.module.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchModule = moduleFilter === "All" || log.module === moduleFilter;
      const matchStatus = statusFilter === "All" || log.status === statusFilter;
      const matchDate = (() => {
        if (!startDate) return true;
        const logDate = log.timestamp.substring(0, 10);
        return logDate >= startDate && logDate <= (endDate ?? startDate);
      })();
      return matchSearch && matchModule && matchStatus && matchDate;
    });
  }, [debouncedSearch, moduleFilter, statusFilter, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const pagedLogs  = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const columns: Column<AuditLogRow>[] = [
    { key: "user",       label: "User",       sortable: true },
    { key: "action",     label: "Action",     sortable: true },
    { key: "module",     label: "Module",     sortable: true },
    { key: "timestamp",  label: "Timestamp",  sortable: true, className: "font-mono text-sm" },
    { key: "ip_address", label: "IP Address", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${getStatusStyles(row.status)}`}
        >
          {row.status}
        </span>
      ),
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
                label="All Status"
                options={["All", "Success", "Info", "Warning", "Critical"]}
                selected={statusFilter}
                onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
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
                data={pagedLogs}
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
