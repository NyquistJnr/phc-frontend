"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  Edit,
  Plus,
  Save,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { ActionButton, StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";

type VitalsStatus = "Vitals Pending" | "Waiting" | "Completed";
type Priority = "Urgent" | "High" | "Normal" | "Low";
type ViewMode = "records" | "record" | "view";

type VitalsRow = {
  patientId: string;
  patientName: string;
  ageGender: string;
  visitType: string;
  priority: Priority;
  status: VitalsStatus;
};

type VitalsForm = {
  patientName: string;
  patientId: string;
  encounterId: string;
  vitalId: string;
  age: string;
  visitType: string;
  temperature: string;
  bloodPressure: string;
  pulseRate: string;
  respiratoryRate: string;
  weight: string;
  height: string;
  bmi: string;
  spo2: string;
  recordedBy: string;
  recordedAt: string;
  note: string;
};

const VISIT_TYPES = [
  "ANC",
  "General",
  "Immunization",
  "Postnatal",
  "Consultation",
  "Follow-up",
  "Lab Test",
];
const PRIORITY_OPTIONS = ["All Priority", "Urgent", "High", "Normal", "Low"];
const STATUS_OPTIONS = ["All Status", "Vitals Pending", "Waiting", "Completed"];
const RECORDED_BY_OPTIONS = [
  "Nurse Grace - PAT-PLT-000234",
  "Nurse Amaka - PAT-PLT-000234",
  "Patricia Okoye -PAT-PLT-000234",
  "Monika Ayo - PAT-PLT-000234",
  "Nurse Grace - PAT-PLT-000234",
  "Nurse Grace - PAT-PLT-000234",
  "Nurse Grace - PAT-PLT-000234",
];

const INITIAL_FORM: VitalsForm = {
  patientName: "",
  patientId: "PAT-PLT-000234",
  encounterId: "ENC-PLT-000234",
  vitalId: "VIT-PLT-000234",
  age: "31years",
  visitType: "",
  temperature: "",
  bloodPressure: "",
  pulseRate: "",
  respiratoryRate: "",
  weight: "",
  height: "",
  bmi: "Auto-calculated",
  spo2: "",
  recordedBy: "",
  recordedAt: "2020-12-12T00:00",
  note: "",
};

const INITIAL_ROWS: VitalsRow[] = [
  ["Ngozi Eze", "45 / M", "ANC", "Urgent", "Vitals Pending"],
  ["Emeka Dike", "45 / F", "General", "High", "Vitals Pending"],
  ["Amina Bello", "45 / M", "Immunization", "Normal", "Waiting"],
  ["Chukwu Obi", "45 / F", "Postnatal", "Low", "Completed"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "Normal", "Waiting"],
  ["Kemi Adeyemi", "45 / F", "Follow - Up", "Urgent", "Vitals Pending"],
  ["Kemi Adeyemi", "45 / M", "Lab Test", "Urgent", "Vitals Pending"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "Low", "Completed"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "Low", "Completed"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "Low", "Completed"],
  ["Kemi Adeyemi", "45 / F", "General", "High", "Waiting"],
  ["Amina Bello", "45 / M", "ANC", "Normal", "Completed"],
].map(([patientName, ageGender, visitType, priority, status]) => ({
  patientId: "PAT-PLT-000234",
  patientName,
  ageGender,
  visitType,
  priority: priority as Priority,
  status: status as VitalsStatus,
}));

const priorityColors: Record<Priority, { bg: string; text: string }> = {
  Urgent: { bg: "#FDE8E8", text: "#F33131" },
  High: { bg: "#FDE8E8", text: "#F33131" },
  Normal: { bg: "#FFF4E5", text: "#1F2937" },
  Low: { bg: "#DFF3EA", text: "#039855" },
};

const statusColors: Record<VitalsStatus, { bg: string; text: string }> = {
  "Vitals Pending": { bg: "#FDE8E8", text: "#F33131" },
  Waiting: { bg: "#FFF4E5", text: "#1F2937" },
  Completed: { bg: "#DFF3EA", text: "#039855" },
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

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BCAB4] text-[#046C3F]">
        <TrendingUp size={17} />
      </span>
      <h2 className="text-xl font-semibold text-black">{title}</h2>
    </div>
  );
}

function SelectField({
  label,
  placeholder,
  options,
  value,
  searchable = false,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  searchable?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const filteredOptions = options.filter((option) =>
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
          <ChevronDown
            size={20}
            className={`text-gray-800 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
          {searchable && (
            <div className="relative mb-3">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="h-11 w-full rounded-lg border border-gray-300 pl-12 pr-3 text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
              />
            </div>
          )}
          <div className="max-h-72 overflow-y-auto pr-1">
            {filteredOptions.map((option, index) => {
              const selected = value === option;

              return (
                <button
                  key={`${option}-${index}`}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setSearch("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-4 rounded-md px-2 py-2.5 text-left text-sm text-gray-500 hover:bg-gray-50"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      selected
                        ? "border-[#046C3F] bg-[#046C3F]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selected && (
                      <span className="h-2.5 w-2.5 rounded-sm bg-white" />
                    )}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function NumberField({
  label,
  value,
  placeholder,
  unit,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  unit?: string;
  onChange: (value: string) => void;
}) {
  const numericValue = Number(value || 0);
  const step = unit === "kg" || unit === "°C" ? 0.1 : 1;

  return (
    <FieldShell label={label}>
      <div className="flex items-center gap-3">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
        />
        <div className="flex w-10 shrink-0 flex-col overflow-hidden rounded bg-gray-200 text-gray-500">
          <button
            type="button"
            onClick={() => onChange(String(Number((numericValue + step).toFixed(1))))}
            className="h-5 border-b border-white text-xs hover:bg-gray-300"
            aria-label={`Increase ${label}`}
          >
            ▲
          </button>
          <button
            type="button"
            onClick={() =>
              onChange(String(Math.max(0, Number((numericValue - step).toFixed(1)))))
            }
            className="h-5 text-xs hover:bg-gray-300"
            aria-label={`Decrease ${label}`}
          >
            ▼
          </button>
        </div>
      </div>
    </FieldShell>
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
      <p className="flex-1 text-sm font-semibold text-gray-900">
        {message}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="border-l border-gray-100 pl-4 text-gray-900 hover:text-gray-600"
        aria-label="Close toast"
      >
        <X size={18} />
      </button>
    </div>
  );
}

function RecordVitalsForm({
  form,
  error,
  submitLabel = "Save Vitals",
  onChange,
  onCancel,
  onSubmit,
}: {
  form: VitalsForm;
  error: string;
  submitLabel?: string;
  onChange: <K extends keyof VitalsForm>(field: K, value: VitalsForm[K]) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8">
        <SectionHeader title="Record New Vital for a patient" />

        <div className="max-w-4xl space-y-6">
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FieldShell label="Patient Name">
              <div className="flex items-center gap-3">
                <Search size={24} className="shrink-0 text-gray-900" />
                <input
                  value={form.patientName}
                  onChange={(event) => onChange("patientName", event.target.value)}
                  placeholder="Search patient by name or ID"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>
            </FieldShell>

            <FieldShell label="Patient ID">
              <input
                value={form.patientId}
                readOnly
                className="w-full bg-transparent text-base text-gray-400 outline-none"
              />
            </FieldShell>

            <FieldShell label="Encounter ID">
              <input
                value={form.encounterId}
                readOnly
                className="w-full bg-transparent text-base text-gray-400 outline-none"
              />
            </FieldShell>

            <FieldShell label="Vital ID">
              <input
                value={form.vitalId}
                readOnly
                className="w-full bg-transparent text-base text-gray-400 outline-none"
              />
            </FieldShell>

            <FieldShell label="Age">
              <input
                value={form.age}
                onChange={(event) => onChange("age", event.target.value)}
                className="w-full bg-transparent text-base text-gray-400 outline-none"
              />
            </FieldShell>

            <SelectField
              label="Visit Type"
              placeholder="Select"
              options={VISIT_TYPES}
              value={form.visitType}
              onChange={(value) => onChange("visitType", value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8">
        <SectionHeader title="Vital Signs" />

        <div className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <NumberField
              label="Temperature"
              value={form.temperature}
              placeholder="0°C"
              unit="°C"
              onChange={(value) => onChange("temperature", value)}
            />
            <NumberField
              label="Blood Pressure"
              value={form.bloodPressure}
              placeholder="e.g 120/80 mmHg"
              onChange={(value) => onChange("bloodPressure", value)}
            />
            <NumberField
              label="Pulse Rate"
              value={form.pulseRate}
              placeholder="0 bmp"
              onChange={(value) => onChange("pulseRate", value)}
            />
            <NumberField
              label="Respiratory Rate"
              value={form.respiratoryRate}
              placeholder="0/min"
              onChange={(value) => onChange("respiratoryRate", value)}
            />
            <NumberField
              label="Weight"
              value={form.weight}
              placeholder="0 kg"
              unit="kg"
              onChange={(value) => onChange("weight", value)}
            />
            <NumberField
              label="Height"
              value={form.height}
              placeholder="0 cm"
              onChange={(value) => onChange("height", value)}
            />
            <FieldShell label="BMI">
              <input
                value={form.bmi}
                readOnly
                className="w-full bg-transparent text-base text-gray-400 outline-none"
              />
            </FieldShell>
            <NumberField
              label="SpO₂"
              value={form.spo2}
              placeholder="0 %"
              onChange={(value) => onChange("spo2", value)}
            />
            <SelectField
              label="Recorded By"
              placeholder="Select"
              options={RECORDED_BY_OPTIONS}
              value={form.recordedBy}
              searchable
              onChange={(value) => onChange("recordedBy", value)}
            />
            <FieldShell label="Recorded At">
              <div className="flex items-center gap-3">
                <CalendarDays size={22} className="shrink-0 text-gray-500" />
                <input
                  value={form.recordedAt}
                  type="datetime-local"
                  onChange={(event) => onChange("recordedAt", event.target.value)}
                  className="w-full bg-transparent text-base text-gray-400 outline-none"
                />
              </div>
            </FieldShell>
          </div>

          <FieldShell label="Note(Optional)">
            <textarea
              value={form.note}
              onChange={(event) => onChange("note", event.target.value)}
              placeholder="Additional triage observations"
              rows={6}
              className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </FieldShell>

          <div className="flex flex-col items-stretch gap-4 pt-1 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onCancel}
              className="h-14 rounded-xl bg-[#B9BDC9] px-12 text-lg font-medium text-white transition-colors hover:bg-[#A9AEBC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-8 text-lg font-medium text-white transition-colors hover:bg-[#035a34]"
            >
              <Save size={20} />
              {submitLabel}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}

export default function Vitals() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<ViewMode>("records");
  const [rows, setRows] = useState<VitalsRow[]>(INITIAL_ROWS);
  const [searchTerm, setSearchTerm] = useState("");
  const [visitFilter, setVisitFilter] = useState("All Visit Types");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [form, setForm] = useState<VitalsForm>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("Vital Saved Successfully");

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !normalizedSearch ||
        [row.patientId, row.patientName, row.ageGender, row.visitType].some(
          (value) => value.toLowerCase().includes(normalizedSearch),
        );
      const matchesVisit =
        visitFilter === "All Visit Types" || row.visitType === visitFilter;
      const matchesPriority =
        priorityFilter === "All Priority" || row.priority === priorityFilter;
      const matchesStatus =
        statusFilter === "All Status" || row.status === statusFilter;

      return matchesSearch && matchesVisit && matchesPriority && matchesStatus;
    });
  }, [priorityFilter, rows, searchTerm, statusFilter, visitFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRows = filteredRows.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  const columns: ColumnDef<VitalsRow>[] = [
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Age/Gender", accessorKey: "ageGender", sortable: true },
    { header: "Visit Type", accessorKey: "visitType", sortable: true },
    {
      header: "Priority",
      sortable: true,
      render: (row) => (
        <StatusBadge
          label={row.priority}
          bgColorHex={priorityColors[row.priority].bg}
          textColorHex={priorityColors[row.priority].text}
        />
      ),
    },
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
      render: (row) => (
        <ActionButton
          label={row.status === "Completed" ? "View" : "Record Vitals"}
          variant={row.status === "Completed" ? "soft" : "solid"}
          onClick={() => {
            setForm((current) => ({
              ...current,
              patientName: row.patientName,
              patientId: row.patientId,
              age: row.ageGender.split("/")[0].trim(),
              visitType: row.visitType.replace(" - ", "-"),
              temperature: row.status === "Completed" ? "37" : current.temperature,
              bloodPressure:
                row.status === "Completed" ? "120/80" : current.bloodPressure,
              pulseRate: row.status === "Completed" ? "80" : current.pulseRate,
              respiratoryRate:
                row.status === "Completed" ? "18" : current.respiratoryRate,
              weight: row.status === "Completed" ? "64" : current.weight,
              height: row.status === "Completed" ? "170" : current.height,
              spo2: row.status === "Completed" ? "98" : current.spo2,
              recordedBy:
                row.status === "Completed"
                  ? "Nurse Grace - PAT-PLT-000234"
                  : current.recordedBy,
            }));
            setMode(row.status === "Completed" ? "view" : "record");
          }}
        />
      ),
    },
  ];

  const updateForm = <K extends keyof VitalsForm>(
    field: K,
    value: VitalsForm[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setFormError("");
  };

  const handleCancel = () => {
    resetForm();
    setMode("records");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.patientName.trim() ||
      !form.visitType ||
      !form.recordedBy ||
      !form.temperature ||
      !form.bloodPressure ||
      !form.pulseRate
    ) {
      setFormError("Please complete the required vital sign fields.");
      return;
    }

    const newRow: VitalsRow = {
      patientId: form.patientId,
      patientName: form.patientName.trim(),
      ageGender: `${form.age || "31"} / F`,
      visitType: form.visitType,
      priority: "Normal",
      status: "Completed",
    };

    setRows((current) => [newRow, ...current]);
    resetForm();
    setToastMessage(
      mode === "view" ? "Vital Updated Successfully" : "Vital Saved Successfully",
    );
    setToastVisible(true);
    setMode("records");
  };

  const emptyMessage =
    rows.length === 0
      ? "No patients waiting for vitals."
      : "No patients match your criteria.";

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader title="Vitals" breadcrumbs={[{ label: "Vitals" }]} />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        {mode !== "records" && (
          <NurseBackButton onClick={() => setMode("records")} />
        )}
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Record Patient Vitals
            </h2>
            <p className="text-base text-[#3F3F46]">
              Take and save patient vital signs
            </p>
          </div>

          {mode === "records" && (
            <button
              type="button"
              onClick={() => setMode("record")}
              className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-7 text-base font-medium text-white transition-colors hover:bg-[#035a34]"
            >
              <Plus size={20} />
              Record New Vital
            </button>
          )}
          {mode === "view" && (
            <button
              type="button"
              onClick={() => setMode("view")}
              className="inline-flex h-8 items-center justify-center gap-2 rounded border border-gray-700 bg-white px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Edit size={15} />
              Edit Vitals
            </button>
          )}
        </div>

        {mode === "records" ? (
          <DataTable
            title="Today's Patient waiting for vital"
            data={paginatedRows}
            columns={columns}
            showSearch
            searchPlaceholder="Search by patient name or ID"
            onSearch={setSearchTerm}
            totalPages={filteredRows.length > itemsPerPage ? totalPages : undefined}
            emptyMessage={emptyMessage}
            toolbarActions={
              <>
                <CustomDropdown
                  options={["All Visit Types", ...VISIT_TYPES]}
                  selected={visitFilter}
                  onSelect={setVisitFilter}
                />
                <CustomDropdown
                  options={PRIORITY_OPTIONS}
                  selected={priorityFilter}
                  onSelect={setPriorityFilter}
                />
                <CustomDropdown
                  options={STATUS_OPTIONS}
                  selected={statusFilter}
                  onSelect={setStatusFilter}
                />
              </>
            }
          />
        ) : (
          <RecordVitalsForm
            form={form}
            error={formError}
            submitLabel={mode === "view" ? "Update Vitals" : "Save Vitals"}
            onChange={updateForm}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {toastVisible && (
        <SuccessToast
          message={toastMessage}
          onClose={() => setToastVisible(false)}
        />
      )}
    </div>
  );
}
