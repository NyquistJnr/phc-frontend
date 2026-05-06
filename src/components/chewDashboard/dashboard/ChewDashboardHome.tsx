"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Users, ArrowRight, MoreHorizontal, CheckCircle2, Baby, Megaphone, Eye, Pencil, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

// ── Types & static data ───────────────────────────────────────────────────────

type FollowUpTag = "ANC Due" | "High risk" | "Postnatal" | "Urgent";
type ReminderColor = "green" | "orange" | "red";
type CampaignStatus = "Scheduled" | "In-Progress" | "Completed" | "Cancelled";

interface FollowUpItem {
  name: string; detail: string; date: string; tag: FollowUpTag;
}
interface ReminderItem {
  time: string; title: string; subtitle: string; color: ReminderColor;
}
interface CampaignRow {
  id: string; title: string; type: string; participants: string;
  startEnd: string; createdBy: string; status: CampaignStatus;
}

const FOLLOW_UPS: FollowUpItem[] = [
  { name: "Blessing Nwachukwu", detail: "28 weeks · 4th antenatal visit", date: "12 Sept 2026", tag: "ANC Due" },
  { name: "Blessing Nwachukwu", detail: "28 weeks · 4th antenatal visit", date: "12 Sept 2026", tag: "High risk" },
  { name: "Blessing Nwachukwu", detail: "28 weeks · 4th antenatal visit", date: "12 Sept 2026", tag: "Postnatal" },
  { name: "Blessing Nwachukwu", detail: "28 weeks · 4th antenatal visit", date: "12 Sept 2026", tag: "Urgent" },
  { name: "Blessing Nwachukwu", detail: "28 weeks · 4th antenatal visit", date: "12 Sept 2026", tag: "ANC Due" },
];

const TAG_STYLE: Record<FollowUpTag, React.CSSProperties> = {
  "ANC Due":  { background: "#E8F7F0", color: "#046C3F" },
  "High risk":{ background: "#FEF2F2", color: "#DC2626" },
  "Postnatal":{ background: "#EFF6FF", color: "#2563EB" },
  "Urgent":   { background: "#FFFBEB", color: "#B45309" },
};

const REMINDERS: ReminderItem[] = [
  { time: "11:00 AM", title: "Outreach scheduled", subtitle: "Hypertension screening", color: "green" },
  { time: "11:00 AM", title: "Outreach scheduled", subtitle: "Hypertension screening", color: "orange" },
  { time: "11:00 AM", title: "Outreach scheduled", subtitle: "Hypertension screening", color: "red" },
  { time: "11:00 AM", title: "Outreach scheduled", subtitle: "Hypertension screening", color: "green" },
  { time: "11:00 AM", title: "Outreach scheduled", subtitle: "Hypertension screening", color: "orange" },
];

const REMINDER_COLOR: Record<ReminderColor, string> = {
  green: "#046C3F", orange: "#F59E0B", red: "#DC2626",
};

const CAMPAIGNS: CampaignRow[] = [
  { id: "CAM-PLT-000234", title: "Malaria Preven...",  type: "Awareness",       participants: "1,383", startEnd: "12 Mar-14 Mar 2026", createdBy: "Chinaza Odoh",  status: "Scheduled" },
  { id: "CAM-PLT-000234", title: "Polio Immuniza...",  type: "Vaccination Drive",participants: "837",   startEnd: "12 Mar-14 Mar 2026", createdBy: "Festus Ayo",    status: "In-Progress" },
  { id: "CAM-PLT-000234", title: "Maternal Nutrit...", type: "Screening",        participants: "2,037", startEnd: "12 Mar-14 Mar 2026", createdBy: "Jennifer Ani",  status: "Completed" },
  { id: "CAM-PLT-000234", title: "Hypertension s...",  type: "Education",        participants: "287",   startEnd: "12 Mar-14 Mar 2026", createdBy: "Abubaka Adam",  status: "Cancelled" },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",        participants: "746",   startEnd: "12 Mar-14 Mar 2026", createdBy: "Abubaka Adam",  status: "In-Progress" },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",        participants: "3,937", startEnd: "12 Mar-14 Mar 2026", createdBy: "Abubaka Adam",  status: "Scheduled" },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",        participants: "109",   startEnd: "12 Mar-14 Mar 2026", createdBy: "Abubaka Adam",  status: "Cancelled" },
];

const STATUS_STYLE: Record<CampaignStatus, React.CSSProperties> = {
  Scheduled:   { background: "#EFF6FF", color: "#2563EB" },
  "In-Progress":{ background: "#E8F7F0", color: "#046C3F" },
  Completed:   { background: "#F0FDF4", color: "#15803D" },
  Cancelled:   { background: "#FEF2F2", color: "#DC2626" },
};

const TABLE_HEADERS = ["Campaign ID", "Activity Title", "Type", "Expt. Participants", "Start/End Date", "Created by", "Status", "Action"];

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, featured }: {
  label: string; value: string; icon?: React.ReactNode; featured?: boolean;
}) {
  return (
    <div
      className="rounded-2xl px-5 py-4 flex flex-col gap-3"
      style={featured ? { background: "#046C3F" } : { background: "#fff", border: "1px solid #F3F4F6" }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={featured ? { background: "rgba(255,255,255,0.2)" } : { background: "#F3F4F6" }}
        >
          {icon}
        </div>
        <PeriodFilterButton label="This Week" textColor={featured ? "rgba(255,255,255,0.85)" : undefined} />
      </div>
      <div>
        <p className="text-xs font-medium mb-1" style={featured ? { color: "rgba(255,255,255,0.75)" } : { color: "#9CA3AF" }}>{label}</p>
        <p className="text-2xl font-bold" style={featured ? { color: "#fff" } : { color: "#111827" }}>{value}</p>
      </div>
    </div>
  );
}

// ── Campaign action menu ──────────────────────────────────────────────────────

function CampaignActionMenu({ onView, onEdit }: { onView: () => void; onEdit: () => void }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: Math.max(8, rect.right - 180) });
    }
    setOpen(o => !o);
  };

  const items: { label: string; icon: React.ReactNode; action: () => void }[] = [
    { label: "View",   icon: <Eye size={14} />,    action: () => { onView(); setOpen(false); } },
    { label: "Edit",   icon: <Pencil size={14} />, action: () => { onEdit(); setOpen(false); } },
    { label: "Export", icon: <Upload size={14} />, action: () => setOpen(false) },
  ];

  return (
    <>
      <button ref={btnRef} onClick={toggle} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 outline-none focus:outline-none">
        <MoreHorizontal size={16} />
      </button>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: 180, zIndex: 9999 }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1">
          {items.map(({ label, icon, action }) => (
            <button key={label} onClick={action}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
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

export default function ChewDashboardHome() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const breadcrumbs = [{ label: "Dashboard", active: true }];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Dashboard" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-6">

        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, Adaeze</h1>
          <p className="text-sm text-gray-500 mt-1">Here&apos;s your community health overview for today.</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          <StatCard label="New Registrations"  value="1,384" featured
            icon={<Users size={18} color="#fff" />} />
          <StatCard label="Community Visits"   value="135"
            icon={<CheckCircle2 size={18} color="#6B7280" />} />
          <StatCard label="Maternal Follow-ups" value="346"
            icon={<Baby size={18} color="#6B7280" />} />
          <StatCard label="Health Promotion"   value="3,843"
            icon={<Megaphone size={18} color="#6B7280" />} />
        </div>

        {/* Two-column: follow-ups + reminders */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

          {/* Upcoming maternal follow-ups */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-gray-800">Upcoming maternal follow-ups</h2>
              <Link href="/chew-dashboard/maternal-followups"
                className="flex items-center gap-1 text-xs font-semibold text-[#046C3F] hover:underline">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <p className="text-xs text-gray-400 mb-4">Patients to visit this week</p>
            <div className="space-y-3">
              {FOLLOW_UPS.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name} · ANC visit due today</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-xs text-gray-400">{item.detail}</p>
                      <span className="text-xs text-gray-300">·</span>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-lg shrink-0 whitespace-nowrap" style={TAG_STYLE[item.tag]}>
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's reminders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Today&apos;s reminders</h2>
            <div className="space-y-2">
              {REMINDERS.map((r, i) => (
                <div key={i} className="flex gap-3 pl-3 py-2.5 rounded-lg bg-gray-50/60"
                  style={{ borderLeft: `3px solid ${REMINDER_COLOR[r.color]}` }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500">{r.time}</p>
                    <p className="text-sm font-bold text-gray-800">{r.title}</p>
                    <p className="text-xs text-gray-400">{r.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent health promotion activities */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Recent health promotion activities</h2>
            <Link href="/chew-dashboard/health-promotion"
              className="flex items-center gap-1 text-xs font-semibold text-[#046C3F] hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[860px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {TABLE_HEADERS.map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      <span className="flex items-center gap-1">{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CAMPAIGNS.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-600 font-medium">{row.id}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{row.title}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.type}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.participants}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.startEnd}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.createdBy}</td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap" style={STATUS_STYLE[row.status]}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <CampaignActionMenu
                        onView={() => router.push("/chew-dashboard/health-promotion?view=view-activity")}
                        onEdit={() => router.push("/chew-dashboard/health-promotion?view=edit-activity")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={68} onPageChange={setPage} />
        </div>

      </div>
    </div>
  );
}
