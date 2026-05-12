"use client";

import { ReactNode } from "react";

export function MenuButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  value,
  placeholder,
  icon,
  readOnly,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  icon?: ReactNode;
  readOnly?: boolean;
}) {
  return (
    <label
      className={`flex min-h-[58px] items-center gap-3 rounded-lg border border-gray-300 px-4 ${
        readOnly ? "bg-gray-100 text-gray-500" : "bg-white text-gray-700"
      }`}
    >
      {icon && <span className="shrink-0 text-gray-600">{icon}</span>}
      <span className="min-w-0">
        <span className="block text-xs text-gray-500">{label}</span>
        <span className="block truncate text-base text-gray-400">
          {value || placeholder}
        </span>
      </span>
    </label>
  );
}

export function TextArea({
  label,
  placeholder,
  readOnly,
  value,
}: {
  label: string;
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
}) {
  return (
    <label
      className={`block rounded-lg border border-gray-300 px-4 py-3 ${
        readOnly ? "bg-gray-100" : "bg-white"
      }`}
    >
      <span className="block text-xs text-gray-500">{label}</span>
      <textarea
        readOnly={readOnly}
        value={value}
        placeholder={placeholder}
        onChange={() => undefined}
        className="mt-1 h-32 w-full resize-none bg-transparent text-base text-gray-600 outline-none placeholder:text-gray-400"
      />
    </label>
  );
}

export function SectionTitle({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="mb-7 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9CCCB6] text-[#046C3F]">
        {icon}
      </span>
      <h2 className="text-xl font-semibold text-black">{title}</h2>
    </div>
  );
}
