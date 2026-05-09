"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronDown, Clock, Search, X } from "lucide-react";

import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";

export type AppointmentFormState = {
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
  "GENERAL",
  "FOLLOW_UP",
  "ANTENATAL",
  "IMMUNIZATION",
  "EMERGENCY",
  "OTHER",
];
const ASSIGNEES = ["Qwerty Pop - FAC-IT", "Kalu Prince - Doctor"];

const INITIAL_FORM: AppointmentFormState = {
  patientName: "",
  patientId: "PAT-PLT-000234",
  encounterId: "ENC-PLT-000234",
  appointmentId: "APT-PLT-000234",
  date: "",
  time: "",
  visitType: "",
  assignedTo: "",
  reason: "",
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
      className={`rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F] ${className}`}
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
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${selected ? "border-[#046C3F] bg-[#046C3F]" : "border-gray-300 bg-white"}`}
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
        <p className="text-sm font-semibold text-gray-900">
          Appointment scheduled
        </p>
        <p className="text-sm text-gray-600">
          Appointment successfully created.
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

export default function NewAppointments() {
  const router = useRouter();
  const [form, setForm] = useState<AppointmentFormState>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const handleChange = <K extends keyof AppointmentFormState>(
    field: K,
    value: AppointmentFormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.patientName.trim() ||
      !form.visitType ||
      !form.assignedTo ||
      !form.reason.trim()
    ) {
      setFormError("Please complete all required appointment fields.");
      return;
    }

    setToastVisible(true);

    setTimeout(() => {
      router.push("/nurse-dashboard/appointments");
    }, 2000);
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    router.push("/nurse-dashboard/appointments");
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Appointments"
        breadcrumbs={[{ label: "Appointments" }, { label: "New Appointment" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton onClick={handleCancel} />

        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            Create Appointment
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BCAB4] text-[#046C3F]">
              <CalendarDays size={18} />
            </span>
            <h2 className="text-xl font-semibold text-black">
              Schedule Details
            </h2>
          </div>

          <div className="max-w-4xl space-y-6">
            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldShell label="Patient Name">
                <div className="flex items-center gap-3">
                  <Search size={24} className="shrink-0 text-gray-900" />
                  <input
                    value={form.patientName}
                    onChange={(e) =>
                      handleChange("patientName", e.target.value)
                    }
                    placeholder="Search patient by name or ID"
                    className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </div>
              </FieldShell>
              <FieldShell label="Patient ID">
                <input
                  value={form.patientId}
                  readOnly
                  className="w-full bg-transparent text-base text-gray-400 outline-none"
                />
              </FieldShell>
              <FieldShell label="Encounter ID">
                <input
                  value={form.encounterId}
                  readOnly
                  className="w-full bg-transparent text-base text-gray-400 outline-none"
                />
              </FieldShell>
              <FieldShell label="Appointment ID">
                <input
                  value={form.appointmentId}
                  readOnly
                  className="w-full bg-transparent text-base text-gray-400 outline-none"
                />
              </FieldShell>
              <FieldShell label="Date">
                <div className="flex items-center gap-3">
                  <CalendarDays size={22} className="shrink-0 text-gray-500" />
                  <input
                    value={form.date}
                    type="date"
                    onChange={(e) => handleChange("date", e.target.value)}
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
                    onChange={(e) => handleChange("time", e.target.value)}
                    className="w-full bg-transparent text-base text-gray-400 outline-none"
                  />
                </div>
              </FieldShell>

              <SelectField
                label="Visit Type"
                placeholder="Select"
                options={VISIT_TYPES}
                value={form.visitType}
                onChange={(value) => handleChange("visitType", value)}
              />
              <SelectField
                label="Assigned To"
                placeholder="Select"
                options={ASSIGNEES}
                searchable
                value={form.assignedTo}
                onChange={(value) => handleChange("assignedTo", value)}
              />
            </div>

            <FieldShell label="Reason for Visit">
              <textarea
                value={form.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                placeholder="Enter reason here"
                rows={6}
                className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
              />
            </FieldShell>

            <FieldShell label="Notes (Optional)">
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Enter notes here"
                rows={5}
                className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
              />
            </FieldShell>

            <div className="flex flex-col items-stretch gap-4 pt-1 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleCancel}
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
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
