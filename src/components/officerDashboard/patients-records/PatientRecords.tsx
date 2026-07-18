"use client";

import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, Search,
  ListFilter, Home, Check, Users, Stethoscope, ClipboardList, Folder
} from 'lucide-react';
import OfficerDashboardHeader from "@/src/components/officerDashboard/generics/OfficerDashboardHeader";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import {
  useClinicalStats,
  useRecentAppointments,
} from "@/src/hooks/core/use-clinical-analytics";
import Link from 'next/link';

export default function PatientRecordsSearch() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Status/Module filters are kept for UI purposes as they aren't explicitly requested to be wired to the API in the docs
  // but if the API supported them, we'd add them to the hook.
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('All Module');

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('All Status');

  const { data: clinicalStats, isLoading: isLoadingStats } = useClinicalStats({
    start_date: startDate,
    end_date: endDate,
  });

  const { data: recentPatientsData, isLoading: isLoadingPatients } = useRecentAppointments({
    search: debouncedSearch,
    page: page,
    page_size: 5,
  });

  const modules = ['All Module', 'Consultations', 'Laboratory', 'Pharmacy'];
  const statusOptions = ['All Status', 'Seen', 'Waiting', 'Referred'];

  const recentPatients = recentPatientsData?.results || [];
  const totalCount = recentPatientsData?.count || 0;
  const totalPages = Math.ceil(totalCount / 5) || 1;

  const handleNextPage = () => {
    if (page < totalPages) setPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen bg-[#F8FAFC] font-sans min-w-0 overflow-hidden">
      <OfficerDashboardHeader
        title="Patient Records"
        breadcrumbs={[{ label: "Patient Records" }, { label: "Search Patient" }]}
      />

      {/* Scrollable Page Content */}
      <div className="flex-1 overflow-auto p-6 sm:p-8">
        
        {/* Breadcrumbs & Date Range Filter Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
            <Home size={14} className="text-[#2A6543]" />
            <span>/</span>
            <span>Patient Records</span>
            <span>/</span>
            <span className="text-gray-500">Search Patient</span>
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

        {/* MAIN DATA TABLE SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
          
          {/* Table Header & Controls */}
          <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-50">
            <h2 className="text-[17px] font-bold text-gray-900">Recent Patients</h2>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1); // reset to page 1 on search
                  }}
                  placeholder="Search patient by name or ID..." 
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full sm:w-[240px] focus:outline-none focus:border-[#2A6543] focus:ring-1 focus:ring-[#2A6543] transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Module Dropdown Container */}
              <div className="relative">
                <button 
                  onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-2 bg-white border ${isModuleDropdownOpen ? 'border-[#2A6543] ring-1 ring-[#2A6543]' : 'border-gray-200'} rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all`}
                >
                  {activeModule}
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {/* Dropdown Menu (Open State) */}
                {isModuleDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-[220px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-30 p-3 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {modules.map((module) => {
                      const isSelected = activeModule === module;
                      return (
                        <label 
                          key={module}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors"
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0
                            ${isSelected ? 'bg-[#2A6543] border-[#2A6543]' : 'border-gray-300 group-hover:border-gray-400'}`}
                          >
                            {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                          </div>
                          <span className={`text-[15px] ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                            {module}
                          </span>
                          <input 
                            type="radio" 
                            name="moduleFilter" 
                            className="hidden" 
                            checked={isSelected}
                            onChange={() => {
                              setActiveModule(module);
                              setIsModuleDropdownOpen(false); // Close after selection
                            }}
                          />
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Status Dropdown Container */}
              <div className="relative">
                <button 
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-2 bg-white border ${isStatusDropdownOpen ? 'border-[#2A6543] ring-1 ring-[#2A6543]' : 'border-gray-200'} rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all`}
                >
                  {activeStatus}
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {/* Dropdown Menu (Open State) */}
                {isStatusDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-[220px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-30 p-3 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {statusOptions.map((status) => {
                      const isSelected = activeStatus === status;
                      return (
                        <label 
                          key={status}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors"
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0
                            ${isSelected ? 'bg-[#2A6543] border-[#2A6543]' : 'border-gray-300 group-hover:border-gray-400'}`}
                          >
                            {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                          </div>
                          <span className={`text-[15px] ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                            {status}
                          </span>
                          <input 
                            type="radio" 
                            name="statusFilter" 
                            className="hidden" 
                            checked={isSelected}
                            onChange={() => {
                              setActiveStatus(status);
                              setIsStatusDropdownOpen(false); // Close after selection
                            }}
                          />
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Patient Name <ListFilter size={14} className="text-gray-400"/></div></th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Phone Number <ListFilter size={14} className="text-gray-400"/></div></th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Email <ListFilter size={14} className="text-gray-400"/></div></th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Timestamp <ListFilter size={14} className="text-gray-400"/></div></th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Status <ListFilter size={14} className="text-gray-400"/></div></th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Action <ListFilter size={14} className="text-gray-400"/></div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoadingPatients ? (
                   <tr>
                     <td colSpan={6} className="py-8 px-6 text-[13px] text-gray-400 text-center">Loading patients...</td>
                   </tr>
                ) : recentPatients.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="py-8 px-6 text-[13px] text-gray-400 text-center">No recent patients found.</td>
                   </tr>
                ) : recentPatients.map((patient: any, index: number) => {
                   const status = patient.recent_appointment_status;
                   const statusStyle = 
                     status === "Seen" ? "bg-[#EBF7F2] text-[#2A6543]" :
                     status === "Referred" ? "bg-red-50 text-red-600" :
                     "bg-orange-50 text-orange-600"; // Waiting
                     
                   return (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-6 text-[13px] text-gray-600 font-medium whitespace-nowrap">{patient.first_name} {patient.last_name}</td>
                    <td className="py-5 px-6 text-[13px] text-gray-500 whitespace-nowrap">
                      {patient.phone_number ? (
                        patient.phone_number
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px] italic">
                          Not Applicable (Minor)
                        </span>
                      )}
                    </td>
                    <td className="py-5 px-6 text-[13px] text-gray-500 whitespace-nowrap">
                      {patient.email ? (
                        patient.email
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px] italic">
                          Not Applicable (Minor)
                        </span>
                      )}
                    </td>
                    <td className="py-5 px-6 text-[13px] text-gray-500 whitespace-nowrap font-mono">{formatDate(patient.recent_appointment_date)}</td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusStyle}`}>
                        {status || "Unknown"}
                      </span>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <Link href={`/oic-dashboard/patient-records/${patient.id}`} className="text-sm font-semibold text-[#2A6543] hover:underline transition-all">
                        View
                      </Link>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {recentPatients.length > 0 && (
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
  );
}
