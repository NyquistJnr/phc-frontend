"use client";

import React, { useState } from 'react';
import { ChevronDown, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomDateFilter() {
  const [selectedPredefined, setSelectedPredefined] = useState('');
  const [isDateRangeEnabled, setIsDateRangeEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('From');
  const [startDay, setStartDay] = useState<number | null>(null);
  const [endDay, setEndDay] = useState<number | null>(null);
  const [hoverDay, setHoverDay] = useState<number | null>(null);

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

  const predefinedOptions = [
    'This Week', 'Last Week',
    'This Month', 'Last Month',
    'This Year', 'Last Year',
  ];

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const calendarDays = [
    null, null, null, null, null, null, 1,
    2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27, 28, 29,
    30,
  ];

  const renderDay = (day: number | null, index: number) => {
    if (!day) return <div key={`empty-${index}`} className="h-8" />;

    const isStart = day === startDay;
    const isEnd = day === endDay;
    // Preview end while hovering after a start is picked
    const previewEnd = startDay && !endDay && hoverDay && hoverDay > startDay ? hoverDay : null;
    const effectiveEnd = endDay ?? previewEnd;
    const isBetween = startDay && effectiveEnd ? day > startDay && day < effectiveEnd : false;
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
        {isStart && effectiveEnd && <div className="absolute right-0 w-1/2 h-full bg-[#EDF7F0]" />}
        {(isEnd || isPreview) && <div className="absolute left-0 w-1/2 h-full bg-[#EDF7F0]" />}
        <div className={`
          relative z-10 flex items-center justify-center w-7 h-7 text-xs font-medium transition-all duration-100
          ${isStart || isEnd ? 'bg-[#2A6543] text-white rounded-full' : ''}
          ${isPreview ? 'bg-[#2A6543]/40 text-white rounded-full' : ''}
          ${!isStart && !isEnd && !isPreview ? 'text-gray-600 hover:bg-gray-100 hover:rounded-full' : ''}
        `}>
          {day}
        </div>
      </div>
    );
  };

  return (
    <div className="w-72 sm:w-[680px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.10)] border border-gray-100 font-sans overflow-hidden">

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <span className="text-sm font-bold text-gray-800">Filter by Date</span>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('From')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'From' ? 'bg-[#2A6543] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            From
          </button>
          <button
            onClick={() => setActiveTab('To')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'To' ? 'bg-[#2A6543] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            To
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col sm:flex-row divide-y divide-gray-100 sm:divide-y-0 sm:divide-x sm:divide-gray-100">

        {/* Quick options — 2-col grid on mobile, vertical list on sm+ */}
        <div className="sm:w-44 sm:shrink-0 p-3 sm:p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Select</p>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
            {predefinedOptions.map((option) => (
              <button
                key={option}
                onClick={() => { setSelectedPredefined(option); setIsDateRangeEnabled(false); }}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium w-full text-left transition-colors ${
                  selectedPredefined === option
                    ? 'bg-[#E8F5EE] text-[#2A6543]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {selectedPredefined === option
                  ? <Check size={11} className="shrink-0 text-[#2A6543]" strokeWidth={3} />
                  : <span className="w-2.5 shrink-0 hidden sm:block" />
                }
                <span className="truncate">{option}</span>
              </button>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => { setIsDateRangeEnabled(!isDateRangeEnabled); setSelectedPredefined(''); }}
              className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg text-xs font-semibold w-full text-left transition-colors ${
                isDateRangeEnabled
                  ? 'bg-[#E8F5EE] text-[#2A6543]'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                isDateRangeEnabled ? 'bg-[#2A6543] border-[#2A6543]' : 'border-gray-300'
              }`}>
                {isDateRangeEnabled && <Check size={9} className="text-white" strokeWidth={3} />}
              </div>
              Custom Range
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className={`flex-1 p-3 sm:p-4 transition-opacity duration-200 ${isDateRangeEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>

          {/* Month/Year nav */}
          <div className="flex items-center justify-between mb-3">
            <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                November <ChevronDown size={13} className="text-gray-400" />
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                2026 <ChevronDown size={13} className="text-gray-400" />
              </button>
            </div>
            <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {daysOfWeek.map((d, i) => (
              <div key={i} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => renderDay(day, index))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/60">
        <button
          onClick={() => { setSelectedPredefined(''); setIsDateRangeEnabled(true); setStartDay(null); setEndDay(null); }}
          className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          Clear
        </button>
        <button className="px-6 py-2 bg-[#2A6543] hover:bg-[#235337] text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
          Apply Filter
        </button>
      </div>

    </div>
  );
}