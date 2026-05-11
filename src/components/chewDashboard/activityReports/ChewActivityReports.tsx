"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search, ChevronDown, ChevronUp, Check, MoreHorizontal,
  BarChart2, Eye, Upload, X, Calendar, Clock, Activity,
  Users, Heart, Megaphone,
} from "lucide-react";
import ChewDashboardHeader from "@/src/components/chewDashboard/generics/ChewDashboardHeader";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────────

type ActivityStatus = "Completed" | "Pending" | "Approved" | "Submitted";

interface ActivityRow {
  id: string; type: string; description: string;
  date: string; performedBy: string; status: ActivityStatus;
}

// ── Static data ───────────────────────────────────────────────────────────────

const TYPE_OPTIONS   = ["Patient Registration", "Maternal Follow-up", "Appointment", "Health Promotion", "Post Activity"];
const STATUS_OPTIONS = ["Completed", "Pending", "Approved", "Submitted"];

const ACTIVITIES: ActivityRow[] = [
  { id: "PAT-PLT-000234", type: "Patient Registration", description: "New patient registered",  date: "14 Mar 2026", performedBy: "Nurse Agnes", status: "Completed" },
  { id: "PAT-PLT-000234", type: "Maternal Follow-up",   description: "ANC visit completed",     date: "14 Mar 2026", performedBy: "Amara Ezeh",  status: "Pending"   },
  { id: "CAM-PLT-000234", type: "Health Promotion",     description: "Malaria awareness talk",  date: "14 Mar 2026", performedBy: "Dolapo Ayo",  status: "Approved"  },
  { id: "CAM-PLT-000234", type: "Post Activity",        description: "Malaria awareness talk",  date: "14 Mar 2026", performedBy: "Hakeem Ade",  status: "Submitted" },
  { id: "PAT-PLT-000234", type: "Appointment",          description: "Appointment created",     date: "14 Mar 2026", performedBy: "Nurse Agnes", status: "Submitted" },
  { id: "PAT-PLT-000234", type: "Patient Registration", description: "New patient registered",  date: "14 Mar 2026", performedBy: "Nurse Agnes", status: "Completed" },
  { id: "PAT-PLT-000234", type: "Patient Registration", description: "New patient registered",  date: "14 Mar 2026", performedBy: "Nurse Agnes", status: "Pending"   },
  { id: "PAT-PLT-000234", type: "Patient Registration", description: "New patient registered",  date: "14 Mar 2026", performedBy: "Nurse Agnes", status: "Approved"  },
  { id: "PAT-PLT-000234", type: "Patient Registration", description: "New patient registered",  date: "14 Mar 2026", performedBy: "Nurse Agnes", status: "Approved"  },
  { id: "PAT-PLT-000234", type: "Patient Registration", description: "New patient registered",  date: "14 Mar 2026", performedBy: "Nurse Agnes", status: "Approved"  },
];

const STATUS_STYLES: Record<ActivityStatus, { bg: string; color: string }> = {
  Completed: { bg: "#ECFDF5", color: "#059669" },
  Pending:   { bg: "#FEF9C3", color: "#B45309" },
  Approved:  { bg: "#D1FAE5", color: "#046C3F" },
  Submitted: { bg: "#DBEAFE", color: "#2563EB" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcCoords(rect: DOMRect, w: number, estimatedH: number, rightAlign = false) {
  const spaceBelow = window.innerHeight - rect.bottom - 8;
  const spaceAbove = rect.top - 8;
  const fits = spaceBelow >= Math.min(estimatedH, 200);
  const maxH = fits ? Math.min(spaceBelow, estimatedH) : Math.min(spaceAbove, estimatedH);
  const top  = fits ? rect.bottom + 4 : Math.max(8, rect.top - maxH - 4);
  const left = rightAlign
    ? Math.max(8, rect.right - w)
    : Math.max(8, Math.min(rect.left, window.innerWidth - w - 8));
  return { top, left, maxH };
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ActivityStatus }) {
  const { bg, color } = STATUS_STYLES[status];
  return (
    <span style={{ background: bg, color, borderRadius: 9999, padding: "3px 10px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

// ── Stat card period selector ─────────────────────────────────────────────────

// ── Modal form components (disabled / read-only) ──────────────────────────────

function FormField({ label, value, icon, disabled = true }: {
  label: string; value: string; icon?: React.ReactNode; disabled?: boolean;
}) {
  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: "10px 14px", background: "#F9FAFB" }}>
      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {icon && <span style={{ color: "#9CA3AF", flexShrink: 0 }}>{icon}</span>}
        <input value={value} disabled={disabled} readOnly
          style={{ width: "100%", fontSize: 13, color: "#6B7280", background: "transparent", outline: "none", border: "none", cursor: "default" }} />
      </div>
    </div>
  );
}

function FormTextarea({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: "10px 14px", background: "#F9FAFB" }}>
      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{label}</p>
      <textarea value={value} disabled readOnly rows={3}
        style={{ width: "100%", fontSize: 13, color: "#6B7280", background: "transparent", outline: "none", border: "none", resize: "none", cursor: "default" }} />
    </div>
  );
}

function FormSelect({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: "10px 14px", background: "#F9FAFB", cursor: "default" }}>
      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: "#6B7280" }}>{value}</span>
        <ChevronDown size={14} style={{ color: "#D1D5DB", flexShrink: 0 }} />
      </div>
    </div>
  );
}

function NumberStepperView({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, background: "#F9FAFB", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "stretch" }}>
        <div style={{ flex: 1, padding: "10px 14px" }}>
          <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{label}</p>
          <span style={{ fontSize: 13, color: "#6B7280" }}>{value}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", borderLeft: "1px solid #E5E7EB" }}>
          <div style={{ flex: 1, padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #E5E7EB" }}>
            <ChevronUp size={12} style={{ color: "#D1D5DB" }} />
          </div>
          <div style={{ flex: 1, padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronDown size={12} style={{ color: "#D1D5DB" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Checkbox filter dropdown (multi-select) ───────────────────────────────────

function CheckboxFilterDropdown({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen]       = useState(false);
  const [coords, setCoords]   = useState({ top: 0, left: 0, maxH: 300 });
  const [mounted, setMounted] = useState(false);
  const btnRef  = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const W = Math.max(190, Math.max(...options.map(o => o.length)) * 8 + 72);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current  && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current)
      setCoords(calcCoords(btnRef.current.getBoundingClientRect(), W, options.length * 44 + 16, true));
    setOpen(o => !o);
  };

  const toggleOption = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  };

  const displayLabel = selected.length === 0 ? label : `${label.replace("All ", "")} (${selected.length})`;

  return (
    <>
      <button ref={btnRef} onClick={toggle}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-gray-300 bg-white transition-colors whitespace-nowrap">
        {displayLabel} <ChevronDown size={13} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: W, maxHeight: coords.maxH, zIndex: 9999 }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          <div style={{ overflowY: "auto" }} className="py-1.5 px-1.5">
            {options.map(opt => (
              <button key={opt} onClick={() => toggleOption(opt)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                  style={selected.includes(opt) ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}>
                  {selected.includes(opt) && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                {opt}
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Action menu ───────────────────────────────────────────────────────────────

function ActionMenu({ onViewAppt, onViewPost }: {
  onViewAppt: () => void; onViewPost: () => void;
}) {
  const [open, setOpen]       = useState(false);
  const [coords, setCoords]   = useState({ top: 0, left: 0, maxH: 300 });
  const [mounted, setMounted] = useState(false);
  const btnRef  = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const W = 190;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current  && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current)
      setCoords(calcCoords(btnRef.current.getBoundingClientRect(), W, 3 * 44 + 16, true));
    setOpen(o => !o);
  };

  const items: { label: string; icon: React.ReactNode; action: () => void }[] = [
    { label: "View Appointment",   icon: <Eye size={14} />,    action: () => { onViewAppt(); setOpen(false); } },
    { label: "View Post Activity", icon: <Eye size={14} />,    action: () => { onViewPost(); setOpen(false); } },
    { label: "Export",             icon: <Upload size={14} />, action: () => setOpen(false) },
  ];

  return (
    <>
      <button ref={btnRef} onClick={toggle}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
        <MoreHorizontal size={16} />
      </button>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: W, zIndex: 9999 }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1.5 px-1.5">
          {items.map(item => (
            <button key={item.label} onClick={item.action}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
              <span className="text-gray-500">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}

// ── View Appointment modal ────────────────────────────────────────────────────

function ViewAppointmentModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9998,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}>
      {/* Relative wrapper so X sits outside the card */}
      <div style={{ position: "relative", maxWidth: 560, width: "100%" }}
        onClick={e => e.stopPropagation()}>

        {/* X close button — outside the white card */}
        <button onClick={onClose}
          style={{ position: "absolute", top: -12, right: -12, zIndex: 1, width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", background: "#fff", color: "#6B7280",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
          <X size={14} />
        </button>

        <div style={{ background: "#fff", borderRadius: 16, maxHeight: "88vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#E8F7F0",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calendar size={16} color="#046C3F" />
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>View appointment</h2>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#046C3F",
            color: "#fff", borderRadius: 10, padding: "7px 14px", fontSize: 13, fontWeight: 600 }}>
            <Upload size={13} /> Export
          </button>
        </div>

        {/* Form content */}
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Patient Name"   value="Melvin Ojobo"     icon={<Search size={13} />} />
            <FormField label="Patient ID"     value="PAT-PLT-000234" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Encounter ID"   value="ENC-PLT-000234" />
            <FormField label="Appointment ID" value="APT-PLT-000234" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Date" value="12/12/2020" icon={<Calendar size={13} />} />
            <FormField label="Time" value="12:00 PM"   icon={<Clock size={13} />} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormSelect label="Visit Type"   value="Consultation" />
            <FormSelect label="Assigned To"  value="Dr Festus" />
          </div>
          <FormTextarea label="Reason for Visit"  value="Filled" />
          <FormTextarea label="Notes (Optional)"  value="Filled" />
        </div>
        </div> {/* white card */}
      </div>   {/* wrapper */}
    </div>,
    document.body,
  );
}

// ── View Post Activity modal ──────────────────────────────────────────────────

function ViewPostActivityModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9998,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}>
      {/* Relative wrapper so X sits outside the card */}
      <div style={{ position: "relative", maxWidth: 560, width: "100%" }}
        onClick={e => e.stopPropagation()}>

        {/* X close button — outside the white card */}
        <button onClick={onClose}
          style={{ position: "absolute", top: -12, right: -12, zIndex: 1, width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", background: "#fff", color: "#6B7280",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
          <X size={14} />
        </button>

        <div style={{ background: "#fff", borderRadius: 16, maxHeight: "88vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#E8F7F0",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={16} color="#046C3F" />
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>View post activity</h2>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#046C3F",
            color: "#fff", borderRadius: 10, padding: "7px 14px", fontSize: 13, fontWeight: 600 }}>
            <Upload size={13} /> Export
          </button>
        </div>

        {/* Form content */}
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Section 1: activity details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Campaign ID"      value="CAM-PLT-000234" />
            <FormField label="Activity Title"   value="Malaria Prevention" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormSelect label="Type"     value="Education" />
            <FormField  label="Location" value="Gwagwalada" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField         label="Target audience"        value="Pregnant women" />
            <NumberStepperView label="Expected Participants"  value={80} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Start Date" value="12/12/2026" icon={<Calendar size={13} />} />
            <FormField label="End Date"   value="12/12/2026" icon={<Calendar size={13} />} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormSelect label="Created by" value="Agnes Eze" />
            <FormSelect label="Assign to"  value="Agnes Eze" />
          </div>
          <FormTextarea label="Description" value="Filled" />

          {/* Section 2: Participation Data */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 8,
            borderTop: "1px solid #F3F4F6" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#E8F7F0",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={14} color="#046C3F" />
            </div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Participation Data</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <NumberStepperView label="Number of Participants" value={78} />
            <NumberStepperView label="Male Count"             value={34} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <NumberStepperView label="Female Count" value={24} />
            {/* Follow-up checkbox (checked, read-only) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: "#046C3F", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={10} color="#fff" strokeWidth={3} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Follow up</span>
              </div>
              <p style={{ fontSize: 11, color: "#9CA3AF", paddingLeft: 26 }}>Referrals Made</p>
            </div>
          </div>
          <FormTextarea label="Key Messages Delivered" value="Filled" />
          <FormTextarea label="Outcome Summary"        value="Filled" />
          <FormTextarea label="Challenges"             value="Filled" />
        </div>
        </div> {/* white card */}
      </div>   {/* wrapper */}
    </div>,
    document.body,
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ChewActivityReports() {
  const [page,             setPage]             = useState(1);
  const [selectedTypes,    setSelectedTypes]    = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showApptModal,    setShowApptModal]    = useState(false);
  const [showPostModal,    setShowPostModal]    = useState(false);

  return (
    <>
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <ChewDashboardHeader
        title="Activity Reports"
        breadcrumbs={[{ label: "Activity Reports", active: true }]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">CHEW activity reports</h1>
          <p className="text-sm text-gray-500 mt-1">Community activity reports</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {[
            { label: "Total activities",    value: "67",    featured: true,  icon: <BarChart2 size={16} color="#fff" /> },
            { label: "Patients reached",    value: "2,344", featured: false, icon: <Users size={16} color="#6B7280" /> },
            { label: "Maternal Follow-ups", value: "435",   featured: false, icon: <Heart size={16} color="#6B7280" /> },
            { label: "Community visits",    value: "376",   featured: false, icon: <Megaphone size={16} color="#6B7280" /> },
          ].map(({ label, value, featured, icon }) => (
            <div key={label} className="rounded-2xl border border-gray-100 shadow-sm px-5 py-4"
              style={{ background: featured ? "#046C3F" : "#fff" }}>
              <div className="flex items-start justify-between mb-3">
                <div style={{ width: 32, height: 32, borderRadius: "50%",
                  background: featured ? "rgba(255,255,255,0.2)" : "#F3F4F6",
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {icon}
                </div>
                <PeriodFilterButton label="This Week" textColor={featured ? "#fff" : undefined} />
              </div>
              <p className="text-xs font-medium mb-1"
                style={{ color: featured ? "rgba(255,255,255,0.75)" : "#9CA3AF" }}>{label}</p>
              <p className="text-2xl font-bold"
                style={{ color: featured ? "#fff" : "#111827" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <h2 className="text-sm font-bold text-gray-800">Activity Report</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input placeholder="Search by Activity title or ID..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-60" />
              </div>
              <PeriodFilterButton label="Date Range" />
              <CheckboxFilterDropdown label="All Type"   options={TYPE_OPTIONS}
                selected={selectedTypes}    onChange={setSelectedTypes} />
              <CheckboxFilterDropdown label="All Status" options={STATUS_OPTIONS}
                selected={selectedStatuses} onChange={setSelectedStatuses} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-205">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Reference ID", "Activity Type", "Description", "Date", "Performed By", "Status", "Action"].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h !== "Action"
                        ? <span className="flex items-center gap-1">{h} <ChevronDown size={11} className="opacity-50" /></span>
                        : h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ACTIVITIES.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-600 font-medium whitespace-nowrap">{row.id}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{row.type}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.description}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.date}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.performedBy}</td>
                    <td className="px-5 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-5 py-3">
                      <ActionMenu
                        onViewAppt={() => setShowApptModal(true)}
                        onViewPost={() => setShowPostModal(true)}
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

    {showApptModal  && <ViewAppointmentModal  onClose={() => setShowApptModal(false)} />}
    {showPostModal  && <ViewPostActivityModal onClose={() => setShowPostModal(false)} />}
    </>
  );
}
