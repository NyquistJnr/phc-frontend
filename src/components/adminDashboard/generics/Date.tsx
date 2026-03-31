"use client";

import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomDateFilter() {
  const [selectedPredefined, setSelectedPredefined] = useState('');
  const [isDateRangeEnabled, setIsDateRangeEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('From');

  const predefinedOptions = [
    'This Week', 'Last Week',
    'This Month', 'Last Month',
    'This Year', 'Last Year'
  ];

  // Calendar logic specific to November 2026 as shown in the mockup
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const calendarDays = [
    null, null, null, null, null, null, 1,
    2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27, 28, 29,
    30
  ];

  const renderDay = (day: number | null, index: number) => {
    if (!day) return <div key={`empty-${index}`} className="h-10 w-full"></div>;

    const isStart = day === 17;
    const isEnd = day === 26;
    const isBetween = day > 17 && day < 26;
    const isToday = day === 7;

    return (
      <div key={day} className="relative h-10 w-full flex items-center justify-center cursor-pointer group">
        {/* Range Background Highlights */}
        {isBetween && <div className="absolute inset-0 bg-[#EDF2F7]"></div>}
        {isStart && <div className="absolute right-0 w-1/2 h-full bg-[#EDF2F7]"></div>}
        {isEnd && <div className="absolute left-0 w-1/2 h-full bg-[#EDF2F7]"></div>}

        {/* Day Number */}
        <div className={`
          relative z-10 flex items-center justify-center w-8 h-8 text-[15px]
          ${isStart || isEnd ? 'bg-[#2A6543] text-white rounded-full' : ''}
          ${!isStart && !isEnd && isToday ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 rounded-full font-medium' : ''}
          ${!isStart && !isEnd && !isToday ? 'text-gray-700 hover:bg-gray-100 hover:rounded-full' : ''}
        `}>
          {day}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 border border-gray-100 font-sans">
      
      {/* Header */}
      <h3 className="text-[17px] font-semibold text-gray-900 mb-5">By Date</h3>

      {/* Predefined Options Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-6">
        {predefinedOptions.map((option) => (
          <label key={option} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-[22px] h-[22px] rounded border flex items-center justify-center transition-colors
              ${selectedPredefined === option ? 'border-[#2A6543] bg-[#2A6543]' : 'border-gray-300 group-hover:border-gray-400'}`}
            >
              {selectedPredefined === option && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-gray-500 text-[15px]">{option}</span>
            {/* Hidden actual radio input for accessibility */}
            <input 
              type="radio" 
              name="predefinedDate" 
              className="hidden" 
              checked={selectedPredefined === option}
              onChange={() => {
                setSelectedPredefined(option);
                setIsDateRangeEnabled(false);
              }}
            />
          </label>
        ))}
      </div>

      {/* Custom Date Range Toggle */}
      <label className="flex items-center gap-3 cursor-pointer mb-5">
        <div className={`w-[22px] h-[22px] rounded flex items-center justify-center transition-colors
          ${isDateRangeEnabled ? 'bg-[#2A6543]' : 'border border-gray-300'}`}
        >
          {isDateRangeEnabled && (
            <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
          )}
        </div>
        <span className="text-gray-900 font-medium text-[15px]">Date Range</span>
        <input 
          type="checkbox" 
          className="hidden"
          checked={isDateRangeEnabled}
          onChange={() => setIsDateRangeEnabled(!isDateRangeEnabled)}
        />
      </label>

      {/* Date Range Picker Area */}
      <div className={`transition-opacity duration-200 ${isDateRangeEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        
        {/* From / To Tabs */}
        <div className="flex bg-[#F3F6F9] rounded-lg p-1 mb-6">
          <button 
            onClick={() => setActiveTab('From')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'From' ? 'bg-[#2A6543] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            From
          </button>
          <button 
            onClick={() => setActiveTab('To')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'To' ? 'bg-[#2A6543] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            To
          </button>
        </div>

        {/* Month & Year Selectors */}
        <div className="flex gap-4 mb-4 px-2">
          <button className="flex items-center gap-2 text-gray-700 font-medium text-[15px] hover:text-gray-900">
            2026
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          <button className="flex items-center gap-2 text-gray-700 font-medium text-[15px] hover:text-gray-900">
            November
            <ChevronDown size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-[#F8FAFC] rounded-xl p-3 mb-6">
          {/* Days Header */}
          <div className="grid grid-cols-7 mb-2">
            {daysOfWeek.map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {calendarDays.map((day, index) => renderDay(day, index))}
          </div>
        </div>

      </div>

      {/* Filter Action Button */}
      <button className="w-full py-3.5 bg-[#2A6543] hover:bg-[#235337] text-white font-semibold rounded-xl transition-colors shadow-sm">
        Filter
      </button>

    </div>
  );
}