"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Search,
  X,
  Pill,
} from "lucide-react";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { PharmacyInventoryRow } from "@/src/components/pharmacist-dashboard/prescriptions/pharmacyData";

export const UNITS = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Vial",
  "Ampoule",
  "Sachet",
  "Inhaler",
  "Tube",
  "Bottle",
];

export const statusColors: Record<string, { bg: string; text: string }> = {
  "In Stock": { bg: "#DDF2EA", text: "#00A556" },
  "Low Stock": { bg: "#FFF1DE", text: "#2E2E2E" },
  "Out of Stock": { bg: "#FFE5E5", text: "#FF1F1F" },
};

export function badge(label: string) {
  const color = statusColors[label] ?? { bg: "#F1F5F9", text: "#475569" };
  return (
    <StatusBadge
      label={label}
      bgColorHex={color.bg}
      textColorHex={color.text}
    />
  );
}

export function Field({
  label,
  value,
  placeholder,
  icon,
  readOnly,
  muted,
  className = "",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  icon?: ReactNode;
  readOnly?: boolean;
  muted?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label
      className={`flex h-[58px] items-center gap-3 rounded-md border border-[#D1D5DB] px-4 ${
        muted ? "bg-[#F1F2F4]" : "bg-white"
      } ${className}`}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-[#53545C]">{label}</span>
        <input
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full bg-transparent text-base text-[#6B7280] outline-none placeholder:text-[#A7ADB5]"
        />
      </span>
    </label>
  );
}

export function SelectField({
  label,
  value,
  placeholder = "Select",
  options,
  searchable,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  options: string[];
  searchable?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const visibleOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-[58px] w-full items-center justify-between rounded-md border border-[#D1D5DB] bg-white px-4 text-left"
      >
        <span className="min-w-0">
          <span className="block text-xs text-[#53545C]">{label}</span>
          <span className="mt-1 block truncate text-base text-[#6B7280]">
            {value || placeholder}
          </span>
        </span>
        <ChevronDown size={20} className="text-[#111827]" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 w-full rounded border border-gray-200 bg-white p-3 shadow-xl">
          {searchable && (
            <label className="mb-3 flex h-11 items-center gap-3 rounded-md border border-gray-200 px-3">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="w-full bg-transparent outline-none"
              />
            </label>
          )}
          <div className="max-h-80 overflow-y-auto pr-1">
            {visibleOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex w-full items-center gap-4 rounded px-2 py-3 text-left text-[#7A7F89] hover:bg-gray-50"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                    value === option
                      ? "border-[#046C3F] bg-[#046C3F] text-white"
                      : "border-gray-300"
                  }`}
                >
                  {value === option && <Check size={14} />}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function InventoryModal({
  variant,
  item,
  onClose,
  onSubmit,
}: {
  variant: "view" | "update";
  item: PharmacyInventoryRow;
  onClose: () => void;
  onSubmit?: () => void;
}) {
  const muted = variant === "view";

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/20 px-4 py-10 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[1100px] rounded-xl bg-white px-6 py-8 shadow-2xl sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pill size={28} className="text-[#046C3F]" />
            <h2 className="text-2xl font-semibold text-black">
              {variant === "view"
                ? `View ${item.drugName}`
                : `Update stock for ${item.drugName}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#FFF3E7] p-2"
            aria-label="Close inventory modal"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Drug Name"
            value={item.drugName}
            icon={<Search size={24} />}
            readOnly
            muted={muted}
          />
          <Field
            label="Batch Number"
            value={variant === "view" ? "B-2723" : "B-1726"}
            readOnly
            muted={muted}
          />
          <Field
            label="Purchase Date"
            value="12/12/2020"
            icon={<CalendarDays size={20} />}
            readOnly
            muted={muted}
          />
          <Field
            label="Expiry Date"
            value="12/12/2020"
            icon={<CalendarDays size={20} />}
            readOnly
            muted={muted}
          />
          <Field
            label="Drug Category"
            value={variant === "view" ? "Antibiotic" : ""}
            placeholder="e.g Antibiotic"
            readOnly={variant === "view"}
            muted={muted}
          />
          <Field
            label="Quantity Added"
            value={variant === "view" ? "60" : "76"}
            readOnly={variant === "view"}
            muted={muted}
          />
          <Field
            label="Threshold"
            value="20"
            readOnly={variant === "view"}
            muted={muted}
          />
          <Field
            label="Supplier"
            value="Medplus"
            readOnly={variant === "view"}
            muted={muted}
          />
          <Field
            label="Cost Price"
            value="NGN 1,500"
            readOnly={variant === "view"}
            muted={muted}
          />
          <SelectField
            label="Unit"
            value={item.unit}
            options={UNITS}
            onChange={() => undefined}
          />
        </div>

        <div className="mt-6 max-w-[770px]">
          <Field
            label="Notes (Optional)"
            value={variant === "view" ? "Filled" : ""}
            placeholder="Additional notes"
            readOnly={variant === "view"}
            muted={muted}
            className="h-40 items-start py-4"
          />
        </div>

        {variant === "view" ? (
          <div className="mt-8 flex max-w-[770px] justify-end">
            <button className="inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-[#046C3F] px-16 text-lg font-medium text-[#046C3F]">
              <Download size={22} />
              Export File
            </button>
          </div>
        ) : (
          <div className="mt-8 flex max-w-[770px] flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-14 rounded-lg bg-[#C1C4CE] px-16 text-xl font-medium text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="h-14 rounded-lg bg-[#046C3F] px-10 text-xl font-medium text-white"
            >
              Update Stock
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
