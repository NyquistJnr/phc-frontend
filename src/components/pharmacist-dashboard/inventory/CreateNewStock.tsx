"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2, Pill, PackagePlus, X } from "lucide-react";

import PharmacistBackButton from "@/src/components/pharmacist-dashboard/generics/PharmacistBackButton";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import { UNITS } from "./Inventory";

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

type StockFormState = {
  drugName: string;
  category: string;
  unit: string;
  globalThreshold: string;
  batchNumber: string;
  initialQuantity: string;
  purchasedDate: string;
  expiryDate: string;
  supplier: string;
  costPrice: string;
  note: string;
};

const INITIAL_FORM: StockFormState = {
  drugName: "",
  category: "",
  unit: "",
  globalThreshold: "",
  batchNumber: "",
  initialQuantity: "",
  purchasedDate: "",
  expiryDate: "",
  supplier: "",
  costPrice: "",
  note: "",
};

export default function CreateNewStock() {
  const router = useRouter();
  const [form, setForm] = useState<StockFormState>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const { mutate: createDrug, isPending: isCreating } = useCreateDrug();
  const { mutate: refillDrug, isPending: isRefilling } = useRefillDrug();

  const isProcessing = isCreating || isRefilling;

  const handleChange = <K extends keyof StockFormState>(
    field: K,
    value: StockFormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !form.drugName ||
      !form.category ||
      !form.unit ||
      !form.globalThreshold ||
      !form.batchNumber ||
      !form.initialQuantity ||
      !form.purchasedDate ||
      !form.expiryDate ||
      !form.supplier ||
      !form.costPrice
    ) {
      setFormError("Please complete all required fields to add new stock.");
      return;
    }

    createDrug(
      {
        name: form.drugName,
        category: form.category,
        unit: form.unit,
        global_threshold: Number(form.globalThreshold),
      },
      {
        onSuccess: (res: any) => {
          const newDrugId = res?.data?.data?.id || res?.data?.id || res?.id;

          if (!newDrugId) {
            console.error("DEBUG - Full API Response:", res);
            setFormError(
              "Failed to retrieve new drug ID. Please check inventory.",
            );
            return;
          }
          refillDrug(
            {
              id: newDrugId,
              payload: {
                batch_number: form.batchNumber,
                initial_quantity: Number(form.initialQuantity),
                purchased_date: form.purchasedDate,
                expiry_date: form.expiryDate,
                supplier: form.supplier,
                cost_price: form.costPrice,
                note: form.note,
              },
            },
            {
              onSuccess: () => {
                setToastMessage(
                  `Successfully added ${form.initialQuantity} units of ${form.drugName}.`,
                );
                setTimeout(() => {
                  router.push("/pharmacist-dashboard/inventory");
                }, 2000);
              },
              onError: (error: any) => {
                setFormError(
                  error?.response?.data?.message ||
                    "Drug created, but failed to add batch stock.",
                );
              },
            },
          );
        },
        onError: (error: any) => {
          setFormError(
            error?.response?.data?.message ||
              "Failed to create drug item. Please try again.",
          );
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
            <Pill size={28} className="text-[#046C3F]" />
            <h1 className="text-2xl font-semibold text-black">Add New Stock</h1>
          </div>

          <div className="max-w-[800px]">
            {formError && (
              <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500 tracking-wider">
              Item Details
            </h3>
            <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <FieldShell label="Drug Name">
                <input
                  value={form.drugName}
                  onChange={(e) => handleChange("drugName", e.target.value)}
                  placeholder="e.g. Paracetamol 1000mg"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Category">
                <input
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  placeholder="e.g. Antibiotic, Painkiller"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <div className="relative flex flex-col justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F]">
                <label className="mb-1 block text-xs text-[#62636C]">
                  Unit
                </label>
                <select
                  value={form.unit}
                  onChange={(e) => handleChange("unit", e.target.value)}
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                >
                  <option value="" disabled>
                    Select Unit
                  </option>
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <FieldShell label="Low Stock Threshold">
                <input
                  type="number"
                  value={form.globalThreshold}
                  onChange={(e) =>
                    handleChange("globalThreshold", e.target.value)
                  }
                  placeholder="Alert threshold e.g. 50"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>
            </div>
            <hr className="mb-8 border-gray-100" />
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500 tracking-wider">
              Initial Batch Entry
            </h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FieldShell label="Batch Number">
                <input
                  value={form.batchNumber}
                  onChange={(e) => handleChange("batchNumber", e.target.value)}
                  placeholder="e.g. BATCH201"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Quantity Added">
                <input
                  type="number"
                  value={form.initialQuantity}
                  onChange={(e) =>
                    handleChange("initialQuantity", e.target.value)
                  }
                  placeholder="e.g. 100"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Purchase Date">
                <div className="flex items-center gap-2">
                  <CalendarDays size={20} className="text-gray-400" />
                  <input
                    type="date"
                    value={form.purchasedDate}
                    onChange={(e) =>
                      handleChange("purchasedDate", e.target.value)
                    }
                    className="w-full bg-transparent text-base text-gray-700 outline-none"
                  />
                </div>
              </FieldShell>

              <FieldShell label="Expiry Date">
                <div className="flex items-center gap-2">
                  <CalendarDays size={20} className="text-gray-400" />
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => handleChange("expiryDate", e.target.value)}
                    className="w-full bg-transparent text-base text-gray-700 outline-none"
                  />
                </div>
              </FieldShell>

              <FieldShell label="Supplier">
                <input
                  value={form.supplier}
                  onChange={(e) => handleChange("supplier", e.target.value)}
                  placeholder="Enter Supplier Name"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Cost Price">
                <input
                  type="number"
                  step="0.01"
                  value={form.costPrice}
                  onChange={(e) => handleChange("costPrice", e.target.value)}
                  placeholder="e.g. 1500.00"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>
            </div>

            <textarea
              value={form.note}
              onChange={(e) => handleChange("note", e.target.value)}
              className="mt-6 h-32 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-700 outline-none placeholder:text-[#A7ADB5] focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
              placeholder="Additional notes"
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
                  ? "Creating..."
                  : isRefilling
                    ? "Adding Batch..."
                    : "Add Item"}
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
