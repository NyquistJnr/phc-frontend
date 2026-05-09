"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Baby,
  CalendarDays,
  ChevronDown,
  Loader2,
  Save,
  Search,
  X,
} from "lucide-react";

import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import { usePatients } from "@/src/hooks/nurses/use-patients";
import {
  useCreateImmunization,
  useVaccines,
} from "@/src/hooks/nurses/use-immunization";
import { RegistrationFormState } from "./type";

const INITIAL_FORM: RegistrationFormState = {
  sessionType: "",
  state: "",
  lga: "",
  ward: "",
  siteName: "",
  vaccineGivenId: "",
  dateOfVisit: new Date().toISOString().split("T")[0],
  notes: "",
  patientSearchInput: "",
  patientId: "",
  patientDisplayId: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  sex: "",
  nextOfKinName: "",
  nextOfKinPhone: "",
};

const SESSION_TYPES = [
  { label: "Fixed", value: "FIXED" },
  { label: "Outreach", value: "OUTREACH" },
  { label: "Mobile", value: "MOBILE" },
];

const SEX_OPTIONS = [
  { label: "Male", value: "M" },
  { label: "Female", value: "F" },
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
  searchable = false,
  isLoading = false,
  onChange,
  onSearchChange,
}: {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string;
  searchable?: boolean;
  isLoading?: boolean;
  onChange: (value: string) => void;
  onSearchChange?: (term: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const displayOptions = onSearchChange
    ? options
    : options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      );

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node))
        setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearch(term);
    if (onSearchChange) onSearchChange(term);
  };

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
          {searchable && (
            <div className="relative mb-3 flex items-center">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900"
              />
              <input
                value={search}
                onChange={handleSearch}
                placeholder="Search..."
                className="h-11 w-full rounded-lg border border-gray-300 pl-12 pr-10 text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
              />
              {isLoading && (
                <Loader2
                  size={16}
                  className="absolute right-4 animate-spin text-gray-400"
                />
              )}
            </div>
          )}
          <div className="max-h-72 overflow-y-auto pr-1">
            {displayOptions.length > 0 ? (
              displayOptions.map((option, index) => {
                const selected = value === option.value;
                return (
                  <button
                    key={`${option.value}-${index}`}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setSearch("");
                      if (onSearchChange) onSearchChange("");
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
              })
            ) : (
              <div className="px-2 py-2 text-sm text-gray-500">
                {isLoading ? "Searching..." : "No results found"}
              </div>
            )}
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
        <p className="text-sm font-semibold text-gray-900">
          Immunization recorded
        </p>
        <p className="text-sm text-gray-600">
          The vaccine record has been successfully saved.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="border-l border-gray-100 pl-4 text-gray-900 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default function ImmunizationRegister() {
  const router = useRouter();
  const [form, setForm] = useState<RegistrationFormState>(INITIAL_FORM);
  const [patientMode, setPatientMode] = useState<"existing" | "new">(
    "existing",
  );
  const [formError, setFormError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState("");

  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const patientRef = useRef<HTMLDivElement>(null);

  const { data: patientsData, isFetching: isLoadingPatients } = usePatients({
    search: patientSearchTerm,
    page: 1,
    page_size: 10,
  });
  const { data: vaccinesData, isFetching: isLoadingVaccines } = useVaccines();
  const { mutate: createImmunization, isPending: isCreating } =
    useCreateImmunization();

  const patientsList = patientsData?.results || [];
  const vaccineOptions = (vaccinesData?.results || []).map((drug) => ({
    label: `${drug.name} (${drug.category})`,
    value: drug.id,
  }));

  const handleChange = <K extends keyof RegistrationFormState>(
    field: K,
    value: RegistrationFormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setPatientSearchTerm(form.patientSearchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [form.patientSearchInput]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        patientRef.current &&
        !patientRef.current.contains(event.target as Node)
      ) {
        setShowPatientDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.sessionType || !form.vaccineGivenId || !form.dateOfVisit) {
      setFormError(
        "Please complete all required immunization fields (Session, Vaccine, Date).",
      );
      return;
    }

    const payload: any = {
      session_type: form.sessionType,
      site_name: form.siteName,
      state: form.state,
      lga: form.lga,
      ward: form.ward,
      vaccine_given_id: form.vaccineGivenId,
      date_of_visit: form.dateOfVisit,
      notes: form.notes,
    };

    if (patientMode === "existing") {
      if (!form.patientId) {
        setFormError("Please search and select an existing patient.");
        return;
      }
      payload.patient_id = form.patientId;
    } else {
      if (!form.firstName || !form.lastName || !form.dateOfBirth || !form.sex) {
        setFormError(
          "Please complete the required new patient fields (Name, DOB, Sex).",
        );
        return;
      }
      payload.new_patient_data = {
        first_name: form.firstName,
        last_name: form.lastName,
        date_of_birth: form.dateOfBirth,
        sex: form.sex,
        next_of_kin_name: form.nextOfKinName,
        next_of_kin_phone: form.nextOfKinPhone,
      };
    }

    createImmunization(payload, {
      onSuccess: () => {
        setToastVisible(true);
        setTimeout(() => router.push("/nurse-dashboard/immunization"), 2000);
      },
      onError: (error: any) => {
        setFormError(
          error?.response?.data?.message ||
            "Failed to create immunization record. Please try again.",
        );
      },
    });
  };

  const handleCancel = () => router.push("/nurse-dashboard/immunization");

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Immunization"
        breadcrumbs={[
          { label: "Immunization", href: "/nurse-dashboard/immunization" },
          { label: "Register Child" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton onClick={handleCancel} />

        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            Register Child
          </h2>
          <p className="text-base text-[#3F3F46]">
            Track and manage child vaccinations per NPHCDA EPI schedule
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#046C3F] text-white">
              <Baby size={18} />
            </span>
            <h2 className="text-xl font-semibold text-black">Child Details</h2>
          </div>

          <div className="max-w-4xl space-y-8">
            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div className="flex gap-6 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  checked={patientMode === "existing"}
                  onChange={() => setPatientMode("existing")}
                  className="h-4 w-4 text-[#046C3F] focus:ring-[#046C3F]"
                />
                Existing Patient
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  checked={patientMode === "new"}
                  onChange={() => setPatientMode("new")}
                  className="h-4 w-4 text-[#046C3F] focus:ring-[#046C3F]"
                />
                New Patient
              </label>
            </div>

            {patientMode === "existing" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div ref={patientRef} className="relative z-20">
                  <FieldShell label="Search Patient">
                    <div className="flex items-center gap-3">
                      <Search size={24} className="shrink-0 text-gray-900" />
                      <input
                        value={form.patientSearchInput}
                        onChange={(e) => {
                          handleChange("patientSearchInput", e.target.value);
                          if (form.patientId) {
                            handleChange("patientId", "");
                            handleChange("patientDisplayId", "");
                          }
                          setShowPatientDropdown(true);
                        }}
                        onFocus={() => setShowPatientDropdown(true)}
                        placeholder="Search patient by name"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                      {isLoadingPatients && (
                        <Loader2
                          size={20}
                          className="animate-spin text-gray-400"
                        />
                      )}
                    </div>
                  </FieldShell>

                  {showPatientDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-300 bg-white p-2 shadow-lg">
                      {patientsList.length > 0 ? (
                        patientsList.map((patient: any) => (
                          <button
                            key={patient.id}
                            type="button"
                            onClick={() => {
                              handleChange("patientId", patient.id);
                              handleChange(
                                "patientDisplayId",
                                patient.profile?.patient_id || "",
                              );
                              handleChange(
                                "patientSearchInput",
                                `${patient.first_name} ${patient.last_name}`,
                              );
                              setShowPatientDropdown(false);
                            }}
                            className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50"
                          >
                            <div className="font-medium text-gray-900">
                              {patient.first_name} {patient.last_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {patient.profile?.patient_id || "N/A"}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          {isLoadingPatients
                            ? "Searching..."
                            : "No patients found"}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <FieldShell label="Selected Patient ID">
                  <input
                    value={form.patientDisplayId}
                    readOnly
                    placeholder="Auto-filled"
                    className="w-full bg-transparent text-base text-gray-400 outline-none"
                  />
                </FieldShell>
              </div>
            )}

            {patientMode === "new" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FieldShell label="First Name">
                  <input
                    value={form.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="w-full bg-transparent text-base outline-none"
                    placeholder="First Name"
                  />
                </FieldShell>
                <FieldShell label="Last Name">
                  <input
                    value={form.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="w-full bg-transparent text-base outline-none"
                    placeholder="Last Name"
                  />
                </FieldShell>
                <FieldShell label="Date of Birth">
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) =>
                      handleChange("dateOfBirth", e.target.value)
                    }
                    className="w-full bg-transparent text-base outline-none"
                  />
                </FieldShell>
                <SelectField
                  label="Sex"
                  placeholder="Select"
                  options={SEX_OPTIONS}
                  value={form.sex}
                  onChange={(val) => handleChange("sex", val)}
                />
                <FieldShell label="Next of Kin Name">
                  <input
                    value={form.nextOfKinName}
                    onChange={(e) =>
                      handleChange("nextOfKinName", e.target.value)
                    }
                    className="w-full bg-transparent text-base outline-none"
                    placeholder="NOK Name"
                  />
                </FieldShell>
                <FieldShell label="Next of Kin Phone">
                  <input
                    value={form.nextOfKinPhone}
                    onChange={(e) =>
                      handleChange("nextOfKinPhone", e.target.value)
                    }
                    className="w-full bg-transparent text-base outline-none"
                    placeholder="NOK Phone"
                  />
                </FieldShell>
              </div>
            )}

            <div className="mb-4 mt-8 flex items-center gap-3 border-t border-gray-100 pt-8">
              <h2 className="text-xl font-semibold text-black">
                Immunization Info
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SelectField
                label="Session Type"
                placeholder="Select"
                options={SESSION_TYPES}
                value={form.sessionType}
                onChange={(value) => handleChange("sessionType", value)}
              />
              <FieldShell label="State">
                <input
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="e.g. Lagos"
                  className="w-full bg-transparent text-base outline-none"
                />
              </FieldShell>
              <FieldShell label="LGA">
                <input
                  value={form.lga}
                  onChange={(e) => handleChange("lga", e.target.value)}
                  placeholder="e.g. Ikeja"
                  className="w-full bg-transparent text-base outline-none"
                />
              </FieldShell>
              <FieldShell label="Ward">
                <input
                  value={form.ward}
                  onChange={(e) => handleChange("ward", e.target.value)}
                  placeholder="e.g. Ward C"
                  className="w-full bg-transparent text-base outline-none"
                />
              </FieldShell>

              <FieldShell label="Site Name (Optional)">
                <input
                  value={form.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  placeholder="Only for Outreach / Mobile"
                  className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <SelectField
                label="Vaccine Given"
                placeholder={
                  isLoadingVaccines
                    ? "Loading vaccines..."
                    : "Search & Select Vaccine"
                }
                options={vaccineOptions}
                searchable
                isLoading={isLoadingVaccines}
                value={form.vaccineGivenId}
                onChange={(val) => handleChange("vaccineGivenId", val)}
              />

              <FieldShell label="Date of Visit">
                <div className="flex items-center gap-3">
                  <CalendarDays size={22} className="shrink-0 text-gray-500" />
                  <input
                    type="date"
                    value={form.dateOfVisit}
                    onChange={(e) =>
                      handleChange("dateOfVisit", e.target.value)
                    }
                    className="w-full bg-transparent text-base text-gray-700 outline-none"
                  />
                </div>
              </FieldShell>
            </div>

            <FieldShell label="Note (Optional)">
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Any relevant notes..."
                rows={4}
                className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
              />
            </FieldShell>

            <div className="flex flex-col items-stretch justify-end gap-4 pt-1 sm:flex-row sm:items-center">
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
                className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-8 text-lg font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-70"
              >
                {isCreating ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {isCreating ? "Saving..." : "Register Immunization"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
