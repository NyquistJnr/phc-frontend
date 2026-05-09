"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Baby,
  CalendarDays,
  ChevronDown,
  Dumbbell,
  FlaskConical,
  Heart,
  Plus,
  Save,
  Search,
  Shield,
  User,
  X,
} from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";

type CareTab = "anc" | "pnc";
type Mode = "list" | "ancForm" | "pncForm";

type AncRow = {
  patientId: string;
  patientName: string;
  gestationalAge: string;
  visitDate: string;
  dateValue: string;
  riskFactors: string;
  notes: string;
};

type PncRow = {
  patientId: string;
  patientName: string;
  deliveryDate: string;
  dateValue: string;
  deliveryType: string;
  followUpSchedule: string;
  complications: string;
};

type MaternalForm = Record<string, string>;

const SELECT_OPTIONS = ["Select", "New (N)", "Return (R)"];
const YES_NO_OPTIONS = ["Select", "Yes", "No"];
const BLOOD_GROUP_OPTIONS = ["Select blood group", "A+", "A-", "B+", "B-", "O+", "O+", "AB+", "AB-"];
const GENOTYPE_OPTIONS = ["Select genotype", "AA", "AS", "SS", "AC"];
const DELIVERY_TYPES = [
  "Normal Vaginal Delivery (NVD)",
  "Cesarean Section (C-Section)",
  "Assisted Vaginal Delivery",
];
const OUTCOME_OPTIONS = ["Select", "No Treatment (NT)", "Treated", "Admitted", "Referred Out"];
const TRANSPORT_OPTIONS = ["Select", "Ambulance", "Others"];

const INITIAL_ANC_ROWS: AncRow[] = [
  ["28 weeks", "None", "Normal progress"],
  ["36 weeks", "Pre-eclampsia", "Close monitoring required"],
  ["36 weeks", "Gestational hypertension", "Close monitoring required"],
  ["36 weeks", "Elevated BMI", "Close monitoring required"],
  ["36 weeks", "Elevated BMI", "Close monitoring required"],
  ["36 weeks", "Elevated BMI", "Close monitoring required"],
  ["36 weeks", "Elevated BMI", "Close monitoring required"],
  ["36 weeks", "Elevated BMI", "Close monitoring required"],
  ["36 weeks", "Elevated BMI", "Close monitoring required"],
  ["36 weeks", "Elevated BMI", "Close monitoring required"],
].map(([gestationalAge, riskFactors, notes]) => ({
  patientId: "PAT-PLT-000234",
  patientName: "Emeka Dike",
  gestationalAge,
  visitDate: "12 Mar 2026",
  dateValue: "2026-03-12",
  riskFactors,
  notes,
}));

const INITIAL_PNC_ROWS: PncRow[] = DELIVERY_TYPES.concat(
  Array(7).fill("Assisted Vaginal Delivery"),
).map((deliveryType) => ({
  patientId: "PAT-PLT-000234",
  patientName: "Emeka Dike",
  deliveryDate: "12 Mar 2026",
  dateValue: "2026-03-12",
  deliveryType,
  followUpSchedule: "12 Mar 2026",
  complications: "Yes/No (specify)",
}));

const INITIAL_FORM: MaternalForm = {
  patientName: "",
  facility: "Ikeja PHC",
  patientId: "PAT-PLT-000234",
  encounterId: "ENC-PLT-000234",
  patientAge: "",
  attendanceType: "",
  encounterDate: "2020-12-12",
  cardNumber: "",
  lmp: "2020-12-12",
  edd: "2020-12-12",
  gravida: "",
  parity: "",
  livingChildren: "",
  height: "",
  weight: "",
  bloodPressure: "",
  bmi: "Auto-Calculated",
  bloodGroup: "",
  genotype: "",
  hivStatus: "",
  vdrl: "",
  hepatitisB: "",
  hemoglobin: "",
  urinalysis: "",
  tt1: "2020-12-12",
  ipt1: "2020-12-12",
  ironFolate: "",
  riskFactors: "",
  allergies: "",
  additionalNotes: "",
  ward: "Auto-filled",
  lga: "Auto-filled",
  state: "Auto-filled",
  pncDate: "2020-12-12",
  ageGroup: "Auto-calculated e.g 20-34 / 35-49 / ≥50",
  timing: "",
  visitType: "",
  associatedProblems: "",
  vaginalExam: "",
  nutritionCounselling: "",
  fpCounselling: "",
  fgmCounselling: "",
  infectionCounselling: "",
  babySex: "",
  breastfeeding: "",
  complementaryFeeding: "",
  newbornDangerSigns: "",
  firstAntibiotics: "",
  neonatalTetanus: "",
  neonatalJaundice: "",
  kmcProvided: "",
  outcome: "",
  responsibleOfficer: "",
  referralReason: "",
  transportOut: "",
  createdAt: "2020-12-12",
};

function FieldShell({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F] ${className}`}>
      <label className="mb-1 block text-xs text-[#62636C]">{label}</label>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  readOnly = false,
  icon,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  readOnly?: boolean;
  icon?: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <FieldShell label={label}>
      <div className="flex items-center gap-3">
        {icon}
        <input
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent text-base outline-none placeholder:text-gray-400 ${
            readOnly ? "text-gray-400" : "text-gray-700"
          }`}
        />
      </div>
    </FieldShell>
  );
}

function SelectField({
  label,
  placeholder = "Select",
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
      >
        <span className="mb-1 block text-xs text-[#62636C]">{label}</span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span className={value ? "text-gray-700" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <ChevronDown size={20} className="text-gray-800" />
        </span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          {options.map((option) => {
            const selected = value === option || (!value && option === "Select");
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option === "Select" ? "" : option);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-4 rounded-md px-2 py-2.5 text-left text-sm text-gray-500 hover:bg-gray-50"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    selected ? "border-[#046C3F] bg-[#046C3F]" : "border-gray-300 bg-white"
                  }`}
                >
                  {selected && <span className="h-2 w-2 rounded-sm bg-white" />}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8">
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BCAB4] text-[#046C3F]">
            {icon}
          </span>
          <h3 className="text-xl font-semibold text-black">{title}</h3>
        </div>
        <ChevronDown size={20} className="text-gray-700" />
      </div>
      {children}
    </section>
  );
}

function SuccessToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex w-[min(390px,calc(100vw-2rem))] items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
      <span className="h-12 w-1 rounded-full bg-[#039855]" />
      <span className="h-6 w-6 rounded-lg border border-[#A8E6C4] bg-[#E8F7F0]" />
      <p className="flex-1 text-sm font-semibold text-gray-900">{message}</p>
      <button type="button" onClick={onClose} className="border-l border-gray-100 pl-4">
        <X size={18} />
      </button>
    </div>
  );
}

function CareTabs({
  active,
  onChange,
}: {
  active: CareTab;
  onChange: (tab: CareTab) => void;
}) {
  return (
    <div className="mb-6 grid w-full max-w-[400px] grid-cols-2 overflow-hidden rounded-lg bg-[#EEF5F3]">
      <button
        type="button"
        onClick={() => onChange("anc")}
        className={`h-10 px-4 text-base font-medium ${active === "anc" ? "bg-[#046C3F] text-white" : "text-gray-400"}`}
      >
        ANC Visits
      </button>
      <button
        type="button"
        onClick={() => onChange("pnc")}
        className={`h-10 px-4 text-base font-medium ${active === "pnc" ? "bg-[#046C3F] text-white" : "text-gray-400"}`}
      >
        Postnatal Care
      </button>
    </div>
  );
}

function AncForm({
  form,
  update,
  onCancel,
  onSubmit,
}: {
  form: MaternalForm;
  update: (field: string, value: string) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <SectionCard title="Patient & Facility Information" icon={<User size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <TextField label="Patient Name" value={form.patientName} placeholder="Search patient by name or ID" icon={<Search size={22} />} onChange={(value) => update("patientName", value)} />
          <TextField label="Facility" value={form.facility} readOnly onChange={(value) => update("facility", value)} />
          <TextField label="Patient ID" value={form.patientId} readOnly onChange={(value) => update("patientId", value)} />
          <TextField label="Encounter ID" value={form.encounterId} readOnly onChange={(value) => update("encounterId", value)} />
          <TextField label="Patient Age" value={form.patientAge} placeholder="Patient age" onChange={(value) => update("patientAge", value)} />
          <SelectField label="ANC Attendance Type" options={SELECT_OPTIONS} value={form.attendanceType} onChange={(value) => update("attendanceType", value)} />
          <TextField label="Date of Encounter" value={form.encounterDate} icon={<CalendarDays size={18} />} onChange={(value) => update("encounterDate", value)} />
          <TextField label="Mother's Patient/Client Card Number (Optional)" value={form.cardNumber} placeholder="Existing PHC card" onChange={(value) => update("cardNumber", value)} />
          <TextField label="Last Menstrual Period (LMP)" value={form.lmp} icon={<CalendarDays size={18} />} onChange={(value) => update("lmp", value)} />
          <TextField label="Expected Date of Delivery (EDD)" value={form.edd} icon={<CalendarDays size={18} />} onChange={(value) => update("edd", value)} />
        </div>
      </SectionCard>
      <SectionCard title="Obstetric History" icon={<Heart size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          <TextField label="Gravida" value={form.gravida} placeholder="Total pregnancies" onChange={(value) => update("gravida", value)} />
          <TextField label="Parity" value={form.parity} placeholder="Number of previous births" onChange={(value) => update("parity", value)} />
          <TextField label="Living children" value={form.livingChildren} placeholder="Number alive" onChange={(value) => update("livingChildren", value)} />
        </div>
      </SectionCard>
      <SectionCard title="Physical Measurements" icon={<Dumbbell size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <TextField label="Height (cm)" value={form.height} placeholder="0" onChange={(value) => update("height", value)} />
          <TextField label="Weight (kg)" value={form.weight} placeholder="0" onChange={(value) => update("weight", value)} />
          <TextField label="Blood Pressure" value={form.bloodPressure} placeholder="0" onChange={(value) => update("bloodPressure", value)} />
          <TextField label="BMI" value={form.bmi} readOnly onChange={(value) => update("bmi", value)} />
        </div>
      </SectionCard>
      <SectionCard title="Laboratory Investigations" icon={<FlaskConical size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField label="Blood Group" options={BLOOD_GROUP_OPTIONS} value={form.bloodGroup} onChange={(value) => update("bloodGroup", value)} />
          <SelectField label="Genotype" options={GENOTYPE_OPTIONS} value={form.genotype} onChange={(value) => update("genotype", value)} />
          <SelectField label="HIV Status" options={["Select Status", "Negative", "Positive", "Unknown/Not tested"]} value={form.hivStatus} onChange={(value) => update("hivStatus", value)} />
          <SelectField label="VDRL (Syphilis)" options={["Select Status", "Negative", "Positive", "Not Done"]} value={form.vdrl} onChange={(value) => update("vdrl", value)} />
          <SelectField label="Hepatitis B" options={["Select Status", "Negative", "Positive", "Not Done"]} value={form.hepatitisB} onChange={(value) => update("hepatitisB", value)} />
          <TextField label="Hemoglobin (g/dL)" value={form.hemoglobin} placeholder="0" onChange={(value) => update("hemoglobin", value)} />
          <TextField label="Urinalysis" value={form.urinalysis} placeholder="Protein, glucose etc" onChange={(value) => update("urinalysis", value)} />
        </div>
      </SectionCard>
      <SectionCard title="Interventions (1st Visit)" icon={<Shield size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <TextField label="TT1 Date" value={form.tt1} icon={<CalendarDays size={18} />} onChange={(value) => update("tt1", value)} />
          <TextField label="IPT1 Date" value={form.ipt1} icon={<CalendarDays size={18} />} onChange={(value) => update("ipt1", value)} />
          <SelectField label="Iron/Folate Given" options={YES_NO_OPTIONS} value={form.ironFolate} onChange={(value) => update("ironFolate", value)} />
        </div>
      </SectionCard>
      <SectionCard title="Risk Assessment" icon={<Shield size={18} />}>
        <div className="max-w-4xl space-y-6">
          {["riskFactors", "allergies", "additionalNotes"].map((field) => (
            <FieldShell key={field} label={field === "riskFactors" ? "Risk Factors" : field === "allergies" ? "Known Allergies" : "Additional Notes"}>
              <textarea value={form[field]} onChange={(event) => update(field, event.target.value)} rows={5} placeholder={field === "riskFactors" ? "Age <18 or > 35, previous C-section, hypertension, diabetes, etc" : field === "allergies" ? "Drug or food allergies" : "Any other relevant information"} className="w-full resize-none bg-transparent outline-none placeholder:text-gray-400" />
            </FieldShell>
          ))}
        </div>
      </SectionCard>
      <div className="flex gap-4">
        <button type="button" onClick={onCancel} className="h-14 rounded-xl bg-[#B9BDC9] px-12 text-lg font-medium text-white">Cancel</button>
        <button type="submit" className="flex h-14 items-center gap-3 rounded-xl bg-[#046C3F] px-10 text-lg font-medium text-white"><Save size={20} />Register Pregnancy</button>
      </div>
    </form>
  );
}

function PncForm({
  form,
  update,
  onCancel,
  onSubmit,
}: {
  form: MaternalForm;
  update: (field: string, value: string) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <SectionCard title="Patient & Facility Information" icon={<User size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <TextField label="Patient Name" value={form.patientName} placeholder="Search patient by name or ID" icon={<Search size={22} />} onChange={(value) => update("patientName", value)} />
          <TextField label="Patient ID" value={form.patientId} readOnly onChange={(value) => update("patientId", value)} />
          <TextField label="Encounter ID" value={form.encounterId} icon={<Search size={22} />} readOnly onChange={(value) => update("encounterId", value)} />
          <TextField label="Facility" value={form.facility} readOnly onChange={(value) => update("facility", value)} />
          <TextField label="Patient Age" value={form.patientAge} placeholder="0" onChange={(value) => update("patientAge", value)} />
          <TextField label="Age Group" value={form.ageGroup} readOnly onChange={(value) => update("ageGroup", value)} />
          <TextField label="Patient ward" value={form.ward} readOnly onChange={(value) => update("ward", value)} />
          <TextField label="Patient LGA" value={form.lga} readOnly onChange={(value) => update("lga", value)} />
          <TextField label="Patient state" value={form.state} readOnly onChange={(value) => update("state", value)} />
          <TextField label="PNC visit date" value={form.pncDate} icon={<CalendarDays size={18} />} onChange={(value) => update("pncDate", value)} />
        </div>
      </SectionCard>
      <SectionCard title="Maternal History & PNC Attendance Type" icon={<Heart size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          <TextField label="Parity" value={form.parity} placeholder="0" onChange={(value) => update("parity", value)} />
          <TextField label="Timing of Postnatal Visit" value={form.timing} placeholder="e.g 4-7 days / >7 days" onChange={(value) => update("timing", value)} />
          <SelectField label="Visit Type" options={SELECT_OPTIONS} value={form.visitType} onChange={(value) => update("visitType", value)} />
        </div>
        <div className="mt-6 max-w-4xl">
          <FieldShell label="Associated Problems"><textarea value={form.associatedProblems} onChange={(event) => update("associatedProblems", event.target.value)} rows={5} placeholder="Any maternal health complaints or complications..." className="w-full resize-none bg-transparent outline-none placeholder:text-gray-400" /></FieldShell>
        </div>
      </SectionCard>
      <SectionCard title="Maternal Care Assessment" icon={<Shield size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField label="Vaginal Examination Conducted" options={YES_NO_OPTIONS} value={form.vaginalExam} onChange={(value) => update("vaginalExam", value)} />
          <TextField label="Haemoglobin / PCV Test" value={form.hemoglobin} placeholder="Enter result" onChange={(value) => update("hemoglobin", value)} />
          <TextField label="Urinalysis" value={form.urinalysis} placeholder="Record sugar result" onChange={(value) => update("urinalysis", value)} />
          {["nutritionCounselling", "fgmCounselling", "fpCounselling", "infectionCounselling"].map((field) => (
            <SelectField key={field} label={field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())} options={YES_NO_OPTIONS} value={form[field]} onChange={(value) => update(field, value)} />
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Newborn Care Assessment" icon={<Baby size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField label="Baby Sex" options={["Select", "Male", "Female"]} value={form.babySex} onChange={(value) => update("babySex", value)} />
          <SelectField label="Exclusive Breastfeeding Counselling" options={YES_NO_OPTIONS} value={form.breastfeeding} onChange={(value) => update("breastfeeding", value)} />
          <SelectField label="Complementary Feeding Counselling" options={YES_NO_OPTIONS} value={form.complementaryFeeding} onChange={(value) => update("complementaryFeeding", value)} />
        </div>
      </SectionCard>
      <SectionCard title="Neonatal Complications & Kangaroo Mother Care (KMC)" icon={<Heart size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {["newbornDangerSigns", "firstAntibiotics", "neonatalTetanus", "neonatalJaundice", "kmcProvided"].map((field) => (
            <SelectField key={field} label={field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())} options={YES_NO_OPTIONS} value={form[field]} onChange={(value) => update(field, value)} />
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-400">Kangaroo Mother Care is commonly used for low birth weight babies.</p>
      </SectionCard>
      <SectionCard title="Outcome of Visit & Responsible Staff" icon={<Shield size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField label="Outcome" options={OUTCOME_OPTIONS} value={form.outcome} onChange={(value) => update("outcome", value)} />
          <TextField label="Responsible Officer" value={form.responsibleOfficer} placeholder="Enter Name" onChange={(value) => update("responsibleOfficer", value)} />
          <div className="md:col-span-2"><FieldShell label="Referral Reason (Required if referred)"><textarea value={form.referralReason} onChange={(event) => update("referralReason", event.target.value)} rows={5} placeholder="Enter reason here" className="w-full resize-none bg-transparent outline-none placeholder:text-gray-400" /></FieldShell></div>
          <SelectField label="Transportation Out" options={TRANSPORT_OPTIONS} value={form.transportOut} onChange={(value) => update("transportOut", value)} />
          <TextField label="Created At" value={form.createdAt} icon={<CalendarDays size={18} />} onChange={(value) => update("createdAt", value)} />
        </div>
      </SectionCard>
      <div className="flex gap-4">
        <button type="button" onClick={onCancel} className="h-14 rounded-xl bg-[#B9BDC9] px-12 text-lg font-medium text-white">Cancel</button>
        <button type="submit" className="flex h-14 items-center gap-3 rounded-xl bg-[#046C3F] px-10 text-lg font-medium text-white"><Save size={20} />Save PNC Visit</button>
      </div>
    </form>
  );
}

export default function MaternalCare() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<CareTab>("anc");
  const [mode, setMode] = useState<Mode>("list");
  const [ancRows, setAncRows] = useState(INITIAL_ANC_ROWS);
  const [pncRows, setPncRows] = useState(INITIAL_PNC_ROWS);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [form, setForm] = useState<MaternalForm>(INITIAL_FORM);
  const [toast, setToast] = useState("");
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10;

  const update = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };
  const reset = () => setForm(INITIAL_FORM);
  const inForm = mode !== "list";

  const ancFiltered = useMemo(() => {
    const term = search.toLowerCase();
    return ancRows.filter((row) => {
      const matches = !term || [row.patientId, row.patientName, row.riskFactors].some((value) => value.toLowerCase().includes(term));
      return matches && (!startDate || row.dateValue >= startDate) && (!endDate || row.dateValue <= endDate);
    });
  }, [ancRows, endDate, search, startDate]);
  const pncFiltered = useMemo(() => {
    const term = search.toLowerCase();
    return pncRows.filter((row) => {
      const matches = !term || [row.patientId, row.patientName, row.deliveryType].some((value) => value.toLowerCase().includes(term));
      return matches && (!startDate || row.dateValue >= startDate) && (!endDate || row.dateValue <= endDate);
    });
  }, [endDate, pncRows, search, startDate]);

  const currentData = tab === "anc" ? ancFiltered : pncFiltered;
  const paged = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const ancColumns: ColumnDef<AncRow>[] = [
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Gestational Age", accessorKey: "gestationalAge", sortable: true },
    { header: "Visit Date", accessorKey: "visitDate", sortable: true },
    { header: "Risk Factors", accessorKey: "riskFactors", sortable: true },
    { header: "Notes", accessorKey: "notes", sortable: true },
  ];
  const pncColumns: ColumnDef<PncRow>[] = [
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Delivery Date", accessorKey: "deliveryDate", sortable: true },
    { header: "Delivery Type", accessorKey: "deliveryType", sortable: true },
    { header: "Follow-up Schedule", accessorKey: "followUpSchedule", sortable: true },
    { header: "Complications", accessorKey: "complications", sortable: true },
  ];

  const handleAncSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAncRows((rows) => [
      {
        patientId: form.patientId,
        patientName: form.patientName || "Emeka Dike",
        gestationalAge: "28 weeks",
        visitDate: "12 Mar 2026",
        dateValue: "2026-03-12",
        riskFactors: form.riskFactors || "None",
        notes: form.additionalNotes || "Normal progress",
      },
      ...rows,
    ]);
    reset();
    setToast("ANC visit registered");
    setMode("list");
  };
  const handlePncSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPncRows((rows) => [
      {
        patientId: form.patientId,
        patientName: form.patientName || "Emeka Dike",
        deliveryDate: "12 Mar 2026",
        dateValue: "2026-03-12",
        deliveryType: "Normal Vaginal Delivery (NVD)",
        followUpSchedule: "12 Mar 2026",
        complications: form.associatedProblems || "Yes/No (specify)",
      },
      ...rows,
    ]);
    reset();
    setToast("Postnatal record saved");
    setMode("list");
  };

  const title =
    mode === "ancForm"
      ? "ANC Registration"
      : tab === "pnc"
        ? "Postnatal Care (PNC)"
        : "ANC (Antenatal Care) Visits";
  const subtitle =
    mode === "ancForm"
      ? "Capture antenatal care visit information"
      : tab === "pnc"
        ? "Track maternal and newborn health after delivery"
        : "Manage prenatal care for pregnant women";

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Maternal Care"
        breadcrumbs={[
          { label: "Maternal Care" },
          { label: tab === "anc" ? "ANC Visits" : "Postnatal Care" },
          ...(inForm && tab === "anc" ? [{ label: "New ANC Visits" }] : []),
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        {inForm && <NurseBackButton onClick={() => setMode("list")} />}
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">{title}</h2>
            <p className="text-base text-[#3F3F46]">{subtitle}</p>
          </div>
          {!inForm && (
            <button
              type="button"
              onClick={() => setMode(tab === "anc" ? "ancForm" : "pncForm")}
              className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-7 text-base font-medium text-white"
            >
              <Plus size={20} />
              {tab === "anc" ? "New ANC Visit" : "New Postnatal Visit"}
            </button>
          )}
        </div>
        <CareTabs
          active={tab}
          onChange={(next) => {
            setTab(next);
            setMode("list");
          }}
        />
        {mode === "ancForm" ? (
          <AncForm form={form} update={update} onCancel={() => setMode("list")} onSubmit={handleAncSubmit} />
        ) : mode === "pncForm" ? (
          <PncForm form={form} update={update} onCancel={() => setMode("list")} onSubmit={handlePncSubmit} />
        ) : (
          <DataTable
            title={tab === "anc" ? "ANC Visit Records" : "Postnatal Visit Records"}
            data={paged}
            columns={(tab === "anc" ? ancColumns : pncColumns) as ColumnDef<AncRow | PncRow>[]}
            showSearch
            searchPlaceholder="Search patient by Drug name..."
            onSearch={setSearch}
            totalPages={currentData.length > itemsPerPage ? Math.ceil(currentData.length / itemsPerPage) : undefined}
            emptyMessage="No maternal care records found."
            toolbarActions={
              <NurseDateRangeFilter
                label={tab === "anc" ? "Date Range" : "Follow-up schedule"}
                startDate={startDate}
                endDate={endDate}
                onApply={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                onClear={() => {
                  setStartDate("");
                  setEndDate("");
                }}
              />
            }
          />
        )}
      </div>
      {toast && <SuccessToast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
