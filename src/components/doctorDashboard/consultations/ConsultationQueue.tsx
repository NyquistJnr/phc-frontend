"use client";

import { useState } from "react";
import { ChevronDown, Search, Plus } from "lucide-react";
import Link from "next/link";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

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

const ACTION_LABEL: Record<ConsultationStatus, string> = {
  "In-consultation": "Continue",
  "Urgent":          "Start",
  "Waiting":         "Start",
  "Completed":       "View",
};

const QUEUE: ConsultationRow[] = [
  { patientId: "PAT-PLT-000234", patientName: "Ngozi Eze",    chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "In-consultation" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike",   chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "Urgent" },
  { patientId: "PAT-PLT-000234", patientName: "Amina Bello",  chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "Waiting" },
  { patientId: "PAT-PLT-000234", patientName: "Chukwu Obi",   chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "Completed" },
  { patientId: "PAT-PLT-000234", patientName: "Kemi Adeyemi", chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "In-consultation" },
  { patientId: "PAT-PLT-000234", patientName: "Kemi Adeyemi", chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "Urgent" },
  { patientId: "PAT-PLT-000234", patientName: "Kemi Adeyemi", chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "Urgent" },
  { patientId: "PAT-PLT-000234", patientName: "Kemi Adeyemi", chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "Completed" },
  { patientId: "PAT-PLT-000234", patientName: "Kemi Adeyemi", chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "Completed" },
  { patientId: "PAT-PLT-000234", patientName: "Kemi Adeyemi", chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose", status: "Completed" },
];

const STATUS_OPTIONS = ["All Status", "In-consultation", "Urgent", "Waiting", "Completed"];
const TABLE_HEADERS = ["Patient ID", "Patient Name", "Chief Complaint", "Status", "Action"];

function ConsultationBadge({ status }: { status: ConsultationStatus }) {
  return (
    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap" style={CONSULTATION_BADGE_STYLE[status]}>
      {status}
    </span>
  );
}

function ActionButton({ status }: { status: ConsultationStatus }) {
  const label = ACTION_LABEL[status];
  const isGreen = status === "Urgent" || status === "Waiting";
  return (
    <Link
      href="/doctor-dashboard/consultations/new"
      className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
      style={
        isGreen
          ? { background: "#046C3F", color: "#fff" }
          : { border: "1px solid #D1D5DB", color: "#374151", background: "#fff" }
      }
    >
      {label}
    </Link>
  );
}

export default function ConsultationQueue() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);

  const breadcrumbs = [{ label: "Consultations", active: true }];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Consultations" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Today&apos;s Consultation Queue</h1>
            <p className="text-sm text-gray-500 mt-1">Select a patient to begin consultation</p>
          </div>
          <Link
            href="/doctor-dashboard/consultations/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap"
            style={{ background: "#046C3F" }}
          >
            <Plus size={16} /> New Consultation
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Today&apos;s Consultation Queue</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search patient by Clinician or F..."
                  className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 w-56 focus:outline-none focus:ring-1 focus:ring-[#1AC073] bg-white"
                />
              </div>
              <FilterDropdown
                label="All Status"
                options={STATUS_OPTIONS}
                selected={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {TABLE_HEADERS.map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">{h} <ChevronDown size={12} /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {QUEUE.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-600 font-medium">{row.patientId}</td>
                    <td className="px-5 py-4 text-sm text-gray-800 font-semibold">{row.patientName}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 max-w-[260px] truncate">{row.chiefComplaint}</td>
                    <td className="px-5 py-4"><ConsultationBadge status={row.status} /></td>
                    <td className="px-5 py-4"><ActionButton status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={page} totalPages={68} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
