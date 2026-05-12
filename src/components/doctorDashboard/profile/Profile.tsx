"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  Camera,
  Loader2,
  Mail,
  MapPin,
  Save,
  User as UserIcon,
} from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import Toast from "@/src/components/adminDashboard/generics/Toast";
import {
  ProfileUpdatePayload,
  useProfile,
  useUpdateProfile,
} from "@/src/hooks/useProfile";

const inputStyles =
  "block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1AC073] focus:ring-[#1AC073] transition-colors";
const labelStyles =
  "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider";

type EditableField = keyof ProfileUpdatePayload;

const editableFields: EditableField[] = [
  "first_name",
  "last_name",
  "middle_name",
  "phone_number",
  "address",
  "city",
  "profile_picture",
];

function getApiErrorMessage(error: unknown, fallback: string) {
  const maybeError = error as {
    message?: string;
    response?: { data?: { message?: string; detail?: string } };
  };
  return (
    maybeError.response?.data?.message ||
    maybeError.response?.data?.detail ||
    maybeError.message ||
    fallback
  );
}

function formatRole(role?: string) {
  if (!role) return "Doctor";
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function DoctorProfile() {
  const { data: profileData, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const [edits, setEdits] = useState<Partial<Record<EditableField, string>>>(
    {},
  );
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const breadcrumbs = [
    { label: "Dashboard", href: "/doctor-dashboard" },
    { label: "My Profile", active: true },
  ];

  const values = useMemo(() => {
    const current = {} as Record<EditableField, string>;
    editableFields.forEach((field) => {
      current[field] = edits[field] ?? String(profileData?.[field] ?? "");
    });
    return current;
  }, [edits, profileData]);

  const hasChanges = editableFields.some(
    (field) => values[field] !== String(profileData?.[field] ?? ""),
  );

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToastMsg({ title, message, type });
    setToastVisible(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name as EditableField;
    const value = event.target.value;
    setEdits((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: ProfileUpdatePayload = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      middle_name: values.middle_name.trim(),
      phone_number: values.phone_number.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      profile_picture: values.profile_picture.trim(),
    };

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        setEdits({});
        showToast(
          "Profile Updated",
          "Your profile information has been successfully saved.",
        );
      },
      onError: (error: unknown) => {
        showToast(
          "Update Failed",
          getApiErrorMessage(error, "Could not update profile."),
          "error",
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-1 flex-col bg-[#F9FAFB]">
        <DoctorHeader title="My Profile" breadcrumbs={breadcrumbs} />
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <Loader2 className="mb-4 animate-spin text-[#046C3F]" size={32} />
          <p className="text-sm font-medium">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#F9FAFB]">
      <DoctorHeader title="My Profile" breadcrumbs={breadcrumbs} />

      <div className="mx-auto w-full max-w-8xl p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Account Settings
          </h2>
          <p className="text-sm text-gray-500">
            Manage your personal information and profile settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="flex flex-col items-center gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:rounded-[32px] sm:p-8">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg sm:h-32 sm:w-32">
              <Image
                src={values.profile_picture || "/images/profile.jpg"}
                alt="Profile Avatar"
                fill
                className="object-cover"
              />
            </div>

            <div className="w-full flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-900">
                {profileData?.first_name} {profileData?.last_name}
              </h3>
              <p className="mb-4 mt-1 text-sm font-semibold uppercase tracking-wider text-[#046C3F]">
                {formatRole(profileData?.role)}
              </p>

              <div className="w-full max-w-md">
                <label className={labelStyles}>Profile Image URL</label>
                <div className="relative">
                  <Camera
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="url"
                    name="profile_picture"
                    value={values.profile_picture}
                    onChange={handleChange}
                    placeholder="https://example.com/my-photo.jpg"
                    className={`${inputStyles} pl-10`}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:rounded-[32px] sm:p-8">
            <div className="mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
              <UserIcon size={20} className="text-[#046C3F]" />
              <h3 className="text-lg font-bold text-gray-800">
                Personal Details
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className={labelStyles}>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={values.first_name}
                  onChange={handleChange}
                  className={inputStyles}
                  required
                />
              </div>
              <div>
                <label className={labelStyles}>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={values.last_name}
                  onChange={handleChange}
                  className={inputStyles}
                  required
                />
              </div>
              <div>
                <label className={labelStyles}>Middle Name</label>
                <input
                  type="text"
                  name="middle_name"
                  value={values.middle_name}
                  onChange={handleChange}
                  placeholder="Optional"
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={values.phone_number}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyles}>Email Address</label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="email"
                    value={profileData?.email || ""}
                    readOnly
                    className={`${inputStyles} cursor-not-allowed bg-gray-50 pl-10 text-gray-500`}
                  />
                </div>
              </div>

              <div className="mt-2 border-t border-gray-50 pt-6 md:col-span-2">
                <div className="mb-6 flex items-center gap-2">
                  <MapPin size={20} className="text-[#046C3F]" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Location Details
                  </h3>
                </div>
              </div>

              <div>
                <label className={labelStyles}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  placeholder="123 Example Street"
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>City</label>
                <input
                  type="text"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  placeholder="e.g. Jos"
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>State</label>
                <input
                  type="text"
                  value={profileData?.state || ""}
                  readOnly
                  className={`${inputStyles} cursor-not-allowed bg-gray-50 text-gray-500`}
                />
              </div>
              <div>
                <label className={labelStyles}>Country</label>
                <input
                  type="text"
                  value={profileData?.country || ""}
                  readOnly
                  className={`${inputStyles} cursor-not-allowed bg-gray-50 text-gray-500`}
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                disabled={!hasChanges || updateProfileMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-[#046C3F] px-8 py-3 font-bold text-white shadow-md transition-colors hover:bg-[#035a34] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>
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
