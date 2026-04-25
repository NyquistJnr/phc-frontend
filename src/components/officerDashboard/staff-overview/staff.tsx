"use client";

import React, { useState } from 'react';
import { 
  Search, Bell, ChevronDown, Home, Calendar, ListFilter, Check,
  Users, UserCheck, UserMinus
} from 'lucide-react';

export default function StaffOverviewView() {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState('All Status');

  const statusOptions = ['All Status', 'Active', 'Inactive'];

  const staffData = [
    { date: '12 Mar 2026', name: 'Dr. Amina Hassan', role: 'Doctor', lastActive: 'Today', status: 'Active', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { date: '12 Mar 2026', name: 'Dr. Bola Okafor', role: 'Doctor', lastActive: 'Today', status: 'Active', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { date: '12 Mar 2026', name: 'Nurse Joy Eze', role: 'Nurse', lastActive: 'Yesterday', status: 'Inactive', statusStyle: 'bg-[#FFF5EB] text-[#F97316]' },
    { date: '12 Mar 2026', name: 'Chidi Nwosu', role: 'Lab Technician', lastActive: '2 days ago', status: 'Inactive', statusStyle: 'bg-[#FFF5EB] text-[#F97316]' },
    { date: '12 Mar 2026', name: 'Hauwa Garba', role: 'Pharmacist', lastActive: '3 days ago', status: 'Inactive', statusStyle: 'bg-[#FFF5EB] text-[#F97316]' },
    { date: '12 Mar 2026', name: 'Emeka Obi', role: 'CHEW', lastActive: '4 days ago', status: 'Active', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { date: '12 Mar 2026', name: 'Emeka Obi', role: 'CHEW', lastActive: '4 days ago', status: 'Active', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { date: '12 Mar 2026', name: 'Emeka Obi', role: 'CHEW', lastActive: '4 days ago', status: 'Active', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { date: '12 Mar 2026', name: 'Emeka Obi', role: 'CHEW', lastActive: '4 days ago', status: 'Inactive', statusStyle: 'bg-[#FFF5EB] text-[#F97316]' },
    { date: '12 Mar 2026', name: 'Emeka Obi', role: 'CHEW', lastActive: '4 days ago', status: 'Inactive', statusStyle: 'bg-[#FFF5EB] text-[#F97316]' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen bg-[#F8FAFC] font-sans min-w-0 overflow-hidden">
      
      {/* Top Header */}
      <header className="h-[88px] bg-white border-b border-gray-100 flex items-center justify-between px-6 sm:px-8 shrink-0">
        <div className="flex items-center gap-10">
          <h1 className="text-[22px] font-bold text-gray-900 hidden sm:block">Staff Overview</h1>
          
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
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-medium whitespace-nowrap overflow-x-auto">
            <Home size={14} className="text-[#2A6543] shrink-0" />
            <span className="shrink-0">/</span>
            <span className="shrink-0">Staff Overview</span>
            <span className="shrink-0">/</span>
            <span className="text-gray-500 shrink-0">Staff activity summary</span>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 mb-2">
              Staff Overview
            </h1>
            <p className="text-gray-500 font-medium">Real-time activity summary across all staff units.</p>
          </div>

          {/* TOP METRICS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {/* Active Green Card */}
            <div className="bg-[#2A6543] rounded-[20px] p-5 shadow-sm text-white flex flex-col justify-between h-[130px]">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Users size={18} className="text-white" />
                </div>
                <button className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors font-medium">
                  This Week <ChevronDown size={14} />
                </button>
              </div>
              <div>
                <p className="text-[13px] font-medium text-white/80 mb-1">Total Staff</p>
                <p className="text-3xl font-bold leading-none">42</p>
              </div>
            </div>

            {/* Standard Metric Cards */}
            {[
              { title: 'Active Today', value: '37', icon: UserCheck },
              { title: 'Off Duty', value: '5', icon: UserMinus }
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-[130px]">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-[#EBF7F2] rounded-lg text-[#2A6543]">
                    <card.icon size={18} />
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
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
            
            {/* Table Header & Controls */}
            <div className="p-5 sm:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-gray-50">
              <h2 className="text-[17px] font-bold text-gray-900">Staff Overview table</h2>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by staff name or role..." 
                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full sm:w-[260px] focus:outline-none focus:border-[#2A6543] focus:ring-1 focus:ring-[#2A6543] transition-all placeholder:text-gray-400"
                  />
                </div>
                
                {/* Date Range Button */}
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Calendar size={16} className="text-gray-400" />
                  Date Range
                </button>

                {/* All Role Dropdown Button */}
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  All Role
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {/* Status Dropdown Container */}
                <div className="relative">
                  <button 
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-2 bg-white border ${isStatusDropdownOpen ? 'border-gray-400' : 'border-gray-200'} rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors`}
                  >
                    {activeStatusFilter}
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>

                  {/* Dropdown Menu (Open State) */}
                  {isStatusDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-[200px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-30 p-3 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      {statusOptions.map((option) => {
                        const isSelected = activeStatusFilter === option;
                        return (
                          <label 
                            key={option}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors"
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0
                              ${isSelected ? 'bg-[#2A6543] border-[#2A6543]' : 'border-gray-300 group-hover:border-gray-400'}`}
                            >
                              {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className={`text-[15px] ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                              {option}
                            </span>
                            <input 
                              type="radio" 
                              name="statusFilter" 
                              className="hidden" 
                              checked={isSelected}
                              onChange={() => {
                                setActiveStatusFilter(option);
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
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Date <ListFilter size={14} className="text-gray-400"/></div></th>
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Staff Name <ListFilter size={14} className="text-gray-400"/></div></th>
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Role <ListFilter size={14} className="text-gray-400"/></div></th>
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Last Active <ListFilter size={14} className="text-gray-400"/></div></th>
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"><div className="flex items-center gap-2">Status <ListFilter size={14} className="text-gray-400"/></div></th>
                    <th className="py-4 px-6 font-semibold text-gray-500 text-xs whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {staffData.map((staff, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-6 text-[13px] text-gray-500 font-medium whitespace-nowrap">{staff.date}</td>
                      <td className="py-5 px-6 text-[13px] text-gray-600 font-medium whitespace-nowrap">{staff.name}</td>
                      <td className="py-5 px-6 text-[13px] text-gray-500 whitespace-nowrap">{staff.role}</td>
                      <td className="py-5 px-6 text-[13px] text-gray-500 whitespace-nowrap">{staff.lastActive}</td>
                      <td className="py-5 px-6 whitespace-nowrap">
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${staff.statusStyle}`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="py-5 px-6 whitespace-nowrap text-right">
                        <button className="text-[13px] font-semibold text-[#2A6543] hover:underline transition-all">
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
    </div>
  );
}