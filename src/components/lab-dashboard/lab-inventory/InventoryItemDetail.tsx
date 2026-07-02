"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Calendar,
  ClipboardList,
  Layers,
  Loader2,
  PackageCheck,
  PackagePlus,
  X,
} from "lucide-react";

import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import LabBackButton from "@/src/components/lab-dashboard/generics/LabBackButton";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";
import {
  useInventoryItemById,
  useRefillInventoryItem,
} from "@/src/hooks/laboratory/use-inventory";
import type { ActiveInventoryBatch, RefillItemPayload } from "./types";

type StatusLabel = "In Stock" | "Low Stock" | "Out of Stock" | "Unknown";

const statusColors: Record<StatusLabel, { bg: string; text: string }> = {
  "In Stock": { bg: "#DFF3EA", text: "#039855" },
  "Low Stock": { bg: "#FFF4E5", text: "#1F2937" },
  "Out of Stock": { bg: "#FDE8E8", text: "#F33131" },
  Unknown: { bg: "#EEF2F7", text: "#475569" },
};

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

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-base text-gray-800">{value}</p>
    </div>
  );
}

function BatchCard({ batch, index }: { batch: ActiveInventoryBatch; index: number }) {
  const rows = [
    { label: "Initial Quantity", value: String(batch.initial_quantity ?? "-") },
    { label: "Remaining Quantity", value: String(batch.remaining_quantity ?? "-") },
    { label: "Purchase Date", value: formatDate(batch.purchased_date) },
    { label: "Expiry Date", value: formatDate(batch.expiry_date) },
    { label: "Supplier", value: batch.supplier || "-" },
    { label: "Cost Price", value: batch.cost_price || "-" },
    { label: "Recorded On", value: formatDate(batch.created_at) },
    { label: "Note", value: batch.note || "-" },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">
          {batch.batch_number || `Batch ${index + 1}`}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {rows.map(({ label, value }) => (
          <DetailCell key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}

// ─── Refill Modal (relocated from Inventory.tsx for use on the detail page) ────

type RefillFormValues = {
  batchNumber: string;
  initialQuantity: string;
  purchasedDate: string;
  expiryDate: string;
  supplier: string;
  costPrice: string;
  note: string;
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

function RefillField({
  label,
  value,
  placeholder,
  icon,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-h-[58px] items-center gap-3 rounded-lg border border-gray-300 bg-white px-4">
      {icon && <span className="shrink-0 text-gray-600">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-gray-500">{label}</span>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 w-full bg-transparent text-base text-gray-500 outline-none placeholder:text-gray-400"
        />
      </span>
    </label>
  );
}

function RefillModal({
  itemName,
  isSubmitting,
  formError,
  onClose,
  onSubmit,
}: {
  itemName: string;
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
              <p className="text-sm text-gray-500">{itemName}</p>
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
            <RefillField
              label="Batch / Lot Number *"
              value={form.batchNumber}
              placeholder="e.g. LOT-2026-0041"
              onChange={(v) => handle("batchNumber", v)}
            />
            <RefillField
              label="Quantity Received *"
              value={form.initialQuantity}
              type="number"
              placeholder="e.g. 500"
              onChange={(v) => handle("initialQuantity", v)}
            />
            <RefillField
              label="Purchase Date *"
              value={form.purchasedDate}
              type="date"
              icon={<Calendar size={18} className="text-gray-400 shrink-0" />}
              onChange={(v) => handle("purchasedDate", v)}
            />
            <RefillField
              label="Expiry Date (leave blank if no expiry)"
              value={form.expiryDate}
              type="date"
              icon={<Calendar size={18} className="text-gray-400 shrink-0" />}
              onChange={(v) => handle("expiryDate", v)}
            />
            <RefillField
              label="Supplier *"
              value={form.supplier}
              placeholder="e.g. HealthMed Nigeria Ltd"
              onChange={(v) => handle("supplier", v)}
            />
            <RefillField
              label="Cost Price per Unit *"
              value={form.costPrice}
              type="number"
              placeholder="0.00"
              onChange={(v) => handle("costPrice", v)}
            />
          </div>

          <div className="mt-5">
            <label className="block rounded-lg border border-gray-300 bg-white px-4 py-3">
              <span className="block text-xs text-gray-500">Notes (Optional)</span>
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

// ─── Main Component ────────────────────────────────────────────────────────────

export default function InventoryItemDetail() {
  const params = useParams();
  const id = params.id as string;

  const { data: item, isLoading, isError } = useInventoryItemById(id);
  const refillItemMutation = useRefillInventoryItem();

  const [showRefill, setShowRefill] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  const handleRefill = async (values: RefillFormValues) => {
    if (!item) return;
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
      const payload: RefillItemPayload = {
        batch_number: values.batchNumber.trim(),
        initial_quantity: Number(values.initialQuantity),
        purchased_date: values.purchasedDate,
        expiry_date: values.expiryDate || undefined,
        supplier: values.supplier.trim(),
        cost_price: values.costPrice.trim(),
        note: values.note.trim() || undefined,
      };
      await refillItemMutation.mutateAsync({ id: item.id, payload });
      setShowRefill(false);
      showToast(`${item.name} stock refilled`);
    } catch (error) {
      setFormError(getErrorMessage(error, "Failed to refill stock. Please try again."));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F7FC]">
        <LabDashboardHeader
          title="Lab Inventory"
          breadcrumbs={[
            { label: "Lab Inventory", href: "/lab-dashboard/lab-inventory" },
            { label: "Item Detail" },
          ]}
        />
        <div className="px-4 py-6 sm:px-6 lg:py-8">
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            Loading inventory item...
          </div>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="min-h-screen bg-[#F6F7FC]">
        <LabDashboardHeader
          title="Lab Inventory"
          breadcrumbs={[
            { label: "Lab Inventory", href: "/lab-dashboard/lab-inventory" },
            { label: "Item Detail" },
          ]}
        />
        <div className="px-4 py-6 sm:px-6 lg:py-8">
          <LabBackButton />
          <div className="mt-6 rounded-xl bg-white p-10 text-center text-gray-500">
            Inventory item not found.
          </div>
        </div>
      </div>
    );
  }

  const statusLabel = getStatusLabel(item.status);
  const statusColor = statusColors[statusLabel];
  const batches = item.active_batches || [];

  const itemRows = [
    { label: "Category", value: item.inventory_category || "-" },
    { label: "Classification", value: item.drug_classification || "-" },
    { label: "Item Type", value: item.item_type || "-" },
    { label: "Threshold Type", value: item.threshold_type || "-" },
    { label: "Low Stock Threshold", value: String(item.global_threshold) },
    { label: "Total Stock", value: String(item.total_stock) },
    { label: "Schedule Rules", value: item.schedule_rules || "-" },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <LabDashboardHeader
        title="Lab Inventory"
        breadcrumbs={[
          { label: "Lab Inventory", href: "/lab-dashboard/lab-inventory" },
          { label: item.name },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <LabBackButton />

        <div className="mt-6 rounded-xl bg-white px-6 py-7 shadow-sm lg:px-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <PackageCheck size={24} className="text-[#046C3F]" />
              <h1 className="text-xl font-semibold text-black sm:text-2xl">
                {item.name}
              </h1>
              <StatusBadge
                label={statusLabel}
                bgColorHex={statusColor.bg}
                textColorHex={statusColor.text}
              />
            </div>
            <button
              onClick={() => {
                setFormError("");
                setShowRefill(true);
              }}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#046C3F] px-6 text-sm font-medium text-white"
            >
              <PackagePlus size={18} /> Refill Stock
            </button>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Item Details
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {itemRows.map(({ label, value }) => (
                <DetailCell key={label} label={label} value={value} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Layers size={16} className="text-gray-400" />
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Batches ({batches.length})
              </p>
            </div>
            {batches.length > 0 ? (
              <div className="space-y-4">
                {batches.map((batch, index) => (
                  <BatchCard key={batch.id || index} batch={batch} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-400">
                <ClipboardList size={16} />
                No batches recorded for this item yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {showRefill && (
        <RefillModal
          itemName={item.name}
          isSubmitting={refillItemMutation.isPending}
          formError={formError}
          onClose={() => {
            setFormError("");
            setShowRefill(false);
          }}
          onSubmit={handleRefill}
        />
      )}

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex w-[390px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded border border-gray-200 bg-white p-4 shadow-xl">
          <span className="mt-0.5 h-6 w-6 rounded-lg border border-[#9ADDBA] bg-[#E8F7F0]" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">{toast}</p>
            <p className="text-sm text-gray-500">Inventory changes saved</p>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-900">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
