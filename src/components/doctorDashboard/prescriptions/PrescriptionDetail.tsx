"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pill } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { usePrescriptionById } from "@/src/hooks/doctors/use-prescriptions";
import type { PrescriptionRecord } from "./types";

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#FFF4E5", text: "#1F2937" },
  PARTIAL: { bg: "#E2E7FF", text: "#046C3F" },
  DISPENSED: { bg: "#DFF3EA", text: "#039855" },
  CANCELLED: { bg: "#FDE8E8", text: "#F33131" },
};

function DetailItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="mb-1 text-xs text-[#62636C]">{label}</p>
      <p className="whitespace-pre-wrap text-sm font-medium text-gray-900">
        {value || "N/A"}
      </p>
    </div>
  );
}

export default function PrescriptionDetail() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, isError } = usePrescriptionById(id);
  const prescription = data as PrescriptionRecord | undefined;
  const status = prescription?.status || "PENDING";
  const color = statusColors[status] || { bg: "#F3F4F6", text: "#374151" };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Prescriptions"
        breadcrumbs={[
          { label: "Prescriptions", href: "/doctor-dashboard/prescriptions" },
          { label: "Details", active: true },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <Link
          href="/doctor-dashboard/prescriptions"
          className="mb-8 inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#046C3F] transition-colors hover:bg-[#F8FAF9]"
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        {isLoading ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
            Loading prescription details...
          </div>
        ) : isError || !prescription ? (
          <div className="rounded-xl bg-white p-8 text-center text-red-500 shadow-sm">
            Failed to load prescription details.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
                  Prescription Detail
                </h2>
                <p className="text-base text-[#3F3F46]">
                  {prescription.prescription_id || prescription.id}
                </p>
              </div>
              <StatusBadge
                label={status.charAt(0) + status.slice(1).toLowerCase()}
                bgColorHex={color.bg}
                textColorHex={color.text}
              />
            </div>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">
                <Pill size={20} className="text-[#046C3F]" />
                Prescription Information
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DetailItem label="Patient" value={prescription.patient_name} />
                <DetailItem label="Patient ID" value={prescription.patient_display_id} />
                <DetailItem label="Appointment" value={prescription.appointment_id || prescription.appointment} />
                <DetailItem label="Priority" value={prescription.priority} />
                <DetailItem label="Prescribed By" value={prescription.prescribed_by_name} />
                <DetailItem label="Instructions" value={prescription.instructions} />
              </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Medications</h3>
              <div className="space-y-3">
                {prescription.items?.length ? (
                  prescription.items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="grid grid-cols-1 gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 md:grid-cols-4"
                    >
                      <DetailItem
                        label="Drug"
                        value={
                          item.drug_name ||
                          item.medication_name ||
                          item.custom_drug_name ||
                          item.drug
                        }
                      />
                      <DetailItem label="Dosage" value={item.dosage} />
                      <DetailItem label="Frequency" value={item.frequency} />
                      <DetailItem label="Duration" value={item.duration} />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No medication items found.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
