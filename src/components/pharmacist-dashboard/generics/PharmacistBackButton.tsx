"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type PharmacistBackButtonProps = {
  onClick?: () => void;
};

export default function PharmacistBackButton({
  onClick,
}: PharmacistBackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={onClick ?? (() => router.back())}
      className="mb-8 inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#046C3F] transition-colors hover:bg-[#F8FAF9]"
    >
      <ArrowLeft size={15} />
      Back
    </button>
  );
}
