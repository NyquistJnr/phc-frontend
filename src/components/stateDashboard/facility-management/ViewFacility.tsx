"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, Download, Eye, Edit2, ListFilter } from "lucide-react";
import Header from "@/src/components/adminDashboard/generics/header";
import ActionMenu from "@/src/components/adminDashboard/generics/ActionMenu";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import { useFacilities, useFacilityStats, Facility } from "@/src/hooks/useFacilities";

const ITEMS_PER_PAGE = 10;

const LEVEL_OPTIONS = ["All", "Health Post", "PHC Clinic", "PHC Centre"];
const STATUS_OPTIONS = ["All", "Active", "Inactive"];


export default function ViewFacility() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
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
    statusFilter === "Active" ? true : statusFilter === "Inactive" ? false : undefined;

  const levelParam =
    levelFilter !== "All" ? levelFilter : undefined;

  const { data: statsData } = useFacilityStats();
  const { data: facilitiesData, isLoading } = useFacilities({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    search: debouncedSearch || undefined,
    isActive: isActiveParam,
  });

  const facilities: Facility[] = facilitiesData?.results ?? [];
  const totalPages = facilitiesData?.total_pages ?? 1;
  const totalCount = statsData?.total_facilities ?? facilitiesData?.count ?? 0;

  // Client-side level filter (API doesn't support level filter yet)
  const filteredFacilities = levelParam
    ? facilities.filter((f) => f.level === levelParam)
    : facilities;

  const breadcrumbs = [
    { label: "Facility Management" },
    { label: "View Facility", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />

      <div className="flex-1 p-4 sm:p-8 space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Facilities</h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              {totalCount} {totalCount === 1 ? "facility" : "facilities"} registered
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/state-dashboard/facility-management/create-facility")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#046C3F] text-white text-sm font-semibold rounded-xl hover:bg-[#035a34] transition-colors shadow-sm"
            >
              <Building2 size={16} />
              Add Facility
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 border border-[#046C3F] bg-white text-[#046C3F] text-sm font-semibold rounded-xl hover:bg-[#E8F7F0] transition-colors">
              <Download size={16} className="text-[#046C3F]" />
              Export
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 border-b border-gray-50">
            <h3 className="text-base font-bold text-gray-900">Facilities</h3>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name or code..."
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1AC073] focus:border-[#1AC073] w-56"
                />
              </div>
              {/* Level filter */}
              <FilterDropdown
                label="All Levels"
                options={LEVEL_OPTIONS}
                selected={levelFilter}
                onChange={(v) => { setLevelFilter(v); setCurrentPage(1); }}
              />
              {/* Status filter */}
              <FilterDropdown
                label="All Status"
                options={STATUS_OPTIONS}
                selected={statusFilter}
                onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
              />
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-sm text-gray-400">
              Loading facilities...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-50 bg-gray-50/30">
                      <th className="px-6 py-4">
                        <div className="flex items-center gap-1">Code <ListFilter size={12} /></div>
                      </th>
                      <th className="px-6 py-4">
                        <div className="flex items-center gap-1">Facility Name <ListFilter size={12} /></div>
                      </th>
                      <th className="px-6 py-4">
                        <div className="flex items-center gap-1">Level <ListFilter size={12} /></div>
                      </th>
                      <th className="px-6 py-4">
                        <div className="flex items-center gap-1">LGA <ListFilter size={12} /></div>
                      </th>
                      <th className="px-6 py-4">
                        <div className="flex items-center gap-1">User <ListFilter size={12} /></div>
                      </th>
                      <th className="px-6 py-4">
                        <div className="flex items-center gap-1">Status <ListFilter size={12} /></div>
                      </th>
                      <th className="px-6 py-4">
                        <div className="flex items-center gap-1">Action <ListFilter size={12} /></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredFacilities.map((facility) => (
                      <tr key={facility.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                          {facility.code}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800 whitespace-nowrap">
                          {facility.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {facility.level}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {facility.lga} LGA
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {facility.staff_count ?? 100}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              facility.is_active
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-orange-50 text-orange-500"
                            }`}
                          >
                            {facility.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <ActionMenu
                            items={[
                              {
                                label: "View",
                                icon: Eye,
                                onClick: () =>
                                  router.push(
                                    `/state-dashboard/facility-management/view-facility/${facility.id}`,
                                  ),
                              },
                              {
                                label: "Edit",
                                icon: Edit2,
                                onClick: () =>
                                  router.push(
                                    `/state-dashboard/facility-management/view-facility/${facility.id}/edit`,
                                  ),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
