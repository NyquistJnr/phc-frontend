"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Header from "@/src/components/adminDashboard/generics/header";
import { toast } from "react-toastify";
import { useStateAdminInviteUser } from "@/src/hooks/useUsers";
import { useFacilities } from "@/src/hooks/useFacilities";

const inputStyles =
  "block w-full border border-gray-200 rounded-xl px-5 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#1AC073] focus:ring-[#1AC073] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";
const labelStyles =
  "absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-600 font-bold uppercase tracking-wider z-[2]";

const rolesList = [
  { name: "Facility IT Admin", value: "FACILITY_IT_ADMIN" },
  { name: "Doctor", value: "DOCTOR" },
  { name: "Nurse", value: "NURSE" },
];

function CreateUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlFacilityId = searchParams.get("facility_id");

  const inviteUserMutation = useStateAdminInviteUser();

  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useFacilities({ page: 1, pageSize: 100 });
  const facilities = facilitiesData?.results || [];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedRole, setSelectedRole] = useState(rolesList[0]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(
    urlFacilityId || "",
  );

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  useEffect(() => {
    if (urlFacilityId) {
      setSelectedFacilityId(urlFacilityId);
    }
  }, [urlFacilityId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !selectedFacilityId
    ) {
      toast.error("Please fill in all required fields, including Facility.");
      return;
    }

    const formattedPhone = `+234${phoneNumber.replace(/^0+/, "")}`;

    inviteUserMutation.mutate(
      {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        middle_name: middleName.trim(),
        email: email.trim(),
        phone_number: formattedPhone,
        role: selectedRole.value,
        is_active: true,
        facility_id: selectedFacilityId,
      },
      {
        onSuccess: () => {
          toast.success("User has been successfully invited.");
          setTimeout(() => {
            router.push("/dashboard/facility-management/details");
          }, 1500);
        },
        onError: (error: any) => {
          toast.error(
            error.message ||
              "An unexpected error occurred while creating user.",
          );
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-10 sm:space-y-12"
    >
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="text-[#1AC073]" size={24} />
          <h3 className="text-xl font-semibold text-gray-900">
            Personal Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
          <div className="relative md:col-span-1">
            <label className={labelStyles}>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g Gilbert"
              className={inputStyles}
              required
            />
          </div>

          <div className="relative md:col-span-1">
            <label className={labelStyles}>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g Nwosu"
              className={inputStyles}
              required
            />
          </div>

          <div className="relative md:col-span-1">
            <label className={labelStyles}>
              Middle Name{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="e.g Chukwuemeka"
              className={inputStyles}
            />
          </div>

          <div className="relative md:col-span-1">
            <label className={labelStyles}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="User@phc.gov.ng"
              className={inputStyles}
              required
            />
          </div>

          <div className="grid grid-cols-[110px_1fr] gap-x-4 md:col-span-1">
            <div className="relative">
              <label className={labelStyles}>Code</label>
              <div
                className={`${inputStyles} flex items-center gap-2 cursor-not-allowed bg-gray-50`}
              >
                <div className="w-5 h-5 bg-[#D2F1DF] rounded-sm flex items-center justify-center overflow-hidden shrink-0">
                  <div className="w-1/3 h-full bg-[#006C35]"></div>
                  <div className="w-1/3 h-full bg-white"></div>
                  <div className="w-1/3 h-full bg-[#006C35]"></div>
                </div>
                <span>+234</span>
              </div>
            </div>
            <div className="relative">
              <label className={labelStyles}>Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, ""))
                }
                placeholder="80 0000 0000"
                className={inputStyles}
                required
              />
            </div>
          </div>

          <div className="relative md:col-span-1">
            <label className={labelStyles}>Role</label>
            <div
              className={`${inputStyles} flex items-center cursor-pointer`}
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            >
              <span
                className={selectedRole ? "text-gray-900" : "text-gray-400"}
              >
                {selectedRole ? selectedRole.name : "Select role"}
              </span>
              <ChevronDown
                size={20}
                className={`text-gray-600 ml-auto transition-transform duration-200 ${isRoleDropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isRoleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsRoleDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-20 p-4 space-y-2">
                  {rolesList.map((role) => (
                    <div
                      key={role.value}
                      className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      onClick={() => {
                        setSelectedRole(role);
                        setIsRoleDropdownOpen(false);
                      }}
                    >
                      <input
                        type="radio"
                        checked={selectedRole.value === role.value}
                        readOnly
                        className="w-5 h-5 border-gray-300 text-[#1AC073] focus:ring-[#1AC073] cursor-pointer"
                      />
                      <span
                        className={`text-base font-medium ${selectedRole.value === role.value ? "text-gray-900" : "text-gray-700"}`}
                      >
                        {role.name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative md:col-span-2">
            <label className={labelStyles}>Assigned Facility</label>
            <div className="relative">
              <select
                value={selectedFacilityId}
                onChange={(e) => setSelectedFacilityId(e.target.value)}
                required
                disabled={!!urlFacilityId || isLoadingFacilities}
                className={`${inputStyles} appearance-none ${!urlFacilityId ? "cursor-pointer" : ""}`}
              >
                <option value="" disabled>
                  Select Facility
                </option>
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} - {fac.code}
                  </option>
                ))}
              </select>
              {isLoadingFacilities ? (
                <Loader2
                  size={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1AC073] animate-spin pointer-events-none"
                />
              ) : (
                <ChevronDown
                  size={20}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${!!urlFacilityId ? "text-gray-400" : "text-gray-500"}`}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 pt-10 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl text-gray-400">➡</span>
          <h3 className="text-xl font-semibold text-gray-900">
            Login Credentials
          </h3>
        </div>

        <div className="relative max-w-lg">
          <label className={labelStyles}>Username</label>
          <input
            type="text"
            value={email}
            readOnly
            placeholder="Auto-generated from email"
            className={`${inputStyles} bg-gray-50 text-gray-500 cursor-not-allowed`}
          />
        </div>
      </section>

      <div className="bg-[#EBF7F2] border border-[#A6E1C4] rounded-2xl p-6 flex items-start gap-4">
        <AlertCircle className="text-[#046C3F] mt-0.5 shrink-0" size={22} />
        <p className="text-base font-medium text-[#046C3F]">
          The user will be required to change their password upon first login.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-6">
        <button
          type="submit"
          disabled={inviteUserMutation.isPending}
          className="px-8 sm:px-10 py-3.5 bg-[#046C3F] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center gap-2.5 shadow-md hover:bg-[#035a34] transition"
        >
          {inviteUserMutation.isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <span className="w-5 h-5 border-2 border-dashed border-white rounded-full flex items-center justify-center text-xs">
              +
            </span>
          )}
          {inviteUserMutation.isPending
            ? "Creating User..."
            : "Create & Invite User"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 sm:px-10 py-3.5 bg-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function CreateUserFromStateAdmin() {
  const breadcrumbs = [
    { label: "Facility Management" },
    { label: "Create User", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-h-screen">
      <Header title="User Management" breadcrumbs={breadcrumbs} />

      <div className="flex-1 p-4 sm:p-8">
        <div className="mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Create New User Account for a Facility
          </h2>
          <p className="text-base text-gray-600 max-w-3xl">
            Fill in the details below to create a new user account in the PHC
            EHR system.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-32 text-gray-400">
              <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
              <p className="text-sm font-medium">Preparing form...</p>
            </div>
          }
        >
          <CreateUserForm />
        </Suspense>
      </div>
    </div>
  );
}
