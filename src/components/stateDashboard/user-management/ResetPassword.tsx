"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Key, RefreshCw, Check, AlertCircle, Lock } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import Toast from "@/src/components/adminDashboard/generics/Toast";

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

export default function ResetPasswordView() {
  const router = useRouter();

  const [password, setPassword] = useState(generatePassword());
  const [forceReset, setForceReset] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      router.push("/state-dashboard/user-management");
    }, 2500);
  };

  const breadcrumbs = [
    { label: "User Management" },
    { label: "Manage Users", href: "/state-dashboard/user-management" },
    { label: "Reset Password", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="User Management" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors mb-6 shadow-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Set New Password</h2>
          <p className="text-gray-500 text-sm mt-1">Generate a temporary password</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#E8F7F0] p-2.5 rounded-full">
              <Key size={20} className="text-[#046C3F] rotate-45" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Password Reset</h3>
          </div>

          <div className="max-w-2xl space-y-6">
            {/* Auto-generate + input */}
            <div>
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => setPassword(generatePassword())}
                  className="flex items-center gap-1.5 text-[#046C3F] text-xs font-semibold hover:text-[#035a34] transition-colors"
                >
                  <RefreshCw size={12} />
                  Auto-generate
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F] transition-all">
                  <label className="block text-xs font-medium text-gray-500 mb-0.5">
                    Temporary Password
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-900 font-medium text-sm placeholder:text-gray-400"
                    placeholder="Enter password"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-8 py-3 border border-[#046C3F] text-[#046C3F] rounded-xl font-semibold hover:bg-[#E8F7F0] transition-colors text-sm whitespace-nowrap"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Force reset checkbox */}
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border transition-colors duration-200 ${
                  forceReset
                    ? "bg-[#046C3F] border-[#046C3F] text-white"
                    : "bg-white border-gray-300 group-hover:border-[#046C3F]"
                }`}
                onClick={() => setForceReset(!forceReset)}
              >
                <Check size={13} strokeWidth={3} />
              </div>
              <span className="text-sm font-medium text-gray-800">
                Force password reset at next login
              </span>
            </label>

            {/* Info alert */}
            <div className="flex items-center gap-3 bg-[#F2FCF6] border-l-4 border-[#046C3F] p-4 rounded-r-xl rounded-l-sm">
              <AlertCircle className="text-[#046C3F] shrink-0" size={20} />
              <p className="text-sm font-medium text-gray-800">
                The user will be required to reset their password at next login.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-[#046C3F] hover:bg-[#035a34] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-sm text-sm"
              >
                <Lock size={18} />
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-8 py-3.5 rounded-xl font-semibold transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast
        type="success"
        title="Password reset successfully"
        message="A temporary password has been sent. They will be prompted to change it on next login."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
