"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, TrendingUp, X } from "lucide-react";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import { useApi } from "@/src/hooks/use-api"; // Assuming you have this hook based on your previous files

type VitalsForm = {
  temperature: string;
  bloodPressure: string;
  pulseRate: string;
  respiratoryRate: string;
  weight: string;
  height: string;
  spo2: string;
  notes: string;
};

const INITIAL_FORM: VitalsForm = {
  temperature: "",
  bloodPressure: "",
  pulseRate: "",
  respiratoryRate: "",
  weight: "",
  height: "",
  spo2: "",
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

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BCAB4] text-[#046C3F]">
        <TrendingUp size={17} />
      </span>
      <h2 className="text-xl font-semibold text-black">{title}</h2>
    </div>
  );
}

function NumberField({
  label,
  value,
  placeholder,
  unit,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  unit?: string;
  onChange: (value: string) => void;
}) {
  const numericValue = Number(value || 0);
  const step = unit === "kg" || unit === "°C" ? 0.1 : 1;

  return (
    <FieldShell label={label}>
      <div className="flex items-center gap-3">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
        />
        <div className="flex w-10 shrink-0 flex-col overflow-hidden rounded bg-gray-200 text-gray-500">
          <button
            type="button"
            onClick={() =>
              onChange(String(Number((numericValue + step).toFixed(1))))
            }
            className="h-5 border-b border-white text-xs hover:bg-gray-300"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={() =>
              onChange(
                String(Math.max(0, Number((numericValue - step).toFixed(1)))),
              )
            }
            className="h-5 text-xs hover:bg-gray-300"
          >
            ▼
          </button>
        </div>
      </div>
    </FieldShell>
  );
}

function SuccessToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex w-[min(390px,calc(100vw-2rem))] items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
      <span className="h-12 w-1 rounded-full bg-[#039855]" />
      <span className="h-6 w-6 rounded-lg border border-[#A8E6C4] bg-[#E8F7F0]" />
      <p className="flex-1 text-sm font-semibold text-gray-900">{message}</p>
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

export default function RecordVital() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;
  const api = useApi(); // Using the api hook from your setup

  const [form, setForm] = useState<VitalsForm>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("Vital Saved Successfully");

  const updateForm = <K extends keyof VitalsForm>(
    field: K,
    value: VitalsForm[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleCancel = () => {
    router.push(`/nurse-dashboard/appointments/${appointmentId}`);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.temperature || !form.bloodPressure || !form.pulseRate) {
      setFormError("Please complete the required vital sign fields.");
      return;
    }

    setIsLoading(true);

    // Format payload to match the API expectations
    const payload = {
      appointment: appointmentId,
      temperature: form.temperature,
      blood_pressure: form.bloodPressure,
      pulse_rate: Number(form.pulseRate) || 0,
      respiratory_rate: Number(form.respiratoryRate) || 0,
      weight_kg: form.weight || "-",
      height_cm: form.height || "-",
      spo2: Number(form.spo2) || 0,
      notes: form.notes || "string",
    };

    try {
      await api.post("/appointments/vitals/", payload);

      setToastMessage("Vital Saved Successfully");
      setToastVisible(true);
      setForm(INITIAL_FORM);

      // Redirect after a short delay to let the user see the success message
      setTimeout(() => {
        router.push(`/nurse-dashboard/appointments/${appointmentId}`);
      }, 1500);
    } catch (error) {
      console.error(error);
      setFormError(
        "An error occurred while saving the vitals. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Vitals"
        breadcrumbs={[
          { label: "Appointments", href: "/nurse-dashboard/appointments" },
          { label: "Record Vitals" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8 max-w-5xl mx-auto">
        <NurseBackButton onClick={handleCancel} />

        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Record Patient Vitals
            </h2>
            <p className="text-base text-[#3F3F46]">
              Take and save patient vital signs for this appointment
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8">
            <SectionHeader title="Vital Signs" />

            <div className="max-w-4xl space-y-6">
              {formError && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <NumberField
                  label="Temperature"
                  value={form.temperature}
                  placeholder="0°C"
                  unit="°C"
                  onChange={(value) => updateForm("temperature", value)}
                />
                <NumberField
                  label="Blood Pressure"
                  value={form.bloodPressure}
                  placeholder="e.g 120/80"
                  onChange={(value) => updateForm("bloodPressure", value)}
                />
                <NumberField
                  label="Pulse Rate"
                  value={form.pulseRate}
                  placeholder="0 bpm"
                  onChange={(value) => updateForm("pulseRate", value)}
                />
                <NumberField
                  label="Respiratory Rate"
                  value={form.respiratoryRate}
                  placeholder="0 /min"
                  onChange={(value) => updateForm("respiratoryRate", value)}
                />
                <NumberField
                  label="Weight"
                  value={form.weight}
                  placeholder="0 kg"
                  unit="kg"
                  onChange={(value) => updateForm("weight", value)}
                />
                <NumberField
                  label="Height"
                  value={form.height}
                  placeholder="0 cm"
                  onChange={(value) => updateForm("height", value)}
                />
                <NumberField
                  label="SpO₂"
                  value={form.spo2}
                  placeholder="0 %"
                  onChange={(value) => updateForm("spo2", value)}
                />
              </div>

              <FieldShell label="Note (Optional)">
                <textarea
                  value={form.notes}
                  onChange={(event) => updateForm("notes", event.target.value)}
                  placeholder="Additional triage observations"
                  rows={4}
                  className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                />
              </FieldShell>

              <div className="flex flex-col items-stretch gap-4 pt-1 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="h-14 rounded-xl bg-[#B9BDC9] px-12 text-lg font-medium text-white transition-colors hover:bg-[#A9AEBC]"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-8 text-lg font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-70"
                >
                  <Save size={20} />
                  {isLoading ? "Saving..." : "Save Vitals"}
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>

      {toastVisible && (
        <SuccessToast
          message={toastMessage}
          onClose={() => setToastVisible(false)}
        />
      )}
    </div>
  );
}
