"use client";

import React, { useState, useEffect } from "react";
import Header from "@/src/components/adminDashboard/generics/header";
import Toast from "@/src/components/adminDashboard/generics/Toast";
import {
  Loader2,
  User as UserIcon,
  Camera,
  Save,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { useProfile, useUpdateProfile } from "@/src/hooks/useProfile";

const inputStyles =
  "block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1AC073] focus:ring-[#1AC073] transition-colors";
const labelStyles =
  "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider";

export default function Profile() {
  const { data: profileData, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    phone_number: "",
    address: "",
    city: "",
    profile_picture: "",
  });

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        middle_name: profileData.middle_name || "",
        phone_number: profileData.phone_number || "",
        address: profileData.address || "",
        city: profileData.city || "",
        profile_picture: profileData.profile_picture || "",
      });
    }
  }, [profileData]);

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToastMsg({ title, message, type });
    setToastVisible(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfileMutation.mutate(
      {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        middle_name: formData.middle_name.trim(),
        phone_number: formData.phone_number.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        profile_picture: formData.profile_picture.trim(),
      },
      {
        onSuccess: () => {
          showToast(
            "Profile Updated",
            "Your profile information has been successfully saved.",
          );
        },
        onError: (error: any) => {
          showToast(
            "Update Failed",
            error.message || "Could not update profile.",
            "error",
          );
        },
      },
    );
  };

  const breadcrumbs = [
    { label: "Dashboard" },
    { label: "My Profile", active: true },
  ];

  // Calculate if there are any changes
  const hasChanges = profileData
    ? formData.first_name !== (profileData.first_name || "") ||
      formData.last_name !== (profileData.last_name || "") ||
      formData.middle_name !== (profileData.middle_name || "") ||
      formData.phone_number !== (profileData.phone_number || "") ||
      formData.address !== (profileData.address || "") ||
      formData.city !== (profileData.city || "") ||
      formData.profile_picture !== (profileData.profile_picture || "")
    : false;

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-[#F9FAFB] min-h-screen">
        <Header title="My Profile" breadcrumbs={breadcrumbs} />
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
          <p className="text-sm font-medium">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-h-screen">
      <Header title="My Profile" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 max-w-8xl mx-auto w-full">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Account Settings
          </h2>
          <p className="text-gray-500 text-sm">
            Manage your personal information and profile settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Banner Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 shrink-0 overflow-hidden group">
              <Image
                src={formData.profile_picture || "/images/profile.jpg"}
                alt="Profile Avatar"
                fill
                className="object-cover"
              />
            </div>

            <div className="text-center sm:text-left flex-1 w-full">
              <h3 className="text-2xl font-bold text-gray-900">
                {profileData?.first_name} {profileData?.last_name}
              </h3>
              <p className="text-sm font-semibold text-[#046C3F] uppercase tracking-wider mt-1 mb-4">
                {profileData?.role}
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
                    value={formData.profile_picture}
                    onChange={handleChange}
                    placeholder="https://example.com/my-photo.jpg"
                    className={`${inputStyles} pl-10`}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
                  Paste a direct link to an image to update your avatar.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <UserIcon size={20} className="text-[#046C3F]" />
              <h3 className="text-lg font-bold text-gray-800">
                Personal Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyles}>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
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
                  value={formData.last_name}
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
                  value={formData.middle_name}
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
                  value={formData.phone_number}
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
                    className={`${inputStyles} pl-10 bg-gray-50 text-gray-500 cursor-not-allowed`}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
                  Email address cannot be changed.
                </p>
              </div>

              <div className="md:col-span-2 border-t border-gray-50 pt-6 mt-2">
                <div className="flex items-center gap-2 mb-6">
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
                  value={formData.address}
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
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Jos"
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>State</label>
                <input
                  type="text"
                  value={profileData?.state || "Plateau"}
                  readOnly
                  className={`${inputStyles} bg-gray-50 text-gray-500 cursor-not-allowed`}
                />
              </div>

              <div>
                <label className={labelStyles}>Country</label>
                <input
                  type="text"
                  value={profileData?.country || "Nigeria"}
                  readOnly
                  className={`${inputStyles} bg-gray-50 text-gray-500 cursor-not-allowed`}
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                disabled={!hasChanges || updateProfileMutation.isPending}
                className="px-8 py-3 bg-[#046C3F] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center gap-2 shadow-md hover:bg-[#035a34] transition-colors"
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
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
