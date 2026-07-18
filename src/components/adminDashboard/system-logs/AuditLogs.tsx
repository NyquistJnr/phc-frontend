"use client";

import { useState, useEffect } from "react";
import { Search, UploadCloud, Loader2 } from "lucide-react";
import Header from "@/src/components/adminDashboard/generics/header";
import DataTable, {
  Column,
} from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import { useAuditLogs, AuditLog, AuditLogsResponse } from "@/src/hooks/useAuditLogs";
import AuditLogDetailsModal from "./AuditLogDetailsModal";
import { useApi } from "@/src/hooks/use-api";

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

export default function AuditLogsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const api = useApi();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const params = new URLSearchParams({
        page: "1",
        page_size: "100000",
      });

      if (moduleFilter && moduleFilter !== "All") params.append("module", moduleFilter);
      if (actionFilter && actionFilter !== "All") params.append("action", actionFilter);
      if (debouncedSearch) params.append("search", debouncedSearch);

      const response = await api.get<any>(`/system/audit-logs/?${params.toString()}`);
      
      const allLogs: AuditLog[] = response?.results || response?.data?.results || [];
      
      if (allLogs.length === 0) {
        alert("No data available to export");
        return;
      }
      
      const headers = ["ID", "Actor Name", "Facility", "Action", "Module", "IP Address", "Endpoint", "Timestamp"];
      const csvRows = [headers.join(",")];
      
      allLogs.forEach((log) => {
        const row = [
          log.id,
          `"${(log.actor_name || "").replace(/"/g, '""')}"`,
          `"${(log.facility_name || "").replace(/"/g, '""')}"`,
          log.action,
          `"${(log.module || "").replace(/"/g, '""')}"`,
          log.ip_address,
          `"${(log.endpoint || "").replace(/"/g, '""')}"`,
          log.timestamp,
        ];
        csvRows.push(row.join(","));
      });
      
      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to export logs", error);
      alert("Failed to export logs");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleModuleChange = (val: string) => {
    setModuleFilter(val);
    setCurrentPage(1);
  };

  const handleActionChange = (val: string) => {
    setActionFilter(val);
    setCurrentPage(1);
  };

  const { data, isLoading } = useAuditLogs({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    module: moduleFilter === "All" ? undefined : moduleFilter,
    action: actionFilter === "All" ? undefined : actionFilter,
    search: debouncedSearch || undefined,
  });

  const logs = data?.results || [];
  const totalPages = data?.total_pages || 1;
  const totalLogs = data?.count || 0;

  const columns: Column<AuditLog>[] = [
    {
      key: "actor_name",
      label: "User",
      render: (row) => row.actor_name || "Unknown User",
    },
    { key: "action", label: "Action" },
    { key: "module", label: "Module" },
    {
      key: "timestamp",
      label: "Timestamp",
      className: "font-mono",
      render: (row) => formatTimestamp(row.timestamp),
    },
    { key: "ip_address", label: "IP Address" },
    {
      key: "status",
      label: "Status",
      className: "text-center",
      render: (row) => {
        const config = getStatusStyles(row.action);
        return (
          <span
            className={`inline-block min-w-[80px] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${config.classes}`}
          >
            {config.label}
          </span>
        );
      },
    },
  ];

  const breadcrumbs = [
    { label: "System Logs" },
    { label: "Audit Logs", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="System Logs" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Audit Logs
            </h2>
            <p className="text-gray-600">
              Track user actions, logins, role changes, and record access
            </p>
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="bg-[#046C3F] text-white px-5 sm:px-6 py-3 rounded-xl font-semibold flex items-center gap-3 hover:bg-[#035a34] transition-colors shadow-sm self-start disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-700 text-lg">
                Recent Audit Logs
              </h3>
              {!isLoading && (
                <span className="bg-emerald-50 text-[#046C3F] px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-100">
                  {totalLogs} {totalLogs === 1 ? 'Record' : 'Records'}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
                options={[
                  "All",
                  "Authentication",
                  "Facilities - Facility",
                  "User Management",
                  "System",
                ]}
                selected={moduleFilter}
                onChange={handleModuleChange}
              />

              <FilterDropdown
                label="All Actions"
                options={[
                  "All",
                  "CREATE",
                  "UPDATE",
                  "DELETE",
                  "LOGIN",
                  "SUSPEND",
                ]}
                selected={actionFilter}
                onChange={handleActionChange}
              />
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
                onRowClick={(row) => {
                  setSelectedLog(row);
                  setIsModalOpen(true);
                }}
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

      <AuditLogDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        log={selectedLog} 
      />
    </div>
  );
}
