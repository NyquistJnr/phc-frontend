"use client";

import React from "react";
import { FieldShell, SelectField } from "./form-helpers";
import { AppointmentFormState } from "./CreateAppointment";

const YES_NO_OPTIONS = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

interface Props {
  form: AppointmentFormState;
  onChange: <K extends keyof AppointmentFormState>(
    field: K,
    value: AppointmentFormState[K],
  ) => void;
  showHistoryFields: boolean;
}

export default function AntenatalFields({
  form,
  onChange,
  showHistoryFields,
}: Props) {
  return (
    <>
      <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-100 mt-2">
        <h3 className="text-lg font-medium text-gray-900">
          Antenatal Encounter Details
        </h3>
      </div>

      {showHistoryFields && (
        <>
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Maternal History (New Episode)
            </h4>
          </div>
          <FieldShell label="Last Menstrual Period">
            <input
              type="date"
              value={form.lastMenstrualPeriod}
              onChange={(e) => onChange("lastMenstrualPeriod", e.target.value)}
              className="w-full bg-transparent text-base text-gray-700 outline-none"
            />
          </FieldShell>
          <FieldShell label="Gravida">
            <input
              type="number"
              value={form.gravida}
              onChange={(e) => onChange("gravida", e.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-base text-gray-700 outline-none"
            />
          </FieldShell>
          <FieldShell label="Parity">
            <input
              type="number"
              value={form.parity}
              onChange={(e) => onChange("parity", e.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-base text-gray-700 outline-none"
            />
          </FieldShell>
          <FieldShell label="Living Children">
            <input
              type="number"
              value={form.livingChildren}
              onChange={(e) => onChange("livingChildren", e.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-base text-gray-700 outline-none"
            />
          </FieldShell>
          <FieldShell label="Partner Name">
            <input
              type="text"
              value={form.partnerName}
              onChange={(e) => onChange("partnerName", e.target.value)}
              placeholder="Partner's Name"
              className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </FieldShell>
          <FieldShell label="Partner Phone">
            <input
              type="tel"
              value={form.partnerPhone}
              onChange={(e) => onChange("partnerPhone", e.target.value)}
              placeholder="Partner's Phone"
              className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </FieldShell>
        </>
      )}

      <div className="col-span-1 md:col-span-2 pt-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Clinical Assessment
        </h4>
      </div>

      <FieldShell label="HIV Status">
        <input
          type="text"
          value={form.hivStatus}
          onChange={(e) => onChange("hivStatus", e.target.value)}
          placeholder="e.g., Negative"
          className="w-full bg-transparent text-base text-gray-700 outline-none"
        />
      </FieldShell>
      <FieldShell label="VDRL/Syphilis">
        <input
          type="text"
          value={form.vdrlSyphilis}
          onChange={(e) => onChange("vdrlSyphilis", e.target.value)}
          placeholder="e.g., Non-Reactive"
          className="w-full bg-transparent text-base text-gray-700 outline-none"
        />
      </FieldShell>
      <FieldShell label="Hepatitis B">
        <input
          type="text"
          value={form.hepatitisB}
          onChange={(e) => onChange("hepatitisB", e.target.value)}
          placeholder="e.g., Negative"
          className="w-full bg-transparent text-base text-gray-700 outline-none"
        />
      </FieldShell>
      <FieldShell label="Hemoglobin (ANC)">
        <input
          type="number"
          step="0.01"
          value={form.hemoglobinAnc}
          onChange={(e) => onChange("hemoglobinAnc", e.target.value)}
          placeholder="e.g., 7.89"
          className="w-full bg-transparent text-base text-gray-700 outline-none"
        />
      </FieldShell>
      <FieldShell label="Urinalysis">
        <input
          type="text"
          value={form.urinalysis}
          onChange={(e) => onChange("urinalysis", e.target.value)}
          placeholder="e.g., Normal"
          className="w-full bg-transparent text-base text-gray-700 outline-none"
        />
      </FieldShell>
      <FieldShell label="TT Dose Given">
        <input
          type="text"
          value={form.ttDoseGiven}
          onChange={(e) => onChange("ttDoseGiven", e.target.value)}
          placeholder="e.g., TT1"
          className="w-full bg-transparent text-base text-gray-700 outline-none"
        />
      </FieldShell>
      <FieldShell label="IPTp Dose Given">
        <input
          type="text"
          value={form.iptpDoseGiven}
          onChange={(e) => onChange("iptpDoseGiven", e.target.value)}
          placeholder="e.g., Dose 1"
          className="w-full bg-transparent text-base text-gray-700 outline-none"
        />
      </FieldShell>
      <SelectField
        label="Iron Folate Given?"
        placeholder="Select"
        options={YES_NO_OPTIONS}
        value={form.ironFolateGiven}
        onChange={(val) => onChange("ironFolateGiven", val)}
      />
      <FieldShell label="Risk Factors">
        <input
          type="text"
          value={form.riskFactors}
          onChange={(e) => onChange("riskFactors", e.target.value)}
          placeholder="e.g., None"
          className="w-full bg-transparent text-base text-gray-700 outline-none"
        />
      </FieldShell>
    </>
  );
}
