"use client";

import Link from "next/link";
import type { ElementType } from "react";
import { ChevronDown } from "lucide-react";

type DashboardStatCardProps = {
  title: string;
  value: number | string;
  icon: ElementType;
  active?: boolean;
  href?: string;
  periodLabel?: string;
  showPeriod?: boolean;
};

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
  active = false,
  href,
  periodLabel,
  showPeriod = true,
}: DashboardStatCardProps) {
  const content = (
    <>
      <div className="mb-8 flex items-start justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            active ? "bg-[#0B7F4D] text-white" : "bg-[#FFF7ED] text-gray-700"
          }`}
        >
          <Icon size={21} />
        </span>
        {showPeriod && (
          <span
            className={`flex items-center gap-1 text-xs ${
              active ? "text-white" : "text-gray-300"
            }`}
          >
            {periodLabel && (
              <>
                <span>{periodLabel}</span> <ChevronDown size={14} />
              </>
            )}
          </span>
        )}
      </div>
      <p className={`mb-3 text-sm ${active ? "text-white" : "text-gray-400"}`}>
        {title}
      </p>
      <p
        className={`text-3xl font-semibold ${
          active ? "text-white" : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </>
  );

  const className = `min-h-36 rounded-xl p-4 transition-colors ${
    active
      ? "bg-[#046C3F] text-white"
      : "bg-white text-gray-500 hover:bg-[#F9FFFC]"
  }`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
