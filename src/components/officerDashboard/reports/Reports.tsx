"use client";

import React, { useState } from 'react';
import { 
  Search, Bell, ChevronDown, Home, Calendar, ListFilter, 
  Folder, Upload
} from 'lucide-react';

export default function ReportsView() {
  const [activeFilter, setActiveFilter] = useState('All Reports');

  const reportFilters = [
    { label: 'All Reports', count: '1,496', icon: Folder },
    { label: 'Today', count: '192', icon: Calendar },
    { label: 'Last week', count: '263', icon: Calendar },
    { label: 'Last month', count: '431', icon: Calendar },
  ];

  const reportsData = [
    { date: '2026-03-30', visits: 102, diagnosis: 23, labs: 78, meds: 21, status: 'Complete', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { date: '2026-03-29', visits: 87, diagnosis: 56, labs: 98, meds: 56, status: 'Complete', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { date: '2026-03-28', visits: 86, diagnosis: 123, labs: 102, meds: 66, status: 'Complete', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { date: '2026-03-27', visits: 56, diagnosis: 54, labs: 103, meds: 94, status: 'Incomplete', statusStyle: 'bg-[#FFF5EB] text-[#F97316]' },
    { date: '2026-03-26', visits: 43, diagnosis: 75, labs: 78, meds: 12, status: 'Complete', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { date: '2026-03-25', visits: 45, diagnosis: 68, labs: 99, meds: 56, status: 'Incomplete', statusStyle: 'bg-[#FFF5EB] text-[#F97316]' },
    { date: '2026-03-24', visits: 86, diagnosis: 12, labs: 55, meds: 56, status: 'Complete', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { date: '2026-03-23', visits: 12, diagnosis: 45, labs: 13, meds: 67, status: 'Incomplete', statusStyle: 'bg-[#FFF5EB] text-[#F97316]' },
    { date: '2026-03-22', visits: 93, diagnosis: 45, labs: 55, meds: 23, status: 'Complete', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { date: '2026-03-21', visits: 22, diagnosis: 23, labs: 43, meds: 34, status: 'Incomplete', statusStyle: 'bg-[#FFF5EB] text-[#F97316]' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen bg-[#F8FAFC] font-sans min-w-0 overflow-hidden">
      
      {/* Top Header */}
      <header className="h-[88px] bg-white border-b border-gray-100 flex items-center justify-between px-6 sm:px-8 shrink-0">
        <div className="flex items-center gap-10">
          <h1 className="text-[22px] font-bold text-gray-900 hidden sm:block">Reports</h1>
          
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
          
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
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
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-medium whitespace-nowrap overflow-x-auto">
            <Home size={14} className="text-[#2A6543] shrink-0" />
            <span className="shrink-0">/</span>
            <span className="shrink-0">Reports</span>
            <span className="shrink-0">/</span>
            <span className="text-gray-500 shrink-0">Daily Reports</span>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[32px] font-bold text-gray-900 mb-2">
              Reports
            </h1>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {reportFilters.map((filter) => {
              const isActive = activeFilter === filter.label;
              return (
                <button 
                  key={filter.label}
                  onClick={() => setActiveFilter(filter.label)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-colors ${
                    isActive 
                      ? 'border-[#2A6543] text-[#2A6543] bg-white shadow-sm' 
                      : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                  }`}
                >
                  <filter.icon size={18} className={isActive ? 'text-[#2A6543]' : 'text-gray-400'} />
                  <span className={`text-[15px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {filter.label}
                  </span>
                  <span className={`ml-1 px-2.5 py-0.5 text-xs font-bold rounded-md ${
                    isActive ? 'bg-[#2A6543] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* MAIN DATA TABLE SECTION */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
            
            {/* Table Header & Controls */}
            <div className="p-5 sm:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-gray-50">
              <h2 className="text-[17px] font-bold text-gray-900">Facility Reports</h2>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by reports" 
                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full sm:w-[240px] focus:outline-none focus:border-[#2A6543] focus:ring-1 focus:ring-[#2A6543] transition-all placeholder:text-gray-400"
                  />
                </div>
                
                {/* Date Range Button */}
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Calendar size={16} className="text-gray-400" />
                  Date Range
                </button>

                {/* Status Dropdown Button */}
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  All Status
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Date <ListFilter size={14} className="text-gray-400"/></div></th>
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Patient Visits <ListFilter size={14} className="text-gray-400"/></div></th>
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Diagnosis <ListFilter size={14} className="text-gray-400"/></div></th>
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Lab Tests <ListFilter size={14} className="text-gray-400"/></div></th>
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Medications <ListFilter size={14} className="text-gray-400"/></div></th>
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Status <ListFilter size={14} className="text-gray-400"/></div></th>
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Action <ListFilter size={14} className="text-gray-400"/></div></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reportsData.map((report, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-6 text-[14px] text-gray-500 whitespace-nowrap">{report.date}</td>
                      <td className="py-5 px-6 text-[14px] text-gray-600 whitespace-nowrap">{report.visits}</td>
                      <td className="py-5 px-6 text-[14px] text-gray-600 whitespace-nowrap">{report.diagnosis}</td>
                      <td className="py-5 px-6 text-[14px] text-gray-600 whitespace-nowrap">{report.labs}</td>
                      <td className="py-5 px-6 text-[14px] text-gray-600 whitespace-nowrap">{report.meds}</td>
                      <td className="py-5 px-6 whitespace-nowrap">
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${report.statusStyle}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-5 px-6 whitespace-nowrap">
                        <button className="flex items-center gap-2 text-[13px] font-semibold text-[#2A6543] hover:underline transition-all">
                          <Upload size={16} />
                          Export
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
    </div>
  );
}