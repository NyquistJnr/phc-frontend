"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDateFilterProps {
  initialStartDate?: string;
  initialEndDate?: string;
  onApply: (startDate: string, endDate: string) => void;
  onClear: () => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatToYYYYMMDD = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseDateSafe = (dateStr?: string) => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  return null;
};

const getPredefinedDates = (option: string): { start: Date; end: Date } => {
  const today = new Date();
  let start = new Date(today);
  let end = new Date(today);

  switch (option) {
    case "This Week": {
      const day = today.getDay() || 7;
      start.setDate(today.getDate() - (day - 1));
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
    }
    case "Last Week": {
      const lastWeekDay = today.getDay() || 7;
      start.setDate(today.getDate() - (lastWeekDay - 1) - 7);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
    }
    case "This Month":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case "Last Month":
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "This Year":
      start = new Date(today.getFullYear(), 0, 1);
      end = new Date(today.getFullYear(), 11, 31);
      break;
    case "Last Year":
      start = new Date(today.getFullYear() - 1, 0, 1);
      end = new Date(today.getFullYear() - 1, 11, 31);
      break;
  }
  return { start, end };
};

export default function CustomDateFilter({
  initialStartDate,
  initialEndDate,
  onApply,
  onClear,
}: CustomDateFilterProps) {
  const [selectedPredefined, setSelectedPredefined] = useState("");
  const [activeTab, setActiveTab] = useState("From");

  const [currentDate, setCurrentDate] = useState(() => {
    const d = parseDateSafe(initialStartDate);
    return d ? d : new Date();
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [startDate, setStartDate] = useState<Date | null>(() =>
    parseDateSafe(initialStartDate),
  );
  const [endDate, setEndDate] = useState<Date | null>(() =>
    parseDateSafe(initialEndDate),
  );
  const [hoverDay, setHoverDay] = useState<number | null>(null);

  const startDay =
    startDate &&
    startDate.getFullYear() === currentYear &&
    startDate.getMonth() === currentMonth
      ? startDate.getDate()
      : null;

  const endDay =
    endDate &&
    endDate.getFullYear() === currentYear &&
    endDate.getMonth() === currentMonth
      ? endDate.getDate()
      : null;

  const isInRange = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    if (startDate && endDate) return d > startDate && d < endDate;
    if (startDate && !endDate && hoverDay) {
      const hoverDate = new Date(currentYear, currentMonth, hoverDay);
      if (hoverDate > startDate) return d > startDate && d < hoverDate;
    }
    return false;
  };

  const isStart = (day: number) => {
    if (!startDate) return false;
    return (
      startDate.getFullYear() === currentYear &&
      startDate.getMonth() === currentMonth &&
      startDate.getDate() === day
    );
  };

  const isEnd = (day: number) => {
    if (!endDate) return false;
    return (
      endDate.getFullYear() === currentYear &&
      endDate.getMonth() === currentMonth &&
      endDate.getDate() === day
    );
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const calendarDays = [
    ...Array(adjustedFirstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const handleDayClick = (day: number) => {
    setSelectedPredefined("");

    const clicked = new Date(currentYear, currentMonth, day);

    if (!startDate || (startDate && endDate)) {
      setStartDate(clicked);
      setEndDate(null);
    } else if (clicked.getTime() === startDate.getTime()) {
      setStartDate(null);
      setEndDate(null);
    } else if (clicked > startDate) {
      setEndDate(clicked);
    } else {
      setEndDate(startDate);
      setStartDate(clicked);
    }
  };

  const handlePredefinedClick = (option: string) => {
    setSelectedPredefined(option);
    const { start, end } = getPredefinedDates(option);
    setStartDate(start);
    setEndDate(end);
    setCurrentDate(new Date(start.getFullYear(), start.getMonth(), 1));
  };

  const nextMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const prevMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));

  const handleApplyClick = () => {
    if (startDate) {
      const startStr = formatToYYYYMMDD(startDate);
      const endStr = endDate ? formatToYYYYMMDD(endDate) : startStr;
      onApply(startStr, endStr);
    }
  };

  const handleClearClick = () => {
    setSelectedPredefined("");
    setStartDate(null);
    setEndDate(null);
    onClear();
  };

  const predefinedOptions = [
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "This Year",
    "Last Year",
  ];

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const rangeStartsBeforeMonth = startDate
    ? startDate < new Date(currentYear, currentMonth, 1)
    : false;
  const rangeEndsAfterMonth = endDate
    ? endDate > new Date(currentYear, currentMonth + 1, 0)
    : false;

  const renderDay = (day: number | null, index: number) => {
    if (!day) return <div key={`empty-${index}`} className="h-8" />;

    const dayIsStart = isStart(day);
    const dayIsEnd = isEnd(day);
    const dayInRange = isInRange(day);

    const isFirstDay = day === 1;
    const isLastDay = day === daysInMonth;
    const effectiveStart =
      dayIsStart || (rangeStartsBeforeMonth && isFirstDay && endDate !== null);
    const effectiveEnd =
      dayIsEnd || (rangeEndsAfterMonth && isLastDay && startDate !== null);
    const fullyInRange =
      dayInRange ||
      (rangeStartsBeforeMonth && rangeEndsAfterMonth) ||
      (rangeStartsBeforeMonth &&
        endDate &&
        new Date(currentYear, currentMonth, day) < endDate!) ||
      (rangeEndsAfterMonth &&
        startDate &&
        new Date(currentYear, currentMonth, day) > startDate!);

    const hoverDate = hoverDay
      ? new Date(currentYear, currentMonth, hoverDay)
      : null;
    const isPreview =
      !endDate &&
      hoverDate &&
      startDate &&
      hoverDate > startDate &&
      day === hoverDay;

    return (
      <div
        key={day}
        className="relative h-8 flex items-center justify-center cursor-pointer"
        onClick={() => handleDayClick(day)}
        onMouseEnter={() => setHoverDay(day)}
        onMouseLeave={() => setHoverDay(null)}
      >
        {(dayInRange || (fullyInRange && !dayIsStart && !dayIsEnd)) && (
          <div className="absolute inset-0 bg-[#EDF7F0]" />
        )}
        {(dayIsStart || effectiveStart) && (endDate || rangeEndsAfterMonth) && (
          <div className="absolute right-0 w-1/2 h-full bg-[#EDF7F0]" />
        )}
        {(dayIsEnd || effectiveEnd) &&
          (startDate || rangeStartsBeforeMonth) && (
            <div className="absolute left-0 w-1/2 h-full bg-[#EDF7F0]" />
          )}
        {isPreview && (
          <div className="absolute left-0 w-1/2 h-full bg-[#EDF7F0]" />
        )}
        <div
          className={`
            relative z-10 flex items-center justify-center w-7 h-7 text-xs font-medium transition-all duration-100
            ${dayIsStart || dayIsEnd ? "bg-[#2A6543] text-white rounded-full" : ""}
            ${effectiveStart && !dayIsStart ? "bg-[#2A6543] text-white rounded-full" : ""}
            ${effectiveEnd && !dayIsEnd ? "bg-[#2A6543] text-white rounded-full" : ""}
            ${isPreview ? "bg-[#2A6543]/40 text-white rounded-full" : ""}
            ${
              !dayIsStart &&
              !dayIsEnd &&
              !effectiveStart &&
              !effectiveEnd &&
              !isPreview
                ? "text-gray-600 hover:bg-gray-100 hover:rounded-full"
                : ""
            }
          `}
        >
          {day}
        </div>
      </div>
    );
  };

  return (
    <div className="w-[290px] md:w-[680px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-100 font-sans overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <span className="text-sm font-bold text-gray-800">Filter by Date</span>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => {
              setActiveTab("From");
              if (startDate)
                setCurrentDate(
                  new Date(startDate.getFullYear(), startDate.getMonth(), 1),
                );
            }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "From"
                ? "bg-[#2A6543] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            From
          </button>
          <button
            onClick={() => {
              setActiveTab("To");
              if (endDate)
                setCurrentDate(
                  new Date(endDate.getFullYear(), endDate.getMonth(), 1),
                );
            }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "To"
                ? "bg-[#2A6543] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            To
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row divide-y divide-gray-100 md:divide-y-0 md:divide-x md:divide-gray-100 max-h-[60vh] md:max-h-none overflow-y-auto">
        <div className="md:w-44 md:shrink-0 p-3 md:p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Quick Select
          </p>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-1">
            {predefinedOptions.map((option) => (
              <button
                key={option}
                onClick={() => handlePredefinedClick(option)}
                className={`flex items-center gap-1.5 px-2 md:px-3 py-2 rounded-lg text-xs font-medium w-full text-left transition-colors ${
                  selectedPredefined === option
                    ? "bg-[#E8F5EE] text-[#2A6543]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {selectedPredefined === option ? (
                  <Check
                    size={11}
                    className="shrink-0 text-[#2A6543]"
                    strokeWidth={3}
                  />
                ) : (
                  <span className="w-2.5 shrink-0 hidden md:block" />
                )}
                <span className="truncate">{option}</span>
              </button>
            ))}
          </div>
          {startDate && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Selected
              </p>
              <p className="text-xs text-[#2A6543] font-medium">
                {startDate.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
                {endDate && endDate.getTime() !== startDate.getTime() && (
                  <>
                    {" "}
                    →{" "}
                    {endDate.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </>
                )}
                {(!endDate || endDate.getTime() === startDate.getTime()) && (
                  <>
                    {" "}
                    —{" "}
                    {startDate.toLocaleDateString("en-GB", { year: "numeric" })}
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 p-3 md:p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">
                {MONTHS[currentMonth]}
              </span>
              <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">
                {currentYear}
              </span>
            </div>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          {selectedPredefined && startDate && endDate && (
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[#2A6543]" />
              <p className="text-[10px] text-gray-400">
                Range spans{" "}
                {startDate.getMonth() === endDate.getMonth() &&
                startDate.getFullYear() === endDate.getFullYear()
                  ? "this month"
                  : `${MONTHS[startDate.getMonth()]} ${startDate.getFullYear()} → ${MONTHS[endDate.getMonth()]} ${endDate.getFullYear()}`}
                . Use ‹ › to browse.
              </p>
            </div>
          )}

          <div className="grid grid-cols-7 mb-1">
            {daysOfWeek.map((d, i) => (
              <div
                key={i}
                className="text-center text-[10px] font-bold text-gray-400 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => renderDay(day, index))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/60 sticky bottom-0">
        <button
          onClick={handleClearClick}
          className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors px-2 py-1"
        >
          Clear Filter
        </button>
        <button
          onClick={handleApplyClick}
          disabled={!startDate}
          className="px-6 py-2 bg-[#2A6543] disabled:opacity-50 hover:bg-[#235337] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}
