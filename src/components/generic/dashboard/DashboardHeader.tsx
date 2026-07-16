"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { signOut, useSession } from "next-auth/react";
import { ArrowRight, Bell, Home, LogOut, Menu, Search, User } from "lucide-react";
import { useSidebar } from "@/src/components/adminDashboard/generics/sidebar";
import { useNotifications } from "@/src/hooks/useNotifications";
import { useProfile } from "@/src/hooks/useProfile";

export type DashboardBreadcrumb = {
  label: string;
  href?: string;
};

type DashboardHeaderProps = {
  title: string;
  breadcrumbs?: DashboardBreadcrumb[];
  notificationHref: string;
  profileHref?: string;
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
  profileHref,
  fallbackName,
  fallbackRole,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { setMobileOpen } = useSidebar();
  const { data: session } = useSession();
  const { data: notifData } = useNotifications(1, 4);
  const { data: profileData } = useProfile();

  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileCoords, setProfileCoords] = useState({ top: 0, left: 0 });
  const profileBtnRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleProfileMenu = () => {
    if (!isProfileOpen && profileBtnRef.current) {
      const rect = profileBtnRef.current.getBoundingClientRect();
      const menuWidth = 288;
      let left = rect.right - menuWidth + window.scrollX;
      if (left < window.scrollX + 10) left = window.scrollX + 16;
      setProfileCoords({ top: rect.bottom + window.scrollY + 8, left });
    }
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isProfileOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    function handleScroll() {
      setIsProfileOpen(false);
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isProfileOpen]);

  const unreadCount = notifData?.stats?.unread || 0;
  const user = profileData || session?.user;
  const firstName = user?.first_name || fallbackName;
  const lastName = user?.last_name || "";
  const email = user?.email || "";
  const role = formatRole(user?.role, fallbackRole);
  const profilePic = user?.profile_picture || "/images/profile.jpg";

  return (
    <div className="sticky top-0 z-[9999] flex w-full flex-col">
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

          <div
            ref={profileBtnRef}
            onClick={toggleProfileMenu}
            className="flex items-center gap-3 border-l border-gray-100 pl-3 cursor-pointer transition-opacity hover:opacity-80 sm:pl-4"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-gray-800">
                {firstName}
              </p>
              <p className="text-[11px] leading-tight text-gray-500">{role}</p>
            </div>
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
              <Image src={profilePic} alt="Profile" fill className="object-cover" />
            </div>
          </div>

          {mounted &&
            isProfileOpen &&
            createPortal(
              <div
                ref={profileMenuRef}
                style={{
                  top: `${profileCoords.top}px`,
                  left: `${profileCoords.left}px`,
                }}
                className="absolute w-[280px] sm:w-72 bg-white border border-gray-100 rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] z-[9999] overflow-hidden"
              >
                <div className="p-5 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-white shrink-0">
                    <Image src={profilePic} alt="Profile" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {firstName} {lastName}
                    </p>
                    <p className="text-xs text-[#046C3F] font-semibold truncate mb-0.5">
                      {role}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">{email}</p>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    href={profileHref ?? "#"}
                    onClick={() => setIsProfileOpen(false)}
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#E8F7F0] hover:text-[#046C3F] rounded-xl transition-colors group ${
                      profileHref ? "" : "pointer-events-none opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <User
                        size={18}
                        className="text-gray-400 group-hover:text-[#046C3F] transition-colors"
                      />
                      View Profile
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-gray-300 group-hover:text-[#046C3F] transition-colors"
                    />
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={18} className="text-red-400" />
                    Sign Out
                  </button>
                </div>
              </div>,
              document.body,
            )}
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
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="whitespace-nowrap transition-colors hover:text-gray-800"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="whitespace-nowrap">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
