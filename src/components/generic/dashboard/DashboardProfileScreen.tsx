"use client";

import { ComponentType, ReactNode } from "react";
import Image from "next/image";
import { ChevronDown, Mail, MapPin, Trash2, Upload, User } from "lucide-react";
import { DashboardBreadcrumb } from "@/src/components/generic/dashboard/DashboardHeader";

type DashboardHeaderComponent = ComponentType<{
  title: string;
  breadcrumbs?: DashboardBreadcrumb[];
}>;

type BackButtonComponent = ComponentType<{
  onClick?: () => void;
}>;

type DashboardProfileScreenProps = {
  Header: DashboardHeaderComponent;
  BackButton: BackButtonComponent;
  breadcrumbs?: DashboardBreadcrumb[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  state: string;
  portraitSrc?: string;
};

function ProfileField({
  label,
  value,
  icon,
  className = "",
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-3 block text-sm text-[#62636C]">{label}</span>
      <span className="flex h-14 items-center gap-4 rounded-lg bg-[#F3F6FA] px-5 text-lg text-[#62636C]">
        {icon}
        <span>{value}</span>
      </span>
    </label>
  );
}

export default function DashboardProfileScreen({
  Header,
  BackButton,
  breadcrumbs = [],
  firstName,
  lastName,
  email,
  phone,
  address,
  city,
  country,
  state,
  portraitSrc = "/images/profile.jpg",
}: DashboardProfileScreenProps) {
  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <Header title="Profile" breadcrumbs={breadcrumbs} />
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <BackButton />
        <div className="mb-16 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <h1 className="text-2xl font-semibold text-[#3F3F46] sm:text-3xl">Profile</h1>
          <button
            type="button"
            className="inline-flex h-16 items-center justify-center rounded-xl bg-[#046C3F] px-20 text-2xl font-medium text-white transition-colors hover:bg-[#035D36]"
          >
            Update
          </button>
        </div>

        <div className="grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-[minmax(0,540px)_1fr]">
          <section className="space-y-6">
            <ProfileField label="First Name" value={firstName} icon={<User size={24} className="text-gray-500" />} />
            <ProfileField label="Last Name" value={lastName} icon={<User size={24} className="text-gray-500" />} />
            <ProfileField label="Email" value={email} icon={<Mail size={24} className="text-gray-500" />} />
            <label className="block">
              <span className="mb-3 block text-sm text-[#62636C]">Phone Number</span>
              <span className="grid grid-cols-[170px_1fr] gap-4">
                <span className="flex h-14 items-center gap-4 rounded-lg bg-[#F3F6FA] px-5 text-lg text-[#62636C]">
                  <span className="flex h-8 w-11 overflow-hidden rounded-sm">
                    <span className="w-1/3 bg-[#149954]" />
                    <span className="w-1/3 bg-white" />
                    <span className="w-1/3 bg-[#149954]" />
                  </span>
                  +234
                  <ChevronDown size={20} />
                </span>
                <span className="flex h-14 items-center rounded-lg bg-[#F3F6FA] px-5 text-lg text-[#62636C]">
                  {phone}
                </span>
              </span>
            </label>
            <ProfileField label="Address" value={address} icon={<MapPin size={24} className="text-gray-500" />} />
            <ProfileField label="City" value={city} />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-3 block text-sm text-[#62636C]">Country</span>
                <span className="flex h-14 items-center justify-between rounded-lg bg-[#F3F6FA] px-5 text-lg text-[#62636C]">
                  {country}
                  <ChevronDown size={22} />
                </span>
              </label>
              <label className="block">
                <span className="mb-3 block text-sm text-[#62636C]">State</span>
                <span className="flex h-14 items-center justify-between rounded-lg bg-[#F3F6FA] px-5 text-lg text-[#62636C]">
                  {state}
                  <ChevronDown size={22} />
                </span>
              </label>
            </div>
          </section>

          <aside className="pt-3">
            <div className="relative h-56 w-56 overflow-hidden rounded-xl bg-[#A94740] shadow-sm">
              <Image src={portraitSrc} alt="Profile portrait" fill className="object-cover" />
              <div className="absolute right-4 top-4 flex gap-2">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-900 shadow-sm"
                  aria-label="Upload profile image"
                >
                  <Upload size={20} />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-900 shadow-sm"
                  aria-label="Delete profile image"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
