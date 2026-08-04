"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldAlert, AlertOctagon, CheckCircle2, Clock3 } from "lucide-react";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import RankedBarList from "@/src/components/stateDashboard/reports/shared/RankedBarList";
import GroupedBarChart from "@/src/components/stateDashboard/reports/shared/GroupedBarChart";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useAdverseEventsReport } from "@/src/hooks/oic/use-reports";

function formatShortDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const SEVERITY_COLORS: Record<string, string> = {
  MILD: "#0284C7",
  MODERATE: "#B45309",
  SEVERE: "#EA580C",
  LIFE_THREATENING: "#DC2626",
  FATAL: "#111827",
};

export default function AdverseEventsTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useAdverseEventsReport({ startDate, endDate });
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const drugItems = useMemo(() => (data?.by_drug ?? []).map((d) => ({ label: d.drug, value: d.count })), [data]);
  const severityItems = useMemo(
    () => (data?.by_severity ?? []).map((s) => ({ label: s.severity.replaceAll("_", " "), value: s.count })),
    [data],
  );
  const trend = data?.trend_chart ?? [];
  const formattedTrend = useMemo(
    () => trend.map((p) => ({ dateLabel: formatShortDate(p.date), count: p.count })),
    [trend],
  );

  const handleExport = () => {
    if (!data) return;
    setPrintPayload({
      reportTitle: "Adverse Events Report",
      periodLabel,
      summaryCards: [
        { label: "Total Events", value: data.facility_summary.total_adverse_events },
        { label: "Severe Events", value: data.facility_summary.severe_events },
        { label: "Resolved", value: data.facility_summary.resolved },
        { label: "Pending", value: data.facility_summary.pending },
      ],
      columns: [
        { header: "Category", key: "category" },
        { header: "Breakdown", key: "breakdown" },
        { header: "Count", key: "count", align: "right" },
      ],
      rows: [
        ...data.by_drug.map((d) => ({ category: "By Drug", breakdown: d.drug, count: d.count })),
        ...data.by_severity.map((s) => ({ category: "By Severity", breakdown: s.severity.replaceAll("_", " "), count: s.count })),
      ],
      note: "Severe Events combines SEVERE, LIFE_THREATENING and FATAL. Events are attributed to this facility via the reporting staff member's facility. Department breakdown is not yet tracked.",
    });
  };

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={ShieldAlert} label="Total Events" value={data?.facility_summary.total_adverse_events ?? 0} tone="green" />
          <StatCard icon={AlertOctagon} label="Severe Events" value={data?.facility_summary.severe_events ?? 0} tone="red" />
          <StatCard icon={CheckCircle2} label="Resolved" value={data?.facility_summary.resolved ?? 0} tone="blue" />
          <StatCard icon={Clock3} label="Pending" value={data?.facility_summary.pending ?? 0} tone="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
              <div>
                <h3 className="text-base font-bold text-[#101928]">Event Trend</h3>
                <p className="text-xs text-gray-400 mt-0.5">Reported adverse events over the selected period</p>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Export
              </button>
            </div>
            {isLoading ? (
              <LoadingBlock label="Loading chart..." />
            ) : (
              <GroupedBarChart
                data={formattedTrend}
                xKey="dateLabel"
                series={[{ key: "count", label: "Events", color: "#DC2626" }]}
                emptyMessage="No adverse events reported in this period."
              />
            )}
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h3 className="text-base font-bold text-[#101928] mb-1">By Severity</h3>
            <p className="text-xs text-gray-400 mb-5">Distribution across severity levels</p>
            {isLoading ? (
              <LoadingBlock />
            ) : severityItems.length === 0 ? (
              <EmptyBlock />
            ) : (
              <div className="space-y-3.5">
                {severityItems.map((item) => {
                  const key = item.label.replaceAll(" ", "_");
                  const max = Math.max(1, ...severityItems.map((i) => i.value));
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 font-medium w-32 shrink-0 truncate">{item.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-[#F1F2F6] overflow-hidden min-w-8">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${(item.value / max) * 100}%`, backgroundColor: SEVERITY_COLORS[key] ?? "#046C3F" }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-900 w-8 shrink-0 text-right tabular-nums">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h3 className="text-base font-bold text-[#101928] mb-1">By Drug</h3>
          <p className="text-xs text-gray-400 mb-5">Drugs most frequently implicated this period</p>
          {isLoading ? (
            <LoadingBlock />
          ) : drugItems.length === 0 ? (
            <EmptyBlock label="No adverse events reported in this period." />
          ) : (
            <RankedBarList items={drugItems} limit={10} color="#B45309" />
          )}
        </div>
      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
