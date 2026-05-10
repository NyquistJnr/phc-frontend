"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Baby,
  Heart,
  Save,
  Search,
  Shield,
  Loader2,
  X,
  CheckCircle,
  Thermometer,
} from "lucide-react";

import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import { useEpisodeBabies } from "@/src/hooks/nurses/use-anc-pnc";
import { useCreateNewbornAssessment } from "@/src/hooks/nurses/use-anc-pnc";

const INITIAL_FORM = {
  baby: "",
  cord_care_assessed: "",
  temperature: "",
  exclusive_breastfeeding: "",
  newborn_danger_signs: "",
  neonatal_jaundice: "",
  first_dose_antibiotics_given: "",
  kmc_provided: "",
  outcome: "",
};

const YES_NO_OPTIONS = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const OUTCOME_OPTIONS = [
  { label: "Healthy", value: "HEALTHY" },
  { label: "Admitted", value: "ADMITTED" },
  { label: "Referred Out", value: "REFERRED" },
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
        <p className="text-sm font-semibold text-gray-900">Assessment Saved</p>
        <p className="text-sm text-gray-600">
          The newborn assessment has been successfully recorded.
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

export default function PncNewBornAssessment() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const episodeId = segments[3];
  const pncVisitId = segments[5];

  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const [babyDisplay, setBabyDisplay] = useState("");
  const [showBabyDropdown, setShowBabyDropdown] = useState(false);
  const babyRef = useRef<HTMLDivElement>(null);

  const { data: babiesData, isLoading: isLoadingBabies } =
    useEpisodeBabies(episodeId);
  const babies = babiesData || [];

  const { mutate: createAssessment, isPending: isCreating } =
    useCreateNewbornAssessment();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (babyRef.current && !babyRef.current.contains(event.target as Node)) {
        setShowBabyDropdown(false);
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
    router.push(
      `/doctor-dashboard/maternal-care/${episodeId}/pnc/${pncVisitId}`,
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.baby || !form.outcome) {
      setFormError(
        "Please complete all required fields (Linked Baby, Outcome).",
      );
      return;
    }
    const payload = {
      pnc_visit: pncVisitId,
      baby: form.baby,
      cord_care_assessed: form.cord_care_assessed === "true",
      temperature: form.temperature,
      exclusive_breastfeeding: form.exclusive_breastfeeding,
      newborn_danger_signs: form.newborn_danger_signs,
      neonatal_jaundice: form.neonatal_jaundice === "true",
      first_dose_antibiotics_given:
        form.first_dose_antibiotics_given === "true",
      kmc_provided: form.kmc_provided === "true",
      outcome: form.outcome,
    };

    createAssessment(payload, {
      onSuccess: () => {
        setToastVisible(true);
        setTimeout(() => {
          router.push(
            `/doctor-dashboard/maternal-care/${episodeId}/pnc/${pncVisitId}`,
          );
        }, 2000);
      },
      onError: (error: any) => {
        setFormError(
          error?.response?.data?.message ||
            "Failed to save assessment. Please try again.",
        );
      },
    });
  };

  const filteredBabies = babies.filter(
    (b) =>
      b.full_name.toLowerCase().includes(babyDisplay.toLowerCase()) ||
      b.patient_display_id.toLowerCase().includes(babyDisplay.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Newborn Assessment"
        breadcrumbs={[
          {
            label: "PNC Visit",
            href: `/doctor-dashboard/maternal-care/${episodeId}/pnc/${pncVisitId}`,
          },
          { label: "Newborn Assessment" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton onClick={handleCancel} />

        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            Record Newborn Assessment
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
              <SectionHeader icon={Baby} title="Baby Identification" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div ref={babyRef} className="relative z-20">
                  <FieldShell label="Select Registered Baby *">
                    <div className="flex items-center gap-3">
                      <Search size={20} className="shrink-0 text-gray-400" />
                      <input
                        value={babyDisplay}
                        onChange={(e) => {
                          setBabyDisplay(e.target.value);
                          if (form.baby) handleChange("baby", "");
                          setShowBabyDropdown(true);
                        }}
                        onFocus={() => setShowBabyDropdown(true)}
                        placeholder="Search baby by name"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                      {isLoadingBabies && (
                        <Loader2
                          size={16}
                          className="animate-spin text-gray-400"
                        />
                      )}
                    </div>
                  </FieldShell>

                  {showBabyDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-300 bg-white p-2 shadow-lg">
                      {filteredBabies.length > 0 ? (
                        filteredBabies.map((baby) => (
                          <button
                            key={baby.id}
                            type="button"
                            onClick={() => {
                              handleChange("baby", baby.id);
                              setBabyDisplay(baby.full_name);
                              setShowBabyDropdown(false);
                            }}
                            className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50"
                          >
                            <div className="font-medium text-gray-900">
                              {baby.full_name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <span>ID: {baby.patient_display_id}</span>
                              <span>•</span>
                              <span>Sex: {baby.sex}</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          {isLoadingBabies
                            ? "Loading babies..."
                            : "No babies found for this episode."}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative z-10">
                  <FieldShell label="Baby ID">
                    <input
                      value={form.baby}
                      readOnly
                      placeholder="Auto-filled on selection"
                      className="w-full bg-transparent text-base text-gray-400 outline-none"
                    />
                  </FieldShell>
                </div>
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <SectionHeader icon={Heart} title="Clinical Assessment" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FieldShell label="Temperature (°C)">
                  <div className="flex items-center gap-3">
                    <Thermometer size={20} className="shrink-0 text-gray-400" />
                    <input
                      value={form.temperature}
                      onChange={(e) =>
                        handleChange("temperature", e.target.value)
                      }
                      placeholder="e.g. 37.0"
                      className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </FieldShell>

                <SelectField
                  label="Cord Care Assessed"
                  options={YES_NO_OPTIONS}
                  value={form.cord_care_assessed}
                  onChange={(value) =>
                    handleChange("cord_care_assessed", value)
                  }
                />

                <SelectField
                  label="Neonatal Jaundice Present"
                  options={YES_NO_OPTIONS}
                  value={form.neonatal_jaundice}
                  onChange={(value) => handleChange("neonatal_jaundice", value)}
                />

                <SelectField
                  label="First Dose Antibiotics Given"
                  options={YES_NO_OPTIONS}
                  value={form.first_dose_antibiotics_given}
                  onChange={(value) =>
                    handleChange("first_dose_antibiotics_given", value)
                  }
                />

                <SelectField
                  label="Kangaroo Mother Care (KMC) Provided"
                  options={YES_NO_OPTIONS}
                  value={form.kmc_provided}
                  onChange={(value) => handleChange("kmc_provided", value)}
                />

                <div className="md:col-span-2">
                  <FieldShell label="Exclusive Breastfeeding Details">
                    <textarea
                      value={form.exclusive_breastfeeding}
                      onChange={(e) =>
                        handleChange("exclusive_breastfeeding", e.target.value)
                      }
                      rows={2}
                      placeholder="Record breastfeeding details or counselling..."
                      className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>
                </div>

                <div className="md:col-span-2">
                  <FieldShell label="Newborn Danger Signs">
                    <textarea
                      value={form.newborn_danger_signs}
                      onChange={(e) =>
                        handleChange("newborn_danger_signs", e.target.value)
                      }
                      rows={2}
                      placeholder="Record any danger signs observed..."
                      className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>
                </div>
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <SectionHeader icon={Shield} title="Outcome" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <SelectField
                  label="Assessment Outcome *"
                  options={OUTCOME_OPTIONS}
                  value={form.outcome}
                  onChange={(value) => handleChange("outcome", value)}
                />
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
                {isCreating ? "Saving..." : "Save Assessment"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
