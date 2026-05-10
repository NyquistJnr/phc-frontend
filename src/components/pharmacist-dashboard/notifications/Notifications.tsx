"use client";

import { Bell } from "lucide-react";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";

const notifications = [
  {
    title: "Prescription dispensed",
    body: "Metformin 500mg was dispensed to Liam O'Connor.",
    time: "11:00 AM",
  },
  {
    title: "Low stock alert",
    body: "Salbutamol Inhaler has 7 units left.",
    time: "10:45 AM",
  },
  {
    title: "ADR report submitted",
    body: "ADR-PLT-000234 was submitted for review.",
    time: "10:30 AM",
  },
];

export default function PharmacistNotifications() {
  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Notifications"
        breadcrumbs={[{ label: "Notifications" }]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <h1 className="mb-6 text-2xl font-semibold text-black sm:text-3xl">
          Notifications
        </h1>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.title}
                className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F7F0] text-[#046C3F]">
                  <Bell size={18} fill="currentColor" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#111827]">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-[#53545C]">
                    {notification.body}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {notification.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
