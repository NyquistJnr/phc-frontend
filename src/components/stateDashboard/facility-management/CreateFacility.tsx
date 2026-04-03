"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Calendar } from "lucide-react";
import Header from "@/src/components/adminDashboard/generics/header";
import Toast from "@/src/components/adminDashboard/generics/Toast";
import FormSelectDropdown from "@/src/components/stateDashboard/generics/FormSelectDropdown";

const inputStyles =
  "block w-full border border-gray-200 rounded-xl px-5 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#1AC073] focus:outline-none focus:ring-1 focus:ring-[#1AC073] transition-colors";

const labelStyles =
  "absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-600 font-medium z-10";

const FACILITY_LEVELS = ["Health Post", "PHC Clinic", "PHC Centre"];

const LGA_OPTIONS = [
  "Ikeja",
  "Surulere",
  "Eti-Osa",
  "Alimosho",
  "Kosofe",
  "Mushin",
  "Agege",
  "Lagos Mainland",
  "Lagos Island",
];

const WARD_OPTIONS = [
  "Anifowoshe / Opebi",
  "Ojodu",
  "Agidingbi",
  "Alausa",
  "Oregun",
  "Maryland",
];

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-lg bg-[#E8F7F0] flex items-center justify-center shrink-0">
        <Building2 size={18} className="text-[#046C3F]" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

export default function CreateFacility() {
  const router = useRouter();

  // Facility Information
  const [facilityName, setFacilityName] = useState("");
  const [facilityLevel, setFacilityLevel] = useState("");
  const [lga, setLga] = useState("");
  const [ward, setWard] = useState("");

  // Facility Contact Information
  const [facilityAddress, setFacilityAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [isActive, setIsActive] = useState(false);

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

    if (!facilityName || !facilityLevel || !lga || !ward) {
      showToast("Validation Error", "Please fill in all required fields.", "error");
      return;
    }

    // API call will be wired here by backend integration
    showToast(
      "Facility Created successfully",
      `${facilityName} has been added`,
      "success",
    );
    setTimeout(() => {
      router.push("/state-dashboard/facility-management/view-facility");
    }, 1800);
  };

  const breadcrumbs = [
    { label: "Facility Management", href: "/state-dashboard/facility-management/view-facility" },
    { label: "Create Facility", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />

      <div className="flex-1 p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            New Facility Registration
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Provide facility details for registration
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-8"
        >
          {/* ── Facility Information ─────────────────────────────── */}
          <section>
            <SectionHeader title="Facility Information" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
              {/* Facility Name */}
              <div className="relative">
                <label className={labelStyles}>Facility Name</label>
                <input
                  type="text"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  placeholder="e.g Ikeja PHC"
                  className={inputStyles}
                  required
                />
              </div>

              {/* Facility ID — auto-generated */}
              <div className="relative">
                <label className={labelStyles}>Facility ID</label>
                <input
                  type="text"
                  value=""
                  readOnly
                  placeholder="Auto-generated upon creation"
                  className={`${inputStyles} bg-gray-50 text-gray-400 cursor-not-allowed`}
                />
              </div>

              {/* Facility Level */}
              <FormSelectDropdown
                label="Facility Level"
                placeholder="select level"
                options={FACILITY_LEVELS}
                selected={facilityLevel}
                onSelect={setFacilityLevel}
              />

              {/* State — auto-filled */}
              <div className="relative">
                <label className={labelStyles}>State</label>
                <input
                  type="text"
                  value=""
                  readOnly
                  placeholder="Auto-filled (based on deployment)"
                  className={`${inputStyles} bg-gray-50 text-gray-400 cursor-not-allowed`}
                />
              </div>

              {/* LGA */}
              <FormSelectDropdown
                label="LGA"
                placeholder="select LGA"
                options={LGA_OPTIONS}
                selected={lga}
                onSelect={setLga}
              />

              {/* Ward */}
              <FormSelectDropdown
                label="Ward"
                placeholder="select ward"
                options={WARD_OPTIONS}
                selected={ward}
                onSelect={setWard}
              />
            </div>
          </section>

          {/* ── Facility Contact Information ─────────────────────── */}
          <section className="pt-6 border-t border-gray-100">
            <SectionHeader title="Facility Contact Information" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
              {/* Facility Address */}
              <div className="relative">
                <label className={labelStyles}>Facility Address</label>
                <input
                  type="text"
                  value={facilityAddress}
                  onChange={(e) => setFacilityAddress(e.target.value)}
                  placeholder="Enter full address"
                  className={inputStyles}
                />
              </div>

              {/* Code + Phone Number — right col, row 1, side by side */}
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
                    placeholder="80 0000 0000"
                    className={inputStyles}
                  />
                </div>
              </div>

              {/* Date Created — left col, row 2 */}
              <div className="relative">
                <label className={labelStyles}>Date Created</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={dateCreated}
                    onChange={(e) => setDateCreated(e.target.value)}
                    className={`${inputStyles} pl-10`}
                  />
                </div>
              </div>

              {/* Status toggle — right col, row 2 */}
              <div className="flex flex-col gap-2 justify-center">
                <span className="text-xs text-gray-600 font-medium">Status</span>
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
                    />
                  </button>
                  <span className="text-sm text-gray-400 font-medium">
                    Active / Inactive
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Actions ───────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#046C3F] text-white rounded-xl font-semibold flex items-center gap-2.5 shadow-md hover:bg-[#035a34] transition-colors"
            >
              <span className="w-5 h-5 border-2 border-dashed border-white rounded-full flex items-center justify-center text-xs font-bold">
                +
              </span>
              Create Facility
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
