"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  Save,
  Search,
  Shield,
  Loader2,
  X,
  CheckCircle,
  Stethoscope,
} from "lucide-react";

import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";

import { useCreatePncVisit } from "@/src/hooks/nurses/use-anc-pnc";
import { useAppointments } from "@/src/hooks/nurses/use-appointments";

const INITIAL_FORM = {
  appointment: "",
  attendance_type: "",
  timing_of_visit: "",
  vaginal_examination_conducted: "",
  hemoglobin_pcv: "",
  urinalysis: "",
  counselling_topics: "",
  outcome: "",
  referral_reason: "",
};

const YES_NO_OPTIONS = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const ATTENDANCE_OPTIONS = [
  { label: "New (N)", value: "NEW" },
  { label: "Return (R)", value: "RETURN" },
];

const FORM_OUTCOME_OPTIONS = [
  { label: "Treated", value: "TREATED" },
  { label: "Admitted", value: "ADMITTED" },
  { label: "Referred", value: "REFERRED" },
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
  placeholder = "Select Option",
  options,
  value,
  disabled = false,
  onChange,
}: {
  label: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
          <svg
            className={`h-5 w-5 text-gray-800 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-300 bg-white p-2 shadow-sm">
          <div className="max-h-60 overflow-y-auto pr-1">
            {options.map((option, index) => {
              const selected = value === option.value;
              return (
                <button
                  key={`${option.value}-${index}`}
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

function SuccessToast({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex w-[min(390px,calc(100vw-2rem))] items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
      <span className="h-12 w-1 rounded-full bg-[#039855]" />
      <span className="h-6 w-6 flex items-center justify-center rounded-lg border border-[#A8E6C4] bg-[#E8F7F0] text-[#039855]">
        <CheckCircle size={14} />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">PNC Visit Saved</p>
        <p className="text-sm text-gray-600">
          The postnatal record has been successfully saved.
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

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="mb-6 mt-8 flex items-center gap-3">
    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BCAB4] text-[#046C3F]">
      <Icon size={18} />
    </span>
    <h2 className="text-xl font-semibold text-black">{title}</h2>
  </div>
);

export default function PncVisitForm() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const episodeId = segments[3];

  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const [appointmentDisplay, setAppointmentDisplay] = useState("");
  const [appointmentSearchTerm, setAppointmentSearchTerm] = useState("");
  const [showAppointmentDropdown, setShowAppointmentDropdown] = useState(false);
  const appointmentRef = useRef<HTMLDivElement>(null);

  const { data: appointmentsData, isFetching: isLoadingAppointments } =
    useAppointments({
      page: 1,
      page_size: 10,
      search: appointmentSearchTerm,
    });
  const appointments = appointmentsData?.results || [];

  const { mutate: createPncVisit, isPending: isCreating } = useCreatePncVisit();

  useEffect(() => {
    const handler = setTimeout(() => {
      setAppointmentSearchTerm(appointmentDisplay);
    }, 800);
    return () => clearTimeout(handler);
  }, [appointmentDisplay]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        appointmentRef.current &&
        !appointmentRef.current.contains(event.target as Node)
      ) {
        setShowAppointmentDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field: keyof typeof INITIAL_FORM, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleCancel = () => {
    router.push(`/doctor-dashboard/maternal-care/${episodeId}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.appointment || !form.attendance_type || !form.outcome) {
      setFormError(
        "Please complete all required fields (Appointment, Attendance Type, Outcome).",
      );
      return;
    }

    const payload = {
      episode: episodeId,
      appointment: form.appointment,
      attendance_type: form.attendance_type,
      timing_of_visit: form.timing_of_visit,
      vaginal_examination_conducted:
        form.vaginal_examination_conducted === "true",
      hemoglobin_pcv: form.hemoglobin_pcv,
      urinalysis: form.urinalysis,
      counselling_topics: form.counselling_topics,
      outcome: form.outcome,
      referral_reason: form.referral_reason,
    };

    createPncVisit(payload, {
      onSuccess: () => {
        setToastVisible(true);
        setTimeout(() => {
          router.push(`/doctor-dashboard/maternal-care/${episodeId}`);
        }, 2000);
      },
      onError: (error: any) => {
        setFormError(
          error?.response?.data?.message ||
            "Failed to save PNC visit. Please try again.",
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="PNC Visit"
        breadcrumbs={[
          {
            label: "Maternal Care",
            href: `/doctor-dashboard/maternal-care/${episodeId}`,
          },
          { label: "Record PNC Visit" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton onClick={handleCancel} />

        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            Record New PNC Visit
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl space-y-8">
            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}
            <div>
              <SectionHeader
                icon={Stethoscope}
                title="Visit & Attendance Details"
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div ref={appointmentRef} className="relative z-20">
                  <FieldShell label="Search Linked Appointment *">
                    <div className="flex items-center gap-3">
                      <Search size={20} className="shrink-0 text-gray-400" />
                      <input
                        value={appointmentDisplay}
                        onChange={(e) => {
                          setAppointmentDisplay(e.target.value);
                          if (form.appointment) handleChange("appointment", "");
                          setShowAppointmentDropdown(true);
                        }}
                        onFocus={() => setShowAppointmentDropdown(true)}
                        placeholder="Search by date or type"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                      {isLoadingAppointments && (
                        <Loader2
                          size={16}
                          className="animate-spin text-gray-400"
                        />
                      )}
                    </div>
                  </FieldShell>

                  {showAppointmentDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-300 bg-white p-2 shadow-lg">
                      {appointments.length > 0 ? (
                        appointments.map((apt: any) => (
                          <button
                            key={apt.id}
                            type="button"
                            onClick={() => {
                              handleChange("appointment", apt.id);
                              setAppointmentDisplay(
                                `${apt.appointment_date} - ${apt.visit_type || "Routine"}`,
                              );
                              setShowAppointmentDropdown(false);
                            }}
                            className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50"
                          >
                            <div className="font-medium text-gray-900">
                              {apt.patient_name || "PatientName"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {apt.appointment_date || "Date"} • ID:{" "}
                              {apt.appointment_id}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          {isLoadingAppointments
                            ? "Searching..."
                            : "No appointments found"}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative z-10">
                  <FieldShell label="Appointment ID">
                    <input
                      value={form.appointment}
                      readOnly
                      placeholder="Auto-filled on selection"
                      className="w-full bg-transparent text-base text-gray-400 outline-none"
                    />
                  </FieldShell>
                </div>

                <div className="relative z-10">
                  <SelectField
                    label="Attendance Type *"
                    options={ATTENDANCE_OPTIONS}
                    value={form.attendance_type}
                    onChange={(value) => handleChange("attendance_type", value)}
                  />
                </div>

                <FieldShell label="Timing of Visit">
                  <input
                    value={form.timing_of_visit}
                    onChange={(e) =>
                      handleChange("timing_of_visit", e.target.value)
                    }
                    placeholder="e.g., 4-7 days / >7 days"
                    className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </FieldShell>
              </div>
            </div>

            <hr className="border-gray-100" />
            <div>
              <SectionHeader icon={Heart} title="Clinical Assessment" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <SelectField
                  label="Vaginal Examination Conducted"
                  options={YES_NO_OPTIONS}
                  value={form.vaginal_examination_conducted}
                  onChange={(value) =>
                    handleChange("vaginal_examination_conducted", value)
                  }
                />

                <FieldShell label="Haemoglobin / PCV">
                  <input
                    value={form.hemoglobin_pcv}
                    onChange={(e) =>
                      handleChange("hemoglobin_pcv", e.target.value)
                    }
                    placeholder="Enter result"
                    className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </FieldShell>

                <div className="md:col-span-2">
                  <FieldShell label="Urinalysis">
                    <input
                      value={form.urinalysis}
                      onChange={(e) =>
                        handleChange("urinalysis", e.target.value)
                      }
                      placeholder="Enter urinalysis results"
                      className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>
                </div>

                <div className="md:col-span-2">
                  <FieldShell label="Counselling Topics Discussed">
                    <textarea
                      value={form.counselling_topics}
                      onChange={(e) =>
                        handleChange("counselling_topics", e.target.value)
                      }
                      rows={3}
                      placeholder="e.g., Nutrition, FGM, Family Planning, Infection Prevention..."
                      className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>
                </div>
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <SectionHeader icon={Shield} title="Outcome & Referrals" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <SelectField
                  label="Outcome *"
                  options={FORM_OUTCOME_OPTIONS}
                  value={form.outcome}
                  onChange={(value) => handleChange("outcome", value)}
                />

                <div className="md:col-span-2">
                  <FieldShell label="Referral Reason (If Referred)">
                    <textarea
                      value={form.referral_reason}
                      onChange={(e) =>
                        handleChange("referral_reason", e.target.value)
                      }
                      rows={3}
                      placeholder="Enter referral reason here if applicable..."
                      className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col items-stretch gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center">
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
                {isCreating ? "Saving..." : "Save PNC Visit"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
