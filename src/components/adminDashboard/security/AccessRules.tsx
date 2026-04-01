"use client";

import React, { useState } from 'react';
import { 
  Clock, 
  KeyRound, 
  ShieldCheck, 
  ChevronDown, 
  Check,
  Save
} from 'lucide-react';
import Header from '@/src/components/adminDashboard/generics/header';
import Toast from '@/src/components/adminDashboard/generics/Toast';

// Reusable Dropdown Field Component
const DropdownField = ({ label, value, options }: { label: string; value: string; options?: string[] }) => {
  return (
    <div className="relative border border-gray-200 rounded-xl px-4 py-2 bg-white flex flex-col justify-center cursor-pointer hover:border-gray-300 transition-colors group">
      <span className="text-[11px] text-gray-500 font-medium mb-0.5">{label}</span>
      <div className="flex justify-between items-center">
        <span className="text-[15px] text-gray-900 font-medium">
          {value}
        </span>
        <ChevronDown size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </div>
  );
};

// Reusable Toggle Row Component
const ToggleRow = ({ title, description, isChecked, onChange }: { title: string; description: string; isChecked: boolean; onChange: (val: boolean) => void }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white hover:border-gray-200 transition-colors">
      <div className="space-y-0.5 pr-4">
        <h4 className="text-[15px] font-medium text-gray-900">{title}</h4>
        <p className="text-[13px] text-gray-500">{description}</p>
      </div>
      
      {/* Custom Toggle Switch */}
      <button 
        type="button"
        onClick={() => onChange(!isChecked)}
        className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 border border-transparent ${isChecked ? 'bg-[#2A6543]' : 'bg-gray-200'}`}
      >
        <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transform transition-transform flex items-center justify-center ${isChecked ? 'translate-x-[22px]' : 'translate-x-1'}`}>
          {isChecked && <Check size={12} className="text-[#2A6543]" strokeWidth={3} />}
          {!isChecked && <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
        </div>
      </button>
    </div>
  );
};

export default function AccessRulesPage() {
  const [toastVisible, setToastVisible] = useState(false);

  // State for toggles
  const [passwordRules, setPasswordRules] = useState({
    uppercase: true,
    numbers: true,
    special: true,
    forceReset: true
  });

  const [advancedRules, setAdvancedRules] = useState({
    twoFactor: false,
    ipRestriction: false,
    loginHours: false
  });

  const breadcrumbs = [
    { label: 'Security' },
    { label: 'Access Rules', active: true }
  ];

  const handleSave = () => {
    setToastVisible(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="Dashboard" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 max-w-[900px]">
        
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Access Rules</h1>
          <p className="text-gray-500">Configure login policies, password requirements, and access restrictions.</p>
        </div>

        <div className="space-y-6">
          
          {/* Session Security Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#E8F7F0] rounded-lg text-[#2A6543]">
                <Clock size={20} />
              </div>
              <h2 className="text-[19px] font-bold text-gray-900">Session Security</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <DropdownField label="Session Timeout (min)" value="30" />
              <DropdownField label="Max Login Attempts" value="5 attempts" />
              <DropdownField label="Lockout Duration (min)" value="15" />
            </div>
          </section>

          {/* Password Policy Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#E8F7F0] rounded-lg text-[#2A6543]">
                <KeyRound size={20} />
              </div>
              <h2 className="text-[19px] font-bold text-gray-900">Password Policy</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <DropdownField label="Minimum Password Length" value="8 Characters" />
              <DropdownField label="Password Expiry (days)" value="90 days" />
            </div>

            <div className="space-y-4">
              <ToggleRow 
                title="Require Uppercase Letters" 
                description="Password must contain at least one uppercase letter"
                isChecked={passwordRules.uppercase}
                onChange={(val) => setPasswordRules({...passwordRules, uppercase: val})}
              />
              <ToggleRow 
                title="Require Numbers" 
                description="Password must contain at least one numeric character"
                isChecked={passwordRules.numbers}
                onChange={(val) => setPasswordRules({...passwordRules, numbers: val})}
              />
              <ToggleRow 
                title="Require Special Characters" 
                description="Password must contain at least one special character (@, #, !, etc.)"
                isChecked={passwordRules.special}
                onChange={(val) => setPasswordRules({...passwordRules, special: val})}
              />
              <ToggleRow 
                title="Force Password Reset on First Login" 
                description="New users must change their temporary password on first login"
                isChecked={passwordRules.forceReset}
                onChange={(val) => setPasswordRules({...passwordRules, forceReset: val})}
              />
            </div>
          </section>

          {/* Advanced Security Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#E8F7F0] rounded-lg text-[#2A6543]">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-[19px] font-bold text-gray-900">Advanced Security</h2>
            </div>

            <div className="space-y-4">
              <ToggleRow 
                title="Two-Factor Authentication (2FA)" 
                description="Require 2FA for all admin and privileged accounts"
                isChecked={advancedRules.twoFactor}
                onChange={(val) => setAdvancedRules({...advancedRules, twoFactor: val})}
              />
              <ToggleRow 
                title="IP Address Restriction" 
                description="Restrict login to specific IP ranges"
                isChecked={advancedRules.ipRestriction}
                onChange={(val) => setAdvancedRules({...advancedRules, ipRestriction: val})}
              />
              <ToggleRow 
                title="Restrict Login Hours" 
                description="Only allow logins during specific hours"
                isChecked={advancedRules.loginHours}
                onChange={(val) => setAdvancedRules({...advancedRules, loginHours: val})}
              />
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 pb-8">
            <button 
              onClick={handleSave}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#2A6543] text-white rounded-xl font-semibold flex items-center justify-center gap-2.5 shadow-sm hover:bg-[#235337] transition-colors"
            >
              <Save size={18} />
              Save Access Rules
            </button>
            <button 
              className="w-full sm:w-auto px-8 py-3.5 bg-[#E2E8F0] text-gray-700 rounded-xl font-semibold hover:bg-[#CBD5E1] transition-colors"
            >
              Reset to defaults
            </button>
          </div>

        </div>
      </div>

      <Toast
        type="success"
        title="Rules Updated"
        message="Access rules have been saved successfully."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}