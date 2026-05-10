"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export function SelectField({
  label,
  placeholder = "Select",
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
      >
        <span className="mb-1 block text-xs text-[#62636C]">{label}</span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span className={value ? "text-gray-700" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <ChevronDown size={20} className="text-gray-800" />
        </span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          {options.map((option) => {
            const selected =
              value === option || (!value && option === "Select");
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option === "Select" ? "" : option);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-4 rounded-md px-2 py-2.5 text-left text-sm text-gray-500 hover:bg-gray-50"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    selected
                      ? "border-[#046C3F] bg-[#046C3F]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selected && <span className="h-2 w-2 rounded-sm bg-white" />}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
