"use client";

import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import type { ElementType, ReactNode } from "react";
import {
  Calendar,
  ChevronDown,
  ClipboardList,
  Download,
  Eye,
  Heart,
  Loader2,
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
import {
  useComprehensiveInventoryStats,
  useCreateInventoryItem,
  useInventoryItems,
  usePatchInventoryItem,
  useRefillInventoryItem,
} from "@/src/hooks/laboratory/use-inventory";
import type {
  CreateInventoryItemPayload,
  InventoryItem,
  RefillItemPayload,
} from "./types";

type Mode = "list" | "add";
type ModalState = { mode: "view" | "update"; item: InventoryItem };
type StatusLabel = "In Stock" | "Low Stock" | "Out of Stock" | "Unknown";

type InventoryFormValues = {
  name: string;
  itemType: string;
  thresholdType: string;
  globalThreshold: string;
  scheduleRules: string;
  batchNumber: string;
  initialQuantity: string;
  purchasedDate: string;
  expiryDate: string;
  supplier: string;
  costPrice: string;
  note: string;
};

const LAB_INVENTORY_CATEGORY = "LAB_EQUIPMENT";
const STATUS_OPTIONS = ["All Status", "In Stock", "Low Stock", "Out of Stock"];
const STATUS_FILTERS: Record<string, string | undefined> = {
  "All Status": undefined,
  "In Stock": "IN_STOCK",
  "Low Stock": "LOW_STOCK",
  "Out of Stock": "OUT_OF_STOCK",
};

const statusColors: Record<StatusLabel, { bg: string; text: string }> = {
  "In Stock": { bg: "#DFF3EA", text: "#039855" },
  "Low Stock": { bg: "#FFF4E5", text: "#1F2937" },
  "Out of Stock": { bg: "#FDE8E8", text: "#F33131" },
  Unknown: { bg: "#EEF2F7", text: "#475569" },
};

const initialFormValues: InventoryFormValues = {
  name: "",
  itemType: "CONSUMABLE",
  thresholdType: "GLOBAL",
  globalThreshold: "",
  scheduleRules: "{}",
  batchNumber: "",
  initialQuantity: "",
  purchasedDate: "",
  expiryDate: "",
  supplier: "",
  costPrice: "",
  note: "",
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function getStatusLabel(status?: string): StatusLabel {
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

function getPrimaryBatch(item: InventoryItem) {
  return item.active_batches?.[0] ?? null;
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

function buildItemPayload(values: InventoryFormValues): CreateInventoryItemPayload {
  return {
    name: values.name.trim(),
    inventory_category: LAB_INVENTORY_CATEGORY,
    drug_classification: "NORMAL",
    item_type: values.itemType.trim(),
    threshold_type: values.thresholdType.trim(),
    global_threshold: Number(values.globalThreshold),
    schedule_rules: values.scheduleRules.trim() || "{}",
  };
}

function buildRefillPayload(values: InventoryFormValues): RefillItemPayload {
  return {
    batch_number: values.batchNumber.trim(),
    initial_quantity: Number(values.initialQuantity),
    purchased_date: values.purchasedDate,
    expiry_date: values.expiryDate,
    supplier: values.supplier.trim(),
    cost_price: values.costPrice.trim(),
    note: values.note.trim() || undefined,
  };
}

function hasAnyRefillValue(values: InventoryFormValues) {
  return Boolean(
    values.batchNumber ||
      values.initialQuantity ||
      values.purchasedDate ||
      values.expiryDate ||
      values.supplier ||
      values.costPrice ||
      values.note,
  );
}

function hasCompleteRefillValues(values: InventoryFormValues) {
  return Boolean(
    values.batchNumber &&
      values.initialQuantity &&
      values.purchasedDate &&
      values.expiryDate &&
      values.supplier &&
      values.costPrice,
  );
}

function getInitialValues(item?: InventoryItem): InventoryFormValues {
  const batch = item ? getPrimaryBatch(item) : null;

  return {
    name: item?.name ?? "",
    itemType: item?.item_type ?? initialFormValues.itemType,
    thresholdType: item?.threshold_type ?? initialFormValues.thresholdType,
    globalThreshold:
      item?.global_threshold === undefined ? "" : String(item.global_threshold),
    scheduleRules: item?.schedule_rules ?? initialFormValues.scheduleRules,
    batchNumber: batch?.batch_number ?? "",
    initialQuantity:
      batch?.remaining_quantity === undefined
        ? ""
        : String(batch.remaining_quantity),
    purchasedDate: batch?.purchased_date ?? "",
    expiryDate: batch?.expiry_date ?? "",
    supplier: batch?.supplier ?? "",
    costPrice: batch?.cost_price ?? "",
    note: batch?.note ?? "",
  };
}

function printInventoryItem(item: InventoryItem) {
  const batch = getPrimaryBatch(item);
  const status = getStatusLabel(item.status);
  const printableRows = [
    ["Item Name", item.name],
    ["Status", status],
    ["Inventory Category", item.inventory_category],
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
        <p>Generated from PHC Lab Dashboard</p>
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
        <span
          className={`flex items-center gap-1 text-xs ${
            active ? "text-white" : "text-gray-300"
          }`}
        >
          This Week <ChevronDown size={14} />
        </span>
      </div>
      <p className={`mb-3 text-sm ${active ? "text-white" : "text-gray-400"}`}>
        {title}
      </p>
      <p
        className={`text-3xl font-semibold ${
          active ? "text-white" : "text-gray-800"
        }`}
      >
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
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  icon?: ReactNode;
  readOnly?: boolean;
  type?: string;
  onChange: (value: string) => void;
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
          type={type}
          readOnly={readOnly}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 w-full bg-transparent text-base text-gray-500 outline-none placeholder:text-gray-400"
        />
      </span>
    </label>
  );
}

function Notes({
  value,
  readOnly,
  onChange,
}: {
  value: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className={`block rounded-lg border border-gray-300 px-4 py-3 ${
        readOnly ? "bg-gray-100" : "bg-white"
      }`}
    >
      <span className="block text-xs text-gray-500">Notes (Optional)</span>
      <textarea
        readOnly={readOnly}
        value={value}
        placeholder="Additional notes"
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-32 w-full resize-none bg-transparent text-base text-gray-500 outline-none placeholder:text-gray-400"
      />
    </label>
  );
}

function InventoryForm({
  title,
  initialValues = initialFormValues,
  submitLabel,
  readOnly,
  isSubmitting,
  onCancel,
  onExport,
  onSubmit,
}: {
  title: string;
  initialValues?: InventoryFormValues;
  submitLabel: string;
  readOnly?: boolean;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onExport?: () => void;
  onSubmit?: (values: InventoryFormValues) => void;
}) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (field: keyof InventoryFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(values);
      }}
      className="rounded-xl bg-white px-6 py-8 lg:px-8"
    >
      {title && (
        <div className="mb-8 flex items-center gap-3">
          <ClipboardList size={24} className="text-[#046C3F]" />
          <h2 className="text-xl font-semibold text-black">{title}</h2>
        </div>
      )}

      <div className="grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-2">
        <Field
          label="Name of Item"
          value={values.name}
          placeholder="Search"
          icon={<Search size={24} />}
          readOnly={readOnly}
          onChange={(value) => handleChange("name", value)}
        />
        <Field
          label="Item Type"
          value={values.itemType}
          placeholder="e.g. CONSUMABLE"
          readOnly={readOnly}
          onChange={(value) => handleChange("itemType", value)}
        />
        <Field
          label="Threshold Type"
          value={values.thresholdType}
          placeholder="e.g. GLOBAL"
          readOnly={readOnly}
          onChange={(value) => handleChange("thresholdType", value)}
        />
        <Field
          label="Threshold"
          value={values.globalThreshold}
          type="number"
          readOnly={readOnly}
          onChange={(value) => handleChange("globalThreshold", value)}
        />
        <Field
          label="Batch Number"
          value={values.batchNumber}
          placeholder="Enter Batch Number"
          readOnly={readOnly}
          onChange={(value) => handleChange("batchNumber", value)}
        />
        <Field
          label="Quantity Added"
          value={values.initialQuantity}
          type="number"
          readOnly={readOnly}
          onChange={(value) => handleChange("initialQuantity", value)}
        />
        <Field
          label="Purchase Date"
          value={values.purchasedDate}
          type="date"
          icon={<Calendar size={22} />}
          readOnly={readOnly}
          onChange={(value) => handleChange("purchasedDate", value)}
        />
        <Field
          label="Expiry Date"
          value={values.expiryDate}
          type="date"
          icon={<Calendar size={22} />}
          readOnly={readOnly}
          onChange={(value) => handleChange("expiryDate", value)}
        />
        <Field
          label="Supplier(Optional)"
          value={values.supplier}
          placeholder="Enter Supplier"
          readOnly={readOnly}
          onChange={(value) => handleChange("supplier", value)}
        />
        <Field
          label="Cost Price"
          value={values.costPrice}
          placeholder="0.00"
          readOnly={readOnly}
          onChange={(value) => handleChange("costPrice", value)}
        />
        <Field
          label="Schedule Rules"
          value={values.scheduleRules}
          placeholder="{}"
          readOnly={readOnly}
          onChange={(value) => handleChange("scheduleRules", value)}
        />
        <div className="md:col-span-2">
          <Notes
            value={values.note}
            readOnly={readOnly}
            onChange={(value) => handleChange("note", value)}
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col justify-end gap-4 sm:flex-row">
        {readOnly ? (
          <button
            type="button"
            onClick={onExport}
            className="flex h-14 items-center justify-center gap-3 rounded-xl border border-[#046C3F] px-16 text-lg font-medium text-[#046C3F]"
          >
            <Download size={22} /> Export File
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="h-14 rounded-xl bg-[#BEC1CB] px-16 text-lg font-medium text-white disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-16 text-lg font-medium text-white disabled:opacity-70"
            >
              {isSubmitting && <Loader2 size={20} className="animate-spin" />}
              {submitLabel}
            </button>
          </>
        )}
      </div>
    </form>
  );
}

function InventoryModal({
  mode,
  item,
  isSubmitting,
  onClose,
  onExport,
  onSubmit,
}: {
  mode: "view" | "update";
  item: InventoryItem;
  isSubmitting?: boolean;
  onClose: () => void;
  onExport: (item: InventoryItem) => void;
  onSubmit: (item: InventoryItem, values: InventoryFormValues) => void;
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
              {mode === "view" ? `View ${item.name}` : `Update ${item.name}`}
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
          key={`${mode}-${item.id}`}
          title=""
          initialValues={getInitialValues(item)}
          submitLabel="Update Item"
          readOnly={mode === "view"}
          isSubmitting={isSubmitting}
          onCancel={onClose}
          onExport={() => onExport(item)}
          onSubmit={(values) => onSubmit(item, values)}
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
}: {
  item: InventoryItem;
  onView: (item: InventoryItem) => void;
  onUpdate: (item: InventoryItem) => void;
  onExport: (item: InventoryItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.right - 210 });
    }
    setOpen((value) => !value);
  };

  const actionClass =
    "flex w-full items-center gap-3 px-5 py-3 text-left text-base text-gray-700 hover:bg-gray-50";

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
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: 210,
            }}
            className="z-[9999] rounded-lg border border-gray-200 bg-white py-3 shadow-xl"
          >
            <button
              className={actionClass}
              onClick={() => {
                setOpen(false);
                onView(item);
              }}
            >
              <Eye size={20} /> View
            </button>
            <button
              className={actionClass}
              onClick={() => {
                setOpen(false);
                onUpdate(item);
              }}
            >
              <Plus size={20} /> Update Item
            </button>
            <button
              className={actionClass}
              onClick={() => {
                setOpen(false);
                onExport(item);
              }}
            >
              <Download size={20} /> Export
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

export default function Inventory() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;

  const [mode, setMode] = useState<Mode>("list");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  const statsFilters = useMemo(
    () => ({
      inventory_category: LAB_INVENTORY_CATEGORY,
      start_date: startDate,
      end_date: endDate,
    }),
    [startDate, endDate],
  );
  const inventoryFilters = useMemo(
    () => ({
      page,
      page_size: pageSize,
      search,
      status: STATUS_FILTERS[status],
      start_date: startDate,
      end_date: endDate,
      inventory_category: LAB_INVENTORY_CATEGORY,
    }),
    [page, pageSize, search, status, startDate, endDate],
  );

  const { data: statsData } = useComprehensiveInventoryStats(statsFilters);
  const { data: itemsData, isLoading: isLoadingItems } =
    useInventoryItems(inventoryFilters);
  const createItemMutation = useCreateInventoryItem();
  const refillItemMutation = useRefillInventoryItem();
  const patchItemMutation = usePatchInventoryItem();

  const isSubmitting =
    createItemMutation.isPending ||
    refillItemMutation.isPending ||
    patchItemMutation.isPending;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  const handleExport = (item: InventoryItem) => {
    const didPrint = printInventoryItem(item);
    if (!didPrint) {
      showToast("Unable to open the print window. Please allow pop-ups.");
      return;
    }
    showToast(`${item.name} export opened`);
  };

  const handleCreate = async (values: InventoryFormValues) => {
    setFormError("");

    if (
      !values.name ||
      !values.itemType ||
      !values.thresholdType ||
      !values.globalThreshold ||
      !hasCompleteRefillValues(values)
    ) {
      setFormError("Please complete all required fields to add new stock.");
      return;
    }

    try {
      const created = await createItemMutation.mutateAsync(
        buildItemPayload(values),
      );

      if (!created.id) {
        setFormError("Inventory item was created, but its ID was not returned.");
        return;
      }

      await refillItemMutation.mutateAsync({
        id: created.id,
        payload: buildRefillPayload(values),
      });

      setMode("list");
      showToast("New item added successfully");
    } catch (error) {
      setFormError(
        getErrorMessage(error, "Failed to add inventory item. Please try again."),
      );
    }
  };

  const handleUpdate = async (
    item: InventoryItem,
    values: InventoryFormValues,
  ) => {
    setFormError("");

    if (
      !values.name ||
      !values.itemType ||
      !values.thresholdType ||
      !values.globalThreshold
    ) {
      setFormError("Please complete the required item fields.");
      return;
    }

    if (hasAnyRefillValue(values) && !hasCompleteRefillValues(values)) {
      setFormError("Complete all batch fields before refilling stock.");
      return;
    }

    try {
      await patchItemMutation.mutateAsync({
        id: item.id,
        payload: buildItemPayload(values),
      });

      if (hasCompleteRefillValues(values)) {
        await refillItemMutation.mutateAsync({
          id: item.id,
          payload: buildRefillPayload(values),
        });
      }

      setModal(null);
      showToast(`${item.name} updated successfully`);
    } catch (error) {
      setFormError(
        getErrorMessage(error, "Failed to update inventory item. Please try again."),
      );
    }
  };

  const stats = [
    {
      title: "Total Item",
      value: statsData?.total_items || 0,
      icon: ClipboardList,
      active: true,
    },
    {
      title: "Low Stock Items",
      value: statsData?.low_stock_items || 0,
      icon: ShieldAlert,
    },
    {
      title: "Out of Stock",
      value: statsData?.out_of_stock_items || 0,
      icon: PackageCheck,
    },
    {
      title: "Expiring Soon",
      value: statsData?.expiring_soon_items || 0,
      icon: Timer,
    },
  ];

  const columns: ColumnDef<InventoryItem>[] = [
    { header: "Item", accessorKey: "name", sortable: true },
    {
      header: "Batch",
      sortable: true,
      render: (row) => getPrimaryBatch(row)?.batch_number || "-",
    },
    { header: "Qty", accessorKey: "total_stock", sortable: true },
    { header: "Threshold", accessorKey: "global_threshold", sortable: true },
    {
      header: "Expiry",
      sortable: true,
      render: (row) => formatDate(getPrimaryBatch(row)?.expiry_date),
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
      header: "Last Updated",
      sortable: true,
      render: (row) =>
        formatDate(getPrimaryBatch(row)?.updated_at ?? row.active_batches?.[0]?.created_at),
    },
    {
      header: "Action",
      sortable: false,
      render: (row) => (
        <ActionMenu
          item={row}
          onView={(selected) => {
            setFormError("");
            setModal({ mode: "view", item: selected });
          }}
          onUpdate={(selected) => {
            setFormError("");
            setModal({ mode: "update", item: selected });
          }}
          onExport={handleExport}
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
          <LabBackButton
            onClick={() => {
              setFormError("");
              setMode("list");
            }}
          />
          {formError && (
            <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {formError}
            </div>
          )}
          <InventoryForm
            title="Add New Item"
            submitLabel="Add Item"
            isSubmitting={isSubmitting}
            onCancel={() => {
              setFormError("");
              setMode("list");
            }}
            onSubmit={handleCreate}
          />
        </div>
        {toast && (
          <Toast
            title={toast}
            description="Lab inventory changes saved"
            onClose={() => setToast(null)}
          />
        )}
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
            onClick={() => {
              setFormError("");
              setMode("add");
            }}
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
          title="Lab Stock"
          data={itemsData?.results || []}
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
            </>
          }
          totalPages={itemsData?.total_pages}
          emptyMessage={
            isLoadingItems
              ? "Loading inventory items..."
              : "No inventory items match your criteria."
          }
        />
      </div>

      {modal && (
        <>
          {formError && (
            <div className="fixed left-1/2 top-6 z-[10000] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-lg">
              {formError}
            </div>
          )}
          <InventoryModal
            mode={modal.mode}
            item={modal.item}
            isSubmitting={isSubmitting}
            onClose={() => {
              setFormError("");
              setModal(null);
            }}
            onExport={handleExport}
            onSubmit={handleUpdate}
          />
        </>
      )}
      {toast && (
        <Toast
          title={toast}
          description="Inventory changes saved"
          onClose={() => setToast(null)}
        />
      )}
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
