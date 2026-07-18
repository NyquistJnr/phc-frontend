"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  AlertOctagon,
  Box,
  CreditCard,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Users,
  X,
  BarChart3,
} from "lucide-react";
import { useSidebar } from "@/src/components/adminDashboard/generics/sidebar";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/pharmacist-dashboard" },
  {
    name: "Prescriptions",
    icon: ReceiptText,
    path: "/pharmacist-dashboard/prescriptions",
  },
  { name: "Patients", icon: Users, path: "/pharmacist-dashboard/patients" },
  { name: "Inventory", icon: Box, path: "/pharmacist-dashboard/inventory" },
  { name: "Payments", icon: CreditCard, path: "/pharmacist-dashboard/payments" },
  {
    name: "Adverse Events",
    icon: AlertOctagon,
    path: "/pharmacist-dashboard/adverse-events",
  },
  { name: "Reports", icon: BarChart3, path: "/pharmacist-dashboard/reports" },
];

export default function PharmacistSidebar() {
  const pathname = usePathname();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { mobileOpen, setMobileOpen } = useSidebar();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login", redirect: true });
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-full bg-[#1AC073]" />
              <div className="absolute inset-0 translate-x-1 rounded-full bg-[#FFD66B] opacity-50" />
              <div className="absolute inset-0 scale-75 rounded-full border-2 border-white bg-emerald-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-800">
              LOGO
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg bg-gray-50 p-1.5 text-gray-400 transition-colors hover:text-gray-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="grow space-y-1.5 overflow-y-auto px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/pharmacist-dashboard"
                ? pathname === item.path || pathname === "/pharmacist-dashboard/profile"
                : pathname === item.path ||
                  pathname.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-[#046C3F] text-white shadow-md shadow-emerald-900/10"
                    : "text-[#53545C] hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  size={20}
                  className={`${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                  } shrink-0 transition-colors`}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-gray-100 bg-gray-50/50 p-4">
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#F33131] transition-all duration-200 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut
              size={20}
              className="text-red-400 transition-colors group-hover:text-red-600"
            />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {logoutModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            onClick={() => setLogoutModalOpen(false)}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 pb-3 pt-5">
                <span className="font-bold text-gray-900">Log out</span>
                <button
                  onClick={() => setLogoutModalOpen(false)}
                  className="text-gray-400"
                  aria-label="Close logout dialog"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="px-5 pb-5">
                <p className="mb-5 text-sm text-gray-500">
                  Are you sure you want to sign out of your account?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLogoutModalOpen(false)}
                    className="flex-1 rounded-xl bg-gray-100 p-2.5 text-sm font-semibold text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 rounded-xl bg-red-600 p-2.5 text-sm font-semibold text-white"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
