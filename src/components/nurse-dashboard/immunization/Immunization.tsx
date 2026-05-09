"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import {
  Baby,
  CalendarDays,
  ChevronDown,
  Eye,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Syringe,
  X,
} from "lucide-react";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";

type ImmunizationStatus = "Completed" | "Due" | "Pending";
type ViewMode = "records" | "register";

type ImmunizationRecord = {
  patientId: string;
  patientName: string;
  age: string;
  scheduledDate: string;
  scheduledDateValue: string;
  vaccine: string;
  dueDate: string;
  dueDateValue: string;
  status: ImmunizationStatus;
};

type RegisterChildForm = {
  patientName: string;
  patientId: string;
  encounterId: string;
  facility: string;
  ward: string;
  lga: string;
  facilityType: string;
  state: string;
  dateOfVisit: string;
  sessionType: string;
  siteName: string;
  vaccinationsGiven: string[];
  ageAtVaccination: string;
  responsibleOfficer: string;
  reportingPeriod: string;
  note: string;
};

const STATUS_OPTIONS = ["All Status", "Completed", "Due", "Pending"];
const FACILITY_TYPES = ["PHC Clinic", "PHC Centre", "Health Post"];
const SESSION_TYPES = ["Fixed", "Outreach", "Mobile"];
const VACCINE_OPTIONS = [
  "Hep.B 0",
  "OPV 0",
  "BCG",
  "OPV1",
  "PENTA1",
  "PCV1",
  "ROTA1",
  "OPV2",
  "PENTA2",
  "PCV2",
  "ROTA2",
  "OPV3",
  "PANTA3",
  "PCV3",
  "ROTA3",
  "IPV",
  "Vitamin A",
  "Measles 1",
  "Yellow Fever",
  "Men A",
  "Measles 2",
  "HPV",
];

const INITIAL_FORM: RegisterChildForm = {
  patientName: "",
  patientId: "PAT-PLT-000234",
  encounterId: "ENC-PLT-000234",
  facility: "Auto-filled from logged-in facility",
  ward: "Auto-filled",
  lga: "Auto-filled",
  facilityType: "",
  state: "Auto-filled",
  dateOfVisit: "2020-12-12",
  sessionType: "",
  siteName: "",
  vaccinationsGiven: [],
  ageAtVaccination: "Auto-calculated from Date of Birth",
  responsibleOfficer: "",
  reportingPeriod: "",
  note: "",
};

const INITIAL_RECORDS: ImmunizationRecord[] = [
  { vaccine: "PCV (3rd dose)", status: "Completed" },
  { vaccine: "BCG, OPV0, HBV", status: "Due" },
  { vaccine: "DPT-HBV-Hib (1st)", status: "Pending" },
  { vaccine: "Measles-Rubella", status: "Completed" },
  { vaccine: "OPV0, HBV", status: "Pending" },
  { vaccine: "OPV0, HBV", status: "Due" },
  { vaccine: "OPV0, HBV", status: "Completed" },
  { vaccine: "OPV0, HBV", status: "Completed" },
  { vaccine: "OPV0, HBV", status: "Completed" },
  { vaccine: "OPV0, HBV", status: "Completed" },
  { vaccine: "Vitamin A", status: "Pending" },
  { vaccine: "Yellow Fever", status: "Completed" },
].map((record) => ({
  patientId: "PAT-PLT-000234",
  patientName: "Emeka Dike",
  age: "8 months",
  scheduledDate: "12 Mar 2026",
  scheduledDateValue: "2026-03-12",
  vaccine: record.vaccine,
  dueDate: "12 Mar 2026",
  dueDateValue: "2026-03-12",
  status: record.status as ImmunizationStatus,
}));

const statusColors: Record<ImmunizationStatus, { bg: string; text: string }> = {
  Completed: { bg: "#DFF3EA", text: "#039855" },
  Due: { bg: "#FDE8E8", text: "#F33131" },
  Pending: { bg: "#FFF4E5", text: "#1F2937" },
};

const formatDateValue = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function FieldShell({
  label,
  children,
  helperText,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  helperText?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="relative rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F]">
        <label className="block text-xs text-[#62636C] mb-1">{label}</label>
        {children}
      </div>
      {helperText && (
        <p className="mt-1.5 text-xs text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

function SelectField({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
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
        <span className="block text-xs text-[#62636C] mb-1">{label}</span>
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
        <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-lg border border-gray-200 bg-white py-2 shadow-sm">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                value === option
                  ? "bg-[#E8F7F0] text-[#046C3F] font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VaccineMultiSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const filteredOptions = VACCINE_OPTIONS.filter((option) =>
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

  const toggleOption = (option: string) => {
    onChange(
      value.includes(option)
        ? value.filter((item) => item !== option)
        : [...value, option],
    );
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
      >
        <span className="block text-xs text-[#62636C] mb-1">
          Vaccinations Given
        </span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span className={value.length ? "text-gray-700" : "text-gray-400"}>
            {value.length ? value.join(", ") : "Select"}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-800 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
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

          <div className="max-h-[610px] overflow-y-auto pr-1">
            {filteredOptions.map((option) => {
              const selected = value.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleOption(option)}
                  className="flex w-full items-center gap-4 rounded-md px-2 py-2.5 text-left text-sm text-gray-500 hover:bg-gray-50"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      selected
                        ? "border-[#046C3F] bg-[#E8F7F0]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selected && (
                      <span className="h-2.5 w-2.5 rounded-sm bg-[#046C3F]" />
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

function RegisterChildForm({
  form,
  error,
  onChange,
  onSubmit,
  onCancel,
}: {
  form: RegisterChildForm;
  error: string;
  onChange: <K extends keyof RegisterChildForm>(
    field: K,
    value: RegisterChildForm[K],
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
    >
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#046C3F] text-white">
          <Baby size={18} />
        </span>
        <h2 className="text-xl font-semibold text-black">Register Child</h2>
      </div>

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

          <FieldShell label="Facility">
            <input
              value={form.facility}
              readOnly
              className="w-full bg-transparent text-base text-gray-400 outline-none"
            />
          </FieldShell>

          <FieldShell label="Child's ward">
            <input
              value={form.ward}
              readOnly
              className="w-full bg-transparent text-base text-gray-400 outline-none"
            />
          </FieldShell>

          <FieldShell label="Child's LGA">
            <div className="flex items-center gap-3">
              <CalendarDays size={22} className="shrink-0 text-gray-500" />
              <input
                value={form.lga}
                readOnly
                className="w-full bg-transparent text-base text-gray-400 outline-none"
              />
            </div>
          </FieldShell>

          <SelectField
            label="Facility Type"
            placeholder="Select"
            options={FACILITY_TYPES}
            value={form.facilityType}
            onChange={(value) => onChange("facilityType", value)}
          />

          <FieldShell label="Child's state">
            <input
              value={form.state}
              readOnly
              className="w-full bg-transparent text-base text-gray-400 outline-none"
            />
          </FieldShell>

          <FieldShell label="Date of Visit">
            <div className="flex items-center gap-3">
              <CalendarDays size={22} className="shrink-0 text-gray-500" />
              <input
                value={form.dateOfVisit}
                onChange={(event) => onChange("dateOfVisit", event.target.value)}
                type="date"
                className="w-full bg-transparent text-base text-gray-400 outline-none"
              />
            </div>
          </FieldShell>

          <SelectField
            label="Session Type"
            placeholder="Select"
            options={SESSION_TYPES}
            value={form.sessionType}
            onChange={(value) => onChange("sessionType", value)}
          />

          <FieldShell
            label="Site Name (Optional)"
            helperText="Only for Outreach / Mobile"
          >
            <input
              value={form.siteName}
              onChange={(event) => onChange("siteName", event.target.value)}
              placeholder="Enter name"
              className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </FieldShell>

          <VaccineMultiSelect
            value={form.vaccinationsGiven}
            onChange={(value) => onChange("vaccinationsGiven", value)}
          />

          <FieldShell label="Age at Vaccination">
            <div className="flex items-center gap-3">
              <CalendarDays size={22} className="shrink-0 text-gray-500" />
              <input
                value={form.ageAtVaccination}
                readOnly
                className="w-full bg-transparent text-base text-gray-400 outline-none"
              />
            </div>
          </FieldShell>

          <FieldShell label="Responsible Officer">
            <input
              value={form.responsibleOfficer}
              onChange={(event) =>
                onChange("responsibleOfficer", event.target.value)
              }
              placeholder="Staff performing immunization"
              className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </FieldShell>

          <FieldShell label="Reporting Period">
            <input
              value={form.reportingPeriod}
              onChange={(event) =>
                onChange("reportingPeriod", event.target.value)
              }
              placeholder="Month / Year"
              className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </FieldShell>
        </div>

        <FieldShell label="Note(Optional)">
          <textarea
            value={form.note}
            onChange={(event) => onChange("note", event.target.value)}
            placeholder="Any relevant notes (adverse reactions, follow-up required)..."
            rows={6}
            className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
          />
        </FieldShell>

        <div className="flex flex-col items-stretch justify-end gap-4 pt-1 sm:flex-row sm:items-center">
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
            Register Child
          </button>
        </div>
      </div>
    </form>
  );
}

function SuccessToast({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed bottom-8 left-1/2 z-50 flex w-[min(390px,calc(100vw-2rem))] -translate-x-1/2 items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
      <span className="h-12 w-1 rounded-full bg-[#039855]" />
      <span className="h-6 w-6 rounded-lg border border-[#A8E6C4] bg-[#E8F7F0]" />
      <p className="flex-1 text-sm font-semibold text-gray-900">
        New vaccine record saved
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

function ImmunizationActionMenu({
  row,
  onMarkAdministered,
}: {
  row: ImmunizationRecord;
  onMarkAdministered: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 206;
      const estimatedHeight = 124;
      const top =
        rect.bottom + estimatedHeight > window.innerHeight
          ? rect.top + window.scrollY - estimatedHeight - 4
          : rect.bottom + window.scrollY + 4;
      const left = Math.max(
        12 + window.scrollX,
        rect.right - menuWidth + window.scrollX,
      );

      setCoords({ top, left });
    }
    setOpen((current) => !current);
  };

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

    function handleScroll() {
      setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        aria-label={`Open actions for ${row.patientId}`}
      >
        <MoreHorizontal size={18} />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: coords.top, left: coords.left }}
            className="absolute z-[9999] w-[206px] border border-gray-200 bg-white px-4 py-5 shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mb-3 flex w-full items-center gap-3 border-b border-gray-100 pb-3 text-left text-sm font-medium text-gray-400"
            >
              <Eye size={20} className="text-gray-700" />
              View
            </button>
            <div className="flex items-center gap-3">
              <Syringe size={20} className="text-gray-900" />
              <button
                type="button"
                onClick={() => {
                  onMarkAdministered();
                  setOpen(false);
                }}
                className="rounded-md bg-[#046C3F] px-3 py-2 text-xs font-medium text-white hover:bg-[#035a34]"
              >
                Mark Administered
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default function Immunization() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<ViewMode>("records");
  const [records, setRecords] = useState<ImmunizationRecord[]>(INITIAL_RECORDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [form, setForm] = useState<RegisterChildForm>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10;

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          record.patientId,
          record.patientName,
          record.age,
          record.vaccine,
          record.status,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchesStatus =
        statusFilter === "All Status" || record.status === statusFilter;
      const matchesStart =
        !startDate || record.scheduledDateValue >= startDate;
      const matchesEnd = !endDate || record.scheduledDateValue <= endDate;

      return matchesSearch && matchesStatus && matchesStart && matchesEnd;
    });
  }, [endDate, records, searchTerm, startDate, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRecords = filteredRecords.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  const columns: ColumnDef<ImmunizationRecord>[] = [
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Age", accessorKey: "age", sortable: true },
    { header: "Scheduled Date", accessorKey: "scheduledDate", sortable: true },
    { header: "Vaccine", accessorKey: "vaccine", sortable: true },
    { header: "Due Date", accessorKey: "dueDate", sortable: true },
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
        <ImmunizationActionMenu
          row={row}
          onMarkAdministered={() => {
            setRecords((current) =>
              current.map((record) =>
                record === row ? { ...record, status: "Completed" } : record,
              ),
            );
          }}
        />
      ),
    },
  ];

  const updateForm = <K extends keyof RegisterChildForm>(
    field: K,
    value: RegisterChildForm[K],
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
      !form.facilityType ||
      !form.sessionType ||
      form.vaccinationsGiven.length === 0 ||
      !form.responsibleOfficer.trim() ||
      !form.reportingPeriod.trim()
    ) {
      setFormError("Please complete all required immunization fields.");
      return;
    }

    const newRecord: ImmunizationRecord = {
      patientId: form.patientId,
      patientName: form.patientName.trim(),
      age: "8 months",
      scheduledDate: formatDateValue(form.dateOfVisit),
      scheduledDateValue: form.dateOfVisit,
      vaccine: form.vaccinationsGiven.join(", "),
      dueDate: formatDateValue(form.dateOfVisit),
      dueDateValue: form.dateOfVisit,
      status: "Completed",
    };

    setRecords((current) => [newRecord, ...current]);
    resetForm();
    setToastVisible(true);
    setMode("records");
  };

  const emptyMessage =
    records.length === 0
      ? "No immunization records found."
      : "No immunization records match your criteria.";

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Immunization"
        breadcrumbs={[{ label: "Immunization" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        {mode === "register" && (
          <NurseBackButton onClick={() => setMode("records")} />
        )}
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Immunization
            </h2>
            <p className="text-base text-[#3F3F46]">
              {mode === "records"
                ? "Vaccination schedule and administration"
                : "Track and manage child vaccinations per NPHCDA EPI schedule"}
            </p>
          </div>

          {mode === "records" && (
            <button
              type="button"
              onClick={() => setMode("register")}
              className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-7 text-base font-medium text-white transition-colors hover:bg-[#035a34]"
            >
              <Plus size={20} />
              Register Child
            </button>
          )}
        </div>

        {mode === "records" ? (
          <DataTable
            title="Immunization Records"
            data={paginatedRecords}
            columns={columns}
            showSearch
            searchPlaceholder="Search patient by Drug name..."
            onSearch={setSearchTerm}
            totalPages={filteredRecords.length > itemsPerPage ? totalPages : undefined}
            emptyMessage={emptyMessage}
            toolbarActions={
              <>
                <NurseDateRangeFilter
                  label="Scheduled Date"
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
                <CustomDropdown
                  options={STATUS_OPTIONS}
                  selected={statusFilter}
                  onSelect={setStatusFilter}
                />
              </>
            }
          />
        ) : (
          <RegisterChildForm
            form={form}
            error={formError}
            onChange={updateForm}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
