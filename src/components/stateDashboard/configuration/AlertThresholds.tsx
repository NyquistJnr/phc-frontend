"use client";

import { Bell, Lock } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import { useSystemThresholds } from "@/src/hooks/state/use-configuration";

interface ThresholdDisplay {
  key: string;
  label: string;
  value: number | undefined;
  unit: string;
}

function ThresholdCard({ threshold, isLoading }: { threshold: ThresholdDisplay; isLoading: boolean }) {
  return (
    <div className="relative border border-gray-200 rounded-xl bg-white">
      <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-500 font-medium z-10">
        {threshold.label}
      </label>
      <div className="flex items-center px-5 py-3.5">
        <span className="flex-grow text-gray-700 text-sm font-medium">
          {isLoading ? "…" : `${threshold.value ?? "-"} ${threshold.unit}`}
        </span>
      </div>
    </div>
  );
}

export default function AlertThresholds() {
  const { data, isLoading } = useSystemThresholds();

  const thresholds: ThresholdDisplay[] = [
    { key: "compliance", label: "Disease Compliance Threshold", value: data?.disease_compliance_threshold_percent, unit: "%" },
    { key: "failedLogin", label: "Failed Login Attempts", value: data?.failed_login_attempts_threshold, unit: "attempts" },
    { key: "systemError", label: "System Error Threshold", value: data?.system_error_threshold, unit: "errors" },
    { key: "inactiveFac", label: "Inactive Facility Alert", value: data?.inactive_facility_threshold_days, unit: "Days" },
    { key: "highUsage", label: "High System Usage Alert", value: data?.high_usage_threshold_users, unit: "Users" },
  ];

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
            Conditions that trigger system alerts and notifications
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-3xl">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center">
              <Bell size={18} className="text-[#046C3F]" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              Alert triggers when it exceeds
            </h2>
          </div>

          <div className="flex items-start gap-2.5 mb-8 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-500">
            <Lock size={14} className="shrink-0 mt-0.5 text-gray-400" />
            <span>
              These platform-wide thresholds are managed by system administrators and are shown here read-only.
            </span>
          </div>

          {/* Threshold Cards */}
          <div className="space-y-5">
            {thresholds.map((threshold) => (
              <ThresholdCard key={threshold.key} threshold={threshold} isLoading={isLoading} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
