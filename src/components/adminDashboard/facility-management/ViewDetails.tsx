"use client";

import React from 'react';
import { ArrowLeft, Building2, Phone, ChevronDown, Home } from 'lucide-react';

// Reusable component for the read-only form fields
const ReadOnlyField = ({ label, value, isGray = false, isDropdown = false }: { label: string; value: string; isGray?: boolean; isDropdown?: boolean }) => (
  <div className={`border border-gray-200 rounded-xl px-4 py-2.5 flex flex-col justify-center ${isGray ? 'bg-[#F9FAFB]' : 'bg-white'}`}>
    <span className="text-[11px] text-gray-500 font-medium mb-0.5">{label}</span>
    <div className="flex justify-between items-center">
      <span className={`text-sm ${isGray ? 'text-gray-500' : 'text-gray-800'} font-medium`}>
        {value}
      </span>
      {isDropdown && <ChevronDown size={18} className="text-gray-500" />}
    </div>
  </div>
);

export default function FacilityProfileView() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Home size={14} className="text-[#248253]" />
          <span>/</span>
          <span>Facility Management</span>
          <span>/</span>
          <span>Facility Details</span>
          <span>/</span>
          <span className="text-gray-500">View Details</span>
        </div>

        {/* Back Button */}
        <div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <ArrowLeft size={14} />
            Back
          </button>
        </div>

        {/* Page Title */}
        <h1 className="text-[22px] sm:text-2xl font-bold text-gray-900 pt-2">
          PHC-PLT-ABWOR DYIS – Facility Profile
        </h1>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Total Patients Card */}
          <div className="bg-[#2A6543] rounded-2xl p-6 shadow-sm text-white">
            <h3 className="text-sm font-medium text-white/80 mb-3">Total Patients</h3>
            <p className="text-3xl font-bold">1,240</p>
          </div>
          
          {/* Staff Members Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Staff Members</h3>
            <p className="text-3xl font-bold text-gray-900">27</p>
          </div>
        </div>

        {/* Main Details Form Container */}
        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-gray-100 mt-2 space-y-10">
          
          {/* Basic Facility Information Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-[#2A6543]">
                <Building2 size={24} strokeWidth={2} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Basic Facility Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ReadOnlyField 
                label="Facility Code" 
                value="PHC-PLT-000234" 
                isGray={true} 
              />
              <ReadOnlyField 
                label="Date Created" 
                value="Mar 5, 2026, 07:15 AM" 
                isGray={true} 
              />
              <ReadOnlyField 
                label="Facility Name" 
                value="PHC-PLT-ABWOR DYIS" 
              />
              <ReadOnlyField 
                label="Facility Type" 
                value="Primary Health Centre" 
              />
              <ReadOnlyField 
                label="State" 
                value="Plateau State" 
              />
              <ReadOnlyField 
                label="Local Government Area (LGA)" 
                value="Pankshin LGA" 
              />
              <ReadOnlyField 
                label="Facility Address" 
                value="Abwor Dyis, Pankshin South, No 12 Plateau State." 
              />
              <ReadOnlyField 
                label="Facility Level" 
                value="Level 2- PHC Center" 
                isDropdown={true} 
              />
            </div>
          </section>

          {/* Contact Information Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-[#2A6543]">
                <Phone size={24} strokeWidth={2} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ReadOnlyField 
                label="Facility Phone Number" 
                value="08012345352" 
              />
              <ReadOnlyField 
                label="Facility Email" 
                value="surulerephc@health.gov.ng" 
              />
              <ReadOnlyField 
                label="Facility Administrator" 
                value="Dr Musa Bello" 
              />
              <ReadOnlyField 
                label="Admin Email" 
                value="musa.bello@health.gov.ng" 
              />
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}