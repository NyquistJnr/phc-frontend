"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CalendarDays } from "lucide-react";

import DashboardStatCard from "@/src/components/generic/dashboard/DashboardStatCard";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import { UNITS } from "./Inventory";

import {
  useExpiringDrugs,
  useExpiryAnalysisStats,
} from "@/src/hooks/pharmacist/use-inventory";
import { ExpiringDrugItem } from "./type";

const PAGE_SIZES = ["10", "50", "100"];

export default function ExpiringTracking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const unitFilter = searchParams.get("unit") || "All Unit";

  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (localSearch === currentSearch) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (localSearch) params.set("search", localSearch);
      else params.delete("search");

      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, pathname, router, searchParams]);

  const { data: statsData, isLoading: isLoadingStats } = useExpiryAnalysisStats(
    {
      start_date: startDate,
      end_date: endDate,
    },
  );

  const { data: drugsData, isLoading: isLoadingDrugs } = useExpiringDrugs({
    page,
    page_size: pageSize,
    search: searchParams.get("search") || undefined,
    unit: unitFilter,
    start_date: startDate,
    end_date: endDate,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Unit") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const columns: ColumnDef<ExpiringDrugItem>[] = [
    { header: "Drug Name", accessorKey: "drug_name", sortable: true },
    { header: "Batch", accessorKey: "batch_number", sortable: true },
    { header: "Unit", accessorKey: "unit", sortable: true },
    { header: "Qty", accessorKey: "remaining_quantity", sortable: true },
    { header: "Expiry", accessorKey: "expiry_date", sortable: true },
    {
      header: "Days left",
      sortable: true,
      render: (row) => (
        <span className={row.days_left <= 30 ? "text-red-600 font-medium" : ""}>
          {row.days_left}
        </span>
      ),
    },
  ];

  const expiryStats = [
    {
      title: "Expiring in 30 days",
      value: isLoadingStats ? "..." : statsData?.expiring_30_days || 0,
      icon: CalendarDays,
      active: true,
    },
    {
      title: "Expiring in 60 days",
      value: isLoadingStats ? "..." : statsData?.expiring_60_days || 0,
      icon: CalendarDays,
    },
    {
      title: "Expiring in 90 days",
      value: isLoadingStats ? "..." : statsData?.expiring_90_days || 0,
      icon: CalendarDays,
    },
  ];

  const tableResults = Array.isArray(drugsData)
    ? drugsData
    : drugsData?.results || [];
  const totalPages = !Array.isArray(drugsData)
    ? drugsData?.total_pages
    : undefined;

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Inventory"
        breadcrumbs={[{ label: "Inventory" }, { label: "Expiring Tracking" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
              Expiring Tracking
            </h1>
            <p className="text-base text-[#3F3F46]">
              Monitor drugs nearing their expiration dates
            </p>
          </div>
          <div>
            <DateRangeFilter
              label="Filter by Date"
              startDate={startDate}
              endDate={endDate}
              onApply={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              onClear={() => {
                setStartDate("");
                setEndDate("");
              }}
            />
          </div>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {expiryStats.map((stat) => (
            <DashboardStatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              active={stat.active}
            />
          ))}
        </div>
        <div className="mb-6 grid max-w-[400px] grid-cols-2 rounded-lg bg-[#EFF7F4]">
          <button
            onClick={() => router.push("/pharmacist-dashboard/inventory")}
            className="h-10 rounded-lg text-base text-[#A7ADB5] transition-colors hover:text-gray-700"
          >
            Drug Stock
          </button>
          <button className="h-10 rounded-lg bg-[#046C3F] text-base text-white shadow">
            Expiring Tracking
          </button>
        </div>
        <DataTable
          title="Drugs Expiring"
          data={tableResults}
          columns={columns}
          showSearch
          searchPlaceholder="Search by Drug name or Batch..."
          onSearch={(val) => setLocalSearch(val)}
          totalPages={totalPages}
          emptyMessage={
            isLoadingDrugs
              ? "Loading expiring drugs..."
              : "No expiring drugs match your criteria."
          }
          toolbarActions={
            <>
              <CustomDropdown
                options={["All Unit", ...UNITS]}
                selected={unitFilter}
                onSelect={(val) => updateUrlParams("unit", val)}
              />
              <CustomDropdown
                options={PAGE_SIZES}
                selected={pageSize.toString()}
                onSelect={(val) => updateUrlParams("page_size", val)}
                placeholder="Rows per page"
              />
            </>
          }
        />
      </div>
    </div>
  );
}
