"use client";

import { ShieldAlert, CircleDashed } from "lucide-react";
import type { OicDiseaseSeverity } from "@/src/hooks/oic/use-reports";

export function EpidemicProneBadge() {
  return (
    <span
      title="Marked epidemic-prone because this disease is registered as CRITICAL severity."
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEE2E2] text-[#DC2626] cursor-help"
    >
      <ShieldAlert size={10} />
      Epidemic-prone
    </span>
  );
}

export function NotInRegistryBadge() {
  return (
    <span
      title="This disease has not been added to the state disease registry yet — cases will always show as 0 until it is."
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-400 cursor-help"
    >
      <CircleDashed size={10} />
      Not yet tracked
    </span>
  );
}

export function SeverityDot({ severity }: { severity: OicDiseaseSeverity }) {
  const classes: Record<string, string> = {
    CRITICAL: "bg-[#DC2626]",
    MODERATE: "bg-[#B45309]",
    LOW: "bg-[#0284C7]",
  };
  if (!severity) return <span className="w-2 h-2 rounded-full bg-gray-200 shrink-0" />;
  return <span className={`w-2 h-2 rounded-full shrink-0 ${classes[severity]}`} />;
}
