"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FlaskConical,
  Pill,
  Heart,
  Syringe,
  Share2,
  LogOut,
  X,
} from "lucide-react";
import { useSidebar } from "@/src/components/adminDashboard/generics/sidebar";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/doctor-dashboard" },
  { name: "Patients", icon: Users, path: "/doctor-dashboard/patients" },
  { name: "Consultations", icon: Stethoscope, path: "/doctor-dashboard/consultations" },
  { name: "Laboratory", icon: FlaskConical, path: "/doctor-dashboard/laboratory" },
  { name: "Prescriptions", icon: Pill, path: "/doctor-dashboard/prescriptions" },
  { name: "Maternal Care", icon: Heart, path: "/doctor-dashboard/maternal-care" },
  { name: "Immunization", icon: Syringe, path: "/doctor-dashboard/immunization" },
  { name: "Referrals", icon: Share2, path: "/doctor-dashboard/referrals" },
];

export const DoctorSidebar = () => {
  const pathname = usePathname();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { mobileOpen, setMobileOpen } = useSidebar();

  useEffect(() => { setMounted(true); }, []);

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
            <span className="text-xl font-bold text-gray-800 tracking-tight">LOGO</span>
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
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-[#046C3F] text-white shadow-md shadow-emerald-900/10"
                    : "text-[#53545C] hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  size={20}
                  className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"} transition-colors shrink-0`}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#F33131] hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group"
          >
            <LogOut size={20} className="text-red-400 group-hover:text-red-600 transition-colors" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {mounted && logoutModalOpen && createPortal(
        <div
          onClick={() => setLogoutModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "1rem",
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
              width: "100%",
              maxWidth: "380px",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.25rem 0.75rem" }}>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>Log out</span>
              <button
                onClick={() => setLogoutModalOpen(false)}
                style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", display: "flex" }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: "0 1.25rem 1.25rem" }}>
              <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1.25rem" }}>
                Are you sure you want to sign out of your account?
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => setLogoutModalOpen(false)}
                  style={{ flex: 1, padding: "0.625rem", borderRadius: "0.75rem", fontSize: "0.875rem", fontWeight: 600, color: "#374151", background: "#F3F4F6", border: "none", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  style={{ flex: 1, padding: "0.625rem", borderRadius: "0.75rem", fontSize: "0.875rem", fontWeight: 600, color: "#fff", background: "#DC2626", border: "none", cursor: "pointer" }}
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
};
