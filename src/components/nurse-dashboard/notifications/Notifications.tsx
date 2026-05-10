"use client";

import { useState } from "react";
import {
  Bell,
  UserRound,
  CalendarClock,
  Info,
  X,
  Globe,
  Monitor,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import {
  useNotifications,
  useMarkNotificationRead,
  Notification,
} from "@/src/hooks/system/use-notifications";

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const NotificationDetailModal = ({
  notification,
  onClose,
  onMarkRead,
  isMarking,
}: any) => {
  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Activity Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <DetailItem
                icon={<UserRound size={16} />}
                label="Actor"
                value={notification.actor_name}
              />
              <DetailItem
                icon={<Globe size={16} />}
                label="Module"
                value={notification.module}
              />
              <DetailItem
                icon={<Monitor size={16} />}
                label="IP Address"
                value={notification.ip_address}
              />
            </div>
            <div className="space-y-4">
              <DetailItem
                icon={<ShieldCheck size={16} />}
                label="Action"
                value={notification.action}
                isBadge
              />
              <DetailItem
                icon={<CalendarClock size={16} />}
                label="Date"
                value={formatDate(notification.timestamp)}
              />
              <DetailItem
                icon={<Info size={16} />}
                label="Endpoint"
                value={notification.endpoint}
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">
              Changes Recorded
            </h3>
            <div className="space-y-3">
              {Object.entries(notification.changes || {}).map(
                ([key, val]: any) => (
                  <div
                    key={key}
                    className="text-sm border-b border-gray-200 pb-2 last:border-0"
                  >
                    <span className="font-semibold text-gray-600 uppercase text-[10px] block mb-1">
                      {key.replace("_", " ")}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="line-through text-red-500 bg-red-50 px-2 rounded">
                        {String(val.old ?? "none")}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-600 bg-green-50 px-2 rounded font-medium">
                        {String(val.new)}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex justify-end gap-3">
          {!notification.is_read && (
            <button
              onClick={() => onMarkRead(notification.id)}
              disabled={isMarking}
              className="flex items-center gap-2 rounded-xl bg-[#046C3F] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#035a34] disabled:opacity-50"
            >
              {isMarking ? "Processing..." : "Mark as Read"}
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value, isBadge }: any) => (
  <div className="flex gap-3">
    <div className="mt-1 text-[#046C3F]">{icon}</div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      {isBadge ? (
        <span className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-bold text-blue-600 border border-blue-100">
          {value}
        </span>
      ) : (
        <p className="text-sm font-medium text-gray-900 break-all">
          {value || "N/A"}
        </p>
      )}
    </div>
  </div>
);

export default function NurseNotifications() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const { data, isLoading } = useNotifications({
    page: currentPage,
    page_size: 10,
  });

  const markReadMutation = useMarkNotificationRead();

  const handleMarkRead = async (id: string) => {
    await markReadMutation.mutateAsync(id);
    setSelectedNotification(null);
  };

  const results = data?.results || [];

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
              System Activity
            </h1>
            <p className="mt-2 text-base text-[#3F3F46]">
              Track system changes and audit logs.
            </p>
          </div>
          {data?.stats?.unread !== undefined && data?.stats?.unread > 0 && (
            <span className="w-fit rounded-full bg-[#E8F7F0] px-4 py-2 text-sm font-semibold text-[#046C3F]">
              {data.stats.unread} unread activities
            </span>
          )}
        </div>

        <section className="overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#046C3F]" />
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Bell size={32} className="mb-3" />
              <p className="text-sm font-medium">No activity logs found</p>
            </div>
          ) : (
            <div>
              {results.map((item: Notification) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedNotification(item)}
                  className={`group flex cursor-pointer flex-col gap-4 border-b border-gray-100 px-6 py-5 last:border-b-0 sm:flex-row sm:items-center transition-all hover:bg-gray-50 ${
                    item.is_read ? "bg-white" : "bg-[#F4FBFC]"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.is_read ? "bg-gray-100 text-gray-500" : "bg-[#E8F7F0] text-[#046C3F]"}`}
                    >
                      <Monitor size={18} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {item.action}: {item.module}
                        </p>
                        {!item.is_read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                        Performed by {item.actor_name}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(item.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 group-hover:bg-white transition-colors">
                      <Info size={14} /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data?.total_pages && data.total_pages > 1 && (
            <div className="p-4 border-t border-gray-100">
              <Pagination
                currentPage={currentPage}
                totalPages={data.total_pages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </section>
      </div>

      <NotificationDetailModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onMarkRead={handleMarkRead}
        isMarking={markReadMutation.isPending}
      />
    </div>
  );
}
