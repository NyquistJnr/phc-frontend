import React from "react";
import { Users, Activity, Baby, Syringe, Calendar } from "lucide-react";
import { StatCard } from "./StatCard";

export function StatsSection() {
  const stats = [
    { title: "Waiting Queue", value: 37, icon: Users, isActive: true },
    { title: "Vitals Pending", value: 18, icon: Activity },
    { title: "Maternal Alerts", value: 6, icon: Baby },
    { title: "Vaccines Due", value: 23, icon: Syringe },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            Good morning, Nurse Grace
          </h1>
          <p className="text-gray-500">
            Here's your patient workload for today
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
          <Calendar size={18} className="text-gray-500" />
          <span>This Week</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>
    </div>
  );
}
