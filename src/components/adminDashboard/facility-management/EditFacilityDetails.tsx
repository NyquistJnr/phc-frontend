"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  ArrowLeft,
  Phone,
  CircleCheck,
  ChevronDown
} from 'lucide-react';
import { LabeledInputProps } from '../generics/types';
import Header from '@/src/components/adminDashboard/generics/header';
import Toast from '@/src/components/adminDashboard/generics/Toast';

const LabeledInput = ({ label, ...props }: LabeledInputProps) => {
  const inputStyles = "block w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#1AC073] focus:ring-[#1AC073]";
  const labelStyles = "absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-600 font-medium z-10";
  
  return (
    <div className="relative">
      <label className={labelStyles}>{label}</label>
      {props.type === 'select' ? (
        <div className={`${inputStyles} flex items-center cursor-pointer`}>
          <span className="grow">{props.value}</span>
          <ChevronDown size={20} className="text-gray-600 ml-auto" />
        </div>
      ) : (
        <input {...props} className={inputStyles} />
      )}
    </div>
  );
};

export default function FacilityProfilePage() {
  const [toastVisible, setToastVisible] = useState(false);

  const breadcrumbs = [
    { label: 'Facility Management' },
    { label: 'Facility Details' },
    { label: 'Edit Details', active: true }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastVisible(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />

      <div className="flex-1 p-4 sm:p-8 pt-4 space-y-6 sm:space-y-8">
            
            <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 bg-white rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition mb-6">
              <ArrowLeft size={16}/>
              Back
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">PHC-PLT-ABWOR DYIS – Facility Profile</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="bg-[#046C3F] text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm">
                <p className="text-sm font-medium opacity-80 mb-2">Total Patients</p>
                <p className="text-3xl sm:text-5xl font-bold">1,240</p>
              </div>
              <div className="bg-white text-gray-900 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-2">Staff Members</p>
                <p className="text-3xl sm:text-5xl font-bold">27</p>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white p-4 sm:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-10 sm:space-y-12">
              <form onSubmit={handleSave} className="space-y-10 sm:space-y-12">
                
                {/* Basic Facility Information Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                      <Building2 className='text-[#046C3F]' size={24}/>
                      <h3 className="text-xl font-semibold text-gray-900">Basic Facility Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                      <LabeledInput label="Facility Code" type="text" value="PHC-PLT-000234" disabled />
                      <LabeledInput label="Date Created" type="text" value="Mar 5, 2026, 07:15 AM" disabled />
                      <LabeledInput label="Facility Name" type="text" value="PHC-PLT-ABWOR DYIS" />
                      <LabeledInput label="Facility Type" type="text" value="Primary Health Centre" />
                      <LabeledInput label="State" type="text" value="Plateau State" />
                      <LabeledInput label="Local Government Area (LGA)" type="text" value="Pankshin LGA" />
                      <LabeledInput label="Facility Address" type="text" value="Abwor Dyis, Pankshin South, No 12 Plateau State." />
                      <LabeledInput label="Facility Level" type="select" value="Level 2 - PHC Center" />
                  </div>
                </section>

                {/* Contact Information Section */}
                <section className="space-y-6 pt-10 border-t border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                      <Phone className='text-[#046C3F]' size={24}/>
                      <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                      <LabeledInput label="Facility Phone Number" type="tel" value="08012345352" />
                      <LabeledInput label="Facility Email" type="email" value="surulerephc@health.gov.ng" />
                      <LabeledInput label="Facility Administrator" type="text" value="Dr Musa Bello" />
                      <LabeledInput label="Admin Email" type="email" value="musa.bello@health.gov.ng" />
                  </div>
                </section>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-6">
                    <button type="submit" className="px-8 sm:px-10 py-3.5 bg-[#046C3F] text-white rounded-xl font-semibold flex items-center gap-2.5 shadow-md hover:bg-[#035a34] transition-colors">
                        <CircleCheck size={20} />
                        Save Changes
                    </button>
                    <button type="button" className="px-8 sm:px-10 py-3.5 bg-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-300 transition">
                        Cancel
                    </button>
                </div>
              </form>
            </div>
          </div>

      <Toast
        type="success"
        title="Facility Updated"
        message="PHC-PLT-ABWOR DYIS details has been updated"
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}