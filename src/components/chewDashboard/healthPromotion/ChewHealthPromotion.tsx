"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowLeft,
  Calendar,
  X,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Save,
  Pencil,
  Upload,
  RefreshCw,
  Send,
  Download,
  Printer,
} from "lucide-react";
import ChewDashboardHeader from "@/src/components/chewDashboard/generics/ChewDashboardHeader";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import {
  useHealthPromotions,
  useHealthPromotion,
  useCreateHealthPromotion,
  useUpdateHealthPromotion,
  usePostActivities,
  usePostActivity,
  useCreatePostActivity,
  useUpdatePostActivity,
  useFacilityStaffForPromotion,
  HealthPromotion,
  PostActivityReport,
} from "@/src/hooks/nurses/use-health-promotions";

// ── Types ─────────────────────────────────────────────────────────────────────

type CampaignStatus =
  | "Scheduled"
  | "In-Progress"
  | "Completed"
  | "Cancelled"
  | "Draft";
type PostReportStatus = "Draft" | "Submitted" | "Approved" | "Rejected";

// ── Static data ───────────────────────────────────────────────────────────────

const STAFF = [
  "Grace Johnson",
  "Nurse Amara",
  "Joffery Ayo",
  "Agnes Eze",
  "Emeka Obi",
  "Fatima Bello",
  "Chidi Nwosu",
  "Aisha Yusuf",
  "Bello Musa",
  "Jennifer Ani",
];

const TYPE_OPTIONS = [
  "AWARENESS",
  "VACCINATION_DRIVE",
  "SCREENING",
  "EDUCATION",
];
const STATUS_OPTIONS = [
  "DRAFT",
  "SCHEDULED",
  "IN_PROCESS",
  "CANCELLED",
  "COMPLETED",
];
const POST_STATUS_OPTIONS = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"];

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  SCHEDULED: { background: "#EFF6FF", color: "#2563EB" },
  IN_PROCESS: { background: "#E8F7F0", color: "#046C3F" },
  COMPLETED: { background: "#F0FDF4", color: "#15803D" },
  CANCELLED: { background: "#FEF2F2", color: "#DC2626" },
  DRAFT: { background: "#F3F4F6", color: "#6B7280" },
};
const POST_STATUS_STYLE: Record<string, React.CSSProperties> = {
  DRAFT: { background: "#F3F4F6", color: "#6B7280" },
  SUBMITTED: { background: "#EFF6FF", color: "#2563EB" },
  APPROVED: { background: "#E8F7F0", color: "#046C3F" },
  REJECTED: { background: "#FEF2F2", color: "#DC2626" },
};

function formatDateStr(isoStr?: string) {
  if (!isoStr) return "N/A";
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return isoStr;
  }
}

// ── Export Utilities ──────────────────────────────────────────────────────────

function downloadCSV(filename: string, data: Record<string, any>) {
  const headers = Object.keys(data);
  const row = headers
    .map((header) => `"${(data[header] || "").toString().replace(/"/g, '""')}"`)
    .join(",");
  const csvContent =
    "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + row;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printDetails(title: string, data: Record<string, any>) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const html = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f9fafb; width: 35%; font-weight: 600; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <table>
          <tbody>
            ${Object.entries(data)
              .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
              .join("")}
          </tbody>
        </table>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

// ── Dropdown position helper ──────────────────────────────────────────────────

function calcCoords(
  rect: DOMRect,
  w: number,
  estimatedH: number,
  rightAlign = false,
) {
  const spaceBelow = window.innerHeight - rect.bottom - 8;
  const spaceAbove = rect.top - 8;
  const fits = spaceBelow >= Math.min(estimatedH, 200);
  const maxH = fits
    ? Math.min(spaceBelow, estimatedH)
    : Math.min(spaceAbove, estimatedH);
  const top = fits ? rect.bottom + 4 : Math.max(8, rect.top - maxH - 4);
  const left = rightAlign
    ? Math.max(8, rect.right - w)
    : Math.max(8, Math.min(rect.left, window.innerWidth - w - 8));
  return { top, left, maxH };
}

// ── Filter dropdown (list page filters) ──────────────────────────────────────

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, maxH: 300 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const longestOption = Math.max(label.length, ...options.map((o) => o.length));
  const W = Math.max(180, longestOption * 9 + 72);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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
    if (!open && btnRef.current)
      setCoords(
        calcCoords(
          btnRef.current.getBoundingClientRect(),
          W,
          (options.length + 1) * 44 + 16,
          true,
        ),
      );
    setOpen((o) => !o);
  };

  const selectedDisplay =
    value && value !== "All Status" && value !== "All Type" ? value : label;

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        {selectedDisplay}
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
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
              width: W,
              maxHeight: coords.maxH,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
            }}
            className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
          >
            <div style={{ overflowY: "auto" }} className="py-1.5 px-1.5">
              {[label, ...options].map((opt) => {
                const isSelected =
                  value === opt ||
                  (opt === label && (!value || value.startsWith("All")));
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      onChange(opt === label ? "" : opt);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    <div
                      className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                      style={
                        isSelected
                          ? { background: "#046C3F", borderColor: "#046C3F" }
                          : { borderColor: "#D1D5DB" }
                      }
                    >
                      {isSelected && (
                        <Check size={10} color="#fff" strokeWidth={3} />
                      )}
                    </div>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

// ── Action Menu ──────────────────────────────────────────────────────────────

function ActionMenu({
  onView,
  onExportCSV,
  onPrint,
}: {
  onView: () => void;
  onExportCSV: () => void;
  onPrint: () => void;
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
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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

  const items = [
    {
      label: "View Details",
      icon: <Eye size={14} />,
      action: () => {
        onView();
        setOpen(false);
      },
    },
    {
      label: "Export CSV",
      icon: <Download size={14} />,
      action: () => {
        onExportCSV();
        setOpen(false);
      },
    },
    {
      label: "Print (PDF)",
      icon: <Printer size={14} />,
      action: () => {
        onPrint();
        setOpen(false);
      },
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

// ── Export Menu (for details pages) ───────────────────────────────────────────

function ExportMenuButton({
  onExportCSV,
  onPrint,
}: {
  onExportCSV: () => void;
  onPrint: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "#046C3F" }}
      >
        <Upload size={15} /> Export
      </button>
      {open &&
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
            <button
              onClick={() => {
                onExportCSV();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download size={14} className="text-gray-400" /> Export CSV
            </button>
            <button
              onClick={() => {
                onPrint();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Printer size={14} className="text-gray-400" /> Print (PDF)
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({
  messages,
  onClose,
}: {
  messages: string[];
  onClose: (i: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted || messages.length === 0) return null;
  return createPortal(
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {messages.map((msg, i) => (
        <ToastItem key={i} message={msg} onClose={() => onClose(i)} />
      ))}
    </div>,
    document.body,
  );
}

function ToastItem({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      style={{ borderLeft: "4px solid #046C3F" }}
      className="flex items-center gap-3 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] px-4 py-3 min-w-[280px]"
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "#E8F7F0" }}
      >
        <Check size={13} color="#046C3F" strokeWidth={3} />
      </div>
      <p className="text-sm font-semibold text-gray-800 flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// ── Form fields ───────────────────────────────────────────────────────────────

function FormField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  type?: string;
}) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-300 disabled:text-gray-400 disabled:cursor-default"
        />
      </div>
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={4}
        className="w-full text-sm text-gray-700 bg-transparent outline-none resize-none placeholder:text-gray-300 disabled:text-gray-400 disabled:cursor-default"
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    maxH: 300,
    width: 0,
  });
  const trigRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        trigRef.current &&
        !trigRef.current.contains(e.target as Node)
      )
        setOpen(false);
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
    setOpen((o) => !o);
  };

  return (
    <>
      <div
        ref={trigRef}
        onClick={toggle}
        className={`border border-gray-200 rounded-xl px-4 py-3 bg-white transition-colors ${disabled ? "cursor-default" : "cursor-pointer hover:border-gray-300"}`}
      >
        <p className="text-xs text-gray-400 mb-1.5">{label}</p>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm ${value ? "text-gray-700" : "text-gray-300"} ${disabled ? "text-gray-400" : ""}`}
          >
            {value || "Select..."}
          </span>
          {!disabled && (
            <ChevronDown
              size={15}
              className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            />
          )}
        </div>
      </div>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              maxHeight: coords.maxH,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
            }}
            className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
          >
            <div style={{ overflowY: "auto" }} className="py-1.5 px-1.5">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                    style={
                      value === opt
                        ? { background: "#046C3F", borderColor: "#046C3F" }
                        : { borderColor: "#D1D5DB" }
                    }
                  >
                    {value === opt && (
                      <Check size={10} color="#fff" strokeWidth={3} />
                    )}
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

function SearchableFormSelect({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    maxH: 320,
    width: 0,
  });
  const trigRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        trigRef.current &&
        !trigRef.current.contains(e.target as Node)
      )
        setOpen(false);
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
    setOpen((o) => !o);
  };

  const filtered = query.trim()
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <>
      <div
        ref={trigRef}
        onClick={toggle}
        className={`border border-gray-200 rounded-xl px-4 py-3 bg-white transition-colors ${disabled ? "cursor-default" : "cursor-pointer hover:border-gray-300"}`}
      >
        <p className="text-xs text-gray-400 mb-1.5">{label}</p>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm ${value ? "text-gray-700" : "text-gray-300"} ${disabled ? "text-gray-400" : ""}`}
          >
            {value || "Select..."}
          </span>
          {!disabled && (
            <ChevronDown
              size={15}
              className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            />
          )}
        </div>
      </div>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              maxHeight: coords.maxH,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
            }}
            className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
          >
            <div className="px-2 pt-2 pb-1.5 border-b border-gray-100 shrink-0">
              <div style={{ position: "relative" }}>
                <Search
                  size={13}
                  style={{
                    position: "absolute",
                    left: 9,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                    pointerEvents: "none",
                  }}
                />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  style={{ paddingLeft: 28 }}
                  className="w-full pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F]"
                />
              </div>
            </div>
            <div
              style={{ overflowY: "auto", flex: 1 }}
              className="py-1.5 px-1.5"
            >
              {filtered.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg whitespace-nowrap"
                >
                  {opt}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-4 py-3 text-xs text-gray-400 text-center">
                  No results
                </p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function MultiSearchableStaffSelect({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: any[];
  onChange: (v: any[]) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    maxH: 320,
    width: 0,
  });
  const trigRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: staffList, isLoading } = useFacilityStaffForPromotion(query);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        trigRef.current &&
        !trigRef.current.contains(e.target as Node)
      )
        setOpen(false);
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
    setOpen((o) => !o);
  };

  const toggleSelection = (staff: any) => {
    const isSelected = value.find((v) => v.id === staff.id);
    if (isSelected) {
      onChange(value.filter((v) => v.id !== staff.id));
    } else {
      onChange([...value, staff]);
    }
  };

  const removeSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onChange(value.filter((v) => v.id !== id));
  };

  return (
    <>
      <div
        ref={trigRef}
        onClick={toggle}
        className={`border border-gray-200 rounded-xl px-4 py-3 bg-white transition-colors ${disabled ? "cursor-default" : "cursor-pointer hover:border-gray-300"}`}
      >
        <p className="text-xs text-gray-400 mb-1.5">{label}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {value.length === 0 ? (
              <span
                className={`text-sm text-gray-300 ${disabled ? "text-gray-400" : ""}`}
              >
                Select staff...
              </span>
            ) : (
              value.map((v) => (
                <span
                  key={v.id}
                  className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-700"
                >
                  {v.first_name} {v.last_name}
                  {!disabled && (
                    <button
                      onClick={(e) => removeSelection(e, v.id)}
                      className="hover:text-red-500"
                    >
                      <X size={10} />
                    </button>
                  )}
                </span>
              ))
            )}
          </div>
          {!disabled && (
            <ChevronDown
              size={15}
              className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            />
          )}
        </div>
      </div>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              maxHeight: coords.maxH,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
            }}
            className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
          >
            <div className="px-2 pt-2 pb-1.5 border-b border-gray-100 shrink-0">
              <div style={{ position: "relative" }}>
                <Search
                  size={13}
                  style={{
                    position: "absolute",
                    left: 9,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                    pointerEvents: "none",
                  }}
                />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search staff..."
                  style={{ paddingLeft: 28 }}
                  className="w-full pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F]"
                />
              </div>
            </div>
            <div
              style={{ overflowY: "auto", flex: 1 }}
              className="py-1.5 px-1.5"
            >
              {isLoading ? (
                <p className="px-4 py-3 text-xs text-gray-400 text-center">
                  Loading...
                </p>
              ) : (
                (staffList || []).map((opt: any) => {
                  const isSelected = value.find((v) => v.id === opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleSelection(opt)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div
                        className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                        style={
                          isSelected
                            ? { background: "#046C3F", borderColor: "#046C3F" }
                            : { borderColor: "#D1D5DB" }
                        }
                      >
                        {isSelected && (
                          <Check size={10} color="#fff" strokeWidth={3} />
                        )}
                      </div>
                      {opt.first_name} {opt.last_name}
                    </button>
                  );
                })
              )}
              {!isLoading && (!staffList || staffList.length === 0) && (
                <p className="px-4 py-3 text-xs text-gray-400 text-center">
                  No results
                </p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function SearchableHealthPromotionSelect({
  label,
  value,
  displayValue,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  displayValue?: string;
  onChange: (id: string, title: string, promotion_id: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    maxH: 320,
    width: 0,
  });
  const trigRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: promotionsData, isLoading } = useHealthPromotions({
    search: query,
    page: 1,
    page_size: 10,
  });
  const promotions = promotionsData?.results || [];

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        trigRef.current &&
        !trigRef.current.contains(e.target as Node)
      )
        setOpen(false);
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
    setOpen((o) => !o);
  };

  const selectedDisplay = displayValue || (value ? "Selected (Missing ID)" : "Select Health Promotion...");

  return (
    <>
      <div
        ref={trigRef}
        onClick={toggle}
        className={`border border-gray-200 rounded-xl px-4 py-3 bg-white transition-colors ${disabled ? "cursor-default" : "cursor-pointer hover:border-gray-300"}`}
      >
        <p className="text-xs text-gray-400 mb-1.5">{label}</p>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm ${value ? "text-gray-700" : "text-gray-300"} ${disabled ? "text-gray-400" : ""}`}
          >
            {selectedDisplay}
          </span>
          {!disabled && (
            <ChevronDown
              size={15}
              className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            />
          )}
        </div>
      </div>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              maxHeight: coords.maxH,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
            }}
            className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
          >
            <div className="px-2 pt-2 pb-1.5 border-b border-gray-100 shrink-0">
              <div style={{ position: "relative" }}>
                <Search
                  size={13}
                  style={{
                    position: "absolute",
                    left: 9,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                    pointerEvents: "none",
                  }}
                />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by Title or ID..."
                  style={{ paddingLeft: 28 }}
                  className="w-full pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F]"
                />
              </div>
            </div>
            <div
              style={{ overflowY: "auto", flex: 1 }}
              className="py-1.5 px-1.5"
            >
              {isLoading ? (
                <p className="px-4 py-3 text-xs text-gray-400 text-center">
                  Loading...
                </p>
              ) : (
                promotions.map((opt: HealthPromotion) => {
                  const isSelected = value === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onChange(opt.id, opt.title, opt.promotion_id || "");
                        setOpen(false);
                      }}
                      className="w-full flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                          style={
                            isSelected
                              ? {
                                  background: "#046C3F",
                                  borderColor: "#046C3F",
                                }
                              : { borderColor: "#D1D5DB" }
                          }
                        >
                          {isSelected && (
                            <Check size={10} color="#fff" strokeWidth={3} />
                          )}
                        </div>
                        <span className="font-medium text-gray-800">
                          {opt.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 ml-6">
                        {opt.promotion_id || opt.id?.substring(0, 8)} • {opt.type}
                      </span>
                    </button>
                  );
                })
              )}
              {!isLoading && promotions.length === 0 && (
                <p className="px-4 py-3 text-xs text-gray-400 text-center">
                  No results
                </p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function NumberStepper({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
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
            onChange={(e) => {
              const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
              onChange(isNaN(n) ? 0 : Math.max(0, n));
            }}
            className="w-full text-sm text-gray-700 bg-transparent outline-none disabled:text-gray-400 disabled:cursor-default"
          />
        </div>
        {!disabled && (
          <div className="flex flex-col border-l border-gray-200">
            <button
              onClick={() => onChange(value + 1)}
              className="flex-1 px-2.5 flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-200"
            >
              <ChevronUp size={12} className="text-gray-400" />
            </button>
            <button
              onClick={() => onChange(Math.max(0, value - 1))}
              className="flex-1 px-2.5 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronDown size={12} className="text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TabsBar({ active }: { active: "health" | "post" }) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
      <div
        className="px-5 py-2 rounded-lg text-sm font-semibold"
        style={
          active === "health"
            ? { background: "#046C3F", color: "#fff" }
            : { color: "#6B7280" }
        }
      >
        Health Promotion
      </div>
      <div
        className="px-5 py-2 rounded-lg text-sm font-semibold"
        style={
          active === "post"
            ? { background: "#046C3F", color: "#fff" }
            : { color: "#6B7280" }
        }
      >
        Post Activity
      </div>
    </div>
  );
}

// ── Lists ─────────────────────────────────────────────────────────────────────

function HealthPromotionList({
  onNewActivity,
  onNewPost,
  onViewPost,
  onViewActivity,
}: {
  onNewActivity: () => void;
  onNewPost: () => void;
  onViewPost: (row: PostActivityReport) => void;
  onViewActivity: (row: HealthPromotion) => void;
}) {
  const [activeTab, setActiveTab] = useState<"health" | "post">("health");

  // Health Promotion states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const { data: hpData, isLoading: hpLoading } = useHealthPromotions({
    page,
    page_size: 10,
    search,
    type,
    status,
  });

  // Post Activity states
  const [postPage, setPostPage] = useState(1);
  const [postSearch, setPostSearch] = useState("");
  const [postType, setPostType] = useState("");
  const [postStatus, setPostStatus] = useState("");

  const { data: paData, isLoading: paLoading } = usePostActivities({
    page: postPage,
    page_size: 10,
    search: postSearch,
    type: postType,
    status: postStatus,
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <ChewDashboardHeader
        title="Health Promotion"
        breadcrumbs={[
          { label: "Chew Dashboard" },
          { label: "Health Promotion", active: true },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Health promotion activities
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage & Document outreach, awareness campaigns and screenings
            </p>
          </div>
          {activeTab === "health" ? (
            <button
              onClick={onNewActivity}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
              style={{ background: "#046C3F" }}
            >
              <Plus size={16} /> New Activity
            </button>
          ) : (
            <button
              onClick={onNewPost}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
              style={{ background: "#046C3F" }}
            >
              <Plus size={16} /> Post Activity
            </button>
          )}
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {(["health", "post"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={
                activeTab === tab
                  ? { background: "#046C3F", color: "#fff" }
                  : { color: "#6B7280" }
              }
            >
              {tab === "health" ? "Health Promotion" : "Post Activity"}
            </button>
          ))}
        </div>

        {activeTab === "health" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <h2 className="text-sm font-bold text-gray-800">
                Recent health promotion activities
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    placeholder="Search by Activity title or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-64"
                  />
                </div>
                <PeriodFilterButton label="Date Range" />
                <FilterDropdown
                  label="All Type"
                  options={TYPE_OPTIONS}
                  value={type}
                  onChange={setType}
                />
                <FilterDropdown
                  label="All Status"
                  options={STATUS_OPTIONS}
                  value={status}
                  onChange={setStatus}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[860px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[
                      "Campaign ID",
                      "Activity Title",
                      "Type",
                      "Expt. Participants",
                      "Start/End Date",
                      "Created by",
                      "Status",
                      "Action",
                    ].map((h) => (
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
                  {hpLoading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-6 text-sm text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : hpData?.results?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-6 text-sm text-gray-500"
                      >
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    hpData?.results?.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-5 py-3 text-sm text-gray-600 font-medium">
                          {row.promotion_id || row.id?.substring(0, 8)}
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
                          {formatDateStr(row.start_date)} -{" "}
                          {formatDateStr(row.end_date)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">
                          {row.created_by_name || row.created_by}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
                            style={
                              STATUS_STYLE[row.status] || STATUS_STYLE.DRAFT
                            }
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <ActionMenu
                            onView={() => onViewActivity(row)}
                            onExportCSV={() =>
                              downloadCSV(`campaign_${row.id}.csv`, row)
                            }
                            onPrint={() =>
                              printDetails("Health Promotion details", row)
                            }
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {hpData && (
              <Pagination
                currentPage={page}
                totalPages={hpData.total_pages}
                onPageChange={setPage}
              />
            )}
          </div>
        )}

        {activeTab === "post" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <h2 className="text-sm font-bold text-gray-800">
                Recent Post-health promotion activities
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    placeholder="Search by Activity title or ID..."
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#046C3F] w-64"
                  />
                </div>
                <PeriodFilterButton label="Date Range" />
                <FilterDropdown
                  label="All Type"
                  options={TYPE_OPTIONS}
                  value={postType}
                  onChange={setPostType}
                />
                <FilterDropdown
                  label="All Status"
                  options={POST_STATUS_OPTIONS}
                  value={postStatus}
                  onChange={setPostStatus}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[920px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[
                      "Campaign ID",
                      "Activity Title",
                      "Type",
                      "Participants",
                      "Start/End Date",
                      "Outcome",
                      "Report Status",
                      "Action",
                    ].map((h) => (
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
                  {paLoading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-6 text-sm text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : paData?.results?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-6 text-sm text-gray-500"
                      >
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    paData?.results?.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-5 py-3 text-sm text-gray-600 font-medium">
                          {row.promotion_id ||
                            row.health_promotion_promotion_id ||
                            row.id?.substring(0, 8)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {row.promotion_title || "N/A"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">
                          {row.promotion_type || "N/A"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">
                          {row.number_of_participants}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {formatDateStr(row.created_at)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">
                          {row.outcome_summary}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
                            style={
                              POST_STATUS_STYLE[row.status] ||
                              POST_STATUS_STYLE.DRAFT
                            }
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <ActionMenu
                            onView={() => onViewPost(row)}
                            onExportCSV={() =>
                              downloadCSV(`post_activity_${row.id}.csv`, row)
                            }
                            onPrint={() =>
                              printDetails("Post Activity details", row)
                            }
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {paData && (
              <Pagination
                currentPage={postPage}
                totalPages={paData.total_pages}
                onPageChange={setPostPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Health Activity Form (New / View / Edit) ─────────────────────────────────

function HealthActivityForm({
  mode,
  initialData,
  onBack,
}: {
  mode: "new" | "view" | "edit";
  initialData?: HealthPromotion;
  onBack: () => void;
}) {
  const isView = mode === "view";
  const [currentMode, setCurrentMode] = useState(mode);

  const [sectionOpen, setSectionOpen] = useState(true);
  const [toasts, setToasts] = useState<string[]>([]);
  const addToast = (msg: string) => setToasts((prev) => [...prev, msg]);
  const removeToast = (i: number) =>
    setToasts((prev) => prev.filter((_, idx) => idx !== i));

  const createMutation = useCreateHealthPromotion();
  const updateMutation = useUpdateHealthPromotion();

  const [activityTitle, setActivityTitle] = useState(initialData?.title || "");
  const [type, setType] = useState(initialData?.type || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [targetAudience, setTargetAudience] = useState(
    initialData?.target_audience || "",
  );
  const [participants, setParticipants] = useState(
    initialData?.expected_participants || 0,
  );
  const [startDate, setStartDate] = useState(
    initialData?.start_date
      ? new Date(initialData.start_date).toISOString().split("T")[0]
      : "",
  );
  const [endDate, setEndDate] = useState(
    initialData?.end_date
      ? new Date(initialData.end_date).toISOString().split("T")[0]
      : "",
  );
  const [assignTo, setAssignTo] = useState<any[]>(
    initialData?.assigned_to_names?.map((u: any) => ({
      id: u.id,
      first_name: u.name,
      last_name: "",
    })) ||
      initialData?.assigned_to?.map((id: string) => ({
        id,
        first_name: "Staff",
        last_name: "Member",
      })) ||
      [],
  );
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [status, setStatus] = useState(initialData?.status || "DRAFT");

  const buildPayload = () => ({
    title: activityTitle,
    type,
    location,
    target_audience: targetAudience,
    expected_participants: participants,
    start_date: startDate ? new Date(startDate).toISOString() : undefined,
    end_date: endDate ? new Date(endDate).toISOString() : undefined,
    assigned_to: assignTo.map((s) => s.id),
    description,
    status,
  });

  const handleSubmit = (finalStatus: string) => {
    setStatus(finalStatus);
    const payload = { ...buildPayload(), status: finalStatus };

    if (currentMode === "new") {
      createMutation.mutate(payload, {
        onSuccess: () => {
          addToast("Activity Created Successfully");
          setTimeout(() => onBack(), 2000);
        },
      });
    } else if (initialData) {
      updateMutation.mutate(
        { id: initialData.id, payload },
        {
          onSuccess: () => {
            addToast("Activity Updated Successfully");
            setTimeout(() => onBack(), 2000);
          },
        },
      );
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <ChewDashboardHeader
        title="Health Promotion"
        breadcrumbs={[
          { label: "Chew Dashboard" },
          { label: "Health Promotion" },
          {
            label:
              currentMode === "new"
                ? "New Activity"
                : currentMode === "edit"
                  ? "Edit Activity"
                  : "View Activity",
            active: true,
          },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#046C3F] hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentMode === "new"
              ? "Create a Health promotion activity"
              : currentMode === "edit"
                ? "Edit Activity"
                : "View Activity"}
          </h1>
          {currentMode === "view" && initialData && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCurrentMode("edit")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Pencil size={15} /> Edit Activity
              </button>
              <ExportMenuButton
                onExportCSV={() =>
                  downloadCSV(`campaign_${initialData.id}.csv`, initialData)
                }
                onPrint={() =>
                  printDetails("Health Promotion details", initialData)
                }
              />
            </div>
          )}
        </div>

        <TabsBar active="health" />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-gray-100 cursor-pointer"
            onClick={() => setSectionOpen((v) => !v)}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#E8F7F0" }}
              >
                <TrendingUp size={16} color="#046C3F" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">
                {currentMode === "new"
                  ? "Create a new activity"
                  : currentMode === "edit"
                    ? "Edit activity"
                    : "View activity"}
              </h2>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              {sectionOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>

          {sectionOpen && (
            <div className="px-6 py-6 space-y-4">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <FormField
                  label="Activity title"
                  value={activityTitle}
                  onChange={
                    currentMode === "view" ? undefined : setActivityTitle
                  }
                  placeholder="e.g Malaria prevention awareness"
                  disabled={currentMode === "view"}
                />
                <FormField
                  label="Campaign ID"
                  value={initialData?.promotion_id || initialData?.id || ""}
                  placeholder="Auto-generated"
                  disabled
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <FormSelect
                  label="Type"
                  value={type}
                  onChange={setType}
                  options={TYPE_OPTIONS}
                  disabled={currentMode === "view"}
                />
                <FormField
                  label="Location"
                  value={location}
                  onChange={currentMode === "view" ? undefined : setLocation}
                  placeholder="e.g Gwagwalada market"
                  disabled={currentMode === "view"}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <FormField
                  label="Target audience"
                  value={targetAudience}
                  onChange={
                    currentMode === "view" ? undefined : setTargetAudience
                  }
                  placeholder="e.g Pregnant women"
                  disabled={currentMode === "view"}
                />
                <NumberStepper
                  label="Expected Participants"
                  value={participants}
                  onChange={setParticipants}
                  disabled={currentMode === "view"}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <FormField
                  label="Start Date"
                  value={startDate}
                  onChange={currentMode === "view" ? undefined : setStartDate}
                  type="date"
                  disabled={currentMode === "view"}
                />
                <FormField
                  label="End Date"
                  value={endDate}
                  onChange={currentMode === "view" ? undefined : setEndDate}
                  type="date"
                  disabled={currentMode === "view"}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                {currentMode !== "new" && (
                  <SearchableFormSelect
                    label="Created by"
                    value={
                      initialData?.created_by_name ||
                      initialData?.created_by ||
                      ""
                    }
                    onChange={() => {}}
                    options={[]}
                    disabled
                  />
                )}
                <div
                  style={{
                    gridColumn: currentMode === "new" ? "1 / span 2" : "auto",
                  }}
                >
                  <MultiSearchableStaffSelect
                    label="Assign to"
                    value={assignTo}
                    onChange={setAssignTo}
                    disabled={currentMode === "view"}
                  />
                </div>
              </div>
              <FormTextarea
                label="Description"
                value={description}
                onChange={currentMode === "view" ? undefined : setDescription}
                placeholder="Briefly describe the activity and key outcome..."
                disabled={currentMode === "view"}
              />

              {currentMode !== "view" && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={onBack}
                    disabled={isSaving}
                    className="px-8 py-2.5 rounded-xl text-sm font-semibold text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmit("DRAFT")}
                    disabled={isSaving}
                    className="px-8 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={() => handleSubmit(currentMode === "new" || status === "DRAFT" ? "SCHEDULED" : status)}
                    disabled={isSaving}
                    className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2"
                    style={{ background: "#046C3F" }}
                  >
                    {isSaving ? (
                      "Saving..."
                    ) : currentMode === "new" || status === "DRAFT" ? (
                      "Submit Activity"
                    ) : (
                      <>
                        <RefreshCw size={15} /> Update Changes
                      </>
                    )}
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

// ── Post Activity Form (New / View / Edit) ────────────────────────────────────

function PostActivityForm({
  mode,
  initialData,
  onBack,
}: {
  mode: "new" | "view" | "edit";
  initialData?: PostActivityReport;
  onBack: () => void;
}) {
  const isView = mode === "view";
  const [currentMode, setCurrentMode] = useState(mode);

  const [section1Open, setSection1Open] = useState(true);
  const [section2Open, setSection2Open] = useState(true);
  const [toasts, setToasts] = useState<string[]>([]);
  const addToast = (msg: string) => setToasts((prev) => [...prev, msg]);
  const removeToast = (i: number) =>
    setToasts((prev) => prev.filter((_, idx) => idx !== i));

  const createMutation = useCreatePostActivity();
  const updateMutation = useUpdatePostActivity();

  // Activity fields (from linked HealthPromotion - for UI mostly, we just need to send health_promotion id)
  const [healthPromotion, setHealthPromotion] = useState(
    initialData?.health_promotion || "",
  );
  const [healthPromotionDisplay, setHealthPromotionDisplay] = useState(
    initialData?.health_promotion_promotion_id || "",
  );
  const [activityTitle, setActivityTitle] = useState(
    initialData?.promotion_title || "",
  );

  // Participation fields
  const [numParticipants, setNumParticipants] = useState(
    initialData?.number_of_participants || 0,
  );
  const [maleCount, setMaleCount] = useState(initialData?.male_count || 0);
  const [femaleCount, setFemaleCount] = useState(
    initialData?.female_count || 0,
  );
  const [followUp, setFollowUp] = useState(
    initialData?.follow_up_required || false,
  );
  const [keyMessages, setKeyMessages] = useState(
    initialData?.key_messages_delivered || "",
  );
  const [outcomeSummary, setOutcomeSummary] = useState(
    initialData?.outcome_summary || "",
  );
  const [challenges, setChallenges] = useState(initialData?.challenges || "");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");

  const buildPayload = () => ({
    health_promotion: healthPromotion,
    number_of_participants: numParticipants,
    male_count: maleCount,
    female_count: femaleCount,
    follow_up_required: followUp,
    key_messages_delivered: keyMessages,
    outcome_summary: outcomeSummary,
    challenges,
    status,
  });

  const handleSubmit = (finalStatus: string) => {
    if (maleCount + femaleCount !== numParticipants) {
      addToast("Error: Male and Female count must equal Total Participants.");
      return;
    }
    setStatus(finalStatus);
    const payload = { ...buildPayload(), status: finalStatus };

    if (currentMode === "new") {
      createMutation.mutate(payload, {
        onSuccess: () => {
          addToast("Post Activity Submitted Successfully");
          setTimeout(() => onBack(), 2000);
        },
      });
    } else if (initialData) {
      updateMutation.mutate(
        { id: initialData.id, payload },
        {
          onSuccess: () => {
            addToast("Post Activity Updated Successfully");
            setTimeout(() => onBack(), 2000);
          },
        },
      );
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <ChewDashboardHeader
        title="Health Promotion"
        breadcrumbs={[
          { label: "Chew Dashboard" },
          { label: "Health Promotion" },
          {
            label:
              currentMode === "new"
                ? "New Post Activity"
                : currentMode === "edit"
                  ? "Edit Post Activity"
                  : "View Post Activity",
            active: true,
          },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#046C3F] hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Post Activity Form
          </h1>
          {currentMode === "view" && initialData && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCurrentMode("edit")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Pencil size={15} /> Edit Activity
              </button>
              <ExportMenuButton
                onExportCSV={() =>
                  downloadCSV(
                    `post_activity_${initialData.id}.csv`,
                    initialData,
                  )
                }
                onPrint={() =>
                  printDetails("Post Activity details", initialData)
                }
              />
            </div>
          )}
        </div>

        <TabsBar active="post" />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-gray-100 cursor-pointer"
            onClick={() => setSection1Open((v) => !v)}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#E8F7F0" }}
              >
                <TrendingUp size={16} color="#046C3F" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">
                {currentMode === "view"
                  ? "View post activity"
                  : "Record Post Activity"}
              </h2>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              {section1Open ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>

          {section1Open && (
            <div className="px-6 py-6 space-y-4">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <SearchableHealthPromotionSelect
                  label="Health Promotion Activity"
                  value={healthPromotion}
                  displayValue={healthPromotionDisplay || activityTitle}
                  onChange={(id, title, pid) => {
                    setHealthPromotion(id);
                    setActivityTitle(title);
                    setHealthPromotionDisplay(pid);
                  }}
                  disabled={currentMode === "view"}
                />
                <FormField
                  label="Activity Title"
                  value={activityTitle}
                  onChange={() => {}}
                  placeholder="Auto-Fill"
                  disabled
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-gray-100 cursor-pointer"
            onClick={() => setSection2Open((v) => !v)}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#E8F7F0" }}
              >
                <TrendingUp size={16} color="#046C3F" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">
                Participation Data
              </h2>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              {section2Open ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>

          {section2Open && (
            <div className="px-6 py-6 space-y-4">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <NumberStepper
                  label="Number of Participants"
                  value={numParticipants}
                  onChange={setNumParticipants}
                  disabled={currentMode === "view"}
                />
                <NumberStepper
                  label="Male Count"
                  value={maleCount}
                  onChange={setMaleCount}
                  disabled={currentMode === "view"}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <NumberStepper
                  label="Female Count"
                  value={femaleCount}
                  onChange={setFemaleCount}
                  disabled={currentMode === "view"}
                />
                <div className="flex flex-col gap-1.5 px-1">
                  <button
                    className="flex items-center gap-2"
                    onClick={() =>
                      currentMode !== "view" && setFollowUp((v) => !v)
                    }
                    disabled={currentMode === "view"}
                  >
                    <div
                      className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                      style={
                        followUp
                          ? { background: "#046C3F", borderColor: "#046C3F" }
                          : { borderColor: "#D1D5DB" }
                      }
                    >
                      {followUp && (
                        <Check size={10} color="#fff" strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Follow up
                    </span>
                  </button>
                  <p className="text-xs text-gray-400">Referrals Made</p>
                </div>
              </div>
              <FormTextarea
                label="Key Messages Delivered"
                value={keyMessages}
                onChange={currentMode === "view" ? undefined : setKeyMessages}
                placeholder="e.g. Hygiene, Vaccination awareness"
                disabled={currentMode === "view"}
              />
              <FormTextarea
                label="Outcome Summary"
                value={outcomeSummary}
                onChange={
                  currentMode === "view" ? undefined : setOutcomeSummary
                }
                placeholder="e.g. Increased awareness"
                disabled={currentMode === "view"}
              />
              <FormTextarea
                label="Challenges"
                value={challenges}
                onChange={currentMode === "view" ? undefined : setChallenges}
                placeholder="Challenges Faced"
                disabled={currentMode === "view"}
              />

              {currentMode !== "view" && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={onBack}
                    disabled={isSaving}
                    className="px-8 py-2.5 rounded-xl text-sm font-semibold text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmit("DRAFT")}
                    disabled={isSaving}
                    className="px-8 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={() =>
                      handleSubmit(currentMode === "new" || status === "DRAFT" ? "SUBMITTED" : status)
                    }
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                    style={{ background: "#046C3F" }}
                  >
                    {isSaving ? (
                      "Saving..."
                    ) : currentMode === "new" || status === "DRAFT" ? (
                      <>
                        <Send size={15} /> Submit
                      </>
                    ) : (
                      <>
                        <RefreshCw size={15} /> Update Changes
                      </>
                    )}
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

type ViewState =
  | "list"
  | "new-activity"
  | "new-post"
  | "view-post"
  | "edit-post"
  | "view-activity"
  | "edit-activity";

export default function ChewHealthPromotion() {
  const searchParams = useSearchParams();
  const initialView = (searchParams.get("view") as ViewState) ?? "list";
  const [view, setView] = useState<ViewState>(initialView);

  const [selectedActivity, setSelectedActivity] =
    useState<HealthPromotion | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostActivityReport | null>(
    null,
  );

  const idParam = searchParams.get("id");

  const { data: fetchedActivity, isLoading: activityLoading } = useHealthPromotion(idParam && (view === "view-activity" || view === "edit-activity") ? idParam : "");
  const { data: fetchedPost, isLoading: postLoading } = usePostActivity(idParam && (view === "view-post" || view === "edit-post") ? idParam : "");

  const activeActivity = selectedActivity || fetchedActivity;
  const activePost = selectedPost || fetchedPost;

  if (view === "new-activity")
    return <HealthActivityForm mode="new" onBack={() => setView("list")} />;
  if (view === "new-post")
    return <PostActivityForm mode="new" onBack={() => setView("list")} />;

  if ((view === "view-post" || view === "edit-post") && idParam && postLoading) {
    return <div className="p-8 text-center text-gray-500">Loading details...</div>;
  }
  if (view === "view-post" && activePost)
    return (
      <PostActivityForm
        mode="view"
        initialData={activePost}
        onBack={() => setView("list")}
      />
    );
  if (view === "edit-post" && activePost)
    return (
      <PostActivityForm
        mode="edit"
        initialData={activePost}
        onBack={() => setView("list")}
      />
    );

  if ((view === "view-activity" || view === "edit-activity") && idParam && activityLoading) {
    return <div className="p-8 text-center text-gray-500">Loading details...</div>;
  }
  if (view === "view-activity" && activeActivity)
    return (
      <HealthActivityForm
        mode="view"
        initialData={activeActivity}
        onBack={() => setView("list")}
      />
    );
  if (view === "edit-activity" && activeActivity)
    return (
      <HealthActivityForm
        mode="edit"
        initialData={activeActivity}
        onBack={() => setView("list")}
      />
    );

  return (
    <HealthPromotionList
      onNewActivity={() => setView("new-activity")}
      onNewPost={() => setView("new-post")}
      onViewPost={(row) => {
        setSelectedPost(row);
        setView("view-post");
      }}
      onViewActivity={(row) => {
        setSelectedActivity(row);
        setView("view-activity");
      }}
    />
  );
}
