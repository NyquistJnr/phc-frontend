"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Ban,
  X,
} from "lucide-react";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";

type AppointmentStatus = "Scheduled" | "In-Progress" | "Completed" | "Canceled" | "Missed";
type ViewMode = "list" | "new";

type AppointmentRow = {
  patientId: string;
  patientName: string;
  dateTime: string;
  dateValue: string;
  visitType: string;
  reason: string;
  assignedTo: string;
  status: AppointmentStatus;
};

type AppointmentForm = {
  patientName: string;
  patientId: string;
  encounterId: string;
  appointmentId: string;
  date: string;
  time: string;
  visitType: string;
  assignedTo: string;
  reason: string;
  notes: string;
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
const ASSIGNEES = [
  "Dr Musa - PAT-PLT-000234",
  "Nurse Ada - PAT-PLT-000234",
  "Festus Mba - PAT-PLT-000234",
  "Dr Philip - PAT-PLT-000234",
  "Dr Philip - PAT-PLT-000234",
  "Dr Philip - PAT-PLT-000234",
  "Dr Philip - PAT-PLT-000234",
  "Dr Philip - PAT-PLT-000234",
];
const STATUS_OPTIONS = ["All Status", "Scheduled", "In-Progress", "Completed", "Canceled", "Missed"];

const INITIAL_FORM: AppointmentForm = {
  patientName: "",
  patientId: "PAT-PLT-000234",
  encounterId: "ENC-PLT-000234",
  appointmentId: "APT-PLT-000234",
  date: "2020-12-12",
  time: "12:00",
  visitType: "",
  assignedTo: "",
  reason: "",
  notes: "",
};

const INITIAL_APPOINTMENTS: AppointmentRow[] = [
  ["Ngozi Eze", "ANC", "Dr Musa", "Scheduled"],
  ["Emeka Dike", "General", "Nurse Ada", "In-Progress"],
  ["Amina Bello", "Immunization", "Festus Mba", "Completed"],
  ["Chukwu Obi", "Postnatal", "Dr Musa", "Canceled"],
  ["Kemi Adeyemi", "Consultation", "Dr Musa", "Missed"],
  ["Kemi Adeyemi", "Follow-up", "Dr Musa", "Scheduled"],
  ["Kemi Adeyemi", "Lab Test", "Dr Musa", "Canceled"],
  ["Kemi Adeyemi", "Consultation", "Dr Musa", "Completed"],
  ["Kemi Adeyemi", "Consultation", "Dr Musa", "Completed"],
  ["Kemi Adeyemi", "Consultation", "Dr Musa", "Completed"],
].map(([patientName, visitType, assignedTo, status]) => ({
  patientId: "PAT-PLT-000234",
  patientName,
  dateTime: "12 Mar - 09:00",
  dateValue: "2026-03-12",
  visitType,
  reason: "Postnatal check",
  assignedTo,
  status: status as AppointmentStatus,
}));

const statusColors: Record<AppointmentStatus, { bg: string; text: string }> = {
  Scheduled: { bg: "#FFF4E5", text: "#1F2937" },
  "In-Progress": { bg: "#E2E7FF", text: "#046C3F" },
  Completed: { bg: "#DFF3EA", text: "#039855" },
  Canceled: { bg: "#FDE8E8", text: "#F33131" },
  Missed: { bg: "#FDE8E8", text: "#F33131" },
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

function SuccessToast({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex w-[min(390px,calc(100vw-2rem))] items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
      <span className="h-12 w-1 rounded-full bg-[#039855]" />
      <span className="h-6 w-6 rounded-lg border border-[#A8E6C4] bg-[#E8F7F0]" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">Appointment scheduled</p>
        <p className="text-sm text-gray-600">Appointment scheduled for Grace Johnson</p>
      </div>
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

function AppointmentActionMenu({
  row,
  onView,
  onEdit,
  onExport,
  onCancel,
}: {
  row: AppointmentRow;
  onView: () => void;
  onEdit: () => void;
  onExport: () => void;
  onCancel: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 192;
      const estimatedHeight = 188;
      const top =
        rect.bottom + estimatedHeight > window.innerHeight
          ? rect.top + window.scrollY - estimatedHeight - 4
          : rect.bottom + window.scrollY + 4;
      const left = Math.max(12 + window.scrollX, rect.right - menuWidth + window.scrollX);

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

  const items = [
    { label: "View", icon: Eye, onClick: onView, className: "text-gray-700" },
    { label: "Edit", icon: Edit, onClick: onEdit, className: "text-gray-700" },
    { label: "Export", icon: Download, onClick: onExport, className: "text-gray-700" },
    { label: "Cancel", icon: Ban, onClick: onCancel, className: "text-red-600" },
  ];

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
            className="absolute z-[9999] w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 ${item.className}`}
                >
                  <Icon size={16} className={item.className} />
                  {item.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}

function AppointmentForm({
  form,
  error,
  onChange,
  onSubmit,
  onCancel,
}: {
  form: AppointmentForm;
  error: string;
  onChange: <K extends keyof AppointmentForm>(field: K, value: AppointmentForm[K]) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
    >
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BCAB4] text-[#046C3F]">
          <CalendarDays size={18} />
        </span>
        <h2 className="text-xl font-semibold text-black">Create appointment</h2>
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
            <input value={form.patientId} readOnly className="w-full bg-transparent text-base text-gray-400 outline-none" />
          </FieldShell>
          <FieldShell label="Encounter ID">
            <input value={form.encounterId} readOnly className="w-full bg-transparent text-base text-gray-400 outline-none" />
          </FieldShell>
          <FieldShell label="Appointment ID">
            <input value={form.appointmentId} readOnly className="w-full bg-transparent text-base text-gray-400 outline-none" />
          </FieldShell>
          <FieldShell label="Date">
            <div className="flex items-center gap-3">
              <CalendarDays size={22} className="shrink-0 text-gray-500" />
              <input
                value={form.date}
                type="date"
                onChange={(event) => onChange("date", event.target.value)}
                className="w-full bg-transparent text-base text-gray-400 outline-none"
              />
            </div>
          </FieldShell>
          <FieldShell label="Time">
            <div className="flex items-center gap-3">
              <Clock size={22} className="shrink-0 text-gray-400" />
              <input
                value={form.time}
                type="time"
                onChange={(event) => onChange("time", event.target.value)}
                className="w-full bg-transparent text-base text-gray-400 outline-none"
              />
            </div>
          </FieldShell>
          <SelectField
            label="Visit Type"
            placeholder="Select"
            options={VISIT_TYPES}
            value={form.visitType}
            onChange={(value) => onChange("visitType", value)}
          />
          <SelectField
            label="Assigned To"
            placeholder="Select"
            options={ASSIGNEES}
            searchable
            value={form.assignedTo}
            onChange={(value) => onChange("assignedTo", value)}
          />
        </div>

        <FieldShell label="Reason for Visit">
          <textarea
            value={form.reason}
            onChange={(event) => onChange("reason", event.target.value)}
            placeholder="Enter reason here"
            rows={6}
            className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
          />
        </FieldShell>
        <FieldShell label="Notes (Optional)">
          <textarea
            value={form.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            placeholder="Enter notes here"
            rows={5}
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
            className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-10 text-lg font-medium text-white transition-colors hover:bg-[#035a34]"
          >
            <CalendarDays size={20} />
            Schedule
          </button>
        </div>
      </div>
    </form>
  );
}

export default function Appointments() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<ViewMode>("list");
  const [appointments, setAppointments] = useState<AppointmentRow[]>(INITIAL_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [visitFilter, setVisitFilter] = useState("All Visit Type");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [form, setForm] = useState<AppointmentForm>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10;

  const filteredAppointments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch =
        !term ||
        [appointment.patientId, appointment.patientName, appointment.reason, appointment.assignedTo].some((value) =>
          value.toLowerCase().includes(term),
        );
      const matchesVisit =
        visitFilter === "All Visit Type" || appointment.visitType === visitFilter;
      const matchesStatus =
        statusFilter === "All Status" || appointment.status === statusFilter;
      const matchesStart = !startDate || appointment.dateValue >= startDate;
      const matchesEnd = !endDate || appointment.dateValue <= endDate;

      return matchesSearch && matchesVisit && matchesStatus && matchesStart && matchesEnd;
    });
  }, [appointments, endDate, searchTerm, startDate, statusFilter, visitFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedAppointments = filteredAppointments.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  const updateForm = <K extends keyof AppointmentForm>(
    field: K,
    value: AppointmentForm[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setFormError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.patientName.trim() || !form.visitType || !form.assignedTo || !form.reason.trim()) {
      setFormError("Please complete all required appointment fields.");
      return;
    }

    const newAppointment: AppointmentRow = {
      patientId: form.patientId,
      patientName: form.patientName.trim(),
      dateTime: "12 Mar - 09:00",
      dateValue: form.date,
      visitType: form.visitType,
      reason: form.reason.trim(),
      assignedTo: form.assignedTo.split(" - ")[0],
      status: "Scheduled",
    };

    setAppointments((current) => [newAppointment, ...current]);
    resetForm();
    setToastVisible(true);
    setMode("list");
  };

  const columns: ColumnDef<AppointmentRow>[] = [
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Date & Time", accessorKey: "dateTime", sortable: true },
    { header: "Visit Type", accessorKey: "visitType", sortable: true },
    { header: "Reason", accessorKey: "reason", sortable: true },
    { header: "Assigned To", accessorKey: "assignedTo", sortable: true },
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
        <AppointmentActionMenu
          row={row}
          onView={() => console.log("View appointment", row)}
          onEdit={() => {
            setForm({
              patientName: row.patientName,
              patientId: row.patientId,
              encounterId: "ENC-PLT-000234",
              appointmentId: "APT-PLT-000234",
              date: row.dateValue,
              time: "09:00",
              visitType: row.visitType,
              assignedTo: `${row.assignedTo} - PAT-PLT-000234`,
              reason: row.reason,
              notes: "",
            });
            setMode("new");
          }}
          onExport={() => console.log("Export appointment", row)}
          onCancel={() => {
            setAppointments((current) =>
              current.map((appointment) =>
                appointment === row
                  ? { ...appointment, status: "Canceled" }
                  : appointment,
              ),
            );
          }}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Appointments"
        breadcrumbs={
          mode === "new"
            ? [{ label: "Appointments" }, { label: "New Appointment" }]
            : [{ label: "Appointments" }]
        }
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        {mode === "new" && <NurseBackButton onClick={() => setMode("list")} />}

        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              {mode === "new" ? "Create Appointment" : "Appointments"}
            </h2>
            {mode === "list" && (
              <p className="text-base text-[#3F3F46]">
                Schedule, reschedule, and manage patient appointments
              </p>
            )}
          </div>

          {mode === "list" && (
            <button
              type="button"
              onClick={() => setMode("new")}
              className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-7 text-base font-medium text-white transition-colors hover:bg-[#035a34]"
            >
              <Plus size={20} />
              New Appointment
            </button>
          )}
        </div>

        {mode === "list" ? (
          <DataTable
            title="Patient Appointments"
            data={paginatedAppointments}
            columns={columns}
            showSearch
            searchPlaceholder="Search by patient name or ID"
            onSearch={setSearchTerm}
            totalPages={filteredAppointments.length > itemsPerPage ? totalPages : undefined}
            emptyMessage="No appointments match your criteria."
            toolbarActions={
              <>
                <NurseDateRangeFilter
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
                  options={["All Visit Type", ...VISIT_TYPES]}
                  selected={visitFilter}
                  onSelect={setVisitFilter}
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
          <AppointmentForm
            form={form}
            error={formError}
            onChange={updateForm}
            onSubmit={handleSubmit}
            onCancel={() => {
              resetForm();
              setMode("list");
            }}
          />
        )}
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
