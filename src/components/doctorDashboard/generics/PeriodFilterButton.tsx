"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Check, Calendar } from "lucide-react";

// ── Calendar ──────────────────────────────────────────────────────────────────

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_HEADERS = ["M","T","W","T","F","S","S"];

interface CalendarProps {
  selected: string;
  secondarySelected?: string;
  onSelect: (date: string) => void;
}

export function CalendarPicker({ selected, secondarySelected, onSelect }: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isMatch = (dateStr: string, d: number) => {
    if (!dateStr) return false;
    const parts = dateStr.split("-").map(Number);
    return parts[0] === year && parts[1] - 1 === month && parts[2] === d;
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft size={14} className="text-gray-500" />
        </button>
        <div className="flex items-center gap-2">
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="text-xs font-semibold text-gray-700 bg-transparent border-none outline-none cursor-pointer"
          >
            {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 4 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="text-xs font-semibold text-gray-700 bg-transparent border-none outline-none cursor-pointer"
          >
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
        </div>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight size={14} className="text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const isPrimary = isMatch(selected, day);
          const isSecondary = isMatch(secondarySelected ?? "", day);
          const isAnySelected = isPrimary || isSecondary;
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          return (
            <button
              key={i}
              onClick={() => onSelect(dateStr)}
              className={`mx-auto w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors ${
                isAnySelected
                  ? "bg-[#046C3F] text-white"
                  : isToday
                  ? "bg-[#E8F7F0] text-[#046C3F] font-bold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── PeriodFilterButton (stat card variant) ────────────────────────────────────

const PERIOD_OPTIONS = [
  ["This Week", "Last Week"],
  ["This Month", "Last Month"],
  ["This Year", "Last Year"],
];

const MENU_WIDTH = 288;

interface PeriodFilterButtonProps {
  label?: string;
}

export function PeriodFilterButton({ label = "This Week" }: PeriodFilterButtonProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  const [useRange, setUseRange] = useState(false);
  const [rangeMode, setRangeMode] = useState<"from" | "to">("from");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, maxHeight: 480 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const openDropdown = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      let left = rect.left;
      if (left + MENU_WIDTH > window.innerWidth) {
        left = Math.max(8, rect.right - MENU_WIDTH);
      }
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const spaceAbove = rect.top - 8;
      const top = spaceBelow >= 200 ? rect.bottom + 4 : rect.top - Math.min(spaceAbove, 480) - 4;
      const maxHeight = spaceBelow >= 200 ? Math.max(spaceBelow, 200) : Math.min(spaceAbove, 480);
      setCoords({ top, left, maxHeight });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [open]);

  const displayLabel = useRange && fromDate && toDate
    ? `${fromDate} → ${toDate}`
    : useRange
    ? "Date Range"
    : selected;

  return (
    <>
      <button
        ref={btnRef}
        onClick={openDropdown}
        className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap"
      >
        {displayLabel}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {mounted && open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: MENU_WIDTH, zIndex: 9999, maxHeight: coords.maxHeight, display: "flex", flexDirection: "column" }}
          className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.14)]"
        >
          <div style={{ overflowY: "auto", flex: 1, padding: "1rem 1rem 0" }}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">By Date</p>
            <div className="space-y-2 mb-4">
              {PERIOD_OPTIONS.map(([left, right]) => (
                <div key={left} className="grid grid-cols-2 gap-2">
                  {[left, right].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelected(opt); setUseRange(false); }}>
                      <div
                        className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                        style={selected === opt && !useRange ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}
                      >
                        {selected === opt && !useRange && <Check size={10} color="#fff" strokeWidth={3} />}
                      </div>
                      <span className="text-sm text-gray-600 select-none">{opt}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>

            <label className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => setUseRange(!useRange)}>
              <div
                className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                style={useRange ? { background: "#046C3F", borderColor: "#046C3F" } : { borderColor: "#D1D5DB" }}
              >
                {useRange && <Check size={10} color="#fff" strokeWidth={3} />}
              </div>
              <span className="text-sm font-semibold text-gray-700 select-none">Date Range</span>
            </label>

            {useRange && (
              <div className="mb-4">
                <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-3">
                  <button
                    onClick={() => setRangeMode("from")}
                    className="flex-1 py-2 text-sm font-semibold transition-colors"
                    style={rangeMode === "from" ? { background: "#046C3F", color: "#fff" } : { background: "#F9FAFB", color: "#6B7280" }}
                  >
                    From
                  </button>
                  <button
                    onClick={() => setRangeMode("to")}
                    className="flex-1 py-2 text-sm font-semibold transition-colors"
                    style={rangeMode === "to" ? { background: "#046C3F", color: "#fff" } : { background: "#F9FAFB", color: "#6B7280" }}
                  >
                    To
                  </button>
                </div>
                <CalendarPicker
                  selected={rangeMode === "from" ? fromDate : toDate}
                  secondarySelected={rangeMode === "from" ? toDate : fromDate}
                  onSelect={d => rangeMode === "from" ? setFromDate(d) : setToDate(d)}
                />
              </div>
            )}
          </div>

          <div className="p-4 pt-3">
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2.5 text-white text-sm font-semibold rounded-xl"
              style={{ background: "#046C3F" }}
            >
              Filter
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── DateRangeButton (profile tab filter variant) ──────────────────────────────

interface DateRangeButtonProps {
  label?: string;
}

export function DateRangeButton({ label = "Date Range" }: DateRangeButtonProps) {
  const [open, setOpen] = useState(false);
  const [rangeMode, setRangeMode] = useState<"from" | "to">("from");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, maxHeight: 420 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const openDropdown = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      let left = rect.left;
      if (left + MENU_WIDTH > window.innerWidth) {
        left = Math.max(8, rect.right - MENU_WIDTH);
      }
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const spaceAbove = rect.top - 8;
      const top = spaceBelow >= 200 ? rect.bottom + 4 : rect.top - Math.min(spaceAbove, 420) - 4;
      const maxHeight = spaceBelow >= 200 ? Math.max(spaceBelow, 200) : Math.min(spaceAbove, 420);
      setCoords({ top, left, maxHeight });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [open]);

  const displayLabel = fromDate && toDate
    ? `${fromDate} → ${toDate}`
    : label;

  return (
    <>
      <button
        ref={btnRef}
        onClick={openDropdown}
        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        <Calendar size={13} className="text-gray-400" />
        {displayLabel}
      </button>

      {mounted && open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: MENU_WIDTH, zIndex: 9999, maxHeight: coords.maxHeight, display: "flex", flexDirection: "column" }}
          className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.14)]"
        >
          <div style={{ overflowY: "auto", flex: 1, padding: "1rem 1rem 0" }}>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-3">
              <button
                onClick={() => setRangeMode("from")}
                className="flex-1 py-2 text-sm font-semibold transition-colors"
                style={rangeMode === "from" ? { background: "#046C3F", color: "#fff" } : { background: "#F9FAFB", color: "#6B7280" }}
              >
                From
              </button>
              <button
                onClick={() => setRangeMode("to")}
                className="flex-1 py-2 text-sm font-semibold transition-colors"
                style={rangeMode === "to" ? { background: "#046C3F", color: "#fff" } : { background: "#F9FAFB", color: "#6B7280" }}
              >
                To
              </button>
            </div>
            <CalendarPicker
              selected={rangeMode === "from" ? fromDate : toDate}
              secondarySelected={rangeMode === "from" ? toDate : fromDate}
              onSelect={d => rangeMode === "from" ? setFromDate(d) : setToDate(d)}
            />
          </div>
          <div className="p-4 pt-3">
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2.5 text-white text-sm font-semibold rounded-xl"
              style={{ background: "#046C3F" }}
            >
              Filter
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
