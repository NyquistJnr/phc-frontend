import { X } from "lucide-react";

export function SuccessToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex w-[min(390px,calc(100vw-2rem))] items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
      <span className="h-12 w-1 rounded-full bg-[#039855]" />
      <span className="h-6 w-6 rounded-lg border border-[#A8E6C4] bg-[#E8F7F0]" />
      <p className="flex-1 text-sm font-semibold text-gray-900">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="border-l border-gray-100 pl-4"
      >
        <X size={18} />
      </button>
    </div>
  );
}
