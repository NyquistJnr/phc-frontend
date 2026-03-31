"use client";

import React from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function ResetPasswordModal({ isOpen = true, onClose, onContinue }: { isOpen?: boolean; onClose: () => void; onContinue?: () => void }) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-xl font-bold text-gray-900">Reset User Password</h2>
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FFF2E5] text-[#FF7A00] hover:bg-[#FFE5CC] transition-colors"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 pt-2 space-y-6">
          <p className="text-sm text-gray-500">
            You are about to reset the password for:
          </p>

          {/* User Details */}
          <div className="space-y-2.5 text-sm text-gray-600">
            <div className="flex gap-1">
              <span className="w-16">Name:</span>
              <span className="font-medium text-gray-800">Dr. Abubakar Musa</span>
            </div>
            <div className="flex gap-1">
              <span className="w-16">Staff ID:</span>
              <span className="font-medium text-gray-800">PHC-SUR-000045</span>
            </div>
            <div className="flex gap-1">
              <span className="w-16">Facility:</span>
              <span className="font-medium text-gray-800">PHC Surulere</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 py-3.5 px-4 bg-[#E5E7EB] hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onContinue}
              className="flex-1 py-3.5 px-4 bg-[#046C3F] hover:bg-[#035a34] text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              Continue
            </button>
          </div>

          {/* Warning Note */}
          <div className="flex items-start gap-3 mt-4">
            <AlertCircle className="text-gray-800 mt-0.5 shrink-0" size={18} />
            <p className="text-xs leading-tight text-gray-800 font-medium">
              A temporary password will be generated and sent to the user&apos;s email.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}