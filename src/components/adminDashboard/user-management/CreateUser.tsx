"use client";

import { useState } from 'react';
import { ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '@/src/components/adminDashboard/generics/header';

const inputStyles = "block w-full border border-gray-200 rounded-xl px-5 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#1AC073] focus:ring-[#1AC073]";
const labelStyles = "absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-600 font-medium";

// Roles dropdown data
const rolesList = [
  { name: 'IT Administration', checked: true },
  { name: 'Officer in Charge (OIC)' },
  { name: 'Doctor' },
  { name: 'Nurse' },
  { name: 'Lab Technician' },
  { name: 'Pharmacist' },
  { name: 'CHEW' },
];

export default function CreateUserPage() {
  // Added state to manage dropdown visibility
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const breadcrumbs = [
    { label: 'User Management' },
    { label: 'Create User', active: true }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="User Management" breadcrumbs={breadcrumbs} />

      <div className="flex-1 p-4 sm:p-8">

        {/* Title Section */}
        <div className="mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create New User Account</h2>
          <p className="text-base text-gray-600 max-w-3xl">
            Fill in the details below to create a new user account in the PHC EHR system.
          </p>
        </div>

        {/* Form Container */}
        <form className="bg-white p-4 sm:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-10 sm:space-y-12">
          
          {/* Personal Information Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className='text-[#1AC073]' size={24}/>
              <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
              <div className="relative md:col-span-1">
                <label className={labelStyles}>Full Name</label>
                <input type="text" placeholder="e.g Dr Gilbert Nwosu" className={inputStyles} />
              </div>
              
              <div className="relative md:col-span-1">
                <label className={labelStyles}>Email Address</label>
                <input type="email" placeholder="User@phc.gov.ng" className={inputStyles} />
              </div>

              <div className="grid grid-cols-[110px_1fr] gap-x-4 md:col-span-1">
                <div className="relative">
                  <label className={labelStyles}>Code</label>
                  <div className={`${inputStyles} flex items-center gap-2 cursor-pointer`}>
                    <div className="w-5 h-5 bg-[#D2F1DF] rounded-sm flex items-center justify-center overflow-hidden">
                      <div className='w-1/3 h-full bg-[#006C35]'></div>
                      <div className='w-1/3 h-full bg-white'></div>
                      <div className='w-1/3 h-full bg-[#006C35]'></div>
                    </div>
                    <span>+234</span>
                    <ChevronDown size={18} className='text-gray-500 ml-auto'/>
                  </div>
                </div>
                <div className="relative">
                  <label className={labelStyles}>Phone Number</label>
                  <input type="tel" placeholder="80 0000 0000" className={inputStyles} />
                </div>
              </div>

              {/* ROLE DROPDOWN SECTION */}
              <div className="relative md:col-span-1">
                <label className={labelStyles}>Role</label>
                <div 
                  className={`${inputStyles} flex items-center cursor-pointer`}
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                >
                  <span className="text-gray-400">select role</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-gray-600 ml-auto transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                {/* Conditionally rendered Dropdown Panel */}
                {isRoleDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-20 p-6 space-y-4">
                    {rolesList.map((role, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <input 
                          type="checkbox" 
                          defaultChecked={role.checked}
                          className="w-6 h-6 rounded-md border-gray-300 text-[#1AC073] focus:ring-[#1AC073]"
                        />
                        <span className={`text-base font-medium ${role.checked ? 'text-gray-900' : 'text-gray-700'}`}>
                          {role.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative md:col-span-2">
                <label className={labelStyles}>Assigned Facility</label>
                <div className={`${inputStyles} flex items-center cursor-pointer`}>
                  <span className="text-gray-400">Select Facility</span>
                  <ChevronDown size={20} className='text-gray-600 ml-auto'/>
                </div>
              </div>
            </div>
          </section>

          {/* Login Credentials Section */}
          <section className="space-y-6 pt-10 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <span className='text-2xl'>➡</span>
              <h3 className="text-xl font-semibold text-gray-900">Login Credentials</h3>
              <button type="button" className="text-sm font-semibold text-[#1AC073] ml-auto">
                Auto-generate
              </button>
            </div>

            <div className="relative max-w-lg">
              <label className={labelStyles}>Username</label>
              <input type="text" placeholder="Username" className={inputStyles} />
            </div>
          </section>

          {/* Warning Alert */}
          <div className="bg-[#EBF7F2] border border-[#A6E1C4] rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className='text-[#046C3F] mt-0.5' size={22} />
            <p className="text-base font-medium text-[#046C3F]">
              The user will be required to change their password upon first login.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-6">
            <button type="submit" className="px-8 sm:px-10 py-3.5 bg-[#046C3F] text-white rounded-xl font-semibold flex items-center gap-2.5 shadow-md hover:bg-[#035a34] transition">
              <span className='w-5 h-5 border-2 border-dashed border-white rounded-full flex items-center justify-center text-xs'>+</span>
              Create & Invite User
            </button>
            <button type="button" className="px-8 sm:px-10 py-3.5 bg-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}