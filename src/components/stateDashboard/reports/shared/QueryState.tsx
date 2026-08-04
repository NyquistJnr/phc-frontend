"use client";

import { Loader2, Inbox } from "lucide-react";

export function LoadingBlock({ label = "Loading report data..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function EmptyBlock({ label = "No data found for this period." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-300">
      <Inbox className="mb-3" size={36} />
      <p className="text-sm font-medium text-gray-400">{label}</p>
    </div>
  );
}
