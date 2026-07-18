"use client";

import React, { useState } from 'react';
import { 
  ChevronDown, Home, Calendar, ListFilter, Search,
  Upload, X, CheckCircle
} from 'lucide-react';
import OfficerDashboardHeader from "@/src/components/officerDashboard/generics/OfficerDashboardHeader";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { useDailyActivity } from '@/src/hooks/reports/use-reports';

const formatDateISO = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getToday = () => formatDateISO(new Date());

const get7DaysFromNow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return formatDateISO(d);
};

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"],
        v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getCustomDateString(start: string, end: string) {
  if (!start || !end) return "Select Date Range";
  const sd = new Date(start);
  const ed = new Date(end);
  const startDay = getOrdinal(sd.getDate());
  const endDay = getOrdinal(ed.getDate());
  const month = sd.toLocaleString('default', { month: 'short' });
  const year = sd.getFullYear();
  const endMonth = ed.toLocaleString('default', { month: 'short' });
  const endYear = ed.getFullYear();

  if (month === endMonth && year === endYear) {
    return `${startDay} - ${endDay} ${month} ${year}`;
  } else if (year === endYear) {
    return `${startDay} ${month} - ${endDay} ${endMonth} ${year}`;
  } else {
    return `${startDay} ${month} ${year} - ${endDay} ${endMonth} ${endYear}`;
  }
}

const ALL_MODULES = [
  "patients",
  "appointments",
  "ancs",
  "pncs",
  "delivery",
  "lab tests",
  "lab results",
  "prescriptions",
  "referrals",
  "health promotions",
  "maternal care"
];

export default function ReportsView() {
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(get7DaysFromNow());
  const [page, setPage] = useState(1);

  // Export Modal State
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedReportDate, setSelectedReportDate] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>(ALL_MODULES);

  // Queries
  const { data: dailyActivityData, isLoading: isLoadingDaily } = useDailyActivity({
    start_date: startDate,
    end_date: endDate,
    page: page,
  });

  const dailyReports = dailyActivityData?.results || [];
  const totalCount = dailyActivityData?.count || 0;
  const totalPages = Math.ceil(totalCount / 10) || 1; 

  const handleNextPage = () => {
    if (page < totalPages) setPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const formatDisplayDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleExportClick = (date: string) => {
    setSelectedReportDate(date);
    setSelectedModules(ALL_MODULES); // Reset checkboxes to all checked by default
    setExportModalOpen(true);
  };

  const toggleModule = (moduleName: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleName) 
        ? prev.filter(m => m !== moduleName) 
        : [...prev, moduleName]
    );
  };

  const confirmExport = () => {
    // We trigger browser print dialog. 
    // The CSS logic will ensure only the ExportPrintView is visible when printed.
    window.print();
    setExportModalOpen(false);
  };

  const currentReportData = dailyReports.find((r: any) => r.date === selectedReportDate);

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen bg-[#F8FAFC] font-sans min-w-0 overflow-hidden relative">
      
      {/* 
        ================= PRINTABLE VIEW (HIDDEN ON SCREEN) ================= 
        This section is only visible when the user prints the page.
      */}
      <div className="hidden print:block absolute inset-0 bg-white z-[99999] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold mb-2">Facility Daily Activity Report</h1>
            <p className="text-gray-500 text-lg">
              Report Date: {selectedReportDate ? formatDisplayDate(selectedReportDate) : ''}
            </p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Exported Modules</h2>
            <div className="grid grid-cols-2 gap-4">
              {ALL_MODULES.map(mod => {
                if (!selectedModules.includes(mod)) return null;
                
                // Try to map to the report keys if they exist (rough mapping for the print view)
                let val: string | number = "N/A";
                if (currentReportData) {
                  if (mod === "patients") val = currentReportData.patient_visits;
                  else if (mod === "appointments") val = currentReportData.appointments;
                  else if (mod === "prescriptions") val = currentReportData.prescriptions;
                  else if (mod === "lab tests") val = currentReportData.lab_tests;
                  else if (mod === "health promotions") val = currentReportData.diagnosis; // mock mapping
                }

                return (
                  <div key={mod} className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="capitalize font-medium text-gray-700">{mod.replace('_', ' ')}</span>
                    <span className="font-bold">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* ================================================================= */}

      {/* Screen Layout - hidden when printing */}
      <div className="flex-1 flex flex-col h-full print:hidden">
        <OfficerDashboardHeader
          title="Reports"
          breadcrumbs={[{ label: "Reports" }, { label: "Daily Reports" }]}
        />

        <div className="flex-1 overflow-auto p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-400 font-medium whitespace-nowrap overflow-x-auto">
                <Home size={14} className="text-[#2A6543] shrink-0" />
                <span className="shrink-0">/</span>
                <span className="shrink-0">Reports</span>
                <span className="shrink-0">/</span>
                <span className="text-gray-500 shrink-0">Daily Reports</span>
              </div>
            </div>

            {/* Custom Date Range Header */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div>
                <p className="text-sm font-bold text-[#2A6543] uppercase tracking-wider mb-2">Reporting Period</p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {getCustomDateString(startDate, endDate)}
                </h1>
              </div>
              <div className="shrink-0">
                <DateRangeFilter
                  startDate={startDate}
                  endDate={endDate}
                  label="Change Reporting Week"
                  onApply={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                    setPage(1); 
                  }}
                  onClear={() => {
                    setStartDate(getToday());
                    setEndDate(get7DaysFromNow());
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {/* MAIN DATA TABLE SECTION */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
              
              <div className="p-5 sm:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-gray-50">
                <h2 className="text-[17px] font-bold text-gray-900">Daily Activity Report</h2>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative opacity-50 cursor-not-allowed">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search reports..." 
                      disabled
                      className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full sm:w-[240px] focus:outline-none transition-all placeholder:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50/50">
                      <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Date <ListFilter size={14} className="text-gray-400"/></div></th>
                      <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Patient Visits <ListFilter size={14} className="text-gray-400"/></div></th>
                      <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Appointments <ListFilter size={14} className="text-gray-400"/></div></th>
                      <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Diagnosis <ListFilter size={14} className="text-gray-400"/></div></th>
                      <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Lab Tests <ListFilter size={14} className="text-gray-400"/></div></th>
                      <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Prescriptions <ListFilter size={14} className="text-gray-400"/></div></th>
                      <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Action <ListFilter size={14} className="text-gray-400"/></div></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {isLoadingDaily ? (
                      <tr>
                        <td colSpan={7} className="py-8 px-6 text-sm text-gray-400 text-center">Loading daily activities...</td>
                      </tr>
                    ) : dailyReports.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 px-6 text-sm text-gray-400 text-center">No reports found for this period.</td>
                      </tr>
                    ) : dailyReports.map((report: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-6 text-[14px] font-medium text-gray-900 whitespace-nowrap">
                          {formatDisplayDate(report.date)}
                        </td>
                        <td className="py-5 px-6 text-[14px] text-gray-600 whitespace-nowrap font-mono">{report.patient_visits}</td>
                        <td className="py-5 px-6 text-[14px] text-gray-600 whitespace-nowrap font-mono">{report.appointments}</td>
                        <td className="py-5 px-6 text-[14px] text-gray-600 whitespace-nowrap font-mono">{report.diagnosis}</td>
                        <td className="py-5 px-6 text-[14px] text-gray-600 whitespace-nowrap font-mono">{report.lab_tests}</td>
                        <td className="py-5 px-6 text-[14px] text-gray-600 whitespace-nowrap font-mono">{report.prescriptions}</td>
                        <td className="py-5 px-6 whitespace-nowrap">
                          <button 
                            onClick={() => handleExportClick(report.date)}
                            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2A6543] hover:bg-[#EBF7F2] px-3 py-1.5 rounded-md transition-all border border-[#2A6543]/20 hover:border-[#2A6543]/50"
                          >
                            <Upload size={14} />
                            Export
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {dailyReports.length > 0 && (
                <div className="p-6 border-t border-gray-50 flex justify-center items-center gap-2 mt-auto">
                  <button 
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors mr-2"
                  >
                    &larr; Previous
                  </button>
                  <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
                  <button 
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-900 hover:text-gray-600 disabled:opacity-50 transition-colors ml-2"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* EXPORT MODAL */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 print:hidden">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setExportModalOpen(false)} />
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Export Report</h3>
                <p className="text-sm text-gray-500 mt-1">Select modules to include in the exported report for {selectedReportDate ? formatDisplayDate(selectedReportDate) : ''}.</p>
              </div>
              <button 
                onClick={() => setExportModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-3">
                {ALL_MODULES.map((moduleName) => {
                  const isChecked = selectedModules.includes(moduleName);
                  return (
                    <label 
                      key={moduleName} 
                      onClick={() => toggleModule(moduleName)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked ? 'border-[#2A6543] bg-[#F4FDF8]' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-[#2A6543] border-[#2A6543]' : 'border-gray-300'
                        }`}>
                          {isChecked && <CheckCircle size={14} className="text-white" />}
                        </div>
                        <span className={`text-[15px] font-medium capitalize ${isChecked ? 'text-[#2A6543]' : 'text-gray-700'}`}>
                          {moduleName.replace('_', ' ')}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setExportModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmExport}
                disabled={selectedModules.length === 0}
                className="px-5 py-2.5 rounded-xl font-semibold bg-[#2A6543] text-white hover:bg-[#204E33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Upload size={18} />
                Export PDF / Print
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
