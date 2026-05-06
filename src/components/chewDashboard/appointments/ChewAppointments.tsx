"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search, ChevronDown, ArrowLeft, Calendar, Plus,
  Eye, Pencil, Upload, X, Check, Clock, MoreHorizontal,
} from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────────

type AppointmentStatus = "Scheduled" | "In-progress" | "Completed" | "Cancelled" | "Missed";

interface AppointmentRow {
  id: string; patientName: string; patientId: string;
  date: string; time: string; type: string;
  assignedTo: string; status: AppointmentStatus;
}

// ── Static data ───────────────────────────────────────────────────────────────

const VISIT_TYPE_OPTIONS = ["ANC", "General", "Immunization", "Postnatal", "Consultation", "Follow-up", "Lab Test"];
const STATUS_OPTIONS     = ["Scheduled", "In-progress", "Completed", "Cancelled", "Missed"];

const ASSIGNED_TO_OPTIONS = [
  "Dr Musa - PAT-PLT-000234",
  "Nurse Ada - PAT-PLT-000234",
  "Festus Mba - PAT-PLT-000234",
  "Dr Philip - PAT-PLT-000234",
  "Nurse Grace - PAT-PLT-000235",
  "Dr Emeka - PAT-PLT-000236",
  "Nurse Chioma - PAT-PLT-000237",
  "Dr Bola - PAT-PLT-000238",
];

const APPOINTMENTS: AppointmentRow[] = [
  { id: "APT-PLT-000001", patientName: "Melvin Ojobo",    patientId: "PAT-PLT-000234", date: "12 Mar 2026", time: "10:00 AM", type: "Consultation", assignedTo: "Dr Festus",    status: "Scheduled"   },
  { id: "APT-PLT-000002", patientName: "Emeka Dike",      patientId: "PAT-PLT-000235", date: "12 Mar 2026", time: "10:30 AM", type: "ANC",          assignedTo: "Nurse Ada",    status: "In-progress" },
  { id: "APT-PLT-000003", patientName: "Amaka Okafor",    patientId: "PAT-PLT-000236", date: "12 Mar 2026", time: "11:00 AM", type: "Immunization",  assignedTo: "Dr Musa",     status: "Completed"   },
  { id: "APT-PLT-000004", patientName: "Chidi Nwosu",     patientId: "PAT-PLT-000237", date: "12 Mar 2026", time: "11:30 AM", type: "Follow-up",     assignedTo: "Nurse Grace", status: "Cancelled"   },
  { id: "APT-PLT-000005", patientName: "Ngozi Adeyemi",   patientId: "PAT-PLT-000238", date: "12 Mar 2026", time: "12:00 PM", type: "General",       assignedTo: "Dr Philip",   status: "Missed"      },
  { id: "APT-PLT-000006", patientName: "Tunde Balogun",   patientId: "PAT-PLT-000239", date: "13 Mar 2026", time: "09:00 AM", type: "Postnatal",     assignedTo: "Nurse Ada",   status: "Scheduled"   },
  { id: "APT-PLT-000007", patientName: "Fatima Suleiman", patientId: "PAT-PLT-000240", date: "13 Mar 2026", time: "09:30 AM", type: "Lab Test",      assignedTo: "Dr Emeka",    status: "Completed"   },
  { id: "APT-PLT-000008", patientName: "Kemi Afolabi",    patientId: "PAT-PLT-000241", date: "13 Mar 2026", time: "10:00 AM", type: "Consultation",  assignedTo: "Dr Bola",     status: "Scheduled"   },
  { id: "APT-PLT-000009", patientName: "Uche Eze",        patientId: "PAT-PLT-000242", date: "13 Mar 2026", time: "10:30 AM", type: "ANC",           assignedTo: "Nurse Chioma", status: "In-progress" },
  { id: "APT-PLT-000010", patientName: "Biodun Adewale",  patientId: "PAT-PLT-000243", date: "13 Mar 2026", time: "11:00 AM", type: "General",       assignedTo: "Dr Philip",   status: "Missed"      },
];

const STATUS_STYLES: Record<AppointmentStatus, { bg: string; color: string }> = {
  "Scheduled":   { bg: "#EFF6FF", color: "#1D4ED8" },
  "In-progress": { bg: "#FFFBEB", color: "#D97706" },
  "Completed":   { bg: "#ECFDF5", color: "#059669" },
  "Cancelled":   { bg: "#FEF2F2", color: "#DC2626" },
  "Missed":      { bg: "#F3F4F6", color: "#6B7280" },
};

// ── Dropdown position helper ──────────────────────────────────────────────────

function calcCoords(rect: DOMRect, w: number, estimatedH: number, rightAlign = false) {
  const spaceBelow = window.innerHeight - rect.bottom - 8;
  const spaceAbove = rect.top - 8;
  const fits = spaceBelow >= Math.min(estimatedH, 200);
  const maxH = fits ? Math.min(spaceBelow, estimatedH) : Math.min(spaceAbove, estimatedH);
  const top  = fits ? rect.bottom + 4 : Math.max(8, rect.top - maxH - 4);
  const left = rightAlign
    ? Math.max(8, rect.right - w)
    : Math.max(8, Math.min(rect.left, window.innerWidth - w - 8));
  return { top, left, maxH };
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { bg, color } = STATUS_STYLES[status];
  return (
    <span style={{ background: bg, color, borderRadius: 9999, padding: "3px 10px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

// ── Form field ────────────────────────────────────────────────────────────────

function FormField({ label, value, onChange, placeholder, disabled, icon }: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; disabled?: boolean; icon?: React.ReactNode;
}) {
  return (
    <div className={`border rounded-xl px-4 py-3 ${disabled ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200"}`}>
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
        <input
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-300 disabled:text-gray-400 disabled:cursor-default"
        />
      </div>
    </div>
  );
}

// ── Form textarea ─────────────────────────────────────────────────────────────

function FormTextarea({ label, value, onChange, placeholder, disabled }: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; disabled?: boolean;
}) {
  return (
    <div className={`border rounded-xl px-4 py-3 ${disabled ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200"}`}>
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <textarea
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={4}
        className="w-full text-sm text-gray-700 bg-transparent outline-none resize-none placeholder:text-gray-300 disabled:text-gray-400 disabled:cursor-default"
      />
    </div>
  );
}

// ── Form select (single-select, portal) ───────────────────────────────────────

function FormSelect({ label, value, onChange, options, placeholder = "Select", disabled }: {
  label: string; value: string; onChange?: (v: string) => void;
  options: string[]; placeholder?: string; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, maxH: 300, width: 0 });
  const [mounted, setMounted] = useState(false);
  const trigRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          trigRef.current && !trigRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (disabled) return;
    if (!open && trigRef.current) {
      const rect = trigRef.current.getBoundingClientRect();
      setCoords({ ...calcCoords(rect, rect.width, options.length * 48 + 16), width: rect.width });
    }
    setOpen(o => !o);
  };

  return (
    <>
      <div ref={trigRef} onClick={toggle}
        className={`border rounded-xl px-4 py-3 ${disabled ? "bg-gray-50 border-gray-100 cursor-default" : "bg-white border-gray-200 cursor-pointer hover:border-gray-300"} transition-colors`}>
        <p className="text-xs text-gray-400 mb-1.5">{label}</p>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${value ? "text-gray-700" : "text-gray-300"}`}>{value || placeholder}</span>
          {!disabled && <ChevronDown size={15} className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />}
        </div>
      </div>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width, maxHeight: coords.maxH, zIndex: 9999 }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          <div className="py-1.5 px-1.5" style={{ overflowY: "auto", maxHeight: coords.maxH }}>
            {options.map(opt => (
              <button key={opt} onClick={() => { onChange?.(opt); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                  style={value === opt ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}>
                  {value === opt && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                {opt}
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Searchable form select (for Assigned To) ──────────────────────────────────

function SearchableFormSelect({ label, value, onChange, options, placeholder = "Select", disabled }: {
  label: string; value: string; onChange?: (v: string) => void;
  options: string[]; placeholder?: string; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, maxH: 300, width: 0 });
  const [mounted, setMounted] = useState(false);
  const trigRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          trigRef.current && !trigRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  const toggle = () => {
    if (disabled) return;
    if (!open && trigRef.current) {
      const rect = trigRef.current.getBoundingClientRect();
      setCoords({ ...calcCoords(rect, rect.width, Math.min(filtered.length, 6) * 44 + 60), width: rect.width });
      setSearch("");
    }
    setOpen(o => !o);
  };

  return (
    <>
      <div ref={trigRef} onClick={toggle}
        className={`border rounded-xl px-4 py-3 ${disabled ? "bg-gray-50 border-gray-100 cursor-default" : "bg-white border-gray-200 cursor-pointer hover:border-gray-300"} transition-colors`}>
        <p className="text-xs text-gray-400 mb-1.5">{label}</p>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${value ? "text-gray-700" : "text-gray-300"}`}>{value || placeholder}</span>
          {!disabled && <ChevronDown size={15} className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />}
        </div>
      </div>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width, maxHeight: coords.maxH, zIndex: 9999, display: "flex", flexDirection: "column" }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          <div className="px-3 pt-2.5 pb-1.5 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50">
              <Search size={13} className="text-gray-400 shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()} placeholder="Search"
                className="flex-1 text-xs bg-transparent outline-none text-gray-700 placeholder:text-gray-400" />
            </div>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }} className="py-1.5 px-1.5">
            {filtered.map(opt => (
              <button key={opt} onClick={() => { onChange?.(opt); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                  style={value === opt ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}>
                  {value === opt && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                {opt}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-3">No results</p>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Checkbox filter dropdown (multi-select, for list page) ────────────────────

function CheckboxFilterDropdown({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, maxH: 300 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const W = Math.max(180, Math.max(...options.map(o => o.length)) * 8 + 72);

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
    if (!open && btnRef.current)
      setCoords(calcCoords(btnRef.current.getBoundingClientRect(), W, options.length * 44 + 16, true));
    setOpen(o => !o);
  };

  const toggleOption = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  };

  const displayLabel = selected.length === 0 ? label : `${label.replace("All ", "")} (${selected.length})`;

  return (
    <>
      <button ref={btnRef} onClick={toggle}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-gray-300 bg-white transition-colors whitespace-nowrap">
        {displayLabel} <ChevronDown size={13} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: W, maxHeight: coords.maxH, zIndex: 9999 }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          <div style={{ overflowY: "auto" }} className="py-1.5 px-1.5">
            {options.map(opt => (
              <button key={opt} onClick={() => toggleOption(opt)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                  style={selected.includes(opt) ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}>
                  {selected.includes(opt) && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                {opt}
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Toast (bottom-right) ──────────────────────────────────────────────────────

function Toast({ message, subtitle, onClose }: { message: string; subtitle?: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return createPortal(
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 99999,
      display: "flex", alignItems: "flex-start", gap: 12,
      background: "#fff", borderRadius: 12, padding: "12px 16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.12)", borderLeft: "4px solid #046C3F",
      minWidth: 240, maxWidth: 360,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", background: "#046C3F",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Check size={14} color="#fff" strokeWidth={3} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>{message}</p>
        {subtitle && <p style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0 0" }}>{subtitle}</p>}
      </div>
      <button onClick={onClose} style={{ color: "#9CA3AF", display: "flex", alignItems: "center", flexShrink: 0 }}>
        <X size={16} />
      </button>
    </div>,
    document.body,
  );
}

// ── Action menu ───────────────────────────────────────────────────────────────

function ActionMenu({ onView, onEdit }: { onView: () => void; onEdit: () => void }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, maxH: 300 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const W = 168;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current)
      setCoords(calcCoords(btnRef.current.getBoundingClientRect(), W, 4 * 44 + 16, true));
    setOpen(o => !o);
  };

  const items: { label: string; icon: React.ReactNode; action: () => void; danger?: boolean }[] = [
    { label: "View",   icon: <Eye size={14} />,    action: () => { onView(); setOpen(false); } },
    { label: "Edit",   icon: <Pencil size={14} />, action: () => { onEdit(); setOpen(false); } },
    { label: "Export", icon: <Upload size={14} />, action: () => setOpen(false) },
    { label: "Cancel", icon: <X size={14} />,      action: () => setOpen(false), danger: true },
  ];

  return (
    <>
      <button ref={btnRef} onClick={toggle}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
        <MoreHorizontal size={16} />
      </button>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: W, zIndex: 9999 }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1.5 px-1.5">
          {items.map(item => (
            <button key={item.label} onClick={item.action}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors text-left"
              style={{ color: item.danger ? "#DC2626" : "#374151" }}>
              <span style={{ color: item.danger ? "#DC2626" : "#6B7280" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Appointment form (view / edit / new) ──────────────────────────────────────

type FormMode = "view" | "edit" | "new";

function AppointmentForm({ mode, row, onBack, onSwitchToEdit }: {
  mode: FormMode; row?: AppointmentRow; onBack: () => void; onSwitchToEdit?: () => void;
}) {
  const [toast, setToast] = useState<{ message: string; subtitle?: string } | null>(null);
  const [patientName, setPatientName] = useState(row?.patientName ?? "");
  const [date,        setDate]        = useState(row?.date ?? "12/12/2020");
  const [time,        setTime]        = useState(row?.time ?? "12:00 PM");
  const [visitType,   setVisitType]   = useState(row?.type ?? "");
  const [assignedTo,  setAssignedTo]  = useState(row?.assignedTo ?? "");
  const [reason,      setReason]      = useState(mode === "new" ? "" : "Filled");
  const [notes,       setNotes]       = useState(mode === "new" ? "" : "Filled");

  const isView = mode === "view";
  const isNew  = mode === "new";
  const cardTitle      = isView ? "View appointment" : isNew ? "Create appointment" : "Edit appointment";
  const breadcrumbLabel = isView ? "View Appointment" : isNew ? "New Appointment" : "Edit Appointment";

  return (
    <>
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader
        title="Appointments"
        breadcrumbs={[{ label: "Appointments" }, { label: breadcrumbLabel, active: true }]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#046C3F] hover:opacity-80 transition-opacity">
            <ArrowLeft size={16} /> Back
          </button>
          {!isNew && (
            <div className="flex items-center gap-2">
              <button onClick={isView ? onSwitchToEdit : undefined}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                <Pencil size={15} /> Edit
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: "#046C3F" }}>
                <Upload size={15} /> Export
              </button>
            </div>
          )}
        </div>

        {isNew && <h1 className="text-2xl font-bold text-gray-900">Create Appointment</h1>}

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#E8F7F0" }}>
              <Calendar size={16} color="#046C3F" />
            </div>
            <h2 className="text-sm font-bold text-gray-800">{cardTitle}</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Patient Name" value={patientName}
              onChange={isView ? undefined : setPatientName}
              placeholder="Search patient by name or ID"
              icon={<Search size={13} />} disabled={isView} />
            <FormField label="Patient ID" value={row?.patientId ?? "PAT-PLT-000234"} disabled />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Encounter ID"   value="ENC-PLT-000234" disabled />
            <FormField label="Appointment ID" value={row?.id ?? "APT-PLT-000234"} disabled />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Date" value={date} onChange={isView ? undefined : setDate}
              placeholder="12/12/2020" icon={<Calendar size={13} />} disabled={isView} />
            <FormField label="Time" value={time} onChange={isView ? undefined : setTime}
              placeholder="12:00 PM" icon={<Clock size={13} />} disabled={isView} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Visit Type" value={visitType}
              onChange={isView ? undefined : setVisitType}
              options={VISIT_TYPE_OPTIONS} placeholder="Select" disabled={isView} />
            <SearchableFormSelect label="Assigned To" value={assignedTo}
              onChange={isView ? undefined : setAssignedTo}
              options={ASSIGNED_TO_OPTIONS} placeholder="Select" disabled={isView} />
          </div>

          <FormTextarea label="Reason for Visit" value={reason}
            onChange={isView ? undefined : setReason}
            placeholder="Enter reason here" disabled={isView} />

          <FormTextarea label="Notes (Optional)" value={notes}
            onChange={isView ? undefined : setNotes}
            placeholder="Enter notes here" disabled={isView} />
        </div>

        {/* Footer */}
        {!isView && (
          <div className="flex items-center gap-3 pb-4">
            <button onClick={onBack}
              className="px-8 py-2.5 rounded-xl text-sm font-semibold text-gray-600 transition-colors"
              style={{ background: "#F3F4F6" }}>
              Cancel
            </button>
            {isNew ? (
              <button
                onClick={() => setToast({ message: "Appointment scheduled", subtitle: `Appointment scheduled for ${patientName || "patient"}` })}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: "#046C3F" }}>
                <Calendar size={15} /> Schedule
              </button>
            ) : (
              <button onClick={() => setToast({ message: "Changes Updated Successfully" })}
                className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: "#046C3F" }}>
                Update Changes
              </button>
            )}
          </div>
        )}
      </div>
    </div>
    {toast && <Toast message={toast.message} subtitle={toast.subtitle} onClose={() => setToast(null)} />}
    </>
  );
}

// ── Appointments list ─────────────────────────────────────────────────────────

function AppointmentsList({ onView, onEdit, onCreate }: {
  onView: (row: AppointmentRow) => void;
  onEdit: (row: AppointmentRow) => void;
  onCreate: () => void;
}) {
  const [page, setPage] = useState(1);
  const [selectedTypes,    setSelectedTypes]    = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader
        title="Appointments"
        breadcrumbs={[{ label: "Appointments", active: true }]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track patient appointments</p>
          </div>
          <button onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
            style={{ background: "#046C3F" }}>
            <Plus size={16} /> Create Appointment
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <h2 className="text-sm font-bold text-gray-800">Appointment Records</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input placeholder="Search appointments..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-56" />
              </div>
              <PeriodFilterButton label="Date Range" />
              <CheckboxFilterDropdown label="All Visit Type" options={VISIT_TYPE_OPTIONS}
                selected={selectedTypes} onChange={setSelectedTypes} />
              <CheckboxFilterDropdown label="All Status" options={STATUS_OPTIONS}
                selected={selectedStatuses} onChange={setSelectedStatuses} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Appt. ID", "Patient Name", "Patient ID", "Date", "Time", "Type", "Assigned To", "Status", "Action"].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h !== "Action"
                        ? <span className="flex items-center gap-1">{h} <ChevronDown size={11} className="opacity-50" /></span>
                        : h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {APPOINTMENTS.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-600 font-medium whitespace-nowrap">{row.id}</td>
                    <td className="px-5 py-3 text-sm text-gray-700 font-semibold">{row.patientName}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.patientId}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.date}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.time}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.type}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.assignedTo}</td>
                    <td className="px-5 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-5 py-3">
                      <ActionMenu onView={() => onView(row)} onEdit={() => onEdit(row)} />
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

type ViewState = "list" | "view" | "edit" | "new";

export default function ChewAppointments() {
  const [view, setView] = useState<ViewState>("list");
  const [selectedRow, setSelectedRow] = useState<AppointmentRow | null>(null);

  if (view === "view" && selectedRow)
    return <AppointmentForm mode="view" row={selectedRow}
      onBack={() => setView("list")} onSwitchToEdit={() => setView("edit")} />;
  if (view === "edit" && selectedRow)
    return <AppointmentForm mode="edit" row={selectedRow} onBack={() => setView("list")} />;
  if (view === "new")
    return <AppointmentForm mode="new" onBack={() => setView("list")} />;

  return (
    <AppointmentsList
      onView={row => { setSelectedRow(row); setView("view"); }}
      onEdit={row => { setSelectedRow(row); setView("edit"); }}
      onCreate={() => setView("new")}
    />
  );
}
