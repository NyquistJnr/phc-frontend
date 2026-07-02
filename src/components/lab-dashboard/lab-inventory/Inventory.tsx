"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import type { ElementType, ReactNode } from "react";
import {
  Ban,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  Eye,
  Heart,
  LayoutList,
  Loader2,
  MoreHorizontal,
  PackageCheck,
  PackagePlus,
  Plus,
  RefreshCw,
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
import { SelectField as SystemSelectField } from "@/src/components/nurse-dashboard/appointments/form-helpers";
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
  PaginatedInventoryItems,
  RefillItemPayload,
} from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "list" | "add";
type ModalState =
  | { mode: "refill"; item: InventoryItem }
  | { mode: "edit"; item: InventoryItem };
type StatusLabel = "In Stock" | "Low Stock" | "Out of Stock" | "Unknown";
type ScheduleType = "NONE" | "ONCE" | "RECURRING" | "VARIABLE_SEQUENCE";

type AddItemFormValues = {
  inventoryCategory: string;
  drugClassification: string;
  name: string;
  itemType: string;
  itemTypeCustom: string;
  thresholdType: string;
  globalThreshold: string;
  scheduleType: ScheduleType;
  scheduleIntervalDays: string;
  scheduleIntervalSequence: string;
  batchNumber: string;
  initialQuantity: string;
  purchasedDate: string;
  expiryDate: string;
  supplier: string;
  costPrice: string;
  note: string;
};

type EditItemFormValues = {
  name: string;
  itemType: string;
  itemTypeCustom: string;
  thresholdType: string;
  globalThreshold: string;
};

type RefillFormValues = {
  batchNumber: string;
  initialQuantity: string;
  purchasedDate: string;
  expiryDate: string;
  supplier: string;
  costPrice: string;
  note: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const INVENTORY_CATEGORY_OPTIONS = [
  { label: "Drug / Medication", value: "DRUG" },
  { label: "Lab Equipment", value: "LAB_EQUIPMENT" },
  { label: "Consumable", value: "CONSUMABLE" },
];

const DRUG_CLASSIFICATION_OPTIONS = [
  { label: "Normal Medication", value: "NORMAL" },
  { label: "Immunization / Vaccine", value: "IMMUNIZATION" },
];

const THRESHOLD_TYPE_OPTIONS = [
  {
    label: "Absolute — alert when stock falls below N units",
    value: "ABSOLUTE",
  },
  {
    label: "Percentage — alert when stock falls below N%",
    value: "PERCENTAGE",
  },
];

const ITEM_TYPE_OPTIONS = [
  { label: "Tablets", value: "Tablets" },
  { label: "Capsules", value: "Capsules" },
  { label: "Syrup / Suspension", value: "Syrup" },
  { label: "Vials", value: "Vials" },
  { label: "Ampoules", value: "Ampoules" },
  { label: "Sachets", value: "Sachets" },
  { label: "Kits", value: "Kits" },
  { label: "Reagents", value: "Reagents" },
  { label: "Test Strips / Sticks", value: "Test Strips" },
  { label: "Slides", value: "Slides" },
  { label: "Specimen Containers", value: "Containers" },
  { label: "Tubes", value: "Tubes" },
  { label: "Gloves (Pairs)", value: "Pairs" },
  { label: "Syringes", value: "Syringes" },
  { label: "Equipment / Instruments", value: "Equipment" },
  { label: "Packs", value: "Packs" },
  { label: "Pieces", value: "Pieces" },
  { label: "Other (custom)…", value: "OTHER" },
];

const SCHEDULE_CARDS = [
  {
    value: "NONE" as ScheduleType,
    title: "No Schedule",
    description: "No specific dosing timeline for this item",
    icon: Ban,
  },
  {
    value: "ONCE" as ScheduleType,
    title: "Single Dose",
    description: "Patient receives this medication once only",
    icon: CheckCircle2,
  },
  {
    value: "RECURRING" as ScheduleType,
    title: "Fixed Interval",
    description: "Consistent gap between each dose",
    icon: RefreshCw,
  },
  {
    value: "VARIABLE_SEQUENCE" as ScheduleType,
    title: "Variable Sequence",
    description: "Different intervals between each dose",
    icon: LayoutList,
  },
];

const DEFAULT_INVENTORY_CATEGORIES = ["DRUG", "CONSUMABLE"];

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

const INITIAL_ADD_FORM: AddItemFormValues = {
  inventoryCategory: "LAB_EQUIPMENT",
  drugClassification: "NORMAL",
  name: "",
  itemType: "",
  itemTypeCustom: "",
  thresholdType: "ABSOLUTE",
  globalThreshold: "",
  scheduleType: "NONE",
  scheduleIntervalDays: "",
  scheduleIntervalSequence: "",
  batchNumber: "",
  initialQuantity: "",
  purchasedDate: "",
  expiryDate: "",
  supplier: "",
  costPrice: "",
  note: "",
};

const INITIAL_REFILL_FORM: RefillFormValues = {
  batchNumber: "",
  initialQuantity: "",
  purchasedDate: "",
  expiryDate: "",
  supplier: "",
  costPrice: "",
  note: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function formatScheduleRules(rules: InventoryItem["schedule_rules"]) {
  if (!rules) return "-";
  switch (rules.type) {
    case "ONCE":
      return "One-time dose";
    case "RECURRING":
      return `Every ${rules.interval_days} day${rules.interval_days === 1 ? "" : "s"}`;
    case "VARIABLE_SEQUENCE":
      return `${rules.intervals_in_days.join(", ")} days`;
    default:
      return "-";
  }
}

function buildScheduleRules(form: AddItemFormValues) {
  if (form.scheduleType === "NONE") return null;
  if (form.scheduleType === "ONCE") return { type: "ONCE" as const };
  if (form.scheduleType === "RECURRING") {
    const days = parseInt(form.scheduleIntervalDays);
    if (!days || days <= 0) return null;
    return { type: "RECURRING" as const, interval_days: days };
  }
  if (form.scheduleType === "VARIABLE_SEQUENCE") {
    const intervals = form.scheduleIntervalSequence
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);
    if (intervals.length === 0) return null;
    return { type: "VARIABLE_SEQUENCE" as const, intervals_in_days: intervals };
  }
  return null;
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

// ─── Shared UI Primitives ─────────────────────────────────────────────────────

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
      className={`min-h-36 rounded-xl p-4 ${active ? "bg-[#046C3F] text-white" : "bg-white text-gray-500"}`}
    >
      <div className="mb-8 flex items-start justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-[#0B7F4D] text-white" : "bg-[#FFF7ED] text-gray-700"}`}
        >
          <Icon size={21} />
        </span>
        <span
          className={`flex items-center gap-1 text-xs ${active ? "text-white" : "text-gray-300"}`}
        >
          This Week <ChevronDown size={14} />
        </span>
      </div>
      <p className={`mb-3 text-sm ${active ? "text-white" : "text-gray-400"}`}>
        {title}
      </p>
      <p
        className={`text-3xl font-semibold ${active ? "text-white" : "text-gray-800"}`}
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
      className={`flex min-h-[58px] items-center gap-3 rounded-lg border border-gray-300 px-4 ${readOnly ? "bg-gray-100" : "bg-white"}`}
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

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
      {children}
    </h3>
  );
}

function ItemTypeSelect({
  itemType,
  itemTypeCustom,
  readOnly,
  onTypeChange,
  onCustomChange,
}: {
  itemType: string;
  itemTypeCustom: string;
  readOnly?: boolean;
  onTypeChange: (v: string) => void;
  onCustomChange: (v: string) => void;
}) {
  if (readOnly) {
    const displayLabel =
      ITEM_TYPE_OPTIONS.find((o) => o.value === itemType)?.label ||
      itemTypeCustom ||
      itemType;
    return (
      <Field
        label="Item Type"
        value={displayLabel}
        readOnly
        onChange={() => {}}
      />
    );
  }
  return (
    <div>
      <SystemSelectField
        label="Item Type / Unit *"
        placeholder="Select unit type"
        options={ITEM_TYPE_OPTIONS}
        value={itemType}
        onChange={onTypeChange}
      />
      {itemType === "OTHER" && (
        <div className="mt-2">
          <Field
            label="Specify unit type *"
            value={itemTypeCustom}
            placeholder="e.g. Cuvettes"
            onChange={onCustomChange}
          />
        </div>
      )}
    </div>
  );
}

function ThresholdTypeSelect({
  value,
  readOnly,
  onChange,
}: {
  value: string;
  readOnly?: boolean;
  onChange: (v: string) => void;
}) {
  if (readOnly) {
    const label =
      THRESHOLD_TYPE_OPTIONS.find((o) => o.value === value)?.label || value;
    return (
      <Field
        label="Threshold Type"
        value={label}
        readOnly
        onChange={() => {}}
      />
    );
  }
  return (
    <SystemSelectField
      label="Threshold Type *"
      placeholder="Select threshold type"
      options={THRESHOLD_TYPE_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}

// ─── Add Item Form ────────────────────────────────────────────────────────────

function AddItemForm({
  isSubmitting,
  formError,
  onCancel,
  onSubmit,
}: {
  isSubmitting?: boolean;
  formError: string;
  onCancel: () => void;
  onSubmit: (values: AddItemFormValues) => void;
}) {
  const [form, setForm] = useState<AddItemFormValues>(INITIAL_ADD_FORM);

  const isDrug = form.inventoryCategory === "DRUG";
  const isImmunization = isDrug && form.drugClassification === "IMMUNIZATION";

  const handleChange = <K extends keyof AddItemFormValues>(
    field: K,
    value: AddItemFormValues[K],
  ) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "inventoryCategory" && value !== "DRUG") {
        next.drugClassification = "NORMAL";
        next.scheduleType = "NONE";
      }
      if (field === "drugClassification" && value !== "IMMUNIZATION") {
        next.scheduleType = "NONE";
      }
      return next;
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="rounded-xl bg-white px-5 py-8 shadow-sm sm:px-6 mt-6"
    >
      <div className="mb-8 flex items-center gap-3">
        <PackagePlus size={26} className="text-[#046C3F]" />
        <h1 className="text-2xl font-semibold text-black">
          Add New Stock Item
        </h1>
      </div>

      <div className="max-w-[800px]">
        {formError && (
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        )}

        {/* ── Item Details ── */}
        <SectionHeading>Item Details</SectionHeading>
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          <SystemSelectField
            label="Category *"
            placeholder="Select category"
            options={INVENTORY_CATEGORY_OPTIONS}
            value={form.inventoryCategory}
            onChange={(v) => handleChange("inventoryCategory", v)}
          />

          {isDrug && (
            <SystemSelectField
              label="Drug Classification *"
              placeholder="Select classification"
              options={DRUG_CLASSIFICATION_OPTIONS}
              value={form.drugClassification}
              onChange={(v) => handleChange("drugClassification", v)}
            />
          )}

          <Field
            label="Item Name *"
            value={form.name}
            placeholder={
              isDrug ? "e.g. Paracetamol 500mg" : "e.g. Malaria RDT Kit"
            }
            onChange={(v) => handleChange("name", v)}
          />

          <ItemTypeSelect
            itemType={form.itemType}
            itemTypeCustom={form.itemTypeCustom}
            onTypeChange={(v) => handleChange("itemType", v)}
            onCustomChange={(v) => handleChange("itemTypeCustom", v)}
          />

          <ThresholdTypeSelect
            value={form.thresholdType}
            onChange={(v) => handleChange("thresholdType", v)}
          />

          <Field
            label={`Low Stock Threshold${form.thresholdType === "PERCENTAGE" ? " (%)" : " (units)"} *`}
            value={form.globalThreshold}
            type="number"
            placeholder={
              form.thresholdType === "PERCENTAGE" ? "e.g. 20" : "e.g. 50"
            }
            onChange={(v) => handleChange("globalThreshold", v)}
          />
        </div>

        {/* ── Schedule Rules (Immunization only) ── */}
        {isImmunization && (
          <>
            <SectionHeading>Dosage Schedule</SectionHeading>
            <p className="mb-5 text-sm text-gray-500">
              Define how often patients should return for each dose.
            </p>
            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SCHEDULE_CARDS.map((card) => {
                const Icon = card.icon;
                const selected = form.scheduleType === card.value;
                return (
                  <div
                    key={card.value}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChange("scheduleType", card.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleChange("scheduleType", card.value);
                    }}
                    className={`flex flex-col rounded-xl border-2 p-4 text-left transition-all cursor-pointer select-none ${
                      selected
                        ? "border-[#046C3F] bg-[#F0FAF5]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          selected
                            ? "bg-[#046C3F] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          selected ? "border-[#046C3F]" : "border-gray-300"
                        }`}
                      >
                        {selected && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[#046C3F]" />
                        )}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-semibold ${selected ? "text-[#046C3F]" : "text-gray-700"}`}
                    >
                      {card.title}
                    </span>
                    <span className="mt-0.5 text-xs text-gray-500">
                      {card.description}
                    </span>

                    {selected && card.value === "RECURRING" && (
                      <div
                        className="mt-4"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        role="presentation"
                      >
                        <Field
                          label="Days between doses *"
                          value={form.scheduleIntervalDays}
                          type="number"
                          placeholder="e.g. 30"
                          onChange={(v) =>
                            handleChange("scheduleIntervalDays", v)
                          }
                        />
                      </div>
                    )}

                    {selected && card.value === "VARIABLE_SEQUENCE" && (
                      <div
                        className="mt-4"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        role="presentation"
                      >
                        <Field
                          label="Intervals in days (comma-separated) *"
                          value={form.scheduleIntervalSequence}
                          placeholder="e.g. 42, 28, 28"
                          onChange={(v) =>
                            handleChange("scheduleIntervalSequence", v)
                          }
                        />
                        <p className="mt-2 text-xs text-gray-400">
                          Days after each dose. Example: 42, 28, 28 → doses at
                          week 6, 10, 14.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <hr className="mb-8 border-gray-100" />

        {/* ── Initial Batch ── */}
        <SectionHeading>Initial Batch Entry</SectionHeading>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Batch / Lot Number *"
            value={form.batchNumber}
            placeholder="e.g. LOT-2026-0041"
            onChange={(v) => handleChange("batchNumber", v)}
          />
          <Field
            label="Quantity Received *"
            value={form.initialQuantity}
            type="number"
            placeholder="e.g. 500"
            onChange={(v) => handleChange("initialQuantity", v)}
          />
          <Field
            label="Purchase Date *"
            value={form.purchasedDate}
            type="date"
            icon={<Calendar size={18} className="text-gray-400 shrink-0" />}
            onChange={(v) => handleChange("purchasedDate", v)}
          />
          <Field
            label="Expiry Date (leave blank if no expiry)"
            value={form.expiryDate}
            type="date"
            icon={<Calendar size={18} className="text-gray-400 shrink-0" />}
            onChange={(v) => handleChange("expiryDate", v)}
          />
          <Field
            label="Supplier *"
            value={form.supplier}
            placeholder="e.g. HealthMed Nigeria Ltd"
            onChange={(v) => handleChange("supplier", v)}
          />
          <Field
            label="Cost Price per Unit *"
            value={form.costPrice}
            type="number"
            placeholder="e.g. 4500.00"
            onChange={(v) => handleChange("costPrice", v)}
          />
        </div>

        <textarea
          value={form.note}
          onChange={(e) => handleChange("note", e.target.value)}
          className="mt-6 h-24 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-500 outline-none placeholder:text-gray-400 focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
          placeholder="Delivery note or internal remarks (optional)"
        />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-14 rounded-lg bg-[#C1C4CE] px-12 text-lg font-medium text-white transition-colors hover:bg-gray-400 disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-14 items-center justify-center gap-3 rounded-lg bg-[#046C3F] px-12 text-lg font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-70"
          >
            {isSubmitting && <Loader2 size={20} className="animate-spin" />}
            {isSubmitting ? "Adding to Inventory…" : "Add to Inventory"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ─── Refill Modal ─────────────────────────────────────────────────────────────

function RefillModal({
  item,
  isSubmitting,
  formError,
  onClose,
  onSubmit,
}: {
  item: InventoryItem;
  isSubmitting?: boolean;
  formError: string;
  onClose: () => void;
  onSubmit: (values: RefillFormValues) => void;
}) {
  const [form, setForm] = useState<RefillFormValues>(INITIAL_REFILL_FORM);
  const handle = (field: keyof RefillFormValues, value: string) =>
    setForm((c) => ({ ...c, [field]: value }));

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/20 px-4 py-16 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl rounded-xl bg-white px-6 py-8 shadow-2xl lg:px-8">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PackagePlus size={24} className="text-[#046C3F]" />
            <div>
              <h2 className="text-xl font-semibold text-black">Refill Stock</h2>
              <p className="text-sm text-gray-500">{item.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF4E5] text-black"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {formError && (
          <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-0"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="Batch / Lot Number *"
              value={form.batchNumber}
              placeholder="e.g. LOT-2026-0041"
              onChange={(v) => handle("batchNumber", v)}
            />
            <Field
              label="Quantity Received *"
              value={form.initialQuantity}
              type="number"
              placeholder="e.g. 500"
              onChange={(v) => handle("initialQuantity", v)}
            />
            <Field
              label="Purchase Date *"
              value={form.purchasedDate}
              type="date"
              icon={<Calendar size={18} className="text-gray-400 shrink-0" />}
              onChange={(v) => handle("purchasedDate", v)}
            />
            <Field
              label="Expiry Date (leave blank if no expiry)"
              value={form.expiryDate}
              type="date"
              icon={<Calendar size={18} className="text-gray-400 shrink-0" />}
              onChange={(v) => handle("expiryDate", v)}
            />
            <Field
              label="Supplier *"
              value={form.supplier}
              placeholder="e.g. HealthMed Nigeria Ltd"
              onChange={(v) => handle("supplier", v)}
            />
            <Field
              label="Cost Price per Unit *"
              value={form.costPrice}
              type="number"
              placeholder="0.00"
              onChange={(v) => handle("costPrice", v)}
            />
          </div>

          <div className="mt-5">
            <label className="block rounded-lg border border-gray-300 bg-white px-4 py-3">
              <span className="block text-xs text-gray-500">
                Notes (Optional)
              </span>
              <textarea
                value={form.note}
                placeholder="Delivery note or internal remarks"
                onChange={(e) => handle("note", e.target.value)}
                className="mt-1 h-20 w-full resize-none bg-transparent text-base text-gray-500 outline-none placeholder:text-gray-400"
              />
            </label>
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-14 rounded-xl bg-[#BEC1CB] px-14 text-lg font-medium text-white disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-14 text-lg font-medium text-white disabled:opacity-70"
            >
              {isSubmitting && <Loader2 size={20} className="animate-spin" />}
              {isSubmitting ? "Adding Stock…" : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({
  item,
  isSubmitting,
  formError,
  onClose,
  onSubmit,
}: {
  item: InventoryItem;
  isSubmitting?: boolean;
  formError: string;
  onClose: () => void;
  onSubmit: (values: EditItemFormValues) => void;
}) {
  const storedItemType = item.item_type ?? "";
  const isKnownType = ITEM_TYPE_OPTIONS.some(
    (o) => o.value !== "OTHER" && o.value === storedItemType,
  );
  const [form, setForm] = useState<EditItemFormValues>({
    name: item.name,
    itemType: isKnownType ? storedItemType : storedItemType ? "OTHER" : "",
    itemTypeCustom: isKnownType ? "" : storedItemType,
    thresholdType: item.threshold_type ?? "ABSOLUTE",
    globalThreshold:
      item.global_threshold !== undefined ? String(item.global_threshold) : "",
  });
  const handle = (field: keyof EditItemFormValues, value: string) =>
    setForm((c) => ({ ...c, [field]: value }));

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/20 px-4 py-16 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl rounded-xl bg-white px-6 py-8 shadow-2xl lg:px-8">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList size={24} className="text-[#046C3F]" />
            <h2 className="text-xl font-semibold text-black">
              Edit — {item.name}
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

        {formError && (
          <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <Field
              label="Item Name *"
              value={form.name}
              placeholder="Item name"
              onChange={(v) => handle("name", v)}
            />
          </div>

          <ItemTypeSelect
            itemType={form.itemType}
            itemTypeCustom={form.itemTypeCustom}
            onTypeChange={(v) => handle("itemType", v)}
            onCustomChange={(v) => handle("itemTypeCustom", v)}
          />

          <ThresholdTypeSelect
            value={form.thresholdType}
            onChange={(v) => handle("thresholdType", v)}
          />

          <div className="md:col-span-2">
            <Field
              label={`Low Stock Threshold${form.thresholdType === "PERCENTAGE" ? " (%)" : " (units)"} *`}
              value={form.globalThreshold}
              type="number"
              placeholder={
                form.thresholdType === "PERCENTAGE" ? "e.g. 20" : "e.g. 50"
              }
              onChange={(v) => handle("globalThreshold", v)}
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-14 rounded-xl bg-[#BEC1CB] px-14 text-lg font-medium text-white disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-14 text-lg font-medium text-white disabled:opacity-70"
            >
              {isSubmitting && <Loader2 size={20} className="animate-spin" />}
              {isSubmitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

// ─── Category Filter ──────────────────────────────────────────────────────────

function CategoryFilterDropdown({
  options,
  selected,
  onChange,
}: {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const label =
    selected.length === 0 || selected.length === options.length
      ? "All Categories"
      : options
          .filter((option) => selected.includes(option.value))
          .map((option) => option.label)
          .join(", ");

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:border-[#0a6c38] focus:outline-none focus:ring-2 focus:ring-[#0a6c38]/20 sm:w-auto sm:min-w-[180px]"
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
          <div className="py-1">
            {options.map((option) => {
              const checked = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggleValue(option.value)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    checked
                      ? "bg-[#e6f4ea] font-medium text-[#0a6c38]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      checked
                        ? "border-[#046C3F] bg-[#046C3F]"
                        : "border-gray-300"
                    }`}
                  >
                    {checked && <Check size={11} className="text-white" />}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Action Menu ──────────────────────────────────────────────────────────────

function ActionMenu({
  item,
  onView,
  onRefill,
  onEdit,
  onExport,
}: {
  item: InventoryItem;
  onView: (item: InventoryItem) => void;
  onRefill: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
  onExport: (item: InventoryItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.right - 210 });
    }
    setOpen((v) => !v);
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
                onRefill(item);
              }}
            >
              <PackagePlus size={20} /> Refill Stock
            </button>
            <button
              className={actionClass}
              onClick={() => {
                setOpen(false);
                onEdit(item);
              }}
            >
              <Plus size={20} /> Edit Item
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Inventory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;

  const [mode, setMode] = useState<Mode>("list");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [categories, setCategories] = useState<string[]>(
    DEFAULT_INVENTORY_CATEGORIES,
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

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

  const { data: statsData } = useComprehensiveInventoryStats({});
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
    if (!didPrint)
      showToast("Unable to open the print window. Please allow pop-ups.");
    else showToast(`${item.name} export opened`);
  };

  const handleCreate = async (values: AddItemFormValues) => {
    setFormError("");
    const isDrug = values.inventoryCategory === "DRUG";
    const isImmunization =
      isDrug && values.drugClassification === "IMMUNIZATION";
    const effectiveItemType =
      values.itemType === "OTHER" ? values.itemTypeCustom : values.itemType;

    if (
      !values.name ||
      !effectiveItemType ||
      !values.thresholdType ||
      !values.globalThreshold ||
      !values.batchNumber ||
      !values.initialQuantity ||
      !values.purchasedDate ||
      !values.supplier ||
      !values.costPrice
    ) {
      setFormError("Please complete all required fields to add new stock.");
      return;
    }

    if (
      isImmunization &&
      values.scheduleType === "RECURRING" &&
      !values.scheduleIntervalDays
    ) {
      setFormError(
        "Please enter the interval days for the recurring schedule.",
      );
      return;
    }

    if (
      isImmunization &&
      values.scheduleType === "VARIABLE_SEQUENCE" &&
      !values.scheduleIntervalSequence.trim()
    ) {
      setFormError("Please enter the dose intervals (comma-separated days).");
      return;
    }

    const itemPayload: CreateInventoryItemPayload = {
      name: values.name.trim(),
      inventory_category: values.inventoryCategory,
      drug_classification: isDrug ? values.drugClassification : null,
      item_type: effectiveItemType,
      threshold_type: values.thresholdType,
      global_threshold: Number(values.globalThreshold),
      schedule_rules: isImmunization
        ? (buildScheduleRules(values) as null)
        : null,
    };

    const refillPayload: RefillItemPayload = {
      batch_number: values.batchNumber.trim(),
      initial_quantity: Number(values.initialQuantity),
      purchased_date: values.purchasedDate,
      expiry_date: values.expiryDate || undefined,
      supplier: values.supplier.trim(),
      cost_price: values.costPrice.trim(),
      note: values.note.trim() || undefined,
    };

    try {
      const created = await createItemMutation.mutateAsync(itemPayload);
      if (!created.id) {
        setFormError(
          "Inventory item was created, but its ID was not returned.",
        );
        return;
      }
      await refillItemMutation.mutateAsync({
        id: created.id,
        payload: refillPayload,
      });
      setMode("list");
      showToast(`${values.name} added to inventory`);
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          "Failed to add inventory item. Please try again.",
        ),
      );
    }
  };

  const handleRefill = async (
    item: InventoryItem,
    values: RefillFormValues,
  ) => {
    setFormError("");
    if (
      !values.batchNumber ||
      !values.initialQuantity ||
      !values.purchasedDate ||
      !values.supplier ||
      !values.costPrice
    ) {
      setFormError("Please complete all required batch fields.");
      return;
    }
    try {
      await refillItemMutation.mutateAsync({
        id: item.id,
        payload: {
          batch_number: values.batchNumber.trim(),
          initial_quantity: Number(values.initialQuantity),
          purchased_date: values.purchasedDate,
          expiry_date: values.expiryDate || undefined,
          supplier: values.supplier.trim(),
          cost_price: values.costPrice.trim(),
          note: values.note.trim() || undefined,
        },
      });
      setModal(null);
      showToast(`${item.name} stock refilled`);
    } catch (error) {
      setFormError(
        getErrorMessage(error, "Failed to refill stock. Please try again."),
      );
    }
  };

  const handleEdit = async (
    item: InventoryItem,
    values: EditItemFormValues,
  ) => {
    setFormError("");
    const effectiveItemType =
      values.itemType === "OTHER" ? values.itemTypeCustom : values.itemType;
    if (
      !values.name ||
      !effectiveItemType ||
      !values.thresholdType ||
      !values.globalThreshold
    ) {
      setFormError("Please complete all required fields.");
      return;
    }
    try {
      await patchItemMutation.mutateAsync({
        id: item.id,
        payload: {
          name: values.name.trim(),
          item_type: effectiveItemType,
          threshold_type: values.thresholdType,
          global_threshold: Number(values.globalThreshold),
        },
      });
      setModal(null);
      showToast(`${item.name} updated`);
    } catch (error) {
      setFormError(
        getErrorMessage(error, "Failed to update item. Please try again."),
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
        <ActionMenu
          item={row}
          onView={(selected) =>
            router.push(`/lab-dashboard/lab-inventory/${selected.id}`)
          }
          onRefill={(selected) => {
            setFormError("");
            setModal({ mode: "refill", item: selected });
          }}
          onEdit={(selected) => {
            setFormError("");
            setModal({ mode: "edit", item: selected });
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
          <AddItemForm
            isSubmitting={isSubmitting}
            formError={formError}
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

      {/* Modals */}
      {modal?.mode === "refill" && (
        <RefillModal
          item={modal.item}
          isSubmitting={isSubmitting}
          formError={formError}
          onClose={() => {
            setFormError("");
            setModal(null);
          }}
          onSubmit={(values) => handleRefill(modal.item, values)}
        />
      )}
      {modal?.mode === "edit" && (
        <EditModal
          item={modal.item}
          isSubmitting={isSubmitting}
          formError={formError}
          onClose={() => {
            setFormError("");
            setModal(null);
          }}
          onSubmit={(values) => handleEdit(modal.item, values)}
        />
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

// ─── Toast ────────────────────────────────────────────────────────────────────

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
