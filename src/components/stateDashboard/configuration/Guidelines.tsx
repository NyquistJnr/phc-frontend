"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  PlusCircle,
  UploadCloud,
  X,
  Check,
} from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import Toast from "@/src/components/adminDashboard/generics/Toast";

/* ─── Reusable form sub-components ─── */

function FloatingInput({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-500 font-medium z-10">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1AC073] focus:ring-1 focus:ring-[#1AC073]"
      />
    </div>
  );
}

function FloatingTextarea({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-500 font-medium z-10">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="block w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1AC073] focus:ring-1 focus:ring-[#1AC073] resize-none"
      />
    </div>
  );
}

function FormDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-500 font-medium z-10">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-gray-600 focus:outline-none focus:border-[#1AC073] hover:border-gray-300 transition-colors"
      >
        <span className="flex-grow text-left truncate">{value}</span>
        <ChevronDown
          size={18}
          className={`text-gray-500 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 py-2 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = value === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => { onChange(option); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "bg-[#046C3F] border border-[#046C3F]" : "border-2 border-gray-300"
                  }`}
                >
                  {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
                <span className={isSelected ? "text-[#046C3F] font-medium" : "text-gray-700"}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-[#046C3F]" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/* ─── Main component ─── */

const CONDITION_OPTIONS = [
  "Symptoms / Diagnosis Pattern",
  "Fever",
  "Chills",
  "Headache",
  "Positive malaria test",
];

const REFERRAL_OPTIONS = ["Yes", "No"];
const SEVERITY_OPTIONS  = ["Select level", "Mild", "Moderate", "Severe"];

export default function Guidelines() {
  const [title, setTitle]               = useState("");
  const [condition, setCondition]       = useState("Symptoms / Diagnosis Pattern");
  const [description, setDescription]   = useState("");
  const [steps, setSteps]               = useState<string[]>([]);
  const [newStep, setNewStep]           = useState("");
  const [addingStep, setAddingStep]     = useState(false);
  const [referral, setReferral]         = useState("Does patient need referral to higher facility?");
  const [severity, setSeverity]         = useState("Select level");
  const [dateCreated]                   = useState("12/12/2026");
  const [accountActive, setAccountActive] = useState(true);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg]         = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const handleAddStep = () => {
    if (addingStep) {
      if (newStep.trim()) {
        setSteps((prev) => [...prev, newStep.trim()]);
        setNewStep("");
      }
      setAddingStep(false);
    } else {
      setAddingStep(true);
    }
  };

  const removeStep = (index: number) =>
    setSteps((prev) => prev.filter((_, i) => i !== index));

  const handlePublish = () => {
    if (!title.trim()) {
      setToastMsg({ title: "Validation Error", message: "Please enter a guideline title.", type: "error" });
      setToastVisible(true);
      return;
    }
    setToastMsg({
      title: "Published Guideline",
      message: `Pushed "${title}" to all facilities`,
      type: "success",
    });
    setToastVisible(true);
  };

  const handleCancel = () => {
    setTitle("");
    setCondition("Symptoms / Diagnosis Pattern");
    setDescription("");
    setSteps([]);
    setNewStep("");
    setAddingStep(false);
    setReferral("Does patient need referral to higher facility?");
    setSeverity("Select level");
    setAccountActive(true);
  };

  const breadcrumbs = [
    { label: "Configuration" },
    { label: "Guidelines", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="Configuration" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Clinical Guidelines
          </h1>
          <p className="text-gray-600 text-sm">
            Create and manage standardized clinical protocols
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-3xl">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#046C3F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              Clinical Guideline Information
            </h2>
          </div>

          <div className="space-y-6">
            {/* Row 1: Title + Condition Trigger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FloatingInput
                label="Guideline Title"
                value={title}
                onChange={setTitle}
                placeholder="Enter title"
              />
              <FormDropdown
                label="Condition Trigger"
                options={CONDITION_OPTIONS}
                value={condition}
                onChange={setCondition}
              />
            </div>

            {/* Description */}
            <FloatingTextarea
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Summary of condition"
            />

            {/* Steps */}
            <div>
              <button
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-2 text-[#046C3F] font-semibold text-sm hover:text-[#035a34] transition-colors mb-1"
              >
                <PlusCircle size={20} />
                Add Step
              </button>
              <p className="text-xs text-gray-400 mb-3">Step-by-step instructions</p>

              {addingStep && (
                <div className="flex items-center gap-2 mb-3">
                  <input
                    autoFocus
                    type="text"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddStep();
                      if (e.key === "Escape") { setAddingStep(false); setNewStep(""); }
                    }}
                    placeholder="Describe this step..."
                    className="flex-grow border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1AC073] focus:ring-1 focus:ring-[#1AC073]"
                  />
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="px-4 py-2.5 bg-[#046C3F] text-white text-xs font-semibold rounded-xl hover:bg-[#035a34] transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAddingStep(false); setNewStep(""); }}
                    className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {steps.length > 0 && (
                <ol className="space-y-2.5">
                  {steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 group"
                    >
                      <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                        {i + 1}
                      </span>
                      <span className="flex-grow text-sm text-gray-700">{step}</span>
                      <button
                        type="button"
                        onClick={() => removeStep(i)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Row 2: Referral Required + Severity Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormDropdown
                label="Referral Required"
                options={REFERRAL_OPTIONS}
                value={referral}
                onChange={setReferral}
              />
              <FormDropdown
                label="Severity Level"
                options={SEVERITY_OPTIONS}
                value={severity}
                onChange={setSeverity}
              />
            </div>

            {/* Row 3: Date Created + Account Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Date Created */}
              <div className="relative">
                <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-500 font-medium z-10">
                  Date Created
                </label>
                <div className="flex items-center bg-white border border-gray-200 rounded-xl px-5 py-3.5 gap-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="text-sm text-gray-500">{dateCreated}</span>
                </div>
              </div>

              {/* Account Status */}
              <div className="flex items-center gap-4">
                <ToggleSwitch checked={accountActive} onChange={setAccountActive} />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Account Status</p>
                  <p className="text-xs text-gray-400">Active / Inactive</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-10">
            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-2 px-6 py-3 bg-[#046C3F] hover:bg-[#035a34] text-white font-semibold rounded-xl transition-colors shadow-sm text-sm"
            >
              <UploadCloud size={16} />
              Publish Guideline
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <Toast
        type={toastMsg.type}
        title={toastMsg.title}
        message={toastMsg.message}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
