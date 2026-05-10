"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  Search,
  Share2,
  Upload,
  User,
  X,
} from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import {
  useCreateDoctorReferral,
  useDoctorReferrals,
} from "@/src/hooks/doctors/use-doctors";
import type {
  DoctorPatientSummary as PatientSummary,
  DoctorPrescriptionLine as PrescriptionLine,
  DoctorReferralApiPayload as ReferralApiPayload,
  DoctorReferralForm as ReferralForm,
  DoctorReferralRow as ReferralRow,
  DoctorReferralStatus as ReferralStatus,
} from "@/src/components/doctorDashboard/type";

const FACILITIES = [
  "State General Hospital",
  "General Hospital",
  "Federal Medical Centre",
  "Cardiology Centre",
  "Lagos Teaching Hospital",
  "Specialist Children Hospital",
  "Maternal Referral Centre",
];

const REFERRAL_TYPES = ["Physical", "Telemedicine", "Emergency"];

const PATIENTS: PatientSummary[] = [
  {
    patientId: "PAT-PLT-000234",
    patientName: "Emeka Dike",
    encounterId: "ENC-PLT-000234",
    ageGender: "35 / M",
    diagnosis: "Severe malaria with dehydration",
    allergies: "No known allergies",
    lastVisit: "12 Mar 2026",
    prescriptions: [
      { drug: "Artemether-Lumefantrine", dose: "80/480mg", frequency: "Twice daily", duration: "3 days" },
      { drug: "Paracetamol", dose: "500mg", frequency: "Three times daily", duration: "3 days" },
    ],
  },
  {
    patientId: "PAT-PLT-000235",
    patientName: "Amina Bello",
    encounterId: "ENC-PLT-000235",
    ageGender: "29 / F",
    diagnosis: "Hypertension in pregnancy",
    allergies: "Sulpha allergy",
    lastVisit: "10 Mar 2026",
    prescriptions: [
      { drug: "Methyldopa", dose: "250mg", frequency: "Twice daily", duration: "14 days" },
      { drug: "Folic Acid", dose: "5mg", frequency: "Once daily", duration: "30 days" },
    ],
  },
  {
    patientId: "PAT-PLT-000236",
    patientName: "Ngozi Eze",
    encounterId: "ENC-PLT-000236",
    ageGender: "45 / F",
    diagnosis: "Chest pain under review",
    allergies: "Penicillin allergy",
    lastVisit: "Today",
    prescriptions: [
      { drug: "Aspirin", dose: "75mg", frequency: "Once daily", duration: "7 days" },
      { drug: "Omeprazole", dose: "20mg", frequency: "Once daily", duration: "7 days" },
    ],
  },
];

const INITIAL_REFERRALS: ReferralRow[] = [
  "Accepted",
  "Accepted",
  "Pending",
  "Rejected",
  "Rejected",
  "Accepted",
  "Accepted",
  "Accepted",
  "Pending",
  "Pending",
].map((status) => ({
  referralId: "REF-PLT-000234",
  patientId: "PAT-PLT-000234",
  patientName: "Emeka Dike",
  referringFacility: "General Clinic",
  receivingFacility: "General Hospital",
  reason: "Severe malaria",
  date: "12 Mar 2026",
  status: status as ReferralStatus,
  notes: "Patient requires specialist review and possible inpatient management.",
}));

const statusColors: Record<ReferralStatus, { bg: string; text: string }> = {
  Accepted: { bg: "#DFF3EA", text: "#039855" },
  Pending: { bg: "#FFF4E5", text: "#1F2937" },
  Rejected: { bg: "#FDE8E8", text: "#F33131" },
};

const emptyForm: ReferralForm = {
  patientId: "",
  receivingFacility: "",
  referralType: "",
  reason: "",
  clinicalSummary: "",
  doctorNotes: "",
  prescriptions: [],
};

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-8 inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#046C3F] transition-colors hover:bg-[#F8FAF9]"
    >
      <ArrowLeft size={15} />
      Back
    </button>
  );
}

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
    <div className={`rounded-lg border border-gray-300 bg-white px-4 py-2.5 ${className}`}>
      <label className="mb-1 block text-xs text-[#62636C]">{label}</label>
      {children}
    </div>
  );
}

function SearchableSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  className = "",
  searchable = true,
}: {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const filtered = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase()),
  );

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
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
      >
        <span className="mb-1 block text-xs text-[#62636C]">{label}</span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span className={value ? "truncate text-gray-700" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <ChevronDown size={20} className={`text-gray-800 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
          {searchable && (
            <div className="relative mb-3">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="h-12 w-full rounded-lg border border-gray-300 pl-12 pr-3 text-base outline-none focus:border-[#046C3F]"
              />
            </div>
          )}
          <div className="max-h-64 overflow-y-auto pr-1">
            {filtered.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setSearch("");
                  setOpen(false);
                }}
                className="block w-full rounded-md px-3 py-3 text-left text-base text-gray-800 hover:bg-gray-50"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PatientSummaryCard({ patient }: { patient: PatientSummary }) {
  return (
    <div className="rounded-xl border border-[#CDEBDD] bg-[#F7FFFB] p-4">
      <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <User size={20} className="text-[#046C3F]" />
        Patient Summary Medical Record
      </div>
      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs text-gray-400">Age/Gender</p>
          <p className="font-medium text-gray-700">{patient.ageGender}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Last Visit</p>
          <p className="font-medium text-gray-700">{patient.lastVisit}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Diagnosis</p>
          <p className="font-medium text-gray-700">{patient.diagnosis}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Allergies</p>
          <p className="font-medium text-gray-700">{patient.allergies}</p>
        </div>
      </div>
    </div>
  );
}

function ReferralActionMenu({ row, onView }: { row: ReferralRow; onView: (row: ReferralRow) => void }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const toggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: Math.max(12, rect.right + window.scrollX - 208),
      });
    }
    setOpen((current) => !current);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
      >
        <MoreHorizontal size={18} />
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: coords.top, left: coords.left }}
            className="absolute z-[9999] w-52 rounded border border-gray-200 bg-white p-4 shadow-lg"
          >
            <button
              type="button"
              onClick={() => {
                onView(row);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 border-b border-gray-100 px-2 py-3 text-left text-gray-500 hover:text-gray-900"
            >
              <Eye size={20} />
              View
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 px-2 py-3 text-left text-gray-500 hover:text-gray-900"
            >
              <Upload size={20} />
              Export
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

function ViewReferralModal({ row, onClose }: { row: ReferralRow; onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Share2 size={22} className="text-[#046C3F]" />
            View Referral
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#FFF4E5] p-2 text-gray-900"
            aria-label="Close referral view"
          >
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            ["Referral ID", row.referralId],
            ["Patient", row.patientName],
            ["Patient ID", row.patientId],
            ["Referring Facility", row.referringFacility],
            ["Receiving Facility", row.receivingFacility],
            ["Date", row.date],
            ["Reason", row.reason],
            ["Status", row.status],
          ].map(([label, value]) => (
            <FieldShell key={label} label={label}>
              <p className="text-base text-gray-500">{value}</p>
            </FieldShell>
          ))}
          <FieldShell label="Notes" className="sm:col-span-2">
            <p className="min-h-24 text-base text-gray-500">{row.notes}</p>
          </FieldShell>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function HistoryView({
  referrals,
  setTab,
}: {
  referrals: ReferralRow[];
  setTab: (tab: ReferralTab) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [viewReferral, setViewReferral] = useState<ReferralRow | null>(null);
  const { data: referralsData, isLoading } = useDoctorReferrals({
    page: 1,
    page_size: 10,
    search,
    status,
  });

  const rows = useMemo<ReferralRow[]>(() => {
    const payload = referralsData as ReferralApiPayload | undefined;
    const apiRows = payload?.results || payload?.data?.results;
    if (!apiRows?.length) return referrals;
    return apiRows.map((row) => ({
      referralId: row.referral_id || row.id || "REF-PLT-000234",
      patientId: row.patient_id || row.patient?.patient_id || "PAT-PLT-000234",
      patientName: row.patient_name || row.patient?.full_name || "Unknown Patient",
      referringFacility:
        (typeof row.referring_facility === "object" ? row.referring_facility?.name : row.referring_facility) ||
        "General Clinic",
      receivingFacility:
        (typeof row.receiving_facility === "object" ? row.receiving_facility?.name : row.receiving_facility) ||
        "General Hospital",
      reason: row.reason_for_referral || row.reason || "Severe malaria",
      date: row.date || row.referral_date || row.created_at || "12 Mar 2026",
      status: (row.status || "Pending") as ReferralStatus,
      notes: row.clinical_summary || row.notes || "",
    }));
  }, [referrals, referralsData]);

  const filteredReferrals = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !term ||
        [
          row.referralId,
          row.patientId,
          row.patientName,
          row.referringFacility,
          row.receivingFacility,
          row.reason,
        ].some((value) => value.toLowerCase().includes(term));
      const matchesStatus = status === "All Status" || row.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, status]);

  const columns: ColumnDef<ReferralRow>[] = [
    { header: "Referral ID", accessorKey: "referralId", sortable: true },
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Referring Facility", accessorKey: "referringFacility", sortable: true },
    { header: "Receiving Facility", accessorKey: "receivingFacility", sortable: true },
    { header: "Reason", accessorKey: "reason", sortable: true },
    { header: "Date", accessorKey: "date", sortable: true },
    {
      header: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge
          label={row.status}
          bgColorHex={statusColors[row.status].bg}
          textColorHex={statusColors[row.status].text}
        />
      ),
    },
    {
      header: "Action",
      sortable: true,
      render: (row) => <ReferralActionMenu row={row} onView={setViewReferral} />,
    },
  ];

  return (
    <>
      <PageIntro activeTab="history" setTab={setTab} />
      <DataTable
        title="Patient Referrals"
        data={filteredReferrals}
        columns={columns}
        showSearch
        onSearch={setSearch}
        searchPlaceholder="Search by patient name or ID..."
        toolbarActions={
          <>
            <DateRangeFilter startDate="" endDate="" onApply={() => {}} onClear={() => {}} />
            <CustomDropdown
              options={["All Status", "Accepted", "Pending", "Rejected"]}
              selected={status}
              onSelect={setStatus}
            />
          </>
        }
        totalPages={68}
        emptyMessage={referrals.length === 0 ? "No referrals found." : "No referrals match your criteria."}
      />
      {isLoading && <p className="mt-3 text-xs text-gray-400">Loading referrals...</p>}
      {viewReferral && <ViewReferralModal row={viewReferral} onClose={() => setViewReferral(null)} />}
    </>
  );
}

function PageIntro({
  activeTab,
  setTab,
  onBack,
}: {
  activeTab: ReferralTab;
  setTab: (tab: ReferralTab) => void;
  onBack?: () => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          {activeTab === "create" && onBack && <BackButton onClick={onBack} />}
          <h1 className="text-2xl font-semibold text-black sm:text-3xl">Referrals</h1>
          <p className="mt-2 text-base text-[#3F3F46]">Create and track patient referrals</p>
        </div>

        {activeTab === "history" && (
          <button
            type="button"
            onClick={() => setTab("create")}
            className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#046C3F] px-5 text-sm font-semibold text-white"
          >
            <Plus size={18} /> Create Referral
          </button>
        )}
      </div>
      <div className="mt-7 flex w-full max-w-md overflow-hidden rounded-lg">
        <button
          type="button"
          onClick={() => setTab("history")}
          className={`h-10 flex-1 text-base ${
            activeTab === "history"
              ? "bg-[#046C3F] text-white"
              : "bg-[#EFF7F4] text-gray-400"
          }`}
        >
          Referral History
        </button>
        <button
          type="button"
          onClick={() => setTab("create")}
          className={`h-10 flex-1 text-base ${
            activeTab === "create"
              ? "bg-[#046C3F] text-white"
              : "bg-[#EFF7F4] text-gray-400"
          }`}
        >
          Create Referral
        </button>
      </div>
    </div>
  );
}

function CreateReferralView({
  setTab,
  onSubmit,
}: {
  setTab: (tab: ReferralTab) => void;
  onSubmit: (row: ReferralRow) => void;
}) {
  const [form, setForm] = useState<ReferralForm>(emptyForm);
  const [error, setError] = useState("");
  const createReferral = useCreateDoctorReferral();
  const selectedPatient = PATIENTS.find((patient) => patient.patientId === form.patientId);

  const updateForm = <K extends keyof ReferralForm>(key: K, value: ReferralForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updatePrescription = (index: number, key: keyof PrescriptionLine, value: string) => {
    updateForm(
      "prescriptions",
      form.prescriptions.map((line, lineIndex) =>
        lineIndex === index ? { ...line, [key]: value } : line,
      ),
    );
  };

  const handlePatientChange = (label: string) => {
    const patient = PATIENTS.find((item) => `${item.patientName} - ${item.patientId}` === label);
    if (!patient) return;
    setForm({
      ...emptyForm,
      patientId: patient.patientId,
      clinicalSummary: patient.diagnosis,
      prescriptions: patient.prescriptions,
    });
    setError("");
  };

  const handleSubmit = () => {
    if (!selectedPatient || !form.receivingFacility || !form.referralType || !form.reason) {
      setError("Select a patient, receiving facility, referral type, and reason before submitting.");
      return;
    }

    createReferral.mutate(
      {
        appointment: selectedPatient.encounterId,
        receiving_facility: form.receivingFacility,
        referral_type: form.referralType,
        reason_for_referral: form.reason,
        clinical_summary: form.clinicalSummary || form.doctorNotes,
      },
      {
        onSettled: () => {
          onSubmit({
            referralId: "REF-PLT-000245",
            patientId: selectedPatient.patientId,
            patientName: selectedPatient.patientName,
            referringFacility: "General Clinic",
            receivingFacility: form.receivingFacility,
            reason: form.reason,
            date: "12 Mar 2026",
            status: "Pending",
            notes: form.doctorNotes || form.clinicalSummary,
          });
          setForm(emptyForm);
          setTab("history");
        },
      },
    );
  };

  return (
    <>
      <PageIntro activeTab="create" setTab={setTab} onBack={() => setTab("history")} />
      <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <RefreshCcw size={22} className="text-[#046C3F]" />
          <h2 className="text-xl font-semibold text-black">New Referral</h2>
        </div>

        <div className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SearchableSelect
              label="Patient Name"
              placeholder="Search patient by name or ID"
              options={PATIENTS.map((patient) => `${patient.patientName} - ${patient.patientId}`)}
              value={selectedPatient ? `${selectedPatient.patientName} - ${selectedPatient.patientId}` : ""}
              onChange={handlePatientChange}
            />
            <FieldShell label="Referral ID">
              <p className="text-base text-gray-400">REF-PLT-000245</p>
            </FieldShell>
            <FieldShell label="Encounter ID">
              <div className="flex items-center gap-3 text-base text-gray-400">
                <Search size={20} className="text-gray-900" />
                {selectedPatient?.encounterId || "ENC-PLT-000234"}
              </div>
            </FieldShell>
            <FieldShell label="Referral Date">
              <div className="flex items-center gap-3 text-base text-gray-400">
                <CalendarDays size={20} />
                12/12/2020
              </div>
            </FieldShell>
            <FieldShell label="Referring facility">
              <p className="text-base text-gray-400">General Clinic</p>
            </FieldShell>
            <SearchableSelect
              label="Receiving Facility"
              placeholder="Select facility"
              options={FACILITIES}
              value={form.receivingFacility}
              onChange={(value) => updateForm("receivingFacility", value)}
            />
          </div>

          {selectedPatient && <PatientSummaryCard patient={selectedPatient} />}

          <SearchableSelect
            label="Referral Type"
            placeholder="Select one"
            options={REFERRAL_TYPES}
            value={form.referralType}
            onChange={(value) => updateForm("referralType", value)}
            searchable={false}
          />

          <FieldShell label="Reason for Referral">
            <textarea
              value={form.reason}
              onChange={(event) => updateForm("reason", event.target.value)}
              placeholder="Reason..."
              className="min-h-36 w-full resize-y text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </FieldShell>
          <FieldShell label="Clinical Summary (Optional)">
            <textarea
              value={form.clinicalSummary}
              onChange={(event) => updateForm("clinicalSummary", event.target.value)}
              placeholder="Additional notes / observations"
              className="min-h-32 w-full resize-y text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </FieldShell>
          <FieldShell label="Doctor Notes">
            <textarea
              value={form.doctorNotes}
              onChange={(event) => updateForm("doctorNotes", event.target.value)}
              placeholder="Add notes for receiving clinician"
              className="min-h-28 w-full resize-y text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </FieldShell>

          {form.prescriptions.length > 0 && (
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText size={20} className="text-[#046C3F]" />
                Prescriptions and Dose Modification
              </div>
              <div className="space-y-4">
                {form.prescriptions.map((line, index) => (
                  <div key={`${line.drug}-${index}`} className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <FieldShell label="Drug Name">
                      <p className="text-base text-gray-500">{line.drug}</p>
                    </FieldShell>
                    <FieldShell label="Dose">
                      <input
                        value={line.dose}
                        onChange={(event) => updatePrescription(index, "dose", event.target.value)}
                        className="w-full text-base text-gray-700 outline-none"
                      />
                    </FieldShell>
                    <FieldShell label="Frequency">
                      <input
                        value={line.frequency}
                        onChange={(event) => updatePrescription(index, "frequency", event.target.value)}
                        className="w-full text-base text-gray-700 outline-none"
                      />
                    </FieldShell>
                    <FieldShell label="Duration">
                      <input
                        value={line.duration}
                        onChange={(event) => updatePrescription(index, "duration", event.target.value)}
                        className="w-full text-base text-gray-700 outline-none"
                      />
                    </FieldShell>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

          <div className="flex flex-col justify-end gap-4 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                setTab("history");
              }}
              className="h-14 rounded-xl bg-[#B7BAC5] px-16 text-lg text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="h-14 rounded-xl bg-[#046C3F] px-16 text-lg text-white"
            >
              {createReferral.isPending ? "Submitting..." : "Submit Referral"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DoctorReferrals() {
  const [tab, setTab] = useState<ReferralTab>("history");
  const [referrals, setReferrals] = useState(INITIAL_REFERRALS);

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Referrals"
        breadcrumbs={[
          { label: "Referrals" },
          { label: tab === "history" ? "Referrals History" : "Create Referrals", active: true },
        ]}
      />
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        {tab === "history" ? (
          <HistoryView referrals={referrals} setTab={setTab} />
        ) : (
          <CreateReferralView
            setTab={setTab}
            onSubmit={(row) => setReferrals((current) => [row, ...current])}
          />
        )}
      </main>
    </div>
  );
}
