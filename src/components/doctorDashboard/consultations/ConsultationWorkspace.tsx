"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  FileText,
  Activity,
  Info,
  Pill,
  Loader2,
  Clock,
} from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DiseasePicker from "./DiseasePicker";
import {
  ConsultationPayload,
  useCreateConsultation,
  usePatchConsultation,
  useMyAppointments,
  useAppointmentById,
  useAppointmentVitals,
  useConsultationById,
  useConsultationByAppointmentId,
} from "@/src/hooks/doctors/use-consultation";
import type {
  MyAppointment,
  PaginatedResponse,
  ConsultationRecord,
} from "./types";
import LabRequestsSection from "./LabRequestsSection";
import ReferralSection from "./ReferralSection";
import PrescriptionsSection from "./PrescriptionsSection";

const INITIAL_FORM = {
  chief_complaint: "",
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

// The backend enforces one consultation per appointment. A duplicate create
// (e.g. a resubmit before this page finished navigating to the record it
// just made) surfaces as a field error here rather than a generic message.
function isDuplicateAppointmentError(error: unknown) {
  const maybeError = error as {
    response?: { data?: { errors?: { appointment?: string[] } } };
  };
  return !!maybeError.response?.data?.errors?.appointment?.some((message) =>
    message.toLowerCase().includes("already exists"),
  );
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      {children}
    </div>
  );
}

export default function ConsultationWorkspace() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const routeId = (params?.id as string) || "";
  const appointmentQueryParam = searchParams.get("appointment") || "";
  const isEditRoute = !!routeId;

  // ── Resolve the record when arriving via /consultations/{id} ──────────────
  const {
    data: consultationData,
    isLoading: isLoadingConsultation,
    isError: isConsultationError,
  } = useConsultationById(routeId);
  const consultation = consultationData as ConsultationRecord | undefined;

  // ── Resolve the appointment when arriving via /consultations/new ──────────
  const [selectedAppointment, setSelectedAppointment] = useState(
    () => appointmentQueryParam,
  );
  const isAppointmentLocked = !isEditRoute && !!appointmentQueryParam;

  const { data: appointmentsData, isLoading: isLoadingAppointments } =
    useMyAppointments({});

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

  // Does a consultation already exist for the appointment we're about to create one for?
  const {
    data: existingByAppointment,
    isFetched: isExistingChecked,
    refetch: refetchExistingByAppointment,
  } = useConsultationByAppointmentId(!isEditRoute ? selectedAppointment : "");

  // Auto-forward /new?appointment=X to the canonical /consultations/{id} once we
  // learn a record already exists — this is what turns the next save into a PATCH.
  useEffect(() => {
    if (
      !isEditRoute &&
      selectedAppointment &&
      isExistingChecked &&
      (existingByAppointment as ConsultationRecord | undefined)?.id
    ) {
      router.replace(
        `/doctor-dashboard/consultations/${(existingByAppointment as ConsultationRecord).id}`,
      );
    }
  }, [
    isEditRoute,
    selectedAppointment,
    isExistingChecked,
    existingByAppointment,
    router,
  ]);

  const isRedirectingToExisting =
    !isEditRoute &&
    !!selectedAppointment &&
    !!(existingByAppointment as ConsultationRecord | undefined)?.id;

  const record: ConsultationRecord | undefined = isEditRoute
    ? consultation
    : isRedirectingToExisting
      ? (existingByAppointment as ConsultationRecord)
      : undefined;

  const hasExistingRecord = !!record?.id;
  const appointmentId = isEditRoute
    ? consultation?.appointment || ""
    : selectedAppointment;

  const activeAppointment = appointments.find(
    (appointment) => appointment.id === selectedAppointment,
  );

  const { data: appointmentDetails, isLoading: isLoadingDetails } =
    useAppointmentById(appointmentId);
  const { data: vitalsData, isLoading: isLoadingVitals } =
    useAppointmentVitals(appointmentId);

  const latestVitals = useMemo(() => {
    if (vitalsData?.results && vitalsData.results.length > 0) {
      return vitalsData.results[0];
    }
    return null;
  }, [vitalsData]);

  // ── Form state, hydrated from the existing record when editing ────────────
  const [form, setForm] = useState(INITIAL_FORM);
  const [hydratedRecordId, setHydratedRecordId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [diagnosedDiseaseId, setDiagnosedDiseaseId] = useState("");

  // Adjusting state during render (rather than in an effect) to sync the form
  // with whichever record just loaded, per React's "resetting state" pattern.
  if (record && record.id !== hydratedRecordId) {
    setHydratedRecordId(record.id);
    setForm({
      chief_complaint: record.chief_complaint || "",
      history_of_present_complaint: record.history_of_present_complaint || "",
      past_medical_history: record.past_medical_history || "",
      examination_findings: record.examination_findings || "",
      primary_diagnosis: record.primary_diagnosis || "",
      secondary_diagnosis: record.secondary_diagnosis || "",
      treatment_plan: record.treatment_plan || "",
      additional_notes: record.additional_notes || "",
    });
    setDiagnosedDiseaseId(record.diagnosed_disease?.id || "");
  }

  const updateField = (field: FieldName, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const { mutate: createConsultation, isPending: isCreating } =
    useCreateConsultation();
  const { mutate: patchConsultation, isPending: isPatching } =
    usePatchConsultation();
  const isSaving = isCreating || isPatching;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!appointmentId) {
      setFormError("Please select an appointment.");
      return;
    }

    const payload: ConsultationPayload = {
      appointment: appointmentId,
      // Presenting Complaint is temporarily hidden from the UI, but the
      // backend rejects a blank value for it — mirror Chief Complaint
      // (falling back to the previously saved value) so it's never empty.
      presenting_complaint:
        form.chief_complaint.trim() || record?.presenting_complaint || "N/A",
      ...form,
      diagnosed_disease: diagnosedDiseaseId || null,
    };

    if (hasExistingRecord && record?.id) {
      patchConsultation(
        { id: record.id, payload },
        {
          onSuccess: () => {
            toast.success("Consultation note updated successfully.");
          },
          onError: (error) => {
            setFormError(
              getApiErrorMessage(error, "Failed to update consultation note."),
            );
          },
        },
      );
    } else {
      createConsultation(payload, {
        onSuccess: (response) => {
          const created = response as {
            data?: { data?: { id?: string }; id?: string };
            id?: string;
          };
          const id =
            created?.data?.data?.id || created?.data?.id || created?.id;
          toast.success("Consultation note created successfully.");
          if (id) {
            router.replace(`/doctor-dashboard/consultations/${id}`);
          }
        },
        onError: async (error) => {
          if (isDuplicateAppointmentError(error)) {
            // Someone (this tab or another) already created the record —
            // don't dead-end the user on a confusing error. Pull the
            // canonical record; the auto-forward effect above will pick up
            // the refreshed query data and redirect to it.
            toast.info(
              "This appointment already has a consultation note. Opening it now...",
            );
            const { data: existing } = await refetchExistingByAppointment();
            const existingId = (existing as ConsultationRecord | undefined)
              ?.id;
            if (!existingId) {
              setFormError(
                "This appointment already has a consultation note, but it could not be opened automatically. Please refresh and try again.",
              );
            }
            return;
          }
          setFormError(
            getApiErrorMessage(error, "Failed to save consultation note."),
          );
        },
      });
    }
  };

  // ── Loading / error states for the /consultations/{id} entry point ────────
  if (isEditRoute && isLoadingConsultation) {
    return (
      <div className="min-h-screen bg-[#F6F7FC]">
        <DoctorHeader
          title="Consultations"
          breadcrumbs={[
            { label: "Consultations", href: "/doctor-dashboard/consultations" },
            { label: "Consultation", active: true },
          ]}
        />
        <div className="px-4 py-6 sm:px-6 lg:py-8">
          <CenteredCard>
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={18} className="animate-spin" />
              Loading consultation...
            </div>
          </CenteredCard>
        </div>
      </div>
    );
  }

  if (isEditRoute && (isConsultationError || !consultation)) {
    return (
      <div className="min-h-screen bg-[#F6F7FC]">
        <DoctorHeader
          title="Consultations"
          breadcrumbs={[
            { label: "Consultations", href: "/doctor-dashboard/consultations" },
            { label: "Consultation", active: true },
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
          <CenteredCard>
            <p className="text-red-500">Failed to load consultation details.</p>
          </CenteredCard>
        </div>
      </div>
    );
  }

  // ── Transient state: /new?appointment=X resolved to an existing record ────
  if (isRedirectingToExisting) {
    return (
      <div className="min-h-screen bg-[#F6F7FC]">
        <DoctorHeader
          title="Consultations"
          breadcrumbs={[
            { label: "Consultations", href: "/doctor-dashboard/consultations" },
            { label: "Consultation", active: true },
          ]}
        />
        <div className="px-4 py-6 sm:px-6 lg:py-8">
          <CenteredCard>
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={18} className="animate-spin" />A consultation note
              already exists for this appointment. Opening it...
            </div>
          </CenteredCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Consultations"
        breadcrumbs={[
          { label: "Consultations", href: "/doctor-dashboard/consultations" },
          {
            label: hasExistingRecord ? "Edit Consultation" : "New Consultation",
            active: true,
          },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/doctor-dashboard/consultations"
            className="inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#046C3F] transition-colors hover:bg-[#F8FAF9]"
          >
            <ArrowLeft size={15} />
            Back
          </Link>

          {appointmentId && (
            <Link
              href={`/doctor-dashboard/prescriptions/new?appointment=${appointmentId}`}
              className="inline-flex items-center gap-2 rounded border border-purple-100 bg-white px-3 py-2 text-xs font-medium text-purple-700 shadow-sm transition-colors hover:bg-purple-50"
            >
              <Pill size={14} />
              Write Prescription
            </Link>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FileText size={21} className="text-[#046C3F]" />
              <h2 className="text-xl font-semibold text-black">
                Consultation Note
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  hasExistingRecord
                    ? "bg-[#DFF3EA] text-[#039855]"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {hasExistingRecord ? "Saved" : "Draft"}
              </span>
            </div>
            {record?.updated_at && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock size={13} />
                Last updated {formatDate(record.updated_at)}
              </span>
            )}
          </div>

          <div className="max-w-4xl space-y-6">
            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3">
                <p className="mb-2 text-xs text-[#62636C]">Appointment *</p>
                {isEditRoute || isAppointmentLocked ? (
                  <div className="cursor-not-allowed">
                    <p className="text-sm font-medium text-gray-700">
                      {consultation?.patient_name ||
                        appointmentDetails?.patient_name ||
                        activeAppointment?.patient_name ||
                        "Loading Appointment..."}{" "}
                      -{" "}
                      {appointmentDetails?.appointment_date ||
                        activeAppointment?.appointment_date ||
                        ""}
                    </p>
                  </div>
                ) : (
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
                      setHydratedRecordId(null);
                      setForm(INITIAL_FORM);
                      setDiagnosedDiseaseId("");
                    }}
                  />
                )}
              </div>
              <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3">
                <p className="mb-2 text-xs text-[#62636C]">Patient</p>
                <p className="text-sm font-medium text-gray-900">
                  {consultation?.patient_name ||
                    appointmentDetails?.patient_name ||
                    activeAppointment?.patient_name ||
                    "-"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {consultation?.patient_display_id ||
                    appointmentDetails?.patient_display_id ||
                    activeAppointment?.patient_display_id ||
                    ""}
                </p>
              </div>
            </div>

            {/* Context Info Display (Appointment Details & Vitals) */}
            {appointmentId && (
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
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
            <div>
              <p className="mb-2 text-xs text-[#62636C]">
                Registered Disease{" "}
                <span className="text-gray-400">
                  (links this diagnosis to alerts &amp; outbreak tracking)
                </span>
              </p>
              <DiseasePicker value={diagnosedDiseaseId} onChange={setDiagnosedDiseaseId} />
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
                disabled={isSaving}
                className="h-12 rounded-xl bg-[#B9BDC9] px-8 text-sm font-medium text-white disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="h-12 rounded-xl bg-[#046C3F] px-8 text-sm font-medium text-white disabled:opacity-70"
              >
                {isSaving
                  ? "Saving..."
                  : hasExistingRecord
                    ? "Update Consultation"
                    : "Save Consultation"}
              </button>
            </div>
          </div>
        </form>

        {appointmentId && (
          <div className="mt-6 space-y-6">
            <LabRequestsSection appointmentId={appointmentId} />
            <PrescriptionsSection appointmentId={appointmentId} />
            <ReferralSection appointmentId={appointmentId} />
          </div>
        )}
      </div>
    </div>
  );
}
