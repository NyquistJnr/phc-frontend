"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Monitor, Building2, Trash2 } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

type NotifType = "User Activity" | "System Alert" | "Facility Update";

interface NotificationItem {
  id: string;
  type: NotifType;
  description: string;
  time: string;
  group: "Today" | "Yesterday";
  read: boolean;
}

const DUMMY: NotificationItem[] = [
  { id: "1", type: "User Activity",   description: "New user account created for Nurse Ada",      time: "12:24PM", group: "Today",     read: false },
  { id: "2", type: "User Activity",   description: "New user account created for Nurse Ada",      time: "12:24PM", group: "Today",     read: false },
  { id: "3", type: "System Alert",    description: "System error detected in database",            time: "12:24PM", group: "Today",     read: false },
  { id: "4", type: "System Alert",    description: "System error detected in database",            time: "12:24PM", group: "Today",     read: false },
  { id: "5", type: "Facility Update", description: "Facility details updated for PHC Surulere",   time: "12:24PM", group: "Yesterday", read: false },
  { id: "6", type: "Facility Update", description: "Facility details updated for PHC Surulere",   time: "12:24PM", group: "Yesterday", read: false },
];

const ITEMS_PER_PAGE = 10;
const TOTAL_PAGES = 68;

function NotifIcon({ type }: { type: NotifType }) {
  const base = "w-10 h-10 rounded-full bg-[#E8F7F0] text-[#046C3F] flex items-center justify-center shrink-0";
  if (type === "User Activity")   return <div className={base}><User   size={18} /></div>;
  if (type === "System Alert")    return <div className={base}><Monitor size={18} /></div>;
  return                                 <div className={base}><Building2 size={18} /></div>;
}

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(DUMMY);
  const [currentPage, setCurrentPage] = useState(1);

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const remove = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const groups = (["Today", "Yesterday"] as const).map((group) => ({
    label: group,
    items: notifications.filter((n) => n.group === group),
  })).filter((g) => g.items.length > 0);

  const breadcrumbs = [{ label: "Notification", active: true }];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="Notification" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 max-w-4xl w-full">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors mb-6 bg-white border border-gray-200 px-4 py-2 rounded-lg"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Notification
        </h1>

        {/* Notification Groups */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {groups.map((group) => (
            <div key={group.label}>
              {/* Group Label */}
              <div className="px-6 py-3 bg-[#F9FAFB] border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-500">{group.label}</span>
              </div>

              {/* Items */}
              {group.items.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-b-0 transition-colors ${
                    notif.read ? "bg-white" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <NotifIcon type={notif.type} />

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold text-gray-900 ${notif.read ? "opacity-60" : ""}`}>
                      {notif.type}
                    </p>
                    <p className={`text-sm text-gray-500 mt-0.5 ${notif.read ? "opacity-60" : ""}`}>
                      {notif.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 shrink-0">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={notif.read}
                        onChange={() => markRead(notif.id)}
                        className="w-4 h-4 rounded border-gray-300 accent-[#046C3F] cursor-pointer"
                      />
                      <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors whitespace-nowrap">
                        Mark as read
                      </span>
                    </label>
                    <button
                      onClick={() => remove(notif.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <p className="text-sm font-medium">No notifications</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
