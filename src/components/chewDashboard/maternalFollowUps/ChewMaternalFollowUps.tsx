"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search, ChevronDown, ChevronUp, ArrowLeft, Calendar,
  Plus, User, Heart, Activity, Microscope, Shield,
  AlertTriangle, Save, Check, Baby, ClipboardCheck, X,
} from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ANCRecord {
  patientId: string; patientName: string; gestationalAge: string;
  visitDate: string; riskFactors: string; notes: string;
}
interface PNCRecord {
  patientId: string; patientName: string; deliveryDate: string;
  deliveryType: string; followUpSchedule: string; complications: string;
}

// ── Static data ───────────────────────────────────────────────────────────────

const ANC_RECORDS: ANCRecord[] = [
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "28 weeks", visitDate: "12 Mar 2026", riskFactors: "None",                      notes: "Normal progress"           },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Pre-eclampsia",               notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Gestational hypertension",    notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",                notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",                notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",                notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",                notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",                notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",                notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",                notes: "Close monitoring required" },
];

const PNC_RECORDS: PNCRecord[] = [
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Normal Vaginal Delivery (NVD)",  followUpSchedule: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Cesarean Section (C-Section)",   followUpSchedule: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUpSchedule: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUpSchedule: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUpSchedule: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUpSchedule: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUpSchedule: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUpSchedule: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUpSchedule: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUpSchedule: "12 Mar 2026", complications: "Yes/No (specify)" },
];

const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENOTYPE_OPTIONS    = ["AA", "AS", "SS", "AC", "SC"];
const HIV_OPTIONS         = ["Positive", "Negative", "Unknown/Not tested"];
const VDRL_OPTIONS        = ["Negative", "Positive", "Not Done"];
const HEPATITIS_OPTIONS   = ["Positive", "Negative", "Unknown"];
const IRON_FOLATE_OPTIONS = ["Yes", "No"];
const ANC_TYPE_OPTIONS    = ["New (N)", "Return (R)"];

// PNC form options
const VISIT_TYPE_OPTIONS       = ["New (N)", "Return (R)"];
const VAGINAL_EXAM_OPTIONS     = ["Yes", "No"];
const COUNSELLING_OPTIONS      = ["Done", "Not Done", "Refused"];
const BABY_SEX_OPTIONS         = ["Male", "Female"];
const YES_NO_OPTIONS           = ["Yes", "No"];
const OUTCOME_OPTIONS          = ["No treatment (N)", "Treated", "Admitted", "Referred Out"];
const TRANSPORT_OPTIONS        = ["Ambulance", "Others"];

// ── Dropdown position helper ──────────────────────────────────────────────────

function calcCoords(rect: DOMRect, w: number, estimatedH: number) {
  const spaceBelow = window.innerHeight - rect.bottom - 8;
  const spaceAbove = rect.top - 8;
  const fits = spaceBelow >= Math.min(estimatedH, 200);
  const maxH = fits ? Math.min(spaceBelow, estimatedH) : Math.min(spaceAbove, estimatedH);
  const top  = fits ? rect.bottom + 4 : Math.max(8, rect.top - maxH - 4);
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - w - 8));
  return { top, left, maxH };
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return createPortal(
    <div style={{
      position: "fixed", bottom: 24, left: 24, zIndex: 99999,
      display: "flex", alignItems: "center", gap: 12,
      background: "#fff", borderRadius: 12, padding: "12px 16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.12)", borderLeft: "4px solid #046C3F",
      minWidth: 220, maxWidth: 360,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", background: "#046C3F",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Check size={14} color="#fff" strokeWidth={3} />
      </div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#111827" }}>{message}</span>
      <button onClick={onClose} style={{ color: "#9CA3AF", display: "flex", alignItems: "center" }}>
        <X size={16} />
      </button>
    </div>,
    document.body,
  );
}

// ── Form field ────────────────────────────────────────────────────────────────

function FormField({ label, value, onChange, placeholder, disabled, icon }: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; disabled?: boolean; icon?: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
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

function FormTextarea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full text-sm text-gray-700 bg-transparent outline-none resize-none placeholder:text-gray-300"
      />
    </div>
  );
}

// ── Form select (portal dropdown) ─────────────────────────────────────────────

function FormSelect({ label, value, onChange, options, placeholder = "Select" }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
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
          trigRef.current  && !trigRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (!open && trigRef.current) {
      const rect = trigRef.current.getBoundingClientRect();
      const c = calcCoords(rect, rect.width, options.length * 48 + 16);
      setCoords({ ...c, width: rect.width });
    }
    setOpen(o => !o);
  };

  return (
    <>
      <div ref={trigRef} onClick={toggle}
        className="border border-gray-200 rounded-xl px-4 py-3 bg-white cursor-pointer hover:border-gray-300 transition-colors">
        <p className="text-xs text-gray-400 mb-1.5">{label}</p>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${value ? "text-gray-700" : "text-gray-300"}`}>{value || placeholder}</span>
          <ChevronDown size={15} className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </div>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width, maxHeight: coords.maxH, zIndex: 9999, display: "flex", flexDirection: "column" }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          <div style={{ overflowY: "auto" }} className="py-1.5 px-1.5">
            {options.map(opt => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
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

// ── Number stepper ────────────────────────────────────────────────────────────

function NumberStepper({ label, value, onChange, placeholder }: {
  label: string; value: number; onChange: (v: number) => void; placeholder?: string;
}) {
  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <div className="flex items-stretch">
        <div className="flex-1 px-4 pt-3 pb-2.5">
          <p className="text-xs text-gray-400 mb-1.5">{label}</p>
          <input
            type="text"
            inputMode="numeric"
            value={value === 0 && placeholder ? "" : value}
            placeholder={placeholder}
            onChange={e => {
              const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
              onChange(isNaN(n) ? 0 : Math.max(0, n));
            }}
            className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-300"
          />
        </div>
        <div className="flex flex-col border-l border-gray-200">
          <button onClick={() => onChange(value + 1)}
            className="flex-1 px-2.5 flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-200">
            <ChevronUp size={12} className="text-gray-400" />
          </button>
          <button onClick={() => onChange(Math.max(0, value - 1))}
            className="flex-1 px-2.5 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ChevronDown size={12} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Collapsible section wrapper ───────────────────────────────────────────────

function CollapsibleSection({ title, icon, children }: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 cursor-pointer"
        onClick={() => setOpen(v => !v)}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#E8F7F0" }}>
            {icon}
          </div>
          <h2 className="text-sm font-bold text-gray-800">{title}</h2>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      {open && <div className="px-6 py-6 space-y-4">{children}</div>}
    </div>
  );
}

// ── Tab bar (display-only) ────────────────────────────────────────────────────

function TabBar({ active, onANC, onPNC }: {
  active: "anc" | "pnc"; onANC: () => void; onPNC: () => void;
}) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
      <button onClick={onANC}
        className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
        style={active === "anc" ? { background: "#046C3F", color: "#fff" } : { color: "#6B7280" }}>
        ANC Visits
      </button>
      <button onClick={onPNC}
        className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
        style={active === "pnc" ? { background: "#046C3F", color: "#fff" } : { color: "#6B7280" }}>
        Postnatal Care
      </button>
    </div>
  );
}

// ── ANC Visits list ───────────────────────────────────────────────────────────

function ANCVisitsList({ onNewVisit, onGoToPNC }: {
  onNewVisit: () => void; onGoToPNC: () => void;
}) {
  const [page, setPage] = useState(1);

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader
        title="Maternal Care"
        breadcrumbs={[{ label: "Maternal Care" }, { label: "ANC Visits", active: true }]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ANC (Antenatal Care) Visits</h1>
            <p className="text-sm text-gray-500 mt-1">Manage prenatal care for pregnant women</p>
          </div>
          <button onClick={onNewVisit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
            style={{ background: "#046C3F" }}>
            <Plus size={16} /> New ANC Visit
          </button>
        </div>

        <TabBar active="anc" onANC={() => {}} onPNC={onGoToPNC} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <h2 className="text-sm font-bold text-gray-800">ANC Visit Records</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input placeholder="Search patient by Drug name..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-72" />
              </div>
              <PeriodFilterButton label="Date Range" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Patient ID", "Patient Name", "Gestational Age", "Visit Date", "Risk Factors", "Notes"].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      <span className="flex items-center gap-1">{h} <ChevronDown size={11} className="opacity-50" /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ANC_RECORDS.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-600 font-medium">{row.patientId}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{row.patientName}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.gestationalAge}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.visitDate}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.riskFactors}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.notes}</td>
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

// ── ANC Registration form ─────────────────────────────────────────────────────

function ANCRegistrationForm({ onBack }: { onBack: () => void }) {
  const [toast, setToast] = useState(false);

  // Patient & Facility
  const [patientSearch, setPatientSearch] = useState("");
  const [patientAge, setPatientAge]       = useState("");
  const [ancType, setAncType]             = useState("");
  const [dateOfEncounter, setDateOfEncounter] = useState("12/12/2020");
  const [cardNumber, setCardNumber]       = useState("");
  const [lmp, setLmp]                     = useState("12/12/2020");
  const [edd, setEdd]                     = useState("12/12/2020");

  // Obstetric History
  const [gravida, setGravida] = useState(0);
  const [parity,  setParity]  = useState(0);
  const [living,  setLiving]  = useState(0);

  // Physical Measurements
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [bp,     setBp]     = useState(0);
  const bmi = height > 0 && weight > 0
    ? (weight / Math.pow(height / 100, 2)).toFixed(1)
    : "";

  // Laboratory
  const [bloodGroup,  setBloodGroup]  = useState("");
  const [genotype,    setGenotype]    = useState("");
  const [hivStatus,   setHivStatus]   = useState("");
  const [vdrl,        setVdrl]        = useState("");
  const [hepatitisB,  setHepatitisB]  = useState("");
  const [hemoglobin,  setHemoglobin]  = useState(0);
  const [urinalysis,  setUrinalysis]  = useState("");

  // Interventions
  const [tt1Date,    setTt1Date]    = useState("12/12/2020");
  const [iptp1Date,  setIptp1Date]  = useState("12/12/2020");
  const [ironFolate, setIronFolate] = useState("");

  // Risk Assessment
  const [riskFactors, setRiskFactors] = useState("");
  const [allergies,   setAllergies]   = useState("");
  const [notes,       setNotes]       = useState("");

  return (
    <>
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader
        title="Maternal Care"
        breadcrumbs={[
          { label: "Maternal Care" },
          { label: "ANC Visits" },
          { label: "New ANC Visits", active: true },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">

        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#046C3F] hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Back
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">ANC Registration</h1>
          <p className="text-sm text-gray-500 mt-1">Capture antenatal care visit information</p>
        </div>

        <TabBar active="anc" onANC={() => {}} onPNC={() => {}} />

        {/* Patient & Facility Information */}
        <CollapsibleSection title="Patient & Facility Information" icon={<User size={16} color="#046C3F" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Patient Name" value={patientSearch} onChange={setPatientSearch}
              placeholder="Search patient by name or ID" icon={<Search size={13} />} />
            <FormField label="Facility" value="Ikeja PHC" disabled />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Patient ID" value="PAT-PLT-000234" disabled />
            <FormField label="Encounter ID" value="ENC-PLT-000234" disabled />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Patient Age" value={patientAge} onChange={setPatientAge} placeholder="Patient age" />
            <FormSelect label="ANC Attendance Type" value={ancType} onChange={setAncType}
              options={ANC_TYPE_OPTIONS} placeholder="Select" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Date of Encounter" value={dateOfEncounter} onChange={setDateOfEncounter}
              placeholder="12/12/2020" icon={<Calendar size={13} />} />
            <FormField label="Mother's Patient/Client Card Number (Optional)" value={cardNumber}
              onChange={setCardNumber} placeholder="Existing PHC card" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Last Menstrual Period (LMP)" value={lmp} onChange={setLmp}
              placeholder="12/12/2020" icon={<Calendar size={13} />} />
            <FormField label="Expected Date of Delivery (EDD)" value={edd} onChange={setEdd}
              placeholder="12/12/2020" icon={<Calendar size={13} />} />
          </div>
        </CollapsibleSection>

        {/* Obstetric History */}
        <CollapsibleSection title="Obstetric History" icon={<Heart size={16} color="#046C3F" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <NumberStepper label="Gravida"          value={gravida} onChange={setGravida} placeholder="Total pregnancies"      />
            <NumberStepper label="Parity"           value={parity}  onChange={setParity}  placeholder="Number of previous births" />
            <NumberStepper label="Living children"  value={living}  onChange={setLiving}  placeholder="Number alive"           />
          </div>
        </CollapsibleSection>

        {/* Physical Measurements */}
        <CollapsibleSection title="Physical Measurements" icon={<Activity size={16} color="#046C3F" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <NumberStepper label="Height (cm)" value={height} onChange={setHeight} />
            <NumberStepper label="Weight (kg)" value={weight} onChange={setWeight} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <NumberStepper label="Blood Pressure" value={bp} onChange={setBp} />
            <FormField label="BMI" value={bmi} disabled placeholder="Auto-Calculated" />
          </div>
        </CollapsibleSection>

        {/* Laboratory Investigations */}
        <CollapsibleSection title="Laboratory Investigations" icon={<Microscope size={16} color="#046C3F" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Blood Group" value={bloodGroup} onChange={setBloodGroup}
              options={BLOOD_GROUP_OPTIONS} placeholder="Select blood group" />
            <FormSelect label="Genotype" value={genotype} onChange={setGenotype}
              options={GENOTYPE_OPTIONS} placeholder="Select genotype" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="HIV Status" value={hivStatus} onChange={setHivStatus}
              options={HIV_OPTIONS} placeholder="Select Status" />
            <FormSelect label="VDRL (Syphilis)" value={vdrl} onChange={setVdrl}
              options={VDRL_OPTIONS} placeholder="Select Status" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Hepatitis B" value={hepatitisB} onChange={setHepatitisB}
              options={HEPATITIS_OPTIONS} placeholder="Select Status" />
            <NumberStepper label="Hemoglobin (g/dL)" value={hemoglobin} onChange={setHemoglobin} />
          </div>
          <FormField label="Urinalysis" value={urinalysis} onChange={setUrinalysis}
            placeholder="Protein, glucose etc." />
        </CollapsibleSection>

        {/* Interventions (1st Visit) */}
        <CollapsibleSection title="Interventions (1st Visit)" icon={<Shield size={16} color="#046C3F" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="TT1 Date" value={tt1Date} onChange={setTt1Date}
              placeholder="12/12/2020" icon={<Calendar size={13} />} />
            <FormField label="IPTp1 Date" value={iptp1Date} onChange={setIptp1Date}
              placeholder="12/12/2020" icon={<Calendar size={13} />} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Iron/Folate Given" value={ironFolate} onChange={setIronFolate}
              options={IRON_FOLATE_OPTIONS} placeholder="Select" />
          </div>
        </CollapsibleSection>

        {/* Risk Assessment */}
        <CollapsibleSection title="Risk Assessment" icon={<AlertTriangle size={16} color="#046C3F" />}>
          <FormTextarea label="Risk Factors" value={riskFactors} onChange={setRiskFactors}
            placeholder="Age <18 or > 35, previous C-section, hypertension, diabetes, etc." />
          <FormTextarea label="Known Allergies" value={allergies} onChange={setAllergies}
            placeholder="Drug or food allergies" />
          <FormTextarea label="Additional Notes" value={notes} onChange={setNotes}
            placeholder="Any other relevant information" />
        </CollapsibleSection>

        {/* Footer buttons */}
        <div className="flex items-center gap-3 pb-4">
          <button onClick={onBack}
            className="px-8 py-2.5 rounded-xl text-sm font-semibold text-gray-600 transition-colors"
            style={{ background: "#F3F4F6" }}>
            Cancel
          </button>
          <button onClick={() => setToast(true)}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: "#046C3F" }}>
            <Save size={15} /> Register Pregnancy
          </button>
        </div>
      </div>
    </div>
    {toast && <Toast message="ANC Visit Recorded" onClose={() => setToast(false)} />}
    </>
  );
}

// ── Postnatal Care list ───────────────────────────────────────────────────────

function PostnatalCareList({ onBack, onNewVisit }: { onBack: () => void; onNewVisit: () => void }) {
  const [page, setPage] = useState(1);

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader
        title="Maternal Care"
        breadcrumbs={[{ label: "Maternal Care" }, { label: "Postnatal Care", active: true }]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">

        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#046C3F] hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Postnatal Care (PNC)</h1>
            <p className="text-sm text-gray-500 mt-1">Track maternal and newborn health after delivery</p>
          </div>
          <button onClick={onNewVisit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
            style={{ background: "#046C3F" }}>
            <Plus size={16} /> New Postnatal Visit
          </button>
        </div>

        <TabBar active="pnc" onANC={onBack} onPNC={() => {}} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <h2 className="text-sm font-bold text-gray-800">Postnatal Visit Records</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input placeholder="Search patient by Drug name..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-72" />
              </div>
              <PeriodFilterButton label="Follow-up schedule" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[820px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Patient ID", "Patient Name", "Delivery Date", "Delivery Type", "Follow-up Schedule", "Complications"].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      <span className="flex items-center gap-1">{h} <ChevronDown size={11} className="opacity-50" /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PNC_RECORDS.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-600 font-medium">{row.patientId}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{row.patientName}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.deliveryDate}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.deliveryType}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.followUpSchedule}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.complications}</td>
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

// ── PNC Registration form ─────────────────────────────────────────────────────

function PNCRegistrationForm({ onBack }: { onBack: () => void }) {
  const [toast, setToast] = useState(false);

  // Patient & Facility
  const [patientSearch,   setPatientSearch]   = useState("");
  const [patientAge,      setPatientAge]      = useState(0);
  const [pncVisitDate,    setPncVisitDate]    = useState("12/12/2020");

  // Maternal History
  const [parity,          setParity]          = useState(0);
  const [timingOfVisit,   setTimingOfVisit]   = useState("");
  const [visitType,       setVisitType]       = useState("");
  const [associatedProblems, setAssociatedProblems] = useState("");

  // Maternal Care Assessment
  const [vaginalExam,       setVaginalExam]       = useState("");
  const [haemoglobin,       setHaemoglobin]       = useState("");
  const [urinalysis,        setUrinalysis]        = useState("");
  const [maternalNutrition, setMaternalNutrition] = useState("");
  const [familyPlanning,    setFamilyPlanning]    = useState("");
  const [fgmCounselling,    setFgmCounselling]    = useState("");
  const [infectionPrevention, setInfectionPrevention] = useState("");

  // Newborn Care Assessment
  const [babySex,               setBabySex]               = useState("");
  const [exclusiveBreastfeeding, setExclusiveBreastfeeding] = useState("");
  const [complementaryFeeding,  setComplementaryFeeding]  = useState("");

  // Neonatal Complications & KMC
  const [newbornDangerSigns,   setNewbornDangerSigns]   = useState("");
  const [firstDoseAntibiotics, setFirstDoseAntibiotics] = useState("");
  const [neonatalTetanus,      setNeonatalTetanus]      = useState("");
  const [neonatalJaundice,     setNeonatalJaundice]     = useState("");
  const [kmcProvided,          setKmcProvided]          = useState("");

  // Outcome
  const [outcome,           setOutcome]           = useState("");
  const [responsibleOfficer, setResponsibleOfficer] = useState("");
  const [referralReason,    setReferralReason]    = useState("");
  const [transportationOut, setTransportationOut] = useState("");
  const [createdAt,         setCreatedAt]         = useState("12/12/2020");

  return (
    <>
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader
        title="Maternal Care"
        breadcrumbs={[
          { label: "Maternal Care" },
          { label: "Postnatal Care" },
          { label: "New Postnatal Visit", active: true },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">

        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#046C3F] hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Back
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maternal Care</h1>
          <p className="text-sm text-gray-500 mt-1">Antenatal and postnatal care management</p>
        </div>

        <TabBar active="pnc" onANC={() => {}} onPNC={() => {}} />

        {/* Section 1: Patient & Facility Information */}
        <CollapsibleSection title="Patient & Facility Information" icon={<User size={16} color="#046C3F" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Patient Name" value={patientSearch} onChange={setPatientSearch}
              placeholder="Search patient by name or ID" icon={<Search size={13} />} />
            <FormField label="Patient ID" value="PAT-PLT-000234" disabled />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Encounter ID" value="ENC-PLT-000234" disabled />
            <FormField label="Facility" value="Ikeja PHC" disabled />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <NumberStepper label="Patient Age" value={patientAge} onChange={setPatientAge} />
            <FormField label="Age Group" value="" disabled placeholder="Auto-calculated e.g 20-34 / 35-49 / >50" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Patient ward" value="" disabled placeholder="Auto-filled" />
            <FormField label="Patient LGA" value="" disabled placeholder="Auto-filled" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Patient state" value="" disabled placeholder="Auto-filled" />
            <FormField label="PNC visit date" value={pncVisitDate} onChange={setPncVisitDate}
              placeholder="12/12/2020" icon={<Calendar size={13} />} />
          </div>
        </CollapsibleSection>

        {/* Section 2: Maternal History & PNC Attendance Type */}
        <CollapsibleSection title="Maternal History & PNC Attendance Type" icon={<Heart size={16} color="#046C3F" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <NumberStepper label="Parity" value={parity} onChange={setParity} placeholder="Number of previous births" />
            <FormField label="Timing of Postnatal Visit" value={timingOfVisit} onChange={setTimingOfVisit}
              placeholder="e.g 4-7 days / >7 days" />
            <FormSelect label="Visit Type" value={visitType} onChange={setVisitType}
              options={VISIT_TYPE_OPTIONS} placeholder="Select" />
          </div>
          <FormTextarea label="Associated Problems" value={associatedProblems} onChange={setAssociatedProblems}
            placeholder="Any maternal health complaints or complications..." />
        </CollapsibleSection>

        {/* Section 3: Maternal Care Assessment */}
        <CollapsibleSection title="Maternal Care Assessment" icon={<Activity size={16} color="#046C3F" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Vaginal Examination Conducted" value={vaginalExam} onChange={setVaginalExam}
              options={VAGINAL_EXAM_OPTIONS} placeholder="Select" />
            <FormField label="Haemoglobin / PCV Test" value={haemoglobin} onChange={setHaemoglobin}
              placeholder="Enter result" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Urinalysis" value={urinalysis} onChange={setUrinalysis}
              placeholder="Record sugar result" />
            <FormSelect label="Maternal Nutrition Counselling" value={maternalNutrition} onChange={setMaternalNutrition}
              options={COUNSELLING_OPTIONS} placeholder="Select" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Family Planning Counselling" value={familyPlanning} onChange={setFamilyPlanning}
              options={COUNSELLING_OPTIONS} placeholder="Select" />
            <FormSelect label="Female Genital Mutilation Counselling" value={fgmCounselling} onChange={setFgmCounselling}
              options={COUNSELLING_OPTIONS} placeholder="Select" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Infection Prevention Counselling" value={infectionPrevention} onChange={setInfectionPrevention}
              options={COUNSELLING_OPTIONS} placeholder="Select" />
          </div>
        </CollapsibleSection>

        {/* Section 4: Newborn Care Assessment */}
        <CollapsibleSection title="Newborn Care Assessment" icon={<Baby size={16} color="#046C3F" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Baby Sex" value={babySex} onChange={setBabySex}
              options={BABY_SEX_OPTIONS} placeholder="Select" />
            <FormSelect label="Exclusive Breastfeeding Counselling" value={exclusiveBreastfeeding}
              onChange={setExclusiveBreastfeeding} options={COUNSELLING_OPTIONS} placeholder="Select" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Complementary Feeding Counselling" value={complementaryFeeding}
              onChange={setComplementaryFeeding} options={COUNSELLING_OPTIONS} placeholder="Select" />
          </div>
        </CollapsibleSection>

        {/* Section 5: Neonatal Complications & KMC */}
        <CollapsibleSection title="Neonatal Complications & Kangaroo Mother Care (KMC)"
          icon={<Shield size={16} color="#046C3F" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Newborn Danger Signs" value={newbornDangerSigns} onChange={setNewbornDangerSigns}
              options={YES_NO_OPTIONS} placeholder="Select" />
            <FormSelect label="First Dose Antibiotics Given" value={firstDoseAntibiotics}
              onChange={setFirstDoseAntibiotics} options={YES_NO_OPTIONS} placeholder="Select" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Neonatal Tetanus" value={neonatalTetanus} onChange={setNeonatalTetanus}
              options={YES_NO_OPTIONS} placeholder="Select" />
            <FormSelect label="Neonatal Jaundice" value={neonatalJaundice} onChange={setNeonatalJaundice}
              options={YES_NO_OPTIONS} placeholder="Select" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="KMC Provided" value={kmcProvided} onChange={setKmcProvided}
              options={YES_NO_OPTIONS} placeholder="Select" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Kangaroo Mother Care is commonly used for low birth weight babies.
          </p>
        </CollapsibleSection>

        {/* Section 6: Outcome of Visit & Responsible Staff */}
        <CollapsibleSection title="Outcome of Visit & Responsible Staff"
          icon={<ClipboardCheck size={16} color="#046C3F" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Outcome" value={outcome} onChange={setOutcome}
              options={OUTCOME_OPTIONS} placeholder="Select" />
            <FormField label="Responsible Officer" value={responsibleOfficer} onChange={setResponsibleOfficer}
              placeholder="Enter Name" />
          </div>
          <FormTextarea label="Referral Reason (Required if referred)" value={referralReason}
            onChange={setReferralReason} placeholder="Enter reason here" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormSelect label="Transportation Out" value={transportationOut} onChange={setTransportationOut}
              options={TRANSPORT_OPTIONS} placeholder="Select" />
            <FormField label="Created At" value={createdAt} onChange={setCreatedAt}
              placeholder="12/12/2020" icon={<Calendar size={13} />} />
          </div>
        </CollapsibleSection>

        {/* Footer buttons */}
        <div className="flex items-center gap-3 pb-4">
          <button onClick={onBack}
            className="px-8 py-2.5 rounded-xl text-sm font-semibold text-gray-600 transition-colors"
            style={{ background: "#F3F4F6" }}>
            Cancel
          </button>
          <button onClick={() => setToast(true)}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: "#046C3F" }}>
            <Save size={15} /> Save PNC Visit
          </button>
        </div>
      </div>
    </div>
    {toast && <Toast message="Postnatal record saved" onClose={() => setToast(false)} />}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ViewState = "anc" | "new-anc" | "pnc" | "new-pnc";

export default function ChewMaternalFollowUps() {
  const [view, setView] = useState<ViewState>("anc");

  if (view === "new-anc") return <ANCRegistrationForm onBack={() => setView("anc")} />;
  if (view === "new-pnc") return <PNCRegistrationForm onBack={() => setView("pnc")} />;
  if (view === "pnc")     return <PostnatalCareList   onBack={() => setView("anc")} onNewVisit={() => setView("new-pnc")} />;

  return (
    <ANCVisitsList
      onNewVisit={() => setView("new-anc")}
      onGoToPNC={() => setView("pnc")}
    />
  );
}
