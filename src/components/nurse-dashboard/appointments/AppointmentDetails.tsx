"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  User,
  FileText,
  ClipboardList,
  Activity,
  Plus,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  X,
  Save,
  Send,
  Search,
  Eye,
  Hospital,
} from "lucide-react";

import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import {
  useAppointment,
  useAppointmentVitals,
  useUpdateVital,
  useDeleteVital,
} from "@/src/hooks/nurses/use-appointments";
import { useFacilities } from "@/src/hooks/useFacilities";
import {
  useCreateReferral,
  useDepartments,
  useReferrals,
} from "@/src/hooks/nurses/use-referrals";

const statusColors: Record<string, { bg: string; text: string }> = {
  SCHEDULED: { bg: "#FFF4E5", text: "#1F2937" },
  IN_PROGRESS: { bg: "#E2E7FF", text: "#046C3F" },
  COMPLETED: { bg: "#DFF3EA", text: "#039855" },
  CANCELLED: { bg: "#FDE8E8", text: "#F33131" },
  NO_SHOW: { bg: "#FDE8E8", text: "#F33131" },
  VITALS_DONE: { bg: "#E2E7FF", text: "#046C3F" },
  ACCEPTED: { bg: "#DFF3EA", text: "#039855" },
  PENDING: { bg: "#FFF4E5", text: "#1F2937" },
  REJECTED: { bg: "#FDE8E8", text: "#F33131" },
};

const REFERRAL_TYPE_OPTIONS = [
  { label: "Physical", value: "PHYSICAL" },
  { label: "Telemedicine", value: "TELEMEDICINE" },
  { label: "Emergency", value: "EMERGENCY" },
];

const DESTINATION_LEVEL_OPTIONS = [
  { label: "Primary Health Care (Internal)", value: "PRIMARY" },
  { label: "Secondary Health Care", value: "SECONDARY" },
  { label: "Higher Health Care", value: "HIGHER" },
  { label: "Other", value: "OTHER" },
];

const TRANSPORT_MODE_OPTIONS = [
  { label: "Private Vehicle", value: "PRIVATE" },
  { label: "Ambulance", value: "AMBULANCE" },
  { label: "Public Transportation", value: "PUBLIC" },
  { label: "Other", value: "OTHER" },
];

const REFERRAL_MODE_OPTIONS = [
  { label: "Softcopy (Email/Digital)", value: "SOFTCOPY" },
  { label: "Hardcopy (Physical Document)", value: "HARDCOPY" },
];

function getApiErrorMessage(error: unknown, fallback: string) {
  const maybeError = error as {
    response?: { data?: { message?: string } };
  };
  return maybeError.response?.data?.message || fallback;
}

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
      className={`relative rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F] ${className}`}
    >
      <label className="mb-1 block text-xs text-[#62636C]">{label}</label>
      {children}
    </div>
  );
}

function SearchableSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  className = "",
  isLoading = false,
}: {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedOption = options.find((opt) => opt.value === value);

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
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
      >
        <span className="mb-1 block text-xs text-[#62636C]">{label}</span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span
            className={
              selectedOption ? "text-gray-700 truncate" : "text-gray-400"
            }
          >
            {isLoading ? "Loading..." : selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-800 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
          <div className="relative mb-3">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="h-11 w-full rounded-lg border border-gray-300 pl-12 pr-3 text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
            />
          </div>
          <div className="max-h-60 overflow-y-auto pr-1">
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-4 text-sm text-gray-400">
                No options found.
              </p>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setSearch("");
                    setOpen(false);
                  }}
                  className={`block w-full rounded-md px-3 py-3 text-left text-sm transition-colors ${
                    value === option.value
                      ? "bg-[#E8F7F0] font-semibold text-[#046C3F]"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const VitalMetric = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: any;
  unit: string;
}) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
    <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
      {label}
    </p>
    <p className="text-lg font-semibold text-gray-900">
      {value !== null &&
      value !== undefined &&
      value !== "" &&
      value !== "-" ? (
        <>
          {value}{" "}
          <span className="text-sm font-normal text-gray-500">{unit}</span>
        </>
      ) : (
        <span className="text-gray-400 text-sm">Not recorded</span>
      )}
    </p>
  </div>
);

const EditVitalForm = ({ vital, appointmentId, onCancel, onSuccess }: any) => {
  const { mutate: updateVital, isPending } = useUpdateVital();
  const [formData, setFormData] = useState({
    temperature: vital.temperature || "",
    blood_pressure: vital.blood_pressure || "",
    pulse_rate: vital.pulse_rate || "",
    respiratory_rate: vital.respiratory_rate || "",
    weight_kg: vital.weight_kg || "",
    height_cm: vital.height_cm || "",
    spo2: vital.spo2 || "",
    notes: vital.notes || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVital(
      {
        id: vital.id,
        payload: {
          appointment: appointmentId,
          temperature: String(formData.temperature),
          blood_pressure: String(formData.blood_pressure),
          pulse_rate: Number(formData.pulse_rate) || 0,
          respiratory_rate: Number(formData.respiratory_rate) || 0,
          weight_kg: String(formData.weight_kg),
          height_cm: String(formData.height_cm),
          spo2: Number(formData.spo2) || 0,
          notes: formData.notes,
        },
      },
      { onSuccess: () => onSuccess() },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm ring-1 ring-blue-50"
    >
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
        <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
          <Edit2 size={16} /> Editing Vitals
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {[
          {
            label: "Blood Pressure",
            name: "blood_pressure",
            placeholder: "120/80",
          },
          { label: "Heart Rate (bpm)", name: "pulse_rate", type: "number" },
          { label: "Temp (°C)", name: "temperature" },
          {
            label: "Resp Rate (bpm)",
            name: "respiratory_rate",
            type: "number",
          },
          { label: "Weight (kg)", name: "weight_kg" },
          { label: "Height (cm)", name: "height_cm" },
          { label: "SpO2 (%)", name: "spo2", type: "number" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={(formData as any)[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder || ""}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#046C3F] focus:border-transparent"
            />
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Clinical Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#046C3F] focus:border-transparent"
        />
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#046C3F] rounded-lg hover:bg-[#035a34] disabled:opacity-50"
        >
          <Save size={16} /> {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default function AppointmentDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [showPastVitals, setShowPastVitals] = useState(false);
  const [editingVitalId, setEditingVitalId] = useState<string | null>(null);

  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralForm, setReferralForm] = useState({
    destination_level: "",
    referral_type: "",
    mode_of_transportation: "",
    receiving_facility: "",
    receiving_department: "",
    mode_of_referral: "",
    target_type: "" as "" | "DOCTOR" | "DEPARTMENT",
    target_doctor_email: "",
    target_department_email: "",
    email_subject: "",
    email_body: "",
    reason_for_referral: "",
    clinical_summary: "",
  });
  const [referralError, setReferralError] = useState("");

  const { data: appointment, isLoading, isError } = useAppointment(id);
  const { data: vitalsData, isLoading: isLoadingVitals } =
    useAppointmentVitals(id);
  const { mutate: deleteVital, isPending: isDeleting } = useDeleteVital();

  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useFacilities({ pageSize: 100, isActive: true });
  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useDepartments(referralForm.receiving_facility);
  const { mutate: createReferral, isPending: isSubmittingReferral } =
    useCreateReferral();
  const { data: appointmentReferrals, isLoading: isLoadingReferrals } =
    useReferrals({ appointment_id: id });

  const facilityOptions = useMemo(() => {
    if (!facilitiesData?.results) return [];
    return facilitiesData.results.map((fac) => ({
      label: fac.name,
      value: fac.id,
    }));
  }, [facilitiesData]);

  const departmentOptions = useMemo(() => {
    if (!departmentsData?.results) return [];
    return departmentsData.results.map((dept: { id: string; name: string }) => ({
      label: dept.name,
      value: dept.id,
    }));
  }, [departmentsData]);

  const existingReferral = appointmentReferrals?.results?.[0];

  // Switching target keeps the two email fields mutually exclusive by
  // construction, so the payload can never carry both at once.
  const selectReferralTargetType = (type: "DOCTOR" | "DEPARTMENT") => {
    setReferralForm((current) => ({
      ...current,
      target_type: type,
      target_doctor_email:
        type === "DOCTOR" ? current.target_doctor_email : "",
      target_department_email:
        type === "DEPARTMENT" ? current.target_department_email : "",
    }));
    setReferralError("");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F7FC]">
        <p className="text-gray-500">Loading appointment details...</p>
      </div>
    );
  }

  if (isError || !appointment || !appointment.appointment_id) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F6F7FC]">
        <p className="mb-4 text-gray-500">
          Failed to load appointment details.
        </p>
        <button
          onClick={() => router.back()}
          className="rounded-lg bg-[#046C3F] px-4 py-2 text-white hover:bg-[#035a34]"
        >
          Go Back
        </button>
      </div>
    );
  }

  const colorData = statusColors[appointment.status] || {
    bg: "#F3F4F6",
    text: "#374151",
  };
  const allVitals = vitalsData?.results || [];
  const latestVital = allVitals[0];
  const pastVitals = allVitals.slice(1);

  const handleDeleteVital = (vitalId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this vital record? This action cannot be undone.",
      )
    ) {
      deleteVital({ id: vitalId, appointmentId: id });
    }
  };

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isTelemedicine = referralForm.referral_type === "TELEMEDICINE";
    const isPrimary = referralForm.destination_level === "PRIMARY";
    const isSoftcopy = referralForm.mode_of_referral === "SOFTCOPY";

    if (
      !referralForm.destination_level ||
      !referralForm.referral_type ||
      (!isTelemedicine && !referralForm.mode_of_transportation) ||
      !referralForm.reason_for_referral.trim()
    ) {
      setReferralError("Please complete all required fields.");
      return;
    }

    if (isPrimary && !referralForm.receiving_department) {
      setReferralError("Please select a receiving department.");
      return;
    }

    if (!isPrimary) {
      if (!referralForm.mode_of_referral) {
        setReferralError("Please select a mode of referral.");
        return;
      }
      if (isSoftcopy) {
        if (!referralForm.target_type) {
          setReferralError(
            "Please choose whether this referral is going to a doctor or a department.",
          );
          return;
        }
        const targetEmail =
          referralForm.target_type === "DOCTOR"
            ? referralForm.target_doctor_email
            : referralForm.target_department_email;
        if (!targetEmail.trim()) {
          setReferralError(
            referralForm.target_type === "DOCTOR"
              ? "Please provide the target doctor's email."
              : "Please provide the target department's email.",
          );
          return;
        }
      }
    }

    createReferral(
      {
        appointment: id,
        destination_level: referralForm.destination_level,
        referral_type: referralForm.referral_type,
        mode_of_transportation: isTelemedicine
          ? null
          : referralForm.mode_of_transportation,
        reason_for_referral: referralForm.reason_for_referral,
        clinical_summary: referralForm.clinical_summary,

        receiving_facility: null,
        receiving_department: isPrimary
          ? referralForm.receiving_department
          : null,
        mode_of_referral: isPrimary ? null : referralForm.mode_of_referral,
        // target_type keeps these mutually exclusive, but guard with
        // `|| null` too so a cleared/never-set field is never sent as "".
        target_doctor_email:
          !isPrimary && isSoftcopy && referralForm.target_type === "DOCTOR"
            ? referralForm.target_doctor_email || null
            : null,
        target_department_email:
          !isPrimary && isSoftcopy && referralForm.target_type === "DEPARTMENT"
            ? referralForm.target_department_email || null
            : null,
        email_subject: !isPrimary && isSoftcopy ? referralForm.email_subject : "",
        email_body: !isPrimary && isSoftcopy ? referralForm.email_body : "",
      },
      {
        onSuccess: () => {
          setShowReferralModal(false);
          setReferralForm({
            destination_level: "",
            referral_type: "",
            mode_of_transportation: "",
            receiving_facility: "",
            receiving_department: "",
            mode_of_referral: "",
            target_type: "",
            target_doctor_email: "",
            target_department_email: "",
            email_subject: "",
            email_body: "",
            reason_for_referral: "",
            clinical_summary: "",
          });
        },
        onError: (error: unknown) => {
          setReferralError(
            getApiErrorMessage(
              error,
              "Failed to create referral. Please try again.",
            ),
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Appointment Details"
        breadcrumbs={[
          { label: "Appointments", href: "/nurse-dashboard/appointments" },
          { label: appointment.appointment_id },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8 max-w-8xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => router.push("/nurse-dashboard/appointments")}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors w-fit"
          >
            <ArrowLeft size={18} /> Back to List
          </button>

          <div className="flex items-center gap-3">
            <StatusBadge
              label={appointment.status.replace("_", " ")}
              bgColorHex={colorData.bg}
              textColorHex={colorData.text}
            />
            {isLoadingReferrals ? (
              <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200"></div>
            ) : existingReferral ? (
              <button
                onClick={() =>
                  router.push(
                    `/nurse-dashboard/referrals/${existingReferral.id}`,
                  )
                }
                className="flex items-center gap-2 rounded-lg bg-white border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                <Eye size={16} /> View Referral
              </button>
            ) : (
              <button
                onClick={() => setShowReferralModal(true)}
                className="flex items-center gap-2 rounded-lg bg-white border border-[#046C3F] px-4 py-2 text-sm font-medium text-[#046C3F] transition-colors hover:bg-[#E6F4EA]"
              >
                <Send size={16} /> Refer Patient
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F4EA] text-[#046C3F]">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {appointment.patient_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {appointment.patient_display_id}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Assigned Staff
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {appointment.assigned_staff_name || "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Created By
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {appointment.created_by_name}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
              <ClipboardList size={20} className="text-[#046C3F]" />
              Visit Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 text-gray-400" size={18} />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Date
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {new Date(appointment.appointment_date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 text-gray-400" size={18} />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Time
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {appointment.appointment_time?.slice(0, 5)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <FileText className="mt-0.5 text-gray-400" size={18} />
                <div className="w-full">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Visit Type
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {appointment.visit_type}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2 bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
                  Reason for Visit
                </p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {appointment.reason_for_visit || "No reason provided."}
                </p>
              </div>

              {appointment.notes && (
                <div className="sm:col-span-2 bg-yellow-50/50 rounded-xl p-4 border border-yellow-100">
                  <p className="text-xs font-medium uppercase tracking-wider text-yellow-800 mb-2">
                    Additional Notes
                  </p>
                  <p className="text-sm text-yellow-900 leading-relaxed">
                    {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity size={20} className="text-[#046C3F]" />
                Patient Vitals
              </h3>
              {!isLoadingVitals && (
                <button
                  onClick={() =>
                    router.push(`/nurse-dashboard/vitals/new/${id}`)
                  }
                  className="flex items-center gap-2 rounded-lg bg-[#046C3F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#035a34]"
                >
                  <Plus size={16} /> Add Vitals
                </button>
              )}
            </div>

            {isLoadingVitals ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500">Loading vitals...</p>
              </div>
            ) : latestVital ? (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">
                    Age: {latestVital.age} yrs
                  </span>
                  <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold border border-purple-100">
                    Visit Type: {latestVital.visit_type}
                  </span>
                  <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200">
                    Status: {latestVital.appointment_status?.replace("_", " ")}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${latestVital.appointment_priority === "CRITICAL" ? "bg-red-50 text-red-700 border-red-100" : "bg-orange-50 text-orange-700 border-orange-100"}`}
                  >
                    Priority: {latestVital.appointment_priority}
                  </span>
                </div>

                <div className="flex justify-between items-end border-b border-gray-50 pb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">
                      Latest Reading
                    </h4>
                    <p className="text-xs text-gray-500">
                      Recorded on{" "}
                      {new Date(latestVital.created_at).toLocaleString()} by{" "}
                      {latestVital.recorded_by_name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingVitalId(latestVital.id)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit Vitals"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteVital(latestVital.id)}
                      disabled={isDeleting}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      title="Delete Vitals"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {editingVitalId === latestVital.id ? (
                  <EditVitalForm
                    vital={latestVital}
                    appointmentId={id}
                    onCancel={() => setEditingVitalId(null)}
                    onSuccess={() => setEditingVitalId(null)}
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <VitalMetric
                        label="Blood Pressure"
                        value={latestVital.blood_pressure}
                        unit="mmHg"
                      />
                      <VitalMetric
                        label="Heart Rate"
                        value={latestVital.pulse_rate}
                        unit="bpm"
                      />
                      <VitalMetric
                        label="Temperature"
                        value={latestVital.temperature}
                        unit="°C"
                      />
                      <VitalMetric
                        label="Respiratory Rate"
                        value={latestVital.respiratory_rate}
                        unit="bpm"
                      />
                      <VitalMetric
                        label="Weight"
                        value={latestVital.weight_kg}
                        unit="kg"
                      />
                      <VitalMetric
                        label="Height"
                        value={latestVital.height_cm}
                        unit="cm"
                      />
                      <VitalMetric
                        label="BMI"
                        value={latestVital.bmi}
                        unit=""
                      />
                      <VitalMetric
                        label="SpO2"
                        value={latestVital.spo2}
                        unit="%"
                      />
                    </div>
                    {latestVital.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="font-semibold text-gray-800">
                          Clinical Notes:
                        </span>{" "}
                        {latestVital.notes}
                      </p>
                    )}
                  </>
                )}

                {pastVitals.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => setShowPastVitals(!showPastVitals)}
                      className="flex items-center gap-2 text-sm font-semibold text-[#046C3F] hover:text-[#035a34] transition-colors bg-[#E6F4EA] px-4 py-2 rounded-lg"
                    >
                      {showPastVitals ? (
                        <>
                          <ChevronUp size={16} /> Hide Past Records
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} /> View Past Records (
                          {pastVitals.length})
                        </>
                      )}
                    </button>

                    {showPastVitals && (
                      <div className="mt-6 space-y-6">
                        {pastVitals.map((pastVital: any, index: number) => (
                          <div
                            key={pastVital.id || index}
                            className="bg-gray-50 p-5 rounded-xl border border-gray-200"
                          >
                            <div className="mb-4 flex items-center justify-between pb-3 border-b border-gray-200">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-800">
                                  Recorded on:{" "}
                                  {new Date(
                                    pastVital.created_at,
                                  ).toLocaleString()}
                                </h4>
                                <p className="text-xs font-medium text-gray-500">
                                  By: {pastVital.recorded_by_name}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleDeleteVital(pastVital.id)
                                  }
                                  disabled={isDeleting}
                                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
                                  title="Delete Past Vitals"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <VitalMetric
                                label="BP"
                                value={pastVital.blood_pressure}
                                unit="mmHg"
                              />
                              <VitalMetric
                                label="HR"
                                value={pastVital.pulse_rate}
                                unit="bpm"
                              />
                              <VitalMetric
                                label="Temp"
                                value={pastVital.temperature}
                                unit="°C"
                              />
                              <VitalMetric
                                label="Resp"
                                value={pastVital.respiratory_rate}
                                unit="bpm"
                              />
                              <VitalMetric
                                label="Weight"
                                value={pastVital.weight_kg}
                                unit="kg"
                              />
                              <VitalMetric
                                label="Height"
                                value={pastVital.height_cm}
                                unit="cm"
                              />
                              <VitalMetric
                                label="BMI"
                                value={pastVital.bmi}
                                unit=""
                              />
                              <VitalMetric
                                label="SpO2"
                                value={pastVital.spo2}
                                unit="%"
                              />
                            </div>
                            {pastVital.notes && (
                              <p className="mt-4 text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                <span className="font-semibold text-gray-800">
                                  Notes:
                                </span>{" "}
                                {pastVital.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 px-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                  <Activity size={24} className="text-gray-400" />
                </div>
                <h4 className="text-base font-medium text-gray-900 mb-1">
                  No vitals recorded
                </h4>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  Patient vitals have not been captured for this appointment
                  yet. Please record them to proceed.
                </p>
              </div>
            )}
          </div>
          {existingReferral && (
            <div className="md:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Hospital size={20} className="text-blue-600" />
                  Referral Information
                </h3>
                <button
                  onClick={() =>
                    router.push(
                      `/nurse-dashboard/referrals/${existingReferral.id}`,
                    )
                  }
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Eye size={16} /> View Full Details
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Referral ID
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {existingReferral.referral_id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                    Status
                  </p>
                  <StatusBadge
                    label={
                      existingReferral.status.charAt(0) +
                      existingReferral.status.slice(1).toLowerCase()
                    }
                    bgColorHex={
                      statusColors[existingReferral.status]?.bg || "#F3F4F6"
                    }
                    textColorHex={
                      statusColors[existingReferral.status]?.text || "#374151"
                    }
                  />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Receiving Facility
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {existingReferral.receiving_facility_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Referral Type
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {existingReferral.referral_type.charAt(0) +
                      existingReferral.referral_type.slice(1).toLowerCase()}
                  </p>
                </div>

                <div className="sm:col-span-2 md:col-span-4 bg-gray-50 rounded-xl p-4 mt-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
                    Reason for Referral
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {existingReferral.reason_for_referral ||
                      "No reason provided."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showReferralModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-xl">
              <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Send size={20} className="text-[#046C3F]" />
                  Refer Patient
                </h3>
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleReferralSubmit} className="space-y-6">
                {referralError && (
                  <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {referralError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <SearchableSelect
                    label="Destination Level *"
                    placeholder="Select level"
                    options={DESTINATION_LEVEL_OPTIONS}
                    value={referralForm.destination_level}
                    onChange={(value) =>
                      setReferralForm({
                        ...referralForm,
                        destination_level: value,
                      })
                    }
                  />
                  <SearchableSelect
                    label="Referral Type *"
                    placeholder="Select referral type"
                    options={REFERRAL_TYPE_OPTIONS}
                    value={referralForm.referral_type}
                    onChange={(value) =>
                      setReferralForm({ ...referralForm, referral_type: value })
                    }
                  />
                  {referralForm.referral_type !== "TELEMEDICINE" && (
                    <SearchableSelect
                      label="Mode of Transportation *"
                      placeholder="Select transport mode"
                      options={TRANSPORT_MODE_OPTIONS}
                      value={referralForm.mode_of_transportation}
                      onChange={(value) =>
                        setReferralForm({
                          ...referralForm,
                          mode_of_transportation: value,
                        })
                      }
                    />
                  )}
                </div>

                {referralForm.destination_level === "PRIMARY" && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <SearchableSelect
                      label="Search Facility (To find department) *"
                      placeholder="Select facility"
                      options={facilityOptions}
                      value={referralForm.receiving_facility}
                      isLoading={isLoadingFacilities}
                      onChange={(value) =>
                        setReferralForm({
                          ...referralForm,
                          receiving_facility: value,
                          receiving_department: "",
                        })
                      }
                    />
                    <SearchableSelect
                      label="Receiving Department *"
                      placeholder="Select department"
                      options={departmentOptions}
                      value={referralForm.receiving_department}
                      isLoading={isLoadingDepartments}
                      onChange={(value) =>
                        setReferralForm({
                          ...referralForm,
                          receiving_department: value,
                        })
                      }
                    />
                  </div>
                )}

                {referralForm.destination_level &&
                  referralForm.destination_level !== "PRIMARY" && (
                    <div className="space-y-6">
                      <SearchableSelect
                        label="Mode of Referral *"
                        placeholder="Select mode"
                        options={REFERRAL_MODE_OPTIONS}
                        value={referralForm.mode_of_referral}
                        onChange={(value) => {
                          setReferralForm((current) => ({
                            ...current,
                            mode_of_referral: value,
                            ...(value !== "SOFTCOPY"
                              ? {
                                  target_type: "" as const,
                                  target_doctor_email: "",
                                  target_department_email: "",
                                  email_subject: "",
                                  email_body: "",
                                }
                              : {}),
                          }));
                          setReferralError("");
                        }}
                      />

                      {referralForm.mode_of_referral === "SOFTCOPY" && (
                        <>
                          <div>
                            <p className="mb-2 text-xs text-[#62636C]">
                              Refer To *
                            </p>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <button
                                type="button"
                                onClick={() =>
                                  selectReferralTargetType("DOCTOR")
                                }
                                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                                  referralForm.target_type === "DOCTOR"
                                    ? "border-[#046C3F] bg-[#E8F7F0] text-[#046C3F]"
                                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                <User size={16} />A Specific Doctor
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  selectReferralTargetType("DEPARTMENT")
                                }
                                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                                  referralForm.target_type === "DEPARTMENT"
                                    ? "border-[#046C3F] bg-[#E8F7F0] text-[#046C3F]"
                                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                <Building2 size={16} />A Department
                              </button>
                            </div>
                          </div>

                          {referralForm.target_type === "DOCTOR" && (
                            <FieldShell label="Target Doctor Email *">
                              <input
                                type="email"
                                value={referralForm.target_doctor_email}
                                onChange={(e) =>
                                  setReferralForm({
                                    ...referralForm,
                                    target_doctor_email: e.target.value,
                                  })
                                }
                                placeholder="dr.smith@example.com"
                                className="w-full bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
                              />
                            </FieldShell>
                          )}

                          {referralForm.target_type === "DEPARTMENT" && (
                            <FieldShell label="Target Department Email *">
                              <input
                                type="email"
                                value={referralForm.target_department_email}
                                onChange={(e) =>
                                  setReferralForm({
                                    ...referralForm,
                                    target_department_email: e.target.value,
                                  })
                                }
                                placeholder="surgery@example.com"
                                className="w-full bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
                              />
                            </FieldShell>
                          )}

                          {referralForm.target_type && (
                            <>
                              <FieldShell label="Email Subject">
                                <input
                                  type="text"
                                  value={referralForm.email_subject}
                                  onChange={(e) =>
                                    setReferralForm({
                                      ...referralForm,
                                      email_subject: e.target.value,
                                    })
                                  }
                                  placeholder="Emergency Surgical Transfer..."
                                  className="w-full bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
                                />
                              </FieldShell>
                              <FieldShell label="Email Body" className="py-2">
                                <textarea
                                  value={referralForm.email_body}
                                  onChange={(e) =>
                                    setReferralForm({
                                      ...referralForm,
                                      email_body: e.target.value,
                                    })
                                  }
                                  placeholder="Provide details for the receiving end..."
                                  rows={4}
                                  className="w-full resize-none bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
                                />
                              </FieldShell>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}

                <FieldShell label="Reason for Referral *" className="py-2">
                  <textarea
                    value={referralForm.reason_for_referral}
                    onChange={(e) =>
                      setReferralForm({
                        ...referralForm,
                        reason_for_referral: e.target.value,
                      })
                    }
                    placeholder="Detailed reason for this referral..."
                    rows={4}
                    className="w-full resize-none bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
                  />
                </FieldShell>

                <FieldShell
                  label="Clinical Summary (Optional)"
                  className="py-2"
                >
                  <textarea
                    value={referralForm.clinical_summary}
                    onChange={(e) =>
                      setReferralForm({
                        ...referralForm,
                        clinical_summary: e.target.value,
                      })
                    }
                    placeholder="Additional notes, current medications, or observations"
                    rows={3}
                    className="w-full resize-none bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
                  />
                </FieldShell>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowReferralModal(false)}
                    disabled={isSubmittingReferral}
                    className="h-12 rounded-xl bg-gray-100 px-8 text-base font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReferral}
                    className="h-12 rounded-xl bg-[#046C3F] px-8 text-base font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-70 flex items-center gap-2 justify-center"
                  >
                    {isSubmittingReferral ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send size={18} /> Submit Referral
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
