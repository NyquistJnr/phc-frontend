"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Trash2, UserRound, CalendarClock } from "lucide-react";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";

type NurseNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  group: "Today" | "Yesterday";
  read: boolean;
  kind: "Patient" | "Appointment" | "System";
};

const NOTIFICATIONS: NurseNotification[] = [
  {
    id: "NOT-001",
    title: "Vitals pending",
    message: "Ngozi Eze is waiting for vitals capture.",
    time: "12:24 PM",
    group: "Today",
    read: false,
    kind: "Patient",
  },
  {
    id: "NOT-002",
    title: "ANC visit due",
    message: "Blessing Nwachukwu is due for an antenatal visit today.",
    time: "11:02 AM",
    group: "Today",
    read: false,
    kind: "Appointment",
  },
  {
    id: "NOT-003",
    title: "Referral accepted",
    message: "General Hospital accepted referral REF-PLT-000234.",
    time: "9:35 AM",
    group: "Today",
    read: true,
    kind: "System",
  },
  {
    id: "NOT-004",
    title: "Immunization due",
    message: "Baby Eze has Penta-3 and OPV-3 scheduled.",
    time: "3:12 PM",
    group: "Yesterday",
    read: false,
    kind: "Patient",
  },
  {
    id: "NOT-005",
    title: "Appointment scheduled",
    message: "New consultation appointment assigned to Nurse Grace.",
    time: "1:48 PM",
    group: "Yesterday",
    read: true,
    kind: "Appointment",
  },
];

const iconMap = {
  Patient: UserRound,
  Appointment: CalendarClock,
  System: Bell,
};

export default function NurseNotifications() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [currentPage, setCurrentPage] = useState(1);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const groups = (["Today", "Yesterday"] as const)
    .map((group) => ({
      label: group,
      items: notifications.filter((item) => item.group === group),
    }))
    .filter((group) => group.items.length > 0);

  const markRead = (id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const remove = (id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Notifications"
        breadcrumbs={[{ label: "Notifications" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton />

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black sm:text-3xl">
              Notifications
            </h1>
            <p className="mt-2 text-base text-[#3F3F46]">
              Review nurse alerts, patient updates, and task reminders.
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="w-fit rounded-full bg-[#E8F7F0] px-4 py-2 text-sm font-semibold text-[#046C3F]">
              {unreadCount} unread
            </span>
          )}
        </div>

        <section className="overflow-hidden rounded-xl bg-white">
          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Bell size={32} className="mb-3" />
              <p className="text-sm font-medium">No notifications</p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label}>
                <div className="border-b border-gray-100 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-500">
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const Icon = iconMap[item.kind];
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col gap-4 border-b border-gray-100 px-6 py-5 last:border-b-0 sm:flex-row sm:items-center ${
                        item.read ? "bg-white" : "bg-[#F4FBFC]"
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F7F0] text-[#046C3F]">
                          <Icon size={18} />
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          <p className="mt-1 text-sm text-gray-500">{item.message}</p>
                          <p className="mt-1 text-xs text-gray-400">{item.time}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        {!item.read && (
                          <button
                            onClick={() => markRead(item.id)}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:border-[#A6E1C4] hover:bg-[#E8F7F0] hover:text-[#046C3F]"
                          >
                            <CheckCircle2 size={14} />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => remove(item.id)}
                          className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete notification"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <Pagination currentPage={currentPage} totalPages={3} onPageChange={setCurrentPage} />
        </section>
      </div>
    </div>
  );
}
