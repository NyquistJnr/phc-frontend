"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown, ChevronUp, Search, ArrowLeft, Calendar as CalendarIcon,
} from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

// ── Data ──────────────────────────────────────────────────────────────────────

interface ANCRow {
  patientId: string;
  patientName: string;
  gestationalAge: string;
  visitDate: string;
  riskFactors: string;
  notes: string;
}

const ANC_RECORDS: ANCRow[] = [
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "28 weeks", visitDate: "12 Mar 2026", riskFactors: "None",                     notes: "Normal progress" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Pre-eclampsia",             notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Gestational hypertension",  notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",              notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",              notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",              notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",              notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",              notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",              notes: "Close monitoring required" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", gestationalAge: "36 weeks", visitDate: "12 Mar 2026", riskFactors: "Elevated BMI",              notes: "Close monitoring required" },
];

// ── Dropdown options ──────────────────────────────────────────────────────────

const ANC_ATTENDANCE_OPTIONS  = ["New", "Return"];
const BLOOD_GROUP_OPTIONS      = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENOTYPE_OPTIONS         = ["AA", "AS", "SS", "AC"];
const HIV_STATUS_OPTIONS       = ["Positive", "Negative", "Unknown"];
const VDRL_OPTIONS             = ["Reactive", "Non-Reactive", "Unknown"];
const HEPATITIS_B_OPTIONS      = ["Positive", "Negative"];
const IRON_FOLATE_OPTIONS      = ["Yes", "No"];

// ── Simple select ─────────────────────────────────────────────────────────────

interface SelectProps { label: string; placeholder: string; options: string[]; }

function SimpleSelect({ label, placeholder, options }: SelectProps) {
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

// ── Number stepper input ──────────────────────────────────────────────────────

function NumberInput({ label, placeholder }: { label: string; placeholder?: string }) {
  const [value, setValue] = useState(0);
  return (
    <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm text-gray-700">{value || placeholder || 0}</p>
      </div>
      <div className="flex flex-col gap-0.5 shrink-0">
        <button onClick={() => setValue(v => v + 1)}
          className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition-colors outline-none focus:outline-none">
          <ChevronUp size={11} className="text-gray-500" />
        </button>
        <button onClick={() => setValue(v => Math.max(0, v - 1))}
          className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition-colors outline-none focus:outline-none">
          <ChevronDown size={11} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}

// ── Plain text field ──────────────────────────────────────────────────────────

function Field({ label, placeholder, value, icon, readOnly }: {
  label: string; placeholder?: string; value?: string; icon?: React.ReactNode; readOnly?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center gap-3">
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <input readOnly={readOnly}
          className={`w-full text-sm outline-none bg-transparent placeholder:text-gray-400 ${readOnly ? "text-gray-500 cursor-default" : "text-gray-700"}`}
          placeholder={placeholder} defaultValue={value} />
      </div>
    </div>
  );
}

// ── Collapsible section ───────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors outline-none focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E8F7F0] flex items-center justify-center shrink-0">{icon}</div>
          <span className="text-sm font-bold text-gray-800">{title}</span>
        </div>
        <ChevronUp size={16} className={`text-gray-400 transition-transform ${open ? "" : "rotate-180"}`} />
      </button>
      {open && <div className="px-5 pb-8 pt-1 space-y-4">{children}</div>}
    </div>
  );
}

// ── ANC Visit Records table ───────────────────────────────────────────────────

function ANCVisitRecords() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-800">ANC Visit Records</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search patient by name or ID"
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 w-64 focus:outline-none focus:ring-1 focus:ring-[#1AC073] bg-white" />
          </div>
          <PeriodFilterButton label="Date Range" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[740px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Patient ID", "Patient Name", "Gestational Age", "Visit Date", "Risk Factors", "Notes"].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1">{h} <ChevronDown size={12} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ANC_RECORDS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4 text-sm text-gray-600 font-medium">{row.patientId}</td>
                <td className="px-5 py-4 text-sm text-gray-800 font-semibold">{row.patientName}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.gestationalAge}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.visitDate}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.riskFactors}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={68} onPageChange={setPage} />
    </div>
  );
}

// ── ANC Registration form ─────────────────────────────────────────────────────

function ANCRegistration() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <div className="space-y-4">
        {/* Patient & Facility Information */}
        <Section title="Patient & Facility Information" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        }>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Patient Name" placeholder="Search patient by name or ID" icon={<Search size={14} />} />
            <Field label="Facility" value="Ikeja PHC" readOnly />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Patient ID" value="PAT-PLT-000234" readOnly />
            <Field label="Encounter ID" value="ENC-PLT-000234" readOnly />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Patient Age" placeholder="Patient age" />
            <SimpleSelect label="ANC Attendance Type" placeholder="Select" options={ANC_ATTENDANCE_OPTIONS} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Date of Encounter" value="12/12/2020" icon={<CalendarIcon size={14} />} />
            <Field label="Mother's Patient/Client Card Number (Optional)" placeholder="Existing PHC card" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Last Menstrual Period (LMP)" value="12/12/2020" icon={<CalendarIcon size={14} />} />
            <Field label="Expected Date of Delivery (EDD)" value="12/12/2020" icon={<CalendarIcon size={14} />} />
          </div>
        </Section>

        {/* Obstetric History */}
        <Section title="Obstetric History" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a5 5 0 0 1 5 5c0 5-5 9-5 9s-5-4-5-9a5 5 0 0 1 5-5z"/>
          </svg>
        }>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <NumberInput label="Gravida" placeholder="Total pregnancies" />
            <NumberInput label="Parity" placeholder="Number of previous births" />
            <NumberInput label="Living children" placeholder="Number alive" />
          </div>
        </Section>

        {/* Physical Measurements */}
        <Section title="Physical Measurements" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20M12 2v20"/>
          </svg>
        }>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <NumberInput label="Height (cm)" />
            <NumberInput label="Weight (kg)" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <NumberInput label="Blood Pressure" />
            <Field label="BMI" placeholder="Auto-Calculated" readOnly />
          </div>
        </Section>

        {/* Laboratory Investigations */}
        <Section title="Laboratory Investigations" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
          </svg>
        }>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <SimpleSelect label="Blood Group" placeholder="Select blood group" options={BLOOD_GROUP_OPTIONS} />
            <SimpleSelect label="Genotype" placeholder="Select genotype" options={GENOTYPE_OPTIONS} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <SimpleSelect label="HIV Status" placeholder="Select Status" options={HIV_STATUS_OPTIONS} />
            <SimpleSelect label="VDRL (Syphilis)" placeholder="Select Status" options={VDRL_OPTIONS} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <SimpleSelect label="Hepatitis B" placeholder="Select Status" options={HEPATITIS_B_OPTIONS} />
            <NumberInput label="Hemoglobin (g/dL)" />
          </div>
          <Field label="Urinalysis" placeholder="Protein, glucose etc" />
        </Section>

        {/* Interventions */}
        <Section title="Interventions (1st Visit)" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2l4 4-4 4"/><path d="M22 6H9"/><path d="m6 12-4 4 4 4"/><path d="M2 16h13"/>
            <path d="m11 7 2 2-6.5 6.5-3 .5.5-3Z"/>
          </svg>
        }>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="TT1 Date" value="12/12/2020" icon={<CalendarIcon size={14} />} />
            <Field label="IPTp1 Date" value="12/12/2020" icon={<CalendarIcon size={14} />} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
            <SimpleSelect label="Iron/Folate Given" placeholder="Select" options={IRON_FOLATE_OPTIONS} />
            <div />
          </div>
        </Section>

        {/* Risk Assessment */}
        <Section title="Risk Assessment" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        }>
          <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-4 bg-white">
            <p className="text-xs text-gray-400 mb-2">Risk Factors</p>
            <textarea rows={4} className="w-full text-sm text-gray-500 outline-none bg-transparent resize-none placeholder:text-gray-400"
              placeholder="Age <18 or > 35, previous C-section, hypertension, diabetes, etc" />
          </div>
          <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-4 bg-white">
            <p className="text-xs text-gray-400 mb-2">Known Allergies</p>
            <textarea rows={4} className="w-full text-sm text-gray-500 outline-none bg-transparent resize-none placeholder:text-gray-400"
              placeholder="Drug or food allergies" />
          </div>
          <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-4 bg-white">
            <p className="text-xs text-gray-400 mb-2">Additional Notes</p>
            <textarea rows={4} className="w-full text-sm text-gray-500 outline-none bg-transparent resize-none placeholder:text-gray-400"
              placeholder="Any other relevant information" />
          </div>
        </Section>
      </div>

      <div className="flex items-center gap-3 mt-10">
        <button className="px-8 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors">
          Cancel
        </button>
        <button onClick={() => setSubmitted(true)}
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#046C3F" }}>
          Register Pregnancy
        </button>
      </div>

      {submitted && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
          className="flex items-center gap-3 bg-white border-l-4 border-[#046C3F] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.14)] px-4 py-3 min-w-72">
          <div className="w-5 h-5 rounded-full bg-[#046C3F] flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 flex-1">Pregnancy registered successfully</p>
          <button onClick={() => setSubmitted(false)} className="text-gray-400 hover:text-gray-600 shrink-0 outline-none focus:outline-none">
            <svg width="14" height="14" viewBox="0 0 14 14"><line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}
    </>
  );
}

// ── PNC data ──────────────────────────────────────────────────────────────────

interface PNCRow {
  patientId: string; patientName: string; deliveryDate: string;
  deliveryType: string; followUp: string; complications: string;
}

const PNC_RECORDS: PNCRow[] = [
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Normal Vaginal Delivery (NVD)", followUp: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Cesarean Section (C-Section)",   followUp: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUp: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUp: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUp: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUp: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUp: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUp: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUp: "12 Mar 2026", complications: "Yes/No (specify)" },
  { patientId: "PAT-PLT-000234", patientName: "Emeka Dike", deliveryDate: "12 Mar 2026", deliveryType: "Assisted Vaginal Delivery",       followUp: "12 Mar 2026", complications: "Yes/No (specify)" },
];

const YES_NO_OPTIONS       = ["Yes", "No"];
const VISIT_TYPE_OPTIONS   = ["New (N)", "Return (R)"];
const BABY_SEX_OPTIONS     = ["Male", "Female"];
const OUTCOME_OPTIONS      = ["No Treatment (NT)", "Treated", "Admitted", "Referred Out"];
const TRANSPORT_OPTIONS    = ["Ambulance", "Others"];

// ── PNC Visit Records table ───────────────────────────────────────────────────

function PNCVisitRecords() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-800">Postnatal Visit Records</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search patient by name or ID"
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 w-64 focus:outline-none focus:ring-1 focus:ring-[#1AC073] bg-white" />
          </div>
          <PeriodFilterButton label="Follow-up schedule" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="border-b border-gray-100">
              {["Patient ID", "Patient Name", "Delivery Date", "Delivery Type", "Follow-up Schedule", "Complications"].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1">{h} <ChevronDown size={12} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {PNC_RECORDS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4 text-sm text-gray-600 font-medium">{row.patientId}</td>
                <td className="px-5 py-4 text-sm text-gray-800 font-semibold">{row.patientName}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.deliveryDate}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.deliveryType}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.followUp}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.complications}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={68} onPageChange={setPage} />
    </div>
  );
}

// ── PNC Registration form ─────────────────────────────────────────────────────

function PNCRegistration() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <div className="space-y-4">
        {/* Patient & Facility Information */}
        <Section title="Patient & Facility Information" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        }>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Patient Name" placeholder="Search patient by name or ID" icon={<Search size={14} />} />
            <Field label="Patient ID" value="PAT-PLT-000234" readOnly />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Encounter ID" value="ENC-PLT-000234" readOnly />
            <Field label="Facility" value="Ikeja PHC" readOnly />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <NumberInput label="Patient Age" />
            <Field label="Age Group" placeholder="Auto-calculated e.g 20-34 / 35-49 / ≥50" readOnly />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Patient ward" placeholder="Auto-filled" readOnly />
            <Field label="Patient LGA" placeholder="Auto-filled" readOnly />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Patient state" placeholder="Auto-filled" readOnly />
            <Field label="PNC visit date" value="12/12/2020" icon={<CalendarIcon size={14} />} />
          </div>
        </Section>

        {/* Maternal History & PNC Attendance Type */}
        <Section title="Maternal History & PNC Attendance Type" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a5 5 0 0 1 5 5c0 5-5 9-5 9s-5-4-5-9a5 5 0 0 1 5-5z"/>
          </svg>
        }>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <NumberInput label="Parity" />
            <Field label="Timing of Postnatal Visit" placeholder="e.g 4-7 days / >7 days" />
            <SimpleSelect label="Visit Type" placeholder="Select" options={VISIT_TYPE_OPTIONS} />
          </div>
          <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-4 bg-white">
            <p className="text-xs text-gray-400 mb-2">Associated Problems</p>
            <textarea rows={4} className="w-full text-sm text-gray-500 outline-none bg-transparent resize-none placeholder:text-gray-400"
              placeholder="Any maternal health complaints or complications..." />
          </div>
        </Section>

        {/* Maternal Care Assessment */}
        <Section title="Maternal Care Assessment" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
          </svg>
        }>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <SimpleSelect label="Vaginal Examination Conducted" placeholder="Select" options={YES_NO_OPTIONS} />
            <Field label="Haemoglobin / PCV Test" placeholder="Enter result" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Urinalysis" placeholder="Record sugar result" />
            <SimpleSelect label="Maternal Nutrition Counselling" placeholder="Select" options={YES_NO_OPTIONS} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <SimpleSelect label="Family Planning Counselling" placeholder="Select" options={YES_NO_OPTIONS} />
            <SimpleSelect label="Female Genital Mutilation Counseling" placeholder="Select" options={YES_NO_OPTIONS} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
            <SimpleSelect label="Infection Prevention Counselling" placeholder="Select" options={YES_NO_OPTIONS} />
            <div />
          </div>
        </Section>

        {/* Newborn Care Assessment */}
        <Section title="Newborn Care Assessment" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        }>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <SimpleSelect label="Baby Sex" placeholder="Select" options={BABY_SEX_OPTIONS} />
            <SimpleSelect label="Exclusive Breastfeeding Counselling" placeholder="Select" options={YES_NO_OPTIONS} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
            <SimpleSelect label="Complementary Feeding Counselling" placeholder="Select" options={YES_NO_OPTIONS} />
            <div />
          </div>
        </Section>

        {/* Neonatal Complications & KMC */}
        <Section title="Neonatal Complications & Kangaroo Mother Care (KMC)" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        }>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <SimpleSelect label="Newborn Danger Signs" placeholder="Select" options={YES_NO_OPTIONS} />
            <SimpleSelect label="First Dose Antibiotics Given" placeholder="Select" options={YES_NO_OPTIONS} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <SimpleSelect label="Neonatal Tetanus" placeholder="Select" options={YES_NO_OPTIONS} />
            <SimpleSelect label="Neonatal Jaundice" placeholder="Select" options={YES_NO_OPTIONS} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
            <SimpleSelect label="KMC Provided" placeholder="Select" options={YES_NO_OPTIONS} />
            <div />
          </div>
          <p className="text-xs text-gray-400">Kangaroo Mother Care is commonly used for low birth weight babies.</p>
        </Section>

        {/* Outcome of Visit & Responsible Staff */}
        <Section title="Outcome of Visit & Responsible Staff" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        }>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <SimpleSelect label="Outcome" placeholder="Select" options={OUTCOME_OPTIONS} />
            <Field label="Responsible Officer" placeholder="Enter Name" />
          </div>
          <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-4 bg-white">
            <p className="text-xs text-gray-400 mb-2">Referral Reason (Required if referred)</p>
            <textarea rows={4} className="w-full text-sm text-gray-500 outline-none bg-transparent resize-none placeholder:text-gray-400"
              placeholder="Enter reason here" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <SimpleSelect label="Transportation Out" placeholder="Select" options={TRANSPORT_OPTIONS} />
            <Field label="Created At" value="12/12/2020" icon={<CalendarIcon size={14} />} />
          </div>
        </Section>
      </div>

      <div className="flex items-center gap-3 mt-10">
        <button className="px-8 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors">
          Cancel
        </button>
        <button onClick={() => setSubmitted(true)}
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#046C3F" }}>
          Save PNC Visit
        </button>
      </div>

      {submitted && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
          className="flex items-center gap-3 bg-white border-l-4 border-[#046C3F] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.14)] px-4 py-3 min-w-72">
          <div className="w-5 h-5 rounded-full bg-[#046C3F] flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 flex-1">Postnatal record saved</p>
          <button onClick={() => setSubmitted(false)} className="text-gray-400 hover:text-gray-600 shrink-0 outline-none focus:outline-none">
            <svg width="14" height="14" viewBox="0 0 14 14"><line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}
    </>
  );
}

// ── Tab switcher ──────────────────────────────────────────────────────────────

type ActiveTab = "anc" | "postnatal";

function TabSwitcher({ active, onChange }: { active: ActiveTab; onChange: (t: ActiveTab) => void }) {
  return (
    <div className="flex mb-6">
      <button onClick={() => onChange("anc")}
        className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors"
        style={active === "anc" ? { background: "#046C3F", color: "#fff" } : { background: "transparent", color: "#6B7280" }}>
        ANC Visits
      </button>
      <button onClick={() => onChange("postnatal")}
        className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors"
        style={active === "postnatal" ? { background: "#046C3F", color: "#fff" } : { background: "transparent", color: "#6B7280" }}>
        Postnatal Care
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ActiveView = "records" | "register";

export default function MaternalCare() {
  const [ancView, setAncView] = useState<ActiveView>("records");
  const [pncView, setPncView] = useState<ActiveView>("records");
  const [tab, setTab] = useState<ActiveTab>("anc");

  const isRegister = tab === "anc" ? ancView === "register" : pncView === "register";

  const titles = {
    ancRecords:   "ANC (Antenatal Care) Visits",
    ancRegister:  "ANC Registration",
    pncRecords:   "Postnatal Care (PNC)",
    pncRegister:  "Maternal Care",
  };
  const subtitles = {
    ancRecords:   "Manage prenatal care for pregnant women",
    ancRegister:  "Capture antenatal care visit information",
    pncRecords:   "Track maternal and newborn health after delivery",
    pncRegister:  "Antenatal and postnatal care management",
  };

  const titleKey = tab === "anc"
    ? (ancView === "records" ? "ancRecords" : "ancRegister")
    : (pncView === "records" ? "pncRecords" : "pncRegister");

  const breadcrumbs = [
    { label: "Maternal Care", href: "/doctor-dashboard/maternal-care", active: !isRegister },
    ...(isRegister ? [{ label: tab === "anc" ? "ANC Visits" : "Postnatal Care", active: true }] : []),
  ];

  const newBtnLabel = tab === "anc" ? "+ New ANC Visit" : "+ New Postnatal Visit";
  const handleNew = () => tab === "anc" ? setAncView("register") : setPncView("register");
  const handleBack = () => tab === "anc" ? setAncView("records") : setPncView("records");

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Maternal Care" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="flex items-start justify-between mb-2">
          <div>
            {isRegister && (
              <button onClick={handleBack}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors mb-3">
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{titles[titleKey]}</h1>
            <p className="text-sm text-gray-500 mt-1">{subtitles[titleKey]}</p>
          </div>
          {!isRegister && (
            <button onClick={handleNew}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
              style={{ background: "#046C3F" }}>
              <span className="text-lg leading-none">+</span>
              {tab === "anc" ? "New ANC Visit" : "New Postnatal Visit"}
            </button>
          )}
        </div>

        <div className="mt-4 flex mb-6">
          <button onClick={() => setTab("anc")}
            className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors"
            style={tab === "anc" ? { background: "#046C3F", color: "#fff" } : { background: "transparent", color: "#6B7280" }}>
            ANC Visits
          </button>
          <button onClick={() => setTab("postnatal")}
            className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors"
            style={tab === "postnatal" ? { background: "#046C3F", color: "#fff" } : { background: "transparent", color: "#6B7280" }}>
            Postnatal Care
          </button>
        </div>

        {tab === "anc"
          ? (ancView === "records" ? <ANCVisitRecords /> : <ANCRegistration />)
          : (pncView === "records" ? <PNCVisitRecords /> : <PNCRegistration />)}
      </div>
    </div>
  );
}
