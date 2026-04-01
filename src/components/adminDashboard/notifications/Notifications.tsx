"use client";

import { useState } from "react";
import Header from "@/src/components/adminDashboard/generics/header";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import {
  useNotifications,
  useMarkNotificationRead,
} from "@/src/hooks/useNotifications";
import { Bell, CheckCircle2, Loader2, Activity } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
};

export default function Notifications() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useNotifications(currentPage, ITEMS_PER_PAGE);
  const markReadMutation = useMarkNotificationRead();

  const notifications = data?.results || [];
  const totalPages = data?.total_pages || 1;
  const unreadCount = data?.stats?.unread || 0;

  const breadcrumbs = [
    { label: "Dashboard" },
    { label: "Notifications", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-h-screen">
      <Header title="Notifications" breadcrumbs={breadcrumbs} />
      <div className="p-4 sm:p-8 max-w-8xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-[#E8F7F0] text-[#046C3F] text-xs font-bold rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              Review recent system alerts, actions, and updates.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl sm:rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Notification Feed</h3>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
              <p className="text-sm font-medium">
                Loading your notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Bell size={28} className="text-gray-300" />
              </div>
              <p className="text-base font-semibold text-gray-600 mb-1">
                You're all caught up!
              </p>
              <p className="text-sm text-gray-400">
                No notifications found for this period.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-5 sm:p-6 flex items-start gap-4 transition-colors hover:bg-gray-50 ${!notif.is_read ? "bg-[#F4FBFC]" : "bg-white"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${!notif.is_read ? "bg-[#046C3F]/10 text-[#046C3F]" : "bg-gray-100 text-gray-400"}`}
                  >
                    <Activity size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <p
                        className={`text-base leading-snug ${!notif.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}
                      >
                        <span className="text-[#046C3F]">
                          {notif.actor_name}
                        </span>{" "}
                        performed{" "}
                        <span className="uppercase text-xs tracking-wider bg-gray-100 px-2 py-0.5 rounded-md mx-1">
                          {notif.action}
                        </span>{" "}
                        in {notif.module}.
                      </p>

                      {!notif.is_read && (
                        <button
                          disabled={markReadMutation.isPending}
                          onClick={() => markReadMutation.mutate(notif.id)}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-[#E8F7F0] hover:border-[#A6E1C4] hover:text-[#046C3F] transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 size={14} />
                          Mark as read
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <span>{formatDateTime(notif.timestamp)}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                        IP: {notif.ip_address}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{notif.facility_name}</span>
                    </div>
                    {notif.changes && Object.keys(notif.changes).length > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono text-gray-600">
                        {Object.entries(notif.changes).map(([key, change]) => (
                          <div
                            key={key}
                            className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1 last:mb-0"
                          >
                            <span className="font-bold text-gray-700">
                              {key}:
                            </span>
                            <span className="text-red-500 line-through truncate max-w-[200px]">
                              {change.old || "null"}
                            </span>
                            <span className="text-gray-400 hidden sm:inline">
                              →
                            </span>
                            <span className="text-[#046C3F] truncate max-w-[200px]">
                              {change.new || "null"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
