import {
  CalendarDays,
  Dumbbell,
  FlaskConical,
  Heart,
  Save,
  Search,
  Shield,
  User,
} from "lucide-react";

import { FieldShell } from "../../generic/ui/FieldShell";
import { SectionCard } from "../../generic/ui/SectionCard";
import { SelectField } from "../../generic/ui/SelectField";
import { TextField } from "../../generic/ui/TextField";
import {
  BLOOD_GROUP_OPTIONS,
  GENOTYPE_OPTIONS,
  MaternalForm,
  SELECT_OPTIONS,
  YES_NO_OPTIONS,
} from "./type";

interface AncVisitFormProps {
  form: MaternalForm;
  update: (field: string, value: string) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function AncVisitForm({
  form,
  update,
  onCancel,
  onSubmit,
}: AncVisitFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <SectionCard
        title="Patient & Facility Information"
        icon={<User size={18} />}
      >
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <TextField
            label="Patient Name"
            value={form.patientName}
            placeholder="Search patient by name or ID"
            icon={<Search size={22} />}
            onChange={(value) => update("patientName", value)}
            readOnly
          />
          <TextField
            label="Facility"
            value={form.facility}
            readOnly
            onChange={(value) => update("facility", value)}
          />
          <TextField
            label="Patient ID"
            value={form.patientId}
            readOnly
            onChange={(value) => update("patientId", value)}
          />
          <TextField
            label="Encounter ID"
            value={form.encounterId}
            readOnly
            onChange={(value) => update("encounterId", value)}
          />
          <TextField
            label="Patient Age"
            value={form.patientAge}
            placeholder="Patient age"
            onChange={(value) => update("patientAge", value)}
          />
          <SelectField
            label="ANC Attendance Type"
            options={SELECT_OPTIONS}
            value={form.attendanceType}
            onChange={(value) => update("attendanceType", value)}
          />
          <TextField
            label="Date of Encounter"
            value={form.encounterDate}
            icon={<CalendarDays size={18} />}
            onChange={(value) => update("encounterDate", value)}
            type="date"
          />
          <TextField
            label="Mother's Patient/Client Card Number (Optional)"
            value={form.cardNumber}
            placeholder="Existing PHC card"
            onChange={(value) => update("cardNumber", value)}
          />
          <TextField
            label="Last Menstrual Period (LMP)"
            value={form.lmp}
            icon={<CalendarDays size={18} />}
            onChange={(value) => update("lmp", value)}
            type="date"
          />
          <TextField
            label="Expected Date of Delivery (EDD)"
            value={form.edd}
            icon={<CalendarDays size={18} />}
            onChange={(value) => update("edd", value)}
            type="date"
          />
        </div>
      </SectionCard>

      <SectionCard title="Obstetric History" icon={<Heart size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          <TextField
            label="Gravida"
            value={form.gravida}
            placeholder="Total pregnancies"
            onChange={(value) => update("gravida", value)}
          />
          <TextField
            label="Parity"
            value={form.parity}
            placeholder="Number of previous births"
            onChange={(value) => update("parity", value)}
          />
          <TextField
            label="Living children"
            value={form.livingChildren}
            placeholder="Number alive"
            onChange={(value) => update("livingChildren", value)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Physical Measurements" icon={<Dumbbell size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <TextField
            label="Height (cm)"
            value={form.height}
            placeholder="0"
            onChange={(value) => update("height", value)}
          />
          <TextField
            label="Weight (kg)"
            value={form.weight}
            placeholder="0"
            onChange={(value) => update("weight", value)}
          />
          <TextField
            label="Blood Pressure"
            value={form.bloodPressure}
            placeholder="0"
            onChange={(value) => update("bloodPressure", value)}
          />
          <TextField
            label="BMI"
            value={form.bmi}
            readOnly
            onChange={(value) => update("bmi", value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Laboratory Investigations"
        icon={<FlaskConical size={18} />}
      >
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField
            label="Blood Group"
            options={BLOOD_GROUP_OPTIONS}
            value={form.bloodGroup}
            onChange={(value) => update("bloodGroup", value)}
          />
          <SelectField
            label="Genotype"
            options={GENOTYPE_OPTIONS}
            value={form.genotype}
            onChange={(value) => update("genotype", value)}
          />
          <SelectField
            label="HIV Status"
            options={[
              "Select Status",
              "Negative",
              "Positive",
              "Unknown/Not tested",
            ]}
            value={form.hivStatus}
            onChange={(value) => update("hivStatus", value)}
          />
          <SelectField
            label="VDRL (Syphilis)"
            options={["Select Status", "Negative", "Positive", "Not Done"]}
            value={form.vdrl}
            onChange={(value) => update("vdrl", value)}
          />
          <SelectField
            label="Hepatitis B"
            options={["Select Status", "Negative", "Positive", "Not Done"]}
            value={form.hepatitisB}
            onChange={(value) => update("hepatitisB", value)}
          />
          <TextField
            label="Hemoglobin (g/dL)"
            value={form.hemoglobin}
            placeholder="0"
            onChange={(value) => update("hemoglobin", value)}
          />
          <TextField
            label="Urinalysis"
            value={form.urinalysis}
            placeholder="Protein, glucose etc"
            onChange={(value) => update("urinalysis", value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Interventions (1st Visit)"
        icon={<Shield size={18} />}
      >
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <TextField
            label="TT1 Date"
            value={form.tt1}
            icon={<CalendarDays size={18} />}
            onChange={(value) => update("tt1", value)}
            type="date"
          />
          <TextField
            label="IPT1 Date"
            value={form.ipt1}
            icon={<CalendarDays size={18} />}
            onChange={(value) => update("ipt1", value)}
            type="date"
          />
          <SelectField
            label="Iron/Folate Given"
            options={YES_NO_OPTIONS}
            value={form.ironFolate}
            onChange={(value) => update("ironFolate", value)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Risk Assessment" icon={<Shield size={18} />}>
        <div className="max-w-4xl space-y-6">
          {(["riskFactors", "allergies", "additionalNotes"] as const).map(
            (field) => (
              <FieldShell
                key={field}
                label={
                  field === "riskFactors"
                    ? "Risk Factors"
                    : field === "allergies"
                      ? "Known Allergies"
                      : "Additional Notes"
                }
              >
                <textarea
                  value={form[field]}
                  onChange={(event) => update(field, event.target.value)}
                  rows={5}
                  placeholder={
                    field === "riskFactors"
                      ? "Age <18 or > 35, previous C-section, hypertension, diabetes, etc"
                      : field === "allergies"
                        ? "Drug or food allergies"
                        : "Any other relevant information"
                  }
                  className="w-full resize-none bg-transparent outline-none placeholder:text-gray-400"
                />
              </FieldShell>
            ),
          )}
        </div>
      </SectionCard>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-14 rounded-xl bg-[#B9BDC9] px-12 text-lg font-medium text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex h-14 items-center gap-3 rounded-xl bg-[#046C3F] px-10 text-lg font-medium text-white"
        >
          <Save size={20} />
          Register ANC Visit
        </button>
      </div>
    </form>
  );
}
