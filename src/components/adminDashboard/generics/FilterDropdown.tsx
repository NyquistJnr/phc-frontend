"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export default function FilterDropdown({
  label,
  options,
  selected,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 176;

      const rawHeight = options.length * 42 + 16;
      const estimatedHeight = Math.min(rawHeight, 240);

      let top = rect.bottom + 4;
      let left = rect.right - menuWidth;

      if (rect.bottom + estimatedHeight > window.innerHeight) {
        top = rect.top - estimatedHeight - 4;
      }

      if (left < 10) {
        left = rect.left;
      }

      setCoords({ top, left });
    }
    setOpen(!open);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleScroll(e: Event) {
      if (menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [open]);

  const displayLabel = selected === "All" || selected === "" ? label : selected;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={`px-3 sm:px-4 py-2 border rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
          selected && selected !== "All"
            ? "border-[#046C3F] text-[#046C3F] bg-[#E8F7F0]"
            : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
        }`}
      >
        {displayLabel}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: coords.top, left: coords.left }}
            className="w-44 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-9999 py-2 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left font-medium transition-colors hover:bg-gray-50 ${
                  selected === option ? "text-[#046C3F]" : "text-gray-600"
                }`}
              >
                {option}
                {selected === option && (
                  <Check size={14} className="text-[#046C3F]" />
                )}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
