"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  Clock,
  Search,
  X,
  Loader2,
} from "lucide-react";

import ChewDashboardHeader from "@/src/components/chewDashboard/generics/ChewDashboardHeader";
import ChewBackButton from "@/src/components/chewDashboard/generics/ChewBackButton";
import {
  FieldShell,
  SelectField,
} from "../../nurse-dashboard/appointments/form-helpers";
import AntenatalFields from "../../nurse-dashboard/appointments/antenatal-fields";
import PostnatalFields from "../../nurse-dashboard/appointments/postnatal-fields";

import {
  useCreateAppointment,
  useCreateAncAppointment,
  useCreatePncAppointment,
  useSearchPatients,
  useFacilityStaff,
} from "@/src/hooks/nurses/use-appointments";
import { usePatientDetails } from "@/src/hooks/nurses/use-patients";
import {
  useStates,
  useLgas,
  useWards,
} from "@/src/hooks/general/use-locations";

export type AppointmentFormState = {
  patientName: string;
  patientId: string;
  patientDisplayId: string;
  encounterId: string;
  appointmentId: string;
  date: string;
  time: string;
  visitType: string;
  assignedTo: string;
  reason: string;
  notes: string;

  // Antenatal specific
  lastMenstrualPeriod: string;
  gravida: string;
  parity: string;
  livingChildren: string;
  partnerName: string;
  partnerPhone: string;
  hivStatus: string;
  vdrlSyphilis: string;
  hepatitisB: string;
  hemoglobinAnc: string;
  ttDoseGiven: string;
  iptpDoseGiven: string;
  ironFolateGiven: string;
  riskFactors: string;

  // Postnatal & Shared specific
  timingOfVisit: string;
  vaginalExaminationConducted: string;
  hemoglobinPcv: string;
  urinalysis: string;
  counsellingTopics: string[];
  outcome: string;
  babyId: string;
  babyTemperature: string;
  babyExclusiveBreastfeeding: string;
  babyNeonatalJaundice: string;
  babyOutcome: string;

  // New patient inline registration
  newFirstName: string;
  newLastName: string;
  newMiddleName: string;
  newSex: string;
  newDateOfBirth: string;
  newPhoneNumber: string;
  newState: string;
  newLga: string;
  newWard: string;
  newBloodGroup: string;
  newGenotype: string;
  newNextOfKinName: string;
  newNextOfKinPhone: string;

  // Optional vitals (non-ANC/PNC)
  vitalTemperature: string;
  vitalBloodPressure: string;
  vitalPulseRate: string;
  vitalRespiratoryRate: string;
  vitalWeightKg: string;
  vitalHeightCm: string;
  vitalSpo2: string;
  vitalNotes: string;
};

const BASE_VISIT_TYPES = [
  { label: "General", value: "GENERAL" },
  { label: "Follow Up", value: "FOLLOW_UP" },
  { label: "Antenatal", value: "ANTENATAL" },
  { label: "Postnatal", value: "POSTNATAL" },
  { label: "Immunization", value: "IMMUNIZATION" },
  { label: "Emergency", value: "EMERGENCY" },
  { label: "Other", value: "OTHER" },
];

const SEX_OPTIONS = [
  { label: "Male", value: "M" },
  { label: "Female", value: "F" },
  { label: "Other", value: "O" },
];

const BLOOD_GROUP_OPTIONS = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
  { label: "Unknown", value: "UNKNOWN" },
];

const GENOTYPE_OPTIONS = [
  { label: "AA", value: "AA" },
  { label: "AS", value: "AS" },
  { label: "SS", value: "SS" },
  { label: "AC", value: "AC" },
  { label: "SC", value: "SC" },
  { label: "CC", value: "CC" },
  { label: "Unknown", value: "UNKNOWN" },
];

const INITIAL_FORM: AppointmentFormState = {
  patientName: "",
  patientId: "",
  patientDisplayId: "",
  encounterId: "",
  appointmentId: "",
  date: "",
  time: "",
  visitType: "",
  assignedTo: "",
  reason: "",
  notes: "",
  lastMenstrualPeriod: "",
  gravida: "",
  parity: "",
  livingChildren: "",
  partnerName: "",
  partnerPhone: "",
  hivStatus: "",
  vdrlSyphilis: "",
  hepatitisB: "",
  hemoglobinAnc: "",
  ttDoseGiven: "",
  iptpDoseGiven: "",
  ironFolateGiven: "",
  riskFactors: "",
  timingOfVisit: "",
  vaginalExaminationConducted: "",
  hemoglobinPcv: "",
  urinalysis: "",
  counsellingTopics: [],
  outcome: "",
  babyId: "",
  babyTemperature: "",
  babyExclusiveBreastfeeding: "",
  babyNeonatalJaundice: "",
  babyOutcome: "",
  newFirstName: "",
  newLastName: "",
  newMiddleName: "",
  newSex: "",
  newDateOfBirth: "",
  newPhoneNumber: "",
  newState: "",
  newLga: "",
  newWard: "",
  newBloodGroup: "",
  newGenotype: "",
  newNextOfKinName: "",
  newNextOfKinPhone: "",
  vitalTemperature: "",
  vitalBloodPressure: "",
  vitalPulseRate: "",
  vitalRespiratoryRate: "",
  vitalWeightKg: "",
  vitalHeightCm: "",
  vitalSpo2: "",
  vitalNotes: "",
};

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
  const searchParams = useSearchParams();
  const prefillPatientId = searchParams.get("patientId") || "";

  const [form, setForm] = useState<AppointmentFormState>(INITIAL_FORM);
  const [patientMode, setPatientMode] = useState<"existing" | "new">(
    "existing",
  );
  const [isPatientLocked, setIsPatientLocked] = useState(!!prefillPatientId);
  const [appointmentMode, setAppointmentMode] = useState<"scheduled" | "walkin">("scheduled");
  const [showVitals, setShowVitals] = useState(false);
  const [formError, setFormError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [staffSearchInput, setStaffSearchInput] = useState("");
  const [staffSearchTerm, setStaffSearchTerm] = useState("");

  const [selectedPatientData, setSelectedPatientData] = useState<any>(null);

  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const patientRef = useRef<HTMLDivElement>(null);

  const { data: patientsList = [], isFetching: isLoadingPatients } =
    useSearchPatients(patientSearchTerm);
  const { data: staffList = [], isFetching: isLoadingStaff } =
    useFacilityStaff(staffSearchTerm);
  const { data: prefillPatientData, isLoading: isLoadingPrefillPatient } =
    usePatientDetails(prefillPatientId);

  const { mutate: createAppointment, isPending: isCreating } =
    useCreateAppointment();
  const { mutate: createAncAppointment, isPending: isCreatingAnc } =
    useCreateAncAppointment();
  const { mutate: createPncAppointment, isPending: isCreatingPnc } =
    useCreatePncAppointment();

  const isAnySubmitting = isCreating || isCreatingAnc || isCreatingPnc;

  const assigneeOptions = staffList.map((staff: any) => ({
    label: `${staff.first_name} ${staff.last_name} - ${staff.role}`,
    value: staff.id,
  }));

  const { data: statesList = [], isLoading: isLoadingStates } = useStates();
  const { data: lgasList = [], isLoading: isLoadingLgas } = useLgas(
    form.newState || "",
  );
  const { data: wardsList = [], isLoading: isLoadingWards } = useWards(
    form.newState || "",
    form.newLga || "",
  );

  const stateOptions = statesList.map((state: string) => ({
    label: state,
    value: state,
  }));
  const lgaOptions = lgasList.map((lga: string) => ({
    label: lga,
    value: lga,
  }));
  const wardOptions = wardsList.map((ward: string) => ({
    label: ward,
    value: ward,
  }));

  const handleChange = <K extends keyof AppointmentFormState>(
    field: K,
    value: AppointmentFormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleNewPatientLocationChange = (
    field: "newState" | "newLga" | "newWard",
    value: string,
  ) => {
    setFormError("");
    if (field === "newState") {
      setForm((current) => ({
        ...current,
        newState: value,
        newLga: "",
        newWard: "",
      }));
    } else if (field === "newLga") {
      setForm((current) => ({ ...current, newLga: value, newWard: "" }));
    } else {
      setForm((current) => ({ ...current, newWard: value }));
    }
  };

  useEffect(() => {
    if (!prefillPatientData) return;
    setForm((current) => ({
      ...current,
      patientId: prefillPatientData.id,
      patientDisplayId: prefillPatientData.profile?.patient_id || "",
      patientName:
        `${prefillPatientData.first_name} ${prefillPatientData.last_name}`.trim(),
    }));
    setSelectedPatientData(prefillPatientData);
  }, [prefillPatientData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPatientSearchTerm(form.patientName);
    }, 800);
    return () => clearTimeout(handler);
  }, [form.patientName]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setStaffSearchTerm(staffSearchInput);
    }, 800);
    return () => clearTimeout(handler);
  }, [staffSearchInput]);

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

  const isAncPnc =
    form.visitType === "ANTENATAL" || form.visitType === "POSTNATAL";

  const availableVisitTypes = BASE_VISIT_TYPES.filter((type) => {
    if (!selectedPatientData) return true;
    const maternalStatus = selectedPatientData.current_maternal_episode?.status;
    if (maternalStatus === "ACTIVE" && type.value === "POSTNATAL") return false;
    if (maternalStatus === "DELIVERED" && type.value === "ANTENATAL")
      return false;
    return true;
  });

  const maternalEpisode = selectedPatientData?.current_maternal_episode;
  const showHistoryFields = form.visitType === "ANTENATAL" && !maternalEpisode;

  const handlePatientModeChange = (mode: "existing" | "new") => {
    setPatientMode(mode);
    setShowVitals(false);
    setFormError("");
  };

  const handleAppointmentModeChange = (mode: "scheduled" | "walkin") => {
    setAppointmentMode(mode);
    if (mode === "walkin") {
      const now = new Date();
      handleChange("date", now.toISOString().split("T")[0]);
      handleChange("time", now.toTimeString().slice(0, 5));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (patientMode === "existing" && !form.patientId) {
      setFormError("Please search and select a patient from the list.");
      return;
    }

    if (patientMode === "new") {
      if (
        !form.newFirstName ||
        !form.newLastName ||
        !form.newSex ||
        !form.newDateOfBirth
      ) {
        setFormError(
          "Please complete the required new patient fields: First Name, Last Name, Sex, and Date of Birth.",
        );
        return;
      }
    }

    if (!form.visitType || !form.assignedTo || !form.date || !form.time) {
      setFormError("Please complete all required appointment fields.");
      return;
    }

    if (
      !form.reason.trim() &&
      form.visitType !== "POSTNATAL" &&
      form.visitType !== "ANTENATAL"
    ) {
      setFormError("Please enter a reason for the visit.");
      return;
    }

    if (form.visitType === "POSTNATAL") {
      if (
        !form.babyId ||
        !form.babyTemperature ||
        !form.babyExclusiveBreastfeeding ||
        !form.babyNeonatalJaundice ||
        !form.babyOutcome
      ) {
        setFormError(
          "Please complete all mandatory baby assessment fields for a postnatal visit.",
        );
        return;
      }
    }

    const formattedTime = `${form.time}:00.000Z`;

    const handleSuccess = () => {
      setToastVisible(true);
      setTimeout(() => {
        router.push("/chew-dashboard/appointments");
      }, 2000);
    };

    const handleError = (error: any) => {
      const errData = error?.response?.data;
      const message =
        errData?.message ||
        errData?.detail ||
        (typeof errData === "object" && !Array.isArray(errData)
          ? Object.values(errData).flat().join(". ")
          : null) ||
        "Failed to create appointment. Please try again.";
      setFormError(message);
    };

    if (form.visitType === "ANTENATAL") {
      const ancPayload: any = {
        ...(patientMode === "existing"
          ? { patient_id: form.patientId }
          : {
              first_name: form.newFirstName,
              last_name: form.newLastName,
              sex: form.newSex,
              date_of_birth: form.newDateOfBirth,
              ...(form.newMiddleName && { middle_name: form.newMiddleName }),
              ...(form.newPhoneNumber && { phone_number: form.newPhoneNumber }),
              ...(form.newState && { state: form.newState }),
              ...(form.newLga && { lga: form.newLga }),
              ...(form.newWard && { ward: form.newWard }),
              ...(form.newBloodGroup && { blood_group: form.newBloodGroup }),
              ...(form.newGenotype && { genotype: form.newGenotype }),
              ...(form.newNextOfKinName && { next_of_kin_name: form.newNextOfKinName }),
              ...(form.newNextOfKinPhone && { next_of_kin_phone: form.newNextOfKinPhone }),
            }),
        assigned_to_id: form.assignedTo,
        appointment_date: form.date,
        appointment_time: formattedTime,
        clinical_notes: form.notes || form.reason,
        hiv_status: form.hivStatus,
        vdrl_syphilis: form.vdrlSyphilis,
        hepatitis_b: form.hepatitisB,
        hemoglobin: form.hemoglobinAnc,
        urinalysis: form.urinalysis,
        tt_dose_given: form.ttDoseGiven,
        iptp_dose_given: form.iptpDoseGiven,
        iron_folate_given: form.ironFolateGiven === "true",
        risk_factors: form.riskFactors,
      };

      if (showHistoryFields) {
        ancPayload.last_menstrual_period = form.lastMenstrualPeriod;
        ancPayload.gravida = Number(form.gravida) || 0;
        ancPayload.parity = Number(form.parity) || 0;
        ancPayload.living_children = Number(form.livingChildren) || 0;
        ancPayload.partner_name = form.partnerName;
        ancPayload.partner_phone = form.partnerPhone;
      }

      if (showVitals) {
        if (form.vitalTemperature) ancPayload.temperature = parseFloat(form.vitalTemperature);
        if (form.vitalBloodPressure) ancPayload.blood_pressure = form.vitalBloodPressure;
        if (form.vitalPulseRate) ancPayload.pulse_rate = parseInt(form.vitalPulseRate);
        if (form.vitalRespiratoryRate) ancPayload.respiratory_rate = parseInt(form.vitalRespiratoryRate);
        if (form.vitalWeightKg) ancPayload.weight_kg = parseFloat(form.vitalWeightKg);
        if (form.vitalHeightCm) ancPayload.height_cm = parseFloat(form.vitalHeightCm);
        if (form.vitalSpo2) ancPayload.spo2 = parseInt(form.vitalSpo2);
        if (form.vitalNotes) ancPayload.vitals_notes = form.vitalNotes;
      }

      createAncAppointment(ancPayload, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    } else if (form.visitType === "POSTNATAL") {
      const pncPayload: any = {
        ...(patientMode === "existing"
          ? { patient_id: form.patientId }
          : {
              first_name: form.newFirstName,
              last_name: form.newLastName,
              sex: form.newSex,
              date_of_birth: form.newDateOfBirth,
              ...(form.newMiddleName && { middle_name: form.newMiddleName }),
              ...(form.newPhoneNumber && { phone_number: form.newPhoneNumber }),
              ...(form.newState && { state: form.newState }),
              ...(form.newLga && { lga: form.newLga }),
              ...(form.newWard && { ward: form.newWard }),
              ...(form.newBloodGroup && { blood_group: form.newBloodGroup }),
              ...(form.newGenotype && { genotype: form.newGenotype }),
              ...(form.newNextOfKinName && { next_of_kin_name: form.newNextOfKinName }),
              ...(form.newNextOfKinPhone && { next_of_kin_phone: form.newNextOfKinPhone }),
            }),
        appointment_date: form.date,
        appointment_time: `${form.time}:00`,
        timing_of_visit: form.timingOfVisit,
        vaginal_examination_conducted:
          form.vaginalExaminationConducted === "true",
        hemoglobin_pcv: parseFloat(form.hemoglobinPcv) || 0,
        urinalysis: form.urinalysis,
        counselling_topics: form.counsellingTopics,
        outcome: form.outcome,
        clinical_notes: form.notes || form.reason,
        baby_assessments: [
          {
            baby_id: form.babyId,
            cord_care_assessed: true,
            temperature: parseFloat(form.babyTemperature) || 36.6,
            exclusive_breastfeeding: form.babyExclusiveBreastfeeding || "Yes",
            newborn_danger_signs: [],
            neonatal_jaundice: form.babyNeonatalJaundice === "true",
            outcome: form.babyOutcome || "HEALTHY",
          },
        ],
      };

      if (showVitals) {
        if (form.vitalTemperature) pncPayload.temperature = parseFloat(form.vitalTemperature);
        if (form.vitalBloodPressure) pncPayload.blood_pressure = form.vitalBloodPressure;
        if (form.vitalPulseRate) pncPayload.pulse_rate = parseInt(form.vitalPulseRate);
        if (form.vitalRespiratoryRate) pncPayload.respiratory_rate = parseInt(form.vitalRespiratoryRate);
        if (form.vitalWeightKg) pncPayload.weight_kg = parseFloat(form.vitalWeightKg);
        if (form.vitalHeightCm) pncPayload.height_cm = parseFloat(form.vitalHeightCm);
        if (form.vitalSpo2) pncPayload.spo2 = parseInt(form.vitalSpo2);
        if (form.vitalNotes) pncPayload.vitals_notes = form.vitalNotes;
      }

      createPncAppointment(pncPayload, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    } else {
      const payload: Record<string, any> = {
        appointment_date: form.date,
        appointment_time: formattedTime,
        visit_type: form.visitType,
        reason_for_visit: form.reason,
        notes: form.notes,
        assigned_to: form.assignedTo,
      };

      if (patientMode === "existing") {
        payload.patient = form.patientId;
      } else {
        payload.first_name = form.newFirstName;
        payload.last_name = form.newLastName;
        payload.sex = form.newSex;
        payload.date_of_birth = form.newDateOfBirth;
        if (form.newMiddleName) payload.middle_name = form.newMiddleName;
        if (form.newPhoneNumber) payload.phone_number = form.newPhoneNumber;
        if (form.newState) payload.state = form.newState;
        if (form.newLga) payload.lga = form.newLga;
        if (form.newWard) payload.ward = form.newWard;
        if (form.newBloodGroup) payload.blood_group = form.newBloodGroup;
        if (form.newGenotype) payload.genotype = form.newGenotype;
        if (form.newNextOfKinName)
          payload.next_of_kin_name = form.newNextOfKinName;
        if (form.newNextOfKinPhone)
          payload.next_of_kin_phone = form.newNextOfKinPhone;
      }

      if (showVitals) {
        if (form.vitalTemperature)
          payload.temperature = parseFloat(form.vitalTemperature);
        if (form.vitalBloodPressure)
          payload.blood_pressure = form.vitalBloodPressure;
        if (form.vitalPulseRate)
          payload.pulse_rate = parseInt(form.vitalPulseRate);
        if (form.vitalRespiratoryRate)
          payload.respiratory_rate = parseInt(form.vitalRespiratoryRate);
        if (form.vitalWeightKg)
          payload.weight_kg = parseFloat(form.vitalWeightKg);
        if (form.vitalHeightCm)
          payload.height_cm = parseFloat(form.vitalHeightCm);
        if (form.vitalSpo2) payload.spo2 = parseInt(form.vitalSpo2);
        if (form.vitalNotes) payload.vitals_notes = form.vitalNotes;
      }

      createAppointment(payload, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    }
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    router.push("/chew-dashboard/appointments");
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <ChewDashboardHeader
        title="Appointments"
        breadcrumbs={[
          { label: "Appointments", href: "/chew-dashboard/appointments" },
          { label: "New Appointment" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <ChewBackButton onClick={handleCancel} />

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

            {/* Walk-in vs Scheduled toggle — PNC only */}
            {form.visitType === "POSTNATAL" && (
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Appointment Type</p>
                <div className="flex gap-6 rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="radio"
                      checked={appointmentMode === "scheduled"}
                      onChange={() => handleAppointmentModeChange("scheduled")}
                      className="h-4 w-4 text-[#046C3F] focus:ring-[#046C3F]"
                    />
                    Schedule Appointment
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="radio"
                      checked={appointmentMode === "walkin"}
                      onChange={() => handleAppointmentModeChange("walkin")}
                      className="h-4 w-4 text-[#046C3F] focus:ring-[#046C3F]"
                    />
                    Walk-in Registration
                  </label>
                </div>
                {appointmentMode === "walkin" && (
                  <p className="mt-1.5 text-xs text-[#046C3F]">
                    Date and time have been pre-filled to now. You can adjust them if needed.
                  </p>
                )}
              </div>
            )}

            {/* Patient Mode Toggle */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Patient</p>
              <div className="flex gap-6 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    checked={patientMode === "existing"}
                    onChange={() => handlePatientModeChange("existing")}
                    className="h-4 w-4 text-[#046C3F] focus:ring-[#046C3F]"
                  />
                  Existing Patient
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    checked={patientMode === "new"}
                    onChange={() => handlePatientModeChange("new")}
                    className="h-4 w-4 text-[#046C3F] focus:ring-[#046C3F]"
                  />
                  New Patient
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Existing patient search */}
              {patientMode === "existing" && (
                <>
                  <div ref={patientRef} className="relative z-10">
                    <FieldShell label="Patient Name">
                      {isPatientLocked ? (
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate text-base text-gray-700">
                            {isLoadingPrefillPatient
                              ? "Loading patient..."
                              : form.patientName}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsPatientLocked(false);
                              handleChange("patientId", "");
                              handleChange("patientDisplayId", "");
                              handleChange("patientName", "");
                              handleChange("visitType", "");
                              setSelectedPatientData(null);
                            }}
                            className="shrink-0 text-sm font-medium text-[#046C3F] hover:underline"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Search size={24} className="shrink-0 text-gray-900" />
                          <input
                            value={form.patientName}
                            onChange={(e) => {
                              handleChange("patientName", e.target.value);
                              if (form.patientId) {
                                handleChange("patientId", "");
                                handleChange("patientDisplayId", "");
                                handleChange("visitType", "");
                                setSelectedPatientData(null);
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
                      )}
                    </FieldShell>

                    {!isPatientLocked && showPatientDropdown && (
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
                                  patient.profile?.patient_id || "",
                                );
                                handleChange(
                                  "patientName",
                                  `${patient.first_name} ${patient.last_name}`,
                                );
                                handleChange("visitType", "");
                                setSelectedPatientData(patient);
                                setShowPatientDropdown(false);
                              }}
                              className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50"
                            >
                              <div className="font-medium text-gray-900">
                                {patient.first_name} {patient.last_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {patient.profile?.patient_id || "N/A"} •{" "}
                                {patient.phone_number || "No Phone"}
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
                </>
              )}

              {/* New patient inline registration fields */}
              {patientMode === "new" && (
                <>
                  <FieldShell label="First Name *">
                    <input
                      value={form.newFirstName}
                      onChange={(e) =>
                        handleChange("newFirstName", e.target.value)
                      }
                      placeholder="First name"
                      className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>

                  <FieldShell label="Last Name *">
                    <input
                      value={form.newLastName}
                      onChange={(e) =>
                        handleChange("newLastName", e.target.value)
                      }
                      placeholder="Last name"
                      className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>

                  <SelectField
                    label="Sex *"
                    placeholder="Select sex"
                    options={SEX_OPTIONS}
                    value={form.newSex}
                    onChange={(value) => handleChange("newSex", value)}
                  />

                  <FieldShell label="Date of Birth *">
                    <input
                      type="date"
                      value={form.newDateOfBirth}
                      onChange={(e) =>
                        handleChange("newDateOfBirth", e.target.value)
                      }
                      className="w-full bg-transparent text-base text-gray-700 outline-none"
                    />
                  </FieldShell>

                  <FieldShell label="Middle Name (Optional)">
                    <input
                      value={form.newMiddleName}
                      onChange={(e) =>
                        handleChange("newMiddleName", e.target.value)
                      }
                      placeholder="Middle name"
                      className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>

                  <FieldShell label="Phone Number (Optional)">
                    <input
                      type="tel"
                      value={form.newPhoneNumber}
                      onChange={(e) =>
                        handleChange("newPhoneNumber", e.target.value)
                      }
                      placeholder="e.g. 08012345678"
                      className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>

                  <SelectField
                    label="State (Optional)"
                    placeholder={
                      isLoadingStates ? "Loading..." : "Select state"
                    }
                    options={stateOptions}
                    value={form.newState}
                    searchable
                    isLoading={isLoadingStates}
                    onChange={(value) =>
                      handleNewPatientLocationChange("newState", value)
                    }
                  />

                  <SelectField
                    label="LGA (Optional)"
                    placeholder={
                      !form.newState
                        ? "Select state first"
                        : isLoadingLgas
                          ? "Loading..."
                          : "Select LGA"
                    }
                    options={lgaOptions}
                    value={form.newLga}
                    searchable
                    isLoading={isLoadingLgas}
                    disabled={!form.newState}
                    onChange={(value) =>
                      handleNewPatientLocationChange("newLga", value)
                    }
                  />

                  <SelectField
                    label="Ward (Optional)"
                    placeholder={
                      !form.newLga
                        ? "Select LGA first"
                        : isLoadingWards
                          ? "Loading..."
                          : "Select Ward"
                    }
                    options={wardOptions}
                    value={form.newWard}
                    searchable
                    isLoading={isLoadingWards}
                    disabled={!form.newLga}
                    onChange={(value) =>
                      handleNewPatientLocationChange("newWard", value)
                    }
                  />

                  <SelectField
                    label="Blood Group (Optional)"
                    placeholder="Select blood group"
                    options={BLOOD_GROUP_OPTIONS}
                    value={form.newBloodGroup}
                    onChange={(value) => handleChange("newBloodGroup", value)}
                  />

                  <SelectField
                    label="Genotype (Optional)"
                    placeholder="Select genotype"
                    options={GENOTYPE_OPTIONS}
                    value={form.newGenotype}
                    onChange={(value) => handleChange("newGenotype", value)}
                  />

                  <FieldShell label="Next of Kin Name (Optional)">
                    <input
                      value={form.newNextOfKinName}
                      onChange={(e) =>
                        handleChange("newNextOfKinName", e.target.value)
                      }
                      placeholder="NOK full name"
                      className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>

                  <FieldShell label="Next of Kin Phone (Optional)">
                    <input
                      type="tel"
                      value={form.newNextOfKinPhone}
                      onChange={(e) =>
                        handleChange("newNextOfKinPhone", e.target.value)
                      }
                      placeholder="NOK phone number"
                      className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>
                </>
              )}

              <FieldShell label="Date">
                <div className="flex items-center gap-3">
                  <CalendarDays size={22} className="shrink-0 text-gray-500" />
                  <input
                    value={form.date}
                    type="date"
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="w-full bg-transparent text-base text-gray-700 outline-none"
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
                    className="w-full bg-transparent text-base text-gray-700 outline-none"
                  />
                </div>
              </FieldShell>

              <SelectField
                label="Visit Type"
                placeholder="Select"
                options={availableVisitTypes}
                value={form.visitType}
                onChange={(value) => {
                  handleChange("visitType", value);
                  setShowVitals(false);
                  if (value !== "POSTNATAL") setAppointmentMode("scheduled");
                }}
              />
              <SelectField
                label="Assigned To"
                placeholder={
                  isLoadingStaff && staffList.length === 0
                    ? "Loading staff..."
                    : "Select Staff"
                }
                options={assigneeOptions}
                searchable
                isLoading={isLoadingStaff}
                value={form.assignedTo}
                onChange={(value) => handleChange("assignedTo", value)}
                onSearchChange={(term) => setStaffSearchInput(term)}
              />

              {form.visitType === "ANTENATAL" && (
                <AntenatalFields
                  form={form}
                  onChange={handleChange}
                  showHistoryFields={showHistoryFields}
                />
              )}

              {form.visitType === "POSTNATAL" && (
                <PostnatalFields
                  form={form}
                  onChange={handleChange}
                  patientId={form.patientId}
                />
              )}
            </div>

            <FieldShell
              label={
                isAncPnc ? "Clinical Notes / Reason" : "Reason for Visit"
              }
            >
              <textarea
                value={form.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                placeholder={
                  isAncPnc ? "Patient doing well..." : "Enter reason here"
                }
                rows={4}
                className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
              />
            </FieldShell>

            <FieldShell label="Additional Notes (Optional)">
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Enter notes here"
                rows={3}
                className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
              />
            </FieldShell>

            {/* Optional vitals */}
            <div className="border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={() => setShowVitals((v) => !v)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Activity size={16} className="text-[#046C3F]" />
                  {showVitals
                    ? "Hide Vitals"
                    : "Record Vitals Now (Optional)"}
                  <ChevronDown
                    size={16}
                    className={`ml-1 text-gray-500 transition-transform ${showVitals ? "rotate-180" : ""}`}
                  />
                </button>

                {showVitals && (
                  <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FieldShell label="Temperature (°C)">
                      <input
                        type="number"
                        step="0.1"
                        value={form.vitalTemperature}
                        onChange={(e) =>
                          handleChange("vitalTemperature", e.target.value)
                        }
                        placeholder="e.g. 37.5"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                    </FieldShell>

                    <FieldShell label="Blood Pressure">
                      <input
                        type="text"
                        value={form.vitalBloodPressure}
                        onChange={(e) =>
                          handleChange("vitalBloodPressure", e.target.value)
                        }
                        placeholder="e.g. 120/80"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                    </FieldShell>

                    <FieldShell label="Pulse Rate (BPM)">
                      <input
                        type="number"
                        value={form.vitalPulseRate}
                        onChange={(e) =>
                          handleChange("vitalPulseRate", e.target.value)
                        }
                        placeholder="e.g. 72"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                    </FieldShell>

                    <FieldShell label="Respiratory Rate (breaths/min)">
                      <input
                        type="number"
                        value={form.vitalRespiratoryRate}
                        onChange={(e) =>
                          handleChange("vitalRespiratoryRate", e.target.value)
                        }
                        placeholder="e.g. 16"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                    </FieldShell>

                    <FieldShell label="Weight (kg)">
                      <input
                        type="number"
                        step="0.1"
                        value={form.vitalWeightKg}
                        onChange={(e) =>
                          handleChange("vitalWeightKg", e.target.value)
                        }
                        placeholder="e.g. 65.5"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                    </FieldShell>

                    <FieldShell label="Height (cm)">
                      <input
                        type="number"
                        step="0.1"
                        value={form.vitalHeightCm}
                        onChange={(e) =>
                          handleChange("vitalHeightCm", e.target.value)
                        }
                        placeholder="e.g. 170.0"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                    </FieldShell>

                    <FieldShell label="SpO₂ (%)">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={form.vitalSpo2}
                        onChange={(e) =>
                          handleChange("vitalSpo2", e.target.value)
                        }
                        placeholder="e.g. 98"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                    </FieldShell>

                    <FieldShell label="Vitals Notes (Optional)">
                      <input
                        type="text"
                        value={form.vitalNotes}
                        onChange={(e) =>
                          handleChange("vitalNotes", e.target.value)
                        }
                        placeholder="Any relevant vitals notes"
                        className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
                      />
                    </FieldShell>
                  </div>
                )}
              </div>

            <div className="flex flex-col items-stretch gap-4 pt-1 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isAnySubmitting}
                className="h-14 rounded-xl bg-[#B9BDC9] px-12 text-lg font-medium text-white transition-colors hover:bg-[#A9AEBC] disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAnySubmitting}
                className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-10 text-lg font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-70"
              >
                {isAnySubmitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <CalendarDays size={20} />
                )}
                {isAnySubmitting ? "Scheduling..." : "Schedule"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
