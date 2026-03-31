"use client";

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function SystemLogDetailsModal({ isOpen = true, onClose }: { isOpen?: boolean; onClose: () => void }) {
  const [isResolved, setIsResolved] = useState(false);

  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4 font-sans">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-8 pb-3 sm:pb-4">
          <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">System Logs details</h2>
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#FFF5EB] text-[#F97316] hover:bg-[#FFE8D6] transition-colors"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-8 pt-2">
          
          {/* Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* Left Column: Alert Information & Affected Service */}
            <div className="space-y-8">
              {/* Alert Information */}
              <div>
                <h3 className="text-[17px] font-semibold text-gray-500 mb-4">Alert Information</h3>
                <ul className="space-y-3.5 text-[15px] text-gray-500 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                    <div>
                      <span>Alert ID - </span>
                      <span className="text-gray-400">ALT-102</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                    <div>
                      <span>Alert Type - </span>
                      <span className="text-gray-400">System Error</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                    <div className="flex items-center gap-2">
                      <span>Severity</span>
                      <span className="px-3 py-0.5 bg-[#FFF5EB] text-[#F97316] rounded-md text-xs font-semibold border border-[#FFE8D6]">
                        warning
                      </span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                    <div className="flex items-center gap-2">
                      <span>Status</span>
                      <span className="px-3 py-0.5 bg-[#FEF2F2] text-[#EF4444] rounded-md text-xs font-semibold">
                        Active
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                    <div className="leading-relaxed">
                      <span>Description - </span>
                      <span className="text-gray-400">
                        Database connection timeout occurred while processing patient records.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Affected Service */}
              <div>
                <h3 className="text-[17px] font-semibold text-gray-500 mb-4">Affected Service</h3>
                <ul className="text-[15px] text-gray-400 font-medium">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                    <span>EHR Database</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Recommended Action & Activity Log */}
            <div className="space-y-8">
              {/* Recommended Action */}
              <div>
                <h3 className="text-[17px] font-semibold text-gray-500 mb-4">Recommended Action</h3>
                <ul className="space-y-3.5 text-[15px] text-gray-400 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                    <span>Restart database service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                    <span>Check server load</span>
                  </li>
                </ul>
              </div>

              {/* Activity Log */}
              <div>
                <h3 className="text-[17px] font-semibold text-gray-500 mb-4">Activity Log</h3>
                <ul className="space-y-3.5 text-[15px] text-gray-400 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                    <span>Alert triggered</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                    <span>Investigation started</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                    <span>Issue resolved</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Footer Checkbox */}
          <div className="mt-10 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <div 
                className={`w-[22px] h-[22px] rounded-md border flex items-center justify-center transition-colors duration-200 ${
                  isResolved 
                    ? 'bg-[#2A6543] border-[#2A6543]' 
                    : 'bg-white border-gray-300 group-hover:border-gray-400'
                }`}
              >
                {isResolved && <Check size={14} className="text-white" strokeWidth={3} />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={isResolved}
                onChange={() => setIsResolved(!isResolved)}
              />
              <span className="text-gray-500 text-[15px] font-medium">
                Mark as Resolved
              </span>
            </label>
          </div>

        </div>
      </div>
    </div>
  );
}