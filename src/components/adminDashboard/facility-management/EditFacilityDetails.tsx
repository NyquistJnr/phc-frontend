"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  ArrowLeft,
  Phone,
  CircleCheck,
  ChevronDown,
  Loader2,
  MonitorCheck,
} from "lucide-react";
import Header from "@/src/components/adminDashboard/generics/header";
import { toast } from "react-toastify";
import { useFacility, useUpdateFacility } from "@/src/hooks/useFacilities";

const LabeledInput = ({
  label,
  type = "text",
  value,
  onChange,
  name,
  disabled,
  placeholder,
}: any) => {
  const inputStyles =
    "block w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#1AC073] focus:ring-[#1AC073] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors";
  const labelStyles =
    "absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-600 font-bold uppercase tracking-wider z-[2]";

  return (
    <div className="relative">
      <label className={labelStyles}>{label}</label>
      {type === "select" ? (
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${inputStyles} appearance-none cursor-pointer`}
          >
            <option value="" disabled>
              Select {label}
            </option>
            <option value="Level 1">Level 1</option>
            <option value="Level 2">Level 2</option>
            <option value="Level 3">Level 3</option>
            <option value="Level 4">Level 4</option>
            <option value="Level 5">Level 5</option>
          </select>
          <ChevronDown
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={inputStyles}
        />
      )}
    </div>
  );
};

const splitName = (fullName: string | null) => {
  if (!fullName) return { first: "", last: "" };
  const parts = fullName.trim().split(/\s+/);
  return {
    first: parts[0] || "",
    last: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
};

const defaultFormState = {
  name: "",
  facility_type: "",
  lga: "",
  address: "",
  level: "",
  manager_first_name: "",
  manager_last_name: "",
  manager_email: "",
  manager_phone: "",
  it_admin_first_name: "",
  it_admin_last_name: "",
  it_admin_email: "",
  it_admin_phone: "",
};

function FacilityEditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("id");

  const { data: facility, isLoading } = useFacility(facilityId);
  const updateFacilityMutation = useUpdateFacility(facilityId);

  const [formData, setFormData] = useState(defaultFormState);
  const [initialFormData, setInitialFormData] = useState(defaultFormState);

  useEffect(() => {
    if (facility) {
      const managerName = splitName(facility.manager_name);
      const adminName = splitName(facility.it_admin_name);

      const fetchedData = {
        name: facility.name || "",
        facility_type: facility.facility_type || "",
        lga: facility.lga || "",
        address: facility.address || "",
        level: facility.level || "",
        manager_first_name: managerName.first,
        manager_last_name: managerName.last,
        manager_email: facility.manager_email || "",
        manager_phone: facility.manager_phone || "",
        it_admin_first_name: adminName.first,
        it_admin_last_name: adminName.last,
        it_admin_email: facility.it_admin_email || "",
        it_admin_phone: facility.it_admin_phone || "",
      };

      setFormData(fetchedData);
      setInitialFormData(fetchedData);
    }
  }, [facility]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hasChanges = Object.keys(formData).some(
    (key) =>
      formData[key as keyof typeof formData] !==
      initialFormData[key as keyof typeof initialFormData],
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityId || !hasChanges) return;

    const payload: Partial<typeof formData> = {};
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      if (formData[key] !== initialFormData[key]) {
        payload[key] = formData[key];
      }
    });

    updateFacilityMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Facility details updated successfully.");
        setInitialFormData(formData);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update facility details.");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
        <p className="text-sm font-medium">Loading facility details...</p>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-500">
        <p>Facility not found or invalid ID.</p>
        <button
          onClick={() => router.push("/dashboard/facility-management")}
          className="mt-4 text-[#046C3F] hover:underline"
        >
          Go back to Facilities
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 bg-white rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition mb-2"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {facility.code} – Facility Profile
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-[#046C3F] text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm">
          <p className="text-sm font-medium opacity-80 mb-2">Total Patients</p>
          <p className="text-3xl sm:text-5xl font-bold">
            {facility.patient_count?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white text-gray-900 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-2">
            Staff Members
          </p>
          <p className="text-3xl sm:text-5xl font-bold">
            {facility.staff_count?.toLocaleString() || 0}
          </p>
        </div>
      </div>
      <div className="bg-white p-4 sm:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
        <form onSubmit={handleSave} className="space-y-10 sm:space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
              <div className="p-2 bg-[#E8F7F0] rounded-lg">
                <Building2 className="text-[#046C3F]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
              <LabeledInput
                label="Facility Code"
                value={facility.code}
                disabled
              />
              <LabeledInput
                label="Date Created"
                value={new Date(facility.created_at).toLocaleDateString()}
                disabled
              />
              <LabeledInput
                label="Facility Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <LabeledInput
                label="Facility Type"
                name="facility_type"
                value={formData.facility_type}
                onChange={handleChange}
              />

              <LabeledInput label="State" value={facility.state} disabled />

              <LabeledInput
                label="Local Government Area (LGA)"
                name="lga"
                value={formData.lga}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <LabeledInput
                  label="Facility Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <LabeledInput
                label="Facility Level"
                type="select"
                name="level"
                value={formData.level}
                onChange={handleChange}
              />
            </div>
          </section>
          <section className="space-y-6 pt-10 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
              <div className="p-2 bg-[#E8F7F0] rounded-lg">
                <Phone className="text-[#046C3F]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Facility Manager
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
              <LabeledInput
                label="First Name"
                name="manager_first_name"
                value={formData.manager_first_name}
                onChange={handleChange}
              />
              <LabeledInput
                label="Last Name"
                name="manager_last_name"
                value={formData.manager_last_name}
                onChange={handleChange}
              />
              <LabeledInput
                label="Email Address"
                type="email"
                name="manager_email"
                value={formData.manager_email}
                onChange={handleChange}
              />
              <LabeledInput
                label="Phone Number"
                type="tel"
                name="manager_phone"
                value={formData.manager_phone}
                onChange={handleChange}
              />
            </div>
          </section>
          <section className="space-y-6 pt-10 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
              <div className="p-2 bg-[#E8F7F0] rounded-lg">
                <MonitorCheck className="text-[#046C3F]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                IT Administrator
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
              <LabeledInput
                label="First Name"
                name="it_admin_first_name"
                value={formData.it_admin_first_name}
                onChange={handleChange}
              />
              <LabeledInput
                label="Last Name"
                name="it_admin_last_name"
                value={formData.it_admin_last_name}
                onChange={handleChange}
              />
              <LabeledInput
                label="Email Address"
                type="email"
                name="it_admin_email"
                value={formData.it_admin_email}
                onChange={handleChange}
              />
              <LabeledInput
                label="Phone Number"
                type="tel"
                name="it_admin_phone"
                value={formData.it_admin_phone}
                onChange={handleChange}
              />
            </div>
          </section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-8 border-t border-gray-100">
            <button
              type="submit"
              disabled={updateFacilityMutation.isPending || !hasChanges}
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 bg-[#046C3F] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-md hover:bg-[#035a34] transition-colors"
            >
              {updateFacilityMutation.isPending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <CircleCheck size={20} />
              )}
              {updateFacilityMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FacilityProfilePage() {
  const breadcrumbs = [
    { label: "Facility Management" },
    { label: "Facility Details" },
    { label: "Edit Details", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-h-screen">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />
      <div className="flex-1 p-4 sm:p-8 pt-4">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-32 text-gray-400">
              <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
              <p className="text-sm font-medium">Preparing editor...</p>
            </div>
          }
        >
          <FacilityEditForm />
        </Suspense>
      </div>
    </div>
  );
}
