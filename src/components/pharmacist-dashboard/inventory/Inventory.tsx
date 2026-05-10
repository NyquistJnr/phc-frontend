"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Eye,
  MoreHorizontal,
  PackagePlus,
  Pill,
  Plus,
  Search,
  X,
} from "lucide-react";
import DashboardStatCard from "@/src/components/generic/dashboard/DashboardStatCard";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import PharmacistBackButton from "@/src/components/pharmacist-dashboard/generics/PharmacistBackButton";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import {
  DRUG_OPTIONS,
  EXPIRING_DRUGS,
  ExpiringDrugRow,
  PHARMACY_INVENTORY,
  PharmacyInventoryRow,
  PharmacyInventoryStatus,
} from "@/src/components/pharmacist-dashboard/prescriptions/pharmacyData";

type Mode = "list" | "add";
type Tab = "stock" | "expiring";

const UNITS = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Vial",
  "Ampoule",
  "Sachet",
  "Inhaler",
  "Tube",
  "Bottle",
];

const statusColors: Record<string, { bg: string; text: string }> = {
  "In Stock": { bg: "#DDF2EA", text: "#00A556" },
  "Low Stock": { bg: "#FFF1DE", text: "#2E2E2E" },
  "Out of Stock": { bg: "#FFE5E5", text: "#FF1F1F" },
};

function badge(label: string) {
  const color = statusColors[label] ?? { bg: "#F1F5F9", text: "#475569" };
  return (
    <StatusBadge
      label={label}
      bgColorHex={color.bg}
      textColorHex={color.text}
    />
  );
}

function Field({
  label,
  value,
  placeholder,
  icon,
  readOnly,
  muted,
  className = "",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  icon?: ReactNode;
  readOnly?: boolean;
  muted?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label
      className={`flex h-[58px] items-center gap-3 rounded-md border border-[#D1D5DB] px-4 ${
        muted ? "bg-[#F1F2F4]" : "bg-white"
      } ${className}`}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-[#53545C]">{label}</span>
        <input
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full bg-transparent text-base text-[#6B7280] outline-none placeholder:text-[#A7ADB5]"
        />
      </span>
    </label>
  );
}

function SelectField({
  label,
  value,
  placeholder = "Select",
  options,
  searchable,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  options: string[];
  searchable?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const visibleOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-[58px] w-full items-center justify-between rounded-md border border-[#D1D5DB] bg-white px-4 text-left"
      >
        <span className="min-w-0">
          <span className="block text-xs text-[#53545C]">{label}</span>
          <span className="mt-1 block truncate text-base text-[#6B7280]">
            {value || placeholder}
          </span>
        </span>
        <ChevronDown size={20} className="text-[#111827]" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 w-full rounded border border-gray-200 bg-white p-3 shadow-xl">
          {searchable && (
            <label className="mb-3 flex h-11 items-center gap-3 rounded-md border border-gray-200 px-3">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="w-full bg-transparent outline-none"
              />
            </label>
          )}
          <div className="max-h-80 overflow-y-auto pr-1">
            {visibleOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex w-full items-center gap-4 rounded px-2 py-3 text-left text-[#7A7F89] hover:bg-gray-50"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                    value === option
                      ? "border-[#046C3F] bg-[#046C3F] text-white"
                      : "border-gray-300"
                  }`}
                >
                  {value === option && <Check size={14} />}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InventoryModal({
  variant,
  item,
  onClose,
  onSubmit,
}: {
  variant: "view" | "update";
  item: PharmacyInventoryRow;
  onClose: () => void;
  onSubmit?: () => void;
}) {
  const muted = variant === "view";

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/20 px-4 py-10 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[1100px] rounded-xl bg-white px-6 py-8 shadow-2xl sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pill size={28} className="text-[#046C3F]" />
            <h2 className="text-2xl font-semibold text-black">
              {variant === "view"
                ? `View ${item.drugName}`
                : `Update stock for ${item.drugName}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#FFF3E7] p-2"
            aria-label="Close inventory modal"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Drug Name"
            value={item.drugName}
            icon={<Search size={24} />}
            readOnly
            muted={muted}
          />
          <Field
            label="Batch Number"
            value={variant === "view" ? "B-2723" : "B-1726"}
            readOnly
            muted={muted}
          />
          <Field
            label="Purchase Date"
            value="12/12/2020"
            icon={<CalendarDays size={20} />}
            readOnly
            muted={muted}
          />
          <Field
            label="Expiry Date"
            value="12/12/2020"
            icon={<CalendarDays size={20} />}
            readOnly
            muted={muted}
          />
          <Field
            label="Drug Category"
            value={variant === "view" ? "Antibiotic" : ""}
            placeholder="e.g Antibiotic"
            readOnly={variant === "view"}
            muted={muted}
          />
          <Field
            label="Quantity Added"
            value={variant === "view" ? "60" : "76"}
            readOnly={variant === "view"}
            muted={muted}
          />
          <Field
            label="Threshold"
            value="20"
            readOnly={variant === "view"}
            muted={muted}
          />
          <Field
            label="Supplier"
            value="Medplus"
            readOnly={variant === "view"}
            muted={muted}
          />
          <Field
            label="Cost Price"
            value="NGN 1,500"
            readOnly={variant === "view"}
            muted={muted}
          />
          <SelectField
            label="Unit"
            value={item.unit}
            options={UNITS}
            onChange={() => undefined}
          />
        </div>

        <div className="mt-6 max-w-[770px]">
          <Field
            label="Notes (Optional)"
            value={variant === "view" ? "Filled" : ""}
            placeholder="Additional notes"
            readOnly={variant === "view"}
            muted={muted}
            className="h-40 items-start py-4"
          />
        </div>

        {variant === "view" ? (
          <div className="mt-8 flex max-w-[770px] justify-end">
            <button className="inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-[#046C3F] px-16 text-lg font-medium text-[#046C3F]">
              <Download size={22} />
              Export File
            </button>
          </div>
        ) : (
          <div className="mt-8 flex max-w-[770px] flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-14 rounded-lg bg-[#C1C4CE] px-16 text-xl font-medium text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="h-14 rounded-lg bg-[#046C3F] px-10 text-xl font-medium text-white"
            >
              Update Stock
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AddStockForm({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (drugName: string, unit: string) => void;
}) {
  const [drugName, setDrugName] = useState("");
  const [batch, setBatch] = useState("");
  const [qty, setQty] = useState("0");
  const [supplier, setSupplier] = useState("");
  const [unit, setUnit] = useState("");

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Inventory"
        breadcrumbs={[
          { label: "Inventory", href: "/pharmacist-dashboard/inventory" },
          { label: "Add New Item" },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <PharmacistBackButton onClick={onBack} />

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(drugName || "Metformin 500mg", unit || "Bottle");
          }}
          className="rounded-xl bg-white px-5 py-8 shadow-sm sm:px-6"
        >
          <div className="mb-8 flex items-center gap-3">
            <Pill size={28} className="text-[#046C3F]" />
            <h1 className="text-2xl font-semibold text-black">Add New Stock</h1>
          </div>

          <div className="grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-2">
            <SelectField
              label="Drug Name"
              value={drugName}
              placeholder="Auto-generated"
              options={DRUG_OPTIONS}
              searchable
              onChange={setDrugName}
            />
            <Field
              label="Batch Number"
              value={batch}
              placeholder="Enter Batch Number"
              onChange={setBatch}
            />
            <Field
              label="Purchase Date"
              value="12/12/2020"
              icon={<CalendarDays size={20} />}
              readOnly
            />
            <Field
              label="Expiry Date"
              value="12/12/2020"
              icon={<CalendarDays size={20} />}
              readOnly
            />
            <Field label="Drug Category" value="" placeholder="e.g Antibiotic" />
            <Field label="Quantity Added" value={qty} onChange={setQty} />
            <Field label="Threshold" value="0" readOnly />
            <Field
              label="Supplier"
              value={supplier}
              placeholder="Enter Supplier"
              onChange={setSupplier}
            />
            <Field label="Cost Price" value="NGN 1,500" readOnly />
            <SelectField
              label="Unit"
              value={unit}
              options={UNITS}
              searchable
              onChange={setUnit}
            />
          </div>

          <textarea
            className="mt-6 h-40 w-full max-w-[770px] resize-none rounded-md border border-[#D1D5DB] px-4 py-3 text-base outline-none placeholder:text-[#A7ADB5]"
            placeholder="Additional notes"
            aria-label="Additional notes"
          />

          <div className="mt-8 flex max-w-[770px] flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onBack}
              className="h-14 rounded-lg bg-[#C1C4CE] px-16 text-xl font-medium text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-14 rounded-lg bg-[#046C3F] px-12 text-xl font-medium text-white"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Inventory() {
  const [mode, setMode] = useState<Mode>("list");
  const [tab, setTab] = useState<Tab>("stock");
  const [rows, setRows] = useState(PHARMACY_INVENTORY);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [unit, setUnit] = useState("All Unit");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<PharmacyInventoryRow | null>(
    null,
  );
  const [modal, setModal] = useState<"view" | "update" | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !term ||
        [row.drugName, row.batch, row.unit, row.status]
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesStatus = status === "All Status" || row.status === status;
      const matchesUnit = unit === "All Unit" || row.unit === unit;
      return matchesSearch && matchesStatus && matchesUnit;
    });
  }, [rows, search, status, unit]);

  const filteredExpiring = useMemo(() => {
    const term = search.trim().toLowerCase();
    return EXPIRING_DRUGS.filter((row) => {
      const matchesSearch =
        !term ||
        [row.drugName, row.batch, row.unit]
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesUnit = unit === "All Unit" || row.unit === unit;
      return matchesSearch && matchesUnit;
    });
  }, [search, unit]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

  if (mode === "add") {
    return (
      <AddStockForm
        onBack={() => setMode("list")}
        onSubmit={(drugName, selectedUnit) => {
          setRows((current) => [
            {
              drugName,
              batch: "B-3402",
              unit: selectedUnit,
              qty: 56,
              threshold: 15,
              price: "NGN 1,500",
              expiry: "2030-01-01",
              status: "In Stock",
              updated: "Today",
            },
            ...current,
          ]);
          setMode("list");
          showToast(`${drugName} added to drug stock`);
        }}
      />
    );
  }

  const stockColumns: ColumnDef<PharmacyInventoryRow>[] = [
    { header: "Drug Name", accessorKey: "drugName", sortable: true },
    { header: "Batch", accessorKey: "batch", sortable: true },
    { header: "Unit", accessorKey: "unit", sortable: true },
    { header: "Qty", accessorKey: "qty", sortable: true },
    { header: "Threshold", accessorKey: "threshold", sortable: true },
    { header: "Price", accessorKey: "price", sortable: true },
    {
      header: "Status",
      sortable: true,
      render: (row) => badge(row.status),
    },
    { header: "Last Updated", accessorKey: "updated", sortable: true },
    {
      header: "Action",
      sortable: true,
      render: (row) => {
        const rowIndex = rows.indexOf(row);
        return (
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === rowIndex ? null : rowIndex)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
              aria-label="Inventory actions"
            >
              <MoreHorizontal size={18} />
            </button>
            {openMenu === rowIndex && (
              <div className="absolute right-0 top-9 z-30 w-48 rounded border border-gray-200 bg-white p-3 shadow-xl">
                <button
                  onClick={() => {
                    setSelectedItem(row);
                    setModal("view");
                    setOpenMenu(null);
                  }}
                  className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-gray-700 hover:bg-gray-50"
                >
                  <Eye size={18} /> View
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(row);
                    setModal("update");
                    setOpenMenu(null);
                  }}
                  className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-gray-700 hover:bg-gray-50"
                >
                  <PackagePlus size={18} /> Update Stock
                </button>
                <button className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-gray-700 hover:bg-gray-50">
                  <Download size={18} /> Export
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const expiringColumns: ColumnDef<ExpiringDrugRow>[] = [
    { header: "Drug Name", accessorKey: "drugName", sortable: true },
    { header: "Batch", accessorKey: "batch", sortable: true },
    { header: "Unit", accessorKey: "unit", sortable: true },
    { header: "Qty", accessorKey: "qty", sortable: true },
    { header: "Expiry", accessorKey: "expiry", sortable: true },
    { header: "Days left", accessorKey: "daysLeft", sortable: true },
  ];

  const stockStats = [
    {
      title: "Total Drugs",
      value: 0,
      icon: Pill,
      active: true,
    },
    { title: "Low Stock Items", value: 0, icon: PackagePlus },
    { title: "Out of Stock", value: 0, icon: PackagePlus },
    { title: "Expiring Soon", value: 0, icon: PackagePlus },
  ];

  const expiryStats = [
    { title: "Expiring in 30 days", value: 0, icon: CalendarDays, active: true },
    { title: "Expiring in 60 days", value: 0, icon: CalendarDays },
    { title: "Expiring in 90 days", value: 0, icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Inventory"
        breadcrumbs={[
          { label: "Inventory" },
          ...(tab === "expiring" ? [{ label: "Expiring Tracking" }] : []),
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
              {tab === "expiring" ? "Expiring Tracking" : "Inventory"}
            </h1>
            {tab === "stock" && (
              <p className="text-base text-[#3F3F46]">
                Drug stock levels, batches and expiry tracking
              </p>
            )}
          </div>
          {tab === "stock" && (
            <button
              onClick={() => setMode("add")}
              className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-6 text-white"
            >
              <Plus size={18} />
              Add New Stock
            </button>
          )}
        </div>

        <div
          className={`mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 ${
            tab === "stock" ? "xl:grid-cols-4" : "xl:grid-cols-3"
          }`}
        >
          {(tab === "stock" ? stockStats : expiryStats).map((stat) => (
            <DashboardStatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="mb-6 grid max-w-[400px] grid-cols-2 rounded-lg bg-[#EFF7F4]">
          <button
            onClick={() => setTab("stock")}
            className={`h-10 rounded-lg text-base ${
              tab === "stock"
                ? "bg-[#046C3F] text-white"
                : "text-[#A7ADB5]"
            }`}
          >
            Drug Stock
          </button>
          <button
            onClick={() => setTab("expiring")}
            className={`h-10 rounded-lg text-base ${
              tab === "expiring"
                ? "bg-[#046C3F] text-white"
                : "text-[#A7ADB5]"
            }`}
          >
            Expiring Tracking
          </button>
        </div>

        <DataTable
          title={tab === "stock" ? "Drug Stock" : "Drugs Expiring"}
          data={tab === "stock" ? filteredRows : filteredExpiring}
          columns={
            tab === "stock"
              ? (stockColumns as ColumnDef<PharmacyInventoryRow | ExpiringDrugRow>[])
              : (expiringColumns as ColumnDef<
                  PharmacyInventoryRow | ExpiringDrugRow
                >[])
          }
          showSearch
          searchPlaceholder={
            tab === "stock"
              ? "Search by patient name or ID"
              : "Search by Drug name or Batch..."
          }
          onSearch={setSearch}
          toolbarActions={
            <>
              <DateRangeFilter
                label={tab === "stock" ? "Last Updated" : "Expiry Date"}
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
              {tab === "stock" && (
                <CustomDropdown
                  options={[
                    "All Status",
                    "In Stock",
                    "Low Stock",
                    "Out of Stock",
                  ]}
                  selected={status}
                  onSelect={(value) =>
                    setStatus(value as PharmacyInventoryStatus | "All Status")
                  }
                />
              )}
              <CustomDropdown
                options={["All Unit", ...UNITS]}
                selected={unit}
                onSelect={setUnit}
              />
            </>
          }
          totalPages={68}
          emptyMessage="No inventory items match your criteria."
        />
      </div>

      {modal && selectedItem && (
        <InventoryModal
          variant={modal}
          item={selectedItem}
          onClose={() => setModal(null)}
          onSubmit={() => {
            setRows((current) =>
              current.map((item) =>
                item === selectedItem
                  ? { ...item, qty: item.qty + 76, updated: "Today" }
                  : item,
              ),
            );
            setModal(null);
            showToast(`${selectedItem.drugName} stock updated`);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-8 right-8 z-[80] flex w-[380px] max-w-[calc(100vw-2rem)] items-center gap-3 rounded border border-gray-200 bg-white p-4 shadow-xl">
          <span className="h-6 w-6 rounded-lg border border-[#9EE2BE] bg-[#DDF2EA]" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#111827]">
              {toast.includes("updated")
                ? "Stock Updated Successfully"
                : "New Drug stock added successfully"}
            </p>
            <p className="text-sm text-[#475569]">{toast}</p>
          </div>
          <button onClick={() => setToast(null)} aria-label="Close toast">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
