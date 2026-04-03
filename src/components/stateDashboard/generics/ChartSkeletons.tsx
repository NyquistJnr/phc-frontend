"use client";

import { ChevronDown } from "lucide-react";

// ── Shared skeleton primitives used across state-dashboard charts ────────────

const Y_AXIS = [500, 400, 300, 200, 100, 0];

export function BarChartSkeleton({
  bars,
  labels,
}: {
  bars: number[];   // height % per bar
  labels: string[]; // x-axis label per bar
}) {
  return (
    <div className="flex-1 flex flex-col min-h-55">
      <div className="flex flex-1 gap-2">
        {/* Y-axis */}
        <div className="flex flex-col justify-between pb-6 pr-2 shrink-0">
          {Y_AXIS.map((v) => (
            <span key={v} className="text-[10px] text-gray-300 font-medium leading-none">
              {v}
            </span>
          ))}
        </div>
        {/* Bars */}
        <div className="flex-1 flex items-end gap-1.5 pb-6">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
              <div
                className="w-full rounded-t-md bg-[#ECEDF5]"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* X-axis labels */}
      <div className="flex gap-1.5 pl-8">
        {labels.map((label) => (
          <div key={label} className="flex-1 text-center">
            <span className="text-[10px] text-gray-300 font-medium whitespace-nowrap">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonutSkeleton() {
  return (
    <div className="flex items-center justify-center flex-1">
      <div
        className="rounded-full border-18 border-[#ECEDF5]"
        style={{ width: 130, height: 130 }}
      />
    </div>
  );
}

const FACILITY_NAMES = [
  "PHC Ikeja",
  "Oregun PHC",
  "PHC Surulere",
  "Aguda PHC",
  "Ebute Metta PHC",
  "Yaba PHC",
  "Ajah PHC",
];

export function FacilityComplianceRows() {
  return (
    <div className="space-y-3 flex-1">
      {FACILITY_NAMES.map((name) => (
        <div key={name} className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium w-36 shrink-0">{name}</span>
          <div className="flex-1 h-2 rounded-full bg-[#ECEDF5]" />
          <span className="text-sm text-gray-400 font-medium w-8 text-right shrink-0">0%</span>
        </div>
      ))}
    </div>
  );
}

export function PeriodDropdown({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition-colors shrink-0">
      {label} <ChevronDown size={12} />
    </div>
  );
}
