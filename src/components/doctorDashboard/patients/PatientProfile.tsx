"use client";

import { useState } from "react";
import { Search, ChevronDown, ArrowLeft, Calendar as CalendarIcon, User } from "lucide-react";
import Link from "next/link";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { DateRangeButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

// ── Tabs ──────────────────────────────────────────────────────────────────────

type Tab = "Demographics" | "History" | "Laboratory" | "Medications" | "Referrals";
const TABS: Tab[] = ["Demographics", "History", "Laboratory", "Medications", "Referrals"];

// ── Shared badge ──────────────────────────────────────────────────────────────

function Badge({ label, style }: { label: string; style: React.CSSProperties }) {
  return (
    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap" style={style}>
      {label}
    </span>
  );
}

// ── Shared search input ───────────────────────────────────────────────────────

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 w-56 focus:outline-none focus:ring-1 focus:ring-[#1AC073] bg-white"
      />
    </div>
  );
}

// ── Toggle (matches existing PermissionToggle pattern) ────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${enabled ? "bg-[#046C3F]" : "bg-gray-200"}`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform flex items-center justify-center ${enabled ? "translate-x-6" : "translate-x-0"}`}
      >
      </div>
    </button>
  );
}

// ── Inline-label field ────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white">
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <p className="text-sm text-gray-600">{value}</p>
    </div>
  );
}

// ── Demographics tab ──────────────────────────────────────────────────────────

function Demographics() {
  const [active, setActive] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center shrink-0">
          <User size={18} className="text-[#046C3F]" />
        </div>
        <h3 className="text-base font-bold text-gray-800">Basic Information</h3>
      </div>

      <div className="space-y-4">
        {/* Row 1: Name + ID */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Patient Name" value="Aisha Mohammed" />
          <Field label="Patient ID" value="PAT-PLT-000234" />
        </div>

        {/* Row 2: Age + Gender + DOB */}
        <div className="grid grid-cols-3 gap-4">
          <Field label="Age" value="34 years" />
          <Field label="Gender" value="Female" />
          <Field label="Date of Birth" value="12/12/2026" />
        </div>

        {/* Row 3: Address + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Address" value="21 Bukayo Street, Opobi salvation, Lagos." />
          <Field label="Phone Number" value="234 90 735 2293" />
        </div>

        {/* Row 4: Last Visited + Status */}
        <div className="grid grid-cols-2 gap-4">
          {/* Last Visited with calendar icon */}
          <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center gap-3">
            <CalendarIcon size={18} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Last Visited</p>
              <p className="text-sm text-gray-600">12/12/2020</p>
            </div>
          </div>

          {/* Status toggle */}
          <div className="flex items-center gap-3">
            <Toggle enabled={active} onChange={() => setActive(v => !v)} />
            <div>
              <p className="text-sm font-medium text-gray-700">Status</p>
              <p className="text-xs text-gray-400 mt-0.5">{active ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── History tab ───────────────────────────────────────────────────────────────

interface EncounterRow { id: string; date: string; diagnosis: string; doctor: string; notes: string; }

const ENCOUNTERS: EncounterRow[] = [
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Malaria",   doctor: "Dr. Suleiman", notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Typhoid",   doctor: "Dr. Adamu",    notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "URTI",      doctor: "Dr. Suleiman", notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Follow-up", doctor: "Dr. Ada",      notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Malaria",   doctor: "Dr. Musa",     notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Malaria",   doctor: "Dr. Musa",     notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Malaria",   doctor: "Dr. Musa",     notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Malaria",   doctor: "Dr. Musa",     notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2028", diagnosis: "Malaria",   doctor: "Dr. Musa",     notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2028", diagnosis: "Malaria",   doctor: "Dr. Musa",     notes: "Fever, chills, weakness, headache" },
];

const DOCTORS = ["All Doctor", "Dr. Suleiman", "Dr. Adamu", "Dr. Ada", "Dr. Musa"];

function History() {
  const [search, setSearch] = useState("");
  const [doctor, setDoctor] = useState("All Doctor");
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Encounter History</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by Diagnoses..." />
          <DateRangeButton />
          <FilterDropdown label="All Doctor" options={DOCTORS} selected={doctor} onChange={setDoctor} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Encounter ID", "Date", "Diagnoses", "Doctor", "Notes", "Action"].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1">{h} <ChevronDown size={12} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ENCOUNTERS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4 text-sm text-gray-600 font-medium">{row.id}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.date}</td>
                <td className="px-5 py-4 text-sm text-gray-800 font-semibold">{row.diagnosis}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.doctor}</td>
                <td className="px-5 py-4 text-sm text-gray-500 max-w-[200px] truncate">{row.notes}</td>
                <td className="px-5 py-4">
                  <button className="text-sm font-semibold" style={{ color: "#046C3F" }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={68} onPageChange={setPage} />
    </div>
  );
}

// ── Laboratory tab ────────────────────────────────────────────────────────────

type LabStatus = "Completed" | "Pending";
interface LabRow { id: string; date: string; test: string; result: string; status: LabStatus; }

const LAB_ROWS: LabRow[] = [
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Malaria Test",               result: "Positive", status: "Completed" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Blood Count",                result: "Positive", status: "Completed" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Lipid Panel",                result: "—",        status: "Pending" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Hemoglobin A1c",             result: "—",        status: "Pending" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Basic Metabolic Panel (BMP)", result: "—",       status: "Pending" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Malaria Test",               result: "Negative", status: "Completed" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Malaria Test",               result: "Positive", status: "Completed" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Malaria Test",               result: "Negative", status: "Completed" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Malaria Test",               result: "—",        status: "Pending" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Malaria Test",               result: "—",        status: "Pending" },
];

const LAB_STATUS_STYLE: Record<LabStatus, React.CSSProperties> = {
  Completed: { background: "#E8F7F0", color: "#046C3F" },
  Pending:   { background: "#FFF7ED", color: "#C2410C" },
};

function Laboratory() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState("All Result");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Patient Laboratory Test</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by lab test..." />
          <DateRangeButton />
          <FilterDropdown label="All Result" options={["All Result", "Positive", "Negative"]} selected={result} onChange={setResult} />
          <FilterDropdown label="All Status" options={["All Status", "Pending", "Completed"]} selected={status} onChange={setStatus} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Lab Request ID", "Date", "Lab Test", "Result", "Status"].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1">{h} <ChevronDown size={12} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {LAB_ROWS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4 text-sm text-gray-600 font-medium">{row.id}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.date}</td>
                <td className="px-5 py-4 text-sm text-gray-800 font-semibold">{row.test}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.result}</td>
                <td className="px-5 py-4"><Badge label={row.status} style={LAB_STATUS_STYLE[row.status]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={68} onPageChange={setPage} />
    </div>
  );
}

// ── Medications tab ───────────────────────────────────────────────────────────

type MedStatus = "Dispensed" | "Pending" | "Cancelled" | "Out of stock";
interface MedRow { id: string; date: string; drug: string; dosage: string; duration: string; frequency: string; status: MedStatus; }

const MED_ROWS: MedRow[] = [
  { id: "PRC-PLT-000234", date: "12 Mar 2026", drug: "Artemether, Paracetamol", dosage: "2x daily", duration: "A day",  frequency: "Once daily",        status: "Dispensed" },
  { id: "PRC-PLT-000234", date: "12 Mar 2026", drug: "Artemether, Paracetamol", dosage: "3x daily", duration: "2 days", frequency: "Twice daily",       status: "Dispensed" },
  { id: "PRC-PLT-000234", date: "12 Mar 2026", drug: "Artemether, Paracetamol", dosage: "3x daily", duration: "3 days", frequency: "Three times daily", status: "Pending" },
  { id: "PRC-PLT-000234", date: "12 Mar 2026", drug: "Artemether, Paracetamol", dosage: "3x daily", duration: "4 days", frequency: "Every 8 hours",     status: "Cancelled" },
  { id: "PRC-PLT-000234", date: "12 Mar 2026", drug: "Artemether, Paracetamol", dosage: "3x daily", duration: "5 days", frequency: "Every 12 hours",    status: "Out of stock" },
  { id: "PRC-PLT-000234", date: "12 Mar 2026", drug: "Artemether, Paracetamol", dosage: "3x daily", duration: "6 days", frequency: "Every 8 hours",     status: "Dispensed" },
  { id: "PRC-PLT-000234", date: "12 Mar 2026", drug: "Artemether, Paracetamol", dosage: "3x daily", duration: "7 days", frequency: "Every 8 hours",     status: "Dispensed" },
  { id: "PRC-PLT-000234", date: "12 Mar 2026", drug: "Artemether, Paracetamol", dosage: "3x daily", duration: "7 days", frequency: "Every 8 hours",     status: "Dispensed" },
  { id: "PRC-PLT-000234", date: "12 Mar 2026", drug: "Artemether, Paracetamol", dosage: "3x daily", duration: "7 days", frequency: "Every 8 hours",     status: "Pending" },
  { id: "PRC-PLT-000234", date: "12 Mar 2026", drug: "Artemether, Paracetamol", dosage: "3x daily", duration: "7 days", frequency: "Every 8 hours",     status: "Pending" },
];

const MED_STATUS_STYLE: Record<MedStatus, React.CSSProperties> = {
  Dispensed:      { background: "#E8F7F0", color: "#046C3F" },
  Pending:        { background: "#FFF7ED", color: "#C2410C" },
  Cancelled:      { background: "#FEF2F2", color: "#DC2626" },
  "Out of stock": { background: "#FEF3C7", color: "#92400E" },
};

function Medications() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Patient Medications</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by Drug name..." />
          <DateRangeButton />
          <FilterDropdown
            label="All Status"
            options={["All Status", "Dispensed", "Pending", "Cancelled", "Out of stock"]}
            selected={status}
            onChange={setStatus}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Prescribed ID", "Date", "Drug Name", "Dosage", "Duration", "Frequency", "Status"].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1">{h} <ChevronDown size={12} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MED_ROWS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4 text-sm text-gray-600 font-medium">{row.id}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.date}</td>
                <td className="px-5 py-4 text-sm text-gray-800 font-semibold">{row.drug}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.dosage}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.duration}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.frequency}</td>
                <td className="px-5 py-4"><Badge label={row.status} style={MED_STATUS_STYLE[row.status]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={68} onPageChange={setPage} />
    </div>
  );
}

// ── Referrals tab ─────────────────────────────────────────────────────────────

type RefStatus = "Completed" | "Pending" | "Cancelled";
type RefType = "Physical referral" | "Telemedicine referral" | "Emergency";
interface RefRow { id: string; date: string; clinician: string; facility: string; type: RefType; reason: string; status: RefStatus; }

const REF_ROWS: RefRow[] = [
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Physical referral",     reason: "Severe malaria", status: "Completed" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Telemedicine referral", reason: "Severe malaria", status: "Completed" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Emergency",             reason: "Severe malaria", status: "Pending" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Telemedicine referral", reason: "Severe malaria", status: "Cancelled" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Physical referral",     reason: "Severe malaria", status: "Cancelled" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Emergency",             reason: "Severe malaria", status: "Completed" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Physical referral",     reason: "Severe malaria", status: "Completed" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Telemedicine referral", reason: "Severe malaria", status: "Completed" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Emergency",             reason: "Severe malaria", status: "Pending" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Telemedicine referral", reason: "Severe malaria", status: "Pending" },
];

const REF_STATUS_STYLE: Record<RefStatus, React.CSSProperties> = {
  Completed: { background: "#E8F7F0", color: "#046C3F" },
  Pending:   { background: "#FFF7ED", color: "#C2410C" },
  Cancelled: { background: "#FEF2F2", color: "#DC2626" },
};

function Referrals() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Type");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Patient Referrals</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by Clinician or Facility..." />
          <DateRangeButton />
          <FilterDropdown label="All Type" options={["All Type", "Physical referral", "Telemedicine referral"]} selected={type} onChange={setType} />
          <FilterDropdown label="All Status" options={["All Status", "Completed", "Pending", "Cancelled"]} selected={status} onChange={setStatus} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Referral ID", "Date", "Referring Clinician", "Receiving Facility", "Referral Type", "Reason", "Status"].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1">{h} <ChevronDown size={12} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {REF_ROWS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4 text-sm text-gray-600 font-medium">{row.id}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.date}</td>
                <td className="px-5 py-4 text-sm text-gray-800 font-semibold">{row.clinician}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.facility}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.type}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.reason}</td>
                <td className="px-5 py-4"><Badge label={row.status} style={REF_STATUS_STYLE[row.status]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={68} onPageChange={setPage} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PatientProfile() {
  const [activeTab, setActiveTab] = useState<Tab>("Demographics");

  const breadcrumbs = [
    { label: "Patients", href: "/doctor-dashboard/patients" },
    { label: "Patients profile" },
    { label: activeTab, active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Patients" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-5 pb-10">
        <div className="mb-5">
          <Link
            href="/doctor-dashboard/patients"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-3 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Patient Profile</h1>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 border-b border-gray-200 mb-6 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px"
              style={activeTab === tab
                ? { color: "#046C3F", borderColor: "#046C3F" }
                : { color: "#6B7280", borderColor: "transparent" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Demographics" && <Demographics />}
        {activeTab === "History"      && <History />}
        {activeTab === "Laboratory"   && <Laboratory />}
        {activeTab === "Medications"  && <Medications />}
        {activeTab === "Referrals"    && <Referrals />}
      </div>
    </div>
  );
}
