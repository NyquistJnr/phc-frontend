"use client";

import { useEffect, useState } from "react";
import { Search, ShieldAlert } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import { useDiseases, Disease } from "@/src/hooks/useDiseases";

const ITEMS_PER_PAGE = 10;

function severityStyles(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return "bg-[#FEE2E2] text-[#DC2626]";
    case "MODERATE":
      return "bg-[#FFF3CD] text-[#B45309]";
    case "LOW":
      return "bg-[#D2F1DF] text-[#046C3F]";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function DiseaseRegistry() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading } = useDiseases({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    severity: severityFilter === "All" ? undefined : severityFilter,
    search: debouncedSearch || undefined,
  });

  const diseases = data?.results || [];
  const totalPages = data?.total_pages || 1;

  const columns: Column<Disease>[] = [
    { key: "name", label: "Disease" },
    {
      key: "severity",
      label: "Severity",
      render: (row) => (
        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${severityStyles(row.severity)}`}>
          {row.severity}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      className: "max-w-[420px]",
      render: (row) => (
        <span className="line-clamp-2 text-gray-500">{row.description || "-"}</span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
            row.is_active ? "bg-[#D2F1DF] text-[#046C3F]" : "bg-gray-100 text-gray-500"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const breadcrumbs = [
    { label: "Configuration" },
    { label: "Disease Registry", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="Configuration" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Disease Registry</h1>
          <p className="text-gray-600 text-sm">
            System-wide list of tracked diseases used for diagnosis linkage and alerting
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center">
                <ShieldAlert size={18} className="text-[#046C3F]" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Diseases</h3>
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
                  placeholder="Search diseases..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#1AC073]"
                />
              </div>

              <FilterDropdown
                label="All Severities"
                options={["All", "CRITICAL", "MODERATE", "LOW"]}
                selected={severityFilter}
                onChange={(v) => { setSeverityFilter(v); setCurrentPage(1); }}
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={diseases}
            emptyMessage={
              isLoading
                ? "Loading diseases…"
                : debouncedSearch
                  ? "No diseases match your search."
                  : "No diseases found."
            }
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
