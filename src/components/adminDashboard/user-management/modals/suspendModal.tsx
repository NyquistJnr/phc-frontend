"use client";

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface SuspendAccountModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  userName?: string;
  staffId?: string;
  facility?: string;
}

export default function SuspendAccountModal({
  isOpen = true,
  onClose,
  onConfirm,
  userName = "N/A",
  staffId = "N/A",
  facility = "N/A",
}: SuspendAccountModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-[20px] font-bold text-gray-900">Suspend User Account</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FFF5EB] text-[#F97316] hover:bg-[#FFE8D6] transition-colors"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          <p className="text-[15px] text-gray-500">You are about to suspend the account for:</p>

          <div className="space-y-2 text-[15px] text-gray-700">
            <div className="flex gap-2">
              <span className="text-gray-500 w-15 shrink-0">Name:</span>
              <span className="font-medium text-gray-800">{userName}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-15 shrink-0">Staff ID:</span>
              <span className="font-medium text-gray-800">{staffId}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-15 shrink-0">Facility:</span>
              <span className="font-medium text-gray-800">{facility}</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-all">
            <label className="block text-[11px] font-medium text-gray-500 mb-1">
              Reason for suspension (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-sm text-gray-900 bg-transparent outline-none resize-none placeholder:text-gray-300"
              placeholder="Enter reason..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-[#E5E7EB] hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors text-[15px]"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(reason)}
              className="flex-1 py-3 px-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-xl transition-colors shadow-sm text-[15px]"
            >
              Suspend Account
            </button>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <AlertCircle className="text-gray-700 mt-0.5 shrink-0" size={18} />
            <p className="text-[13px] leading-tight text-gray-700">
              Suspended users will not be able to log in or access the system until the account is reactivated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
