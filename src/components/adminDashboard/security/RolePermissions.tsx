"use client";
import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import Header from "@/src/components/adminDashboard/generics/header";

interface PermissionToggleProps {
  enabled: boolean;
  onChange: () => void;
}

const PermissionToggle = ({ enabled, onChange }: PermissionToggleProps) => (
  <button 
    onClick={onChange}
    className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
      enabled ? 'bg-[#046C3F]' : 'bg-gray-200'
    }`}
  >
    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform flex items-center justify-center ${
      enabled ? 'translate-x-6' : 'translate-x-0'
    }`}>
      {enabled ? (
        <CheckCircle2 size={12} className="text-[#046C3F]" />
      ) : (
        <XCircle size={12} className="text-gray-400" />
      )}
    </div>
  </button>
);

export default function RolePermissionsPage() {
  const [activeRole, setActiveRole] = useState('IT Administrator');
  
  const roles = [
    'IT Administrator', 'Officer in charge', 'Doctor', 
    'Nurse', 'Lab Technician', 'Pharmacist', 'CHEW'
  ];

  const modules = [
    'User Management', 'Patient Registration', 'Consultation', 
    'Lab Requests', 'Lab Results', 'Prescriptions', 
    'Dispensing', 'Vitals Recording'
  ];

  const breadcrumbs = [
    { label: 'Security' },
    { label: 'Role Permissions', active: true }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Security" breadcrumbs={breadcrumbs} />

      <div className="flex-1 p-4 sm:p-8 space-y-6 sm:space-y-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Role Permissions</h2>
              <p className="text-gray-500 font-medium">
                Configure what each role can do using CRUDS permissions (Create, Read, Update, Delete, Suspend).
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all border ${
                    activeRole === role 
                      ? 'bg-[#046C3F] text-white border-[#046C3F] shadow-md' 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Permission Matrix Card */}
            <div className="bg-white rounded-2xl sm:rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-8 border-b border-gray-50">
                <h3 className="text-center text-sm font-bold text-gray-600 uppercase tracking-widest">
                  Permission Matrix - {activeRole}
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                      <th className="px-12 py-6">Module</th>
                      <th className="px-6 py-6 text-center">Create</th>
                      <th className="px-6 py-6 text-center">Read</th>
                      <th className="px-6 py-6 text-center">Update</th>
                      <th className="px-6 py-6 text-center">Delete</th>
                      <th className="px-6 py-6 text-center">Suspend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {modules.map((moduleName) => (
                      <tr key={moduleName} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-12 py-6 text-sm font-semibold text-gray-600">{moduleName}</td>
                        <td className="px-6 py-6">
                          <div className="flex justify-center">
                            <PermissionToggle enabled={moduleName === 'User Management'} onChange={() => {}} />
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex justify-center">
                            <PermissionToggle 
                              enabled={moduleName === 'User Management' || moduleName === 'Patient Registration'} 
                              onChange={() => {}} 
                            />
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex justify-center">
                            <PermissionToggle enabled={moduleName === 'User Management'} onChange={() => {}} />
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex justify-center">
                            <PermissionToggle enabled={false} onChange={() => {}} />
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex justify-center">
                            <PermissionToggle enabled={moduleName === 'User Management'} onChange={() => {}} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Footer */}
              <div className="p-4 sm:p-10 bg-gray-50/30 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-50">
                <button className="px-8 sm:px-10 py-3.5 bg-[#046C3F] text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#046C3F]/20 hover:bg-[#035a34] transition-all">
                  <Save size={20} />
                  Save Permissions
                </button>
                <button className="px-8 sm:px-10 py-3.5 bg-white text-gray-500 border border-gray-200 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
    </div>
  );
}