"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2, PackagePlus, X } from "lucide-react";

import PharmacistBackButton from "@/src/components/pharmacist-dashboard/generics/PharmacistBackButton";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import { SelectField } from "@/src/components/nurse-dashboard/appointments/form-helpers";
import type { ScheduleRules } from "./type";

import {
  useCreateDrug,
  useRefillDrug,
} from "@/src/hooks/pharmacist/use-inventory";

function FieldShell({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F] ${className}`}
    >
      <label className="mb-1 block text-xs text-[#62636C]">{label}</label>
      {children}
    </div>
  );
}


function SuccessToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex w-[min(390px,calc(100vw-2rem))] items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
      <span className="h-12 w-1 rounded-full bg-[#039855]" />
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#A8E6C4] bg-[#E8F7F0] text-[#039855]">
        <PackagePlus size={14} />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">Stock Added</p>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="border-l border-gray-100 pl-4 text-gray-900 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  const err = error as { response?: { data?: { detail?: string; message?: string } }; message?: string } | null;
  return err?.response?.data?.detail || err?.response?.data?.message || err?.message || fallback;
}

type ScheduleType = "NONE" | "ONCE" | "RECURRING" | "VARIABLE_SEQUENCE";

type StockFormState = {
  inventoryCategory: string;
  drugClassification: string;
  drugName: string;
  itemType: string;
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

const INITIAL_FORM: StockFormState = {
  inventoryCategory: "DRUG",
  drugClassification: "NORMAL",
  drugName: "",
  itemType: "",
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
  { label: "Absolute (alert when stock ≤ N units)", value: "ABSOLUTE" },
  { label: "Percentage (alert when stock ≤ N% of initial)", value: "PERCENTAGE" },
];

const SCHEDULE_TYPE_OPTIONS = [
  { label: "No schedule", value: "NONE" },
  { label: "Once (single dose)", value: "ONCE" },
  { label: "Recurring (fixed interval)", value: "RECURRING" },
  { label: "Variable sequence (e.g. 6w, 10w, 14w)", value: "VARIABLE_SEQUENCE" },
];

const ITEM_TYPE_OPTIONS = [
  "Ampoules", "Bottles", "Boxes", "Capsules", "Cartons", "Cassettes", "Creams", 
  "Drops", "Gallons", "Grams (g)", "Inhalers", "Injections", "Kilograms (kg)", 
  "Kits", "Litres (L)", "Lotions", "Millilitres (ml)", "Needles", "Ointments", 
  "Packs", "Pairs", "Patches", "Pieces", "Reagents", "Rolls", "Sachets", 
  "Sprays", "Strips", "Suppositories", "Swabs", "Syringes", "Syrup", 
  "Tablets", "Tins", "Tubes", "Vials"
].map((u) => ({ label: u, value: u }));

function buildScheduleRules(form: StockFormState): ScheduleRules | null {
  if (form.scheduleType === "NONE" || form.inventoryCategory !== "DRUG" || form.drugClassification !== "IMMUNIZATION") {
    return null;
  }
  if (form.scheduleType === "ONCE") return { type: "ONCE" };
  if (form.scheduleType === "RECURRING") {
    const days = parseInt(form.scheduleIntervalDays);
    if (!days || days <= 0) return null;
    return { type: "RECURRING", interval_days: days };
  }
  if (form.scheduleType === "VARIABLE_SEQUENCE") {
    const intervals = form.scheduleIntervalSequence
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);
    if (intervals.length === 0) return null;
    return { type: "VARIABLE_SEQUENCE", intervals_in_days: intervals };
  }
  return null;
}

export default function CreateNewStock() {
  const router = useRouter();
  const [form, setForm] = useState<StockFormState>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const { mutate: createDrug, isPending: isCreating } = useCreateDrug();
  const { mutate: refillDrug, isPending: isRefilling } = useRefillDrug();

  const isProcessing = isCreating || isRefilling;
  const isDrug = form.inventoryCategory === "DRUG";
  const isImmunization = isDrug && form.drugClassification === "IMMUNIZATION";

  const handleChange = <K extends keyof StockFormState>(
    field: K,
    value: StockFormState[K],
  ) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      // Reset classification and schedule when switching category away from DRUG
      if (field === "inventoryCategory" && value !== "DRUG") {
        next.drugClassification = "NORMAL";
        next.scheduleType = "NONE";
      }
      // Reset schedule when switching classification away from IMMUNIZATION
      if (field === "drugClassification" && value !== "IMMUNIZATION") {
        next.scheduleType = "NONE";
      }
      return next;
    });
    setFormError("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !form.drugName ||
      !form.itemType ||
      !form.globalThreshold ||
      !form.batchNumber ||
      !form.initialQuantity ||
      !form.purchasedDate ||
      !form.supplier ||
      !form.costPrice
    ) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (isImmunization && form.scheduleType === "RECURRING" && !form.scheduleIntervalDays) {
      setFormError("Please enter the interval days for the recurring schedule.");
      return;
    }

    if (isImmunization && form.scheduleType === "VARIABLE_SEQUENCE" && !form.scheduleIntervalSequence.trim()) {
      setFormError("Please enter the interval sequence (comma-separated days).");
      return;
    }

    const scheduleRules = buildScheduleRules(form);

    createDrug(
      {
        name: form.drugName,
        inventory_category: form.inventoryCategory,
        drug_classification: isDrug ? form.drugClassification : null,
        item_type: form.itemType,
        threshold_type: form.thresholdType,
        global_threshold: Number(form.globalThreshold),
        schedule_rules: scheduleRules,
      },
      {
        onSuccess: (res) => {
          const newId = res.id;
          if (!newId) {
            setFormError("Failed to retrieve the new item ID. Please check inventory.");
            return;
          }
          refillDrug(
            {
              id: newId,
              payload: {
                batch_number: form.batchNumber,
                initial_quantity: Number(form.initialQuantity),
                purchased_date: form.purchasedDate,
                expiry_date: form.expiryDate || undefined,
                supplier: form.supplier,
                cost_price: form.costPrice,
                note: form.note || undefined,
              },
            },
            {
              onSuccess: () => {
                setToastMessage(
                  `Successfully added ${form.initialQuantity} ${form.itemType || "units"} of ${form.drugName}.`,
                );
                setTimeout(() => {
                  router.push("/pharmacist-dashboard/inventory");
                }, 2000);
              },
              onError: (error: unknown) => {
                setFormError(
                  getErrorMessage(error, "Item created, but failed to add initial batch stock."),
                );
              },
            },
          );
        },
        onError: (error: unknown) => {
          setFormError(getErrorMessage(error, "Failed to create inventory item. Please try again."));
        },
      },
    );
  };

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
        <PharmacistBackButton onClick={() => router.back()} />

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white px-5 py-8 shadow-sm sm:px-6 mt-6"
        >
          <div className="mb-8 flex items-center gap-3">
            <PackagePlus size={26} className="text-[#046C3F]" />
            <h1 className="text-2xl font-semibold text-black">Add New Stock Item</h1>
          </div>

          <div className="max-w-[800px]">
            {formError && (
              <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            {/* ── Item Details ── */}
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Item Details
            </h3>
            <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <SelectField
                label="Category"
                placeholder="Select category"
                value={form.inventoryCategory}
                onChange={(v) => handleChange("inventoryCategory", v)}
                options={INVENTORY_CATEGORY_OPTIONS}
              />

              {isDrug && (
                <SelectField
                  label="Drug Classification"
                  placeholder="Select classification"
                  value={form.drugClassification}
                  onChange={(v) => handleChange("drugClassification", v)}
                  options={DRUG_CLASSIFICATION_OPTIONS}
                />
              )}

              <FieldShell label="Item Name *">
                <input
                  value={form.drugName}
                  onChange={(e) => handleChange("drugName", e.target.value)}
                  placeholder={isDrug ? "e.g. Paracetamol 500mg" : "e.g. Malaria RDT Kit"}
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <SelectField
                label="Item Type / Unit *"
                placeholder="Select unit type"
                value={form.itemType}
                onChange={(v) => handleChange("itemType", v)}
                options={ITEM_TYPE_OPTIONS}
              />

              <SelectField
                label="Threshold Type"
                placeholder="Select threshold type"
                value={form.thresholdType}
                onChange={(v) => handleChange("thresholdType", v)}
                options={THRESHOLD_TYPE_OPTIONS}
              />

              <FieldShell label={`Low Stock Threshold${form.thresholdType === "PERCENTAGE" ? " (%)" : " (units)"} *`}>
                <input
                  type="number"
                  min="0"
                  value={form.globalThreshold}
                  onChange={(e) => handleChange("globalThreshold", e.target.value)}
                  placeholder={form.thresholdType === "PERCENTAGE" ? "e.g. 20" : "e.g. 50"}
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>
            </div>

            {/* ── Schedule Rules (only for IMMUNIZATION drugs) ── */}
            {isImmunization && (
              <>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Dosage Schedule (Optional)
                </h3>
                <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <SelectField
                    label="Schedule Type"
                    placeholder="Select schedule type"
                    value={form.scheduleType}
                    onChange={(v) => handleChange("scheduleType", v as ScheduleType)}
                    options={SCHEDULE_TYPE_OPTIONS}
                  />

                  {form.scheduleType === "RECURRING" && (
                    <FieldShell label="Interval (days) *">
                      <input
                        type="number"
                        min="1"
                        value={form.scheduleIntervalDays}
                        onChange={(e) => handleChange("scheduleIntervalDays", e.target.value)}
                        placeholder="e.g. 30"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                    </FieldShell>
                  )}

                  {form.scheduleType === "VARIABLE_SEQUENCE" && (
                    <FieldShell label="Intervals (comma-separated days) *" className="md:col-span-2">
                      <input
                        type="text"
                        value={form.scheduleIntervalSequence}
                        onChange={(e) => handleChange("scheduleIntervalSequence", e.target.value)}
                        placeholder="e.g. 42, 28, 28"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        Days after each dose. Example: 42, 28, 28 = doses at 6w, 10w, 14w.
                      </p>
                    </FieldShell>
                  )}
                </div>
              </>
            )}

            <hr className="mb-8 border-gray-100" />

            {/* ── Initial Batch ── */}
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Initial Batch Entry
            </h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FieldShell label="Batch / Lot Number *">
                <input
                  value={form.batchNumber}
                  onChange={(e) => handleChange("batchNumber", e.target.value)}
                  placeholder="e.g. LOT-2026-0041"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Quantity Received *">
                <input
                  type="number"
                  min="1"
                  value={form.initialQuantity}
                  onChange={(e) => handleChange("initialQuantity", e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Purchase Date *">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-gray-400 shrink-0" />
                  <input
                    type="date"
                    value={form.purchasedDate}
                    onChange={(e) => handleChange("purchasedDate", e.target.value)}
                    className="w-full bg-transparent text-base text-gray-700 outline-none"
                  />
                </div>
              </FieldShell>

              <FieldShell label="Expiry Date (leave blank if no expiry)">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-gray-400 shrink-0" />
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => handleChange("expiryDate", e.target.value)}
                    className="w-full bg-transparent text-base text-gray-700 outline-none"
                  />
                </div>
              </FieldShell>

              <FieldShell label="Supplier *">
                <input
                  value={form.supplier}
                  onChange={(e) => handleChange("supplier", e.target.value)}
                  placeholder="e.g. HealthMed Nigeria Ltd"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Cost Price per Unit *">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.costPrice}
                  onChange={(e) => handleChange("costPrice", e.target.value)}
                  placeholder="e.g. 4500.00"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>
            </div>

            <textarea
              value={form.note}
              onChange={(e) => handleChange("note", e.target.value)}
              className="mt-6 h-24 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-700 outline-none placeholder:text-[#A7ADB5] focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
              placeholder="Delivery note or internal remarks (optional)"
            />

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isProcessing}
                className="h-14 rounded-lg bg-[#C1C4CE] px-12 text-lg font-medium text-white transition-colors hover:bg-gray-400 disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex h-14 items-center justify-center gap-3 rounded-lg bg-[#046C3F] px-12 text-lg font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-70"
              >
                {isProcessing && <Loader2 size={20} className="animate-spin" />}
                {isCreating
                  ? "Registering item..."
                  : isRefilling
                    ? "Adding batch..."
                    : "Add to Inventory"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toastMessage && (
        <SuccessToast
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}
    </div>
  );
}
