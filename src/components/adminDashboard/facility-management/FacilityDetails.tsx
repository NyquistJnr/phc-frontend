"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  Edit2,
  Loader2,
  Building2,
  CheckCircle2,
  XCircle,
  PowerOff,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";
import Header from "@/src/components/adminDashboard/generics/header";
import DataTable, {
  Column,
} from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import ActionMenu from "@/src/components/adminDashboard/generics/ActionMenu";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import MetricCard from "@/src/components/adminDashboard/generics/MetricCard";
import {
  useFacilities,
  useFacilityStats,
  useToggleFacilityStatus,
  Facility,
} from "@/src/hooks/useFacilities";

const ITEMS_PER_PAGE = 10;

export default function FacilityDetails() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [lgaFilter, setLgaFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const isActiveParam =
    statusFilter === "Active"
      ? true
      : statusFilter === "Inactive"
        ? false
        : undefined;

  const { data: statsData } = useFacilityStats();
  const { data: facilitiesData, isLoading } = useFacilities({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    search: debouncedSearch || undefined,
    state: stateFilter,
    lga: lgaFilter,
    isActive: isActiveParam,
  });

  const toggleStatusMutation = useToggleFacilityStatus();

  const facilities = facilitiesData?.results || [];
  const totalPages = facilitiesData?.total_pages || 1;

  const columns: Column<Facility>[] = [
    { key: "code", label: "Facility Code", render: (row) => row.code || "N/A" },
    { key: "name", label: "Facility Name", render: (row) => row.name },
    { key: "state", label: "State", render: (row) => row.state },
    { key: "lga", label: "LGA", render: (row) => row.lga },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-tight ${
            row.is_active
              ? "bg-[#D2F1DF] text-[#046C3F]"
              : "bg-[#FFE5D3] text-[#FF8433]"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <ActionMenu
          items={[
            {
              label: "View Details",
              icon: Eye,
              onClick: () =>
                router.push(`/dashboard/facility-management/edit?id=${row.id}`),
            },
            {
              label: "Edit Facility",
              icon: Edit2,
              onClick: () =>
                router.push(`/dashboard/facility-management/edit?id=${row.id}`),
            },
            row.is_active
              ? {
                  label: "Suspend Facility",
                  icon: PowerOff,
                  onClick: () => {
                    toggleStatusMutation.mutate(
                      { facilityId: row.id, isActive: false },
                      {
                        onSuccess: (data: any) =>
                          toast.success(
                            data?.message || `${row.name} has been suspended.`,
                          ),
                        onError: (error: any) =>
                          toast.error(
                            error.message || "Failed to suspend facility.",
                          ),
                      },
                    );
                  },
                  variant: "danger" as const,
                }
              : {
                  label: "Reactivate Facility",
                  icon: RotateCcw,
                  onClick: () => {
                    toggleStatusMutation.mutate(
                      { facilityId: row.id, isActive: true },
                      {
                        onSuccess: (data: any) =>
                          toast.success(
                            data?.message ||
                              `${row.name} has been reactivated.`,
                          ),
                        onError: (error: any) =>
                          toast.error(
                            error.message || "Failed to reactivate facility.",
                          ),
                      },
                    );
                  },
                },
          ]}
        />
      ),
    },
  ];

  const breadcrumbs = [
    { label: "Facility Management" },
    { label: "Facility Details", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-h-screen">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 space-y-6">
        <div className="mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Facility Details
          </h2>
          <p className="text-gray-600 font-medium">
            View and manage registered health facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            icon={Building2}
            title="Total Facilities"
            value={String(statsData?.total_facilities || 0)}
            colorClass="bg-white border border-gray-100"
          />
          <MetricCard
            icon={CheckCircle2}
            title="Active Facilities"
            value={String(statsData?.active_facilities || 0)}
            colorClass="bg-[#046C3F] text-white"
          />
          <MetricCard
            icon={XCircle}
            title="Suspended Facilities"
            value={String(statsData?.suspended_facilities || 0)}
            colorClass="bg-white border border-gray-100"
          />
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-700 text-lg shrink-0">
              Facilities
            </h3>

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
                  placeholder="Search by Code, name, state..."
                  className="pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg text-sm w-full sm:w-72 focus:outline-none focus:ring-1 focus:ring-[#1AC073] transition-colors"
                />
              </div>
              <FilterDropdown
                label="State"
                options={["All", "Plateau", "Lagos"]}
                selected={stateFilter}
                onChange={(v) => {
                  setStateFilter(v);
                  setCurrentPage(1);
                }}
              />
              <FilterDropdown
                label="LGA"
                options={[
                  "All",
                  "Mikang North",
                  "Mikang West",
                  "Jos North",
                  "Jos South",
                ]}
                selected={lgaFilter}
                onChange={(v) => {
                  setLgaFilter(v);
                  setCurrentPage(1);
                }}
              />
              <FilterDropdown
                label="Status"
                options={["All", "Active", "Inactive"]}
                selected={statusFilter}
                onChange={(v) => {
                  setStatusFilter(v);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
              <p className="text-sm font-medium">Fetching facilities...</p>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={facilities}
                emptyMessage={
                  debouncedSearch
                    ? "No facilities match your search criteria."
                    : "No facilities found."
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
