"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, Eye } from "lucide-react";

import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import LabBackButton from "@/src/components/lab-dashboard/generics/LabBackButton";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";
import { useInventoryItems } from "@/src/hooks/laboratory/use-inventory";
import {
  CategoryFilterDropdown,
  INVENTORY_CATEGORY_OPTIONS,
  STATUS_FILTERS,
  STATUS_OPTIONS,
  formatScheduleRules,
  getStatusLabel,
  printInventoryItem,
  statusColors,
} from "./Inventory";
import type { InventoryItem, PaginatedInventoryItems } from "./types";

function Toast({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex w-[390px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded border border-gray-200 bg-white p-4 shadow-xl">
      <span className="mt-0.5 h-6 w-6 rounded-lg border border-[#9ADDBA] bg-[#E8F7F0]" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">{title}</p>
      </div>
      <button onClick={onClose} className="text-gray-900">
        ×
      </button>
    </div>
  );
}

export default function AllInventoryItems() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [categories, setCategories] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const inventoryFilters = useMemo(
    () => ({
      page,
      page_size: pageSize,
      search,
      status: STATUS_FILTERS[status],
      inventory_category:
        categories.length > 0 && categories.length < INVENTORY_CATEGORY_OPTIONS.length
          ? categories.join(",")
          : undefined,
      start_date: startDate,
      end_date: endDate,
    }),
    [page, pageSize, search, status, categories, startDate, endDate],
  );

  const { data: itemsData, isLoading: isLoadingItems } =
    useInventoryItems(inventoryFilters);

  const inventoryResult = itemsData as
    | PaginatedInventoryItems
    | InventoryItem[]
    | undefined;
  const inventoryRows = Array.isArray(inventoryResult)
    ? inventoryResult
    : inventoryResult?.results || [];
  const inventoryTotalPages = Array.isArray(inventoryResult)
    ? undefined
    : inventoryResult?.total_pages;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  const handleExport = (item: InventoryItem) => {
    const didPrint = printInventoryItem(item);
    if (!didPrint)
      showToast("Unable to open the print window. Please allow pop-ups.");
  };

  const columns: ColumnDef<InventoryItem>[] = [
    { header: "Item", accessorKey: "name", sortable: true },
    {
      header: "Category",
      sortable: true,
      render: (row) => {
        const categoryLabel =
          INVENTORY_CATEGORY_OPTIONS.find(
            (option) => option.value === row.inventory_category,
          )?.label || row.inventory_category;
        return (
          <div>
            <p className="text-gray-900">{categoryLabel}</p>
            {row.drug_classification && (
              <p className="text-xs text-gray-400">
                {row.drug_classification === "IMMUNIZATION"
                  ? "Immunization"
                  : "Normal"}
              </p>
            )}
          </div>
        );
      },
    },
    { header: "Item Type", accessorKey: "item_type", sortable: true },
    { header: "Total Stock", accessorKey: "total_stock", sortable: true },
    {
      header: "Threshold",
      sortable: true,
      render: (row) =>
        `${row.global_threshold}${row.threshold_type === "PERCENTAGE" ? "%" : ""}`,
    },
    {
      header: "Schedule",
      render: (row) => formatScheduleRules(row.schedule_rules),
    },
    {
      header: "Status",
      sortable: true,
      render: (row) => {
        const label = getStatusLabel(row.status);
        const color = statusColors[label];
        return (
          <StatusBadge
            label={label}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
    },
    {
      header: "Action",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/lab-dashboard/lab-inventory/${row.id}`)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label={`View ${row.name}`}
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleExport(row)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label={`Export ${row.name}`}
          >
            <Download size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <LabDashboardHeader
        title="Lab Inventory"
        breadcrumbs={[
          { label: "Lab Inventory", href: "/lab-dashboard/lab-inventory" },
          { label: "All Items" },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <LabBackButton onClick={() => router.push("/lab-dashboard/lab-inventory")} />

        <div className="mb-7 mt-6">
          <h1 className="text-2xl font-semibold text-black sm:text-3xl">
            All Inventory Items
          </h1>
          <p className="mt-2 text-base text-[#3F3F46]">
            Browse every item across all categories, unfiltered
          </p>
        </div>

        <DataTable
          title="All Items"
          data={inventoryRows}
          columns={columns}
          showSearch
          searchPlaceholder="Search by item name or batch no"
          onSearch={setSearch}
          toolbarActions={
            <>
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                label="Last Updated"
                onApply={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                onClear={() => {
                  setStartDate("");
                  setEndDate("");
                }}
              />
              <CustomDropdown
                options={STATUS_OPTIONS}
                selected={status}
                onSelect={setStatus}
              />
              <CategoryFilterDropdown
                options={INVENTORY_CATEGORY_OPTIONS}
                selected={categories}
                onChange={setCategories}
              />
            </>
          }
          totalPages={inventoryTotalPages}
          emptyMessage={
            isLoadingItems
              ? "Loading inventory items..."
              : "No inventory items match your criteria."
          }
        />
      </div>

      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
