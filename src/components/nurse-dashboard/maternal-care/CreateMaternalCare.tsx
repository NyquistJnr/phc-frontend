"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  Search,
  X,
  Loader2,
  Baby,
} from "lucide-react";

import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import { usePatients } from "@/src/hooks/nurses/use-patients";
import { useCreateEpisode } from "@/src/hooks/nurses/use-maternal-care";

export type EpisodeFormState = {
  patientName: string;
  patientId: string;
  patientDisplayId: string;
  status: "ACTIVE" | "DELIVERED" | "CLOSED" | "MISCARRIAGE";
  lmp: string;
  edd: string;
  gravida: string;
  parity: string;
  livingChildren: string;
  partnerName: string;
  partnerPhone: string;
};

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Closed", value: "CLOSED" },
  { label: "Miscarriage", value: "MISCARRIAGE" },
];

const INITIAL_FORM: EpisodeFormState = {
  patientName: "",
  patientId: "",
  patientDisplayId: "",
  status: "ACTIVE",
  lmp: "",
  edd: "",
  gravida: "",
  parity: "",
  livingChildren: "",
  partnerName: "",
  partnerPhone: "",
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
          <div className="max-h-72 overflow-y-auto pr-1">
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
      <span className="h-6 w-6 rounded-lg border border-[#A8E6C4] bg-[#E8F7F0]" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">Episode created</p>
        <p className="text-sm text-gray-600">
          Maternal care episode successfully registered.
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

export default function NewMaternalEpisode() {
  const router = useRouter();
  const [form, setForm] = useState<EpisodeFormState>(INITIAL_FORM);
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

  const patientsList = patientsData?.results || [];

  const { mutate: createEpisode, isPending: isCreating } = useCreateEpisode();

  const handleChange = <K extends keyof EpisodeFormState>(
    field: K,
    value: EpisodeFormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setPatientSearchTerm(form.patientName);
    }, 800);
    return () => clearTimeout(handler);
  }, [form.patientName]);

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

    if (
      !form.patientId ||
      !form.lmp ||
      !form.edd ||
      form.gravida === "" ||
      form.parity === "" ||
      form.livingChildren === ""
    ) {
      setFormError(
        "Please complete all required fields, ensuring a patient is selected from the list.",
      );
      return;
    }

    createEpisode(
      {
        patient: form.patientId,
        status: form.status,
        last_menstrual_period: form.lmp,
        expected_date_of_delivery: form.edd,
        gravida: Number(form.gravida),
        parity: Number(form.parity),
        living_children: Number(form.livingChildren),
        partner_name: form.partnerName,
        partner_phone: form.partnerPhone,
      },
      {
        onSuccess: () => {
          setToastVisible(true);
          setTimeout(() => {
            router.push("/nurse-dashboard/maternal-care");
          }, 2000);
        },
        onError: (error: any) => {
          setFormError(
            error?.response?.data?.message ||
              "Failed to create episode. Please try again.",
          );
        },
      },
    );
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    router.push("/nurse-dashboard/maternal-care");
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Maternal Care"
        breadcrumbs={[
          { label: "Maternal Care", href: "/nurse-dashboard/maternal-care" },
          { label: "New Episode" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton onClick={handleCancel} />

        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            Register Maternal Episode
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BCAB4] text-[#046C3F]">
              <Baby size={18} />
            </span>
            <h2 className="text-xl font-semibold text-black">
              Episode Details
            </h2>
          </div>

          <div className="max-w-4xl space-y-6">
            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div ref={patientRef} className="relative z-10">
                <FieldShell label="Patient Name *">
                  <div className="flex items-center gap-3">
                    <Search size={24} className="shrink-0 text-gray-900" />
                    <input
                      value={form.patientName}
                      onChange={(e) => {
                        handleChange("patientName", e.target.value);
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
                              patient.profile?.patient_id ||
                                patient.patient_id ||
                                "",
                            );
                            handleChange(
                              "patientName",
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
                            ID:{" "}
                            {patient.profile?.patient_id ||
                              patient.patient_id ||
                              "N/A"}{" "}
                            • {patient.phone_number || "No Phone"}
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
              <FieldShell label="Patient ID">
                <input
                  value={form.patientDisplayId}
                  readOnly
                  placeholder="Auto-filled on selection"
                  className="w-full bg-transparent text-base text-gray-400 outline-none"
                />
              </FieldShell>
              <FieldShell label="Last Menstrual Period (LMP) *">
                <div className="flex items-center gap-3">
                  <CalendarDays size={22} className="shrink-0 text-gray-500" />
                  <input
                    value={form.lmp}
                    type="date"
                    onChange={(e) => handleChange("lmp", e.target.value)}
                    className="w-full bg-transparent text-base text-gray-700 outline-none"
                  />
                </div>
              </FieldShell>
              <FieldShell label="Expected Date of Delivery (EDD) *">
                <div className="flex items-center gap-3">
                  <CalendarDays size={22} className="shrink-0 text-gray-500" />
                  <input
                    value={form.edd}
                    type="date"
                    onChange={(e) => handleChange("edd", e.target.value)}
                    className="w-full bg-transparent text-base text-gray-700 outline-none"
                  />
                </div>
              </FieldShell>

              <SelectField
                label="Episode Status *"
                placeholder="Select Status"
                options={STATUS_OPTIONS}
                value={form.status}
                onChange={(value) => handleChange("status", value as any)}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pt-2">
              <FieldShell label="Gravida (Pregnancies) *">
                <input
                  value={form.gravida}
                  type="number"
                  min="0"
                  onChange={(e) => handleChange("gravida", e.target.value)}
                  placeholder="e.g. 2"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Parity (Births) *">
                <input
                  value={form.parity}
                  type="number"
                  min="0"
                  onChange={(e) => handleChange("parity", e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Living Children *">
                <input
                  value={form.livingChildren}
                  type="number"
                  min="0"
                  onChange={(e) =>
                    handleChange("livingChildren", e.target.value)
                  }
                  placeholder="e.g. 1"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-2">
              <FieldShell label="Partner Name (Optional)">
                <input
                  value={form.partnerName}
                  type="text"
                  onChange={(e) => handleChange("partnerName", e.target.value)}
                  placeholder="Enter partner name"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <FieldShell label="Partner Phone (Optional)">
                <input
                  value={form.partnerPhone}
                  type="tel"
                  onChange={(e) => handleChange("partnerPhone", e.target.value)}
                  placeholder="Enter partner phone number"
                  className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>
            </div>

            <div className="flex flex-col items-stretch gap-4 pt-4 sm:flex-row sm:items-center">
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
                  <Baby size={20} />
                )}
                {isCreating ? "Saving..." : "Save Episode"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
