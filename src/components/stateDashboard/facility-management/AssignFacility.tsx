"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Calendar, UserPlus } from "lucide-react";
import Header from "@/src/components/adminDashboard/generics/header";
import Toast from "@/src/components/adminDashboard/generics/Toast";
import FormSelectDropdown from "@/src/components/stateDashboard/generics/FormSelectDropdown";

const inputStyles =
  "block w-full border border-gray-200 rounded-xl px-5 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#1AC073] focus:outline-none focus:ring-1 focus:ring-[#1AC073] transition-colors";

const labelStyles =
  "absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-600 font-medium z-10";

const FACILITY_OPTIONS = [
  "Ikeja PHC",
  "Surulere PHC",
  "Eti-Osa PHC",
  "Alimosho PHC",
  "Kosofe PHC",
  "Mushin PHC",
  "Agege PHC",
  "Lagos Mainland PHC",
  "Lagos Island PHC",
];

const USER_ROLE_OPTIONS = ["Officer in charge (OIC)", "IT Admin"];

function generateUsername(firstName: string, lastName: string): string {
  if (!firstName && !lastName) return "";
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 900) + 100}`;
}

function generatePassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function AssignFacility() {
  const router = useRouter();

  const [facility, setFacility] = useState("");
  const [userRole, setUserRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [dateAssigned, setDateAssigned] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const showToast = (title: string, message: string, type: "success" | "error") => {
    setToastMsg({ title, message, type });
    setToastVisible(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!facility || !userRole || !firstName || !lastName || !phoneNumber) {
      showToast("Validation Error", "Please fill in all required fields.", "error");
      return;
    }

    // API call will be wired here by backend integration
    showToast(
      "Facility Assigned Successfully",
      `${firstName} ${lastName} has been assigned ${userRole} role`,
      "success",
    );
    setTimeout(() => {
      router.push("/state-dashboard/facility-management/view-facility");
    }, 1800);
  };

  const breadcrumbs = [
    { label: "Facility Management" },
    { label: "Assign Facility", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />

      <div className="flex-1 p-4 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Assign Facility</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Assign initial administrative users to a facility.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-8"
        >
          {/* Section header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E8F7F0] flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-[#046C3F]" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Facility Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            {/* Facility */}
            <FormSelectDropdown
              label="Facility"
              placeholder="select Facility"
              options={FACILITY_OPTIONS}
              selected={facility}
              onSelect={setFacility}
            />

            {/* User Role */}
            <FormSelectDropdown
              label="User Role"
              placeholder="select Role"
              options={USER_ROLE_OPTIONS}
              selected={userRole}
              onSelect={setUserRole}
            />

            {/* First Name */}
            <div className="relative">
              <label className={labelStyles}>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className={inputStyles}
                required
              />
            </div>

            {/* Last Name */}
            <div className="relative">
              <label className={labelStyles}>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className={inputStyles}
                required
              />
            </div>

            {/* Email (Optional) */}
            <div className="relative">
              <label className={labelStyles}>Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter full address"
                className={inputStyles}
              />
            </div>

            {/* Code + Phone Number */}
            <div className="grid grid-cols-[110px_1fr] gap-x-4">
              <div className="relative">
                <label className={labelStyles}>Code</label>
                <div className={`${inputStyles} flex items-center gap-2 cursor-not-allowed bg-gray-50`}>
                  <div className="w-5 h-5 rounded-sm flex overflow-hidden shrink-0">
                    <div className="w-1/3 h-full bg-[#006C35]" />
                    <div className="w-1/3 h-full bg-white" />
                    <div className="w-1/3 h-full bg-[#006C35]" />
                  </div>
                  <span className="text-gray-700">+234</span>
                  <svg className="ml-auto shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <label className={labelStyles}>Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter phone number"
                  className={inputStyles}
                  required
                />
              </div>
            </div>

            {/* Auto-generate row for Username */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setUsername(generateUsername(firstName, lastName))}
                className="text-sm font-semibold text-[#046C3F] hover:underline"
              >
                Auto-generate
              </button>
            </div>

            {/* Auto-generate row for Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setTempPassword(generatePassword())}
                className="text-sm font-semibold text-[#046C3F] hover:underline"
              >
                Auto-generate
              </button>
            </div>

            {/* Username */}
            <div className="relative">
              <label className={labelStyles}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                className={inputStyles}
              />
            </div>

            {/* Temporary Password */}
            <div className="relative">
              <label className={labelStyles}>Temporary Password</label>
              <input
                type="text"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className={inputStyles}
              />
            </div>

            {/* Date Assigned */}
            <div className="relative">
              <label className={labelStyles}>Date Assigned</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={dateAssigned}
                  onChange={(e) => setDateAssigned(e.target.value)}
                  className={`${inputStyles} pl-10`}
                />
              </div>
            </div>

            {/* Account Status toggle */}
            <div className="flex flex-col gap-2 justify-center">
              <span className="text-xs text-gray-600 font-medium">Account Status</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 border border-transparent ${
                    isActive ? "bg-[#046C3F]" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transform transition-transform ${
                      isActive ? "translate-x-[22px]" : "translate-x-1"
                    }`}
                  >
                    {isActive && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
                      </svg>
                    )}
                  </div>
                </button>
                <span className="text-sm text-gray-400 font-medium">Active / Suspended</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2.5 px-8 py-3.5 bg-[#046C3F] text-white rounded-xl font-semibold shadow-md hover:bg-[#035a34] transition-colors"
            >
              <UserPlus size={18} />
              Assign Facility
            </button>
            <button
              type="button"
              onClick={() => router.push("/state-dashboard/facility-management/view-facility")}
              className="px-8 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Toast
        type={toastMsg.type}
        title={toastMsg.title}
        message={toastMsg.message}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
