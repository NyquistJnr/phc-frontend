"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export default function FilterDropdown({ label, options, selected, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const displayLabel = selected === 'All' || selected === '' ? label : selected;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`px-3 sm:px-4 py-2 border rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
          selected && selected !== 'All'
            ? 'border-[#046C3F] text-[#046C3F] bg-[#E8F7F0]'
            : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
        }`}
      >
        {displayLabel}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-2 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => { onChange(option); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left font-medium transition-colors hover:bg-gray-50 ${
                selected === option ? 'text-[#046C3F]' : 'text-gray-600'
              }`}
            >
              {option}
              {selected === option && <Check size={14} className="text-[#046C3F]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
