"use client";

import { LucideIcon } from "lucide-react";
import EstimatedBadge from "./EstimatedBadge";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subLabel?: string;
  tone?: "green" | "blue" | "amber" | "red" | "neutral";
  placeholder?: "estimated" | "not-tracked";
}

const TONE_STYLES: Record<NonNullable<StatCardProps["tone"]>, { bg: string; text: string }> = {
  green: { bg: "bg-[#E8F7F0]", text: "text-[#046C3F]" },
  blue: { bg: "bg-[#E0F2FE]", text: "text-[#0284C7]" },
  amber: { bg: "bg-[#FFF4E5]", text: "text-[#B45309]" },
  red: { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" },
  neutral: { bg: "bg-gray-100", text: "text-gray-500" },
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  subLabel,
  tone = "green",
  placeholder,
}: StatCardProps) {
  const styles = TONE_STYLES[tone];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${styles.bg}`}>
          <Icon size={18} className={styles.text} />
        </div>
        {placeholder && <EstimatedBadge variant={placeholder} />}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-gray-900 truncate">{value}</p>
        <p className="text-xs font-semibold text-gray-500 mt-0.5 truncate">{label}</p>
        {subLabel && <p className="text-[11px] text-gray-400 mt-0.5 truncate">{subLabel}</p>}
      </div>
    </div>
  );
}
