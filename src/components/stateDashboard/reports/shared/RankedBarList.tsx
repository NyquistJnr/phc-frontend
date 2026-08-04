"use client";

interface RankedBarItem {
  label: string;
  sublabel?: string;
  value: number;
}

interface RankedBarListProps {
  items: RankedBarItem[];
  limit?: number;
  color?: string;
  formatValue?: (value: number) => string;
  emptyMessage?: string;
}

export default function RankedBarList({
  items,
  limit = 8,
  color = "#046C3F",
  formatValue = (v) => String(v),
  emptyMessage = "No data available for this period.",
}: RankedBarListProps) {
  const sorted = [...items].sort((a, b) => b.value - a.value).slice(0, limit);
  const max = Math.max(1, ...sorted.map((i) => i.value));

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-gray-300 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {sorted.map((item, i) => (
        <div key={`${item.label}-${i}`} className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-gray-300 w-4 shrink-0 text-right">
            {i + 1}
          </span>
          <span
            className="text-sm text-gray-700 font-medium w-32 sm:w-40 shrink-0 truncate"
            title={item.sublabel ? `${item.label} — ${item.sublabel}` : item.label}
          >
            {item.label}
          </span>
          <div className="flex-1 h-2 rounded-full bg-[#F1F2F6] overflow-hidden min-w-8">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: color }}
            />
          </div>
          <span className="text-xs font-bold text-gray-900 w-14 shrink-0 text-right tabular-nums">
            {formatValue(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
