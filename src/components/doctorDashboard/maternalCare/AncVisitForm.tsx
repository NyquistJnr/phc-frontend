"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  CalendarDays,
  FlaskConical,
  Save,
  Shield,
  Stethoscope,
  Loader2,
  Search,
  X,
  CheckCircle,
} from "lucide-react";

import { useAppointments } from "@/src/hooks/nurses/use-appointments";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import {
  CreateAncVisitPayload,
  useCreateAncVisit,
} from "@/src/hooks/nurses/use-anc-pnc";

const ATTENDANCE_OPTIONS = [
  { label: "NEW", value: "NEW" },
  { label: "RETURN", value: "RETURN" },
];

const BOOLEAN_STATUS_OPTIONS = [
  { label: "Positive", value: "true" },
  { label: "Negative", value: "false" },
];

const YES_NO_OPTIONS = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const INITIAL_FORM = {
  attendance_type: "",
  appointment: "",
  hiv_status: "",
  vdrl_syphilis: "",
  hepatitis_b: "",
  hemoglobin: "",
  urinalysis: "",
  tt_dose_given: "",
  iptp_dose_given: "",
  iron_folate_given: "",
  risk_factors: "",
  notes: "",
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
  disabled = false,
  onChange,
}: {
  label: string;
  placeholder: string;
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
        <p className="text-sm font-semibold text-gray-900">ANC Visit Saved</p>
        <p className="text-sm text-gray-600">
          The visit details have been successfully recorded.
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

export default function CreateAncVisit() {
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

  const { mutate: createAncVisit, isPending: isCreating } = useCreateAncVisit();

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

  const handleChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.appointment || !form.attendance_type) {
      setFormError(
        "Please complete all required fields (Linked Appointment, Attendance Type).",
      );
      return;
    }

    const payload: CreateAncVisitPayload = {
      ...form,
      episode: episodeId,
      iron_folate_given: form.iron_folate_given === "true",
    };

    createAncVisit(payload, {
      onSuccess: () => {
        setToastVisible(true);
        setTimeout(() => {
          router.push(`/doctor-dashboard/maternal-care/${episodeId}`);
        }, 2000);
      },
      onError: (error: any) => {
        setFormError(
          error?.response?.data?.message ||
            "Failed to save ANC visit. Please try again.",
        );
      },
    });
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    router.push(`/doctor-dashboard/maternal-care/${episodeId}`);
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="ANC Visit"
        breadcrumbs={[
          { label: "Episodes", href: "/doctor-dashboard/maternal-care" },
          { label: "Log ANC Visit" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton onClick={handleCancel} />

        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            Record New ANC Visit
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
            <SectionHeader icon={Stethoscope} title="Visit Details" />
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
                  placeholder="Select Type"
                  options={ATTENDANCE_OPTIONS}
                  value={form.attendance_type}
                  onChange={(val) => handleChange("attendance_type", val)}
                />
              </div>
            </div>
            <SectionHeader
              icon={FlaskConical}
              title="Laboratory Investigations"
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SelectField
                label="HIV Status"
                options={BOOLEAN_STATUS_OPTIONS}
                placeholder="Select Status"
                value={form.hiv_status}
                onChange={(val) => handleChange("hiv_status", val)}
              />
              <SelectField
                label="VDRL (Syphilis)"
                options={BOOLEAN_STATUS_OPTIONS}
                placeholder="Select Status"
                value={form.vdrl_syphilis}
                onChange={(val) => handleChange("vdrl_syphilis", val)}
              />
              <SelectField
                label="Hepatitis B"
                options={BOOLEAN_STATUS_OPTIONS}
                placeholder="Select Status"
                value={form.hepatitis_b}
                onChange={(val) => handleChange("hepatitis_b", val)}
              />
              <FieldShell label="Hemoglobin (g/dL)">
                <input
                  value={form.hemoglobin}
                  onChange={(e) => handleChange("hemoglobin", e.target.value)}
                  placeholder="e.g. 4.67"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>
              <div className="md:col-span-2">
                <FieldShell label="Urinalysis">
                  <input
                    value={form.urinalysis}
                    onChange={(e) => handleChange("urinalysis", e.target.value)}
                    placeholder="Urinalysis results"
                    className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </FieldShell>
              </div>
            </div>
            <SectionHeader icon={Shield} title="Interventions" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FieldShell label="TT Dose Given (Date or Note)">
                <div className="flex items-center gap-3">
                  <CalendarDays size={20} className="shrink-0 text-gray-400" />
                  <input
                    value={form.tt_dose_given}
                    onChange={(e) =>
                      handleChange("tt_dose_given", e.target.value)
                    }
                    placeholder="Details"
                    className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </div>
              </FieldShell>

              <FieldShell label="IPTp Dose Given (Date or Note)">
                <div className="flex items-center gap-3">
                  <CalendarDays size={20} className="shrink-0 text-gray-400" />
                  <input
                    value={form.iptp_dose_given}
                    onChange={(e) =>
                      handleChange("iptp_dose_given", e.target.value)
                    }
                    placeholder="Details"
                    className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </div>
              </FieldShell>

              <SelectField
                label="Iron/Folate Given"
                options={YES_NO_OPTIONS}
                placeholder="Select"
                value={form.iron_folate_given}
                onChange={(val) => handleChange("iron_folate_given", val)}
              />
            </div>
            <SectionHeader icon={Stethoscope} title="Assessment & Notes" />
            <div className="space-y-6">
              <FieldShell label="Risk Factors">
                <textarea
                  value={form.risk_factors}
                  onChange={(e) => handleChange("risk_factors", e.target.value)}
                  rows={3}
                  placeholder="Record any risk factors here..."
                  className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Notes">
                <textarea
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={4}
                  placeholder="Additional clinical notes..."
                  className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>
            </div>
            <div className="mt-10 flex flex-col items-stretch gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center">
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
                {isCreating ? "Saving..." : "Save ANC Visit"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
