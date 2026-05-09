"use client";

import { useEffect, useRef, useState } from "react";
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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
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
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 lg:absolute lg:top-full lg:mt-2 lg:left-1/2 lg:-translate-y-0 origin-top">
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
