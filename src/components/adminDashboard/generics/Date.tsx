"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDateFilterProps {
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

const getPredefinedDates = (option: string) => {
  const today = new Date();
  let start = new Date(today);
  let end = new Date(today);

  switch (option) {
    case "This Week":
      const day = today.getDay() || 7;
      start.setDate(today.getDate() - (day - 1));
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
    case "Last Week":
      const lastWeekDay = today.getDay() || 7;
      start.setDate(today.getDate() - (lastWeekDay - 1) - 7);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
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
  return { start: formatToYYYYMMDD(start), end: formatToYYYYMMDD(end) };
};

export default function CustomDateFilter({
  onApply,
  onClear,
}: CustomDateFilterProps) {
  const [selectedPredefined, setSelectedPredefined] = useState("");
  const [isDateRangeEnabled, setIsDateRangeEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("From");

  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [startDay, setStartDay] = useState<number | null>(null);
  const [endDay, setEndDay] = useState<number | null>(null);
  const [hoverDay, setHoverDay] = useState<number | null>(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const calendarDays = [
    ...Array(adjustedFirstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const handleDayClick = (day: number) => {
    if (!startDay || (startDay && endDay)) {
      setStartDay(day);
      setEndDay(null);
    } else if (day === startDay) {
      setStartDay(null);
      setEndDay(null);
    } else if (day > startDay) {
      setEndDay(day);
    } else {
      setEndDay(startDay);
      setStartDay(day);
    }
  };

  const nextMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const prevMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));

  const handleApplyClick = () => {
    if (!isDateRangeEnabled && selectedPredefined) {
      const { start, end } = getPredefinedDates(selectedPredefined);
      onApply(start, end);
    } else if (isDateRangeEnabled && startDay) {
      const startStr = formatToYYYYMMDD(
        new Date(currentYear, currentMonth, startDay),
      );
      const endStr = endDay
        ? formatToYYYYMMDD(new Date(currentYear, currentMonth, endDay))
        : startStr;
      onApply(startStr, endStr);
    }
  };

  const handleClearClick = () => {
    setSelectedPredefined("");
    setIsDateRangeEnabled(true);
    setStartDay(null);
    setEndDay(null);
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

  const renderDay = (day: number | null, index: number) => {
    if (!day) return <div key={`empty-${index}`} className="h-8" />;

    const isStart = day === startDay;
    const isEnd = day === endDay;
    const previewEnd =
      startDay && !endDay && hoverDay && hoverDay > startDay ? hoverDay : null;
    const effectiveEnd = endDay ?? previewEnd;
    const isBetween =
      startDay && effectiveEnd ? day > startDay && day < effectiveEnd : false;
    const isPreview = !endDay && day === previewEnd;

    return (
      <div
        key={day}
        className="relative h-8 flex items-center justify-center cursor-pointer"
        onClick={() => handleDayClick(day)}
        onMouseEnter={() => setHoverDay(day)}
        onMouseLeave={() => setHoverDay(null)}
      >
        {isBetween && <div className="absolute inset-0 bg-[#EDF7F0]" />}
        {isStart && effectiveEnd && (
          <div className="absolute right-0 w-1/2 h-full bg-[#EDF7F0]" />
        )}
        {(isEnd || isPreview) && (
          <div className="absolute left-0 w-1/2 h-full bg-[#EDF7F0]" />
        )}
        <div
          className={`
          relative z-10 flex items-center justify-center w-7 h-7 text-xs font-medium transition-all duration-100
          ${isStart || isEnd ? "bg-[#2A6543] text-white rounded-full" : ""}
          ${isPreview ? "bg-[#2A6543]/40 text-white rounded-full" : ""}
          ${!isStart && !isEnd && !isPreview ? "text-gray-600 hover:bg-gray-100 hover:rounded-full" : ""}
        `}
        >
          {day}
        </div>
      </div>
    );
  };

  return (
    <div className="w-72 sm:w-[680px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 font-sans overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <span className="text-sm font-bold text-gray-800">Filter by Date</span>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab("From")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "From"
                ? "bg-[#2A6543] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            From
          </button>
          <button
            onClick={() => setActiveTab("To")}
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

      <div className="flex flex-col sm:flex-row divide-y divide-gray-100 sm:divide-y-0 sm:divide-x sm:divide-gray-100">
        <div className="sm:w-44 sm:shrink-0 p-3 sm:p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Quick Select
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
            {predefinedOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSelectedPredefined(option);
                  setIsDateRangeEnabled(false);
                  setStartDay(null);
                  setEndDay(null);
                }}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium w-full text-left transition-colors ${
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
                  <span className="w-2.5 shrink-0 hidden sm:block" />
                )}
                <span className="truncate">{option}</span>
              </button>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => {
                setIsDateRangeEnabled(!isDateRangeEnabled);
                setSelectedPredefined("");
              }}
              className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg text-xs font-semibold w-full text-left transition-colors ${
                isDateRangeEnabled
                  ? "bg-[#E8F5EE] text-[#2A6543]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  isDateRangeEnabled
                    ? "bg-[#2A6543] border-[#2A6543]"
                    : "border-gray-300"
                }`}
              >
                {isDateRangeEnabled && (
                  <Check size={9} className="text-white" strokeWidth={3} />
                )}
              </div>
              Custom Range
            </button>
          </div>
        </div>

        <div
          className={`flex-1 p-3 sm:p-4 transition-opacity duration-200 ${isDateRangeEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}
        >
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

      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/60">
        <button
          onClick={handleClearClick}
          className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors px-2 py-1"
        >
          Clear Filter
        </button>
        <button
          onClick={handleApplyClick}
          disabled={isDateRangeEnabled && !startDay}
          className="px-6 py-2 bg-[#2A6543] disabled:opacity-50 hover:bg-[#235337] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}
