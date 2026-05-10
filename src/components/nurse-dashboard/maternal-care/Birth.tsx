"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Baby,
  CalendarDays,
  Save,
  Loader2,
  X,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";

import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import { useRecordDelivery } from "@/src/hooks/nurses/use-anc-pnc";

const INITIAL_BABY = {
  first_name: "Cherry",
  last_name: "Doe",
  sex: "F",
  weight_kg: "3.2",
};

const INITIAL_FORM = {
  delivery_date: new Date().toISOString().split("T")[0],
  babies: [{ ...INITIAL_BABY }],
};

const SEX_OPTIONS = [
  { label: "Female", value: "F" },
  { label: "Male", value: "M" },
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
        <p className="text-sm font-semibold text-gray-900">Delivery Recorded</p>
        <p className="text-sm text-gray-600">
          The delivery and newborn(s) have been successfully registered.
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

export default function RecordDeliveryForm() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/");

  const episodeId = segments[3];
  const pncVisitId = segments[5];

  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const { mutate: recordDelivery, isPending: isCreating } = useRecordDelivery();

  const handleDateChange = (value: string) => {
    setForm((current) => ({ ...current, delivery_date: value }));
    setFormError("");
  };

  const handleBabyChange = (index: number, field: string, value: string) => {
    const newBabies = [...form.babies];
    newBabies[index] = { ...newBabies[index], [field]: value };
    setForm((current) => ({ ...current, babies: newBabies }));
    setFormError("");
  };

  const addBaby = () => {
    setForm((current) => ({
      ...current,
      babies: [...current.babies, { ...INITIAL_BABY, first_name: "Apple" }],
    }));
  };

  const removeBaby = (index: number) => {
    if (form.babies.length === 1) return;
    const newBabies = form.babies.filter((_, i) => i !== index);
    setForm((current) => ({ ...current, babies: newBabies }));
  };

  const handleCancel = () => {
    router.push(
      `/nurse-dashboard/maternal-care/${episodeId}/pnc/${pncVisitId}`,
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.delivery_date) {
      setFormError("Please provide the delivery date.");
      return;
    }

    const hasEmptyBabyFields = form.babies.some(
      (b) => !b.first_name || !b.last_name || !b.sex || !b.weight_kg,
    );

    if (hasEmptyBabyFields) {
      setFormError("Please complete all newborn fields (Name, Sex, Weight).");
      return;
    }

    const payload = {
      delivery_date: form.delivery_date,
      babies: form.babies,
    };

    recordDelivery(
      { episodeId, payload },
      {
        onSuccess: () => {
          setToastVisible(true);
          setTimeout(() => {
            router.push(
              `/nurse-dashboard/maternal-care/${episodeId}/pnc/${pncVisitId}`,
            );
          }, 2000);
        },
        onError: (error: any) => {
          setFormError(
            error?.response?.data?.message ||
              "Failed to record delivery. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Record Delivery"
        breadcrumbs={[
          {
            label: "PNC Visit",
            href: `/nurse-dashboard/maternal-care/${episodeId}/pnc/${pncVisitId}`,
          },
          { label: "Record Delivery & Birth" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton onClick={handleCancel} />

        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            Record Delivery & Newborn(s)
          </h2>
          <p className="text-base text-[#3F3F46]">
            Register the delivery date and newborn information to conclude the
            maternal episode.
          </p>
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
              <SectionHeader icon={CalendarDays} title="Delivery Information" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FieldShell label="Delivery Date *">
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={20}
                      className="shrink-0 text-gray-400"
                    />
                    <input
                      type="date"
                      value={form.delivery_date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full bg-transparent text-base text-gray-700 outline-none"
                    />
                  </div>
                </FieldShell>
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <div className="flex items-center justify-between">
                <SectionHeader icon={Baby} title="Newborn Details" />
                <button
                  type="button"
                  onClick={addBaby}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#E8F1EC] px-4 text-sm font-medium text-[#046C3F] transition-colors hover:bg-[#DDF0E8]"
                >
                  <Plus size={16} />
                  Add Twin / Multiple
                </button>
              </div>

              <div className="space-y-8">
                {form.babies.map((baby, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl border border-gray-200 bg-gray-50 p-6"
                  >
                    {form.babies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBaby(index)}
                        className="absolute right-4 top-4 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}

                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      Baby {index + 1}
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FieldShell label="First Name *">
                        <input
                          value={baby.first_name}
                          onChange={(e) =>
                            handleBabyChange(
                              index,
                              "first_name",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Cherry"
                          className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </FieldShell>

                      <FieldShell label="Last Name *">
                        <input
                          value={baby.last_name}
                          onChange={(e) =>
                            handleBabyChange(index, "last_name", e.target.value)
                          }
                          placeholder="e.g. Doe"
                          className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </FieldShell>

                      <SelectField
                        label="Biological Sex *"
                        options={SEX_OPTIONS}
                        value={baby.sex}
                        onChange={(value) =>
                          handleBabyChange(index, "sex", value)
                        }
                      />

                      <FieldShell label="Weight (kg) *">
                        <input
                          type="number"
                          step="0.01"
                          value={baby.weight_kg}
                          onChange={(e) =>
                            handleBabyChange(index, "weight_kg", e.target.value)
                          }
                          placeholder="e.g. 3.2"
                          className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </FieldShell>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-col items-stretch gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center">
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
                {isCreating ? "Recording..." : "Record Delivery"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
