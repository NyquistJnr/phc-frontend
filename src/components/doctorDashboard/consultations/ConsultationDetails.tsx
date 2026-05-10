"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ClipboardList } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { useConsultationById } from "@/src/hooks/doctors/use-consultation";
import type { ConsultationRecord } from "./types";

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

export default function ConsultationDetails() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, isError } = useConsultationById(id);
  const consultation = data as ConsultationRecord | undefined;

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Consultations"
        breadcrumbs={[
          { label: "Consultations", href: "/doctor-dashboard/consultations" },
          { label: "Details", active: true },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <Link
          href="/doctor-dashboard/consultations"
          className="mb-8 inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#046C3F] transition-colors hover:bg-[#F8FAF9]"
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        {isLoading ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
            Loading consultation details...
          </div>
        ) : isError || !consultation ? (
          <div className="rounded-xl bg-white p-8 text-center text-red-500 shadow-sm">
            Failed to load consultation details.
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
                Consultation Details
              </h2>
              <p className="text-base text-[#3F3F46]">
                {consultation.patient_name || "Patient consultation record"}
              </p>
            </div>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">
                <ClipboardList size={20} className="text-[#046C3F]" />
                Clinical Note
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailItem label="Patient" value={consultation.patient_name} />
                <DetailItem label="Patient ID" value={consultation.patient_display_id} />
                <DetailItem label="Chief Complaint" value={consultation.chief_complaint} />
                <DetailItem label="Primary Diagnosis" value={consultation.primary_diagnosis} />
                <DetailItem label="Presenting Complaint" value={consultation.presenting_complaint} />
                <DetailItem label="Secondary Diagnosis" value={consultation.secondary_diagnosis} />
                <DetailItem label="History" value={consultation.history_of_present_complaint} />
                <DetailItem label="Past Medical History" value={consultation.past_medical_history} />
                <DetailItem label="Examination Findings" value={consultation.examination_findings} />
                <DetailItem label="Treatment Plan" value={consultation.treatment_plan} />
                <DetailItem label="Additional Notes" value={consultation.additional_notes} />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
