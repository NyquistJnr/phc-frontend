"use client";

import React, { useState } from 'react';
import { ArrowLeft, Key, RefreshCw, Check, AlertCircle, Lock } from 'lucide-react';

export default function ResetPasswordView() {
  const [password, setPassword] = useState("Aeb!#54!tp");
  const [forceReset, setForceReset] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 sm:p-10 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors mb-8 shadow-sm">
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Header Section */}
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Set New Password for Dr. Abubakar Musa
          </h1>
          <p className="text-gray-500 text-lg">
            Generate a temporary password
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[24px] p-8 sm:p-10 shadow-sm border border-gray-100">
          
          {/* Card Title */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-[#EBF7F2] p-2 rounded-full text-[#48996F]">
              <Key size={24} className="rotate-45" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Password Reset</h2>
          </div>

          <div className="max-w-2xl space-y-8">
            
            {/* Input & Auto-generate Section */}
            <div>
              <div className="flex justify-center sm:justify-start sm:ml-[160px] mb-2">
                <button className="flex items-center gap-2 text-[#248253] text-sm font-semibold hover:text-[#1c6641] transition-colors">
                  <RefreshCw size={14} />
                  Auto-generate
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Custom Input Container */}
                <div className="flex-1 relative border border-gray-300 rounded-xl px-4 py-2.5 focus-within:border-[#248253] focus-within:ring-1 focus-within:ring-[#248253] transition-all">
                  <label className="block text-xs font-medium text-gray-500 mb-0.5">
                    Temporary Password
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-900 text-lg font-medium placeholder:text-gray-400"
                    placeholder="Enter password"
                  />
                </div>

                {/* Copy Button */}
                <button className="px-12 py-4 border border-[#248253] text-[#248253] rounded-xl font-semibold hover:bg-[#EBF7F2] transition-colors text-lg">
                  Copy
                </button>
              </div>
            </div>

            {/* Force Reset Checkbox */}
            <label className="flex items-center gap-4 cursor-pointer group w-fit">
              <div 
                className={`w-6 h-6 rounded flex items-center justify-center border transition-colors duration-200 ${
                  forceReset 
                    ? 'bg-[#248253] border-[#248253] text-white' 
                    : 'bg-white border-gray-300 text-transparent group-hover:border-[#248253]'
                }`}
              >
                <Check size={16} strokeWidth={3} />
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={forceReset}
                onChange={() => setForceReset(!forceReset)}
              />
              <span className="text-gray-800 font-medium">
                Force password reset at next login
              </span>
            </label>

            {/* Information Alert */}
            <div className="flex items-center gap-4 bg-[#F2FCF6] border-l-[6px] border-[#248253] p-6 rounded-r-2xl rounded-l-md">
              <AlertCircle className="text-[#248253] shrink-0" size={24} />
              <p className="text-gray-800 font-medium text-[15px]">
                The user will be required to reset their password at next login.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex items-center justify-center gap-2 bg-[#286C44] hover:bg-[#1f5435] text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-sm text-lg">
                <Lock size={20} />
                Reset Password
              </button>
              <button className="bg-[#D1D5DB] hover:bg-[#9CA3AF] text-gray-600 px-10 py-4 rounded-xl font-semibold transition-colors text-lg">
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}