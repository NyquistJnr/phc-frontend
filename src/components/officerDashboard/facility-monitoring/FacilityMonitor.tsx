"use client";

import React, { useState } from 'react';
import { 
  Home, Stethoscope, ClipboardList, 
  Folder, Users, CheckCircle, Activity
} from 'lucide-react';
import OfficerDashboardHeader from "@/src/components/officerDashboard/generics/OfficerDashboardHeader";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { useClinicalStats } from "@/src/hooks/core/use-clinical-analytics";
import { useModuleCompletionPercentages } from "@/src/hooks/reports/use-reports";

export default function FacilityMonitoringView() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: clinicalStats, isLoading: isLoadingStats } = useClinicalStats({
    start_date: startDate,
    end_date: endDate,
  });

  const { data: moduleCompletionData, isLoading: isLoadingCompletion } = useModuleCompletionPercentages({
    start_date: startDate,
    end_date: endDate,
  });

  const modules = moduleCompletionData?.modules || [];

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen bg-[#F8FAFC] font-sans min-w-0 overflow-hidden">
      <OfficerDashboardHeader
        title="Facility Monitoring"
        breadcrumbs={[{ label: "Facility Monitoring" }, { label: "Unit Activity Summary" }]}
      />

      {/* Scrollable Page Content */}
      <div className="flex-1 overflow-auto p-6 sm:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumbs and Date Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium whitespace-nowrap overflow-x-auto">
              <Home size={14} className="text-[#2A6543] shrink-0" />
              <span className="shrink-0">/</span>
              <span className="shrink-0">Facility Monitoring</span>
              <span className="shrink-0">/</span>
              <span className="text-gray-500 shrink-0">Unit Activity Summary</span>
            </div>

            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onApply={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              onClear={() => {
                setStartDate("");
                setEndDate("");
              }}
            />
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
              </div>
              <div>
                <p className="text-[13px] font-medium mb-2.5">Today&apos;s Patients</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[11px] text-[#F59E0B] font-medium mb-0.5">Waiting</p>
                    <p className="text-2xl font-bold leading-none">{isLoadingStats ? "..." : clinicalStats?.todays_patients?.waiting_patients || 0}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#4ADE80] font-medium mb-0.5">Seen</p>
                    <p className="text-2xl font-bold leading-none">{isLoadingStats ? "..." : clinicalStats?.todays_patients?.seen_attended_to_patient || 0}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#60A5FA] font-medium mb-0.5">Referred</p>
                    <p className="text-2xl font-bold leading-none">{isLoadingStats ? "..." : clinicalStats?.todays_patients?.referred_patients?.total || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Metric Cards */}
            {[
              { title: 'Consultations', value: isLoadingStats ? "..." : clinicalStats?.consultations || 0, icon: Stethoscope },
              { title: 'Lab Tests', value: isLoadingStats ? "..." : clinicalStats?.lab_tests || 0, icon: ClipboardList },
              { title: 'Pending Reports', value: '10', icon: Folder }
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-[140px]">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <card.icon size={18} className="text-gray-600" />
                  </div>
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
            <h3 className="text-lg font-bold text-gray-900 mb-6">Medical Modules Completion</h3>
            
            {isLoadingCompletion ? (
              <p className="text-sm text-gray-400 py-4">Loading completion percentages...</p>
            ) : modules.length === 0 ? (
              <p className="text-sm text-gray-400 py-4">No data available for the selected period.</p>
            ) : (
              <div className="space-y-8">
                {modules.map((unit: any, index: number) => {
                  const percent = unit.completion_percentage || 0;
                  
                  return (
                    <div key={index} className="flex flex-col gap-3 pb-8 border-b border-gray-50 last:border-0 last:pb-0">
                      
                      {/* Header Row: Title & Percentage */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 border border-gray-100 rounded-lg text-gray-600">
                            <Activity size={18} />
                          </div>
                          <h3 className="text-[15px] font-semibold text-gray-900">{unit.module_name}</h3>
                        </div>
                        <span className="text-[#2A6543] font-bold text-sm">{percent.toFixed(2)}%</span>
                      </div>

                      {/* Progress Row: Subtext & Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                        <span className="text-sm text-gray-400 font-medium w-[180px] shrink-0">
                          {unit.completed_count} of {unit.total_count} completed
                        </span>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#2A6543] rounded-full transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
