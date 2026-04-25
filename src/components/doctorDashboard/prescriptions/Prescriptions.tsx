"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, ArrowLeft, Pill } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

// ── Types & data ──────────────────────────────────────────────────────────────

type PrescriptionStatus = "Dispensed" | "Pending" | "Cancelled" | "Out of stock";

interface PrescriptionRow {
  prescribedId: string;
  patientId: string;
  patientName: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  date: string;
  status: PrescriptionStatus;
}

const PRESCRIPTIONS: PrescriptionRow[] = [
  { prescribedId: "PRC-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Emeka Dike", drugName: "Artemether, Paracetamol", dosage: "2x daily", frequency: "Once daily",         duration: "A day", date: "12 Mar 2026", status: "Dispensed" },
  { prescribedId: "PRC-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Emeka Dike", drugName: "Artemether, Paracetamol", dosage: "3x daily", frequency: "Twice daily",        duration: "2 days", date: "12 Mar 2026", status: "Dispensed" },
  { prescribedId: "PRC-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Emeka Dike", drugName: "Artemether, Paracetamol", dosage: "3x daily", frequency: "Three times daily",  duration: "3 days", date: "12 Mar 2026", status: "Pending" },
  { prescribedId: "PRC-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Emeka Dike", drugName: "Artemether, Paracetamol", dosage: "3x daily", frequency: "Every 8 hours",      duration: "4 days", date: "12 Mar 2026", status: "Cancelled" },
  { prescribedId: "PRC-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Emeka Dike", drugName: "Artemether, Paracetamol", dosage: "3x daily", frequency: "Every 12 hours",     duration: "5 days", date: "12 Mar 2026", status: "Out of stock" },
  { prescribedId: "PRC-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Emeka Dike", drugName: "Artemether, Paracetamol", dosage: "3x daily", frequency: "Every 8 hours",      duration: "6 days", date: "12 Mar 2026", status: "Dispensed" },
  { prescribedId: "PRC-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Emeka Dike", drugName: "Artemether, Paracetamol", dosage: "3x daily", frequency: "Every 8 hours",      duration: "7 days", date: "12 Mar 2026", status: "Dispensed" },
  { prescribedId: "PRC-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Emeka Dike", drugName: "Artemether, Paracetamol", dosage: "3x daily", frequency: "Every 8 hours",      duration: "7 days", date: "12 Mar 2026", status: "Dispensed" },
  { prescribedId: "PRC-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Emeka Dike", drugName: "Artemether, Paracetamol", dosage: "3x daily", frequency: "Every 8 hours",      duration: "7 days", date: "12 Mar 2026", status: "Pending" },
  { prescribedId: "PRC-PLT-000234", patientId: "PAT-PLT-000234", patientName: "Emeka Dike", drugName: "Artemether, Paracetamol", dosage: "3x daily", frequency: "Every 8 hours",      duration: "7 days", date: "12 Mar 2026", status: "Pending" },
];

const STATUS_BADGE: Record<PrescriptionStatus, React.CSSProperties> = {
  Dispensed:        { background: "#E8F7F0", color: "#046C3F" },
  Pending:          { background: "#FFFBEB", color: "#B45309" },
  Cancelled:        { background: "#FEF2F2", color: "#DC2626" },
  "Out of stock":   { background: "#FFF7ED", color: "#C2410C" },
};

const TABLE_HEADERS = ["Prescribed ID", "Patient ID", "Patient Name", "Drug Name", "Dosage", "Frequency", "Duration", "Date", "Status"];

const DRUG_OPTIONS = [
  "Ibuprofen 400mg",
  "Metformin 500mg",
  "Paracetamol 500mg",
  "Amoxicillin 500mg",
  "Arthemether-Lumefantrine",
  "Amlodipine 5mg",
  "Lisinopril 10mg",
  "Atorvastatin 20mg",
  "Omeprazole 20mg",
  "Ciprofloxacin 500mg",
  "Azithromycin 250mg",
  "Metronidazole 400mg",
];
const FREQUENCY_OPTIONS = ["Once daily", "Twice daily", "Three times daily", "Start once"];
const PRIORITY_OPTIONS = ["Routine", "Urgent"];
const PRESCRIBED_BY_OPTIONS = [
  "Dr. Suleiman", "Dr. Adamu", "Dr. Ada", "Dr. Musa",
  "Dr. Fatima", "Dr. Chukwu", "Dr. Okonkwo", "Dr. Bello",
  "Dr. Yusuf", "Dr. Nwosu",
];

// ── Searchable select (with search input + scroll) ────────────────────────────

interface SelectProps {
  label: string;
  placeholder: string;
  options: string[];
  value?: string;
  onChange?: (v: string) => void;
  compact?: boolean;
}

function SearchableSelect({ label, placeholder, options, value, onChange, compact }: SelectProps) {
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
      <div
        ref={triggerRef}
        onClick={openDropdown}
        className={`border border-gray-200 rounded-xl bg-white flex items-center justify-between cursor-pointer ${compact ? "px-3 pt-2 pb-2" : "px-4 pt-3 pb-3"}`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className={`text-sm truncate ${selected ? "text-gray-700" : "text-gray-400"}`}>{selected || placeholder}</p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {mounted && open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width, zIndex: 9999 }}
          className="bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#1AC073]"
              />
            </div>
          </div>
          <div style={{ maxHeight: "220px", overflowY: "auto" }} className="py-1">
            {filtered.length === 0
              ? <p className="text-sm text-gray-400 text-center py-4">No results</p>
              : filtered.map(opt => (
                <button key={opt} onClick={() => { setSelected(opt); setOpen(false); setSearch(""); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-left transition-colors"
                >
                  <div
                    className="w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
                    style={selected === opt ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}
                  >
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

// ── Simple select (no search) ─────────────────────────────────────────────────

function SimpleSelect({ label, placeholder, options, value, onChange, compact }: SelectProps) {
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
      <div
        ref={triggerRef}
        onClick={openDropdown}
        className={`border border-gray-200 rounded-xl bg-white flex items-center justify-between cursor-pointer ${compact ? "px-3 pt-2 pb-2" : "px-4 pt-3 pb-3"}`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className={`text-sm truncate ${selected ? "text-gray-700" : "text-gray-400"}`}>{selected || placeholder}</p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {mounted && open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width, zIndex: 9999 }}
          className="bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <div style={{ maxHeight: "220px", overflowY: "auto" }} className="py-1">
            {options.map(opt => (
              <button key={opt} onClick={() => { setSelected(opt); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-left transition-colors"
              >
                <div
                  className="w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
                  style={selected === opt ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}
                >
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

// ── Prescription History tab ──────────────────────────────────────────────────

function PrescriptionHistory() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-800">Prescription History</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search patient by Drug name..."
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 w-72 focus:outline-none focus:ring-1 focus:ring-[#1AC073] bg-white"
            />
          </div>
          <PeriodFilterButton label="Date Range" />
          <FilterDropdown
            label="All Status"
            options={["All Status", "Dispensed", "Pending", "Cancelled", "Out of stock"]}
            selected={status}
            onChange={setStatus}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
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
            {PRESCRIPTIONS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4 text-sm text-gray-600 font-medium">{row.prescribedId}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{row.patientId}</td>
                <td className="px-5 py-4 text-sm text-gray-800 font-semibold">{row.patientName}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.drugName}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.dosage}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.frequency}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.duration}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.date}</td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap" style={STATUS_BADGE[row.status]}>
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

// ── Medication row ────────────────────────────────────────────────────────────

interface MedRow { id: number; drug: string; dosage: string; frequency: string; duration: string; }

function MedicationRow({ row, onRemove, onChange }: {
  row: MedRow;
  onRemove: () => void;
  onChange: (field: keyof MedRow, value: string) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr auto", gap: "0.75rem", alignItems: "start" }}>
      <SearchableSelect
        label="Medication Name"
        placeholder="Select Medication"
        options={DRUG_OPTIONS}
        value={row.drug}
        onChange={v => onChange("drug", v)}
      />
      <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white">
        <p className="text-xs text-gray-400 mb-1">Dosage</p>
        <input
          className="w-full text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
          placeholder="e.g 1 tab"
          value={row.dosage}
          onChange={e => onChange("dosage", e.target.value)}
        />
      </div>
      <SimpleSelect
        label="Frequency"
        placeholder="Select"
        options={FREQUENCY_OPTIONS}
        value={row.frequency}
        onChange={v => onChange("frequency", v)}
      />
      <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white">
        <p className="text-xs text-gray-400 mb-1">Duration</p>
        <input
          className="w-full text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
          placeholder="e.g 5 days"
          value={row.duration}
          onChange={e => onChange("duration", e.target.value)}
        />
      </div>
      <button
        onClick={onRemove}
        className="mt-6 w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 transition-colors shrink-0 outline-none focus:outline-none"
      >
        <svg width="12" height="12" viewBox="0 0 12 12"><line x1="1" y1="1" x2="11" y2="11" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" /><line x1="11" y1="1" x2="1" y2="11" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

// ── Create Prescription form ──────────────────────────────────────────────────

function CreatePrescription() {
  const [medRows, setMedRows] = useState<MedRow[]>([{ id: 1, drug: "", dosage: "", frequency: "", duration: "" }]);
  const [submitted, setSubmitted] = useState(false);

  const addRow = () => setMedRows(r => [...r, { id: Date.now(), drug: "", dosage: "", frequency: "", duration: "" }]);
  const removeRow = (id: number) => setMedRows(r => r.filter(m => m.id !== id));
  const updateRow = (id: number, field: keyof MedRow, value: string) =>
    setMedRows(r => r.map(m => m.id === id ? { ...m, [field]: value } : m));

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center shrink-0">
            <Pill size={18} className="text-[#046C3F]" />
          </div>
          <h3 className="text-base font-bold text-gray-800">New Prescription</h3>
        </div>

        <div className="space-y-4">
          {/* Row 1: Patient Name + Encounter ID */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center gap-3">
              <Search size={15} className="text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">Patient Name</p>
                <input
                  className="w-full text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
                  placeholder="Search patient by name or ID"
                />
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white">
              <p className="text-xs text-gray-400 mb-1">Encounter ID</p>
              <input
                className="w-full text-sm text-gray-700 outline-none bg-transparent"
                defaultValue="ENC-PLT-000234"
              />
            </div>
          </div>

          {/* Row 2: Prescription ID + Prescribed By */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white">
              <p className="text-xs text-gray-400 mb-1">Prescription ID</p>
              <input
                className="w-full text-sm text-gray-700 outline-none bg-transparent"
                defaultValue="PRC-PLT-000234"
              />
            </div>
            <SimpleSelect
              label="Prescribed By"
              placeholder="Select"
              options={PRESCRIBED_BY_OPTIONS}
            />
          </div>

          {/* Medication rows */}
          <div className="space-y-3">
            {medRows.map(row => (
              <MedicationRow
                key={row.id}
                row={row}
                onRemove={() => removeRow(row.id)}
                onChange={(field, value) => updateRow(row.id, field, value)}
              />
            ))}
          </div>

          {/* Add medication */}
          <button
            onClick={addRow}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#046C3F] rounded-xl text-sm font-semibold text-[#046C3F] hover:bg-[#F0FBF6] transition-colors"
          >
            <span className="text-lg leading-none">+</span> Add medication
          </button>

          {/* Priority */}
          <SimpleSelect
            label="Priority"
            placeholder="Select Priority"
            options={PRIORITY_OPTIONS}
          />

          {/* Instruction */}
          <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-4 bg-white">
            <p className="text-xs text-gray-400 mb-2">Instruction</p>
            <textarea
              rows={5}
              className="w-full text-sm text-gray-500 outline-none bg-transparent resize-none placeholder:text-gray-400"
              placeholder="Special Instruction"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-10">
          <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => setSubmitted(true)}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#046C3F" }}
          >
            Create Prescription
          </button>
        </div>
      </div>

      {submitted && (
        <div
          style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
          className="flex items-center gap-3 bg-white border-l-4 border-[#046C3F] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.14)] px-4 py-3 min-w-72"
        >
          <div className="w-5 h-5 rounded-full bg-[#046C3F] flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800">Prescription Created</p>
            <p className="text-xs text-gray-500 mt-0.5">Prescription sent to pharmacy</p>
          </div>
          <button onClick={() => setSubmitted(false)} className="text-gray-400 hover:text-gray-600 shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14"><line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ActiveTab = "history" | "create";

export default function Prescriptions() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("history");

  const breadcrumbs = [
    { label: "Prescriptions", href: "/doctor-dashboard/prescriptions", active: activeTab === "history" },
    ...(activeTab === "create" ? [{ label: "Create Prescription", active: true }] : []),
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Prescriptions" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="mb-2">
          {activeTab === "create" && (
            <button
              onClick={() => setActiveTab("history")}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors mb-4"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage prescriptions</p>
        </div>

        {/* Tab switcher */}
        <div className="flex mb-6 mt-4">
          <button
            onClick={() => setActiveTab("history")}
            className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors"
            style={activeTab === "history"
              ? { background: "#046C3F", color: "#fff" }
              : { background: "transparent", color: "#6B7280" }}
          >
            Prescription History
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors"
            style={activeTab === "create"
              ? { background: "#046C3F", color: "#fff" }
              : { background: "transparent", color: "#6B7280" }}
          >
            Create Prescription
          </button>
        </div>

        {activeTab === "history" ? <PrescriptionHistory /> : <CreatePrescription />}
      </div>
    </div>
  );
}
