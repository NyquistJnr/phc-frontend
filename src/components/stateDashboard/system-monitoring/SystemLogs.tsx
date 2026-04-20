"use client";

import { useState, useMemo } from "react";
import {
  Search,
  UploadCloud,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import SystemLogDetailsModal from "@/src/components/adminDashboard/system-logs/modal/systemDetails";

interface SystemAlertRow {
  [key: string]: unknown;
  id: string;
  type: string;
  desc: string;
  severity: string;
  time: string;
  status: string;
}

const allAlertLogs: SystemAlertRow[] = [
  { id: "ALT-102", type: "Failed Login", desc: "Multiple failed logins", severity: "Warning", time: "5 mins ago", status: "Active" },
  { id: "ALT-098", type: "Storage Capacity", desc: "Server Memory High", severity: "Info", time: "10 mins ago", status: "Active" },
  { id: "ALT-108", type: "Backup Overdue", desc: "Backup server delayed", severity: "Warning", time: "30 mins ago", status: "Resolved" },
  { id: "ALT-111", type: "System Error", desc: "Database timeout", severity: "Critical", time: "2 hrs ago", status: "Active" },
  { id: "ALT-054", type: "Storage Capacity", desc: "Server Memory High", severity: "Info", time: "1 hrs ago", status: "Resolved" },
  { id: "ALT-128", type: "Performance Issue", desc: "Slow API response", severity: "Warning", time: "2 hrs ago", status: "Active" },
  { id: "ALT-972", type: "System Error", desc: "Backup failure", severity: "Critical", time: "50 mins ago", status: "Active" },
  { id: "ALT-123", type: "Failed Login", desc: "Multiple failed logins", severity: "Warning", time: "30 mins ago", status: "Resolved" },
  { id: "ALT-107", type: "Failed Login", desc: "Multiple failed logins", severity: "Warning", time: "4 hrs ago", status: "Resolved" },
  { id: "ALT-109", type: "Failed Login", desc: "Multiple failed logins", severity: "Warning", time: "10 hrs ago", status: "Resolved" },
];

const getSeverityStyles = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "warning": return "bg-[#FFF5EB] text-[#F97316] border border-[#FFE8D6]";
    case "info": return "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]";
    case "critical": return "bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2]";
    default: return "bg-gray-100 text-gray-600";
  }
};

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "active": return "bg-[#FEF2F2] text-[#EF4444]";
    case "resolved": return "bg-[#F0FDF4] text-[#22C55E]";
    default: return "bg-gray-100 text-gray-600";
  }
};

const ITEMS_PER_PAGE = 10;

const totalAlerts = allAlertLogs.length;
const criticalCount = allAlertLogs.filter((l) => l.severity === "Critical").length;
const warningCount = allAlertLogs.filter((l) => l.severity === "Warning").length;
const resolvedCount = allAlertLogs.filter((l) => l.status === "Resolved").length;

export default function SystemLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const filteredLogs = useMemo(() => {
    return allAlertLogs.filter((log) => {
      const matchSearch =
        searchQuery === "" ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === "All" || log.type === typeFilter;
      const matchSeverity = severityFilter === "All" || log.severity === severityFilter;
      const matchStatus = statusFilter === "All" || log.status === statusFilter;
      return matchSearch && matchType && matchSeverity && matchStatus;
    });
  }, [searchQuery, typeFilter, severityFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const pagedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const columns: Column<SystemAlertRow>[] = [
    { key: "id", label: "Alert ID", sortable: true },
    { key: "type", label: "Alert Type", sortable: true },
    { key: "desc", label: "Description", sortable: true },
    {
      key: "severity",
      label: "Severity",
      sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${getSeverityStyles(row.severity)}`}>
          {row.severity}
        </span>
      ),
    },
    { key: "time", label: "Time", sortable: true, className: "text-gray-500" },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyles(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      sortable: false,
      render: (_row) => (
        <button
          onClick={() => setDetailsModalOpen(true)}
          className="text-sm font-semibold text-[#2A6543] hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  const breadcrumbs = [
    { label: "System Monitoring" },
    { label: "System Logs", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="System Monitoring" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        {/* Page Title & Export */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">System Logs</h1>
            <p className="text-gray-600 text-sm">
              Monitor system errors, security warnings, and platform issues
            </p>
          </div>
          <button className="bg-[#2A6543] text-white px-5 sm:px-6 py-3 rounded-xl font-semibold flex items-center gap-3 hover:bg-[#235337] transition-colors shadow-sm self-start">
            <UploadCloud size={20} />
            Export
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Alerts */}
          <div className="bg-[#2A6543] rounded-2xl p-6 shadow-sm text-white relative overflow-hidden">
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center mb-8">
              <AlertCircle size={16} />
            </div>
            <p className="text-sm font-medium text-white/80 mb-1">Total Alerts</p>
            <h3 className="text-[32px] font-bold leading-none">{totalAlerts}</h3>
          </div>

          {/* Critical */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-8">
              <AlertTriangle size={16} />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Critical</p>
            <h3 className="text-[32px] font-bold text-gray-900 leading-none">{criticalCount}</h3>
          </div>

          {/* Warning */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-8">
              <AlertCircle size={16} />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Warning</p>
            <h3 className="text-[32px] font-bold text-gray-900 leading-none">{warningCount}</h3>
          </div>

          {/* Resolved */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
            <div className="absolute top-6 right-6 flex items-center gap-1 text-xs text-gray-400 font-medium cursor-pointer select-none">
              This Week <ChevronDown size={14} />
            </div>
            <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-8">
              <CheckCircle2 size={16} />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Resolved</p>
            <h3 className="text-[32px] font-bold text-gray-900 leading-none">{resolvedCount}</h3>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Controls */}
          <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 text-[17px]">System Alerts</h3>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full sm:w-50 focus:outline-none focus:border-gray-300"
                />
              </div>

              <FilterDropdown
                label="All Alert Type"
                options={["All", "Failed Login", "Storage Capacity", "Backup Overdue", "System Error", "Performance Issue"]}
                selected={typeFilter}
                onChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}
              />
              <FilterDropdown
                label="All Severity"
                options={["All", "Info", "Warning", "Critical"]}
                selected={severityFilter}
                onChange={(v) => { setSeverityFilter(v); setCurrentPage(1); }}
              />
              <FilterDropdown
                label="All Status"
                options={["All", "Active", "Resolved"]}
                selected={statusFilter}
                onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={pagedLogs}
            emptyMessage="No alerts match your criteria."
          />

          <div className="p-4 sm:p-6 border-t border-gray-50">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <SystemLogDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
      />
    </div>
  );
}
