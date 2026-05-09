"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, Home, Menu, Search } from "lucide-react";
import { useSidebar } from "@/src/components/adminDashboard/generics/sidebar";
import { useNotifications } from "@/src/hooks/useNotifications";
import { useProfile } from "@/src/hooks/useProfile";

export type DashboardBreadcrumb = {
  label: string;
};

type DashboardHeaderProps = {
  title: string;
  breadcrumbs?: DashboardBreadcrumb[];
  notificationHref: string;
  fallbackName: string;
  fallbackRole: string;
};

const formatRole = (role?: string, fallbackRole = "User") => {
  if (!role) return fallbackRole;

  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function DashboardHeader({
  title,
  breadcrumbs = [],
  notificationHref,
  fallbackName,
  fallbackRole,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { setMobileOpen } = useSidebar();
  const { data: notifData } = useNotifications(1, 4);
  const { data: profileData } = useProfile();

  const unreadCount = notifData?.stats?.unread || 0;
  const firstName = profileData?.first_name || fallbackName;
  const role = formatRole(profileData?.role, fallbackRole);
  const profilePic = profileData?.profile_picture || "/images/profile.jpg";

  return (
    <div className="sticky top-0 z-20 flex w-full flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 text-gray-600 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <h1 className="truncate text-lg font-semibold text-[#3F3F46] sm:text-xl">
            {title}
          </h1>
        </div>

        <div className="relative hidden w-64 md:block lg:w-[420px] xl:w-[630px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111827]"
            size={20}
          />
          <input
            type="text"
            placeholder="Search"
            className="h-10 w-full rounded-full border border-[#BFE8D5] bg-white pl-12 pr-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#046C3F] focus:ring-2 focus:ring-[#046C3F]/10"
          />
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.push(notificationHref)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F7F0] text-[#046C3F] transition-colors hover:bg-[#D9F2E7]"
            aria-label="Notifications"
          >
            <Bell size={18} fill="currentColor" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-[#1AC073] text-[9px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-gray-800">
              {firstName}
            </p>
            <p className="text-[11px] leading-tight text-gray-500">{role}</p>
          </div>
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
            <Image src={profilePic} alt="Profile" fill className="object-cover" />
          </div>
        </div>
      </header>

      <nav className="flex items-center gap-2 overflow-x-auto bg-white px-4 py-2.5 text-xs text-gray-400 sm:px-6">
        <Home
          size={15}
          className="shrink-0 text-[#046C3F]"
          fill="currentColor"
        />
        {breadcrumbs.map((crumb) => (
          <span key={crumb.label} className="contents">
            <span>/</span>
            <span className="whitespace-nowrap">{crumb.label}</span>
          </span>
        ))}
      </nav>
    </div>
  );
}
