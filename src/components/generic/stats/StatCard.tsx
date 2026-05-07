import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  isActive?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  isActive = false,
}: StatCardProps) {
  return (
    <div
      className={`p-5 rounded-2xl flex flex-col justify-between min-w-[200px] flex-1 transition-colors ${
        isActive
          ? "bg-[#006732] text-white shadow-md"
          : "bg-white text-gray-900 border border-gray-100 shadow-sm"
      }`}
    >
      <div className="flex items-start mb-6">
        <div
          className={`p-2 rounded-lg ${
            isActive
              ? "bg-white/20 text-white"
              : "bg-gray-50 text-gray-600 border border-gray-100"
          }`}
        >
          <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        </div>
      </div>

      <div>
        <h4
          className={`text-sm mb-1 ${isActive ? "text-green-50" : "text-gray-500"}`}
        >
          {title}
        </h4>
        <span className="text-4xl font-semibold tracking-tight">{value}</span>
      </div>
    </div>
  );
}
