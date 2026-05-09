"use client";

import React from 'react';
import { 
  ChevronDown, Home, Stethoscope, ClipboardList, 
  Folder, TestTubes, Pill, HeartPulse, Users
} from 'lucide-react';
import OfficerDashboardHeader from "@/src/components/officerDashboard/generics/OfficerDashboardHeader";

export default function FacilityMonitoringView() {
  const unitActivities = [
    { name: 'Consultation Unit', icon: Stethoscope, handled: 38, total: 50, percent: 80 },
    { name: 'Laboratory', icon: TestTubes, handled: 24, total: 40, percent: 80 },
    { name: 'Pharmacy', icon: Pill, handled: 31, total: 45, percent: 80 },
    { name: 'Nursing/ANC', icon: HeartPulse, handled: 31, total: 45, percent: 80 },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen bg-[#F8FAFC] font-sans min-w-0 overflow-hidden">
      <OfficerDashboardHeader
        title="Facility Monitoring"
        breadcrumbs={[{ label: "Facility Monitoring" }, { label: "Unit Activity Summary" }]}
      />

      {/* Scrollable Page Content */}
      <div className="flex-1 overflow-auto p-6 sm:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-medium whitespace-nowrap overflow-x-auto">
            <Home size={14} className="text-[#2A6543] shrink-0" />
            <span className="shrink-0">/</span>
            <span className="shrink-0">Facility Monitoring</span>
            <span className="shrink-0">/</span>
            <span className="text-gray-500 shrink-0">Unit Activity Summary</span>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 mb-2">
              Facility Monitoring
            </h1>
            <p className="text-gray-500 font-medium">Real-time activity summary across all facility units.</p>
          </div>

          {/* TOP METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Active Green Card */}
            <div className="bg-[#2A6543] rounded-[20px] p-5 shadow-sm text-white flex flex-col justify-between h-[140px]">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Users size={18} className="text-white" />
                </div>
                <button className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors font-medium">
                  This Week <ChevronDown size={14} />
                </button>
              </div>
              <div>
                <p className="text-[13px] font-medium mb-2.5">Today&apos;s Patients</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[11px] text-[#F59E0B] font-medium mb-0.5">Waiting</p>
                    <p className="text-2xl font-bold leading-none">34</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#4ADE80] font-medium mb-0.5">Seen</p>
                    <p className="text-2xl font-bold leading-none">67</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#60A5FA] font-medium mb-0.5">Referred</p>
                    <p className="text-2xl font-bold leading-none">12</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Metric Cards */}
            {[
              { title: 'Consultations', value: '60', icon: Stethoscope },
              { title: 'Lab Tests', value: '45', icon: ClipboardList },
              { title: 'Pending Reports', value: '10', icon: Folder }
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-[140px]">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <card.icon size={18} className="text-gray-600" />
                  </div>
                  <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors">
                    This Week <ChevronDown size={14} />
                  </button>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-gray-500 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 leading-none">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* UNIT ACTIVITY LIST */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="space-y-8">
              {unitActivities.map((unit, index) => (
                <div key={index} className="flex flex-col gap-3 pb-8 border-b border-gray-50 last:border-0 last:pb-0">
                  
                  {/* Header Row: Title & Percentage */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 border border-gray-100 rounded-lg text-gray-600">
                        <unit.icon size={18} />
                      </div>
                      <h3 className="text-[15px] font-semibold text-gray-900">{unit.name}</h3>
                    </div>
                    <span className="text-[#2A6543] font-bold text-sm">{unit.percent}%</span>
                  </div>

                  {/* Progress Row: Subtext & Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <span className="text-sm text-gray-400 font-medium w-[180px] shrink-0">
                      {unit.handled} of {unit.total} patients handled
                    </span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#2A6543] rounded-full transition-all duration-500" 
                        style={{ width: `${unit.percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
