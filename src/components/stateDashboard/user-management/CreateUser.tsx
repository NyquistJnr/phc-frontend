"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, UserCog, Loader2, Calendar } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import Toast from "@/src/components/adminDashboard/generics/Toast";
import { useStateAdminInviteUser } from "@/src/hooks/useUsers";
import { useFacilities } from "@/src/hooks/useFacilities";

const rolesList = [
  { name: "Facility IT Admin", value: "FACILITY_IT_ADMIN" },
  { name: "Doctor", value: "DOCTOR" },
  { name: "Nurse", value: "NURSE" },
  { name: "CHEW", value: "CHEW" },
  { name: "Pharmacist", value: "PHARMACIST" },
  { name: "Lab Technician", value: "LAB_TECHNICIAN" },
];

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const generateUsername = (firstName: string, lastName: string) =>
  `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/\s+/g, "");

const todayStr = () => {
  const d = new Date();
  return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
};

export default function CreateUserPage() {
  const router = useRouter();
  const inviteUserMutation = useStateAdminInviteUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [selectedRole, setSelectedRole] = useState<(typeof rolesList)[0] | null>(null);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  const [selectedFacilityName, setSelectedFacilityName] = useState("");
  const [isFacilityOpen, setIsFacilityOpen] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error" | "warning" | "info",
  });

  const { data: facilitiesData } = useFacilities({ pageSize: 100 });
  const facilities = facilitiesData?.results || [];

  useEffect(() => {
    if (firstName && lastName) {
      setUsername(generateUsername(firstName, lastName));
    }
  }, [firstName, lastName]);

  const showToast = (title: string, message: string, type: "success" | "error" = "success") => {
    setToastMsg({ title, message, type });
    setToastVisible(true);
  };

  const handleAutoGeneratePassword = () => {
    setTempPassword(generatePassword());
  };

  const handleAutoGenerateUsername = () => {
    if (firstName && lastName) {
      setUsername(generateUsername(firstName, lastName));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName || !lastName || !phoneNumber || !selectedRole) {
      showToast("Validation Error", "Please fill in all required fields.", "error");
      return;
    }

    const formattedPhone = `+234${phoneNumber.replace(/^0+/, "")}`;

    inviteUserMutation.mutate(
      {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        middle_name: "",
        email: email.trim(),
        phone_number: formattedPhone,
        role: selectedRole.value,
        is_active: isActive,
        facility_id: selectedFacilityId,
      },
      {
        onSuccess: () => {
          showToast("Success", "IT Admin account has been created successfully.", "success");
          setTimeout(() => router.push("/state-dashboard/user-management"), 1500);
        },
        onError: (error: unknown) => {
          const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
          showToast("Error Creating Account", msg, "error");
        },
      },
    );
  };

  const inputBase =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1AC073] focus:ring-1 focus:ring-[#1AC073] bg-white";
  const floatingLabel = "absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 font-medium";

  const breadcrumbs = [
    { label: "User Management" },
    { label: "Create Account", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="User Management" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create IT Admin</h2>
          <p className="text-gray-500 text-sm mt-1">Create a new IT Administrator account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          {/* Section header */}
          <div className="flex items-center gap-3 pb-2">
            <div className="w-10 h-10 rounded-full bg-[#E8F7F0] flex items-center justify-center shrink-0">
              <UserCog size={20} className="text-[#046C3F]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">IT Admin Information</h3>
          </div>

          {/* Row 1: First Name + Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative">
              <label className={floatingLabel}>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className={inputBase}
                required
              />
            </div>
            <div className="relative">
              <label className={floatingLabel}>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className={inputBase}
                required
              />
            </div>
          </div>

          {/* Row 2: Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative">
              <label className={floatingLabel}>
                Email Address <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className={inputBase}
              />
            </div>
            <div className="flex gap-3">
              {/* Country code */}
              <div className="relative w-28 shrink-0">
                <label className={floatingLabel}>Code</label>
                <div className={`${inputBase} flex items-center gap-2 cursor-not-allowed bg-gray-50`}>
                  <div className="w-5 h-4 flex overflow-hidden rounded-sm shrink-0">
                    <div className="w-1/3 bg-[#006C35]" />
                    <div className="w-1/3 bg-white" />
                    <div className="w-1/3 bg-[#006C35]" />
                  </div>
                  <span className="text-sm text-gray-600">+234</span>
                  <ChevronDown size={14} className="text-gray-400 ml-auto" />
                </div>
              </div>
              <div className="relative flex-1">
                <label className={floatingLabel}>Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter phone number"
                  className={inputBase}
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 3: Assign Facility + Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Assign Facility */}
            <div className="relative">
              <label className={floatingLabel}>Assign Facility</label>
              <div
                className={`${inputBase} flex items-center cursor-pointer`}
                onClick={() => setIsFacilityOpen(!isFacilityOpen)}
              >
                <span className={selectedFacilityName ? "text-gray-900" : "text-gray-400"}>
                  {selectedFacilityName || "Select facility"}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 ml-auto transition-transform duration-200 ${isFacilityOpen ? "rotate-180" : ""}`}
                />
              </div>
              {isFacilityOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFacilityOpen(false)} />
                  <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-20 p-3 space-y-1 max-h-52 overflow-y-auto">
                    {facilities.length === 0 ? (
                      <p className="text-sm text-gray-400 px-2 py-2">No facilities found</p>
                    ) : (
                      facilities.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-2 rounded-lg transition-colors"
                          onClick={() => {
                            setSelectedFacilityId(f.id);
                            setSelectedFacilityName(f.name);
                            setIsFacilityOpen(false);
                          }}
                        >
                          <input
                            type="radio"
                            readOnly
                            checked={selectedFacilityId === f.id}
                            className="w-4 h-4 text-[#1AC073] cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-700">{f.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Role */}
            <div className="relative">
              <label className={floatingLabel}>Role</label>
              <div
                className={`${inputBase} flex items-center cursor-pointer`}
                onClick={() => setIsRoleOpen(!isRoleOpen)}
              >
                <span className={selectedRole ? "text-gray-900" : "text-gray-400"}>
                  {selectedRole ? selectedRole.name : "Select Role"}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 ml-auto transition-transform duration-200 ${isRoleOpen ? "rotate-180" : ""}`}
                />
              </div>
              {isRoleOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsRoleOpen(false)} />
                  <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-20 p-3 space-y-1">
                    {rolesList.map((role) => (
                      <div
                        key={role.value}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-2 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedRole(role);
                          setIsRoleOpen(false);
                        }}
                      >
                        <input
                          type="radio"
                          readOnly
                          checked={selectedRole?.value === role.value}
                          className="w-4 h-4 text-[#1AC073] cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-700">{role.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Row 4: Username + Temporary Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAutoGenerateUsername}
                  className="text-xs font-semibold text-[#046C3F] hover:text-[#035a34] transition-colors"
                >
                  Auto-generate
                </button>
              </div>
              <div className="relative">
                <label className={floatingLabel}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or autogenerate"
                  className={inputBase}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAutoGeneratePassword}
                  className="text-xs font-semibold text-[#046C3F] hover:text-[#035a34] transition-colors"
                >
                  Auto-generate
                </button>
              </div>
              <div className="relative">
                <label className={floatingLabel}>Temporary Password</label>
                <input
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="Minimum 8 character"
                  className={inputBase}
                />
              </div>
            </div>
          </div>

          {/* Row 5: Date Created + Account Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative">
              <label className={floatingLabel}>Date Created</label>
              <div className={`${inputBase} flex items-center gap-2 bg-gray-50 cursor-not-allowed`}>
                <Calendar size={16} className="text-gray-400 shrink-0" />
                <span className="text-gray-500 text-sm">{todayStr()}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className="relative shrink-0 rounded-full transition-colors duration-200 focus:outline-none"
                style={{
                  width: 44,
                  height: 24,
                  backgroundColor: isActive ? "#046C3F" : "#D1D5DB",
                }}
              >
                <span
                  className="absolute rounded-full bg-white transition-all duration-200"
                  style={{
                    width: 20,
                    height: 20,
                    top: 2,
                    left: isActive ? 22 : 2,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                  }}
                />
              </button>
              <div>
                <p className="text-sm font-semibold text-gray-800">Account Status</p>
                <p className="text-xs text-gray-500">Active / Suspended</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={inviteUserMutation.isPending}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#046C3F] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-md hover:bg-[#035a34] transition-colors text-sm"
            >
              {inviteUserMutation.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <UserCog size={18} />
              )}
              {inviteUserMutation.isPending ? "Creating..." : "Create IT Admin"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/state-dashboard/user-management")}
              className="px-8 py-3.5 bg-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm"
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
