"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ChewBackButton({ onClick }: { onClick?: () => void }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={onClick || (() => router.back())}
      className="mb-8 inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#046C3F] hover:bg-gray-50"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}
