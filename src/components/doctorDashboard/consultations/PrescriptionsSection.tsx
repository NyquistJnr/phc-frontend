"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2, Pill, Plus } from "lucide-react";
import { usePrescriptions } from "@/src/hooks/doctors/use-prescriptions";
import type {
  PaginatedResponse,
  PrescriptionItem,
  PrescriptionRecord,
} from "../prescriptions/types";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#FFF4E5", text: "#B45309" },
  PARTIAL: { bg: "#E2E7FF", text: "#046C3F" },
  DISPENSED: { bg: "#ECFDF5", text: "#065F46" },
  CANCELLED: { bg: "#FEF2F2", text: "#991B1B" },
};

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] || { bg: "#F3F4F6", text: "#374151" };
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: color.bg, color: color.text }}
    >
      {status}
    </span>
  );
}

function getMedicationName(item: PrescriptionItem) {
  return (
    item.drug_name ||
    item.medication_name ||
    item.custom_drug_name ||
    item.drug ||
    "Unnamed drug"
  );
}

function ExistingPrescription({ record }: { record: PrescriptionRecord }) {
  const [expanded, setExpanded] = useState(false);
  const items = record.items || [];

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <ChevronRight
            size={16}
            className={`text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
          <div>
            <p className="text-sm font-medium text-gray-800">
              {record.prescription_id || "Prescription"}
            </p>
            <p className="text-xs text-gray-500">
              {items.length} medication{items.length !== 1 ? "s" : ""}
              {items[0]
                ? ` · ${getMedicationName(items[0])}${items.length > 1 ? " + more" : ""}`
                : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {record.priority && (
            <span className="rounded border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-600">
              {record.priority}
            </span>
          )}
          <StatusBadge status={record.status || "PENDING"} />
        </div>
      </button>

      {expanded && (
        <div className="space-y-2 border-t border-gray-200 px-4 pb-3 pt-2">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center justify-between rounded-md border border-gray-100 bg-white px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {getMedicationName(item)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.dosage || "-"} · {item.frequency || "-"} ·{" "}
                    {item.duration || "-"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400">
              No medication items recorded.
            </p>
          )}
          {record.instructions && (
            <p className="pt-1 text-xs text-gray-500">
              <span className="font-medium text-gray-600">
                Instructions:{" "}
              </span>
              {record.instructions}
            </p>
          )}
          <Link
            href={`/doctor-dashboard/prescriptions/${record.id}`}
            className="inline-block pt-1 text-xs font-medium text-[#046C3F] hover:underline"
          >
            View full details →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function PrescriptionsSection({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const { data, isLoading } = usePrescriptions({
    appointment_id: appointmentId,
    page_size: 20,
  });
  const prescriptionsData = data as
    | PaginatedResponse<PrescriptionRecord>
    | undefined;
  const prescriptions = prescriptionsData?.results || [];

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F7F0] text-[#046C3F]">
            <Pill size={18} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-black">
              Prescriptions
            </h2>
            {prescriptions.length > 0 && (
              <p className="text-xs text-gray-500">
                {prescriptions.length} prescription
                {prescriptions.length !== 1 ? "s" : ""} for this appointment
              </p>
            )}
          </div>
        </div>
        <Link
          href={`/doctor-dashboard/prescriptions/new?appointment=${appointmentId}`}
          className="flex items-center gap-2 rounded-lg border border-[#046C3F] px-4 py-2 text-sm font-medium text-[#046C3F] transition-colors hover:bg-[#F0FAF5]"
        >
          <Plus size={16} /> New Prescription
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" /> Loading
          prescriptions…
        </div>
      ) : prescriptions.length > 0 ? (
        <div className="space-y-3">
          {prescriptions.map((record) => (
            <ExistingPrescription key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          No prescriptions for this appointment yet.
        </p>
      )}
    </div>
  );
}
