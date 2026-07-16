"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Pill, X, CheckSquare, Square } from "lucide-react";
import type { PrescriptionOrder } from "./type";
import type { DispensePayload } from "@/src/hooks/pharmacist/use-prescriptions";

export default function DispensePrescriptionModal({
  order,
  isSubmitting,
  errorMessage,
  onClose,
  onConfirm,
}: {
  order: PrescriptionOrder;
  isSubmitting?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onConfirm: (payload: DispensePayload) => void;
}) {
  const canDispense = order.status === "PENDING" || order.status === "PARTIAL";

  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [forceComplete, setForceComplete] = useState(false);
  const [localError, setLocalError] = useState("");

  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    const initial: Record<string, string> = {};
    order.items.forEach((item) => {
      const remaining = Math.max(0, (item.quantity ?? 1) - (item.dispensed_quantity || 0));
      initial[item.id] = remaining.toString();
    });
    setQuantities(initial);
  }, [order.items]);

  useEffect(() => {
    if (errorMessage) {
      hasSubmittedRef.current = false;
      setLocalError(errorMessage);
    }
  }, [errorMessage]);

  const handleConfirm = () => {
    if (hasSubmittedRef.current || isSubmitting || !canDispense) return;

    let isValid = true;
    for (const item of order.items) {
      const remaining = Math.max(0, (item.quantity ?? 1) - (item.dispensed_quantity || 0));
      const val = parseInt(quantities[item.id] || "0", 10);
      if (isNaN(val) || val < 0 || val > remaining) {
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      setLocalError("You cannot dispense more than the remaining prescribed quantity.");
      return;
    }

    setLocalError("");
    hasSubmittedRef.current = true;

    const payload: DispensePayload = {
      items: order.items.map((item) => ({
        id: item.id,
        quantity: parseInt(quantities[item.id] || "0", 10),
      })),
      force_complete: forceComplete,
    };

    onConfirm(payload);
  };

  const handleQuantityChange = (id: string, value: string) => {
    setLocalError("");
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl rounded-xl bg-white px-6 py-8 shadow-2xl">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F7F0] text-[#046C3F]">
                <Pill size={22} />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Dispense Prescription
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {order.prescription_id} • {order.patient_name}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg bg-[#FFF3E7] p-2 text-gray-700 disabled:opacity-60"
              aria-label="Close dispense modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3 rounded-lg bg-[#F6F7FC] p-4 text-sm text-gray-600 sm:grid-cols-2">
            <div>
              <span className="block text-xs text-gray-400">Patient ID</span>
              <span className="font-medium text-gray-900">
                {order.patient_display_id}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-400">Prescribed By</span>
              <span className="font-medium text-gray-900">
                {order.prescribed_by_name}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-400">Status</span>
              <span className="font-medium text-gray-900">{order.status}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-400">Priority</span>
              <span className="font-medium text-gray-900">
                {order.priority}
              </span>
            </div>
          </div>

          {localError && (
            <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {localError}
            </div>
          )}

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Medications
            </h3>
            <p className="mb-3 text-xs text-gray-400">
              Enter the exact quantity you are dispensing right now. If an item is out of stock, enter 0.
            </p>
            <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
              {order.items.map((item) => {
                const total = item.quantity ?? 1;
                const dispensed = item.dispensed_quantity || 0;
                const remaining = Math.max(0, total - dispensed);

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.custom_drug_name || item.medication_name}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.dosage} • {item.frequency} • {item.duration}
                      </p>
                      <p className="mt-2 flex gap-3 text-xs text-gray-500">
                        <span>Total: <span className="font-medium text-gray-700">{total}</span></span>
                        <span>Dispensed: <span className="font-medium text-gray-700">{dispensed}</span></span>
                        <span>Remaining: <span className="font-medium text-green-700">{remaining}</span></span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-600">Qty to Dispense:</label>
                      <input
                        type="number"
                        min="0"
                        max={remaining}
                        value={quantities[item.id] ?? ""}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-20 rounded-md border border-gray-300 px-3 py-1.5 text-center text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
                        disabled={remaining === 0}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <button
              type="button"
              onClick={() => setForceComplete(!forceComplete)}
              className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              {forceComplete ? (
                <CheckSquare size={20} className="text-[#046C3F]" />
              ) : (
                <Square size={20} className="text-gray-400" />
              )}
              Mark as completely dispensed (Patient will purchase remainder elsewhere)
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-12 rounded-lg bg-[#C1C4CE] px-8 font-medium text-white disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting || !canDispense}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#046C3F] px-8 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              Dispense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
