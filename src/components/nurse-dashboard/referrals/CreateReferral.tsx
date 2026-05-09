"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, RefreshCcw, Search } from "lucide-react";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";

import { useAppointments } from "@/src/hooks/nurses/use-appointments";
import { useFacilities } from "@/src/hooks/useFacilities";
import { useCreateReferral } from "@/src/hooks/nurses/use-referrals";

type ReferralFormState = {
  appointment: string;
  receiving_facility: string;
  referral_type: string;
  reason_for_referral: string;
  clinical_summary: string;
};

const REFERRAL_TYPE_OPTIONS = [
  { label: "Physical", value: "PHYSICAL" },
  { label: "Telemedicine", value: "TELEMEDICINE" },
  { label: "Emergency", value: "EMERGENCY" },
];

const INITIAL_FORM: ReferralFormState = {
  appointment: "",
  receiving_facility: "",
  referral_type: "",
  reason_for_referral: "",
  clinical_summary: "",
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

  const handleFieldChange = (field: keyof ReferralFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    setFormError("");
    router.push("/nurse-dashboard/referrals");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.appointment ||
      !form.receiving_facility ||
      !form.referral_type ||
      !form.reason_for_referral.trim()
    ) {
      setFormError("Please complete all required fields.");
      return;
    }

    createReferral(form, {
      onSuccess: () => {
        setForm(INITIAL_FORM);
        router.push("/nurse-dashboard/referrals");
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
      <NurseDashboardHeader
        title="Referrals"
        breadcrumbs={[
          { label: "Referrals", href: "/nurse-dashboard/referrals" },
          { label: "Create Referral" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton
          onClick={() => router.push("/nurse-dashboard/referrals")}
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
            onClick={() => router.push("/nurse-dashboard/referrals")}
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
                label="Receiving Facility *"
                placeholder="Search facility"
                options={facilityOptions}
                value={form.receiving_facility}
                isLoading={isLoadingFacilities}
                onChange={(value) =>
                  handleFieldChange("receiving_facility", value)
                }
              />
            </div>

            <SearchableSelect
              label="Referral Type *"
              placeholder="Select referral type"
              options={REFERRAL_TYPE_OPTIONS}
              value={form.referral_type}
              onChange={(value) => handleFieldChange("referral_type", value)}
            />

            <FieldShell label="Reason for Referral *" className="py-2">
              <textarea
                value={form.reason_for_referral}
                onChange={(event) =>
                  handleFieldChange("reason_for_referral", event.target.value)
                }
                placeholder="Detailed reason for this referral..."
                rows={5}
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
                rows={4}
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
