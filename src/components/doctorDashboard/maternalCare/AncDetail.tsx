"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Calendar, Activity, FileText, Syringe } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { useAncVisitDetails } from "@/src/hooks/nurses/use-maternal-care";

export default function AncVisitDetail() {
  const router = useRouter();
  const params = useParams();

  const episodeId = params?.id as string;
  const ancId = params?.anc as string;

  const { data: anc, isLoading, isError } = useAncVisitDetails(ancId);

  const displayYesNo = (val: any) => {
    if (val === true || val === "true") return "Yes";
    if (val === false || val === "false") return "No";
    return val || "N/A";
  };

  if (!ancId) return null;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading ANC Visit details...
      </div>
    );
  }

  if (isError || !anc) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load visit details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Maternal Care"
        breadcrumbs={[
          {
            label: "Maternal Episodes",
            href: "/doctor-dashboard/maternal-care",
          },
          {
            label: "Episode Details",
            href: `/doctor-dashboard/maternal-care/${episodeId}`,
          },
          { label: "ANC Visit Detail" },
        ]}
      />

      <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Back to Episode
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Antenatal Care (ANC) Visit
              </h2>
              <p className="text-sm text-gray-500 mt-1">Visit ID: {anc.id}</p>
            </div>
            <div className="flex gap-3 items-center">
              <StatusBadge
                label={`${anc.attendance_type} VISIT`}
                bgColorHex="#F3F4F6"
                textColorHex="#374151"
              />
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-[#046C3F]" /> General
                Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Appointment Date</p>
                  <p className="font-medium text-gray-900">
                    {anc.appointment_date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Attendance Type</p>
                  <p className="font-medium text-gray-900">
                    {anc.attendance_type}
                  </p>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity size={16} className="text-[#046C3F]" /> Labs & Vitals
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Hemoglobin</p>
                  <p className="font-medium text-gray-900">
                    {anc.hemoglobin || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Urinalysis</p>
                  <p className="font-medium text-gray-900">
                    {anc.urinalysis || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">HIV Status</p>
                  <p className="font-medium text-gray-900">
                    {displayYesNo(anc.hiv_status)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">VDRL/Syphilis</p>
                  <p className="font-medium text-gray-900">
                    {displayYesNo(anc.vdrl_syphilis)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hepatitis B</p>
                  <p className="font-medium text-gray-900">
                    {displayYesNo(anc.hepatitis_b)}
                  </p>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Syringe size={16} className="text-[#046C3F]" /> Treatments &
                Doses
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">TT Dose Given</p>
                  <p className="font-medium text-gray-900">
                    {anc.tt_dose_given || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">IPTP Dose Given</p>
                  <p className="font-medium text-gray-900">
                    {anc.iptp_dose_given || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Iron/Folate Given</p>
                  <p className="font-medium text-gray-900">
                    {displayYesNo(anc.iron_folate_given)}
                  </p>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText size={16} className="text-[#046C3F]" /> Clinical Notes
              </h3>
              <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Risk Factors</p>
                  <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                    {anc.risk_factors || "None recorded"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">General Notes</p>
                  <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                    {anc.notes || "No additional notes provided."}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
