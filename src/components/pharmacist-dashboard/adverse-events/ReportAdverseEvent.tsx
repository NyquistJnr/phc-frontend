"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ChevronDown,
  Loader2,
  Save,
  Search,
  X,
} from "lucide-react";

import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import PharmacistBackButton from "@/src/components/pharmacist-dashboard/generics/PharmacistBackButton";
import { useCreateAdverseEvent, useReportingStaff } from "@/src/hooks/pharmacist/use-adverse-events";
import { useInventoryDrugs } from "@/src/hooks/pharmacist/use-inventory";
import { usePatients } from "@/src/hooks/nurses/use-patients";
import type { Patient } from "@/src/components/nurse-dashboard/patients/type";
import type { AdverseEventSeverity, CreateAdverseEventPayload } from "./type";

const SEVERITY_OPTIONS: { label: string; value: AdverseEventSeverity }[] = [
  { label: "Mild", value: "MILD" },
  { label: "Moderate", value: "MODERATE" },
  { label: "Severe", value: "SEVERE" },
  { label: "Life-Threatening", value: "LIFE_THREATENING" },
  { label: "Fatal", value: "FATAL" },
];

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
    <div
      className={`relative flex flex-col justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F] ${className}`}
    >
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
  onChange,
}: {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          <span className={selectedLabel ? "text-gray-700" : "text-gray-400"}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-800 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
          <div className="max-h-60 overflow-y-auto pr-1">
            {options.map((option) => {
              const selected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-4 rounded-md px-2 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${selected ? "border-[#046C3F] bg-[#046C3F]" : "border-gray-300 bg-white"}`}
                  >
                    {selected && (
                      <span className="h-2.5 w-2.5 rounded-sm bg-white" />
                    )}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// A search-as-you-type combobox for picking a patient / drug / staff member
// by id while showing a human label — the payload only ever needs the id.
function SearchSelect({
  label,
  placeholder,
  searchPlaceholder,
  selectedLabel,
  searchTerm,
  onSearchTermChange,
  options,
  isLoading,
  onSelect,
  onClear,
  required,
}: {
  label: string;
  placeholder: string;
  searchPlaceholder?: string;
  selectedLabel: string;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  options: { value: string; label: string; sublabel?: string }[];
  isLoading?: boolean;
  onSelect: (value: string, label: string) => void;
  onClear: () => void;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasSearched = searchTerm.trim().length > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
      >
        <span className="mb-1 block text-xs text-[#62636C]">
          {label}
          {required ? " *" : ""}
        </span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span
            className={selectedLabel ? "truncate text-gray-700" : "text-gray-400"}
          >
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`shrink-0 text-gray-800 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-300 bg-white p-4 shadow-md">
          <div className="relative mb-3 flex items-center">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              autoFocus
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder={searchPlaceholder || "Type to search..."}
              className="h-11 w-full rounded-lg border border-gray-300 pl-11 pr-10 text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
            />
            {isLoading && (
              <Loader2
                size={16}
                className="absolute right-4 animate-spin text-gray-400"
              />
            )}
          </div>

          {selectedLabel && (
            <button
              type="button"
              onClick={() => {
                onClear();
                setOpen(false);
              }}
              className="mb-2 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm italic text-gray-500 hover:bg-gray-50"
            >
              <X size={14} /> Clear selection
            </button>
          )}

          <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
            {options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSelect(option.value, option.label);
                    setOpen(false);
                  }}
                  className="flex w-full flex-col items-start gap-0.5 rounded-md px-2 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="truncate font-medium">{option.label}</span>
                  {option.sublabel && (
                    <span className="text-xs text-gray-400">
                      {option.sublabel}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-2 py-3 text-sm text-gray-400">
                {isLoading
                  ? "Searching..."
                  : hasSearched
                    ? "No results found"
                    : "Start typing to search..."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handler);
  }, [value, delayMs]);
  return debounced;
}

export default function ReportAdverseEvent() {
  const router = useRouter();
  const { mutate: createAdverseEvent, isPending: isCreating } =
    useCreateAdverseEvent();

  const [formError, setFormError] = useState("");

  const [patientId, setPatientId] = useState("");
  const [patientLabel, setPatientLabel] = useState("");
  const [patientSearchInput, setPatientSearchInput] = useState("");
  const patientSearchTerm = useDebouncedValue(patientSearchInput, 500);

  const [drugId, setDrugId] = useState("");
  const [drugLabel, setDrugLabel] = useState("");
  const [drugSearchInput, setDrugSearchInput] = useState("");
  const drugSearchTerm = useDebouncedValue(drugSearchInput, 500);

  const [reportedById, setReportedById] = useState("");
  const [reportedByLabel, setReportedByLabel] = useState("");
  const [staffSearchInput, setStaffSearchInput] = useState("");
  const staffSearchTerm = useDebouncedValue(staffSearchInput, 500);

  const [dosage, setDosage] = useState("");
  const [dateOfReaction, setDateOfReaction] = useState("");
  const [stopDate, setStopDate] = useState("");
  const [reactionType, setReactionType] = useState("");
  const [severity, setSeverity] = useState<AdverseEventSeverity | "">("");
  const [detailedSymptoms, setDetailedSymptoms] = useState("");
  const [reportedComment, setReportedComment] = useState("");

  const { data: patientsData, isFetching: isLoadingPatients } = usePatients({
    search: patientSearchTerm,
    page_size: 10,
  });
  const patientOptions = (patientsData?.results || []).map((patient: Patient) => ({
    value: patient.id,
    label: `${patient.first_name} ${patient.last_name}`,
    sublabel: patient.profile?.patient_id || undefined,
  }));

  const { data: drugsData, isFetching: isLoadingDrugs } = useInventoryDrugs({
    search: drugSearchTerm,
  });
  const drugOptions = (drugsData?.results || []).map((drug) => ({
    value: drug.id,
    label: drug.name,
    sublabel: `${drug.total_stock} ${drug.item_type} in stock`,
  }));

  const { data: staffList = [], isFetching: isLoadingStaff } =
    useReportingStaff(staffSearchTerm);
  const staffOptions = staffList.map((staff) => ({
    value: staff.id,
    label: `${staff.first_name} ${staff.last_name}`,
    sublabel: staff.role || undefined,
  }));

  const handleCancel = () => {
    router.push("/pharmacist-dashboard/adverse-events");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !patientId ||
      !drugId ||
      !dosage.trim() ||
      !dateOfReaction ||
      !reactionType.trim() ||
      !severity ||
      !detailedSymptoms.trim()
    ) {
      setFormError(
        "Please complete all required fields: Patient, Suspected Drug, Dosage, Date of Reaction, Reaction Type, Severity, and Detailed Symptoms.",
      );
      return;
    }

    const payload: CreateAdverseEventPayload = {
      patient: patientId,
      suspected_drug: drugId,
      dosage: dosage.trim(),
      date_of_reaction: dateOfReaction,
      reaction_type: reactionType.trim(),
      severity,
      detailed_symptoms: detailedSymptoms.trim(),
      ...(reportedComment.trim() && { reported_comment: reportedComment.trim() }),
      ...(stopDate && { stop_date: stopDate }),
      ...(reportedById && { reported_by: reportedById }),
    };

    createAdverseEvent(payload, {
      onSuccess: (created) => {
        // The create response doesn't reliably include an id — fall back to
        // the list rather than risk landing on /adverse-events/undefined.
        if (created?.id) {
          router.push(`/pharmacist-dashboard/adverse-events/${created.id}`);
        } else {
          router.push("/pharmacist-dashboard/adverse-events");
        }
      },
      onError: (error: unknown) => {
        setFormError(
          error instanceof Error
            ? error.message
            : "Failed to report the adverse event. Please try again.",
        );
      },
    });
  };

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
        <PharmacistBackButton onClick={handleCancel} />

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-gray-100 bg-white px-5 py-8 shadow-sm sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FDE8E8] text-[#F33131]">
              <AlertTriangle size={20} />
            </span>
            <h1 className="text-2xl font-semibold text-black">
              Report New Adverse Event
            </h1>
          </div>

          <div className="max-w-[900px]">
            {formError && (
              <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SearchSelect
                label="Patient"
                placeholder="Search patient by name"
                searchPlaceholder="Type patient name..."
                selectedLabel={patientLabel}
                searchTerm={patientSearchInput}
                onSearchTermChange={setPatientSearchInput}
                options={patientOptions}
                isLoading={isLoadingPatients}
                required
                onSelect={(value, label) => {
                  setPatientId(value);
                  setPatientLabel(label);
                  setFormError("");
                }}
                onClear={() => {
                  setPatientId("");
                  setPatientLabel("");
                }}
              />

              <SearchSelect
                label="Suspected Drug"
                placeholder="Search drug inventory"
                searchPlaceholder="Type drug name..."
                selectedLabel={drugLabel}
                searchTerm={drugSearchInput}
                onSearchTermChange={setDrugSearchInput}
                options={drugOptions}
                isLoading={isLoadingDrugs}
                required
                onSelect={(value, label) => {
                  setDrugId(value);
                  setDrugLabel(label);
                  setFormError("");
                }}
                onClear={() => {
                  setDrugId("");
                  setDrugLabel("");
                }}
              />

              <FieldShell label="Dosage *">
                <input
                  value={dosage}
                  onChange={(e) => {
                    setDosage(e.target.value);
                    setFormError("");
                  }}
                  placeholder="e.g. 500mg BD"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Reaction Type *">
                <input
                  value={reactionType}
                  onChange={(e) => {
                    setReactionType(e.target.value);
                    setFormError("");
                  }}
                  placeholder="e.g. Skin Rash, Anaphylaxis, Nausea"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Date of Reaction *">
                <input
                  type="date"
                  value={dateOfReaction}
                  onChange={(e) => {
                    setDateOfReaction(e.target.value);
                    setFormError("");
                  }}
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>

              <FieldShell label="Stop Date (Optional)">
                <input
                  type="date"
                  value={stopDate}
                  onChange={(e) => setStopDate(e.target.value)}
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>

              <SelectField
                label="Severity *"
                placeholder="Select severity"
                options={SEVERITY_OPTIONS}
                value={severity}
                onChange={(value) => {
                  setSeverity(value as AdverseEventSeverity);
                  setFormError("");
                }}
              />

              <SearchSelect
                label="Reported By (Optional)"
                placeholder="Defaults to you — search only if filing on someone else's behalf"
                searchPlaceholder="Type staff name..."
                selectedLabel={reportedByLabel}
                searchTerm={staffSearchInput}
                onSearchTermChange={setStaffSearchInput}
                options={staffOptions}
                isLoading={isLoadingStaff}
                onSelect={(value, label) => {
                  setReportedById(value);
                  setReportedByLabel(label);
                }}
                onClear={() => {
                  setReportedById("");
                  setReportedByLabel("");
                }}
              />
            </div>

            <div className="mt-6">
              <FieldShell label="Detailed Symptoms *">
                <textarea
                  value={detailedSymptoms}
                  onChange={(e) => {
                    setDetailedSymptoms(e.target.value);
                    setFormError("");
                  }}
                  placeholder="Describe the reaction in detail..."
                  rows={4}
                  className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>
            </div>

            <div className="mt-6">
              <FieldShell label="Reported Comment (Optional)">
                <textarea
                  value={reportedComment}
                  onChange={(e) => setReportedComment(e.target.value)}
                  placeholder="Any additional comments upon reporting..."
                  rows={3}
                  className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>
            </div>

            <div className="mt-10 flex flex-col items-stretch gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCreating}
                className="h-14 rounded-xl bg-[#B9BDC9] px-12 text-lg font-medium text-white transition-colors hover:bg-[#A9AEBC] disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-10 text-lg font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-70"
              >
                {isCreating ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {isCreating ? "Reporting..." : "Report Event"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
