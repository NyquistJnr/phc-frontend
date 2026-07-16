"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Users,
  ArrowRight,
  MoreHorizontal,
  CheckCircle2,
  Baby,
  Megaphone,
  Eye,
  Pencil,
  Upload,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChewDashboardHeader from "@/src/components/chewDashboard/generics/ChewDashboardHeader";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import { useUpcomingFollowUps } from "@/src/hooks/nurses/use-maternal-care";
import type { UpcomingFollowUpTag } from "@/src/components/nurse-dashboard/maternal-care/type";
import { useChewStats, useHealthPromotionsToday } from "@/src/hooks/nurses/use-chew-analytics";
import { useHealthPromotions } from "@/src/hooks/nurses/use-health-promotions";

// ── Types & static data ───────────────────────────────────────────────────────

type ReminderColor = "green" | "orange" | "red";
type CampaignStatus = "Scheduled" | "In-Progress" | "Completed" | "Cancelled";

interface ReminderItem {
  time: string;
  title: string;
  subtitle: string;
  color: ReminderColor;
}
interface CampaignRow {
  id: string;
  title: string;
  type: string;
  participants: string;
  startEnd: string;
  createdBy: string;
  status: CampaignStatus;
}

const TAG_STYLE: Record<UpcomingFollowUpTag, React.CSSProperties> = {
  "ANC Due": { background: "#E8F7F0", color: "#046C3F" },
  "High risk": { background: "#FEF2F2", color: "#DC2626" },
  Postnatal: { background: "#EFF6FF", color: "#2563EB" },
  Urgent: { background: "#FFFBEB", color: "#B45309" },
};

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  SCHEDULED: { background: "#EFF6FF", color: "#2563EB" },
  "IN_PROGRESS": { background: "#E8F7F0", color: "#046C3F" },
  COMPLETED: { background: "#F0FDF4", color: "#15803D" },
  CANCELLED: { background: "#FEF2F2", color: "#DC2626" },
  DRAFT: { background: "#F3F4F6", color: "#6B7280" }
};

const TABLE_HEADERS = [
  "Campaign ID",
  "Activity Title",
  "Type",
  "Expt. Participants",
  "Start/End Date",
  "Created by",
  "Status",
  "Action",
];

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  featured,
  onChange,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  featured?: boolean;
  onChange?: (start?: string, end?: string) => void;
}) {
  return (
    <div
      className="rounded-2xl px-5 py-4 flex flex-col gap-3"
      style={
        featured
          ? { background: "#046C3F" }
          : { background: "#fff", border: "1px solid #F3F4F6" }
      }
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={
            featured
              ? { background: "rgba(255,255,255,0.2)" }
              : { background: "#F3F4F6" }
          }
        >
          {icon}
        </div>
        <PeriodFilterButton
          label="This Week"
          textColor={featured ? "rgba(255,255,255,0.85)" : undefined}
          onChange={onChange}
        />
      </div>
      <div>
        <p
          className="text-xs font-medium mb-1"
          style={
            featured
              ? { color: "rgba(255,255,255,0.75)" }
              : { color: "#9CA3AF" }
          }
        >
          {label}
        </p>
        <p
          className="text-2xl font-bold"
          style={featured ? { color: "#fff" } : { color: "#111827" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Campaign action menu ──────────────────────────────────────────────────────

function CampaignActionMenu({
  onView,
  onEdit,
}: {
  onView: () => void;
  onEdit: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      )
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: Math.max(8, rect.right - 180) });
    }
    setOpen((o) => !o);
  };

  const items: { label: string; icon: React.ReactNode; action: () => void }[] =
    [
      {
        label: "View",
        icon: <Eye size={14} />,
        action: () => {
          onView();
          setOpen(false);
        },
      },
      {
        label: "Edit",
        icon: <Pencil size={14} />,
        action: () => {
          onEdit();
          setOpen(false);
        },
      },
      {
        label: "Export",
        icon: <Upload size={14} />,
        action: () => setOpen(false),
      },
    ];

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 outline-none focus:outline-none"
      >
        <MoreHorizontal size={16} />
      </button>
      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: 180,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1"
          >
            {items.map(({ label, icon, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-400">{icon}</span>
                {label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function formatFollowUpDate(dateString: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ChewDashboardHome() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const breadcrumbs = [{ label: "Dashboard", active: true }];

  const { data: followUpsData, isLoading: isLoadingFollowUps } =
    useUpcomingFollowUps({
      days: 104,
      page: 1,
      page_size: 6,
    });
  const followUps = followUpsData?.results || [];

  const [statsStartDate, setStatsStartDate] = useState<string | undefined>();
  const [statsEndDate, setStatsEndDate] = useState<string | undefined>();
  const { data: chewStats } = useChewStats(statsStartDate, statsEndDate);
  
  const { data: todayPromotions } = useHealthPromotionsToday();
  const { data: promotionsData, isLoading: isLoadingPromotions } = useHealthPromotions({ page, page_size: 10 });
  const promotions = promotionsData?.results || [];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <ChewDashboardHeader title="Dashboard" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, Adaeze
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here&apos;s your community health overview for today.
          </p>
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          <StatCard
            label="New Registrations"
            value={chewStats?.new_registrations?.toLocaleString() || "0"}
            featured
            icon={<Users size={18} color="#fff" />}
            onChange={(start, end) => { setStatsStartDate(start); setStatsEndDate(end); }}
          />
          <StatCard
            label="Community Visits"
            value={chewStats?.community_visits?.toLocaleString() || "0"}
            icon={<CheckCircle2 size={18} color="#6B7280" />}
            onChange={(start, end) => { setStatsStartDate(start); setStatsEndDate(end); }}
          />
          <StatCard
            label="Maternal Follow-ups"
            value={chewStats?.maternal_follow_ups?.toLocaleString() || "0"}
            icon={<Baby size={18} color="#6B7280" />}
            onChange={(start, end) => { setStatsStartDate(start); setStatsEndDate(end); }}
          />
          <StatCard
            label="Health Promotion"
            value={chewStats?.health_promotions?.toLocaleString() || "0"}
            icon={<Megaphone size={18} color="#6B7280" />}
            onChange={(start, end) => { setStatsStartDate(start); setStatsEndDate(end); }}
          />
        </div>

        {/* Two-column: follow-ups + reminders */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          {/* Upcoming maternal follow-ups */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-gray-800">
                Upcoming maternal follow-ups
              </h2>
              <Link
                href="/chew-dashboard/maternal-followups"
                className="flex items-center gap-1 text-xs font-semibold text-[#046C3F] hover:underline"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Patients to visit this week
            </p>
            {isLoadingFollowUps ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="animate-spin text-[#046C3F]" />
              </div>
            ) : followUps.length > 0 ? (
              <div className="space-y-3">
                {followUps.map((item) => (
                  <div
                    key={item.visit_id}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <p className="text-xs text-gray-400">{item.subtitle}</p>
                        <span className="text-xs text-gray-300">·</span>
                        <p className="text-xs text-gray-400">
                          {formatFollowUpDate(item.next_visit_date)}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-lg shrink-0 whitespace-nowrap"
                      style={TAG_STYLE[item.tag]}
                    >
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-xs text-gray-400">
                No upcoming follow-ups in the next 7 days.
              </p>
            )}
          </div>

          {/* Today's reminders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">
              Today&apos;s reminders
            </h2>
            <div className="space-y-2">
              {todayPromotions?.map((p: any, i: number) => {
                const colorKey = i % 3 === 0 ? "green" : i % 3 === 1 ? "orange" : "red";
                const date = new Date(p.date_and_time);
                const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div
                    key={i}
                    className="flex gap-3 pl-3 py-2.5 rounded-lg bg-gray-50/60 border-l-[3px]"
                    style={{ borderColor: colorKey === "green" ? "#046C3F" : colorKey === "orange" ? "#F59E0B" : "#DC2626" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500">
                        {time}
                      </p>
                      <p className="text-sm font-bold text-gray-800">{p.title}</p>
                      <p className="text-xs text-gray-400">{p.type} • {p.assigned_staffs?.join(", ") || "Unassigned"}</p>
                    </div>
                  </div>
                );
              })}
              {(!todayPromotions || todayPromotions.length === 0) && (
                <p className="text-xs text-gray-400 text-center py-4">No reminders for today</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent health promotion activities */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">
              Recent health promotion activities
            </h2>
            <Link
              href="/chew-dashboard/health-promotion"
              className="flex items-center gap-1 text-xs font-semibold text-[#046C3F] hover:underline"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[860px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {TABLE_HEADERS.map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1">{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoadingPromotions ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-gray-400 text-sm">
                      <Loader2 size={20} className="animate-spin text-[#046C3F] mx-auto mb-2" />
                      Loading activities...
                    </td>
                  </tr>
                ) : promotions.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-600 font-medium">
                      {row.promotion_id || row.id?.substring(0,8)}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {row.title}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {row.type}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {row.expected_participants}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(row.start_date).toLocaleDateString()} - {new Date(row.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {row.created_by_name || "System"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
                        style={STATUS_STYLE[row.status] || { background: "#F3F4F6", color: "#6B7280" }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <CampaignActionMenu
                        onView={() =>
                          router.push(
                            `/chew-dashboard/health-promotion?view=view-activity&id=${row.id}`,
                          )
                        }
                        onEdit={() =>
                          router.push(
                            `/chew-dashboard/health-promotion?view=edit-activity&id=${row.id}`,
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={page}
            totalPages={Math.max(1, Math.ceil((promotionsData?.count || 0) / 10))}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
