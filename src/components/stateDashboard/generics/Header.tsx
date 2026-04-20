"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Home,
  Menu,
  User,
  LogOut,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useSidebar } from "@/src/components/adminDashboard/generics/sidebar";
import { useSession, signOut } from "next-auth/react";
import { useNotifications } from "@/src/hooks/useNotifications";
import { useProfile } from "@/src/hooks/useProfile";

interface Breadcrumb {
  label: string;
  href?: string;
  active?: boolean;
}

interface HeaderProps {
  title: string;
  breadcrumbs: Breadcrumb[];
}

export default function Header({ title, breadcrumbs }: HeaderProps) {
  const { setMobileOpen } = useSidebar();
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileCoords, setProfileCoords] = useState({ top: 0, left: 0 });
  const profileBtnRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { data: notifData } = useNotifications(1, 4);
  const { data: profileData } = useProfile();

  const unreadCount = notifData?.stats?.unread || 0;

  useEffect(() => { setMounted(true); }, []);

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
    function handleScroll() { setIsProfileOpen(false); }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isProfileOpen]);

  const user = profileData || session?.user;
  const firstName = user?.first_name || "User";
  const lastName  = user?.last_name  || "";
  const email     = user?.email      || "";
  const role = user?.role
    ? user.role.split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
    : "State Admin";
  const profilePic = user?.profile_picture || "/images/profile.jpg";

  return (
    <div className="flex flex-col sticky top-0 z-10 w-full">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-gray-600 p-1"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative hidden md:block w-64 lg:w-80 xl:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white border border-gray-200 rounded-full pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1AC073]"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Bell — navigates to state-dashboard notifications page */}
            <button
              onClick={() => router.push("/state-dashboard/notifications")}
              className="relative p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-[#1AC073] text-white text-[9px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <div
              ref={profileBtnRef}
              onClick={toggleProfileMenu}
              className="flex items-center gap-3 border-l pl-3 sm:pl-4 border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">{firstName}</p>
                <p className="text-[11px] text-gray-500 font-medium">{role}</p>
              </div>
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                <Image src={profilePic} alt="Profile" fill className="object-cover" />
              </div>
            </div>

            {mounted && isProfileOpen && createPortal(
              <div
                ref={profileMenuRef}
                style={{ top: `${profileCoords.top}px`, left: `${profileCoords.left}px` }}
                className="absolute w-[280px] sm:w-72 bg-white border border-gray-100 rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] z-[9999] overflow-hidden"
              >
                <div className="p-5 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-white shrink-0">
                    <Image src={profilePic} alt="Profile" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{firstName} {lastName}</p>
                    <p className="text-xs text-[#046C3F] font-semibold truncate mb-0.5">{role}</p>
                    <p className="text-[11px] text-gray-400 truncate">{email}</p>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    href="/state-dashboard/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#E8F7F0] hover:text-[#046C3F] rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-gray-400 group-hover:text-[#046C3F] transition-colors" />
                      View Profile
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-[#046C3F] transition-colors" />
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
        </div>
      </header>

      <nav className="bg-[#F9FAFB] px-2 sm:px-8 py-3 sm:py-4 flex items-center gap-2 text-sm text-gray-500 overflow-x-auto">
        <Home size={16} className="text-[#046C3F] shrink-0" />
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span className="mx-1 shrink-0">/</span>
            <span className={`whitespace-nowrap ${crumb.active ? "text-gray-800 font-medium" : ""}`}>
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}
