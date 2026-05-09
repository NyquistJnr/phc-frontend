"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, ChevronDown, MoreHorizontal, RefreshCcw, Search } from "lucide-react";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { DataTable, ColumnDef } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";

type ReferralStatus = "Accepted" | "Pending" | "Rejected";
type ReferralTab = "history" | "create";

type ReferralRow = {
  referralId: string;
  patientId: string;
  patientName: string;
  referringFacility: string;
  receivingFacility: string;
  referralType: string;
  reason: string;
  date: string;
  dateValue: string;
  status: ReferralStatus;
};

type ReferralFormState = {
  patientName: string;
  referralId: string;
  encounterId: string;
  referralDate: string;
  referringFacility: string;
  receivingFacility: string;
  referralType: string;
  reason: string;
  clinicalSummary: string;
};

const STATUS_OPTIONS = ["All Status", "Accepted", "Pending", "Rejected"];
const FACILITY_OPTIONS = [
  "State General Hospital",
  "General Clinic",
  "General Hospital",
  "Ikeja PHC Centre",
  "Surulere Primary Health Centre",
  "Mainland Specialist Hospital",
  "Alimosho General Hospital",
  "Eti-Osa Maternal Centre",
];
const REFERRAL_TYPE_OPTIONS = [
  "Physical referral",
  "Telemedicine referral",
  "Emergency",
  "Specialist consultation",
];

const INITIAL_FORM: ReferralFormState = {
  patientName: "",
  referralId: "PAT-PLT-000234",
  encounterId: "ENC-PLT-000234",
  referralDate: "2020-12-12",
  referringFacility: "",
  receivingFacility: "",
  referralType: "",
  reason: "",
  clinicalSummary: "",
};

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
  "Accepted",
  "Rejected",
].map((status, index) => ({
  referralId: `REF-PLT-00023${index + 1}`,
  patientId: "PAT-PLT-000234",
  patientName: index % 3 === 0 ? "Emeka Dike" : index % 3 === 1 ? "Amina Bello" : "Ngozi Eze",
  referringFacility: index % 2 === 0 ? "General Clinic" : "Ikeja PHC Centre",
  receivingFacility: index % 2 === 0 ? "General Hospital" : "State General Hospital",
  referralType: index % 3 === 0 ? "Physical referral" : index % 3 === 1 ? "Telemedicine referral" : "Emergency",
  reason: index % 4 === 0 ? "Severe malaria" : index % 4 === 1 ? "High fever" : index % 4 === 2 ? "ANC specialist review" : "Emergency review",
  date: "12 Mar 2026",
  dateValue: "2026-03-12",
  status: status as ReferralStatus,
}));

const statusColors: Record<ReferralStatus, { bg: string; text: string }> = {
  Accepted: { bg: "#DFF3EA", text: "#039855" },
  Pending: { bg: "#FFF4E5", text: "#1F2937" },
  Rejected: { bg: "#FDE8E8", text: "#F33131" },
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
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F] ${className}`}>
      <label className="block text-xs text-[#62636C] mb-1">{label}</label>
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
}: {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
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
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
      >
        <span className="block text-xs text-[#62636C] mb-1">{label}</span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span className={value ? "text-gray-700" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <ChevronDown size={20} className={`text-gray-800 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
          <div className="relative mb-3">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="h-11 w-full rounded-lg border border-gray-300 pl-12 pr-3 text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
            />
          </div>
          <div className="max-h-72 overflow-y-auto pr-1">
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-4 text-sm text-gray-400">No options found.</p>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setSearch("");
                    setOpen(false);
                  }}
                  className={`block w-full rounded-md px-3 py-3 text-left text-sm transition-colors ${
                    value === option
                      ? "bg-[#E8F7F0] text-[#046C3F] font-semibold"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateReferralForm({
  form,
  error,
  onChange,
  onCancel,
  onSubmit,
}: {
  form: ReferralFormState;
  error: string;
  onChange: (field: keyof ReferralFormState, value: string) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 sm:px-6 lg:px-8 py-7">
      <div className="flex items-center gap-3 mb-8">
        <RefreshCcw size={21} className="text-[#046C3F]" />
        <h2 className="text-xl font-semibold text-black">New Referral</h2>
      </div>

      <div className="max-w-4xl space-y-6">
        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldShell label="Patient Name">
            <div className="flex items-center gap-3">
              <Search size={24} className="text-gray-900 shrink-0" />
              <input
                value={form.patientName}
                onChange={(event) => onChange("patientName", event.target.value)}
                placeholder="Search patient by name or ID"
                className="w-full bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
              />
            </div>
          </FieldShell>

          <FieldShell label="Referral ID">
            <input
              value={form.referralId}
              readOnly
              className="w-full bg-transparent text-base text-gray-400 outline-none"
            />
          </FieldShell>

          <FieldShell label="Encounter ID">
            <div className="flex items-center gap-3">
              <Search size={24} className="text-gray-900 shrink-0" />
              <input
                value={form.encounterId}
                readOnly
                className="w-full bg-transparent text-base text-gray-400 outline-none"
              />
            </div>
          </FieldShell>

          <FieldShell label="Referral Date">
            <div className="flex items-center gap-3">
              <CalendarDays size={22} className="text-gray-500 shrink-0" />
              <input
                value={form.referralDate}
                onChange={(event) => onChange("referralDate", event.target.value)}
                type="date"
                className="w-full bg-transparent text-base text-gray-400 outline-none"
              />
            </div>
          </FieldShell>

          <SearchableSelect
            label="Referring facility"
            placeholder="Select facility"
            options={FACILITY_OPTIONS}
            value={form.referringFacility}
            onChange={(value) => onChange("referringFacility", value)}
          />

          <SearchableSelect
            label="Receiving Facility"
            placeholder="Select facility"
            options={FACILITY_OPTIONS}
            value={form.receivingFacility}
            onChange={(value) => onChange("receivingFacility", value)}
          />
        </div>

        <SearchableSelect
          label="Referral Type"
          placeholder="Select one"
          options={REFERRAL_TYPE_OPTIONS}
          value={form.referralType}
          onChange={(value) => onChange("referralType", value)}
        />

        <FieldShell label="Reason for Referral" className="py-2">
          <textarea
            value={form.reason}
            onChange={(event) => onChange("reason", event.target.value)}
            placeholder="Reason..."
            rows={6}
            className="w-full resize-none bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </FieldShell>

        <FieldShell label="Clinical Summary (Optional)" className="py-2">
          <textarea
            value={form.clinicalSummary}
            onChange={(event) => onChange("clinicalSummary", event.target.value)}
            placeholder="Additional notes / observations"
            rows={5}
            className="w-full resize-none bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </FieldShell>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="h-14 px-12 rounded-xl bg-[#B9BDC9] text-white text-lg font-medium hover:bg-[#A9AEBC] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-14 px-8 rounded-xl bg-[#046C3F] text-white text-lg font-medium hover:bg-[#035a34] transition-colors"
          >
            Submit Referral
          </button>
        </div>
      </div>
    </form>
  );
}

export default function Referrals() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ReferralTab>("history");
  const [referrals, setReferrals] = useState<ReferralRow[]>(INITIAL_REFERRALS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [form, setForm] = useState<ReferralFormState>(INITIAL_FORM);
  const [formError, setFormError] = useState("");

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10;

  const filteredReferrals = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return referrals.filter((referral) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          referral.referralId,
          referral.patientId,
          referral.patientName,
          referral.referringFacility,
          referral.receivingFacility,
          referral.reason,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchesStatus =
        statusFilter === "All Status" || referral.status === statusFilter;
      const matchesStart = !startDate || referral.dateValue >= startDate;
      const matchesEnd = !endDate || referral.dateValue <= endDate;

      return matchesSearch && matchesStatus && matchesStart && matchesEnd;
    });
  }, [endDate, referrals, searchTerm, startDate, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReferrals.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedReferrals = filteredReferrals.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

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
      render: (row) => (
        <button
          type="button"
          onClick={() => console.log("Referral action", row.referralId)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label={`Open actions for ${row.referralId}`}
        >
          <MoreHorizontal size={18} />
        </button>
      ),
    },
  ];

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setFormError("");
  };

  const handleCancel = () => {
    resetForm();
    setActiveTab("history");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.patientName.trim() ||
      !form.referringFacility ||
      !form.receivingFacility ||
      !form.referralType ||
      !form.reason.trim()
    ) {
      setFormError("Please complete all required referral fields.");
      return;
    }

    const newReferral: ReferralRow = {
      referralId: `REF-PLT-${String(referrals.length + 235).padStart(6, "0")}`,
      patientId: "PAT-PLT-000234",
      patientName: form.patientName.trim(),
      referringFacility: form.referringFacility,
      receivingFacility: form.receivingFacility,
      referralType: form.referralType,
      reason: form.reason.trim(),
      date: formatDateValue(form.referralDate),
      dateValue: form.referralDate,
      status: "Pending",
    };

    setReferrals((current) => [newReferral, ...current]);
    resetForm();
    setActiveTab("history");
  };

  const emptyMessage =
    referrals.length === 0
      ? "No referrals found."
      : "No referrals match your criteria.";

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Referrals"
        breadcrumbs={[
          { label: "Referrals" },
          {
            label:
              activeTab === "history" ? "Referrals History" : "Create Referrals",
          },
        ]}
      />

      <div className="px-4 sm:px-6 py-6 lg:py-8">
        {activeTab === "create" && (
          <NurseBackButton onClick={() => setActiveTab("history")} />
        )}

        <div className="mb-7">
          <h2 className="mb-1 text-2xl sm:text-3xl font-semibold text-black">
            Referrals
          </h2>
          <p className="text-base text-[#3F3F46]">
            Create and track patient referrals
          </p>
        </div>

        <div className="mb-6 grid w-full max-w-[400px] grid-cols-2 overflow-hidden rounded-lg bg-[#EEF5F3]">
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`h-10 px-4 text-sm sm:text-base font-medium transition-colors ${
              activeTab === "history"
                ? "bg-[#046C3F] text-white"
                : "text-gray-400 hover:text-[#046C3F]"
            }`}
          >
            Referral History
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`h-10 px-4 text-sm sm:text-base font-medium transition-colors ${
              activeTab === "create"
                ? "bg-[#046C3F] text-white"
                : "text-gray-400 hover:text-[#046C3F]"
            }`}
          >
            Create Referral
          </button>
        </div>

        {activeTab === "history" ? (
          <DataTable
            title="Patient Referrals"
            data={paginatedReferrals}
            columns={columns}
            showSearch
            searchPlaceholder="Search by patient name or ID..."
            onSearch={setSearchTerm}
            totalPages={filteredReferrals.length > itemsPerPage ? totalPages : undefined}
            emptyMessage={emptyMessage}
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
                  options={STATUS_OPTIONS}
                  selected={statusFilter}
                  onSelect={setStatusFilter}
                />
              </>
            }
          />
        ) : (
          <CreateReferralForm
            form={form}
            error={formError}
            onChange={(field, value) => {
              setForm((current) => ({ ...current, [field]: value }));
              setFormError("");
            }}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
