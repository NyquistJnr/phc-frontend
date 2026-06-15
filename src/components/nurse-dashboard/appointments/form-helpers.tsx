"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Search,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react";

export function FieldShell({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F] ${className}`}
    >
      <label className="mb-1 block text-xs text-[#62636C]">{label}</label>
      {children}
    </div>
  );
}

export function SelectField({
  label,
  placeholder,
  options,
  value,
  searchable = false,
  isLoading = false,
  onChange,
  onSearchChange,
}: {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string;
  searchable?: boolean;
  isLoading?: boolean;
  onChange: (value: string) => void;
  onSearchChange?: (term: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const displayOptions = onSearchChange
    ? options
    : options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      );

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearch(term);
    if (onSearchChange) {
      onSearchChange(term);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
      >
        <span className="mb-1 block text-xs text-[#62636C]">{label}</span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span
            className={
              selectedLabel ? "text-gray-700" : "text-gray-400 truncate"
            }
          >
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-800 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
          {searchable && (
            <div className="relative mb-3 flex items-center">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900"
              />
              <input
                value={search}
                onChange={handleSearch}
                placeholder="Search..."
                className="h-11 w-full rounded-lg border border-gray-300 pl-12 pr-10 text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
              />
              {isLoading && (
                <Loader2
                  size={16}
                  className="absolute right-4 animate-spin text-gray-400"
                />
              )}
            </div>
          )}
          <div className="max-h-72 overflow-y-auto pr-1">
            {displayOptions.length > 0 ? (
              displayOptions.map((option, index) => {
                const selected = value === option.value;
                return (
                  <button
                    key={`${option.value}-${index}`}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setSearch("");
                      if (onSearchChange) onSearchChange("");
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-4 rounded-md px-2 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${selected ? "border-[#046C3F] bg-[#046C3F]" : "border-gray-300 bg-white"}`}
                    >
                      {selected && (
                        <span className="h-2.5 w-2.5 rounded-sm bg-white" />
                      )}
                    </span>
                    {option.label}
                  </button>
                );
              })
            ) : (
              <div className="px-2 py-2 text-sm text-gray-500">
                {isLoading ? "Searching..." : "No results found"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function MultiSelectField({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
      >
        <span className="mb-1 block text-xs text-[#62636C]">{label}</span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span
            className={`truncate ${value.length > 0 ? "text-gray-700" : "text-gray-400"}`}
          >
            {value.length > 0 ? selectedLabels : placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-800 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-lg border border-gray-300 bg-white p-2 shadow-sm">
          {options.map((option, index) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={`${option.value}-${index}`}
                type="button"
                onClick={() => toggleOption(option.value)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                {isSelected ? (
                  <CheckSquare size={18} className="text-[#046C3F]" />
                ) : (
                  <Square size={18} className="text-gray-400" />
                )}
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
