"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2, Calendar, Edit2, Save, X } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import Toast from "@/src/components/adminDashboard/generics/Toast";
import FormSelectDropdown from "@/src/components/stateDashboard/generics/FormSelectDropdown";
import { useFacility } from "@/src/hooks/useFacilities";
import {
  useUpdateFacility,
  useLgas,
  useWards,
} from "@/src/hooks/general/use-facilities";

const inputStyles =
  "block w-full border border-gray-200 rounded-xl px-5 py-3.5 text-base text-gray-900 bg-white placeholder:text-gray-400 focus:border-[#1AC073] focus:outline-none focus:ring-1 focus:ring-[#1AC073] transition-colors";

const labelStyles =
  "absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-600 font-medium z-10";

const FACILITY_LEVELS = Array.from({ length: 12 }, (_, i) => `Level ${i + 1}`);
const FACILITY_TYPES = ["Public", "Private", "NGO"];

function ReadonlyField({
  label,
  value,
  placeholder,
}: {
  label: string;
  value?: string | null;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <label className={labelStyles}>{label}</label>
      <div
        className={`${inputStyles} text-gray-700 bg-gray-50 border-gray-100`}
      >
        {value || <span className="text-gray-400">{placeholder ?? "—"}</span>}
      </div>
    </div>
  );
}

function ReadonlyDropdownField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="relative">
      <label className={labelStyles}>{label}</label>
      <div
        className={`${inputStyles} flex items-center bg-gray-50 border-gray-100`}
      >
        <span className="flex-1 text-gray-700">{value || "—"}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-gray-400 shrink-0"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

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

export default function FacilityDetail() {
  const params = useParams();
  const facilityId = params.id as string;

  const router = useRouter();
  const { data: facility, isLoading } = useFacility(facilityId);
  const updateFacilityMutation = useUpdateFacility(facilityId);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    facility_type: "",
    level: "",
    lga: "",
    ward: "",
    address: "",
  });

  const currentState =
    facility?.state || process.env.NEXT_PUBLIC_STATE_OF_DEPLOYMENT || "Plateau";
  const { data: lgas = [], isLoading: isLoadingLgas } = useLgas(currentState);
  const { data: wards = [], isLoading: isLoadingWards } = useWards(
    currentState,
    editForm.lga,
  );

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

  useEffect(() => {
    if (facility && !isEditing) {
      setEditForm({
        name: facility.name || "",
        facility_type: facility.facility_type || "",
        level: facility.level || "",
        lga: facility.lga || "",
        ward: facility.ward || "",
        address: facility.address || "",
      });
    }
  }, [facility, isEditing]);

  const handleLgaSelect = (selectedLga: string) => {
    setEditForm((prev) => ({ ...prev, lga: selectedLga, ward: "" }));
  };

  const handleSave = async () => {
    if (
      !editForm.name ||
      !editForm.facility_type ||
      !editForm.level ||
      !editForm.lga ||
      !editForm.ward
    ) {
      showToast(
        "Validation Error",
        "Please fill in all required fields.",
        "error",
      );
      return;
    }

    try {
      await updateFacilityMutation.mutateAsync(editForm);
      showToast("Success", "Facility details updated successfully", "success");
      setIsEditing(false);
    } catch (error: any) {
      showToast(
        "Update Error",
        error?.message || "Failed to update facility",
        "error",
      );
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (facility) {
      setEditForm({
        name: facility.name || "",
        facility_type: facility.facility_type || "",
        level: facility.level || "",
        lga: facility.lga || "",
        ward: facility.ward || "",
        address: facility.address || "",
      });
    }
  };

  const breadcrumbs = [
    { label: "Facility Management" },
    {
      label: "View Facility",
      href: "/state-dashboard/facility-management/view-facility",
    },
    { label: "View", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />
      <div className="flex-1 p-4 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              router.push("/state-dashboard/facility-management/view-facility")
            }
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors w-fit"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {!isLoading && facility && (
            <div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#046C3F] text-white rounded-lg text-sm font-medium hover:bg-[#035a34] transition-colors shadow-sm"
                >
                  <Edit2 size={16} />
                  Edit Facility
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={cancelEdit}
                    disabled={updateFacilityMutation.isPending}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateFacilityMutation.isPending}
                    className={`flex items-center gap-2 px-5 py-2.5 bg-[#046C3F] text-white rounded-lg text-sm font-medium hover:bg-[#035a34] transition-colors shadow-sm ${
                      updateFacilityMutation.isPending
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Save size={16} />
                    {updateFacilityMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex items-center justify-center text-sm text-gray-400">
            Loading facility details...
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8 space-y-8">
            <section>
              <SectionHeader title="Facility Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                <ReadonlyField label="Facility ID" value={facility?.code} />
                <ReadonlyDropdownField label="State" value={facility?.state} />
                {isEditing ? (
                  <>
                    <div className="relative">
                      <label className={labelStyles}>Facility Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className={inputStyles}
                      />
                    </div>

                    <FormSelectDropdown
                      label="Facility Type"
                      placeholder="Select type"
                      options={FACILITY_TYPES}
                      selected={editForm.facility_type}
                      onSelect={(val) =>
                        setEditForm({ ...editForm, facility_type: val })
                      }
                    />

                    <FormSelectDropdown
                      label="Facility Level"
                      placeholder="Select level"
                      options={FACILITY_LEVELS}
                      selected={editForm.level}
                      onSelect={(val) =>
                        setEditForm({ ...editForm, level: val })
                      }
                    />

                    <FormSelectDropdown
                      label={isLoadingLgas ? "Loading LGAs..." : "LGA"}
                      placeholder="Select LGA"
                      options={lgas}
                      selected={editForm.lga}
                      onSelect={handleLgaSelect}
                    />

                    <FormSelectDropdown
                      label={isLoadingWards ? "Loading Wards..." : "Ward"}
                      placeholder={
                        editForm.lga ? "Select Ward" : "Select an LGA first"
                      }
                      options={wards}
                      selected={editForm.ward}
                      onSelect={(val) =>
                        setEditForm({ ...editForm, ward: val })
                      }
                    />
                  </>
                ) : (
                  <>
                    <ReadonlyField
                      label="Facility Name"
                      value={facility?.name}
                    />
                    <ReadonlyDropdownField
                      label="Facility Type"
                      value={facility?.facility_type}
                    />
                    <ReadonlyDropdownField
                      label="Facility Level"
                      value={facility?.level}
                    />
                    <ReadonlyDropdownField label="LGA" value={facility?.lga} />
                    <ReadonlyDropdownField
                      label="Ward"
                      value={facility?.ward}
                    />
                  </>
                )}
              </div>
            </section>
            <section className="pt-6 border-t border-gray-100">
              <SectionHeader title="Facility Contact Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                <div className="md:col-span-2">
                  {isEditing ? (
                    <div className="relative">
                      <label className={labelStyles}>Facility Address</label>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) =>
                          setEditForm({ ...editForm, address: e.target.value })
                        }
                        className={inputStyles}
                      />
                    </div>
                  ) : (
                    <ReadonlyField
                      label="Facility Address"
                      value={facility?.address}
                    />
                  )}
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-x-4">
                  <div className="relative">
                    <label className={labelStyles}>Code</label>
                    <div
                      className={`${inputStyles} flex items-center gap-2 bg-gray-50 border-gray-100`}
                    >
                      <div className="w-5 h-5 rounded-sm flex overflow-hidden shrink-0">
                        <div className="w-1/3 h-full bg-[#006C35]" />
                        <div className="w-1/3 h-full bg-white" />
                        <div className="w-1/3 h-full bg-[#006C35]" />
                      </div>
                      <span className="text-gray-700">+234</span>
                    </div>
                  </div>
                  <ReadonlyField
                    label="Phone Number"
                    value={facility?.manager_phone?.replace("+234", "")}
                  />
                </div>

                <div className="relative">
                  <label className={labelStyles}>Date Created</label>
                  <div
                    className={`${inputStyles} flex items-center gap-3 bg-gray-50 border-gray-100`}
                  >
                    <Calendar size={16} className="text-gray-400 shrink-0" />
                    <span className="text-gray-700">
                      {facility?.created_at
                        ? new Date(facility.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 justify-center">
                  <span className="text-xs text-gray-600 font-medium">
                    Status
                  </span>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-6 rounded-full relative flex items-center shrink-0 border border-transparent ${
                        facility?.is_active ? "bg-[#046C3F]" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transform transition-transform ${
                          facility?.is_active
                            ? "translate-x-[22px]"
                            : "translate-x-1"
                        }`}
                      >
                        {facility?.is_active && (
                          <svg
                            viewBox="0 0 12 12"
                            fill="none"
                            className="w-full h-full p-0.5"
                          >
                            <path
                              d="M2 6L4.5 8.5L10 3"
                              stroke="#046C3F"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">
                      Active / Inactive
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
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
