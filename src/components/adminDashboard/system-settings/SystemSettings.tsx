"use client";

import React, { useState } from 'react';
import {
  UserCog,
  AlertCircle,
  Bell,
  ChevronDown,
  Save,
  Check,
} from 'lucide-react';
import Header from '@/src/components/adminDashboard/generics/header';
import Toast from '@/src/components/adminDashboard/generics/Toast';

// ── Reusable: inline-label text input ──────────────────────────────────────
const InputField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="relative border border-gray-200 rounded-xl px-4 py-2 bg-white flex flex-col justify-center focus-within:border-[#1AC073] transition-colors">
    <span className="text-[11px] text-gray-500 font-medium mb-0.5">{label}</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="text-[15px] text-gray-900 font-medium bg-transparent outline-none placeholder:text-gray-400 w-full"
    />
  </div>
);

// ── Reusable: inline-label dropdown ────────────────────────────────────────
const DropdownField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-200 rounded-xl px-4 py-2 bg-white flex flex-col justify-center cursor-pointer hover:border-gray-300 transition-colors group"
      >
        <span className="text-[11px] text-gray-500 font-medium mb-0.5">{label}</span>
        <div className="flex justify-between items-center">
          <span className="text-[15px] text-gray-900 font-medium">{value}</span>
          <ChevronDown
            size={18}
            className={`text-gray-400 group-hover:text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-[14px] font-medium transition-colors ${
                value === opt
                  ? 'bg-[#E8F7F0] text-[#2A6543]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Reusable: toggle row ────────────────────────────────────────────────────
const ToggleRow = ({
  title,
  description,
  isChecked,
  onChange,
}: {
  title: string;
  description: string;
  isChecked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white hover:border-gray-200 transition-colors">
    <div className="space-y-0.5 pr-4">
      <h4 className="text-[15px] font-medium text-gray-900">{title}</h4>
      <p className="text-[13px] text-gray-500">{description}</p>
    </div>

    <button
      type="button"
      onClick={() => onChange(!isChecked)}
      className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 border border-transparent ${
        isChecked ? 'bg-[#2A6543]' : 'bg-gray-200'
      }`}
    >
      <div
        className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transform transition-transform flex items-center justify-center ${
          isChecked ? 'translate-x-[22px]' : 'translate-x-1'
        }`}
      >
        {isChecked ? (
          <Check size={12} className="text-[#2A6543]" strokeWidth={3} />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        )}
      </div>
    </button>
  </div>
);

// ── Main component ──────────────────────────────────────────────────────────
export default function SystemSettingsPage() {
  const [toastVisible, setToastVisible] = useState(false);

  // General Settings state
  const [systemName, setSystemName] = useState('PHC EHR System');
  const [systemVersion, setSystemVersion] = useState('1.0.0');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('African/Lagos (WAT, UTC +1)');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  // Maintenance Mode state
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');

  // Notification Settings state
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    debug: true,
  });

  const breadcrumbs = [{ label: 'System Settings', active: true }];

  const handleSave = () => {
    setToastVisible(true);
  };

  const handleReset = () => {
    setSystemName('PHC EHR System');
    setSystemVersion('1.0.0');
    setLanguage('English');
    setTimezone('African/Lagos (WAT, UTC +1)');
    setDateFormat('DD/MM/YYYY');
    setMaintenanceEnabled(false);
    setMaintenanceMessage('');
    setNotifications({ email: true, sms: false, debug: true });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="Dashboard" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 max-w-[900px]">

        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
          <p className="text-gray-500">Configure global system preferences and maintenance options.</p>
        </div>

        <div className="space-y-6">

          {/* ── General Settings ─────────────────────────────────────────── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#E8F7F0] rounded-lg text-[#2A6543]">
                <UserCog size={20} />
              </div>
              <h2 className="text-[19px] font-bold text-gray-900">General Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <InputField
                label="System Name"
                value={systemName}
                onChange={setSystemName}
                placeholder="PHC EHR System"
              />
              <InputField
                label="System Version"
                value={systemVersion}
                onChange={setSystemVersion}
                placeholder="1.0.0"
              />
              <DropdownField
                label="Default Language"
                value={language}
                options={['English', 'Hausa', 'Yoruba', 'Igbo']}
                onChange={setLanguage}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Timezone"
                value={timezone}
                onChange={setTimezone}
                placeholder="African/Lagos (WAT, UTC +1)"
              />
              <DropdownField
                label="Date Format"
                value={dateFormat}
                options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY']}
                onChange={setDateFormat}
              />
            </div>
          </section>

          {/* ── Maintenance Mode ─────────────────────────────────────────── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#E8F7F0] rounded-lg text-[#2A6543]">
                <AlertCircle size={20} />
              </div>
              <h2 className="text-[19px] font-bold text-gray-900">Maintenance Mode</h2>
            </div>

            <div className="space-y-5">
              <ToggleRow
                title="Enable Maintenance Mode"
                description="Disable system access for all non-admin users"
                isChecked={maintenanceEnabled}
                onChange={setMaintenanceEnabled}
              />

              <div className="relative border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:border-[#1AC073] transition-colors">
                <label className="block text-[11px] text-gray-500 font-medium px-4 pt-3 mb-1">
                  Maintenance Message
                </label>
                <textarea
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  rows={3}
                  placeholder="The system is under scheduled maintenance. Please try again later."
                  className="w-full px-4 pb-3 text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent outline-none resize-none"
                />
              </div>
            </div>
          </section>

          {/* ── Notification Settings ─────────────────────────────────────── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#E8F7F0] rounded-lg text-[#2A6543]">
                <Bell size={20} />
              </div>
              <h2 className="text-[19px] font-bold text-gray-900">Notification Settings</h2>
            </div>

            <div className="space-y-4">
              <ToggleRow
                title="Email Notifications"
                description="Send system alerts and reports via email"
                isChecked={notifications.email}
                onChange={(v) => setNotifications({ ...notifications, email: v })}
              />
              <ToggleRow
                title="SMS Notifications"
                description="Send critical alerts via SMS"
                isChecked={notifications.sms}
                onChange={(v) => setNotifications({ ...notifications, sms: v })}
              />
              <ToggleRow
                title="Debug Mode"
                description="Enable verbose logging for troubleshooting"
                isChecked={notifications.debug}
                onChange={(v) => setNotifications({ ...notifications, debug: v })}
              />
            </div>
          </section>

          {/* ── Action Buttons ────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 pb-8">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#2A6543] text-white rounded-xl font-semibold flex items-center justify-center gap-2.5 shadow-sm hover:bg-[#235337] transition-colors"
            >
              <Save size={18} />
              Save settings
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#E2E8F0] text-gray-700 rounded-xl font-semibold hover:bg-[#CBD5E1] transition-colors"
            >
              Reset to defaults
            </button>
          </div>

        </div>
      </div>

      <Toast
        type="success"
        title="Settings Saved"
        message="System settings have been updated successfully."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
