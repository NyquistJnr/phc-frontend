"use client";

import { Search, Download } from "lucide-react";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";

interface TableToolbarProps {
  title: string;
  count: number;
  search: string;
  onSearchChange: (value: string) => void;
  lga: string;
  lgaOptions: string[];
  onLgaChange: (value: string) => void;
  onExport: () => void;
  searchPlaceholder?: string;
}

export default function TableToolbar({
  title,
  count,
  search,
  onSearchChange,
  lga,
  lgaOptions,
  onLgaChange,
  onExport,
  searchPlaceholder = "Search facility...",
}: TableToolbarProps) {
  return (
    <div className="p-4 sm:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-gray-50">
      <h3 className="font-bold text-gray-900 text-lg">
        {title} <span className="text-gray-400 font-medium text-sm">({count})</span>
      </h3>

      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full sm:w-56 focus:outline-none focus:ring-1 focus:ring-[#1AC073]"
          />
        </div>

        {lgaOptions.length > 1 && (
          <FilterDropdown label="All LGAs" options={lgaOptions} selected={lga} onChange={onLgaChange} />
        )}

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
}
