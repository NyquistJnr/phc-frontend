"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, RefreshCcw, Search } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import { useAppointments } from "@/src/hooks/nurses/use-appointments";
import { useFacilities } from "@/src/hooks/useFacilities";
import {
  useCreateReferral,
  useDepartments,
} from "@/src/hooks/nurses/use-referrals";

type ReferralFormState = {
  appointment: string;
  destination_level: string;
  referral_type: string;
  mode_of_transportation: string;
  reason_for_referral: string;
  clinical_summary: string;

  // Primary Specific
  receiving_facility: string;
  receiving_department: string;

  // Secondary/Tertiary Specific
  mode_of_referral: string;
  target_doctor_email: string;
  target_department_email: string;
  email_subject: string;
  email_body: string;
};

const REFERRAL_TYPE_OPTIONS = [
  { label: "Physical", value: "PHYSICAL" },
  { label: "Telemedicine", value: "TELEMEDICINE" },
  { label: "Emergency", value: "EMERGENCY" },
];

const DESTINATION_LEVEL_OPTIONS = [
  { label: "Primary Health Care (Internal)", value: "PRIMARY" },
  { label: "Secondary Health Care", value: "SECONDARY" },
  { label: "Higher Health Care", value: "HIGHER" },
  { label: "Other", value: "OTHER" },
];

const TRANSPORT_MODE_OPTIONS = [
  { label: "Private Vehicle", value: "PRIVATE" },
  { label: "Ambulance", value: "AMBULANCE" },
  { label: "Public Transportation", value: "PUBLIC" },
  { label: "Other", value: "OTHER" },
];

const REFERRAL_MODE_OPTIONS = [
  { label: "Softcopy (Email/Digital)", value: "SOFTCOPY" },
  { label: "Hardcopy (Physical Document)", value: "HARDCOPY" },
];

const INITIAL_FORM: ReferralFormState = {
  appointment: "",
  destination_level: "",
  referral_type: "",
  mode_of_transportation: "",
  reason_for_referral: "",
  clinical_summary: "",
  receiving_facility: "",
  receiving_department: "",
  mode_of_referral: "",
  target_doctor_email: "",
  target_department_email: "",
  email_subject: "",
  email_body: "",
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
      className={`relative rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F] ${className}`}
    >
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
  isLoading = false,
}: {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedOption = options.find((opt) => opt.value === value);

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
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
      >
        <span className="mb-1 block text-xs text-[#62636C]">{label}</span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span
            className={
              selectedOption ? "text-gray-700 truncate" : "text-gray-400"
            }
          >
            {isLoading ? "Loading..." : selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-800 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
          <div className="relative mb-3">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="h-11 w-full rounded-lg border border-gray-300 pl-12 pr-3 text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
            />
          </div>
          <div className="max-h-72 overflow-y-auto pr-1">
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-4 text-sm text-gray-400">
                No options found.
              </p>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setSearch("");
                    setOpen(false);
                  }}
                  className={`block w-full rounded-md px-3 py-3 text-left text-sm transition-colors ${
                    value === option.value
                      ? "bg-[#E8F7F0] font-semibold text-[#046C3F]"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateReferral() {
  const router = useRouter();
  const [form, setForm] = useState<ReferralFormState>(INITIAL_FORM);
  const [formError, setFormError] = useState("");

  const { data: appointmentsData, isLoading: isLoadingAppointments } =
    useAppointments({ page_size: 100 });
  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useFacilities({ pageSize: 100, isActive: true });

  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useDepartments(form.receiving_facility);

  const { mutate: createReferral, isPending: isSubmitting } =
    useCreateReferral();

  const appointmentOptions = useMemo(() => {
    if (!appointmentsData?.results) return [];
    return appointmentsData.results.map((apt) => ({
      label: `${apt.patient_name} - ${apt.appointment_date} (${apt.visit_type})`,
      value: apt.id,
    }));
  }, [appointmentsData]);

  const facilityOptions = useMemo(() => {
    if (!facilitiesData?.results) return [];
    return facilitiesData.results.map((fac) => ({
      label: fac.name,
      value: fac.id,
    }));
  }, [facilitiesData]);

  const departmentOptions = useMemo(() => {
    if (!departmentsData?.results) return [];
    return departmentsData.results.map((dept: any) => ({
      label: dept.name,
      value: dept.id,
    }));
  }, [departmentsData]);

  const handleFieldChange = (field: keyof ReferralFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    setFormError("");
    router.push("/doctor-dashboard/referrals");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isTelemedicine = form.referral_type === "TELEMEDICINE";
    const isPrimary = form.destination_level === "PRIMARY";

    if (
      !form.appointment ||
      !form.destination_level ||
      !form.referral_type ||
      (!isTelemedicine && !form.mode_of_transportation) ||
      !form.reason_for_referral.trim()
    ) {
      setFormError("Please complete all required base fields.");
      return;
    }

    const payload = {
      appointment: form.appointment,
      destination_level: form.destination_level,
      referral_type: form.referral_type,
      mode_of_transportation: isTelemedicine
        ? null
        : form.mode_of_transportation,
      reason_for_referral: form.reason_for_referral,
      clinical_summary: form.clinical_summary,

      receiving_facility: null,

      receiving_department: isPrimary ? form.receiving_department : null,

      mode_of_referral: isPrimary ? null : form.mode_of_referral,
      target_doctor_email: isPrimary ? null : form.target_doctor_email,
      target_department_email: isPrimary ? null : form.target_department_email,
      email_subject: isPrimary ? "" : form.email_subject,
      email_body: isPrimary ? "" : form.email_body,
    };

    createReferral(payload, {
      onSuccess: () => {
        setForm(INITIAL_FORM);
        router.push("/doctor-dashboard/referrals");
      },
      onError: (error: any) => {
        setFormError(
          error?.response?.data?.message ||
            "Failed to create referral. Please try again.",
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Referrals"
        breadcrumbs={[
          { label: "Referrals", href: "/doctor-dashboard/referrals" },
          { label: "Create Referral" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton
          onClick={() => router.push("/doctor-dashboard/referrals")}
        />

        <div className="mb-7 mt-4">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            Referrals
          </h2>
          <p className="text-base text-[#3F3F46]">
            Create and track patient referrals
          </p>
        </div>

        <div className="mb-6 grid w-full max-w-[400px] grid-cols-2 overflow-hidden rounded-lg bg-[#EEF5F3]">
          <button
            type="button"
            onClick={() => router.push("/doctor-dashboard/referrals")}
            className="h-10 px-4 text-sm font-medium text-gray-400 transition-colors hover:text-[#046C3F] sm:text-base"
          >
            Referral History
          </button>
          <button
            type="button"
            className="h-10 bg-[#046C3F] px-4 text-sm font-medium text-white transition-colors sm:text-base"
          >
            Create Referral
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <RefreshCcw size={21} className="text-[#046C3F]" />
            <h2 className="text-xl font-semibold text-black">New Referral</h2>
          </div>

          <div className="max-w-4xl space-y-6">
            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SearchableSelect
                label="Select Appointment *"
                placeholder="Search by patient name"
                options={appointmentOptions}
                value={form.appointment}
                isLoading={isLoadingAppointments}
                onChange={(value) => handleFieldChange("appointment", value)}
              />

              <SearchableSelect
                label="Destination Level *"
                placeholder="Select level"
                options={DESTINATION_LEVEL_OPTIONS}
                value={form.destination_level}
                onChange={(value) =>
                  handleFieldChange("destination_level", value)
                }
              />

              <SearchableSelect
                label="Referral Type *"
                placeholder="Select type"
                options={REFERRAL_TYPE_OPTIONS}
                value={form.referral_type}
                onChange={(value) => handleFieldChange("referral_type", value)}
              />

              {form.referral_type !== "TELEMEDICINE" && (
                <SearchableSelect
                  label="Mode of Transportation *"
                  placeholder="Select transport mode"
                  options={TRANSPORT_MODE_OPTIONS}
                  value={form.mode_of_transportation}
                  onChange={(value) =>
                    handleFieldChange("mode_of_transportation", value)
                  }
                />
              )}
            </div>

            <hr className="my-6 border-gray-200" />

            {form.destination_level === "PRIMARY" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <SearchableSelect
                  label="Search Facility (To find department) *"
                  placeholder="Select facility"
                  options={facilityOptions}
                  value={form.receiving_facility}
                  isLoading={isLoadingFacilities}
                  onChange={(value) =>
                    handleFieldChange("receiving_facility", value)
                  }
                />

                <SearchableSelect
                  label="Receiving Department *"
                  placeholder="Select department"
                  options={departmentOptions}
                  value={form.receiving_department}
                  isLoading={isLoadingDepartments}
                  onChange={(value) =>
                    handleFieldChange("receiving_department", value)
                  }
                />
              </div>
            )}

            {form.destination_level && form.destination_level !== "PRIMARY" && (
              <div className="space-y-6">
                <SearchableSelect
                  label="Mode of Referral"
                  placeholder="Select mode"
                  options={REFERRAL_MODE_OPTIONS}
                  value={form.mode_of_referral}
                  onChange={(value) =>
                    handleFieldChange("mode_of_referral", value)
                  }
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FieldShell label="Target Doctor Email">
                    <input
                      type="email"
                      value={form.target_doctor_email}
                      onChange={(e) =>
                        handleFieldChange("target_doctor_email", e.target.value)
                      }
                      placeholder="dr.smith@example.com"
                      className="w-full bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
                    />
                  </FieldShell>

                  <FieldShell label="Target Department Email">
                    <input
                      type="email"
                      value={form.target_department_email}
                      onChange={(e) =>
                        handleFieldChange(
                          "target_department_email",
                          e.target.value,
                        )
                      }
                      placeholder="surgery@example.com"
                      className="w-full bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
                    />
                  </FieldShell>
                </div>

                <FieldShell label="Email Subject">
                  <input
                    type="text"
                    value={form.email_subject}
                    onChange={(e) =>
                      handleFieldChange("email_subject", e.target.value)
                    }
                    placeholder="Emergency Surgical Transfer..."
                    className="w-full bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
                  />
                </FieldShell>

                <FieldShell label="Email Body" className="py-2">
                  <textarea
                    value={form.email_body}
                    onChange={(e) =>
                      handleFieldChange("email_body", e.target.value)
                    }
                    placeholder="Provide details for the receiving end..."
                    rows={4}
                    className="w-full resize-none bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
                  />
                </FieldShell>
              </div>
            )}

            {form.destination_level && <hr className="my-6 border-gray-200" />}

            <FieldShell label="Reason for Referral *" className="py-2">
              <textarea
                value={form.reason_for_referral}
                onChange={(event) =>
                  handleFieldChange("reason_for_referral", event.target.value)
                }
                placeholder="Detailed reason for this referral..."
                rows={4}
                className="w-full resize-none bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
              />
            </FieldShell>

            <FieldShell label="Clinical Summary (Optional)" className="py-2">
              <textarea
                value={form.clinical_summary}
                onChange={(event) =>
                  handleFieldChange("clinical_summary", event.target.value)
                }
                placeholder="Additional notes, current medications, or observations"
                rows={3}
                className="w-full resize-none bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
              />
            </FieldShell>

            <div className="flex flex-col items-stretch justify-end gap-4 pt-1 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="h-14 rounded-xl bg-[#B9BDC9] px-12 text-lg font-medium text-white transition-colors hover:bg-[#A9AEBC] disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-14 rounded-xl bg-[#046C3F] px-8 text-lg font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Submit Referral"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
