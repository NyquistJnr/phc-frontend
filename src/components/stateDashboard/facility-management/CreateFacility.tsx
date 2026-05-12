"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Users } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import Toast from "@/src/components/adminDashboard/generics/Toast";
import FormSelectDropdown from "@/src/components/stateDashboard/generics/FormSelectDropdown";
import {
  useCreateFacility,
  useLgas,
  useWards,
} from "@/src/hooks/general/use-facilities";

const inputStyles =
  "block w-full border border-gray-200 rounded-xl px-5 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#1AC073] focus:outline-none focus:ring-1 focus:ring-[#1AC073] transition-colors";

const labelStyles =
  "absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-600 font-medium z-10";

const FACILITY_LEVELS = Array.from({ length: 12 }, (_, i) => `Level ${i + 1}`);
const FACILITY_TYPES = ["Public", "Private", "NGO"];

function SectionHeader({
  title,
  icon: Icon = Building2,
}: {
  title: string;
  icon?: any;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-lg bg-[#E8F7F0] flex items-center justify-center shrink-0">
        <Icon size={18} className="text-[#046C3F]" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

export default function CreateFacility() {
  const router = useRouter();

  const deploymentState =
    process.env.NEXT_PUBLIC_STATE_OF_DEPLOYMENT || "Plateau";

  const { data: lgas = [], isLoading: isLoadingLgas } =
    useLgas(deploymentState);
  const createFacilityMutation = useCreateFacility();

  const [facilityName, setFacilityName] = useState("");
  const [facilityLevel, setFacilityLevel] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [lga, setLga] = useState("");
  const [ward, setWard] = useState("");
  const [facilityAddress, setFacilityAddress] = useState("");

  const { data: wards = [], isLoading: isLoadingWards } = useWards(
    deploymentState,
    lga,
  );

  const [managerFirstName, setManagerFirstName] = useState("");
  const [managerLastName, setManagerLastName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [itAdminFirstName, setItAdminFirstName] = useState("");
  const [itAdminLastName, setItAdminLastName] = useState("");
  const [itAdminEmail, setItAdminEmail] = useState("");
  const [itAdminPhone, setItAdminPhone] = useState("");

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error",
  ) => {
    setToastMsg({ title, message, type });
    setToastVisible(true);
  };

  const handleLgaSelect = (selectedLga: string) => {
    setLga(selectedLga);
    setWard("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!facilityName || !facilityLevel || !facilityType || !lga || !ward) {
      showToast(
        "Validation Error",
        "Please fill in all required facility fields.",
        "error",
      );
      return;
    }

    try {
      await createFacilityMutation.mutateAsync({
        name: facilityName,
        facility_type: facilityType,
        lga: lga,
        ward: ward,
        address: facilityAddress,
        level: facilityLevel,
        manager_first_name: managerFirstName,
        manager_last_name: managerLastName,
        manager_email: managerEmail,
        manager_phone: managerPhone,
        it_admin_first_name: itAdminFirstName,
        it_admin_last_name: itAdminLastName,
        it_admin_email: itAdminEmail,
        it_admin_phone: itAdminPhone,
      });

      showToast(
        "Facility Created",
        `${facilityName} has been successfully added`,
        "success",
      );
      setTimeout(() => {
        router.push("/state-dashboard/facility-management/view-facility");
      }, 1800);
    } catch (error: any) {
      showToast(
        "Submission Error",
        error?.message || "Failed to create facility",
        "error",
      );
    }
  };

  const breadcrumbs = [
    {
      label: "Facility Management",
      href: "/state-dashboard/facility-management/view-facility",
    },
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
          <section>
            <SectionHeader title="Facility Information" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
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
              <FormSelectDropdown
                label="Facility Type"
                placeholder="Select type"
                options={FACILITY_TYPES}
                selected={facilityType}
                onSelect={setFacilityType}
              />
              <FormSelectDropdown
                label="Facility Level"
                placeholder="Select level"
                options={FACILITY_LEVELS}
                selected={facilityLevel}
                onSelect={setFacilityLevel}
              />
              <div className="relative">
                <label className={labelStyles}>State</label>
                <input
                  type="text"
                  value={deploymentState}
                  readOnly
                  className={`${inputStyles} bg-gray-50 text-gray-700 cursor-not-allowed`}
                />
              </div>
              <FormSelectDropdown
                label={isLoadingLgas ? "Loading LGAs..." : "LGA"}
                placeholder="Select LGA"
                options={lgas}
                selected={lga}
                onSelect={handleLgaSelect}
              />
              <FormSelectDropdown
                label={isLoadingWards ? "Loading Wards..." : "Ward"}
                placeholder={lga ? "Select Ward" : "Select an LGA first"}
                options={wards}
                selected={ward}
                onSelect={setWard}
              />
              <div className="relative md:col-span-2">
                <label className={labelStyles}>Facility Address</label>
                <input
                  type="text"
                  value={facilityAddress}
                  onChange={(e) => setFacilityAddress(e.target.value)}
                  placeholder="Enter full address"
                  className={inputStyles}
                  required
                />
              </div>
            </div>
          </section>
          <section className="pt-6 border-t border-gray-100">
            <SectionHeader title="Facility Personnel" icon={Users} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
              <div className="relative">
                <label className={labelStyles}>Manager First Name</label>
                <input
                  type="text"
                  value={managerFirstName}
                  onChange={(e) => setManagerFirstName(e.target.value)}
                  placeholder="First Name"
                  className={inputStyles}
                  required
                />
              </div>
              <div className="relative">
                <label className={labelStyles}>Manager Last Name</label>
                <input
                  type="text"
                  value={managerLastName}
                  onChange={(e) => setManagerLastName(e.target.value)}
                  placeholder="Last Name"
                  className={inputStyles}
                  required
                />
              </div>
              <div className="relative">
                <label className={labelStyles}>Manager Email</label>
                <input
                  type="email"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  placeholder="manager@example.com"
                  className={inputStyles}
                  required
                />
              </div>
              <div className="relative">
                <label className={labelStyles}>Manager Phone</label>
                <input
                  type="tel"
                  value={managerPhone}
                  onChange={(e) =>
                    setManagerPhone(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="08000000000"
                  className={inputStyles}
                  required
                />
              </div>
              <div className="md:col-span-2 border-b border-gray-50 my-2"></div>
              <div className="relative">
                <label className={labelStyles}>IT Admin First Name</label>
                <input
                  type="text"
                  value={itAdminFirstName}
                  onChange={(e) => setItAdminFirstName(e.target.value)}
                  placeholder="First Name"
                  className={inputStyles}
                  required
                />
              </div>
              <div className="relative">
                <label className={labelStyles}>IT Admin Last Name</label>
                <input
                  type="text"
                  value={itAdminLastName}
                  onChange={(e) => setItAdminLastName(e.target.value)}
                  placeholder="Last Name"
                  className={inputStyles}
                  required
                />
              </div>
              <div className="relative">
                <label className={labelStyles}>IT Admin Email</label>
                <input
                  type="email"
                  value={itAdminEmail}
                  onChange={(e) => setItAdminEmail(e.target.value)}
                  placeholder="itadmin@example.com"
                  className={inputStyles}
                  required
                />
              </div>
              <div className="relative">
                <label className={labelStyles}>IT Admin Phone</label>
                <input
                  type="tel"
                  value={itAdminPhone}
                  onChange={(e) =>
                    setItAdminPhone(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="08000000000"
                  className={inputStyles}
                  required
                />
              </div>
            </div>
          </section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={createFacilityMutation.isPending}
              className={`px-8 py-3.5 bg-[#046C3F] text-white rounded-xl font-semibold flex items-center gap-2.5 shadow-md hover:bg-[#035a34] transition-colors ${
                createFacilityMutation.isPending
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {!createFacilityMutation.isPending && (
                <span className="w-5 h-5 border-2 border-dashed border-white rounded-full flex items-center justify-center text-xs font-bold">
                  +
                </span>
              )}
              {createFacilityMutation.isPending
                ? "Creating..."
                : "Create Facility"}
            </button>
            <button
              type="button"
              disabled={createFacilityMutation.isPending}
              onClick={() =>
                router.push(
                  "/state-dashboard/facility-management/view-facility",
                )
              }
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
