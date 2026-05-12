"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Pill, Plus, X } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { useMyAppointments } from "@/src/hooks/doctors/use-consultation";
import {
  CreatePrescriptionPayload,
  useCreatePrescription,
} from "@/src/hooks/doctors/use-prescriptions";
import type { MyAppointment, PaginatedResponse } from "@/src/components/doctorDashboard/consultations/types";

type MedicationRow = {
  id: number;
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
};

const PRIORITY_OPTIONS = ["NORMAL", "URGENT"];
const FREQUENCY_OPTIONS = ["Once daily", "Twice daily", "Three times daily", "Every 8 hours", "Every 12 hours"];

function getApiErrorMessage(error: unknown, fallback: string) {
  const maybeError = error as { response?: { data?: { message?: string; detail?: string } } };
  return maybeError.response?.data?.message || maybeError.response?.data?.detail || fallback;
}

export default function CreatePrescription() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointment") || "";
  const [selectedAppointment, setSelectedAppointment] = useState(() => appointmentId);
  const [priority, setPriority] = useState("NORMAL");
  const [instructions, setInstructions] = useState("");
  const [rows, setRows] = useState<MedicationRow[]>([
    { id: 1, drug: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [formError, setFormError] = useState("");

  const { data: appointmentsData, isLoading: isLoadingAppointments } =
    useMyAppointments({});
  const { mutate: createPrescription, isPending } = useCreatePrescription();

  const appointments = useMemo(() => {
    const appointmentPayload = appointmentsData as
      | PaginatedResponse<MyAppointment>
      | MyAppointment[]
      | undefined;
    return Array.isArray(appointmentPayload)
      ? appointmentPayload
      : appointmentPayload?.results || [];
  }, [appointmentsData]);

  const appointmentOptions = useMemo(
    () =>
      appointments.map((appointment) => ({
        label: `${appointment.patient_name || "Unknown Patient"} - ${
          appointment.appointment_date || "No date"
        } (${appointment.visit_type || "Visit"})`,
        value: appointment.id,
      })),
    [appointments],
  );

  const activeAppointment = appointments.find(
    (appointment) => appointment.id === selectedAppointment,
  );

  const updateRow = (id: number, field: keyof MedicationRow, value: string) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
    setFormError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedAppointment || !activeAppointment?.patient) {
      setFormError("Please select an appointment with a patient.");
      return;
    }

    const validItems = rows.filter(
      (row) => row.drug.trim() && row.dosage.trim() && row.frequency.trim() && row.duration.trim(),
    );
    if (validItems.length === 0) {
      setFormError("Please add at least one complete medication.");
      return;
    }

    const payload: CreatePrescriptionPayload = {
      patient: activeAppointment.patient,
      appointment: selectedAppointment,
      priority,
      instructions,
      items: validItems.map((row) => ({
        drug: "",
        custom_drug_name: row.drug,
        dosage: row.dosage,
        frequency: row.frequency,
        duration: row.duration,
      })),
    };

    createPrescription(payload, {
      onSuccess: (response) => {
        const created = response as { data?: { data?: { id?: string }; id?: string }; id?: string };
        const id = created?.data?.data?.id || created?.data?.id || created?.id;
        router.push(id ? `/doctor-dashboard/prescriptions/${id}` : "/doctor-dashboard/prescriptions");
      },
      onError: (error) => {
        setFormError(getApiErrorMessage(error, "Failed to create prescription."));
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Prescriptions"
        breadcrumbs={[
          { label: "Prescriptions", href: "/doctor-dashboard/prescriptions" },
          { label: "Create Prescription", active: true },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <Link
          href="/doctor-dashboard/prescriptions"
          className="mb-8 inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#046C3F] transition-colors hover:bg-[#F8FAF9]"
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <Pill size={21} className="text-[#046C3F]" />
            <h2 className="text-xl font-semibold text-black">New Prescription</h2>
          </div>

          <div className="max-w-5xl space-y-6">
            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-[#62636C]">Appointment *</p>
                <CustomDropdown
                  options={appointmentOptions.map((option) => option.label)}
                  selected={
                    appointmentOptions.find((option) => option.value === selectedAppointment)
                      ?.label || (isLoadingAppointments ? "Loading..." : "Select appointment")
                  }
                  onSelect={(label) => {
                    const match = appointmentOptions.find((option) => option.label === label);
                    setSelectedAppointment(match?.value || "");
                  }}
                />
              </div>
              <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3">
                <p className="mb-2 text-xs text-[#62636C]">Patient</p>
                <p className="text-sm font-medium text-gray-900">
                  {activeAppointment?.patient_name || "-"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {activeAppointment?.patient_display_id || ""}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-gray-800">Medications</p>
              <div className="space-y-4">
                {rows.map((row) => (
                  <div key={row.id} className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_1.5fr_1fr_auto]">
                    <input
                      value={row.drug}
                      onChange={(event) => updateRow(row.id, "drug", event.target.value)}
                      placeholder="Medication name"
                      className="h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
                    />
                    <input
                      value={row.dosage}
                      onChange={(event) => updateRow(row.id, "dosage", event.target.value)}
                      placeholder="Dosage"
                      className="h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
                    />
                    <CustomDropdown
                      options={FREQUENCY_OPTIONS}
                      selected={row.frequency || "Frequency"}
                      onSelect={(value) => updateRow(row.id, "frequency", value)}
                    />
                    <input
                      value={row.duration}
                      onChange={(event) => updateRow(row.id, "duration", event.target.value)}
                      placeholder="Duration"
                      className="h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
                    />
                    <button
                      type="button"
                      onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
                      disabled={rows.length === 1}
                      className="flex h-12 items-center justify-center rounded-lg border border-red-100 px-3 text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setRows((current) => [
                    ...current,
                    { id: Date.now(), drug: "", dosage: "", frequency: "", duration: "" },
                  ])
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-[#046C3F] px-4 py-2.5 text-sm font-semibold text-[#046C3F]"
              >
                <Plus size={16} />
                Add medication
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-[#62636C]">Priority</p>
                <CustomDropdown
                  options={PRIORITY_OPTIONS}
                  selected={priority}
                  onSelect={setPriority}
                />
              </div>
              <label className="block rounded-lg border border-gray-300 bg-white px-4 py-3 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F]">
                <span className="mb-2 block text-xs text-[#62636C]">Instructions</span>
                <textarea
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  rows={4}
                  className="w-full resize-none bg-transparent text-sm text-gray-700 outline-none"
                  placeholder="Special instructions"
                />
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => router.push("/doctor-dashboard/prescriptions")}
                disabled={isPending}
                className="h-12 rounded-xl bg-[#B9BDC9] px-8 text-sm font-medium text-white disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="h-12 rounded-xl bg-[#046C3F] px-8 text-sm font-medium text-white disabled:opacity-70"
              >
                {isPending ? "Creating..." : "Create Prescription"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
