"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText, Activity, Info } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import {
  ConsultationPayload,
  useCreateConsultation,
  useMyAppointments,
  useAppointmentById,
  useAppointmentVitals,
} from "@/src/hooks/doctors/use-consultation";
import type { MyAppointment, PaginatedResponse } from "./types";

const INITIAL_FORM = {
  chief_complaint: "",
  presenting_complaint: "",
  history_of_present_complaint: "",
  past_medical_history: "",
  examination_findings: "",
  primary_diagnosis: "",
  secondary_diagnosis: "",
  treatment_plan: "",
  additional_notes: "",
};

type FieldName = keyof typeof INITIAL_FORM;

function getApiErrorMessage(error: unknown, fallback: string) {
  const maybeError = error as {
    response?: { data?: { message?: string; detail?: string } };
  };
  return (
    maybeError.response?.data?.message ||
    maybeError.response?.data?.detail ||
    fallback
  );
}

function TextareaField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block rounded-lg border border-gray-300 bg-white px-4 py-3 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F]">
      <span className="mb-2 block text-xs text-[#62636C]">
        {label} {required ? "*" : ""}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        placeholder={label}
      />
    </label>
  );
}

export default function CreateNote() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointment") || "";
  const isAppointmentLocked = !!appointmentId; // Determine if we should lock the dropdown

  const [selectedAppointment, setSelectedAppointment] = useState(
    () => appointmentId,
  );
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");

  const { data: appointmentsData, isLoading: isLoadingAppointments } =
    useMyAppointments({});

  // Fetch detailed info for the selected appointment
  const { data: appointmentDetails, isLoading: isLoadingDetails } =
    useAppointmentById(selectedAppointment);
  const { data: vitalsData, isLoading: isLoadingVitals } =
    useAppointmentVitals(selectedAppointment);

  const { mutate: createConsultation, isPending } = useCreateConsultation();

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

  // Extract the most recent vitals if they exist
  const latestVitals = useMemo(() => {
    if (vitalsData?.results && vitalsData.results.length > 0) {
      return vitalsData.results[0];
    }
    return null;
  }, [vitalsData]);

  const updateField = (field: FieldName, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedAppointment) {
      setFormError("Please select an appointment.");
      return;
    }

    const payload: ConsultationPayload = {
      appointment: selectedAppointment,
      ...form,
    };

    createConsultation(payload, {
      onSuccess: (response) => {
        const created = response as {
          data?: { data?: { id?: string }; id?: string };
          id?: string;
        };
        const id = created?.data?.data?.id || created?.data?.id || created?.id;
        router.push(
          id
            ? `/doctor-dashboard/consultations/${id}`
            : "/doctor-dashboard/consultations",
        );
      },
      onError: (error) => {
        setFormError(
          getApiErrorMessage(error, "Failed to save consultation note."),
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Consultations"
        breadcrumbs={[
          { label: "Consultations", href: "/doctor-dashboard/consultations" },
          { label: "Create Note", active: true },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <Link
          href="/doctor-dashboard/consultations"
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
            <FileText size={21} className="text-[#046C3F]" />
            <h2 className="text-xl font-semibold text-black">
              Consultation Note
            </h2>
          </div>

          <div className="max-w-4xl space-y-6">
            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-[#62636C]">Appointment *</p>
                {isAppointmentLocked ? (
                  // Locked State UI
                  <div className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 cursor-not-allowed">
                    <p className="text-sm font-medium text-gray-700">
                      {appointmentDetails?.patient_name ||
                        activeAppointment?.patient_name ||
                        "Loading Appointment..."}{" "}
                      -{" "}
                      {appointmentDetails?.appointment_date ||
                        activeAppointment?.appointment_date ||
                        ""}
                    </p>
                  </div>
                ) : (
                  // Selectable Dropdown
                  <CustomDropdown
                    options={appointmentOptions.map((option) => option.label)}
                    selected={
                      appointmentOptions.find(
                        (option) => option.value === selectedAppointment,
                      )?.label ||
                      (isLoadingAppointments
                        ? "Loading..."
                        : "Select appointment")
                    }
                    onSelect={(label) => {
                      const match = appointmentOptions.find(
                        (option) => option.label === label,
                      );
                      setSelectedAppointment(match?.value || "");
                    }}
                  />
                )}
              </div>
              <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3">
                <p className="mb-2 text-xs text-[#62636C]">Patient</p>
                <p className="text-sm font-medium text-gray-900">
                  {appointmentDetails?.patient_name ||
                    activeAppointment?.patient_name ||
                    "-"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {appointmentDetails?.patient_display_id ||
                    activeAppointment?.patient_display_id ||
                    ""}
                </p>
              </div>
            </div>

            {/* Context Info Display (Appointment Details & Vitals) */}
            {selectedAppointment && (
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                {/* Appointment Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={16} className="text-blue-600" />
                    <h3 className="text-sm font-semibold text-blue-900">
                      Appointment Details
                    </h3>
                  </div>
                  {isLoadingDetails ? (
                    <p className="text-xs text-blue-600">Loading details...</p>
                  ) : appointmentDetails ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-xs text-blue-600/70">Visit Type</p>
                        <p className="text-sm font-medium text-blue-900">
                          {appointmentDetails.visit_type || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600/70">Priority</p>
                        <p className="text-sm font-medium text-blue-900">
                          {appointmentDetails.priority || "-"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-blue-600/70">
                          Reason for Visit
                        </p>
                        <p className="text-sm font-medium text-blue-900">
                          {appointmentDetails.reason_for_visit || "-"}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

                <hr className="border-blue-100 my-4" />

                {/* Vitals Info */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Activity size={16} className="text-[#046C3F]" />
                    <h3 className="text-sm font-semibold text-[#046C3F]">
                      Recent Vitals
                    </h3>
                  </div>
                  {isLoadingVitals ? (
                    <p className="text-xs text-green-700">Loading vitals...</p>
                  ) : latestVitals ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 bg-white p-3 rounded-lg border border-green-100">
                      <div>
                        <p className="text-xs text-gray-500">Blood Pressure</p>
                        <p className="text-sm font-medium text-gray-900">
                          {latestVitals.blood_pressure || "-"} mmHg
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Temperature</p>
                        <p className="text-sm font-medium text-gray-900">
                          {latestVitals.temperature || "-"} °C
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Pulse / Respiration
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {latestVitals.pulse_rate || "-"} bpm /{" "}
                          {latestVitals.respiratory_rate || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Weight / Height</p>
                        <p className="text-sm font-medium text-gray-900">
                          {latestVitals.weight_kg || "-"} kg /{" "}
                          {latestVitals.height_cm || "-"} cm
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      No vitals recorded for this appointment yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            <TextareaField
              label="Chief Complaint"
              value={form.chief_complaint}
              onChange={(value) => updateField("chief_complaint", value)}
              required
            />
            <TextareaField
              label="Presenting Complaint"
              value={form.presenting_complaint}
              onChange={(value) => updateField("presenting_complaint", value)}
            />
            <TextareaField
              label="History of Present Complaint"
              value={form.history_of_present_complaint}
              onChange={(value) =>
                updateField("history_of_present_complaint", value)
              }
            />
            <TextareaField
              label="Past Medical History"
              value={form.past_medical_history}
              onChange={(value) => updateField("past_medical_history", value)}
            />
            <TextareaField
              label="Examination Findings"
              value={form.examination_findings}
              onChange={(value) => updateField("examination_findings", value)}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TextareaField
                label="Primary Diagnosis"
                value={form.primary_diagnosis}
                onChange={(value) => updateField("primary_diagnosis", value)}
              />
              <TextareaField
                label="Secondary Diagnosis"
                value={form.secondary_diagnosis}
                onChange={(value) => updateField("secondary_diagnosis", value)}
              />
            </div>
            <TextareaField
              label="Treatment Plan"
              value={form.treatment_plan}
              onChange={(value) => updateField("treatment_plan", value)}
            />
            <TextareaField
              label="Additional Notes"
              value={form.additional_notes}
              onChange={(value) => updateField("additional_notes", value)}
            />

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => router.push("/doctor-dashboard/consultations")}
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
                {isPending ? "Saving..." : "Save Consultation"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
