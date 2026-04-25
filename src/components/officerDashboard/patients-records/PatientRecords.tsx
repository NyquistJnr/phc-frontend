"use client";

import React, { useState } from 'react';
import { 
  Search, Bell, ChevronDown, 
  ListFilter, Home, Calendar, Check, Users, Stethoscope, ClipboardList, Folder
} from 'lucide-react';

export default function PatientRecordsSearch() {
  // State to manage the open/close of the Module dropdown
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false); // Changed to false so it doesn't open on load
  const [activeModule, setActiveModule] = useState('All Module');

  // State to manage the open/close of the Status dropdown
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('All Status');

  const patientsData = [
    { id: 'PAT-PLT-000234', name: 'Aisha Mohammed', module: 'Consultation', time: '2026-03-08 08:42:15', status: 'Seen', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { id: 'PAT-PLT-000234', name: 'Aisha Mohammed', module: 'Laboratory', time: '2026-03-08 08:31:02', status: 'Waiting', statusStyle: 'bg-[#FFF5EB] text-[#F97316]' },
    { id: 'PAT-PLT-000234', name: 'Fatima Bello', module: 'Pharmacy', time: '2026-03-08 08:15:44', status: 'Seen', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { id: 'PAT-PLT-000234', name: 'Usman Garba', module: 'Consultation', time: '2026-03-08 07:58:33', status: 'Referred', statusStyle: 'bg-[#FEF2F2] text-[#EF4444]' },
    { id: 'PAT-PLT-000234', name: 'Halima Sani', module: 'Consultation', time: '2026-03-08 07:44:00', status: 'Seen', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { id: 'PAT-PLT-000234', name: 'Halima Sani', module: 'Consultation', time: '2026-03-08 07:44:00', status: 'Seen', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { id: 'PAT-PLT-000234', name: 'Halima Sani', module: 'Consultation', time: '2026-03-08 07:44:00', status: 'Seen', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { id: 'PAT-PLT-000234', name: 'Halima Sani', module: 'Consultation', time: '2026-03-08 07:44:00', status: 'Seen', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { id: 'PAT-PLT-000234', name: 'Halima Sani', module: 'Consultation', time: '2026-03-08 07:44:00', status: 'Seen', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { id: 'PAT-PLT-000234', name: 'Halima Sani', module: 'Consultation', time: '2026-03-08 07:44:00', status: 'Seen', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
  ];

  const modules = ['All Module', 'Consultations', 'Laboratory', 'Pharmacy'];
  const statusOptions = ['All Status', 'Seen', 'Waiting', 'Referred'];

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen bg-[#F8FAFC] font-sans min-w-0 overflow-hidden">
      
      {/* Top Header */}
      <header className="h-[88px] bg-white border-b border-gray-100 flex items-center justify-between px-6 sm:px-8 shrink-0">
        <div className="flex items-center gap-10">
          <h1 className="text-[22px] font-bold text-gray-900 hidden sm:block">Patient Records</h1>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-[500px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#2A6543] focus:ring-1 focus:ring-[#2A6543] transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-tight">Nobert</p>
              <p className="text-[11px] font-semibold text-gray-500">OIC</p>
            </div>
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-10 h-10 rounded-full border border-gray-100 object-cover" />
          </div>
        </div>
      </header>

      {/* Scrollable Page Content */}
      <div className="flex-1 overflow-auto p-6 sm:p-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-medium">
          <Home size={14} className="text-[#2A6543]" />
          <span>/</span>
          <span>Patient Records</span>
          <span>/</span>
          <span className="text-gray-500">Search Patient</span>
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
              <p className="text-[13px] font-medium mb-2.5">Today's Patients</p>
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
                  placeholder="Search patient by name or ID..." 
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full sm:w-[240px] focus:outline-none focus:border-[#2A6543] focus:ring-1 focus:ring-[#2A6543] transition-all placeholder:text-gray-400"
                />
              </div>
              
              {/* Date Range Button */}
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Calendar size={16} className="text-gray-400" />
                Date Range
              </button>

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
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Patient ID <ListFilter size={14} className="text-gray-400"/></div></th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Patient Name <ListFilter size={14} className="text-gray-400"/></div></th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Module <ListFilter size={14} className="text-gray-400"/></div></th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Timestamp <ListFilter size={14} className="text-gray-400"/></div></th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Status <ListFilter size={14} className="text-gray-400"/></div></th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Action <ListFilter size={14} className="text-gray-400"/></div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patientsData.map((patient, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-6 text-[13px] text-gray-500 font-medium whitespace-nowrap">{patient.id}</td>
                    <td className="py-5 px-6 text-[13px] text-gray-600 font-medium whitespace-nowrap">{patient.name}</td>
                    <td className="py-5 px-6 text-[13px] text-gray-500 whitespace-nowrap">{patient.module}</td>
                    <td className="py-5 px-6 text-[13px] text-gray-500 whitespace-nowrap font-mono">{patient.time}</td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${patient.statusStyle}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <button className="text-sm font-semibold text-[#2A6543] hover:underline transition-all">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-6 border-t border-gray-50 flex justify-center items-center gap-2 mt-auto">
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors mr-2">
              &larr; Previous
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-900 text-white text-sm font-medium shadow-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium transition-colors">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium transition-colors">
              3
            </button>
            <span className="text-gray-400 tracking-widest px-1">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium transition-colors">
              67
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium transition-colors">
              68
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors ml-2">
              Next &rarr;
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}