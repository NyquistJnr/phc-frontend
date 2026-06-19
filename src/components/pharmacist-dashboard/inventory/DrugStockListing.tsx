"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Download,
  Eye,
  MoreHorizontal,
  PackagePlus,
  Pill,
  Plus,
} from "lucide-react";

import DashboardStatCard from "@/src/components/generic/dashboard/DashboardStatCard";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import { badge } from "./Inventory";

import {
  useInventoryDrugs,
  useInventoryStats,
} from "@/src/hooks/pharmacist/use-inventory";
import { DrugStockItem } from "./type";

const STATUS_OPTIONS = ["All Status", "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"];
const PAGE_SIZES = ["10", "50", "100"];

function getStatusLabel(status?: string) {
  switch (status) {
    case "IN_STOCK":
      return "In Stock";
    case "LOW_STOCK":
      return "Low Stock";
    case "OUT_OF_STOCK":
      return "Out of Stock";
    default:
      return "Unknown";
  }
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function printDrugStockItem(item: DrugStockItem) {
  const batch = item.active_batches?.[0] ?? null;
  const printableRows = [
    ["Drug Name", item.name],
    ["Status", getStatusLabel(item.status)],
    ["Inventory Category", item.inventory_category],
    ["Drug Classification", item.drug_classification],
    ["Item Type", item.item_type],
    ["Threshold Type", item.threshold_type],
    ["Global Threshold", String(item.global_threshold)],
    ["Total Stock", String(item.total_stock)],
    ["Batch Number", batch?.batch_number ?? "-"],
    ["Remaining Quantity", String(batch?.remaining_quantity ?? "-")],
    ["Purchased Date", formatDate(batch?.purchased_date)],
    ["Expiry Date", formatDate(batch?.expiry_date)],
    ["Supplier", batch?.supplier ?? "-"],
    ["Cost Price", batch?.cost_price ?? "-"],
    ["Note", batch?.note ?? "-"],
  ];
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) return false;

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${escapeHtml(item.name)} Inventory Report</title>
        <style>
          body { color: #111827; font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #046C3F; font-size: 24px; margin-bottom: 4px; }
          p { color: #4B5563; margin-top: 0; }
          table { border-collapse: collapse; margin-top: 24px; width: 100%; }
          th, td { border: 1px solid #E5E7EB; padding: 12px; text-align: left; }
          th { background: #F6F7FC; width: 32%; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(item.name)} Inventory Report</h1>
        <p>Generated from PHC Pharmacist Dashboard</p>
        <table>
          <tbody>
            ${printableRows
              .map(
                ([label, value]) =>
                  `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  return true;
}

function InventoryActionMenu({
  row,
  onExport,
}: {
  row: DrugStockItem;
  onExport: (item: DrugStockItem) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const top =
        rect.bottom + 150 > window.innerHeight
          ? rect.top + window.scrollY - 150 - 4
          : rect.bottom + window.scrollY + 4;
      const left = Math.max(
        12 + window.scrollX,
        rect.right - 192 + window.scrollX,
      );
      setCoords({ top, left });
    }
    setOpen((c) => !c);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
      >
        <MoreHorizontal size={18} />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: coords.top, left: coords.left }}
            className="absolute z-[999] w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
          >
            <button
              onClick={() => {
                router.push(`/pharmacist-dashboard/inventory/${row.id}`);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye size={18} /> View
            </button>
            <button
              onClick={() => {
                onExport(row);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Download size={18} /> Export
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

export default function DrugStockListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const statusFilter = searchParams.get("status") || "All Status";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";

  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);
  const [toastMessage, setToastMessage] = useState("");

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

  const { data: stats, isLoading: isLoadingStats } = useInventoryStats();
  const { data: drugsData, isLoading } = useInventoryDrugs({
    page,
    page_size: pageSize,
    status: statusFilter,
    search: searchParams.get("search") || undefined,
    start_date,
    end_date,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Status") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const stockStats = [
    {
      title: "Total Drugs",
      value: isLoadingStats ? "..." : stats?.total_items || 0,
      icon: Pill,
      active: true,
    },
    {
      title: "Low Stock Items",
      value: isLoadingStats ? "..." : stats?.low_stock_items || 0,
      icon: PackagePlus,
    },
    {
      title: "Out of Stock",
      value: isLoadingStats ? "..." : stats?.out_of_stock_items || 0,
      icon: PackagePlus,
    },
    {
      title: "Expiring Soon",
      value: isLoadingStats ? "..." : stats?.expiring_soon_items || 0,
      icon: PackagePlus,
    },
  ];

  const columns: ColumnDef<DrugStockItem>[] = [
    { header: "Drug Name", accessorKey: "name", sortable: true },
    {
      header: "Classification",
      accessorKey: "drug_classification",
      sortable: true,
    },
    { header: "Item Type", accessorKey: "item_type", sortable: true },
    { header: "Total Stock", accessorKey: "total_stock", sortable: true },
    { header: "Threshold", accessorKey: "global_threshold", sortable: true },
    {
      header: "Active Batches",
      sortable: true,
      render: (row) => row.active_batches?.length || 0,
    },
    {
      header: "Status",
      sortable: true,
      render: (row) => badge(row.status),
    },
    {
      header: "Action",
      render: (row) => (
        <InventoryActionMenu
          row={row}
          onExport={(item) => {
            const didPrint = printDrugStockItem(item);
            if (!didPrint) {
              setToastMessage(
                "Unable to open the print window. Please allow pop-ups.",
              );
              window.setTimeout(() => setToastMessage(""), 3500);
            }
          }}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Inventory"
        breadcrumbs={[{ label: "Inventory" }]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
              Inventory
            </h1>
            <p className="text-base text-[#3F3F46]">
              Drug stock levels, batches and expiry tracking
            </p>
          </div>
          <button
            onClick={() => router.push("/pharmacist-dashboard/inventory/new")}
            className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-6 text-white transition-colors hover:bg-[#035a34]"
          >
            <Plus size={18} /> Add New Stock
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stockStats.map((stat) => (
            <DashboardStatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="mb-6 grid max-w-[400px] grid-cols-2 rounded-lg bg-[#EFF7F4]">
          <button className="h-10 rounded-lg bg-[#046C3F] text-base text-white">
            Drug Stock
          </button>
          <button
            onClick={() =>
              router.push("/pharmacist-dashboard/inventory/expiring")
            }
            className="h-10 rounded-lg text-base text-[#A7ADB5]"
          >
            Expiring Tracking
          </button>
        </div>

        <DataTable
          title="Drug Stock"
          data={drugsData?.results || []}
          columns={columns}
          showSearch
          searchPlaceholder="Search by drug name or category"
          onSearch={(val) => setLocalSearch(val)}
          totalPages={drugsData?.total_pages}
          emptyMessage={
            isLoading
              ? "Loading inventory..."
              : "No inventory match your criteria."
          }
          toolbarActions={
            <>
              <DateRangeFilter
                label="Last Updated"
                startDate={start_date}
                endDate={end_date}
                onApply={(start, end) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (start) params.set("start_date", start);
                  else params.delete("start_date");

                  if (end) params.set("end_date", end);
                  else params.delete("end_date");

                  params.set("page", "1");
                  router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
                onClear={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("start_date");
                  params.delete("end_date");
                  params.set("page", "1");
                  router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
              />

              <CustomDropdown
                options={STATUS_OPTIONS}
                selected={statusFilter}
                onSelect={(val) => updateUrlParams("status", val)}
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

      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 flex w-[min(390px,calc(100vw-2rem))] items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
          <span className="h-12 w-1 rounded-full bg-[#F59E0B]" />
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]">
            <Download size={14} />
          </span>
          <p className="flex-1 text-sm text-gray-700">{toastMessage}</p>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            className="border-l border-gray-100 pl-4 text-gray-900 hover:text-gray-600"
            aria-label="Dismiss export message"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
