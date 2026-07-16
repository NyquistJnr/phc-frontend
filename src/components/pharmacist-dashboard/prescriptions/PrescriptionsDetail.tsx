"use client";

import { type ReactNode, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Loader2, Pill, Search, X } from "lucide-react";

import PharmacistBackButton from "@/src/components/pharmacist-dashboard/generics/PharmacistBackButton";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";

import {
  useDispensePrescriptionOrder,
  usePrescriptionOrderDetail,
} from "@/src/hooks/pharmacist/use-prescriptions";
import DispensePrescriptionModal from "./DispensePrescriptionModal";
import type { PrescriptionOrder } from "./type";

function formatDate(dateString: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day} ${month}, ${year} • ${hours}:${minutes} ${ampm}`;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#FFF4E5", text: "#1F2937" },
  PARTIAL: { bg: "#E2E7FF", text: "#046C3F" },
  DISPENSED: { bg: "#DFF3EA", text: "#039855" },
  CANCELLED: { bg: "#FDE8E8", text: "#F33131" },
};

function isAlreadyFinalizedError(message: string) {
  return /already/i.test(message);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function printPrescriptionOrder(order: PrescriptionOrder) {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return false;

  const detailRows = [
    ["Prescription ID", order.prescription_id],
    ["Date Created", formatDate(order.created_at)],
    ["Patient Name", order.patient_name],
    ["Patient Display ID", order.patient_display_id],
    ["Prescribed By", order.prescribed_by_name],
    ["Priority", order.priority],
    ["Status", order.status],
  ];

  const medicationRows = order.items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.custom_drug_name || item.medication_name)}</td>
          <td>${item.quantity ?? 1}</td>
          <td>${escapeHtml(item.dosage || "-")}</td>
          <td>${escapeHtml(item.frequency || "-")}</td>
          <td>${escapeHtml(item.duration || "-")}</td>
        </tr>`,
    )
    .join("");

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${escapeHtml(order.prescription_id)} Prescription</title>
        <style>
          body { color: #111827; font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #046C3F; font-size: 24px; margin-bottom: 4px; }
          h2 { color: #046C3F; font-size: 16px; margin-top: 32px; }
          p { color: #4B5563; margin-top: 0; }
          table { border-collapse: collapse; margin-top: 16px; width: 100%; }
          th, td { border: 1px solid #E5E7EB; padding: 10px; text-align: left; font-size: 14px; }
          th { background: #F6F7FC; }
          .details th { width: 32%; }
        </style>
      </head>
      <body>
        <h1>Prescription ${escapeHtml(order.prescription_id)}</h1>
        <p>Generated from PHC Pharmacist Dashboard</p>
        <table class="details">
          <tbody>
            ${detailRows
              .map(
                ([label, value]) =>
                  `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
        <h2>Medications</h2>
        <table>
          <thead>
            <tr><th>#</th><th>Drug</th><th>Qty</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr>
          </thead>
          <tbody>
            ${medicationRows}
          </tbody>
        </table>
        <h2>Doctor's Instructions</h2>
        <p>${escapeHtml(order.instructions || "-")}</p>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  return true;
}

function ReadonlyField({
  label,
  value,
  icon,
  className = "",
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-[58px] items-center gap-3 rounded-md border border-[#D8DDE3] bg-[#F1F2F4] px-4 ${className}`}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-[#8B909A]">{label}</span>
        <span className="mt-1 block truncate text-base text-[#7A7F89]">
          {value || "-"}
        </span>
      </span>
    </div>
  );
}

export default function PharmacistPrescriptionsDetail() {
  const router = useRouter();
  const params = useParams();
  const prescriptionId = params.id as string;
  const [dispenseModalOpen, setDispenseModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [dispenseError, setDispenseError] = useState("");

  const { data: prescription, isLoading, refetch: refetchPrescription } =
    usePrescriptionOrderDetail(prescriptionId);
  const dispenseMutation = useDispensePrescriptionOrder();

  const showToast = (title: string, description: string) => {
    setToast({ title, description });
    window.setTimeout(() => setToast(null), 3500);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F6F7FC]">
        <PharmacistDashboardHeader
          title="Prescriptions"
          breadcrumbs={[
            {
              label: "Prescriptions",
              href: "/pharmacist-dashboard/prescriptions",
            },
            { label: "Details" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#046C3F]" />
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F6F7FC]">
        <PharmacistDashboardHeader
          title="Prescriptions"
          breadcrumbs={[
            {
              label: "Prescriptions",
              href: "/pharmacist-dashboard/prescriptions",
            },
          ]}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-lg text-gray-500">Prescription not found.</p>
          <button
            onClick={() => router.back()}
            className="text-[#046C3F] hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const badgeColor = statusColors[prescription.status] || statusColors.PENDING;

  return (
    <div className="min-h-screen bg-[#F6F7FC] pb-12">
      <PharmacistDashboardHeader
        title="Prescriptions"
        breadcrumbs={[
          {
            label: "Prescriptions",
            href: "/pharmacist-dashboard/prescriptions",
          },
          { label: "Prescription Details" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <PharmacistBackButton onClick={() => router.back()} />

        <section className="mt-6 rounded-xl bg-white px-5 py-8 shadow-sm sm:px-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Pill size={28} className="text-[#046C3F]" />
              <h1 className="text-2xl font-semibold text-black">
                Review Doctor&apos;s Prescription
              </h1>
            </div>
            <div>
              <StatusBadge
                label={prescription.status}
                bgColorHex={badgeColor.bg}
                textColorHex={badgeColor.text}
              />
            </div>
          </div>
          <div className="grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-2">
            <ReadonlyField
              label="Prescription ID"
              value={prescription.prescription_id}
            />
            <ReadonlyField
              label="Date Created"
              value={formatDate(prescription.created_at)}
            />
            <ReadonlyField
              label="Patient Name"
              value={prescription.patient_name}
              icon={<Search size={20} className="text-[#8B909A]" />}
            />
            <ReadonlyField
              label="Patient Display ID"
              value={prescription.patient_display_id}
            />
            <ReadonlyField
              label="Prescribed by"
              value={prescription.prescribed_by_name}
            />
            <ReadonlyField label="Priority" value={prescription.priority} />
          </div>
          <hr className="my-10 max-w-[770px] border-gray-100" />
          <div className="space-y-10">
            {prescription.items && prescription.items.length > 0 ? (
              prescription.items.map((item, index) => (
                <section key={item.id} className="max-w-[770px] space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#8B909A]">
                      Medication {index + 1}
                    </h2>
                    <span className="text-sm font-medium text-[#A7ADB5]">
                      {index + 1}/{prescription.items.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <ReadonlyField
                      label="Drug Name"
                      value={item.custom_drug_name || item.medication_name}
                    />
                    <ReadonlyField
                      label="Quantity"
                      value={String(item.quantity ?? 1)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <ReadonlyField label="Dosage" value={item.dosage} />
                    <ReadonlyField label="Frequency" value={item.frequency} />
                    <ReadonlyField label="Duration" value={item.duration} />
                  </div>
                </section>
              ))
            ) : (
              <div className="max-w-[770px] rounded-lg border border-dashed border-gray-300 py-8 text-center text-gray-500">
                No medications listed for this prescription.
              </div>
            )}
          </div>
          <hr className="my-10 max-w-[770px] border-gray-100" />
          <div className="max-w-[770px]">
            <ReadonlyField
              label="Doctor's Instruction / Notes"
              value={prescription.instructions}
              className="min-h-[120px] items-start py-4"
            />
          </div>
          <div className="mt-12 flex max-w-[770px] flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              onClick={() => {
                const didPrint = printPrescriptionOrder(prescription);
                if (!didPrint) {
                  showToast(
                    "Export Failed",
                    "Unable to open the export window. Please allow pop-ups.",
                  );
                }
              }}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-[#046C3F] px-8 text-lg font-medium text-[#046C3F] transition-colors hover:bg-[#046C3F]/5"
            >
              <Download size={20} />
              Export File
            </button>
            <button
              disabled={prescription.status !== "PENDING"}
              onClick={() => {
                setDispenseError("");
                setDispenseModalOpen(true);
              }}
              className="inline-flex h-14 items-center justify-center rounded-lg bg-[#046C3F] px-10 text-lg font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Dispensing
            </button>
          </div>
        </section>
      </div>

      {dispenseModalOpen && (
        <DispensePrescriptionModal
          order={prescription}
          isSubmitting={dispenseMutation.isPending}
          errorMessage={dispenseError}
          onClose={() => setDispenseModalOpen(false)}
          onConfirm={(payload) => {
            setDispenseError("");
            dispenseMutation.mutate(
              { id: prescription.id, payload },
              {
                onSuccess: () => {
                  setDispenseModalOpen(false);
                  showToast(
                    "Dispense Successful",
                    `${prescription.prescription_id} dispensed successfully`,
                  );
                },
                onError: (error: unknown) => {
                  const message =
                    error instanceof Error
                      ? error.message
                      : "Failed to dispense. Please try again.";

                  if (isAlreadyFinalizedError(message)) {
                    // Stale local state — someone else dispensed/cancelled it
                    // elsewhere. Sync up instead of treating it as a scary error.
                    setDispenseModalOpen(false);
                    refetchPrescription();
                    showToast("Already Finalized", message);
                    return;
                  }

                  setDispenseError(message);
                },
              }
            );
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex w-[min(390px,calc(100vw-2rem))] items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
          <span className="h-12 w-1 rounded-full bg-[#039855]" />
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#A8E6C4] bg-[#E8F7F0] text-[#039855]">
            <Pill size={14} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {toast.title}
            </p>
            <p className="text-sm text-gray-600">{toast.description}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="border-l border-gray-100 pl-4 text-gray-900 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
