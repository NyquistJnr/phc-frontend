"use client";

import { FieldShell, SelectField, MultiSelectField } from "./form-helpers";
import { AppointmentFormState } from "./CreateAppointment";
import { usePatientChildren } from "@/src/hooks/nurses/use-appointments";

const YES_NO_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const VAGINAL_EXAM_OPTIONS = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const OUTCOME_CHOICES = [
  { label: "Treated", value: "TREATED" },
  { label: "Admitted", value: "ADMITTED" },
  { label: "Referred Out", value: "REFERRED" },
];

const BABY_OUTCOME_CHOICES = [
  { label: "Healthy / Discharged", value: "HEALTHY" },
  { label: "Admitted to NICU", value: "ADMITTED" },
  { label: "Referred Out", value: "REFERRED" },
];

const COUNSELLING_TOPICS_OPTIONS = [
  { label: "Family Planning", value: "Family Planning" },
  { label: "Nutrition", value: "Nutrition" },
  { label: "Exclusive Breastfeeding", value: "Exclusive Breastfeeding" },
  { label: "Hygiene", value: "Hygiene" },
  { label: "Immunization", value: "Immunization" },
  { label: "Cord Care", value: "Cord Care" },
  { label: "Danger Signs", value: "Danger Signs" },
];

interface Props {
  form: AppointmentFormState;
  patientId: string;
  onChange: <K extends keyof AppointmentFormState>(
    field: K,
    value: AppointmentFormState[K],
  ) => void;
}

export default function PostnatalFields({ form, patientId, onChange }: Props) {
  const { data: childrenList = [], isFetching: isLoadingChildren } =
    usePatientChildren(patientId);

  const childOptions = childrenList.map((child: any) => ({
    label: `${child.first_name} ${child.last_name} (${child.profile?.patient_id || "Unknown ID"})`,
    value: child.id,
  }));

  return (
    <>
      <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">
          Postnatal Encounter Details
        </h3>
      </div>

      <FieldShell label="Timing of Visit">
        <input
          type="text"
          value={form.timingOfVisit}
          onChange={(e) => onChange("timingOfVisit", e.target.value)}
          placeholder="e.g., 6 Weeks, 24 Hours, Day 3"
          className="w-full bg-transparent text-base text-gray-700 outline-none"
        />
      </FieldShell>
      <SelectField
        label="Vaginal Exam Conducted?"
        placeholder="Select"
        options={VAGINAL_EXAM_OPTIONS}
        value={form.vaginalExaminationConducted}
        onChange={(val) => onChange("vaginalExaminationConducted", val)}
      />
      <FieldShell label="Hemoglobin PCV">
        <input
          type="number"
          step="0.1"
          value={form.hemoglobinPcv}
          onChange={(e) => onChange("hemoglobinPcv", e.target.value)}
          placeholder="e.g., 34.5"
          className="w-full bg-transparent text-base text-gray-700 outline-none"
        />
      </FieldShell>
      <FieldShell label="Urinalysis Result">
        <input
          type="text"
          value={form.urinalysis}
          onChange={(e) => onChange("urinalysis", e.target.value)}
          placeholder="e.g., No protein found"
          className="w-full bg-transparent text-base text-gray-700 outline-none"
        />
      </FieldShell>

      <MultiSelectField
        label="Counselling Topics"
        placeholder="Select topics..."
        options={COUNSELLING_TOPICS_OPTIONS}
        value={form.counsellingTopics}
        onChange={(val) => onChange("counsellingTopics", val)}
      />

      <SelectField
        label="Outcome"
        placeholder="Select Outcome"
        options={OUTCOME_CHOICES}
        value={form.outcome}
        onChange={(val) => onChange("outcome", val)}
      />

      <div className="col-span-1 md:col-span-2 pt-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Baby Assessment (Required)
        </h4>
      </div>

      <SelectField
        label="Select Baby"
        placeholder={isLoadingChildren ? "Loading babies..." : "Select Baby"}
        options={childOptions}
        value={form.babyId}
        isLoading={isLoadingChildren}
        onChange={(val) => onChange("babyId", val)}
      />

      <FieldShell label="Baby Temperature (°C)">
        <input
          type="number"
          step="0.1"
          value={form.babyTemperature}
          onChange={(e) => onChange("babyTemperature", e.target.value)}
          placeholder="36.6"
          className="w-full bg-transparent text-base text-gray-700 outline-none"
        />
      </FieldShell>

      <SelectField
        label="Exclusive Breastfeeding?"
        placeholder="Select"
        options={YES_NO_OPTIONS}
        value={form.babyExclusiveBreastfeeding}
        onChange={(val) => onChange("babyExclusiveBreastfeeding", val)}
      />

      <SelectField
        label="Neonatal Jaundice?"
        placeholder="Select"
        options={VAGINAL_EXAM_OPTIONS}
        value={form.babyNeonatalJaundice}
        onChange={(val) => onChange("babyNeonatalJaundice", val)}
      />

      <SelectField
        label="Baby Outcome"
        placeholder="Select Baby Outcome"
        options={BABY_OUTCOME_CHOICES}
        value={form.babyOutcome}
        onChange={(val) => onChange("babyOutcome", val)}
      />
    </>
  );
}
