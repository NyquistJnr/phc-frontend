"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  Loader2,
  PackagePlus,
  Pill,
  X,
} from "lucide-react";

import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import {
  useDrugDetail,
  useRefillDrug,
} from "@/src/hooks/pharmacist/use-inventory";
import { ActiveBatch } from "./type";

type RefillFormState = {
  batchNumber: string;
  initialQuantity: string;
  purchasedDate: string;
  expiryDate: string;
  supplier: string;
  costPrice: string;
  note: string;
};

const INITIAL_FORM: RefillFormState = {
  batchNumber: "",
  initialQuantity: "",
  purchasedDate: "",
  expiryDate: "",
  supplier: "",
  costPrice: "",
  note: "",
};

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
        <p className="text-sm font-semibold text-gray-900">
          Restock Successful
        </p>
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
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function DrugDetail() {
  const router = useRouter();
  const params = useParams();
  const drugId = params.id as string;

  const [form, setForm] = useState<RefillFormState>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const { data: drugData, isLoading: isLoadingDrug } = useDrugDetail(drugId);
  const { mutate: refillDrug, isPending: isRefilling } = useRefillDrug();

  const handleChange = <K extends keyof RefillFormState>(
    field: K,
    value: RefillFormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.batchNumber ||
      !form.initialQuantity ||
      !form.purchasedDate ||
      !form.expiryDate ||
      !form.supplier ||
      !form.costPrice
    ) {
      setFormError(
        "Please complete all required fields before submitting the restock.",
      );
      return;
    }

    refillDrug(
      {
        id: drugId,
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
          setToastMessage("Successfully refilled the inventory.");
          setForm(INITIAL_FORM);

          setTimeout(() => setToastMessage(""), 4000);
        },
        onError: (error: unknown) => {
          setFormError(
            getErrorMessage(error, "Failed to restock. Please try again."),
          );
        },
      },
    );
  };

  const handleCancel = () => {
    router.push("/pharmacist-dashboard/inventory");
  };

  const batchColumns: ColumnDef<ActiveBatch>[] = [
    { header: "Batch Number", accessorKey: "batch_number", sortable: true },
    { header: "Supplier", accessorKey: "supplier", sortable: true },
    { header: "Initial Qty", accessorKey: "initial_quantity", sortable: true },
    {
      header: "Remaining Qty",
      sortable: true,
      render: (row) => (
        <span
          className={
            (row.remaining_quantity || 0) <= 10
              ? "text-red-600 font-medium"
              : "text-gray-900"
          }
        >
          {row.remaining_quantity || 0}
        </span>
      ),
    },
    { header: "Purchased Date", accessorKey: "purchased_date", sortable: true },
    { header: "Expiry Date", accessorKey: "expiry_date", sortable: true },
  ];

  if (isLoadingDrug) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7FC]">
        <Loader2 size={32} className="animate-spin text-[#046C3F]" />
      </div>
    );
  }

  const statusColors = {
    IN_STOCK: { bg: "#DFF3EA", text: "#039855" },
    LOW_STOCK: { bg: "#FFF4E5", text: "#1F2937" },
    OUT_OF_STOCK: { bg: "#FDE8E8", text: "#F33131" },
  };

  const currentColor =
    statusColors[drugData?.status as keyof typeof statusColors] ||
    statusColors.IN_STOCK;

  return (
    <div className="min-h-screen bg-[#F6F7FC] pb-12">
      <PharmacistDashboardHeader
        title="Inventory"
        breadcrumbs={[
          { label: "Inventory", href: "/pharmacist-dashboard/inventory" },
          { label: drugData?.name || "Drug Detail" },
        ]}
      />

      <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:py-8">
        <button
          onClick={handleCancel}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft size={16} /> Back to Inventory
        </button>

        <div className="mb-7 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              {drugData?.name}
            </h2>
            <p className="text-base text-[#3F3F46]">
              View stock levels, batches, and restock inventory
            </p>
          </div>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF7F4] text-[#046C3F]">
              <Pill size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Category & Unit</p>
              <p className="font-semibold text-gray-900">
                {drugData?.drug_classification} • {drugData?.item_type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF7F4] text-[#046C3F]">
              <PackagePlus size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Stock</p>
              <p className="font-semibold text-gray-900">
                {drugData?.total_stock} {drugData?.item_type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF7F4] text-[#046C3F]">
              <CalendarDays size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Batches</p>
              <p className="font-semibold text-gray-900">
                {drugData?.active_batches?.length || 0} Batches
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Overall Status</p>
            <div>
              <StatusBadge
                label={drugData?.status.replace(/_/g, " ") || ""}
                bgColorHex={currentColor.bg}
                textColorHex={currentColor.text}
              />
            </div>
          </div>
        </div>
        <div className="mb-8">
          <DataTable
            title="Active Batches"
            data={drugData?.active_batches || []}
            columns={batchColumns}
            emptyMessage="No active batches found for this drug."
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BCAB4] text-[#046C3F]">
              <PackagePlus size={18} />
            </span>
            <h2 className="text-xl font-semibold text-black">Restock Batch</h2>
          </div>

          <div className="max-w-4xl space-y-6">
            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldShell label="Batch Number">
                <input
                  value={form.batchNumber}
                  onChange={(e) => handleChange("batchNumber", e.target.value)}
                  placeholder="e.g. BATCH201"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Initial Quantity">
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

              <FieldShell label="Purchased Date">
                <input
                  type="date"
                  value={form.purchasedDate}
                  onChange={(e) =>
                    handleChange("purchasedDate", e.target.value)
                  }
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>

              <FieldShell label="Expiry Date">
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => handleChange("expiryDate", e.target.value)}
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>

              <FieldShell label="Supplier Name">
                <input
                  value={form.supplier}
                  onChange={(e) => handleChange("supplier", e.target.value)}
                  placeholder="e.g. Evans Baroque"
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

            <FieldShell label="Notes (Optional)">
              <textarea
                value={form.note}
                onChange={(e) => handleChange("note", e.target.value)}
                placeholder="Enter notes here"
                rows={3}
                className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
              />
            </FieldShell>

            <div className="flex flex-col items-stretch gap-4 pt-1 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isRefilling}
                className="h-14 rounded-xl bg-[#B9BDC9] px-12 text-lg font-medium text-white transition-colors hover:bg-[#A9AEBC] disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRefilling}
                className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-10 text-lg font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-70"
              >
                {isRefilling ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <PackagePlus size={20} />
                )}
                {isRefilling ? "Restocking..." : "Restock"}
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
