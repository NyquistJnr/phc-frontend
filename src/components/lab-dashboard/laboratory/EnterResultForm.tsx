"use client";

import { useState } from "react";
import {
  Beaker,
  Calendar,
  Check,
  ChevronDown,
  ClipboardList,
  Search,
  Send,
  UserRound,
} from "lucide-react";
import { Field, SectionTitle, TextArea } from "./LabSharedUI";

const resultOptions = ["Select", "Positive", "Negative"];

function ResultValueDropdown({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-[58px] w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 text-left"
      >
        <span>
          <span className="block text-xs text-gray-500">Result Value</span>
          <span className="block text-base text-gray-400">{selected}</span>
        </span>
        <ChevronDown size={20} />
      </button>
      {open && (
        <div className="absolute left-1/2 z-30 mt-[-12px] w-52 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
          {resultOptions.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setOpen(false);
              }}
              className="flex w-full items-center gap-4 py-2.5 text-left text-gray-500"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                  selected === option
                    ? "border-[#046C3F] bg-[#046C3F] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selected === option && <Check size={14} />}
              </span>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EnterResultForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const [resultValue, setResultValue] = useState("Select");

  return (
    <div className="rounded-xl bg-white px-6 py-7 lg:px-8">
      <SectionTitle icon={<UserRound size={18} />} title="Patient Info" />
      <div className="mb-8 grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-3">
        <Field
          label="Search patient"
          value="Musa Abdullahi"
          icon={<Search size={24} />}
          readOnly
        />
        <Field label="Encounter ID" value="ENC-PLT-000234" readOnly />
        <Field label="Lab Request ID" value="LAB-PLT-000234" readOnly />
        <Field label="Patient ID" value="PAT-PLT-000234" readOnly />
        <Field label="Age" value="34" readOnly />
        <Field label="Gender" value="Male" readOnly />
      </div>

      <SectionTitle icon={<ClipboardList size={18} />} title="Test Details" />
      <div className="mb-8 grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-3">
        <Field label="Test type" value="Urinalysis" readOnly />
        <Field label="Requested By" value="Dr Reyes" readOnly />
        <Field label="Sample Type (Optional)" value="Blood" readOnly />
        <Field label="Priority" value="Urgent" readOnly />
        <Field
          label="Request Date"
          value="12/12/2020"
          icon={<Calendar size={22} />}
          readOnly
        />
        <div className="md:col-span-3">
          <TextArea label="Clinical notes for lab" value="Filled" readOnly />
        </div>
      </div>

      <SectionTitle icon={<Beaker size={18} />} title="Result Entry" />
      <div className="grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-2">
        <Field label="Test Name" placeholder="Enter" />
        <Field label="Test Method" placeholder="e.g RDT, Microscopy" />
        <ResultValueDropdown selected={resultValue} onSelect={setResultValue} />
        <Field label="Result Units" value="0 mg/dL" readOnly />
        <Field
          label="Entered By"
          placeholder="Search"
          icon={<Search size={24} />}
        />
        <Field
          label="Result Date"
          value="12/12/2020"
          icon={<Calendar size={22} />}
        />
        <div className="md:col-span-2">
          <TextArea
            label="Result Interpretation (Optional)"
            placeholder="Clinical interpretation"
          />
        </div>
        <div className="md:col-span-2">
          <TextArea
            label="Notes (Optional)"
            placeholder="Additional lab comments"
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col justify-end gap-4 sm:flex-row">
        <button
          onClick={onCancel}
          className="h-14 rounded-xl bg-[#BEC1CB] px-16 text-lg font-medium text-white"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-16 text-lg font-medium text-white"
        >
          <Send size={22} /> Submit Result
        </button>
      </div>
    </div>
  );
}
