"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ElementType, ReactNode } from "react";
import {
  Calendar,
  ChevronDown,
  ClipboardList,
  Download,
  Eye,
  Heart,
  MoreHorizontal,
  PackageCheck,
  Plus,
  Search,
  ShieldAlert,
  Timer,
  X,
} from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import LabBackButton from "@/src/components/lab-dashboard/generics/LabBackButton";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";

type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Expired";

type InventoryItem = {
  item: string;
  batch: string;
  qty: number;
  threshold: number;
  expiry: string;
  status: InventoryStatus;
  lastUpdated: string;
  supplier: string;
  notes: string;
};

type Mode = "list" | "add";

const INITIAL_ITEMS: InventoryItem[] = [
  ["EDTA Vacutainer Tubes", "A-2299", 34, 15, "2030-01-01", "In Stock", "2 days ago", "Medplus"],
  ["Malaria RDT Kits", "B-1187", 13, 20, "2030-01-01", "In Stock", "3 days ago", "Medplus"],
  ["Urine Strips (10-param)", "B-3402", 56, 15, "2030-01-01", "Low Stock", "7 days ago", "Medplus"],
  ["Glucose Reagent", "B-7781", 123, 10, "2030-01-01", "Out of Stock", "26 May 2026", "Medplus"],
  ["Microscope Slides", "B-9920", 234, 20, "2030-01-01", "Expired", "26 May 2026", "Medplus"],
  ["Hepatitis B Test Kits", "B-9920", 34, 20, "2030-01-01", "In Stock", "26 May 2026", "Medplus"],
  ["Lancets (sterile)", "B-9920", 76, 20, "2030-01-01", "Expired", "26 May 2026", "Medplus"],
  ["Cholesterol Reagent", "B-9920", 56, 20, "2030-01-01", "In Stock", "26 May 2026", "Medplus"],
  ["Lancets (sterile)", "B-9920", 78, 15, "2030-01-01", "Low Stock", "26 May 2026", "Medplus"],
  ["Lancets (sterile)", "B-9920", 23, 25, "2030-01-01", "Low Stock", "26 May 2026", "Medplus"],
].map(([item, batch, qty, threshold, expiry, status, lastUpdated, supplier]) => ({
  item: item as string,
  batch: batch as string,
  qty: qty as number,
  threshold: threshold as number,
  expiry: expiry as string,
  status: status as InventoryStatus,
  lastUpdated: lastUpdated as string,
  supplier: supplier as string,
  notes: "Filled",
}));

const statusColors: Record<InventoryStatus, { bg: string; text: string }> = {
  "In Stock": { bg: "#DFF3EA", text: "#039855" },
  "Low Stock": { bg: "#FFF4E5", text: "#1F2937" },
  "Out of Stock": { bg: "#FDE8E8", text: "#F33131" },
  Expired: { bg: "#FDE8E8", text: "#F33131" },
};

const stats = [
  { title: "Total Item", value: 0, icon: ClipboardList, active: true },
  { title: "Low Stock Items", value: 0, icon: ShieldAlert },
  { title: "Out of Stock", value: 0, icon: PackageCheck },
  { title: "Expiring Soon", value: 0, icon: Timer },
];

function StatCard({
  title,
  value,
  icon: Icon,
  active,
}: {
  title: string;
  value: number;
  icon: ElementType;
  active?: boolean;
}) {
  return (
    <div
      className={`min-h-36 rounded-xl p-4 ${
        active ? "bg-[#046C3F] text-white" : "bg-white text-gray-500"
      }`}
    >
      <div className="mb-8 flex items-start justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            active ? "bg-[#0B7F4D] text-white" : "bg-[#FFF7ED] text-gray-700"
          }`}
        >
          <Icon size={21} />
        </span>
        <span className={`flex items-center gap-1 text-xs ${active ? "text-white" : "text-gray-300"}`}>
          This Week <ChevronDown size={14} />
        </span>
      </div>
      <p className={`mb-3 text-sm ${active ? "text-white" : "text-gray-400"}`}>
        {title}
      </p>
      <p className={`text-3xl font-semibold ${active ? "text-white" : "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  icon,
  readOnly,
}: {
  label: string;
  value?: string | number;
  placeholder?: string;
  icon?: ReactNode;
  readOnly?: boolean;
}) {
  return (
    <label
      className={`flex min-h-[58px] items-center gap-3 rounded-lg border border-gray-300 px-4 ${
        readOnly ? "bg-gray-100" : "bg-white"
      }`}
    >
      {icon && <span className="shrink-0 text-gray-600">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-gray-500">{label}</span>
        <input
          readOnly={readOnly}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={() => undefined}
          className="mt-1 w-full bg-transparent text-base text-gray-500 outline-none placeholder:text-gray-400"
        />
      </span>
      {(label === "Threshold" || label === "Quantity Added") && (
        <span className="grid shrink-0 gap-0.5">
          <span className="flex h-5 w-10 items-center justify-center rounded bg-gray-200 text-gray-500">▲</span>
          <span className="flex h-5 w-10 items-center justify-center rounded bg-gray-200 text-gray-500">▼</span>
        </span>
      )}
    </label>
  );
}

function Notes({ value, readOnly }: { value?: string; readOnly?: boolean }) {
  return (
    <label className={`block rounded-lg border border-gray-300 px-4 py-3 ${readOnly ? "bg-gray-100" : "bg-white"}`}>
      <span className="block text-xs text-gray-500">Notes (Optional)</span>
      <textarea
        readOnly={readOnly}
        value={value}
        placeholder="Additional notes"
        onChange={() => undefined}
        className="mt-1 h-32 w-full resize-none bg-transparent text-base text-gray-500 outline-none placeholder:text-gray-400"
      />
    </label>
  );
}

function InventoryForm({
  title,
  item,
  submitLabel,
  readOnly,
  onCancel,
  onSubmit,
}: {
  title: string;
  item?: InventoryItem;
  submitLabel: string;
  readOnly?: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
}) {
  return (
    <div className="rounded-xl bg-white px-6 py-8 lg:px-8">
      {title && (
        <div className="mb-8 flex items-center gap-3">
          <ClipboardList size={24} className="text-[#046C3F]" />
          <h2 className="text-xl font-semibold text-black">{title}</h2>
        </div>
      )}

      <div className="grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-2">
        <Field label="Name of Item" value={item?.item} placeholder="Search" icon={<Search size={24} />} readOnly={readOnly} />
        <Field label="Batch Number" value={item?.batch} placeholder="Enter Batch Number" readOnly={readOnly} />
        <Field label="Purchase Date" value="12/12/2020" icon={<Calendar size={22} />} readOnly={readOnly} />
        <Field label="Expiry Date" value="12/12/2020" icon={<Calendar size={22} />} readOnly={readOnly} />
        <Field label="Threshold" value={item?.threshold ?? 0} readOnly={readOnly} />
        <Field label="Supplier(Optional)" value={item?.supplier} placeholder="Enter Supplier" readOnly={readOnly} />
        <Field label="Quantity Added" value={item?.qty ?? 0} readOnly={readOnly} />
        <div className="md:col-span-2">
          <Notes value={item?.notes} readOnly={readOnly} />
        </div>
      </div>

      <div className="mt-7 flex flex-col justify-end gap-4 sm:flex-row">
        {readOnly ? (
          <button className="flex h-14 items-center justify-center gap-3 rounded-xl border border-[#046C3F] px-16 text-lg font-medium text-[#046C3F]">
            <Download size={22} /> Export File
          </button>
        ) : (
          <>
            <button
              onClick={onCancel}
              className="h-14 rounded-xl bg-[#BEC1CB] px-16 text-lg font-medium text-white"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="h-14 rounded-xl bg-[#046C3F] px-16 text-lg font-medium text-white"
            >
              {submitLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function InventoryModal({
  mode,
  item,
  onClose,
  onSubmit,
}: {
  mode: "view" | "update";
  item: InventoryItem;
  onClose: () => void;
  onSubmit?: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/20 px-4 py-16 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl rounded-xl bg-white px-6 py-8 shadow-2xl lg:px-8">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {mode === "view" ? (
              <PackageCheck size={26} className="text-[#046C3F]" />
            ) : (
              <ClipboardList size={24} className="text-[#046C3F]" />
            )}
            <h2 className="text-xl font-semibold text-black">
              {mode === "view" ? `View ${item.item}` : `Update ${item.item}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF4E5] text-black"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <InventoryForm
          title=""
          item={mode === "update" ? { ...item, item: `View ${item.item}`, batch: "B-2723", qty: 10, threshold: 20 } : { ...item, batch: "B-2723", qty: 60, threshold: 20 }}
          submitLabel="Update Item"
          readOnly={mode === "view"}
          onCancel={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>,
    document.body,
  );
}

function ActionMenu({
  item,
  onView,
  onUpdate,
  onExport,
  onExpire,
}: {
  item: InventoryItem;
  onView: (item: InventoryItem) => void;
  onUpdate: (item: InventoryItem) => void;
  onExport: (item: InventoryItem) => void;
  onExpire: (item: InventoryItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const toggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.right - 210 });
    }
    setOpen((value) => !value);
  };

  const actionClass = "flex w-full items-center gap-3 px-5 py-3 text-left text-base text-gray-700 hover:bg-gray-50";

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggle}
        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
        aria-label="Open actions"
      >
        <MoreHorizontal size={18} />
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: coords.top, left: coords.left, width: 210 }}
            className="z-[9999] rounded-lg border border-gray-200 bg-white py-3 shadow-xl"
          >
            <button className={actionClass} onClick={() => { setOpen(false); onView(item); }}>
              <Eye size={20} /> View
            </button>
            <button className={actionClass} onClick={() => { setOpen(false); onUpdate(item); }}>
              <Plus size={20} /> Update Item
            </button>
            <button className={actionClass} onClick={() => { setOpen(false); onExport(item); }}>
              <Download size={20} /> Export
            </button>
            <button className={`${actionClass} text-[#F33131]`} onClick={() => { setOpen(false); onExpire(item); }}>
              <ShieldAlert size={21} /> Mark as expired
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

export default function Inventory() {
  const [mode, setMode] = useState<Mode>("list");
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [modal, setModal] = useState<{ mode: "view" | "update"; item: InventoryItem } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch = [item.item, item.batch].some((value) =>
        value.toLowerCase().includes(term),
      );
      const matchesStatus = status === "All Status" || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, status]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  const columns: ColumnDef<InventoryItem>[] = [
    { header: "Item", accessorKey: "item", sortable: true },
    { header: "Batch", accessorKey: "batch", sortable: true },
    { header: "Qty", accessorKey: "qty", sortable: true },
    { header: "Threshold", accessorKey: "threshold", sortable: true },
    { header: "Expiry", accessorKey: "expiry", sortable: true },
    {
      header: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge
          label={row.status}
          bgColorHex={statusColors[row.status].bg}
          textColorHex={statusColors[row.status].text}
        />
      ),
    },
    { header: "Last Updated", accessorKey: "lastUpdated", sortable: true },
    {
      header: "Action",
      sortable: true,
      render: (row) => (
        <ActionMenu
          item={row}
          onView={(selected) => setModal({ mode: "view", item: selected })}
          onUpdate={(selected) => setModal({ mode: "update", item: selected })}
          onExport={(selected) => showToast(`${selected.item} exported`)}
          onExpire={(selected) => {
            setItems((current) =>
              current.map((item) =>
                item.item === selected.item && item.batch === selected.batch
                  ? { ...item, status: "Expired" }
                  : item,
              ),
            );
            showToast(`${selected.item} marked as expired`);
          }}
        />
      ),
    },
  ];

  if (mode === "add") {
    return (
      <div className="min-h-screen bg-[#F6F7FC]">
        <LabDashboardHeader
          title="Lab Inventory"
          breadcrumbs={[{ label: "Lab Inventory" }, { label: "Add New Item" }]}
        />
        <div className="px-4 py-6 sm:px-6 lg:py-8">
          <LabBackButton onClick={() => setMode("list")} />
          <InventoryForm
            title="Add New Item"
            submitLabel="Add Item"
            onCancel={() => setMode("list")}
            onSubmit={() => {
              setItems((current) => [
                {
                  item: "Malaria RDT Kits",
                  batch: "B-2723",
                  qty: 10,
                  threshold: 20,
                  expiry: "2030-01-01",
                  status: "In Stock",
                  lastUpdated: "Today",
                  supplier: "Medplus",
                  notes: "Additional notes",
                },
                ...current,
              ]);
              setMode("list");
              showToast("New Item added successfully");
            }}
          />
        </div>
        {toast && <Toast title={toast} description="Malaria RDT Kits added to Lab inventory" onClose={() => setToast(null)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <LabDashboardHeader
        title="Lab Inventory"
        breadcrumbs={[{ label: "Lab Inventory" }]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black sm:text-3xl">
              Inventory
            </h1>
            <p className="mt-2 text-base text-[#3F3F46]">
              Monitor lab supplies, low stock and expiry
            </p>
          </div>
          <button
            onClick={() => setMode("add")}
            className="flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-10 text-base font-medium text-white"
          >
            <Heart size={21} /> Add New Item
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <DataTable
          title="Drug Stock"
          data={filteredItems}
          columns={columns}
          showSearch
          searchPlaceholder="Search by item name or Batch No"
          onSearch={setSearch}
          toolbarActions={
            <>
              <DateRangeFilter
                startDate=""
                endDate=""
                label="Last Updated"
                onApply={() => {}}
                onClear={() => {}}
              />
              <CustomDropdown
                options={["All Status", "In Stock", "Low Stock", "Out of Stock", "Expired"]}
                selected={status}
                onSelect={setStatus}
              />
            </>
          }
          totalPages={68}
          emptyMessage="No inventory items match your criteria."
        />
      </div>

      {modal && (
        <InventoryModal
          mode={modal.mode}
          item={modal.item}
          onClose={() => setModal(null)}
          onSubmit={() => {
            setModal(null);
            showToast(`${modal.item.item} updated successfully`);
          }}
        />
      )}
      {toast && <Toast title={toast} description="Inventory changes saved" onClose={() => setToast(null)} />}
    </div>
  );
}

function Toast({
  title,
  description,
  onClose,
}: {
  title: string;
  description: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex w-[390px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded border border-gray-200 bg-white p-4 shadow-xl">
      <span className="mt-0.5 h-6 w-6 rounded-lg border border-[#9ADDBA] bg-[#E8F7F0]" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button onClick={onClose} className="text-gray-900">
        <X size={18} />
      </button>
    </div>
  );
}
