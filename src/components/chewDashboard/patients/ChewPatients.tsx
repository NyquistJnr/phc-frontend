"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Plus, ChevronDown, Check, ArrowLeft, UserCircle2, Calendar, X } from "lucide-react";
import ChewDashboardHeader from "@/src/components/chewDashboard/generics/ChewDashboardHeader";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────────

type LabStatus = "Completed" | "Pending";
type MedStatus = "Dispensed" | "Pending" | "Cancelled" | "Out of stock";
type RefStatus = "Completed" | "Pending" | "Cancelled";

interface PatientRow { id: string; name: string; ageGender: string; lastVisit: string; condition: string; }
interface EncounterRow { id: string; date: string; diagnosis: string; doctor: string; notes: string; }
interface LabRow { id: string; date: string; test: string; result: string; status: LabStatus; }
interface MedRow { id: string; date: string; drug: string; dosage: string; duration: string; frequency: string; status: MedStatus; }
interface ReferralRow { id: string; date: string; clinician: string; facility: string; type: string; reason: string; status: RefStatus; }

// ── Static data ───────────────────────────────────────────────────────────────

const PATIENTS: PatientRow[] = [
  { id: "PAT-PLT-000234", name: "Musa Abdullahi",  ageGender: "35 / F", lastVisit: "Today",      condition: "Malaria" },
  { id: "PAT-PLT-000234", name: "Amina Yusuf",     ageGender: "35 / F", lastVisit: "Yesterday",  condition: "Hypertension" },
  { id: "PAT-PLT-000234", name: "Fatima Ibrahim",  ageGender: "35 / F", lastVisit: "3 days ago", condition: "ANC (32wks)" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "7 days ago", condition: "UTI" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "7 days ago", condition: "Fever" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "13 Apr",     condition: "Fever" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "13 Apr",     condition: "Fever" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "13 Apr",     condition: "Fever" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "13 Apr",     condition: "Fever" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "13 Apr",     condition: "Fever" },
];

const ENCOUNTERS: EncounterRow[] = [
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Malaria",   doctor: "Dr. Suleiman", notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Typhoid",   doctor: "Dr. Adamu",    notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "URTI",      doctor: "Dr. Suleiman", notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Follow-up", doctor: "Dr Ada",       notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Malaria",   doctor: "Dr Musa",      notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Malaria",   doctor: "Dr Musa",      notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Malaria",   doctor: "Dr Musa",      notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Malaria",   doctor: "Dr Musa",      notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Malaria",   doctor: "Dr Musa",      notes: "Fever, chills, weakness, headache" },
  { id: "ENC-PLT-000234", date: "12 Mar 2026", diagnosis: "Malaria",   doctor: "Dr Musa",      notes: "Fever, chills, weakness, headache" },
];

const LAB_TESTS: LabRow[] = [
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Malaria Test",                result: "Positive", status: "Completed" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Blood Count",                 result: "Positive", status: "Completed" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Lipid Panel",                 result: "-",        status: "Pending" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Hemoglobin A1c",              result: "-",        status: "Pending" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Basic Metabolic Panel (BMP)", result: "-",        status: "Pending" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Malaria Test",                result: "Negative", status: "Completed" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Malaria Test",                result: "Positive", status: "Completed" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Malaria Test",                result: "Negative", status: "Completed" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Malaria Test",                result: "-",        status: "Pending" },
  { id: "LAB-PLT-000234", date: "12 Mar 2026", test: "Malaria Test",                result: "-",        status: "Pending" },
];

const MEDICATIONS: MedRow[] = [
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

const REFERRALS: ReferralRow[] = [
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Physical referral",    reason: "Severe malaria", status: "Completed" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Telemedicine referral", reason: "Severe malaria", status: "Completed" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Emergency",            reason: "Severe malaria", status: "Pending" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Telemedicine referral", reason: "Severe malaria", status: "Cancelled" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Physical referral",    reason: "Severe malaria", status: "Cancelled" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Emergency",            reason: "Severe malaria", status: "Completed" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Physical referral",    reason: "Severe malaria", status: "Completed" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Telemedicine referral", reason: "Severe malaria", status: "Completed" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Emergency",            reason: "Severe malaria", status: "Pending" },
  { id: "REF-PLT-000234", date: "12 Mar 2026", clinician: "General Clinic", facility: "General Hospital", type: "Telemedicine referral", reason: "Severe malaria", status: "Pending" },
];

// ── Status style maps ─────────────────────────────────────────────────────────

const LAB_STATUS: Record<LabStatus, React.CSSProperties> = {
  Completed: { background: "#E8F7F0", color: "#046C3F" },
  Pending:   { background: "#FFFBEB", color: "#B45309" },
};
const MED_STATUS: Record<MedStatus, React.CSSProperties> = {
  Dispensed:     { background: "#E8F7F0", color: "#046C3F" },
  Pending:       { background: "#FFFBEB", color: "#B45309" },
  Cancelled:     { background: "#FEF2F2", color: "#DC2626" },
  "Out of stock":{ background: "#FFF7ED", color: "#C2410C" },
};
const REF_STATUS: Record<RefStatus, React.CSSProperties> = {
  Completed: { background: "#E8F7F0", color: "#046C3F" },
  Pending:   { background: "#FFFBEB", color: "#B45309" },
  Cancelled: { background: "#FEF2F2", color: "#DC2626" },
};

// ── Shared dropdown position helper ──────────────────────────────────────────

function calcDropCoords(rect: DOMRect, w: number, estimatedH: number) {
  const spaceBelow = window.innerHeight - rect.bottom - 8;
  const spaceAbove = rect.top - 8;
  const maxH = spaceBelow >= Math.min(estimatedH, 200)
    ? Math.min(spaceBelow, estimatedH)
    : Math.min(spaceAbove, estimatedH);
  const top = spaceBelow >= Math.min(estimatedH, 200)
    ? rect.bottom + 4
    : Math.max(8, rect.top - maxH - 4);
  const left = Math.max(8, Math.min(rect.right - w, window.innerWidth - w - 8));
  return { top, left, maxH };
}

// ── Gender dropdown ───────────────────────────────────────────────────────────

function GenderDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("All Gender");
  const [coords, setCoords] = useState({ top: 0, left: 0, maxH: 200 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const W = 164;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current) setCoords(calcDropCoords(btnRef.current.getBoundingClientRect(), W, 160));
    setOpen(o => !o);
  };

  return (
    <>
      <button ref={btnRef} onClick={toggle}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap">
        {selected === "All Gender" ? "Gender" : selected}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: W, maxHeight: coords.maxH, zIndex: 9999, display: "flex", flexDirection: "column" }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          <div style={{ overflowY: "auto" }} className="py-1.5 px-1.5">
            {["All Gender", "Male", "Female"].map(opt => (
              <button key={opt} onClick={() => { setSelected(opt); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                  style={selected === opt ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}>
                  {selected === opt && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Filter dropdown (plain + searchable variant) ──────────────────────────────

function FilterDropdown({ label, options, searchable, noWrap }: { label: string; options: string[]; searchable?: boolean; noWrap?: boolean }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, maxH: 320 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const W = searchable ? 240 : noWrap ? Math.max(220, Math.max(...[label, ...options].map(o => o.length)) * 8 + 56) : Math.max(180, label.length * 9 + 56);
  const estimatedH = searchable ? 320 : (options.length + 1) * 44 + 16;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; if (searchable) setTimeout(() => searchRef.current?.focus(), 50); }
    else { document.body.style.overflow = ""; setQuery(""); }
    return () => { document.body.style.overflow = ""; };
  }, [open, searchable]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current) setCoords(calcDropCoords(btnRef.current.getBoundingClientRect(), W, estimatedH));
    setOpen(o => !o);
  };

  const allOptions = [label, ...options];
  const visible = query.trim()
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : allOptions;

  return (
    <>
      <button ref={btnRef} onClick={toggle}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap">
        {selected}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: W, maxHeight: coords.maxH, zIndex: 9999, display: "flex", flexDirection: "column" }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          {searchable && (
            <div className="px-2 pt-2 pb-1.5 border-b border-gray-100 shrink-0">
              <div style={{ position: "relative" }}>
                <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                <input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search"
                  style={{ paddingLeft: 28, paddingRight: query ? 28 : 10 }}
                  className="w-full py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F]" />
                {query && (
                  <button onClick={() => setQuery("")}
                    style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}
          <div style={{ overflowY: "auto", flex: 1 }} className="py-1.5 px-1.5">
            {(query.trim() ? visible : allOptions).map(opt => (
              <button key={opt} onClick={() => { setSelected(opt); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                  style={selected === opt ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}>
                  {selected === opt && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                <span className={noWrap ? "whitespace-nowrap" : ""}>{opt}</span>
              </button>
            ))}
            {query.trim() && visible.length === 0 && (
              <p className="px-4 py-3 text-xs text-gray-400 text-center">No results</p>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Form field ────────────────────────────────────────────────────────────────

function FormField({ label, value, onChange, placeholder, icon }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; icon?: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-300"
        />
      </div>
    </div>
  );
}

// ── Toggle (reuses existing project pattern) ──────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{ background: enabled ? "#046C3F" : "#D1D5DB" }}
      className="w-12 h-6 rounded-full relative flex items-center px-0.5 transition-colors shrink-0"
    >
      <div
        className="w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
        style={{ transform: enabled ? "translateX(24px)" : "translateX(0)" }}
      />
    </button>
  );
}

// ── Demographics tab ──────────────────────────────────────────────────────────

function DemographicsTab() {
  const [active, setActive]         = useState(true);
  const [name, setName]             = useState("");
  const [pid, setPid]               = useState("");
  const [age, setAge]               = useState("");
  const [gender, setGender]         = useState("");
  const [dob, setDob]               = useState("");
  const [address, setAddress]       = useState("");
  const [phone, setPhone]           = useState("");
  const [lastVisited, setLastVisited] = useState("");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserCircle2 size={20} className="text-[#046C3F]" />
        <h3 className="text-sm font-bold text-gray-800">Basic Information</h3>
      </div>

      <div className="space-y-4">
        {/* Row 1: Patient Name | Patient ID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <FormField label="Patient Name"  value={name} onChange={setName} placeholder="Enter patient name" />
          <FormField label="Patient ID"    value={pid}  onChange={setPid}  placeholder="PAT-PLT-000000" />
        </div>

        {/* Row 2: Age | Gender | Date of Birth */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <FormField label="Age"           value={age}    onChange={setAge}    placeholder="e.g. 34 years" />
          <FormField label="Gender"        value={gender} onChange={setGender} placeholder="e.g. Female" />
          <FormField label="Date of Birth" value={dob}    onChange={setDob}    placeholder="DD/MM/YYYY" />
        </div>

        {/* Row 3: Address | Phone Number */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <FormField label="Address"      value={address} onChange={setAddress} placeholder="Enter full address" />
          <FormField label="Phone Number" value={phone}   onChange={setPhone}   placeholder="e.g. 234 90 735 2293" />
        </div>

        {/* Row 4: Last Visited | Status toggle (free-standing) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "center" }}>
          <FormField label="Last Visited" value={lastVisited} onChange={setLastVisited}
            placeholder="DD/MM/YYYY" icon={<Calendar size={13} />} />
          <div className="flex items-center gap-3 px-2">
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

function HistoryTab() {
  const [page, setPage] = useState(1);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Encounter History</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search patient by Diagnoses..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-64" />
          </div>
          <PeriodFilterButton label="Date Range" />
          <FilterDropdown searchable label="All Doctor" options={["Dr. Suleiman", "Dr. Adamu", "Dr. Ada", "Dr. Musa", "Dr. Hassan", "Dr. Bello", "Dr. Okafor", "Dr. Ibrahim", "Dr. Yusuf", "Dr. Emeka"]} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Encounter ID", "Date", "Diagnoses", "Doctor", "Notes", "Action"].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  <span className="flex items-center gap-1">{h}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ENCOUNTERS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3 text-sm text-gray-600 font-medium">{row.id}</td>
                <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.date}</td>
                <td className="px-5 py-3 text-sm text-gray-700">{row.diagnosis}</td>
                <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.doctor}</td>
                <td className="px-5 py-3 text-sm text-gray-400 max-w-[200px] truncate">{row.notes}</td>
                <td className="px-5 py-3">
                  <button className="text-xs font-semibold text-[#046C3F] hover:underline">View</button>
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

function LaboratoryTab() {
  const [page, setPage] = useState(1);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Patient Laboratory Test</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search patient by lab test..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-64" />
          </div>
          <PeriodFilterButton label="Date Range" />
          <FilterDropdown label="All Result" options={["Positive", "Negative"]} />
          <FilterDropdown label="All Status" options={["Completed", "Pending"]} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Lab Request ID", "Date", "Lab Test", "Result", "Status"].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  <span className="flex items-center gap-1">{h}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {LAB_TESTS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3 text-sm text-gray-600 font-medium">{row.id}</td>
                <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.date}</td>
                <td className="px-5 py-3 text-sm text-gray-700">{row.test}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{row.result}</td>
                <td className="px-5 py-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap" style={LAB_STATUS[row.status]}>
                    {row.status}
                  </span>
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

// ── Medications tab ───────────────────────────────────────────────────────────

function MedicationsTab() {
  const [page, setPage] = useState(1);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Patient Medications</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search patient by Drug name..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-64" />
          </div>
          <PeriodFilterButton label="Date Range" />
          <FilterDropdown label="All Status" options={["Dispensed", "Pending", "Cancelled", "Out of stock"]} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Prescribed ID", "Date", "Drug Name", "Dosage", "Duration", "Frequency", "Status"].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  <span className="flex items-center gap-1">{h}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MEDICATIONS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3 text-sm text-gray-600 font-medium">{row.id}</td>
                <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.date}</td>
                <td className="px-5 py-3 text-sm text-gray-700">{row.drug}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{row.dosage}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{row.duration}</td>
                <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.frequency}</td>
                <td className="px-5 py-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap" style={MED_STATUS[row.status]}>
                    {row.status}
                  </span>
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

// ── Referrals tab ─────────────────────────────────────────────────────────────

function ReferralsTab() {
  const [page, setPage] = useState(1);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Patient Referrals</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search patient by Clinician or Facility..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-72" />
          </div>
          <PeriodFilterButton label="Date Range" />
          <FilterDropdown label="All Type" options={["Physical referral", "Telemedicine referral", "Emergency"]} noWrap />
          <FilterDropdown label="All Status" options={["Completed", "Pending", "Cancelled"]} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[860px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Referral ID", "Date", "Referring Clinician", "Receiving Facility", "Referral Type", "Reason", "Status"].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  <span className="flex items-center gap-1">{h}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {REFERRALS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3 text-sm text-gray-600 font-medium">{row.id}</td>
                <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.date}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{row.clinician}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{row.facility}</td>
                <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.type}</td>
                <td className="px-5 py-3 text-sm text-gray-400">{row.reason}</td>
                <td className="px-5 py-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap" style={REF_STATUS[row.status]}>
                    {row.status}
                  </span>
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

// ── Profile tabs ──────────────────────────────────────────────────────────────

type ProfileTab = "Demographics" | "History" | "Laboratory" | "Medications" | "Referrals";
const PROFILE_TABS: ProfileTab[] = ["Demographics", "History", "Laboratory", "Medications", "Referrals"];

function PatientProfile({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<ProfileTab>("Demographics");

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <ChewDashboardHeader
        title="Patients"
        breadcrumbs={[
          { label: "Patients", href: "#" },
          { label: "View Profile", active: true },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {tab === "History"    ? "Patient Encounter History" :
             tab === "Laboratory" ? "Patient Laboratory Test"   :
             tab === "Medications"? "Patient Medications"       :
             tab === "Referrals"  ? "Patient Referrals"         :
             "Patient Profile"}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {PROFILE_TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-3 text-sm font-semibold transition-colors relative whitespace-nowrap"
              style={{ color: tab === t ? "#046C3F" : "#6B7280" }}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#046C3F" }} />
              )}
            </button>
          ))}
        </div>

        {tab === "Demographics" && <DemographicsTab />}
        {tab === "History"      && <HistoryTab />}
        {tab === "Laboratory"   && <LaboratoryTab />}
        {tab === "Medications"  && <MedicationsTab />}
        {tab === "Referrals"    && <ReferralsTab />}
      </div>
    </div>
  );
}

// ── Patients list ─────────────────────────────────────────────────────────────

function PatientsList({ onViewProfile }: { onViewProfile: () => void }) {
  const [page, setPage] = useState(1);

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <ChewDashboardHeader
        title="Patients"
        breadcrumbs={[{ label: "Patients", active: true }]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-sm text-gray-500 mt-1">Search, register, and manage patient records</p>
          </div>
          <button
            onClick={onViewProfile}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
            style={{ background: "#046C3F" }}
          >
            <Plus size={16} /> New Patient
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <h2 className="text-sm font-bold text-gray-800">Patients</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input placeholder="Search by patient name or ID..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-72" />
              </div>
              <PeriodFilterButton label="Last Visit" />
              <GenderDropdown />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Patient ID", "Patient Name", "Age/Gender", "Last Visit", "Condition", "Action"].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      <span className="flex items-center gap-1">{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PATIENTS.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-600 font-medium">{row.id}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-800">{row.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.ageGender}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.lastVisit}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.condition}</td>
                    <td className="px-5 py-3">
                      <button onClick={onViewProfile} className="text-xs font-semibold text-[#046C3F] hover:underline">
                        View profile
                      </button>
                    </td>
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ChewPatients() {
  const [view, setView] = useState<"list" | "profile">("list");
  return view === "list"
    ? <PatientsList onViewProfile={() => setView("profile")} />
    : <PatientProfile onBack={() => setView("list")} />;
}
