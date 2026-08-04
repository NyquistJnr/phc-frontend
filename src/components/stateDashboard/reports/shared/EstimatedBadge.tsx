"use client";

import { AlertCircle, Ban } from "lucide-react";

interface EstimatedBadgeProps {
  variant?: "estimated" | "not-tracked";
  className?: string;
}

export default function EstimatedBadge({ variant = "estimated", className = "" }: EstimatedBadgeProps) {
  const isNotTracked = variant === "not-tracked";
  return (
    <span
      title={
        isNotTracked
          ? "No data model exists for this metric yet — always returns a placeholder value."
          : "Approximated from related data, not a curated/verified figure yet."
      }
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide cursor-help ${
        isNotTracked ? "bg-gray-100 text-gray-400" : "bg-[#FFF4E5] text-[#B45309]"
      } ${className}`}
    >
      {isNotTracked ? <Ban size={9} /> : <AlertCircle size={9} />}
      {isNotTracked ? "Not tracked" : "Estimated"}
    </span>
  );
}
