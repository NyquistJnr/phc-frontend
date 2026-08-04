"use client";

import { useMemo, useState } from "react";

interface SeriesDef<T> {
  key: keyof T & string;
  label: string;
  color: string;
}

interface GroupedBarChartProps<T> {
  data: T[];
  xKey: keyof T & string;
  series: SeriesDef<T>[];
  emptyMessage?: string;
}

interface HoverState {
  index: number;
  seriesKey: string;
}

function niceMax(value: number) {
  if (value <= 0) return 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;
  let niceResidual = 1;
  if (residual > 5) niceResidual = 10;
  else if (residual > 2) niceResidual = 5;
  else if (residual > 1) niceResidual = 2;
  return niceResidual * magnitude;
}

export default function GroupedBarChart<T extends object>({
  data,
  xKey,
  series,
  emptyMessage = "No data available for this period.",
}: GroupedBarChartProps<T>) {
  const [hover, setHover] = useState<HoverState | null>(null);

  const maxValue = useMemo(
    () =>
      niceMax(
        data.reduce((acc, row) => Math.max(acc, ...series.map((s) => Number(row[s.key]) || 0)), 0),
      ),
    [data, series],
  );

  const yTicks = useMemo(() => {
    const stepCount = 4;
    return Array.from({ length: stepCount + 1 }, (_, i) =>
      Math.round((maxValue / stepCount) * (stepCount - i)),
    );
  }, [maxValue]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-gray-300 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-55">
      <div className="flex flex-1 gap-2 overflow-x-auto">
        {/* Y-axis */}
        <div className="flex flex-col justify-between pb-6 pr-2 shrink-0 sticky left-0 bg-white">
          {yTicks.map((v, i) => (
            <span key={i} className="text-[10px] text-gray-300 font-medium leading-none">
              {v}
            </span>
          ))}
        </div>

        {/* Grouped bars */}
        <div className="flex-1 flex items-end gap-3 pb-6 min-w-max px-1" style={{ minWidth: `${data.length * 64}px` }}>
          {data.map((row, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-40 w-14 shrink-0">
              <div className="w-full flex items-end justify-center gap-[3px] h-full">
                {series.map((s) => {
                  const value = Number(row[s.key]) || 0;
                  const isHovered = hover?.index === i && hover.seriesKey === s.key;
                  const isDimmed = hover && hover.index === i && hover.seriesKey !== s.key;
                  return (
                    <div
                      key={s.key}
                      className="flex-1 max-w-[16px] rounded-t-[4px] relative cursor-default transition-opacity"
                      style={{
                        height: `${(value / maxValue) * 100}%`,
                        backgroundColor: s.color,
                        opacity: isDimmed ? 0.45 : 1,
                        minHeight: value > 0 ? 2 : 0,
                      }}
                      onMouseEnter={() => setHover({ index: i, seriesKey: s.key })}
                      onMouseLeave={() => setHover(null)}
                    >
                      {isHovered && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white shadow-lg pointer-events-none">
                          {s.label}: {value}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex gap-3 pl-8 overflow-x-auto">
        {data.map((row, i) => (
          <div key={i} className="w-14 shrink-0 text-center">
            <span
              className="text-[10px] text-gray-400 font-medium block truncate"
              title={String(row[xKey])}
            >
              {String(row[xKey])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
