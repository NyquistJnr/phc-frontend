"use client";

import { type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Loader2, Pill, Search } from "lucide-react";

import PharmacistBackButton from "@/src/components/pharmacist-dashboard/generics/PharmacistBackButton";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";

import { usePrescriptionOrderDetail } from "@/src/hooks/pharmacist/use-prescriptions";

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

  const { data: prescription, isLoading } =
    usePrescriptionOrderDetail(prescriptionId);

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
            <button className="inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-[#046C3F] px-8 text-lg font-medium text-[#046C3F] transition-colors hover:bg-[#046C3F]/5">
              <Download size={20} />
              Export File
            </button>
            <button
              disabled={
                prescription.status === "DISPENSED" ||
                prescription.status === "CANCELLED"
              }
              onClick={() => {
                alert("Dispense flow will be implemented soon!");
              }}
              className="inline-flex h-14 items-center justify-center rounded-lg bg-[#046C3F] px-10 text-lg font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Dispensing
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
