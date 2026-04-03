"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface FormSelectDropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

/**
 * Single-select dropdown styled as a floating-label form field with
 * checkbox-style option rows — matches the Create Facility design.
 */
export default function FormSelectDropdown({
  label,
  placeholder,
  options,
  selected,
  onSelect,
}: FormSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const displayValue = selected || placeholder;
  const isPlaceholder = !selected;

  return (
    <div ref={containerRef} className="relative">
      {/* Floating label */}
      <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-600 font-medium z-10">
        {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="block w-full border border-gray-200 rounded-xl px-5 py-3.5 text-base text-left flex items-center focus:border-[#1AC073] focus:outline-none focus:ring-1 focus:ring-[#1AC073] transition-colors"
      >
        <span className={isPlaceholder ? "text-gray-400 flex-1" : "text-gray-900 flex-1"}>
          {displayValue}
        </span>
        <ChevronDown
          size={20}
          className={`text-gray-600 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-20 py-2 max-h-60 overflow-y-auto">
            {/* Placeholder / "Select X" row */}
            <div
              className="flex items-center gap-4 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                onSelect("");
                setOpen(false);
              }}
            >
              <span
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isPlaceholder
                    ? "bg-[#046C3F] border-[#046C3F]"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isPlaceholder && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {placeholder}
              </span>
            </div>

            {/* Options */}
            {options.map((option) => {
              const isSelected = selected === option;
              return (
                <div
                  key={option}
                  className="flex items-center gap-4 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                >
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-[#046C3F] border-[#046C3F]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-sm font-medium ${isSelected ? "text-gray-900" : "text-gray-700"}`}
                  >
                    {option}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
