"use client";

import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";

type ConsultationStatus = "In-consultation" | "Urgent" | "Waiting" | "Completed";

interface ConsultationRow {
  patientId: string;
  patientName: string;
  chiefComplaint: string;
  status: ConsultationStatus;
}

const CONSULTATION_BADGE_STYLE: Record<ConsultationStatus, React.CSSProperties> = {
  "In-consultation": { background: "#EFF6FF", color: "#1D4ED8" },
  "Urgent":          { background: "#FEF2F2", color: "#DC2626" },
  "Waiting":         { background: "#FFFBEB", color: "#B45309" },
  "Completed":       { background: "#E8F7F0", color: "#046C3F" },
};

const QUEUE: ConsultationRow[] = [
  { patientId: "PAT-PLT-000234", patientName: "Ngozi Eze",    chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "In-consultation" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike",   chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "Urgent" },
  { patientId: "PAT-PLT-000234", patientName: "Amina Bello",  chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "Waiting" },
  { patientId: "PAT-PLT-000234", patientName: "Chukwu Obi",   chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "Completed" },
];

function ConsultationBadge({ status }: { status: ConsultationStatus }) {
  return (
    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap" style={CONSULTATION_BADGE_STYLE[status]}>
      {status}
    </span>
  );
}

function ActionButton({ status }: { status: ConsultationStatus }) {
  if (status === "In-consultation") {
    return (
      <button className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
        Continue
      </button>
    );
  }
  if (status === "Completed") {
    return (
      <button className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
        View
      </button>
    );
  }
  return (
    <button className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold" style={{ background: "#046C3F" }}>
      Start
    </button>
  );
}

export default function ConsultationQueue() {
  const breadcrumbs = [{ label: "Consultations", active: true }];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Consultations" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-800">Today&apos;s Consultation Queue</h2>
            <Link
              href="/doctor-dashboard"
              className="flex items-center gap-1 text-xs font-semibold text-[#046C3F] hover:underline"
            >
              <ArrowRight size={14} className="rotate-180" /> Back to Dashboard
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Patient ID", "Patient Name", "Chief Complaint", "Status", "Action"].map((h) => (
                    <th key={h} className="pb-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">{h} <ChevronDown size={12} /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {QUEUE.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-2 text-sm text-gray-600 font-medium">{row.patientId}</td>
                    <td className="py-4 px-2 text-sm text-gray-800 font-semibold">{row.patientName}</td>
                    <td className="py-4 px-2 text-sm text-gray-500 max-w-[260px] truncate">{row.chiefComplaint}</td>
                    <td className="py-4 px-2"><ConsultationBadge status={row.status} /></td>
                    <td className="py-4 px-2"><ActionButton status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
