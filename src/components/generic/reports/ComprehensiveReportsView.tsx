"use client";

import React, { useState } from "react";
import { Loader2, Activity, CheckCircle2, LayoutDashboard, BarChart3, Download } from "lucide-react";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import {
  useComprehensiveModules,
  useModuleCompletionPercentages,
} from "@/src/hooks/reports/use-reports";

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getCustomDateString(start: string, end: string) {
  if (!start || !end) return "All Time Reports";
  const sd = new Date(start);
  const ed = new Date(end);
  const startDay = getOrdinal(sd.getDate());
  const endDay = getOrdinal(ed.getDate());
  const month = sd.toLocaleString("default", { month: "short" });
  const year = sd.getFullYear();
  const endMonth = ed.toLocaleString("default", { month: "short" });
  const endYear = ed.getFullYear();

  if (month === endMonth && year === endYear) {
    return `${startDay} - ${endDay} ${month} ${year}`;
  } else if (year === endYear) {
    return `${startDay} ${month} - ${endDay} ${endMonth} ${year}`;
  } else {
    return `${startDay} ${month} ${year} - ${endDay} ${endMonth} ${endYear}`;
  }
}

interface ComprehensiveReportsViewProps {
  HeaderComponent?: React.ReactNode;
}

export default function ComprehensiveReportsView({
  HeaderComponent,
}: ComprehensiveReportsViewProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const params =
    startDate && endDate ? { start_date: startDate, end_date: endDate } : {};

  const { data: comprehensiveData, isLoading: isLoadingComprehensive } =
    useComprehensiveModules(params);
  const { data: percentagesData, isLoading: isLoadingPercentages } =
    useModuleCompletionPercentages(params);

  const isLoading = isLoadingComprehensive || isLoadingPercentages;

  const comprehensiveReports = comprehensiveData?.reports || {};
  const completionModules = percentagesData?.modules || [];

  // Combine data into a single array for rendering
  const combinedModules = completionModules.map((cm: any) => {
    const key = cm.module_name.toLowerCase();
    const compData = comprehensiveReports[key] || { summary: "No summary available." };
    return {
      name: cm.module_name,
      totalCount: cm.total_count,
      completedCount: cm.completed_count,
      completionPercentage: cm.completion_percentage,
      summary: compData.summary,
    };
  });

  const handleExport = () => {
    if (combinedModules.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = ["Module Name", "Completion Rate (%)", "Completed Count", "Total Count", "Summary"];
    const csvRows = [headers.join(",")];

    combinedModules.forEach((mod: any) => {
      const row = [
        `"${mod.name.replace(/"/g, '""')}"`,
        mod.completionPercentage,
        mod.completedCount,
        mod.totalCount,
        `"${(mod.summary || "").replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `comprehensive_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#F6F7FC]">
      {HeaderComponent && HeaderComponent}

      <div className="px-4 py-6 sm:px-8 lg:py-8 space-y-8 flex-1">
        {/* Header and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[20px] shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#E8F7F0] flex items-center justify-center shrink-0">
                <BarChart3 size={16} className="text-[#046C3F]" />
              </div>
              <p className="text-sm font-bold text-[#046C3F] uppercase tracking-wider">
                Comprehensive Modules
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {getCustomDateString(startDate, endDate)}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Overview of module metrics and completion status based on your role.
            </p>
          </div>
          <div className="shrink-0 self-start sm:self-auto flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={combinedModules.length === 0}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              label="Select Date Range"
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
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[20px] shadow-sm border border-gray-100">
            <Loader2 className="animate-spin text-[#046C3F] mb-4" size={32} />
            <p className="text-gray-500 font-medium">Loading reports...</p>
          </div>
        ) : combinedModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[20px] shadow-sm border border-gray-100">
            <LayoutDashboard className="text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium text-lg">No modules found.</p>
            <p className="text-gray-400 text-sm mt-1">
              There is no report data available for the selected period.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {combinedModules.map((mod: any, index: number) => {
              const isPerfect = mod.completionPercentage === 100;
              const isGood = mod.completionPercentage >= 75 && mod.completionPercentage < 100;
              const isWarning = mod.completionPercentage < 75;

              let barColor = "bg-[#1AC073]";
              let trackColor = "bg-[#E8F7F0]";
              if (isWarning) {
                barColor = "bg-[#F79009]";
                trackColor = "bg-[#FFF4E5]";
              }

              return (
                <div
                  key={index}
                  className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-md"
                >
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-bold text-gray-900 capitalize">
                        {mod.name.replace(/_/g, " ")}
                      </h3>
                      {isPerfect && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E8F7F0] text-[#039855] rounded-lg text-xs font-bold">
                          <CheckCircle2 size={14} /> Perfect
                        </div>
                      )}
                    </div>

                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Completion Rate
                        </p>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-extrabold text-gray-900">
                            {mod.completionPercentage}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Completed / Total
                        </p>
                        <p className="text-base font-bold text-gray-900">
                          {mod.completedCount} <span className="text-gray-400 font-medium">/ {mod.totalCount}</span>
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className={`w-full h-2.5 rounded-full ${trackColor} overflow-hidden mb-2`}>
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                        style={{ width: `${mod.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50/50 border-t border-gray-50 mt-auto">
                    <div className="flex gap-3">
                      <Activity size={18} className="text-gray-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 font-medium leading-relaxed">
                        {mod.summary}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
