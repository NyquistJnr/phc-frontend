"use client";

import { useState } from "react";
import { Bell, ChevronUp, ChevronDown, Save, RotateCcw } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import Toast from "@/src/components/adminDashboard/generics/Toast";

interface Threshold {
  key: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
}

const DEFAULTS: Threshold[] = [
  { key: "compliance",   label: "Reporting Compliance Alert", value: 50,  unit: "%",        min: 0,   max: 100,  step: 1  },
  { key: "failedLogin",  label: "Failed Login Attempts",      value: 8,   unit: "attempts", min: 1,   max: 100,  step: 1  },
  { key: "systemError",  label: "System Error Threshold",     value: 50,  unit: "errors",   min: 1,   max: 500,  step: 1  },
  { key: "inactiveFac",  label: "Inactive Facility Alert",    value: 7,   unit: "Days",     min: 1,   max: 365,  step: 1  },
  { key: "highUsage",    label: "High System Usage Alert",    value: 200, unit: "Users",    min: 10,  max: 10000,step: 10 },
];

function ThresholdInput({
  threshold,
  onChange,
}: {
  threshold: Threshold;
  onChange: (key: string, value: number) => void;
}) {
  const increment = () =>
    onChange(threshold.key, Math.min(threshold.max, threshold.value + threshold.step));
  const decrement = () =>
    onChange(threshold.key, Math.max(threshold.min, threshold.value - threshold.step));

  return (
    <div className="relative border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors">
      <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-500 font-medium z-10">
        {threshold.label}
      </label>
      <div className="flex items-center px-5 py-3.5 gap-3">
        <span className="flex-grow text-gray-400 text-sm">
          {threshold.value} {threshold.unit}
        </span>
        <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={increment}
            className="flex items-center justify-center w-8 h-6 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors border-b border-gray-200"
            aria-label={`Increase ${threshold.label}`}
          >
            <ChevronUp size={13} />
          </button>
          <button
            onClick={decrement}
            className="flex items-center justify-center w-8 h-6 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={`Decrease ${threshold.label}`}
          >
            <ChevronDown size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AlertThresholds() {
  const [thresholds, setThresholds] = useState<Threshold[]>(
    DEFAULTS.map((d) => ({ ...d })),
  );
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const handleChange = (key: string, value: number) => {
    setThresholds((prev) =>
      prev.map((t) => (t.key === key ? { ...t, value } : t)),
    );
  };

  const handleSave = () => {
    setToastMsg({
      title: "Thresholds Saved",
      message: "Alert thresholds have been updated successfully.",
      type: "success",
    });
    setToastVisible(true);
  };

  const handleReset = () => {
    setThresholds(DEFAULTS.map((d) => ({ ...d })));
    setToastMsg({
      title: "Thresholds Reset",
      message: "Alert thresholds have been reset to their default values.",
      type: "success",
    });
    setToastVisible(true);
  };

  const breadcrumbs = [
    { label: "Configuration" },
    { label: "Alert Thresholds", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="Configuration" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Alert Thresholds
          </h1>
          <p className="text-gray-600 text-sm">
            Configure conditions that trigger system alerts and notifications
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-3xl">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center">
              <Bell size={18} className="text-[#046C3F]" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              Trigger alert when it exceed
            </h2>
          </div>

          {/* Threshold Inputs */}
          <div className="space-y-5 mb-10">
            {thresholds.map((threshold) => (
              <ThresholdInput
                key={threshold.key}
                threshold={threshold}
                onChange={handleChange}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-[#046C3F] hover:bg-[#035a34] text-white font-semibold rounded-xl transition-colors shadow-sm text-sm"
            >
              <Save size={16} />
              Save Thresholds
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-colors text-sm"
            >
              <RotateCcw size={15} />
              Reset to defaults
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
