"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Check,
  ChevronDown,
  Download,
  Edit3,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  X,
} from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import PharmacistBackButton from "@/src/components/pharmacist-dashboard/generics/PharmacistBackButton";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import {
  ADVERSE_EVENTS,
  DRUG_OPTIONS,
} from "@/src/components/pharmacist-dashboard/prescriptions/pharmacyData";

type AdverseEventRow = (typeof ADVERSE_EVENTS)[number];
type Mode = "list" | "report";

const badgeColors: Record<string, { bg: string; text: string }> = {
  Mild: { bg: "#DDF2EA", text: "#00A556" },
  Moderate: { bg: "#FFF1DE", text: "#2E2E2E" },
  Severe: { bg: "#FFE5E5", text: "#FF1F1F" },
  Reported: { bg: "#E2E7FF", text: "#046C3F" },
  Pending: { bg: "#FFF1DE", text: "#2E2E2E" },
  Resolved: { bg: "#DDF2EA", text: "#00A556" },
};

function badge(label: string) {
  const color = badgeColors[label] ?? { bg: "#F1F5F9", text: "#475569" };
  return (
    <StatusBadge
      label={label}
      bgColorHex={color.bg}
      textColorHex={color.text}
    />
  );
}

function Field({
  label,
  value,
  placeholder,
  icon,
  readOnly,
  muted,
  className = "",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  icon?: ReactNode;
  readOnly?: boolean;
  muted?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label
      className={`flex h-[58px] items-center gap-3 rounded-md border border-[#D1D5DB] px-4 ${
        muted ? "bg-[#F1F2F4]" : "bg-white"
      } ${className}`}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-[#53545C]">{label}</span>
        <input
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full bg-transparent text-base text-[#6B7280] outline-none placeholder:text-[#A7ADB5]"
        />
      </span>
    </label>
  );
}

function SelectField({
  label,
  value,
  placeholder = "Select",
  options,
  searchable,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  options: string[];
  searchable?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const visibleOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-[58px] w-full items-center justify-between rounded-md border border-[#D1D5DB] bg-white px-4 text-left"
      >
        <span>
          <span className="block text-xs text-[#53545C]">{label}</span>
          <span className="mt-1 block text-base text-[#6B7280]">
            {value || placeholder}
          </span>
        </span>
        <ChevronDown size={20} className="text-[#111827]" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-40 w-full rounded border border-gray-200 bg-white p-3 shadow-xl">
          {searchable && (
            <label className="mb-3 flex h-11 items-center gap-3 rounded-md border border-gray-200 px-3">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="w-full outline-none"
              />
            </label>
          )}
          <div className="max-h-72 overflow-y-auto">
            {visibleOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex w-full items-center gap-4 rounded px-2 py-3 text-left text-[#7A7F89] hover:bg-gray-50"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                    value === option
                      ? "border-[#046C3F] bg-[#046C3F] text-white"
                      : "border-gray-300"
                  }`}
                >
                  {value === option && <Check size={14} />}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AdverseEventView({
  onClose,
  onEdit,
}: {
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/20 px-4 py-10 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[1100px] rounded-xl bg-white px-6 py-8 shadow-2xl sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={26} className="text-[#046C3F]" />
            <h2 className="text-2xl font-semibold text-black">
              View Adverse Event
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#FFF3E7] p-2"
            aria-label="Close adverse event view"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Patient Name"
            value="John Eze"
            icon={<Search size={22} />}
            readOnly
            muted
          />
          <Field label="Patient ID" value="PAT-PLT-000234" readOnly muted />
          <Field label="Event ID" value="ADR-PLT-000234" readOnly muted />
          <Field
            label="Reported by"
            value="Festus Gilbert"
            icon={<Search size={22} />}
            readOnly
            muted
          />
          <Field label="Patient Age" value="26" readOnly muted />
          <Field label="Sex" value="Male" readOnly muted />
          <Field label="Suspected Drug" value="Amoxicillin" readOnly muted />
          <Field label="Dosage" value="500mg 1 tab" readOnly muted />
          <Field label="Date of reaction" value="12/12/2020" readOnly muted />
          <Field
            label="Stop Date (if applicable)"
            value="12/12/2020"
            readOnly
            muted
          />
          <Field label="Reaction Type" value="Vomiting" readOnly muted />
          <Field label="Severity" value="Severe" readOnly muted />
        </div>
        <div className="mt-6 max-w-[770px]">
          <Field
            label="Description"
            value="Filled"
            readOnly
            muted
            className="h-40"
          />
        </div>

        <div className="mt-8 flex max-w-[770px] justify-end gap-8">
          <button
            onClick={onEdit}
            className="inline-flex h-14 items-center justify-center gap-3 px-4 text-lg font-medium text-[#046C3F]"
          >
            <Edit3 size={22} />
            Edit
          </button>
          <button className="inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-[#046C3F] px-16 text-lg font-medium text-[#046C3F]">
            <Download size={22} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportEvent({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [sex, setSex] = useState("");
  const [drug, setDrug] = useState("");
  const [severity, setSeverity] = useState("");

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Adverse Events"
        breadcrumbs={[
          { label: "Adverse Events", href: "/pharmacist-dashboard/adverse-events" },
          { label: "Report New Event" },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <PharmacistBackButton onClick={onBack} />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="rounded-xl bg-white px-5 py-8 shadow-sm sm:px-6"
        >
          <div className="mb-8 flex items-center gap-3">
            <FileText size={28} className="text-[#046C3F]" />
            <h1 className="text-2xl font-semibold text-black">
              Report New Event
            </h1>
          </div>

          <div className="grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="Patient Name"
              value=""
              placeholder="Search"
              icon={<Search size={24} />}
            />
            <Field label="Patient ID" value="" placeholder="Auto-generated" />
            <Field label="Event ID" value="" placeholder="Auto-generated" />
            <Field
              label="Reported by"
              value=""
              placeholder="Search"
              icon={<Search size={24} />}
            />
            <Field label="Patient Age" value="0" />
            <SelectField
              label="Sex"
              value={sex}
              options={["Male", "Female"]}
              onChange={setSex}
            />
            <SelectField
              label="Suspected Drug"
              value={drug}
              options={DRUG_OPTIONS}
              searchable
              onChange={setDrug}
            />
            <Field label="Dosage" value="" placeholder="e.g 500mg 1 tab" />
            <Field label="Date of reaction" value="12/12/2020" readOnly />
            <Field
              label="Stop Date (if applicable)"
              value="12/12/2020"
              readOnly
            />
            <Field label="Reaction Type" value="" placeholder="e.g. Rash, Fever" />
            <SelectField
              label="Severity"
              value={severity}
              options={["Mild", "Moderate", "Severe"]}
              onChange={setSeverity}
            />
          </div>
          <textarea
            className="mt-6 h-40 w-full max-w-[770px] resize-none rounded-md border border-[#D1D5DB] px-4 py-3 text-base outline-none placeholder:text-[#A7ADB5]"
            placeholder="Detailed symptoms"
            aria-label="Description"
          />

          <div className="mt-8 flex max-w-[770px] flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onBack}
              className="h-14 rounded-lg bg-[#C1C4CE] px-16 text-xl font-medium text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-14 rounded-lg bg-[#046C3F] px-10 text-xl font-medium text-white"
            >
              Report Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdverseEvents() {
  const [mode, setMode] = useState<Mode>("list");
  const [rows, setRows] = useState(ADVERSE_EVENTS);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [severity, setSeverity] = useState("All Severity");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [toast, setToast] = useState(false);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !term ||
        [row.reportId, row.patientName, row.drug, row.reaction, row.reportedBy]
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesStatus = status === "All Status" || row.status === status;
      const matchesSeverity =
        severity === "All Severity" || row.severity === severity;
      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [rows, search, status, severity]);

  const submitEvent = () => {
    setRows((current) => [
      {
        reportId: "ADR-PLT-000234",
        patientName: "John Eze",
        drug: "Amoxicillin",
        reaction: "Vomiting",
        reportedBy: "Festus Gilbert",
        severity: "Severe",
        date: "26 May 2026",
        status: "Reported",
      },
      ...current,
    ]);
    setMode("list");
    setToast(true);
    window.setTimeout(() => setToast(false), 3000);
  };

  if (mode === "report") {
    return <ReportEvent onBack={() => setMode("list")} onSubmit={submitEvent} />;
  }

  const columns: ColumnDef<AdverseEventRow>[] = [
    { header: "Report ID", accessorKey: "reportId", sortable: true },
    { header: "Patient", accessorKey: "patientName", sortable: true },
    { header: "Drug", accessorKey: "drug", sortable: true },
    { header: "Reaction", accessorKey: "reaction", sortable: true },
    { header: "Reported By", accessorKey: "reportedBy", sortable: true },
    {
      header: "Severity",
      sortable: true,
      render: (row) => badge(row.severity),
    },
    { header: "Date", accessorKey: "date", sortable: true },
    {
      header: "Status",
      sortable: true,
      render: (row) => badge(row.status),
    },
    {
      header: "Action",
      sortable: true,
      render: (row) => {
        const rowIndex = rows.indexOf(row);
        return (
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === rowIndex ? null : rowIndex)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
              aria-label="Adverse event actions"
            >
              <MoreHorizontal size={18} />
            </button>
            {openMenu === rowIndex && (
              <div className="absolute right-0 top-9 z-30 w-44 rounded border border-gray-200 bg-white p-3 shadow-xl">
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    setViewOpen(true);
                  }}
                  className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-gray-700 hover:bg-gray-50"
                >
                  <Eye size={18} /> View
                </button>
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    setMode("report");
                  }}
                  className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-gray-700 hover:bg-gray-50"
                >
                  <Edit3 size={18} /> Edit
                </button>
                <button className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-gray-700 hover:bg-gray-50">
                  <Download size={18} /> Export
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Adverse Events"
        breadcrumbs={[{ label: "Adverse Events" }]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
              Adverse Drug Reactions
            </h1>
            <p className="text-base text-[#3F3F46]">
              Report and review ADR cases
            </p>
          </div>
          <button
            onClick={() => setMode("report")}
            className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-6 text-white"
          >
            <Plus size={18} />
            Report New Event
          </button>
        </div>

        <DataTable
          title="Adverse Event"
          data={filteredRows}
          columns={columns}
          showSearch
          searchPlaceholder="Search by patient name or ID"
          onSearch={setSearch}
          toolbarActions={
            <>
              <DateRangeFilter
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
                options={["All Status", "Reported", "Pending", "Resolved"]}
                selected={status}
                onSelect={setStatus}
              />
              <CustomDropdown
                options={["All Severity", "Mild", "Moderate", "Severe"]}
                selected={severity}
                onSelect={setSeverity}
              />
            </>
          }
          totalPages={68}
          emptyMessage="No adverse events match your criteria."
        />
      </div>

      {viewOpen && (
        <AdverseEventView
          onClose={() => setViewOpen(false)}
          onEdit={() => {
            setViewOpen(false);
            setMode("report");
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-8 right-8 z-[80] flex w-[380px] max-w-[calc(100vw-2rem)] items-center gap-3 rounded border border-gray-200 bg-white p-4 shadow-xl">
          <span className="h-6 w-6 rounded-lg border border-[#9EE2BE] bg-[#DDF2EA]" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#111827]">
              Event Reported Successfully
            </p>
            <p className="text-sm text-[#475569]">Event reported for John Eze</p>
          </div>
          <button onClick={() => setToast(false)} aria-label="Close toast">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
