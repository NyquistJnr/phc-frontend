"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, ArrowLeft, Eye, Calendar as CalendarIcon } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

// ── Types & data ──────────────────────────────────────────────────────────────

type ImmunizationStatus = "Completed" | "Due" | "Pending";

interface ImmunizationRow {
  patientId: string;
  patientName: string;
  age: string;
  scheduledDate: string;
  vaccine: string;
  dueDate: string;
  status: ImmunizationStatus;
}

const RECORDS: ImmunizationRow[] = [
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", age: "8 months", scheduledDate: "12 Mar 2026", vaccine: "PCV (3rd dose)",    dueDate: "12 Mar 2026", status: "Completed" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", age: "8 months", scheduledDate: "12 Mar 2026", vaccine: "BCG, OPV0, HBV",    dueDate: "12 Mar 2026", status: "Due" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", age: "8 months", scheduledDate: "12 Mar 2026", vaccine: "DPT-HBV-Hib (1st)", dueDate: "12 Mar 2026", status: "Pending" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", age: "8 months", scheduledDate: "12 Mar 2026", vaccine: "Measles-Rubella",   dueDate: "12 Mar 2026", status: "Completed" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", age: "8 months", scheduledDate: "12 Mar 2026", vaccine: "OPV0, HBV",         dueDate: "12 Mar 2026", status: "Pending" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", age: "8 months", scheduledDate: "12 Mar 2026", vaccine: "OPV0, HBV",         dueDate: "12 Mar 2026", status: "Due" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", age: "8 months", scheduledDate: "12 Mar 2026", vaccine: "OPV0, HBV",         dueDate: "12 Mar 2026", status: "Completed" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", age: "8 months", scheduledDate: "12 Mar 2026", vaccine: "OPV0, HBV",         dueDate: "12 Mar 2026", status: "Completed" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", age: "8 months", scheduledDate: "12 Mar 2026", vaccine: "OPV0, HBV",         dueDate: "12 Mar 2026", status: "Completed" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", age: "8 months", scheduledDate: "12 Mar 2026", vaccine: "OPV0, HBV",         dueDate: "12 Mar 2026", status: "Completed" },
];

const STATUS_BADGE: Record<ImmunizationStatus, React.CSSProperties> = {
  Completed: { background: "#E8F7F0", color: "#046C3F" },
  Due:       { background: "#FEF2F2", color: "#DC2626" },
  Pending:   { background: "#FFFBEB", color: "#B45309" },
};

const TABLE_HEADERS = ["Patient ID", "Patient Name", "Age", "Scheduled Date", "Vaccine", "Due Date", "Status", "Action"];

const VACCINATION_OPTIONS = [
  "Hep.B 0", "OPV 0", "BCG", "OPV1", "PENTA1", "PCV1", "ROTA1",
  "OPV2", "PENTA2", "PCV2", "ROTA2", "OPV3", "PENTA3", "PCV3",
  "ROTA3", "IPV", "Vitamin A", "Measles 1", "Yellow Fever", "Men A",
  "Measles 2", "HPV",
];

const FACILITY_TYPE_OPTIONS = ["Public", "Private"];
const SESSION_TYPE_OPTIONS   = ["Fixed", "Outreach", "Mobile"];

// ── Searchable select ─────────────────────────────────────────────────────────

interface SelectProps {
  label: string;
  placeholder: string;
  options: string[];
  value?: string;
  onChange?: (v: string) => void;
}

function SearchableSelect({ label, placeholder, options, value, onChange }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState("");
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = value !== undefined ? value : internal;
  const setSelected = (v: string) => { setInternal(v); onChange?.(v); };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const openDropdown = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropH = Math.min(options.length * 44 + 60, 280);
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const top = spaceBelow >= dropH ? rect.bottom + 4 : rect.top - dropH - 4;
      setCoords({ top: Math.max(8, top), left: rect.left, width: rect.width });
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
                    {selected === opt && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
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

// ── Simple select ─────────────────────────────────────────────────────────────

function SimpleSelect({ label, placeholder, options, value, onChange }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = value !== undefined ? value : internal;
  const setSelected = (v: string) => { setInternal(v); onChange?.(v); };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const openDropdown = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropH = Math.min(options.length * 44 + 16, 236);
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const top = spaceBelow >= dropH ? rect.bottom + 4 : rect.top - dropH - 4;
      setCoords({ top: Math.max(8, top), left: rect.left, width: rect.width });
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
          className="bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div style={{ maxHeight: "220px", overflowY: "auto" }} className="py-1">
            {options.map(opt => (
              <button key={opt} onClick={() => { setSelected(opt); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-left transition-colors">
                <div className="w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
                  style={selected === opt ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}>
                  {selected === opt && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
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

// ── Action menu (...) ─────────────────────────────────────────────────────────

function ActionMenu() {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
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
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.right - 180 });
    }
    setOpen(o => !o);
  };

  return (
    <>
      <button ref={btnRef} onClick={toggle}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 outline-none focus:outline-none">
        <svg width="16" height="4" viewBox="0 0 16 4" fill="currentColor">
          <circle cx="2" cy="2" r="1.4"/><circle cx="8" cy="2" r="1.4"/><circle cx="14" cy="2" r="1.4"/>
        </svg>
      </button>

      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: 190, zIndex: 9999 }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1">
          <button onClick={() => setOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Eye size={15} className="text-gray-400" /> View
          </button>
          <button onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 mx-1 mb-1 text-sm font-semibold text-white rounded-lg transition-colors whitespace-nowrap"
            style={{ background: "#046C3F", width: "calc(100% - 8px)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m11 7 2 2-6.5 6.5-3 .5.5-3Z"/>
            </svg>
            Mark Administered
          </button>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Text field ────────────────────────────────────────────────────────────────

function Field({ label, placeholder, value, icon, readOnly }: {
  label: string; placeholder?: string; value?: string; icon?: React.ReactNode; readOnly?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center gap-3">
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <input
          readOnly={readOnly}
          className={`w-full text-sm outline-none bg-transparent placeholder:text-gray-400 ${readOnly ? "text-gray-500 cursor-default" : "text-gray-700"}`}
          placeholder={placeholder}
          defaultValue={value}
        />
      </div>
    </div>
  );
}

// ── Immunization Records table ────────────────────────────────────────────────

function ImmunizationRecords({ onRegister }: { onRegister: () => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-800">Immunization Records</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search patient by name or ID"
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 w-64 focus:outline-none focus:ring-1 focus:ring-[#1AC073] bg-white"
            />
          </div>
          <PeriodFilterButton label="Scheduled Date" />
          <FilterDropdown
            label="All Status"
            options={["All Status", "Completed", "Due", "Pending"]}
            selected={status}
            onChange={setStatus}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[860px]">
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
            {RECORDS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4 text-sm text-gray-600 font-medium">{row.patientId}</td>
                <td className="px-5 py-4 text-sm text-gray-800 font-semibold">{row.patientName}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.age}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.scheduledDate}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.vaccine}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.dueDate}</td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap" style={STATUS_BADGE[row.status]}>
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

// ── Register Child form ───────────────────────────────────────────────────────

function RegisterChild() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-800">Register Child</h3>
        </div>

        <div className="space-y-4">
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Patient Name" placeholder="Search patient by name or ID" icon={<Search size={15} />} />
            <Field label="Patient ID" value="PAT-PLT-000234" readOnly />
          </div>

          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Encounter ID" value="ENC-PLT-000234" readOnly />
            <Field label="Facility" placeholder="Auto-filled from logged-in facility" readOnly />
          </div>

          {/* Row 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Child's ward" placeholder="Auto-filled" readOnly />
            <Field label="Child's LGA" placeholder="Auto-filled" icon={<CalendarIcon size={15} />} readOnly />
          </div>

          {/* Row 4 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <SimpleSelect label="Facility Type" placeholder="Select" options={FACILITY_TYPE_OPTIONS} />
            <Field label="Child's state" placeholder="Auto-filled" readOnly />
          </div>

          {/* Row 5 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Date of Visit" value="12/12/2020" icon={<CalendarIcon size={15} />} />
            <SimpleSelect label="Session Type" placeholder="Select" options={SESSION_TYPE_OPTIONS} />
          </div>

          {/* Row 6 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <Field label="Site Name (Optional)" placeholder="Enter name" />
              <p className="text-xs text-gray-400 mt-1.5 ml-1">Only for Outreach / Mobile</p>
            </div>
            <SearchableSelect label="Vaccinations Given" placeholder="Select" options={VACCINATION_OPTIONS} />
          </div>

          {/* Row 7 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Age at Vaccination" placeholder="Auto-calculated from Date of Birth" icon={<CalendarIcon size={15} />} readOnly />
            <Field label="Responsible Officer" placeholder="Staff performing immunization" />
          </div>

          {/* Row 8 */}
          <Field label="Reporting Period" placeholder="Month / Year" />

          {/* Row 9 */}
          <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-4 bg-white">
            <p className="text-xs text-gray-400 mb-2">Note (Optional)</p>
            <textarea
              rows={4}
              className="w-full text-sm text-gray-500 outline-none bg-transparent resize-none placeholder:text-gray-400"
              placeholder="Any relevant notes (adverse reactions, follow-up required)..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-10">
          <button className="px-8 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => setSubmitted(true)}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#046C3F" }}
          >
            Register Child
          </button>
        </div>
      </div>

      {submitted && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
          className="flex items-center gap-3 bg-white border-l-4 border-[#046C3F] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.14)] px-4 py-3 min-w-72">
          <div className="w-5 h-5 rounded-full bg-[#046C3F] flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 flex-1">New vaccine record saved</p>
          <button onClick={() => setSubmitted(false)} className="text-gray-400 hover:text-gray-600 shrink-0 outline-none focus:outline-none">
            <svg width="14" height="14" viewBox="0 0 14 14"><line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ActiveView = "records" | "register";

export default function Immunization() {
  const [view, setView] = useState<ActiveView>("records");

  const breadcrumbs = [
    { label: "Immunization", href: "/doctor-dashboard/immunization", active: view === "records" },
    ...(view === "register" ? [{ label: "Register Child", active: true }] : []),
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Immunization" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            {view === "register" && (
              <button
                onClick={() => setView("records")}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors mb-3"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">Immunization</h1>
            <p className="text-sm text-gray-500 mt-1">
              {view === "records"
                ? "Vaccination schedule and administration"
                : "Track and manage child vaccinations per NPHCDA EPI schedule"}
            </p>
          </div>

          {view === "records" && (
            <button
              onClick={() => setView("register")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
              style={{ background: "#046C3F" }}
            >
              <span className="text-lg leading-none">+</span> Register Child
            </button>
          )}
        </div>

        {view === "records"
          ? <ImmunizationRecords onRegister={() => setView("register")} />
          : <RegisterChild />}
      </div>
    </div>
  );
}
