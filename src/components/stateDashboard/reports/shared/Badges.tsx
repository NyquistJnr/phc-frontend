"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { DiseaseTrend, AlertLevel, AdverseSeverity, AdverseStatus } from "@/src/hooks/state/use-reports";

export function TrendBadge({ trend }: { trend: DiseaseTrend }) {
  const config = {
    INCREASING: { icon: TrendingUp, classes: "bg-[#FEE2E2] text-[#DC2626]" },
    DECREASING: { icon: TrendingDown, classes: "bg-[#E8F7F0] text-[#046C3F]" },
    STABLE: { icon: Minus, classes: "bg-gray-100 text-gray-500" },
  }[trend];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${config.classes}`}>
      <Icon size={10} />
      {trend.charAt(0) + trend.slice(1).toLowerCase()}
    </span>
  );
}

export function AlertLevelBadge({ level }: { level: AlertLevel }) {
  const classes = {
    CRITICAL: "bg-[#FEE2E2] text-[#DC2626]",
    MODERATE: "bg-[#FFF4E5] text-[#B45309]",
    LOW: "bg-[#E0F2FE] text-[#0284C7]",
  }[level];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${classes}`}>
      {level}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: AdverseSeverity }) {
  const classes: Record<AdverseSeverity, string> = {
    MILD: "bg-[#E0F2FE] text-[#0284C7]",
    MODERATE: "bg-[#FFF4E5] text-[#B45309]",
    SEVERE: "bg-[#FFE4DE] text-[#EA580C]",
    LIFE_THREATENING: "bg-[#FEE2E2] text-[#DC2626]",
    FATAL: "bg-gray-900 text-white",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${classes[severity]}`}>
      {severity.replaceAll("_", " ")}
    </span>
  );
}

export function StatusBadge({ status }: { status: AdverseStatus }) {
  const classes: Record<AdverseStatus, string> = {
    REPORTED: "bg-[#FFF4E5] text-[#B45309]",
    UNDER_REVIEW: "bg-[#E0F2FE] text-[#0284C7]",
    RESOLVED: "bg-[#E8F7F0] text-[#046C3F]",
    CLOSED: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${classes[status]}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
