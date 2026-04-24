"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown, User, Activity, Stethoscope, ClipboardList,
  TestTube, Pill, ArrowLeftRight, X, Plus, Calendar as CalendarIcon,
  ArrowLeft, Search, Check, CheckCircle,
} from "lucide-react";
import Link from "next/link";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";

// ── Searchable + scrollable select (for large option lists) ───────────────────

function SearchableFormSelect({
  label, placeholder, options,
}: { label: string; placeholder: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const openDropdown = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropH = Math.min(options.length * 44 + 60, 300);
      const top = rect.bottom + dropH > window.innerHeight
        ? rect.top - dropH - 4
        : rect.bottom + 4;
      setCoords({ top, left: rect.left, width: rect.width });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false);
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
        className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center justify-between cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className={`text-sm truncate ${selected ? "text-gray-700" : "text-gray-400"}`}>
            {selected || placeholder}
          </p>
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
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No results</p>
            ) : filtered.map(opt => (
              <button
                key={opt}
                onClick={() => { setSelected(opt); setOpen(false); setSearch(""); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-left transition-colors"
              >
                <div
                  className="w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
                  style={selected === opt
                    ? { background: "#046C3F", borderColor: "#046C3F" }
                    : { borderColor: "#D1D5DB" }}
                >
                  {selected === opt && <Check size={10} color="#fff" strokeWidth={3} />}
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

// ── Simple select (for small fixed lists — no search needed) ──────────────────

function SimpleFormSelect({
  label, placeholder, options,
}: { label: string; placeholder: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const openDropdown = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropH = options.length * 44 + 16;
      const top = rect.bottom + dropH > window.innerHeight
        ? rect.top - dropH - 4
        : rect.bottom + 4;
      setCoords({ top, left: rect.left, width: rect.width });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={openDropdown}
        className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center justify-between cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className={`text-sm truncate ${selected ? "text-gray-700" : "text-gray-400"}`}>
            {selected || placeholder}
          </p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      {mounted && open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width, zIndex: 9999 }}
          className="bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1"
        >
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { setSelected(opt); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-left transition-colors"
            >
              <div
                className="w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
                style={selected === opt
                  ? { background: "#046C3F", borderColor: "#046C3F" }
                  : { borderColor: "#D1D5DB" }}
              >
                {selected === opt && <Check size={10} color="#fff" strokeWidth={3} />}
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

// ── Other form primitives ─────────────────────────────────────────────────────

function FormField({ label, value, placeholder }: { label: string; value?: string; placeholder?: string }) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <input
        className="w-full text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
        placeholder={placeholder}
        defaultValue={value}
      />
    </div>
  );
}

function FormTextarea({ label, placeholder, rows = 4 }: { label: string; placeholder: string; rows?: number }) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-4 bg-white">
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      <textarea
        rows={rows}
        className="w-full text-sm text-gray-500 outline-none bg-transparent resize-none placeholder:text-gray-400"
        placeholder={placeholder}
      />
    </div>
  );
}

function DateField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm text-gray-700">{value}</p>
      </div>
      <CalendarIcon size={16} className="text-gray-400 shrink-0" />
    </div>
  );
}

// ── Collapsible section ───────────────────────────────────────────────────────

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-8 h-8 rounded-full bg-[#E8F7F0] flex items-center justify-center shrink-0">
      {children}
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
        </div>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 sm:px-6 pt-4 pb-8 border-t border-gray-50">{children}</div>}
    </div>
  );
}

// ── Option lists ──────────────────────────────────────────────────────────────

const DIAGNOSIS_OPTIONS = [
  "Malaria (Uncomplicated)", "Malaria (Severe)", "Typhoid Fever",
  "Upper respiratory Track infection", "Pneumonia", "Hypertension",
  "Diabetes mellitus Type 2", "Peptic ulcer disease", "Urinary Track Infection",
];

const SAMPLE_TYPE_OPTIONS = ["Blood", "Urine", "Stool", "Swab"];

const TEST_TYPE_OPTIONS = [
  "Malaria RDT", "Malaria smear", "Full blood count", "Widal test",
  "HIV rapid test", "Urinalysis", "Blood glucose (RBS)", "Liver function tests",
  "Renal function tests", "Pregnancy test (UPT)",
];

const MEDICATION_OPTIONS = [
  "Artemether-Lumefantrine", "Amoxicillin 500mg", "Metformin 500mg",
  "Paracetamol 500mg", "Ibuprofen 400mg", "Co-trimoxazole", "Ciprofloxacin 500mg",
];

const FREQUENCY_OPTIONS = ["Once daily", "Twice daily", "Three times daily", "Start once"];

const PRIORITY_OPTIONS = ["Routine", "Urgent"];

const FACILITY_OPTIONS = [
  "State General Hospital", "Federal Medical Centre", "University Teaching Hospital",
  "Primary Health Centre", "District Hospital", "Specialist Hospital",
];

const REFERRAL_TYPE_OPTIONS = ["Physical", "Telemedicine", "Emergency"];

// ── Sections ──────────────────────────────────────────────────────────────────

function PatientInformation() {
  return (
    <Section icon={<SectionIcon><User size={16} className="text-[#046C3F]" /></SectionIcon>} title="Patient Information">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Patient Name" value="Emeka Dike" />
          <FormField label="Patient ID" value="PAT-PLT-000234" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          <FormField label="Encounter ID" value="PAT-PLT-000234" />
          <FormField label="Age" value="32 years" />
          <FormField label="Gender" value="Female" />
        </div>
      </div>
    </Section>
  );
}

function Vitals() {
  return (
    <Section icon={<SectionIcon><Activity size={16} className="text-[#046C3F]" /></SectionIcon>} title="Vitals (From Nurse)">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Temperature" value="37.2°C" />
          <FormField label="Blood Pressure (BP)" value="120/80 mmHg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Pulse" value="75 bpm" />
          <FormField label="Weight" value="68 kg" />
        </div>
      </div>
    </Section>
  );
}

function ClinicalAssessment() {
  return (
    <Section icon={<SectionIcon><Stethoscope size={16} className="text-[#046C3F]" /></SectionIcon>} title="Clinical Assessment">
      <div className="space-y-4">
        <FormField label="Chief Complaint" placeholder="e.g. Fever, headache, Chest pain, Cough, runny nose" />
        <FormTextarea label="Presenting Complaint" placeholder="Brief description of symptoms" />
        <FormTextarea label="History of Present Complaint" placeholder="Describe the history..." />
        <FormTextarea label="Past Medical History" placeholder="Previous, illnesses, surgeries, chronic conditions" />
        <FormTextarea label="Examination Findings" placeholder="physical examination Findings..." />
      </div>
    </Section>
  );
}

function DiagnosisTreatment() {
  return (
    <Section icon={<SectionIcon><ClipboardList size={16} className="text-[#046C3F]" /></SectionIcon>} title="Diagnosis & Treatment">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SearchableFormSelect label="Primary Diagnosis" placeholder="Select Diagnosis" options={DIAGNOSIS_OPTIONS} />
          <SearchableFormSelect label="Secondary Diagnosis (Optional)" placeholder="Select secondary diagnosis" options={DIAGNOSIS_OPTIONS} />
        </div>
        <FormTextarea label="Treatment Plan" placeholder="Treatment plan" />
        <FormTextarea label="Additional Notes" placeholder="Follow-up instructions, referrals, health education" />
      </div>
    </Section>
  );
}

function LabRequest() {
  const [requests, setRequests] = useState([{ id: 1 }]);

  return (
    <Section icon={<SectionIcon><TestTube size={16} className="text-[#046C3F]" /></SectionIcon>} title="Lab Request (Optional)">
      <div className="space-y-6">
        {requests.map((req, index) => (
          <div key={req.id} className="space-y-4">
            {requests.length > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Request {index + 1}</p>
                <button
                  onClick={() => setRequests(prev => prev.filter(r => r.id !== req.id))}
                  className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Lab Request ID" value="LAB-PLT-000234" />
              <FormField label="Requested By" placeholder="Doctor/User ID" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SearchableFormSelect label="Sample Type (Optional)" placeholder="Select" options={SAMPLE_TYPE_OPTIONS} />
              <SearchableFormSelect label="Test type" placeholder="Select test" options={TEST_TYPE_OPTIONS} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SimpleFormSelect label="Priority" placeholder="Select priority" options={PRIORITY_OPTIONS} />
              <DateField label="Request Date" value="10/12/2020" />
            </div>
            <FormTextarea label="Clinical notes for lab" placeholder="Reason for test, suspected diagnosis..." rows={4} />
            {index < requests.length - 1 && <hr className="border-gray-100" />}
          </div>
        ))}

        <button
          onClick={() => setRequests(prev => [...prev, { id: Date.now() }])}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#046C3F] text-[#046C3F] text-sm font-semibold rounded-xl hover:bg-[#E8F7F0] transition-colors"
        >
          <Plus size={16} /> Add Lab Request
        </button>
      </div>
    </Section>
  );
}

function NewPrescription() {
  const [medications, setMedications] = useState([{ id: 1 }]);

  return (
    <Section icon={<SectionIcon><Pill size={16} className="text-[#046C3F]" /></SectionIcon>} title="New Prescription (Optional)">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Prescription ID" value="PRC-PLT-000234" />
          <FormField label="Prescribed By" placeholder="Select" />
        </div>

        {medications.map(med => (
          <div key={med.id} className="flex items-start gap-2">
            <div className="flex-1" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr", gap: "0.5rem" }}>
              <SearchableFormSelect label="Medication Name" placeholder="Select" options={MEDICATION_OPTIONS} />
              <FormField label="Dosage" placeholder="e.g 1 tab" />
              <SimpleFormSelect label="Frequency" placeholder="Select" options={FREQUENCY_OPTIONS} />
              <FormField label="Duration" placeholder="e.g 5 days" />
            </div>
            {medications.length > 1 && (
              <button
                onClick={() => setMedications(prev => prev.filter(m => m.id !== med.id))}
                className="mt-7 p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => setMedications(prev => [...prev, { id: Date.now() }])}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#046C3F] text-[#046C3F] text-sm font-semibold rounded-xl hover:bg-[#E8F7F0] transition-colors"
        >
          <Plus size={16} /> Add medication
        </button>

        <SimpleFormSelect label="Priority" placeholder="Select Priority" options={PRIORITY_OPTIONS} />
        <FormTextarea label="Instruction" placeholder="Special Instruction" />
      </div>
    </Section>
  );
}

function NewReferral() {
  return (
    <Section icon={<SectionIcon><ArrowLeftRight size={16} className="text-[#046C3F]" /></SectionIcon>} title="New Referral">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Referral ID" value="ENC-PLT-000234" />
          <DateField label="Referral Date" value="10/12/2020" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SearchableFormSelect label="Referring Facility" placeholder="Select facility" options={FACILITY_OPTIONS} />
          <SearchableFormSelect label="Receiving Facility" placeholder="Select facility" options={FACILITY_OPTIONS} />
        </div>
        <SimpleFormSelect label="Referral Type" placeholder="Select one" options={REFERRAL_TYPE_OPTIONS} />
        <FormTextarea label="Reason for Referral" placeholder="Reason..." rows={4} />
        <FormTextarea label="Clinical Summary (Optional)" placeholder="Additional notes / observations" />
      </div>
    </Section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ConsultationNotes() {
  const [submitted, setSubmitted] = useState(false);

  const breadcrumbs = [
    { label: "Consultations", href: "/doctor-dashboard/consultations" },
    { label: "View all patient Queue", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Consultations" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="mb-6">
          <Link
            href="/doctor-dashboard/consultations"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Consultation Notes</h1>
          <p className="text-sm text-gray-500 mt-1">Emeka Dike · PAT-PLT-000234</p>
        </div>

        <div className="space-y-4">
          <PatientInformation />
          <Vitals />
          <ClinicalAssessment />
          <DiagnosisTreatment />
          <LabRequest />
          <NewPrescription />
          <NewReferral />
        </div>

        <div className="flex items-center justify-start gap-3 mt-10">
          <button className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Save as Draft
          </button>
          <button
            onClick={() => setSubmitted(true)}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#046C3F" }}
          >
            Submit Consultation
          </button>
        </div>
      </div>

      {submitted && (
        <div
          style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
          className="flex items-start gap-3 bg-white border-l-4 border-[#046C3F] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.14)] px-4 py-3 min-w-[300px] max-w-sm"
        >
          <CheckCircle size={18} className="text-[#046C3F] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Consultation Submitted</p>
            <p className="text-xs text-gray-500 mt-0.5">Consultation for Emeka Dike saved successfully</p>
          </div>
          <button onClick={() => setSubmitted(false)} className="text-gray-400 hover:text-gray-600 shrink-0">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
