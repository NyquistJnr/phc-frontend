"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Search,
  X,
  Loader2,
  UserPlus,
  User,
  MapPin,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import { useCreatePatient } from "@/src/hooks/nurses/use-patients";
import {
  useStates,
  useLgas,
  useWards,
} from "@/src/hooks/general/use-locations";
import { CreatePatientPayload } from "./type";

const SEX_OPTIONS = [
  { label: "Male", value: "M" },
  { label: "Female", value: "F" },
];

const BLOOD_GROUP_OPTIONS = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

const GENOTYPE_OPTIONS = [
  { label: "AA", value: "AA" },
  { label: "AS", value: "AS" },
  { label: "SS", value: "SS" },
  { label: "AC", value: "AC" },
  { label: "SC", value: "SC" },
];

const INSURANCE_STATUS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const INITIAL_FORM: CreatePatientPayload = {
  first_name: "",
  last_name: "",
  middle_name: "",
  email: "",
  phone_number: "",
  address: "",
  state: "",
  is_active: true,
  sex: "",
  date_of_birth: "",
  lga: "",
  ward: "",
  next_of_kin_name: "",
  next_of_kin_phone: "",
  insurance_status: "",
  insurance_provider: "",
  insurance_package: "",
  coverage_status: "",
  allergies: "",
  chronic_conditions: "",
  notes: "",
  blood_group: "",
  genotype: "",
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
  disabled = false,
}: {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string;
  searchable?: boolean;
  isLoading?: boolean;
  onChange: (value: string) => void;
  onSearchChange?: (term: string) => void;
  disabled?: boolean;
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
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F] ${disabled ? "cursor-not-allowed opacity-60 bg-gray-50" : ""}`}
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
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
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
                {isLoading ? "Loading data..." : "No results found"}
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
      <span className="h-6 w-6 flex items-center justify-center rounded-lg border border-[#A8E6C4] bg-[#E8F7F0] text-[#039855]">
        <UserPlus size={14} />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">
          Patient Registered
        </p>
        <p className="text-sm text-gray-600">
          Patient successfully added to the system.
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

export default function CreateNewPatient() {
  const router = useRouter();
  const [form, setForm] = useState<CreatePatientPayload>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const { mutate: createPatient, isPending: isCreating } = useCreatePatient();

  const { data: statesList = [], isLoading: isLoadingStates } = useStates();
  const { data: lgasList = [], isLoading: isLoadingLgas } = useLgas(
    form.state || "",
  );
  const { data: wardsList = [], isLoading: isLoadingWards } = useWards(
    form.state || "",
    form.lga || "",
  );

  const stateOptions = statesList.map((state: string) => ({
    label: state,
    value: state,
  }));
  const lgaOptions = lgasList.map((lga: string) => ({
    label: lga,
    value: lga,
  }));
  const wardOptions = wardsList.map((ward: string) => ({
    label: ward,
    value: ward,
  }));

  const handleChange = <K extends keyof CreatePatientPayload>(
    field: K,
    value: CreatePatientPayload[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleLocationChange = (
    field: "state" | "lga" | "ward",
    value: string,
  ) => {
    setFormError("");
    if (field === "state") {
      setForm((current) => ({ ...current, state: value, lga: "", ward: "" }));
    } else if (field === "lga") {
      setForm((current) => ({ ...current, lga: value, ward: "" }));
    } else {
      setForm((current) => ({ ...current, ward: value }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.first_name ||
      !form.last_name ||
      !form.phone_number ||
      !form.sex ||
      !form.date_of_birth
    ) {
      setFormError(
        "Please complete all required fields (First Name, Last Name, Phone, Sex, Date of Birth).",
      );
      return;
    }

    createPatient(form, {
      onSuccess: () => {
        setToastVisible(true);
        setTimeout(() => {
          router.push("/nurse-dashboard/patients");
        }, 2000);
      },
      onError: (error: any) => {
        setFormError(
          error?.response?.data?.message ||
            "Failed to register patient. Please try again.",
        );
      },
    });
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    router.push("/nurse-dashboard/patients");
  };

  const SectionHeader = ({
    icon: Icon,
    title,
  }: {
    icon: any;
    title: string;
  }) => (
    <div className="mb-6 mt-8 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BCAB4] text-[#046C3F]">
        <Icon size={18} />
      </span>
      <h2 className="text-xl font-semibold text-black">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Patients"
        breadcrumbs={[
          { label: "Patients", href: "/nurse-dashboard/patients" },
          { label: "Register New Patient" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton onClick={handleCancel} />

        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            Register New Patient
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl">
            {formError && (
              <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <SectionHeader icon={User} title="Personal Details" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldShell label="First Name *">
                <input
                  value={form.first_name || ""}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  placeholder="Enter first name"
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>
              <FieldShell label="Last Name *">
                <input
                  value={form.last_name || ""}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  placeholder="Enter last name"
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>
              <FieldShell label="Middle Name">
                <input
                  value={form.middle_name || ""}
                  onChange={(e) => handleChange("middle_name", e.target.value)}
                  placeholder="Enter middle name"
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>
              <FieldShell label="Date of Birth *">
                <input
                  value={form.date_of_birth || ""}
                  type="date"
                  onChange={(e) =>
                    handleChange("date_of_birth", e.target.value)
                  }
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>
              <SelectField
                label="Sex *"
                placeholder="Select biological sex"
                options={SEX_OPTIONS}
                value={form.sex || ""}
                onChange={(value) => handleChange("sex", value)}
              />
            </div>

            <SectionHeader icon={MapPin} title="Contact & Location" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldShell label="Phone Number *">
                <input
                  value={form.phone_number || ""}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="e.g. +234 800 000 0000"
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>
              <FieldShell label="Email Address">
                <input
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>

              <SelectField
                label="State"
                placeholder={isLoadingStates ? "Loading..." : "Select state"}
                options={stateOptions}
                value={form.state || ""}
                searchable
                isLoading={isLoadingStates}
                onChange={(value) => handleLocationChange("state", value)}
              />

              <SelectField
                label="LGA"
                placeholder={
                  !form.state
                    ? "Select state first"
                    : isLoadingLgas
                      ? "Loading..."
                      : "Select LGA"
                }
                options={lgaOptions}
                value={form.lga || ""}
                searchable
                isLoading={isLoadingLgas}
                disabled={!form.state}
                onChange={(value) => handleLocationChange("lga", value)}
              />

              <SelectField
                label="Ward"
                placeholder={
                  !form.lga
                    ? "Select LGA first"
                    : isLoadingWards
                      ? "Loading..."
                      : "Select Ward"
                }
                options={wardOptions}
                value={form.ward || ""}
                searchable
                isLoading={isLoadingWards}
                disabled={!form.lga}
                onChange={(value) => handleLocationChange("ward", value)}
              />

              <div className="md:col-span-1">
                <FieldShell label="Address">
                  <textarea
                    value={form.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Full residential address"
                    rows={2}
                    className="w-full resize-none bg-transparent text-base text-gray-700 outline-none"
                  />
                </FieldShell>
              </div>
            </div>

            <SectionHeader icon={UserPlus} title="Next of Kin" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldShell label="Next of Kin Name">
                <input
                  value={form.next_of_kin_name || ""}
                  onChange={(e) =>
                    handleChange("next_of_kin_name", e.target.value)
                  }
                  placeholder="Full name"
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>
              <FieldShell label="Next of Kin Phone">
                <input
                  value={form.next_of_kin_phone || ""}
                  onChange={(e) =>
                    handleChange("next_of_kin_phone", e.target.value)
                  }
                  placeholder="Phone number"
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>
            </div>

            <SectionHeader icon={HeartPulse} title="Medical Information" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SelectField
                label="Blood Group"
                placeholder="Select blood group"
                options={BLOOD_GROUP_OPTIONS}
                value={form.blood_group || ""}
                onChange={(value) => handleChange("blood_group", value)}
              />
              <SelectField
                label="Genotype"
                placeholder="Select genotype"
                options={GENOTYPE_OPTIONS}
                value={form.genotype || ""}
                onChange={(value) => handleChange("genotype", value)}
              />
              <div className="space-y-6 md:col-span-2">
                <FieldShell label="Allergies">
                  <textarea
                    value={form.allergies || ""}
                    onChange={(e) => handleChange("allergies", e.target.value)}
                    placeholder="List any known allergies"
                    rows={2}
                    className="w-full resize-none bg-transparent text-base text-gray-700 outline-none"
                  />
                </FieldShell>
                <FieldShell label="Chronic Conditions">
                  <textarea
                    value={form.chronic_conditions || ""}
                    onChange={(e) =>
                      handleChange("chronic_conditions", e.target.value)
                    }
                    placeholder="List any chronic conditions"
                    rows={2}
                    className="w-full resize-none bg-transparent text-base text-gray-700 outline-none"
                  />
                </FieldShell>
                <FieldShell label="Additional Notes">
                  <textarea
                    value={form.notes || ""}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Any additional medical notes"
                    rows={2}
                    className="w-full resize-none bg-transparent text-base text-gray-700 outline-none"
                  />
                </FieldShell>
              </div>
            </div>

            <SectionHeader icon={ShieldCheck} title="Insurance Information" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SelectField
                label="Insurance Status"
                placeholder="Select status"
                options={INSURANCE_STATUS}
                value={form.insurance_status || ""}
                onChange={(value) => handleChange("insurance_status", value)}
              />
              <FieldShell label="Insurance Provider">
                <input
                  value={form.insurance_provider || ""}
                  onChange={(e) =>
                    handleChange("insurance_provider", e.target.value)
                  }
                  placeholder="e.g. Hygeia, Reliance"
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>
              <FieldShell label="Insurance Package">
                <input
                  value={form.insurance_package || ""}
                  onChange={(e) =>
                    handleChange("insurance_package", e.target.value)
                  }
                  placeholder="Package name"
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>
              <FieldShell label="Coverage Status">
                <input
                  value={form.coverage_status || ""}
                  onChange={(e) =>
                    handleChange("coverage_status", e.target.value)
                  }
                  placeholder="e.g. Full, Partial"
                  className="w-full bg-transparent text-base text-gray-700 outline-none"
                />
              </FieldShell>
            </div>

            <div className="mt-10 flex flex-col items-stretch gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
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
                  <UserPlus size={20} />
                )}
                {isCreating ? "Registering..." : "Register Patient"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
