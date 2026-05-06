"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import {
  Search, Plus, ChevronDown, ChevronUp, Check, ArrowLeft,
  Calendar, X, TrendingUp, MoreHorizontal, Eye, Save,
  Pencil, Upload, RefreshCw, Send,
} from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────────

type CampaignStatus = "Scheduled" | "In-Progress" | "Completed" | "Cancelled";
type PostReportStatus = "Draft" | "Submitted" | "Approved" | "Rejected";

interface CampaignRow {
  id: string; title: string; type: string; participants: string;
  startEnd: string; createdBy: string; status: CampaignStatus;
}
interface PostActivityRow {
  id: string; title: string; type: string; participants: string;
  startEnd: string; outcome: string; status: PostReportStatus;
}

// ── Static data ───────────────────────────────────────────────────────────────

const CAMPAIGNS: CampaignRow[] = [
  { id: "CAM-PLT-000234", title: "Malaria Preven...",  type: "Awareness",        participants: "1,383", startEnd: "12 Mar-14 Mar 2026", createdBy: "Chinaza Odoh",  status: "Scheduled"   },
  { id: "CAM-PLT-000234", title: "Polio Immuniza...",  type: "Vaccination Drive", participants: "837",   startEnd: "12 Mar-14 Mar 2026", createdBy: "Festus Ayo",    status: "In-Progress" },
  { id: "CAM-PLT-000234", title: "Maternal Nutrit...", type: "Screening",         participants: "2,037", startEnd: "12 Mar-14 Mar 2026", createdBy: "Jennifer Ani",  status: "Completed"   },
  { id: "CAM-PLT-000234", title: "Hypertension s...",  type: "Education",         participants: "287",   startEnd: "12 Mar-14 Mar 2026", createdBy: "Abubaka Adam",  status: "Cancelled"   },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",         participants: "746",   startEnd: "12 Mar-14 Mar 2026", createdBy: "Abubaka Adam",  status: "In-Progress" },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",         participants: "3,937", startEnd: "12 Mar-14 Mar 2026", createdBy: "Abubaka Adam",  status: "Scheduled"   },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",         participants: "109",   startEnd: "12 Mar-14 Mar 2026", createdBy: "Abubaka Adam",  status: "Cancelled"   },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",         participants: "93",    startEnd: "12 Mar-14 Mar 2026", createdBy: "Abubaka Adam",  status: "Completed"   },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",         participants: "398",   startEnd: "12 Mar-14 Mar 2026", createdBy: "Abubaka Adam",  status: "Completed"   },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",         participants: "937",   startEnd: "12 Mar-14 Mar 2026", createdBy: "Abubaka Adam",  status: "Completed"   },
];

const POST_ACTIVITIES: PostActivityRow[] = [
  { id: "CAM-PLT-000234", title: "Malaria Preven...",  type: "Awareness",        participants: "1,383", startEnd: "12 Mar-14 Mar 2026", outcome: "Increased awar...", status: "Draft"      },
  { id: "CAM-PLT-000234", title: "Polio Immuniza...",  type: "Vaccination Drive", participants: "837",   startEnd: "12 Mar-14 Mar 2026", outcome: "Increased awar...", status: "Submitted"  },
  { id: "CAM-PLT-000234", title: "Maternal Nutrit...", type: "Screening",         participants: "2,037", startEnd: "12 Mar-14 Mar 2026", outcome: "Increased awar...", status: "Approved"   },
  { id: "CAM-PLT-000234", title: "Hypertension s...",  type: "Education",         participants: "287",   startEnd: "12 Mar-14 Mar 2026", outcome: "Increased awar...", status: "Rejected"   },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",         participants: "746",   startEnd: "12 Mar-14 Mar 2026", outcome: "Increased awar...", status: "Submitted"  },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",         participants: "3,937", startEnd: "12 Mar-14 Mar 2026", outcome: "Increased awar...", status: "Draft"      },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",         participants: "109",   startEnd: "12 Mar-14 Mar 2026", outcome: "Increased awar...", status: "Rejected"   },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",         participants: "93",    startEnd: "12 Mar-14 Mar 2026", outcome: "Increased awar...", status: "Approved"   },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",         participants: "398",   startEnd: "12 Mar-14 Mar 2026", outcome: "Increased awar...", status: "Approved"   },
  { id: "CAM-PLT-000234", title: "HIV/AIDs Educ...",   type: "Education",         participants: "937",   startEnd: "12 Mar-14 Mar 2026", outcome: "Increased awar...", status: "Approved"   },
];

const STAFF = [
  "Grace Johnson", "Nurse Amara", "Joffery Ayo", "Agnes Eze",
  "Emeka Obi", "Fatima Bello", "Chidi Nwosu", "Aisha Yusuf",
  "Bello Musa", "Jennifer Ani",
];

const TYPE_OPTIONS        = ["Awareness", "Vaccination Drive", "Screening", "Education"];
const STATUS_OPTIONS      = ["Scheduled", "In-Progress", "Completed", "Cancelled"];
const POST_STATUS_OPTIONS = ["Draft", "Submitted", "Approved", "Rejected"];

const STATUS_STYLE: Record<CampaignStatus, React.CSSProperties> = {
  Scheduled:     { background: "#EFF6FF", color: "#2563EB" },
  "In-Progress": { background: "#E8F7F0", color: "#046C3F" },
  Completed:     { background: "#F0FDF4", color: "#15803D" },
  Cancelled:     { background: "#FEF2F2", color: "#DC2626" },
};
const POST_STATUS_STYLE: Record<PostReportStatus, React.CSSProperties> = {
  Draft:     { background: "#F3F4F6", color: "#6B7280" },
  Submitted: { background: "#EFF6FF", color: "#2563EB" },
  Approved:  { background: "#E8F7F0", color: "#046C3F" },
  Rejected:  { background: "#FEF2F2", color: "#DC2626" },
};

// ── Dropdown position helper ──────────────────────────────────────────────────

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

// ── Filter dropdown (list page filters) ──────────────────────────────────────

function FilterDropdown({ label, options }: { label: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  const [coords, setCoords] = useState({ top: 0, left: 0, maxH: 300 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const longestOption = Math.max(label.length, ...options.map(o => o.length));
  const W = Math.max(180, longestOption * 9 + 72);

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
      setCoords(calcCoords(btnRef.current.getBoundingClientRect(), W, (options.length + 1) * 44 + 16, true));
    setOpen(o => !o);
  };

  return (
    <>
      <button ref={btnRef} onClick={toggle}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap">
        {selected}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: W, maxHeight: coords.maxH, zIndex: 9999, display: "flex", flexDirection: "column" }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          <div style={{ overflowY: "auto" }} className="py-1.5 px-1.5">
            {[label, ...options].map(opt => (
              <button key={opt} onClick={() => { setSelected(opt); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
                <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                  style={selected === opt ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}>
                  {selected === opt && <Check size={10} color="#fff" strokeWidth={3} />}
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

// ── Health Promotion action menu (View/Edit/Export) ──────────────────────────

function ActionMenu({ onView, onEdit }: { onView: () => void; onEdit: () => void }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <button ref={btnRef} onClick={toggle}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 outline-none focus:outline-none">
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

// ── Post Activity action menu (View / Submit Draft / Edit / Export) ───────────

function PostActionMenu({ onView, onEdit }: { onView: () => void; onEdit: () => void }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: Math.max(8, rect.right - 180) });
    }
    setOpen(o => !o);
  };

  const items: { label: string; icon: React.ReactNode; action: () => void }[] = [
    { label: "View",         icon: <Eye size={14} />,    action: () => { onView(); setOpen(false); } },
    { label: "Submit Draft", icon: <Save size={14} />,   action: () => setOpen(false) },
    { label: "Edit",         icon: <Pencil size={14} />, action: () => { onEdit(); setOpen(false); } },
    { label: "Export",       icon: <Upload size={14} />, action: () => setOpen(false) },
  ];

  return (
    <>
      <button ref={btnRef} onClick={toggle}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 outline-none focus:outline-none">
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

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ messages, onClose }: { messages: string[]; onClose: (i: number) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || messages.length === 0) return null;
  return createPortal(
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 99999, display: "flex", flexDirection: "column", gap: 8 }}>
      {messages.map((msg, i) => (
        <ToastItem key={i} message={msg} onClose={() => onClose(i)} />
      ))}
    </div>,
    document.body,
  );
}

function ToastItem({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{ borderLeft: "4px solid #046C3F" }}
      className="flex items-center gap-3 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] px-4 py-3 min-w-[280px]">
      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "#E8F7F0" }}>
        <Check size={13} color="#046C3F" strokeWidth={3} />
      </div>
      <p className="text-sm font-semibold text-gray-800 flex-1">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
        <X size={16} />
      </button>
    </div>
  );
}

// ── Form text field ───────────────────────────────────────────────────────────

function FormField({ label, value, onChange, placeholder, disabled, icon }: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; disabled?: boolean; icon?: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
        <input
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-300 disabled:text-gray-400 disabled:cursor-default"
        />
      </div>
    </div>
  );
}

// ── Form textarea ─────────────────────────────────────────────────────────────

function FormTextarea({ label, value, onChange, placeholder, disabled }: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; disabled?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <textarea
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={4}
        className="w-full text-sm text-gray-700 bg-transparent outline-none resize-none placeholder:text-gray-300 disabled:text-gray-400 disabled:cursor-default"
      />
    </div>
  );
}

// ── Form select ───────────────────────────────────────────────────────────────

function FormSelect({ label, value, onChange, options, disabled }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, maxH: 300, width: 0 });
  const [mounted, setMounted] = useState(false);
  const trigRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          trigRef.current  && !trigRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (disabled) return;
    if (!open && trigRef.current) {
      const rect = trigRef.current.getBoundingClientRect();
      const c = calcCoords(rect, rect.width, options.length * 48 + 16);
      setCoords({ ...c, width: rect.width });
    }
    setOpen(o => !o);
  };

  return (
    <>
      <div ref={trigRef} onClick={toggle}
        className={`border border-gray-200 rounded-xl px-4 py-3 bg-white transition-colors ${disabled ? "cursor-default" : "cursor-pointer hover:border-gray-300"}`}>
        <p className="text-xs text-gray-400 mb-1.5">{label}</p>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${value ? "text-gray-700" : "text-gray-300"} ${disabled ? "text-gray-400" : ""}`}>
            {value || "Auto-Fill"}
          </span>
          {!disabled && <ChevronDown size={15} className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />}
        </div>
      </div>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width, maxHeight: coords.maxH, zIndex: 9999, display: "flex", flexDirection: "column" }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          <div style={{ overflowY: "auto" }} className="py-1.5 px-1.5">
            {options.map(opt => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                  style={value === opt ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}>
                  {value === opt && <Check size={10} color="#fff" strokeWidth={3} />}
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

// ── Searchable form select ────────────────────────────────────────────────────

function SearchableFormSelect({ label, value, onChange, options, disabled }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, maxH: 320, width: 0 });
  const [mounted, setMounted] = useState(false);
  const trigRef  = useRef<HTMLDivElement>(null);
  const menuRef  = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          trigRef.current  && !trigRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (disabled) return;
    if (!open && trigRef.current) {
      const rect = trigRef.current.getBoundingClientRect();
      const c = calcCoords(rect, rect.width, 320);
      setCoords({ ...c, width: rect.width });
    }
    setOpen(o => !o);
  };

  const filtered = query.trim()
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <>
      <div ref={trigRef} onClick={toggle}
        className={`border border-gray-200 rounded-xl px-4 py-3 bg-white transition-colors ${disabled ? "cursor-default" : "cursor-pointer hover:border-gray-300"}`}>
        <p className="text-xs text-gray-400 mb-1.5">{label}</p>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${value ? "text-gray-700" : "text-gray-300"} ${disabled ? "text-gray-400" : ""}`}>
            {value || "Auto-Fill"}
          </span>
          {!disabled && <ChevronDown size={15} className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />}
        </div>
      </div>
      {mounted && open && createPortal(
        <div ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width, maxHeight: coords.maxH, zIndex: 9999, display: "flex", flexDirection: "column" }}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          <div className="px-2 pt-2 pb-1.5 border-b border-gray-100 shrink-0">
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
              <input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search"
                style={{ paddingLeft: 28 }}
                className="w-full pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F]" />
            </div>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }} className="py-1.5 px-1.5">
            {filtered.map(opt => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg whitespace-nowrap">
                {opt}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-xs text-gray-400 text-center">No results</p>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Number stepper ────────────────────────────────────────────────────────────

function NumberStepper({ label, value, onChange, disabled }: {
  label: string; value: number; onChange: (v: number) => void; disabled?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <div className="flex items-stretch">
        <div className="flex-1 px-4 pt-3 pb-2.5">
          <p className="text-xs text-gray-400 mb-1.5">{label}</p>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            disabled={disabled}
            onChange={e => {
              const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
              onChange(isNaN(n) ? 0 : Math.max(0, n));
            }}
            className="w-full text-sm text-gray-700 bg-transparent outline-none disabled:text-gray-400 disabled:cursor-default"
          />
        </div>
        {!disabled && (
          <div className="flex flex-col border-l border-gray-200">
            <button onClick={() => onChange(value + 1)}
              className="flex-1 px-2.5 flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-200">
              <ChevronUp size={12} className="text-gray-400" />
            </button>
            <button onClick={() => onChange(Math.max(0, value - 1))}
              className="flex-1 px-2.5 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronDown size={12} className="text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared tabs bar ───────────────────────────────────────────────────────────

function TabsBar({ active }: { active: "health" | "post" }) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
      <div className="px-5 py-2 rounded-lg text-sm font-semibold"
        style={active === "health" ? { background: "#046C3F", color: "#fff" } : { color: "#6B7280" }}>
        Health Promotion
      </div>
      <div className="px-5 py-2 rounded-lg text-sm font-semibold"
        style={active === "post" ? { background: "#046C3F", color: "#fff" } : { color: "#6B7280" }}>
        Post Activity
      </div>
    </div>
  );
}

// ── Health Promotion List ─────────────────────────────────────────────────────

function HealthPromotionList({
  onNewActivity, onNewPost, onViewPost, onEditPost, onViewActivity, onEditActivity,
}: {
  onNewActivity: () => void;
  onNewPost: () => void;
  onViewPost: () => void;
  onEditPost: () => void;
  onViewActivity: (row: CampaignRow) => void;
  onEditActivity: (row: CampaignRow) => void;
}) {
  const [page, setPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"health" | "post">("health");

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader
        title="Health Promotion"
        breadcrumbs={[{ label: "Health Promotion" }, { label: "Health Promotion", active: true }]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health promotion activities</h1>
            <p className="text-sm text-gray-500 mt-1">Manage & Document outreach, awareness campaigns and screenings</p>
          </div>
          {activeTab === "health" ? (
            <button onClick={onNewActivity}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
              style={{ background: "#046C3F" }}>
              <Plus size={16} /> New Activity
            </button>
          ) : (
            <button onClick={onNewPost}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
              style={{ background: "#046C3F" }}>
              <Plus size={16} /> Post Activity
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {(["health", "post"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={activeTab === tab ? { background: "#046C3F", color: "#fff" } : { color: "#6B7280" }}>
              {tab === "health" ? "Health Promotion" : "Post Activity"}
            </button>
          ))}
        </div>

        {/* Health Promotion tab */}
        {activeTab === "health" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <h2 className="text-sm font-bold text-gray-800">Recent health promotion activities</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input placeholder="Search by Activity title or ID..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-64" />
                </div>
                <PeriodFilterButton label="Date Range" />
                <FilterDropdown label="All Type"   options={TYPE_OPTIONS} />
                <FilterDropdown label="All Status" options={STATUS_OPTIONS} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[860px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Campaign ID", "Activity Title", "Type", "Expt. Participants", "Start/End Date", "Created by", "Status", "Action"].map(h => (
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
                        <ActionMenu
                          onView={() => onViewActivity(row)}
                          onEdit={() => onEditActivity(row)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={page} totalPages={68} onPageChange={setPage} />
          </div>
        )}

        {/* Post Activity tab */}
        {activeTab === "post" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <h2 className="text-sm font-bold text-gray-800">Recent Post-health promotion activities</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input placeholder="Search by Activity title or ID..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-64" />
                </div>
                <PeriodFilterButton label="Date Range" />
                <FilterDropdown label="All Type"   options={TYPE_OPTIONS} />
                <FilterDropdown label="All Status" options={POST_STATUS_OPTIONS} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[920px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Campaign ID", "Activity Title", "Type", "Participants", "Start/End Date", "Outcome", "Report Status", "Action"].map(h => (
                      <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        <span className="flex items-center gap-1">{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {POST_ACTIVITIES.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3 text-sm text-gray-600 font-medium">{row.id}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{row.title}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{row.type}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{row.participants}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{row.startEnd}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{row.outcome}</td>
                      <td className="px-5 py-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap" style={POST_STATUS_STYLE[row.status]}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <PostActionMenu onView={onViewPost} onEdit={onEditPost} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={postPage} totalPages={68} onPageChange={setPostPage} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── New Activity Form (Health Promotion tab) ──────────────────────────────────

function NewActivityForm({ onBack }: { onBack: () => void }) {
  const [sectionOpen, setSectionOpen] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [activityTitle, setActivityTitle] = useState("");
  const [type, setType]                   = useState("");
  const [location, setLocation]           = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [participants, setParticipants]   = useState(0);
  const [startDate, setStartDate]         = useState("");
  const [endDate, setEndDate]             = useState("");
  const [createdBy, setCreatedBy]         = useState("");
  const [assignTo, setAssignTo]           = useState("");
  const [description, setDescription]     = useState("");

  const handleSubmit = () => {
    setShowToast(true);
    setTimeout(() => onBack(), 2800);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader
        title="Health Promotion"
        breadcrumbs={[
          { label: "Health Promotion" },
          { label: "Health Promotion" },
          { label: "New Activity", active: true },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">

        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#046C3F] hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Create a Health promotion activity</h1>

        <TabsBar active="health" />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 cursor-pointer"
            onClick={() => setSectionOpen(v => !v)}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#E8F7F0" }}>
                <TrendingUp size={16} color="#046C3F" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">Create a new activity</h2>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              {sectionOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {sectionOpen && (
            <div className="px-6 py-6 space-y-4">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormField label="Activity title" value={activityTitle} onChange={setActivityTitle}
                  placeholder="e.g Malaria prevention awareness" />
                <FormField label="Campaign ID" value="" placeholder="Auto-generated" disabled />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormSelect label="Type" value={type} onChange={setType} options={TYPE_OPTIONS} />
                <FormField label="Location" value={location} onChange={setLocation}
                  placeholder="e.g Gwagwalada market" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormField label="Target audience" value={targetAudience} onChange={setTargetAudience}
                  placeholder="e.g Pregnant women" />
                <NumberStepper label="Expected Participants" value={participants} onChange={setParticipants} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormField label="Start Date" value={startDate} onChange={setStartDate}
                  placeholder="12/12/2020" icon={<Calendar size={13} />} />
                <FormField label="End Date" value={endDate} onChange={setEndDate}
                  placeholder="12/12/2020" icon={<Calendar size={13} />} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <SearchableFormSelect label="Created by" value={createdBy} onChange={setCreatedBy} options={STAFF} />
                <SearchableFormSelect label="Assign to"  value={assignTo}  onChange={setAssignTo}  options={STAFF} />
              </div>
              <FormTextarea label="Description" value={description} onChange={setDescription}
                placeholder="Briefly describe the activity and key outcome..." />
              <div className="flex items-center gap-3 pt-2">
                <button onClick={onBack}
                  className="px-8 py-2.5 rounded-xl text-sm font-semibold text-gray-600 transition-colors"
                  style={{ background: "#F3F4F6" }}>
                  Cancel
                </button>
                <button onClick={handleSubmit}
                  className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                  style={{ background: "#046C3F" }}>
                  Submit Activity
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <Toast messages={["Activity Submitted Successfully"]} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

// ── Post Activity Form (view / edit / new) ────────────────────────────────────

type PostFormMode = "view" | "edit" | "new";

function PostActivityForm({
  mode, onBack, onEditActivity,
}: {
  mode: PostFormMode; onBack: () => void; onEditActivity?: () => void;
}) {
  const [section1Open, setSection1Open] = useState(true);
  const [section2Open, setSection2Open] = useState(true);
  const [toasts, setToasts] = useState<string[]>([]);

  // Activity fields
  const [campaignId, setCampaignId]         = useState(mode === "view" ? "CAM-PLT-000234" : "");
  const [activityTitle, setActivityTitle]   = useState(mode === "view" ? "Malaria Prevention" : "");
  const [type, setType]                     = useState(mode === "view" ? "Education" : "");
  const [location, setLocation]             = useState(mode === "view" ? "Gwagwalada" : "");
  const [targetAudience, setTargetAudience] = useState(mode === "view" ? "Pregnant women" : "");
  const [participants, setParticipants]     = useState(mode === "view" ? 80 : 0);
  const [startDate, setStartDate]           = useState(mode === "view" ? "12/12/2026" : "");
  const [endDate, setEndDate]               = useState(mode === "view" ? "12/12/2026" : "");
  const [createdBy, setCreatedBy]           = useState(mode === "view" ? "Agnes Eze" : "");
  const [assignTo, setAssignTo]             = useState(mode === "view" ? "Agnes Eze" : "");
  const [description, setDescription]       = useState(mode === "view" ? "Filled" : "");

  // Participation fields
  const [numParticipants, setNumParticipants] = useState(mode === "view" ? 78 : 0);
  const [maleCount, setMaleCount]             = useState(mode === "view" ? 34 : 0);
  const [femaleCount, setFemaleCount]         = useState(mode === "view" ? 24 : 0);
  const [followUp, setFollowUp]               = useState(mode === "view");
  const [keyMessages, setKeyMessages]         = useState(mode === "view" ? "Filled" : "");
  const [outcomeSummary, setOutcomeSummary]   = useState(mode === "view" ? "Filled" : "");
  const [challenges, setChallenges]           = useState(mode === "view" ? "Filled" : "");

  const isView = mode === "view";
  const isNew  = mode === "new";

  const addToast = (msg: string) => setToasts(prev => [...prev, msg]);
  const removeToast = (i: number) => setToasts(prev => prev.filter((_, idx) => idx !== i));

  const handleSaveDraft = () => {
    addToast("Post Activity Saved as Draft");
  };

  const handleSubmit = () => {
    addToast("Post Activity Submitted Successfully");
    setTimeout(() => onBack(), 2800);
  };

  const handleUpdate = () => {
    addToast("Post Activity Updated Successfully");
    setTimeout(() => onBack(), 2800);
  };

  const sectionLabel = isView ? "View post activity" : "Record Post Activity";

  const breadcrumbs = [
    { label: "Health Promotion" },
    { label: "Health Promotion" },
    { label: "New Activity", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Health Promotion" breadcrumbs={breadcrumbs} />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">

        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#046C3F] hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Post Activity Form</h1>
          {isView && (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={onEditActivity}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                <Pencil size={15} /> Edit Activity
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#046C3F" }}>
                <Upload size={15} /> Export
              </button>
            </div>
          )}
        </div>

        <TabsBar active="post" />

        {/* Activity details section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 cursor-pointer"
            onClick={() => setSection1Open(v => !v)}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#E8F7F0" }}>
                <TrendingUp size={16} color="#046C3F" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">{sectionLabel}</h2>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              {section1Open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {section1Open && (
            <div className="px-6 py-6 space-y-4">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormField label="Campaign ID" value={campaignId} onChange={isView ? undefined : setCampaignId}
                  placeholder="Search" disabled={isView}
                  icon={!isView ? <Search size={13} /> : undefined} />
                <FormField label="Activity Title" value={activityTitle} onChange={isView ? undefined : setActivityTitle}
                  placeholder="Auto-Fill" disabled={isView} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormSelect label="Type" value={type} onChange={setType} options={TYPE_OPTIONS} disabled={isView} />
                <FormField label="Location" value={location} onChange={isView ? undefined : setLocation}
                  placeholder="Auto-Fill" disabled={isView} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormField label="Target audience" value={targetAudience} onChange={isView ? undefined : setTargetAudience}
                  placeholder="Auto-Fill" disabled={isView} />
                <NumberStepper label="Expected Participants" value={participants} onChange={setParticipants} disabled={isView} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormField label="Start Date" value={startDate} onChange={isView ? undefined : setStartDate}
                  placeholder="Auto-Fill" disabled={isView} icon={<Calendar size={13} />} />
                <FormField label="End Date" value={endDate} onChange={isView ? undefined : setEndDate}
                  placeholder="Auto-Fill" disabled={isView} icon={<Calendar size={13} />} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <SearchableFormSelect label="Created by" value={createdBy} onChange={setCreatedBy} options={STAFF} disabled={isView} />
                <SearchableFormSelect label="Assign to"  value={assignTo}  onChange={setAssignTo}  options={STAFF} disabled={isView} />
              </div>
              <FormTextarea label="Description" value={description} onChange={isView ? undefined : setDescription}
                placeholder="Auto-Fill" disabled={isView} />
            </div>
          )}
        </div>

        {/* Participation data section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 cursor-pointer"
            onClick={() => setSection2Open(v => !v)}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#E8F7F0" }}>
                <TrendingUp size={16} color="#046C3F" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">Participation Data</h2>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              {section2Open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {section2Open && (
            <div className="px-6 py-6 space-y-4">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <NumberStepper label="Number of Participants" value={numParticipants} onChange={setNumParticipants} />
                <NumberStepper label="Male Count" value={maleCount} onChange={setMaleCount} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <NumberStepper label="Female Count" value={femaleCount} onChange={setFemaleCount} />
                <div className="flex flex-col gap-1.5 px-1">
                  <button className="flex items-center gap-2" onClick={() => setFollowUp(v => !v)}>
                    <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                      style={followUp ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}>
                      {followUp && <Check size={10} color="#fff" strokeWidth={3} />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">Follow up</span>
                  </button>
                  <p className="text-xs text-gray-400">Referrals Made</p>
                </div>
              </div>
              <FormTextarea label="Key Messages Delivered" value={keyMessages} onChange={setKeyMessages}
                placeholder="e.g. Hygiene, Vaccination awareness" />
              <FormTextarea label="Outcome Summary" value={outcomeSummary} onChange={setOutcomeSummary}
                placeholder="e.g. Increased awareness" />
              <FormTextarea label="Challenges" value={challenges} onChange={setChallenges}
                placeholder="Challenges Faced" />

              {!isView && (
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={onBack}
                    className="px-8 py-2.5 rounded-xl text-sm font-semibold text-gray-600 transition-colors"
                    style={{ background: "#F3F4F6" }}>
                    Cancel
                  </button>
                  <button onClick={handleSaveDraft}
                    className="px-8 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    Save as Draft
                  </button>
                  {isNew ? (
                    <button onClick={handleSubmit}
                      className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                      style={{ background: "#046C3F" }}>
                      <Send size={15} /> Submit
                    </button>
                  ) : (
                    <button onClick={handleUpdate}
                      className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                      style={{ background: "#046C3F" }}>
                      <RefreshCw size={15} /> Update Changes
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Toast messages={toasts} onClose={removeToast} />
    </div>
  );
}

// ── Health Activity Form (view / edit a health promotion campaign) ────────────

function HealthActivityForm({
  mode, row, onBack, onSwitchToEdit,
}: {
  mode: "view" | "edit";
  row: CampaignRow;
  onBack: () => void;
  onSwitchToEdit?: () => void;
}) {
  const [sectionOpen, setSectionOpen] = useState(true);
  const [toasts, setToasts] = useState<string[]>([]);

  const [activityTitle, setActivityTitle] = useState(row.title.replace(/\.\.\.$/, ""));
  const [campaignId, setCampaignId]       = useState(row.id);
  const [type, setType]                   = useState(row.type);
  const [location, setLocation]           = useState("Gwagwalada Market");
  const [targetAudience, setTargetAudience] = useState("Pregnant women");
  const [participants, setParticipants]   = useState(Number(row.participants.replace(/,/g, "")) || 0);
  const [startDate, setStartDate]         = useState(row.startEnd.split("-")[0]?.trim() ?? "");
  const [endDate, setEndDate]             = useState(row.startEnd.split("-").slice(1).join("-").trim() ?? "");
  const [createdBy, setCreatedBy]         = useState(row.createdBy);
  const [assignTo, setAssignTo]           = useState("Grace Johnson");
  const [description, setDescription]     = useState("Filled");

  const isView = mode === "view";

  const addToast = (msg: string) => setToasts(prev => [...prev, msg]);
  const removeToast = (i: number) => setToasts(prev => prev.filter((_, idx) => idx !== i));

  const handleSaveDraft = () => addToast("Activity Saved as Draft");
  const handleUpdate = () => {
    addToast("Activity Updated Successfully");
    setTimeout(() => onBack(), 2800);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader
        title="Health Promotion"
        breadcrumbs={[
          { label: "Health Promotion" },
          { label: "Health Promotion" },
          { label: "New Activity", active: true },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">

        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#046C3F] hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {isView ? "View Activity" : "Edit Activity"}
          </h1>
          {isView && (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={onSwitchToEdit}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                <Pencil size={15} /> Edit Activity
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#046C3F" }}>
                <Upload size={15} /> Export
              </button>
            </div>
          )}
        </div>

        <TabsBar active="health" />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 cursor-pointer"
            onClick={() => setSectionOpen(v => !v)}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#E8F7F0" }}>
                <TrendingUp size={16} color="#046C3F" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">
                {isView ? "View activity" : "Edit activity"}
              </h2>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              {sectionOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {sectionOpen && (
            <div className="px-6 py-6 space-y-4">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormField label="Activity title" value={activityTitle}
                  onChange={isView ? undefined : setActivityTitle}
                  placeholder="e.g Malaria prevention awareness" disabled={isView} />
                <FormField label="Campaign ID" value={campaignId}
                  onChange={isView ? undefined : setCampaignId}
                  placeholder="Auto-generated" disabled={isView} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormSelect label="Type" value={type} onChange={setType}
                  options={TYPE_OPTIONS} disabled={isView} />
                <FormField label="Location" value={location}
                  onChange={isView ? undefined : setLocation}
                  placeholder="e.g Gwagwalada market" disabled={isView} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormField label="Target audience" value={targetAudience}
                  onChange={isView ? undefined : setTargetAudience}
                  placeholder="e.g Pregnant women" disabled={isView} />
                <NumberStepper label="Expected Participants"
                  value={participants} onChange={setParticipants} disabled={isView} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormField label="Start Date" value={startDate}
                  onChange={isView ? undefined : setStartDate}
                  placeholder="12/12/2020" disabled={isView} icon={<Calendar size={13} />} />
                <FormField label="End Date" value={endDate}
                  onChange={isView ? undefined : setEndDate}
                  placeholder="12/12/2020" disabled={isView} icon={<Calendar size={13} />} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <SearchableFormSelect label="Created by" value={createdBy}
                  onChange={setCreatedBy} options={STAFF} disabled={isView} />
                <SearchableFormSelect label="Assign to" value={assignTo}
                  onChange={setAssignTo} options={STAFF} disabled={isView} />
              </div>
              <FormTextarea label="Description" value={description}
                onChange={isView ? undefined : setDescription}
                placeholder="Briefly describe the activity and key outcome..."
                disabled={isView} />

              {!isView && (
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={onBack}
                    className="px-8 py-2.5 rounded-xl text-sm font-semibold text-gray-600 transition-colors"
                    style={{ background: "#F3F4F6" }}>
                    Cancel
                  </button>
                  <button onClick={handleSaveDraft}
                    className="px-8 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    Save as Draft
                  </button>
                  <button onClick={handleUpdate}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                    style={{ background: "#046C3F" }}>
                    <RefreshCw size={15} /> Update Changes
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Toast messages={toasts} onClose={removeToast} />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ViewState = "list" | "new-activity" | "new-post" | "view-post" | "edit-post" | "view-activity" | "edit-activity";

export default function ChewHealthPromotion() {
  const searchParams = useSearchParams();
  const initialView = (searchParams.get("view") as ViewState) ?? "list";
  const [view, setView] = useState<ViewState>(initialView);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRow | null>(
    (initialView === "view-activity" || initialView === "edit-activity") ? CAMPAIGNS[0] : null
  );

  if (view === "new-activity") return <NewActivityForm onBack={() => setView("list")} />;
  if (view === "new-post")     return <PostActivityForm mode="new"  onBack={() => setView("list")} />;
  if (view === "view-post")    return <PostActivityForm mode="view" onBack={() => setView("list")} onEditActivity={() => setView("edit-post")} />;
  if (view === "edit-post")    return <PostActivityForm mode="edit" onBack={() => setView("list")} />;
  if (view === "view-activity" && selectedCampaign) return (
    <HealthActivityForm
      mode="view"
      row={selectedCampaign}
      onBack={() => setView("list")}
      onSwitchToEdit={() => setView("edit-activity")}
    />
  );
  if (view === "edit-activity" && selectedCampaign) return (
    <HealthActivityForm
      mode="edit"
      row={selectedCampaign}
      onBack={() => setView("list")}
    />
  );

  return (
    <HealthPromotionList
      onNewActivity={() => setView("new-activity")}
      onNewPost={() => setView("new-post")}
      onViewPost={() => setView("view-post")}
      onEditPost={() => setView("edit-post")}
      onViewActivity={(row) => { setSelectedCampaign(row); setView("view-activity"); }}
      onEditActivity={(row) => { setSelectedCampaign(row); setView("edit-activity"); }}
    />
  );
}
