import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface DropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export const CustomDropdown = ({
  options,
  selected,
  onSelect,
  placeholder = "Filter...",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a6c38]/20 focus:border-[#0a6c38] transition-all w-full sm:w-auto min-w-[140px]"
      >
        <span className="truncate">{selected || placeholder}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  selected === option
                    ? "bg-[#e6f4ea] text-[#0a6c38] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {option}
                {selected === option && (
                  <Check size={16} className="text-[#0a6c38]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
