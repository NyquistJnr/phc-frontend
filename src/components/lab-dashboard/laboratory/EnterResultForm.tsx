"use client";

import { useState } from "react";
import {
  Beaker,
  Calendar,
  ClipboardList,
  Send,
  UserRound,
} from "lucide-react";
import {
  LabTest,
  SubmitTestResultPayload,
} from "@/src/components/lab-dashboard/home/types";
import { Field, SectionTitle, TextArea } from "./LabSharedUI";

type LabTestDetail = LabTest & {
  request_id?: string;
  lab_request_id?: string;
  patient_name?: string;
  patient_display_id?: string;
  requested_by_name?: string;
  priority?: string;
  created_at?: string;
  clinical_notes?: string;
};

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="flex min-h-[58px] items-center rounded-lg border border-gray-300 bg-white px-4">
      <span className="min-w-0 w-full">
        <span className="block text-xs text-gray-500">{label}</span>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="block w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
        />
      </span>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block rounded-lg border border-gray-300 bg-white px-4 py-3">
      <span className="block text-xs text-gray-500">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 h-32 w-full resize-none bg-transparent text-base text-gray-600 outline-none placeholder:text-gray-400"
      />
    </label>
  );
}

const formatDate = (date?: string | null) =>
  date ? new Date(date).toLocaleDateString() : "-";

const formatLabel = (value?: string | null) => {
  if (!value) return "-";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("-");
};

export default function EnterResultForm({
  test,
  onCancel,
  onSubmit,
  isSubmitting,
}: {
  test: LabTestDetail;
  onCancel: () => void;
  onSubmit: (payload: SubmitTestResultPayload) => void;
  isSubmitting?: boolean;
}) {
  const [resultValue, setResultValue] = useState(test.result_value || "");
  const [resultUnit, setResultUnit] = useState(test.result_unit || "");
  const [testMethod, setTestMethod] = useState(test.test_method || "");
  const [interpretation, setInterpretation] = useState(
    test.result_interpretation || "",
  );
  const [notes, setNotes] = useState(test.result_notes || "");

  const handleSubmit = () => {
    onSubmit({
      result_value: resultValue.trim(),
      result_unit: resultUnit.trim(),
      test_method: testMethod.trim(),
      result_interpretation: interpretation.trim(),
      result_notes: notes.trim(),
    });
  };

  return (
    <div className="rounded-xl bg-white px-6 py-7 lg:px-8">
      <SectionTitle icon={<UserRound size={18} />} title="Patient Info" />
      <div className="mb-8 grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-3">
        <Field label="Patient" value={test.patient_name || "-"} readOnly />
        <Field label="Lab Request ID" value={test.request_id || test.lab_request_id || "-"} readOnly />
        <Field label="Patient ID" value={test.patient_display_id || "-"} readOnly />
      </div>

      <SectionTitle icon={<ClipboardList size={18} />} title="Test Details" />
      <div className="mb-8 grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-3">
        <Field label="Test type" value={test.test_name || "-"} readOnly />
        <Field label="Requested By" value={test.requested_by_name || "-"} readOnly />
        <Field label="Sample Type" value={test.sample_type || "-"} readOnly />
        <Field label="Priority" value={formatLabel(test.priority)} readOnly />
        <Field
          label="Request Date"
          value={formatDate(test.created_at)}
          icon={<Calendar size={22} />}
          readOnly
        />
        <div className="md:col-span-3">
          <TextArea
            label="Clinical notes for lab"
            value={test.clinical_notes || "-"}
            readOnly
          />
        </div>
      </div>

      <SectionTitle icon={<Beaker size={18} />} title="Result Entry" />
      <div className="grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-2">
        <Field label="Test Name" value={test.test_name || "-"} readOnly />
        <InputField
          label="Test Method"
          value={testMethod}
          onChange={setTestMethod}
          placeholder="e.g. RDT, Microscopy"
        />
        <InputField
          label="Result Value"
          value={resultValue}
          onChange={setResultValue}
          placeholder="Enter result value"
        />
        <InputField
          label="Result Units"
          value={resultUnit}
          onChange={setResultUnit}
          placeholder="e.g. mg/dL"
        />
        <Field
          label="Result Date"
          value={formatDate(test.result_date || new Date().toISOString())}
          icon={<Calendar size={22} />}
          readOnly
        />
        <div className="md:col-span-2">
          <TextAreaField
            label="Result Interpretation (Optional)"
            value={interpretation}
            onChange={setInterpretation}
            placeholder="Clinical interpretation"
          />
        </div>
        <div className="md:col-span-2">
          <TextAreaField
            label="Notes (Optional)"
            value={notes}
            onChange={setNotes}
            placeholder="Additional lab comments"
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col justify-end gap-4 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className="h-14 rounded-xl bg-[#BEC1CB] px-16 text-lg font-medium text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-16 text-lg font-medium text-white disabled:opacity-60"
        >
          <Send size={22} /> {isSubmitting ? "Submitting..." : "Submit Result"}
        </button>
      </div>
    </div>
  );
}
