"use client";

import React, { useState } from 'react';
import { 
  Settings2, 
  ChevronDown, 
  CircleCheck, 
  Fingerprint,
  MonitorCog
} from 'lucide-react';
import { LabeledInputProps, ToggleSwitchProps } from '../generics/types';
import Header from "@/src/components/adminDashboard/generics/header";
import Toast from '@/src/components/adminDashboard/generics/Toast';

const LabeledInput = ({ label, ...props }: LabeledInputProps) => {
  const inputStyles = "block w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#1AC073] focus:ring-[#1AC073]";
  const labelStyles = "absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-600 font-medium z-10";
  
  return (
    <div className="relative">
      <label className={labelStyles}>{label}</label>
      {props.type === 'select' ? (
        <div className={`${inputStyles} flex items-center cursor-pointer`}>
          <span className="flex-grow">{props.value}</span>
          <ChevronDown size={20} className="text-gray-600 ml-auto" />
        </div>
      ) : (
        <input {...props} className={inputStyles} />
      )}
    </div>
  );
};

const ToggleSwitch = ({ label, description, defaultChecked }: ToggleSwitchProps) => (
  <div className="flex items-center justify-between p-5 border border-gray-100 rounded-xl bg-white shadow-sm">
    <div className="space-y-1">
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
    <button className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${defaultChecked ? 'bg-[#1AC073]' : 'bg-gray-200'}`}>
      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${defaultChecked ? 'translate-x-6' : 'translate-x-0'}`} />
      {defaultChecked && <CircleCheck size={12} className="text-white absolute left-1.5" />}
    </button>
  </div>
);

export default function FacilityConfigurationPage() {
  const [toastVisible, setToastVisible] = useState(false);

  const breadcrumbs = [
    { label: 'Facility Management' },
    { label: 'Facility Configuration', active: true }
  ];

  const handleSave = () => {
    setToastVisible(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />

      <div className="flex-1 p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-5xl">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Facility Configuration</h2>
              <p className="text-gray-600 font-medium">Configure system-wide settings for the PHC EHR platform.</p>
            </div>

            {/* Patient ID Format Section */}
            <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-6 sm:space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E8F7F0] rounded-lg text-[#1AC073]">
                  <Fingerprint size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Patient ID Format</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LabeledInput label="Prefix" value="PAT-PLT" />
                <div className="relative">
                  <LabeledInput label="ID Length (digits)" type="select" value="6 digits" />
                  {/* Dropdown UI Mockup as seen in image */}
                  <div className="absolute top-16 left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-20 py-2">
                    {['6 digits', '7 digits', '8 digits', '9 digits', '10 digits'].map((opt, i) => (
                      <div key={opt} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${i === 0 ? 'bg-[#1AC073] border-[#1AC073]' : 'border-gray-300'}`}>
                          {i === 0 && <CircleCheck size={14} className="text-white" />}
                        </div>
                        <span className={`text-sm font-medium ${i === 0 ? 'text-gray-900' : 'text-gray-500'}`}>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                   <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Preview</p>
                   <p className="text-lg font-bold text-[#1AC073]">PAT-PLT-000234</p>
                </div>
              </div>
            </div>

            {/* System Preferences Section */}
            <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-6 sm:space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E8F7F0] rounded-lg text-[#1AC073]">
                  <MonitorCog size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">System Preferences</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <LabeledInput label="Default Language" type="select" value="English" />
                <LabeledInput label="Session Timeout" type="select" value="30 Minutes" />
              </div>

              <div className="space-y-4">
                <ToggleSwitch 
                  label="Automatic Backup" 
                  description="Automatically backup data at regular intervals" 
                  defaultChecked={true} 
                />
                <ToggleSwitch 
                  label="Reporting Module" 
                  description="Enable report generation and export features" 
                  defaultChecked={true} 
                />
                <ToggleSwitch 
                  label="Email Notifications" 
                  description="Send system alerts via email to administrators" 
                  defaultChecked={true} 
                />
                <ToggleSwitch 
                  label="System & Facility activity alerts" 
                  description="Enable alerts" 
                  defaultChecked={true} 
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-6">
                <button onClick={handleSave} className="px-8 sm:px-10 py-3.5 bg-[#046C3F] text-white rounded-xl font-semibold flex items-center gap-2.5 shadow-md">
                  <Settings2 size={20} />
                  Save Configuration
                </button>
                <button className="px-8 sm:px-10 py-3.5 bg-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-300 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>

      <Toast
        type="success"
        title="Configuration saved"
        message="Facility settings has been updated successfully."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}