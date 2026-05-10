import {
  Baby,
  CalendarDays,
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
  FORM_OUTCOME_OPTIONS,
  MaternalForm,
  SELECT_OPTIONS,
  TRANSPORT_OPTIONS,
  YES_NO_OPTIONS,
} from "./type";

interface PncVisitFormProps {
  form: MaternalForm;
  update: (field: string, value: string) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function PncVisitForm({
  form,
  update,
  onCancel,
  onSubmit,
}: PncVisitFormProps) {
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
            label="Patient ID"
            value={form.patientId}
            readOnly
            onChange={(value) => update("patientId", value)}
          />
          <TextField
            label="Encounter ID"
            value={form.encounterId}
            icon={<Search size={22} />}
            readOnly
            onChange={(value) => update("encounterId", value)}
          />
          <TextField
            label="Facility"
            value={form.facility}
            readOnly
            onChange={(value) => update("facility", value)}
          />
          <TextField
            label="Patient Age"
            value={form.patientAge}
            placeholder="0"
            onChange={(value) => update("patientAge", value)}
          />
          <TextField
            label="Age Group"
            value={form.ageGroup}
            readOnly
            onChange={(value) => update("ageGroup", value)}
          />
          <TextField
            label="Patient ward"
            value={form.ward}
            readOnly
            onChange={(value) => update("ward", value)}
          />
          <TextField
            label="Patient LGA"
            value={form.lga}
            readOnly
            onChange={(value) => update("lga", value)}
          />
          <TextField
            label="Patient state"
            value={form.state}
            readOnly
            onChange={(value) => update("state", value)}
          />
          <TextField
            label="PNC visit date"
            value={form.pncDate}
            icon={<CalendarDays size={18} />}
            onChange={(value) => update("pncDate", value)}
            type="date"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Maternal History & PNC Attendance Type"
        icon={<Heart size={18} />}
      >
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          <TextField
            label="Parity"
            value={form.parity}
            placeholder="0"
            onChange={(value) => update("parity", value)}
          />
          <TextField
            label="Timing of Postnatal Visit"
            value={form.timing}
            placeholder="e.g 4-7 days / >7 days"
            onChange={(value) => update("timing", value)}
          />
          <SelectField
            label="Visit Type"
            options={SELECT_OPTIONS}
            value={form.visitType}
            onChange={(value) => update("visitType", value)}
          />
        </div>
        <div className="mt-6 max-w-4xl">
          <FieldShell label="Associated Problems">
            <textarea
              value={form.associatedProblems}
              onChange={(event) =>
                update("associatedProblems", event.target.value)
              }
              rows={5}
              placeholder="Any maternal health complaints or complications..."
              className="w-full resize-none bg-transparent outline-none placeholder:text-gray-400"
            />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard title="Maternal Care Assessment" icon={<Shield size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField
            label="Vaginal Examination Conducted"
            options={YES_NO_OPTIONS}
            value={form.vaginalExam}
            onChange={(value) => update("vaginalExam", value)}
          />
          <TextField
            label="Haemoglobin / PCV Test"
            value={form.hemoglobin}
            placeholder="Enter result"
            onChange={(value) => update("hemoglobin", value)}
          />
          <TextField
            label="Urinalysis"
            value={form.urinalysis}
            placeholder="Record sugar result"
            onChange={(value) => update("urinalysis", value)}
          />
          {(
            [
              "nutritionCounselling",
              "fgmCounselling",
              "fpCounselling",
              "infectionCounselling",
            ] as const
          ).map((field) => (
            <SelectField
              key={field}
              label={field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (s) => s.toUpperCase())}
              options={YES_NO_OPTIONS}
              value={form[field]}
              onChange={(value) => update(field, value)}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Newborn Care Assessment" icon={<Baby size={18} />}>
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField
            label="Baby Sex"
            options={["Select", "Male", "Female"]}
            value={form.babySex}
            onChange={(value) => update("babySex", value)}
          />
          <SelectField
            label="Exclusive Breastfeeding Counselling"
            options={YES_NO_OPTIONS}
            value={form.breastfeeding}
            onChange={(value) => update("breastfeeding", value)}
          />
          <SelectField
            label="Complementary Feeding Counselling"
            options={YES_NO_OPTIONS}
            value={form.complementaryFeeding}
            onChange={(value) => update("complementaryFeeding", value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Neonatal Complications & Kangaroo Mother Care (KMC)"
        icon={<Heart size={18} />}
      >
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {(
            [
              "newbornDangerSigns",
              "firstAntibiotics",
              "neonatalTetanus",
              "neonatalJaundice",
              "kmcProvided",
            ] as const
          ).map((field) => (
            <SelectField
              key={field}
              label={field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (s) => s.toUpperCase())}
              options={YES_NO_OPTIONS}
              value={form[field]}
              onChange={(value) => update(field, value)}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-400">
          Kangaroo Mother Care is commonly used for low birth weight babies.
        </p>
      </SectionCard>

      <SectionCard
        title="Outcome of Visit & Responsible Staff"
        icon={<Shield size={18} />}
      >
        <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField
            label="Outcome"
            options={FORM_OUTCOME_OPTIONS}
            value={form.outcome}
            onChange={(value) => update("outcome", value)}
          />
          <TextField
            label="Responsible Officer"
            value={form.responsibleOfficer}
            placeholder="Enter Name"
            onChange={(value) => update("responsibleOfficer", value)}
          />
          <div className="md:col-span-2">
            <FieldShell label="Referral Reason (Required if referred)">
              <textarea
                value={form.referralReason}
                onChange={(event) =>
                  update("referralReason", event.target.value)
                }
                rows={5}
                placeholder="Enter reason here"
                className="w-full resize-none bg-transparent outline-none placeholder:text-gray-400"
              />
            </FieldShell>
          </div>
          <SelectField
            label="Transportation Out"
            options={TRANSPORT_OPTIONS}
            value={form.transportOut}
            onChange={(value) => update("transportOut", value)}
          />
          <TextField
            label="Created At"
            value={form.createdAt}
            icon={<CalendarDays size={18} />}
            onChange={(value) => update("createdAt", value)}
            type="date"
          />
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
          Save PNC Visit
        </button>
      </div>
    </form>
  );
}
