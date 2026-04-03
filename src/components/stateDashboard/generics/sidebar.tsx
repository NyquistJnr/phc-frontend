"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Activity,
  SlidersHorizontal,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
// The existing Header component uses useSidebar from the admin sidebar file.
// We import it from there so both components share the same React context.
import { useSidebar } from "@/src/components/adminDashboard/generics/sidebar";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/state-dashboard" },
  {
    name: "Facility Management",
    icon: Building2,
    children: [
      {
        name: "Create Facility",
        path: "/state-dashboard/facility-management/create-facility",
      },
      {
        name: "View Facility",
        path: "/state-dashboard/facility-management/view-facility",
      },
      {
        name: "Assign Facility",
        path: "/state-dashboard/facility-management/assign-facility",
      },
      {
        name: "Performance",
        path: "/state-dashboard/facility-management/performance",
      },
    ],
  },
  {
    name: "User Management",
    icon: Users,
    children: [
      {
        name: "Create User",
        path: "/state-dashboard/user-management/create-user",
      },
      {
        name: "Modify User",
        path: "/state-dashboard/user-management/modify-user",
      },
      {
        name: "Reset Password",
        path: "/state-dashboard/user-management/reset-password",
      },
      {
        name: "Suspend Account",
        path: "/state-dashboard/user-management/suspend-account",
      },
    ],
  },
  {
    name: "System Monitoring",
    icon: Activity,
    children: [
      {
        name: "Audit Logs",
        path: "/state-dashboard/system-monitoring/audit-logs",
      },
      {
        name: "System Logs",
        path: "/state-dashboard/system-monitoring/system-logs",
      },
    ],
  },
  {
    name: "Configuration",
    icon: SlidersHorizontal,
    children: [
      {
        name: "General Settings",
        path: "/state-dashboard/configuration/general",
      },
      {
        name: "Notifications",
        path: "/state-dashboard/configuration/notifications",
      },
    ],
  },
];

export const StateSidebar = () => {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const { mobileOpen, setMobileOpen } = useSidebar();

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children?.some((child) => pathname.startsWith(child.path))) {
        setExpandedMenu(item.name);
      }
    });
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  const toggleMenu = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login", redirect: true });
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between py-8 px-6">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-[#1AC073] rounded-full"></div>
              <div className="absolute inset-0 bg-[#FFD66B] rounded-full opacity-50 translate-x-1"></div>
              <div className="absolute inset-0 bg-emerald-400 rounded-full scale-75 border-2 border-white"></div>
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              LOGO
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 p-1.5 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="grow px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedMenu === item.name;
            const hasActiveChild = item.children?.some((child) =>
              pathname.startsWith(child.path),
            );
            const isExactActive = item.path === pathname;

            return (
              <div key={item.name} className="space-y-1">
                {item.children ? (
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      hasActiveChild
                        ? "bg-[#E8F7F0] text-[#046C3F]"
                        : "text-[#53545C] hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`${hasActiveChild ? "text-[#046C3F]" : "text-gray-400 group-hover:text-gray-600"} transition-colors`}
                    />
                    <span className="grow text-sm font-medium text-left">
                      {item.name}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${isExpanded ? "rotate-180 text-[#046C3F]" : "text-gray-400"}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.path || "#"}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isExactActive
                        ? "bg-[#046C3F] text-white shadow-md shadow-emerald-900/10"
                        : "text-[#53545C] hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`${isExactActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"} transition-colors`}
                    />
                    <span className="grow text-sm font-medium text-left">
                      {item.name}
                    </span>
                  </Link>
                )}

                {item.children && (
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100 mt-1"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pl-11 space-y-1 py-1 relative before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                        {item.children.map((subItem) => {
                          const isSubActive = pathname === subItem.path;
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.path}
                              className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isSubActive
                                  ? "text-[#046C3F] bg-[#E8F7F0]"
                                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#F33131] hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group"
          >
            <LogOut
              size={20}
              className="text-red-400 group-hover:text-red-600 transition-colors"
            />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
