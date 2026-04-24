"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown, Search, Eye, Upload, MoreHorizontal, Calendar as CalendarIcon, ClipboardList,
} from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

// ── Types & data ──────────────────────────────────────────────────────────────

type LabStatus = "Ready" | "Processing";

interface LabRow {
  requestId: string;
  patientId: string;
  patientName: string;
  labTest: string;
  result: string;
  date: string;
  status: LabStatus;
}

const LAB_RESULTS: LabRow[] = [
  { requestId: "LAB-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Musa Abdullahi", labTest: "Fasting Blood Sugar", result: "POSITIVE (P.f)", date: "2026-03-30", status: "Ready" },
  { requestId: "LAB-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Amina Yusuf",    labTest: "Hemoglobin",          result: "---",            date: "2026-03-29", status: "Processing" },
  { requestId: "LAB-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Fatima Ibrahim", labTest: "Malaria RDT",         result: "Normal",         date: "2026-03-28", status: "Ready" },
  { requestId: "LAB-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Bayo Ogunleye",  labTest: "Full Blood Count",    result: "Normal",         date: "2026-03-27", status: "Ready" },
  { requestId: "LAB-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Bayo Ogunleye",  labTest: "Widal test",          result: "O: 1/160 (high)",date: "2026-03-26", status: "Ready" },
  { requestId: "LAB-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Bayo Ogunleye",  labTest: "Urinalysis",          result: "142 mg/dL",      date: "2026-03-25", status: "Ready" },
  { requestId: "LAB-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Bayo Ogunleye",  labTest: "Urinalysis",          result: "---",            date: "2026-03-24", status: "Processing" },
  { requestId: "LAB-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Bayo Ogunleye",  labTest: "Urinalysis",          result: "---",            date: "2026-03-23", status: "Processing" },
  { requestId: "LAB-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Bayo Ogunleye",  labTest: "Urinalysis",          result: "9.2 g/dL",       date: "2026-03-22", status: "Ready" },
  { requestId: "LAB-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Bayo Ogunleye",  labTest: "Urinalysis",          result: "9.2 g/dL",       date: "2026-03-21", status: "Ready" },
];

const STATUS_BADGE: Record<LabStatus, React.CSSProperties> = {
  Ready:      { background: "#E8F7F0", color: "#046C3F" },
  Processing: { background: "#FFFBEB", color: "#B45309" },
};

const TABLE_HEADERS = ["Lab request ID", "Patient ID", "Patient Name", "Lab Tests", "Result", "Date", "Status", "Action"];

// ── Action menu (... dots) ────────────────────────────────────────────────────

function ActionMenu() {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.right - 160 });
    }
    setOpen(o => !o);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
      >
        <MoreHorizontal size={16} />
      </button>

      {mounted && open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: 160, zIndex: 9999 }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1"
        >
          <button
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye size={15} className="text-gray-400" /> View result
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Upload size={15} className="text-gray-400" /> Export result
          </button>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Lab Results tab ───────────────────────────────────────────────────────────

function LabResults() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-800">Lab Results</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by patient name or ID"
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 w-56 focus:outline-none focus:ring-1 focus:ring-[#1AC073] bg-white"
            />
          </div>
          <PeriodFilterButton label="Date Range" />
          <FilterDropdown
            label="All Status"
            options={["All Status", "Ready", "Processing"]}
            selected={status}
            onChange={setStatus}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[820px]">
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
            {LAB_RESULTS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4 text-sm text-gray-600 font-medium">{row.requestId}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{row.patientId}</td>
                <td className="px-5 py-4 text-sm text-gray-800 font-semibold">{row.patientName}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.labTest}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.result}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.date}</td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={STATUS_BADGE[row.status]}>
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <ActionMenu />
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

// ── Lab Request form dropdowns ────────────────────────────────────────────────

const REQUESTED_BY_OPTIONS = ["Dr. Suleiman", "Dr. Adamu", "Dr. Ada", "Dr. Musa", "Dr. Fatima", "Dr. Chukwu"];
const TEST_TYPE_OPTIONS = ["Malaria RDT", "Malaria smear", "Full blood count", "Widal test", "HIV rapid test", "Urinalysis", "Blood glucose (RBS)", "Liver function tests", "Renal function tests", "Pregnancy test (UPT)"];
const SAMPLE_TYPE_OPTIONS = ["Blood", "Urine", "Stool", "Swab"];
const PRIORITY_OPTIONS = ["Routine", "Urgent"];

function SearchableSelect({ label, placeholder, options }: { label: string; placeholder: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const openDropdown = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropH = Math.min(options.length * 44 + 60, 300);
      const top = rect.bottom + dropH > window.innerHeight ? rect.top - dropH - 4 : rect.bottom + 4;
      setCoords({ top, left: rect.left, width: rect.width });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div ref={triggerRef} onClick={openDropdown}
        className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center justify-between cursor-pointer">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className={`text-sm truncate ${selected ? "text-gray-700" : "text-gray-400"}`}>{selected || placeholder}</p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width, zIndex: 9999 }}
          className="bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search"
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#1AC073]" />
            </div>
          </div>
          <div style={{ maxHeight: "220px", overflowY: "auto" }} className="py-1">
            {filtered.length === 0
              ? <p className="text-sm text-gray-400 text-center py-4">No results</p>
              : filtered.map(opt => (
                <button key={opt} onClick={() => { setSelected(opt); setOpen(false); setSearch(""); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-left transition-colors">
                  <div className="w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
                    style={selected === opt ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}>
                    {selected === opt && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className={selected === opt ? "text-[#046C3F] font-medium" : "text-gray-700"}>{opt}</span>
                </button>
              ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function SimpleSelect({ label, placeholder, options }: { label: string; placeholder: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const openDropdown = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropH = options.length * 44 + 16;
      const top = rect.bottom + dropH > window.innerHeight ? rect.top - dropH - 4 : rect.bottom + 4;
      setCoords({ top, left: rect.left, width: rect.width });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      <div ref={triggerRef} onClick={openDropdown}
        className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center justify-between cursor-pointer">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className={`text-sm truncate ${selected ? "text-gray-700" : "text-gray-400"}`}>{selected || placeholder}</p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width, zIndex: 9999 }}
          className="bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1">
          {options.map(opt => (
            <button key={opt} onClick={() => { setSelected(opt); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-left transition-colors">
              <div className="w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
                style={selected === opt ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}>
                {selected === opt && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className={selected === opt ? "text-[#046C3F] font-medium" : "text-gray-700"}>{opt}</span>
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Lab Request form ──────────────────────────────────────────────────────────

function FormField({ label, value, placeholder, icon }: { label: string; value?: string; placeholder?: string; icon?: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center gap-3">
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <input
          className="w-full text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
          placeholder={placeholder}
          defaultValue={value}
        />
      </div>
    </div>
  );
}

function LabRequestForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center shrink-0">
            <ClipboardList size={18} className="text-[#046C3F]" />
          </div>
          <h3 className="text-base font-bold text-gray-800">Lab Request</h3>
        </div>

        <div className="space-y-4">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <FormField label="Search patient" placeholder="Search patient by name or ID" icon={<Search size={15} />} />
            <FormField label="Encounter ID" value="ENC-PLT-000234" />
            <FormField label="Lab Request ID" value="LAB-PLT-000234" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <SearchableSelect label="Requested By" placeholder="Doctor/User ID" options={REQUESTED_BY_OPTIONS} />
            <SearchableSelect label="Sample Type (Optional)" placeholder="Select" options={SAMPLE_TYPE_OPTIONS} />
            <SearchableSelect label="Test type" placeholder="Select test" options={TEST_TYPE_OPTIONS} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SimpleSelect label="Priority" placeholder="Select priority" options={PRIORITY_OPTIONS} />
            <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Request Date</p>
                <p className="text-sm text-gray-700">12/12/2020</p>
              </div>
              <CalendarIcon size={16} className="text-gray-400 shrink-0" />
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-4 bg-white">
            <p className="text-xs text-gray-400 mb-2">Clinical notes for lab</p>
            <textarea rows={5}
              className="w-full text-sm text-gray-500 outline-none bg-transparent resize-none placeholder:text-gray-400"
              placeholder="Reason for test, suspected diagnosis..." />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-10">
          <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button onClick={() => setSubmitted(true)}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#046C3F" }}>
            Send to lab
          </button>
        </div>
      </div>

      {submitted && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
          className="flex items-center gap-3 bg-white border-l-4 border-[#046C3F] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.14)] px-4 py-3 min-w-70">
          <div className="w-5 h-5 rounded-full bg-[#046C3F] flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 flex-1">Lab test request submitted</p>
          <button onClick={() => setSubmitted(false)} className="text-gray-400 hover:text-gray-600 shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14"><line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ActiveTab = "results" | "request";

export default function Laboratory() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("results");

  const breadcrumbs = [{ label: "Laboratory", active: true }];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Laboratory" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === "results" ? "Laboratory" : "New lab request"}
          </h1>
          {activeTab === "request" && (
            <p className="text-sm text-gray-500 mt-1">Request diagnostic tests for a patient</p>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("results")}
            className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors"
            style={activeTab === "results"
              ? { background: "#046C3F", color: "#fff" }
              : { background: "transparent", color: "#6B7280" }}
          >
            Lab results
          </button>
          <button
            onClick={() => setActiveTab("request")}
            className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors"
            style={activeTab === "request"
              ? { background: "#046C3F", color: "#fff" }
              : { background: "transparent", color: "#6B7280" }}
          >
            Lab Request
          </button>
        </div>

        {activeTab === "results" ? <LabResults /> : <LabRequestForm />}
      </div>
    </div>
  );
}
