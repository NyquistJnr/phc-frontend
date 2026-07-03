"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Search, ShieldAlert, X } from "lucide-react";
import { useDiseases, DiseaseSeverity } from "@/src/hooks/useDiseases";

const SEVERITY_STYLES: Record<DiseaseSeverity, { dot: string; badge: string }> = {
  CRITICAL: { dot: "bg-red-500", badge: "bg-[#FEE2E2] text-[#DC2626]" },
  MODERATE: { dot: "bg-amber-500", badge: "bg-[#FFF3CD] text-[#B45309]" },
  LOW: { dot: "bg-emerald-500", badge: "bg-[#D2F1DF] text-[#046C3F]" },
};

interface DiseasePickerProps {
  value: string;
  onChange: (diseaseId: string) => void;
}

export default function DiseasePicker({ value, onChange }: DiseasePickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useDiseases({ pageSize: 100 });
  const diseases = useMemo(() => data?.results || [], [data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return diseases;
    const q = search.trim().toLowerCase();
    return diseases.filter((d) => d.name.toLowerCase().includes(q));
  }, [diseases, search]);

  const selected = useMemo(() => diseases.find((d) => d.id === value), [diseases, value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const toggleOpen = () => {
    setOpen((v) => {
      if (!v) setSearch("");
      return !v;
    });
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-4 py-3 text-left transition-colors ${
          open
            ? "border-[#046C3F] ring-1 ring-[#046C3F]"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#E8F7F0] text-[#046C3F]">
            <ShieldAlert size={16} />
          </span>
          {selected ? (
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-medium text-gray-900">{selected.name}</span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${SEVERITY_STYLES[selected.severity]?.badge || "bg-gray-100 text-gray-600"}`}
              >
                {selected.severity}
              </span>
            </span>
          ) : (
            <span className="truncate text-sm text-gray-400">
              {isLoading ? "Loading diseases…" : "Search and select a disease…"}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {selected && (
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                onChange("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.stopPropagation();
                  onChange("");
                }
              }}
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Clear selected disease"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="border-b border-gray-100 p-2.5">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search diseases…"
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#046C3F] focus:bg-white focus:ring-1 focus:ring-[#046C3F]"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto py-1.5">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                !value ? "bg-[#F0FAF5] font-medium text-[#046C3F]" : "text-gray-500"
              }`}
            >
              None
              {!value && <Check size={15} className="text-[#046C3F]" />}
            </button>

            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                Loading diseases…
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                {search ? `No diseases match "${search}".` : "No diseases available."}
              </div>
            ) : (
              filtered.map((disease) => {
                const isSelected = disease.id === value;
                const styles = SEVERITY_STYLES[disease.severity] || {
                  dot: "bg-gray-400",
                  badge: "bg-gray-100 text-gray-600",
                };
                return (
                  <button
                    key={disease.id}
                    type="button"
                    onClick={() => {
                      onChange(disease.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 ${
                      isSelected ? "bg-[#F0FAF5]" : ""
                    }`}
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          className={`truncate text-sm font-medium ${isSelected ? "text-[#046C3F]" : "text-gray-800"}`}
                        >
                          {disease.name}
                        </span>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${styles.badge}`}>
                          {disease.severity}
                        </span>
                      </span>
                      {disease.description && (
                        <span className="mt-0.5 block truncate text-xs text-gray-400">
                          {disease.description}
                        </span>
                      )}
                    </span>
                    {isSelected && <Check size={15} className="mt-1 shrink-0 text-[#046C3F]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
