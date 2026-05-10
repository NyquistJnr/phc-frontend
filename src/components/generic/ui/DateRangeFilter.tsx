"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { CalendarDays } from "lucide-react";
import CustomDateFilter from "@/src/components/adminDashboard/generics/Date";

type DateRangeFilterProps = {
  startDate: string;
  endDate: string;
  label?: string;
  onApply: (startDate: string, endDate: string) => void;
  onClear: () => void;
};

export default function NurseDateRangeFilter({
  startDate,
  endDate,
  label = "Date Range",
  onApply,
  onClear,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});
  const hasFilter = Boolean(startDate || endDate);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !ref.current || !dropdownRef.current) return;

    const MARGIN = 16;
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dropW = Math.min(dropdownRef.current.offsetWidth, vw - MARGIN * 2);
      const dropH = Math.min(dropdownRef.current.offsetHeight, vh - MARGIN * 2);

      setDropdownStyle({
        position: "fixed",
        width: dropW,
        maxHeight: vh - MARGIN * 2,
        overflowY: "auto",
        left: (vw - dropW) / 2,
        top: (vh - dropH) / 2,
        transform: "none",
      });
    } else {
      const trigger = ref.current.getBoundingClientRect();
      const dropdownWidth = dropdownRef.current.offsetWidth;
      const vw = window.innerWidth;

      let left = 0;
      const rightEdge = trigger.left + dropdownWidth;
      if (rightEdge > vw - MARGIN) {
        left = -(rightEdge - vw + MARGIN);
      }
      if (trigger.left + left < MARGIN) {
        left = -trigger.left + MARGIN;
      }

      setDropdownStyle({ left });
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
          hasFilter
            ? "border-[#046C3F] bg-[#E8F7F0] text-[#046C3F]"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        <CalendarDays size={14} />
        <span>{hasFilter ? "Date Applied" : label}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/10 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            ref={dropdownRef}
            className="fixed z-[9999] lg:absolute lg:top-full lg:mt-2"
            style={dropdownStyle}
          >
            <CustomDateFilter
              initialStartDate={startDate}
              initialEndDate={endDate}
              onApply={(start, end) => {
                onApply(start, end);
                setOpen(false);
              }}
              onClear={() => {
                onClear();
                setOpen(false);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
