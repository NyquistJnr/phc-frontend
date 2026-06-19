"use client";

import { Loader2, Pill, X } from "lucide-react";
import type { PrescriptionOrder } from "./type";

export default function DispensePrescriptionModal({
  order,
  isSubmitting,
  onClose,
  onConfirm,
}: {
  order: PrescriptionOrder;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const isTerminal =
    order.status === "DISPENSED" || order.status === "CANCELLED";

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

          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Medications
            </h3>
            <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-4">
                  <p className="font-medium text-gray-900">
                    {item.custom_drug_name || item.medication_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.dosage} • {item.frequency} • {item.duration}
                  </p>
                </div>
              ))}
            </div>
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
              onClick={onConfirm}
              disabled={isSubmitting || isTerminal}
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
