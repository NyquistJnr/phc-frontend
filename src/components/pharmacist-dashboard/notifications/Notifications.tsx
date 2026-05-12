"use client";

import { useState } from "react";
import { Activity, Bell, CheckCircle2, Loader2 } from "lucide-react";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import PharmacistBackButton from "@/src/components/pharmacist-dashboard/generics/PharmacistBackButton";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import {
  Notification,
  useMarkNotificationRead,
  useNotifications,
} from "@/src/hooks/useNotifications";

const ITEMS_PER_PAGE = 10;

const formatDateTime = (isoString: string) => {
  if (!isoString) return "N/A";
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

export default function PharmacistNotifications() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useNotifications(currentPage, ITEMS_PER_PAGE);
  const markReadMutation = useMarkNotificationRead();

  const notifications = data?.results || [];
  const totalPages = data?.total_pages || 1;
  const unreadCount = data?.stats?.unread || 0;

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Notifications"
        breadcrumbs={[{ label: "Notifications" }]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <PharmacistBackButton />
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black sm:text-3xl">
              Notifications
            </h1>
            <p className="mt-2 text-base text-[#3F3F46]">
              Pharmacy alerts, prescription updates, and system notifications.
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="w-fit rounded-full bg-[#E8F7F0] px-4 py-2 text-sm font-semibold text-[#046C3F]">
              {unreadCount} unread
            </span>
          )}
        </div>

        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-50 bg-gray-50/30 px-5 py-4">
            <h2 className="font-bold text-gray-700">Notification Feed</h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Loader2 className="mb-4 animate-spin text-[#046C3F]" size={32} />
              <p className="text-sm font-medium">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                <Bell size={28} className="text-gray-300" />
              </div>
              <p className="text-base font-semibold text-gray-600">
                No notifications found
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className={`flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-gray-50 sm:flex-row sm:items-start ${
                    notification.is_read ? "bg-white" : "bg-[#F4FBFC]"
                  }`}
                >
                  <span
                    className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      notification.is_read
                        ? "bg-gray-100 text-gray-400"
                        : "bg-[#E8F7F0] text-[#046C3F]"
                    }`}
                  >
                    <Activity size={18} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p
                        className={`text-base leading-snug ${
                          notification.is_read
                            ? "font-medium text-gray-700"
                            : "font-semibold text-gray-900"
                        }`}
                      >
                        <span className="text-[#046C3F]">
                          {notification.actor_name}
                        </span>{" "}
                        performed{" "}
                        <span className="mx-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs uppercase tracking-wider">
                          {notification.action}
                        </span>{" "}
                        in {notification.module}.
                      </p>

                      {!notification.is_read && (
                        <button
                          type="button"
                          disabled={markReadMutation.isPending}
                          onClick={() => markReadMutation.mutate(notification.id)}
                          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:border-[#A6E1C4] hover:bg-[#E8F7F0] hover:text-[#046C3F] disabled:opacity-50"
                        >
                          <CheckCircle2 size={14} />
                          Mark as read
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                      <span>{formatDateTime(notification.timestamp)}</span>
                      {notification.ip_address && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span className="rounded bg-gray-100 px-2 py-0.5 font-mono">
                            IP: {notification.ip_address}
                          </span>
                        </>
                      )}
                      {notification.facility_name && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span>{notification.facility_name}</span>
                        </>
                      )}
                    </div>
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
        </section>
      </div>
    </div>
  );
}
