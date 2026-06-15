"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ClipboardList, Activity, Calendar } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import {
  useConsultationById,
  useAppointmentById,
  useAppointmentVitals,
} from "@/src/hooks/doctors/use-consultation";
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

  const appointmentId = consultation?.appointment || "";

  const { data: appointmentDetails, isLoading: isLoadingDetails } =
    useAppointmentById(appointmentId);
  const { data: vitalsData, isLoading: isLoadingVitals } =
    useAppointmentVitals(appointmentId);

  const latestVitals = useMemo(() => {
    if (vitalsData?.results && vitalsData.results.length > 0) {
      return vitalsData.results[0];
    }
    return null;
  }, [vitalsData]);

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

            {/* Appointment Details Section */}
            <section className="rounded-xl border border-blue-100 bg-blue-50/30 p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b border-blue-100 pb-3 text-lg font-semibold text-blue-900">
                <Calendar size={20} className="text-blue-600" />
                Appointment Context
              </div>
              {isLoadingDetails ? (
                <p className="text-sm text-blue-600">
                  Loading appointment details...
                </p>
              ) : appointmentDetails ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <DetailItem
                    label="Visit Type"
                    value={appointmentDetails.visit_type}
                  />
                  <DetailItem
                    label="Priority"
                    value={appointmentDetails.priority}
                  />
                  <DetailItem
                    label="Appointment Date"
                    value={appointmentDetails.appointment_date}
                  />
                  <DetailItem
                    label="Reason for Visit"
                    value={appointmentDetails.reason_for_visit}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No appointment context available.
                </p>
              )}
            </section>

            {/* Vitals Section */}
            <section className="rounded-xl border border-green-100 bg-[#F8FAF9] p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b border-green-100 pb-3 text-lg font-semibold text-[#046C3F]">
                <Activity size={20} className="text-[#046C3F]" />
                Vitals at Consultation
              </div>
              {isLoadingVitals ? (
                <p className="text-sm text-green-700">Loading vitals...</p>
              ) : latestVitals ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <DetailItem
                    label="Blood Pressure"
                    value={
                      latestVitals.blood_pressure
                        ? `${latestVitals.blood_pressure} mmHg`
                        : "-"
                    }
                  />
                  <DetailItem
                    label="Temperature"
                    value={
                      latestVitals.temperature
                        ? `${latestVitals.temperature} °C`
                        : "-"
                    }
                  />
                  <DetailItem
                    label="Pulse / Respiration"
                    value={`${latestVitals.pulse_rate || "-"} bpm / ${latestVitals.respiratory_rate || "-"}`}
                  />
                  <DetailItem
                    label="Weight / Height"
                    value={`${latestVitals.weight_kg || "-"} kg / ${latestVitals.height_cm || "-"} cm`}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No vitals were recorded for this appointment.
                </p>
              )}
            </section>

            {/* Clinical Notes Section */}
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">
                <ClipboardList size={20} className="text-gray-600" />
                Clinical Note
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailItem label="Patient" value={consultation.patient_name} />
                <DetailItem
                  label="Patient ID"
                  value={consultation.patient_display_id}
                />
                <DetailItem
                  label="Chief Complaint"
                  value={consultation.chief_complaint}
                />
                <DetailItem
                  label="Primary Diagnosis"
                  value={consultation.primary_diagnosis}
                />
                <DetailItem
                  label="Presenting Complaint"
                  value={consultation.presenting_complaint}
                />
                <DetailItem
                  label="Secondary Diagnosis"
                  value={consultation.secondary_diagnosis}
                />
                <DetailItem
                  label="History"
                  value={consultation.history_of_present_complaint}
                />
                <DetailItem
                  label="Past Medical History"
                  value={consultation.past_medical_history}
                />
                <DetailItem
                  label="Examination Findings"
                  value={consultation.examination_findings}
                />
                <DetailItem
                  label="Treatment Plan"
                  value={consultation.treatment_plan}
                />
                <DetailItem
                  label="Additional Notes"
                  value={consultation.additional_notes}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
