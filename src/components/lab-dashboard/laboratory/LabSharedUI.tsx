"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  Beaker,
  Calendar,
  ClipboardList,
  FileUp,
  Search,
  UserRound,
  X,
} from "lucide-react";

export function MenuButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  value,
  placeholder,
  icon,
  readOnly,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  icon?: ReactNode;
  readOnly?: boolean;
}) {
  return (
    <label
      className={`flex min-h-[58px] items-center gap-3 rounded-lg border border-gray-300 px-4 ${
        readOnly ? "bg-gray-100 text-gray-500" : "bg-white text-gray-700"
      }`}
    >
      {icon && <span className="shrink-0 text-gray-600">{icon}</span>}
      <span className="min-w-0">
        <span className="block text-xs text-gray-500">{label}</span>
        <span className="block truncate text-base text-gray-400">
          {value || placeholder}
        </span>
      </span>
    </label>
  );
}

export function TextArea({
  label,
  placeholder,
  readOnly,
  value,
}: {
  label: string;
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
}) {
  return (
    <label
      className={`block rounded-lg border border-gray-300 px-4 py-3 ${
        readOnly ? "bg-gray-100" : "bg-white"
      }`}
    >
      <span className="block text-xs text-gray-500">{label}</span>
      <textarea
        readOnly={readOnly}
        value={value}
        placeholder={placeholder}
        onChange={() => undefined}
        className="mt-1 h-32 w-full resize-none bg-transparent text-base text-gray-600 outline-none placeholder:text-gray-400"
      />
    </label>
  );
}

export function SectionTitle({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="mb-7 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9CCCB6] text-[#046C3F]">
        {icon}
      </span>
      <h2 className="text-xl font-semibold text-black">{title}</h2>
    </div>
  );
}

export function ResultViewModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/20 px-4 py-10 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl rounded-xl bg-white px-6 py-8 shadow-2xl lg:px-12">
        <div className="mb-8 flex justify-end">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF4E5] text-black"
            aria-label="Close result"
          >
            <X size={20} />
          </button>
        </div>
        <SectionTitle icon={<UserRound size={18} />} title="Patient Info" />
        <div className="mb-8 grid grid-cols-1 gap-7 md:grid-cols-3">
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
        <div className="mb-8 grid grid-cols-1 gap-7 md:grid-cols-3">
          <Field label="Test type" value="Urinalysis" readOnly />
          <Field label="Requested By" value="Dr Reyes" readOnly />
          <Field label="Sample Type (Optional)" value="Blood" readOnly />
          <Field label="Priority" value="Disabled" readOnly />
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
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          <Field label="Test Name" value="Malaria RDT" readOnly />
          <Field label="Test Method" value="Microscopy" readOnly />
          <Field label="Result Value" value="Negative" readOnly />
          <Field label="Result Units" value="100 mg/dL" readOnly />
          <Field
            label="Entered By"
            value="Festus"
            icon={<Search size={24} />}
            readOnly
          />
          <Field
            label="Result Date"
            value="12/12/2020"
            icon={<Calendar size={22} />}
            readOnly
          />
          <div className="md:col-span-2">
            <TextArea
              label="Result Interpretation (Optional)"
              value="Filled"
              readOnly
            />
          </div>
          <div className="md:col-span-2">
            <TextArea label="Notes (Optional)" value="Filled" readOnly />
          </div>
        </div>

        <div className="mt-7 flex flex-col justify-end gap-4 sm:flex-row">
          <button className="flex h-14 items-center justify-center gap-3 rounded-xl px-12 text-lg font-medium text-[#046C3F]">
            <FileUp size={22} /> Edit
          </button>
          <button className="flex h-14 items-center justify-center gap-3 rounded-xl border border-[#046C3F] px-12 text-lg font-medium text-[#046C3F]">
            <FileUp size={22} /> Export File
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
