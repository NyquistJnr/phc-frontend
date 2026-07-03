"use client";

import { useMemo, useState } from "react";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { usePatientActivity } from "@/src/hooks/useFacilities";

const REGISTERED_COLOR = "#046C3F";
const APPOINTMENTS_COLOR = "#0284C7";
const MAX_X_LABELS = 10;

function formatToYYYYMMDD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6); // last 7 days, inclusive of today
  return { start: formatToYYYYMMDD(start), end: formatToYYYYMMDD(end) };
}

function formatAxisLabel(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
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

interface HoverState {
  index: number;
  series: "registered" | "appointments";
}

interface PatientVolumeTrendCardProps {
  className?: string;
  titleClassName?: string;
}

export default function PatientVolumeTrendCard({
  className = "bg-white p-5 sm:p-8 rounded-2xl sm:rounded-4xl shadow-sm border border-gray-100 flex flex-col min-h-80",
  titleClassName = "text-lg font-bold text-[#101928]",
}: PatientVolumeTrendCardProps) {
  const [range, setRange] = useState(defaultRange);
  const [hover, setHover] = useState<HoverState | null>(null);

  const { data, isLoading } = usePatientActivity(range.start, range.end);
  const results = useMemo(() => data?.results ?? [], [data]);

  const maxValue = useMemo(
    () =>
      niceMax(
        results.reduce(
          (acc, r) => Math.max(acc, r.registered, r.appointments),
          0,
        ),
      ),
    [results],
  );

  const yTicks = useMemo(() => {
    const stepCount = 4;
    return Array.from({ length: stepCount + 1 }, (_, i) =>
      Math.round((maxValue / stepCount) * (stepCount - i)),
    );
  }, [maxValue]);

  const labelStride = Math.max(1, Math.ceil(results.length / MAX_X_LABELS));

  return (
    <div className={className}>
      <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
        <div>
          <h3 className={titleClassName}>Patient Volume Trend</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: REGISTERED_COLOR }}
              />
              <span className="text-[11px] text-gray-500 font-medium">
                Registered Patients
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: APPOINTMENTS_COLOR }}
              />
              <span className="text-[11px] text-gray-500 font-medium">
                Appointments
              </span>
            </div>
          </div>
        </div>
        <DateRangeFilter
          startDate={range.start}
          endDate={range.end}
          label="This Week"
          onApply={(start, end) => setRange({ start, end })}
          onClear={() => setRange(defaultRange())}
        />
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-10">
          <p className="text-sm text-gray-300 font-medium">Loading chart…</p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-10">
          <p className="text-sm text-gray-300 font-medium">
            No patient activity in this range
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-55">
          <div className="flex flex-1 gap-2">
            {/* Y-axis */}
            <div className="flex flex-col justify-between pb-6 pr-2 shrink-0">
              {yTicks.map((v, i) => (
                <span
                  key={i}
                  className="text-[10px] text-gray-300 font-medium leading-none"
                >
                  {v}
                </span>
              ))}
            </div>

            {/* Grouped bars */}
            <div className="flex-1 flex items-end gap-2 pb-6">
              {results.map((point, i) => (
                <div
                  key={point.date}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                >
                  <div className="w-full flex items-end justify-center gap-[3px] h-full">
                    <div
                      className="flex-1 max-w-[14px] rounded-t-[4px] relative cursor-default transition-opacity"
                      style={{
                        height: `${(point.registered / maxValue) * 100}%`,
                        backgroundColor: REGISTERED_COLOR,
                        opacity:
                          hover && hover.index === i && hover.series !== "registered"
                            ? 0.5
                            : 1,
                      }}
                      onMouseEnter={() => setHover({ index: i, series: "registered" })}
                      onMouseLeave={() => setHover(null)}
                    >
                      {hover?.index === i && hover.series === "registered" && (
                        <ChartTooltip label="Registered" value={point.registered} />
                      )}
                    </div>
                    <div
                      className="flex-1 max-w-[14px] rounded-t-[4px] relative cursor-default transition-opacity"
                      style={{
                        height: `${(point.appointments / maxValue) * 100}%`,
                        backgroundColor: APPOINTMENTS_COLOR,
                        opacity:
                          hover && hover.index === i && hover.series !== "appointments"
                            ? 0.5
                            : 1,
                      }}
                      onMouseEnter={() => setHover({ index: i, series: "appointments" })}
                      onMouseLeave={() => setHover(null)}
                    >
                      {hover?.index === i && hover.series === "appointments" && (
                        <ChartTooltip label="Appointments" value={point.appointments} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex gap-2 pl-8">
            {results.map((point, i) => (
              <div key={point.date} className="flex-1 text-center">
                <span className="text-[10px] text-gray-300 font-medium whitespace-nowrap">
                  {i % labelStride === 0 ? formatAxisLabel(point.date) : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChartTooltip({ label, value }: { label: string; value: number }) {
  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white shadow-lg pointer-events-none">
      {label}: {value}
    </div>
  );
}
