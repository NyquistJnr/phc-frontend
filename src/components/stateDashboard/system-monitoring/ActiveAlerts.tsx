"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import { useActiveAlerts, ActiveAlert, AlertSeverity } from "@/src/hooks/state/use-alerts";

const ITEMS_PER_PAGE = 10;

export function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export function severityStyles(severity: AlertSeverity) {
  switch (severity) {
    case "CRITICAL":
      return { border: "border-l-red-500", bg: "bg-red-50/60", title: "text-red-700", badge: "bg-[#FEE2E2] text-[#DC2626]" };
    case "HIGH":
      return { border: "border-l-orange-500", bg: "bg-orange-50/60", title: "text-orange-700", badge: "bg-[#FFF5EB] text-[#F97316]" };
    case "MEDIUM":
    default:
      return { border: "border-l-amber-400", bg: "bg-amber-50/60", title: "text-amber-700", badge: "bg-[#FFF3CD] text-[#B45309]" };
  }
}

function AlertCard({ alert }: { alert: ActiveAlert }) {
  const styles = severityStyles(alert.severity);
  return (
    <div className={`p-4 sm:p-5 rounded-xl border-l-4 ${styles.border} ${styles.bg}`}>
      <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${styles.badge}`}>
            {alert.severity}
          </span>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            {alert.type.replaceAll("_", " ")}
          </span>
        </div>
        <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
          {timeAgo(alert.detected_at)}
        </span>
      </div>
      <p className="text-sm font-bold text-gray-900 leading-snug">{alert.title}</p>
      <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
      {(alert.facility_name || alert.threshold_value !== null) && (
        <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11px] text-gray-500 font-medium">
          {alert.facility_name && <span>Facility: {alert.facility_name}</span>}
          {alert.threshold_value !== null && (
            <span>
              {alert.metric_value} / {alert.threshold_value} threshold
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function ActiveAlerts() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useActiveAlerts({ page: currentPage, pageSize: ITEMS_PER_PAGE });

  const alerts = data?.results || [];
  const totalPages = data?.total_pages || 1;

  const breadcrumbs = [
    { label: "System Monitoring" },
    { label: "Active Alerts", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="System Monitoring" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Active Alerts</h1>
          <p className="text-gray-600 text-sm">
            Live snapshot of disease, security, and system alerts across the state
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-6 flex items-center gap-3 border-b border-gray-50">
            <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center">
              <AlertTriangle size={18} className="text-[#046C3F]" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">
              {isLoading ? "Alerts" : `${data?.count ?? 0} Alert${data?.count === 1 ? "" : "s"}`}
            </h3>
          </div>

          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
                <p className="text-sm font-medium">Loading alerts...</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-sm text-gray-400 font-medium">No active alerts.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <AlertCard key={`${alert.type}-${alert.detected_at}-${i}`} alert={alert} />
                ))}
              </div>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
