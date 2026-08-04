"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Activity, MapPinned, TrendingUp } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import StatCard from "../shared/StatCard";
import GroupedBarChart from "../shared/GroupedBarChart";
import { TrendBadge, AlertLevelBadge } from "../shared/Badges";
import { LoadingBlock, EmptyBlock } from "../shared/QueryState";
import PrintableReport, { PrintPayload } from "../shared/PrintableReport";
import { getPeriodLabel } from "../shared/dateLabel";
import { Download } from "lucide-react";
import {
  useDiseaseSurveillanceReport,
  DiseaseSurveillanceRow,
} from "@/src/hooks/state/use-reports";

const ITEMS_PER_PAGE = 10;

function formatShortDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function heatColor(intensity: number) {
  // intensity 0..1 -> light green through amber to red
  if (intensity <= 0) return { bg: "#F1F2F6", text: "#9CA3AF" };
  if (intensity < 0.33) return { bg: "#D2F1DF", text: "#046C3F" };
  if (intensity < 0.66) return { bg: "#FFE9B8", text: "#B45309" };
  return { bg: "#FECACA", text: "#B91C1C" };
}

export default function DiseaseSurveillanceTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useDiseaseSurveillanceReport({
    startDate,
    endDate,
    page,
    pageSize: ITEMS_PER_PAGE,
  });

  const rows = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;
  const trendChart = data?.state_trend_chart ?? [];
  const heatmap = data?.lga_heatmap ?? [];
  const outbreaks = data?.outbreak_indicators ?? [];

  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const kpis = useMemo(() => {
    const totalCases = trendChart.reduce((acc, p) => acc + p.cases, 0);
    const lgasAffected = heatmap.length;
    const criticalAlerts = outbreaks.filter((o) => o.alert_level === "CRITICAL").length;
    const increasingOnPage = rows.filter((r) => r.trend === "INCREASING").length;
    return { totalCases, lgasAffected, criticalAlerts, increasingOnPage };
  }, [trendChart, heatmap, outbreaks, rows]);

  const formattedTrend = useMemo(
    () => trendChart.map((p) => ({ dateLabel: formatShortDate(p.date), cases: p.cases })),
    [trendChart],
  );

  const maxHeat = Math.max(1, ...heatmap.map((h) => h.cases));

  const handleExport = () => {
    setPrintPayload({
      reportTitle: "State Disease Surveillance Report",
      periodLabel,
      summaryCards: [
        { label: "Total Cases", value: kpis.totalCases },
        { label: "LGAs Affected", value: kpis.lgasAffected },
        { label: "Critical Outbreak Alerts", value: kpis.criticalAlerts },
        { label: "Records (this page)", value: rows.length },
      ],
      columns: [
        { header: "Disease", key: "disease" },
        { header: "Facility", key: "facility" },
        { header: "LGA", key: "lga" },
        { header: "Cases", key: "cases", align: "right" },
        { header: "Trend", key: "trend" },
        { header: "Alert Level", key: "alert_level" },
      ],
      rows: rows.map((r) => ({
        disease: r.disease,
        facility: r.facility,
        lga: r.lga,
        cases: r.cases,
        trend: r.trend,
        alert_level: r.alert_level,
      })),
      note: `Showing page ${page} of ${totalPages}. Navigate pages to export additional records.`,
    });
  };

  const columns: Column<DiseaseSurveillanceRow>[] = [
    { key: "disease", label: "Disease", sortable: true, render: (row) => <span className="font-bold text-gray-900">{row.disease}</span> },
    { key: "facility", label: "Facility", sortable: true },
    { key: "lga", label: "LGA", sortable: true },
    { key: "cases", label: "Cases", sortable: true, render: (row) => <span className="font-mono">{row.cases}</span> },
    { key: "trend", label: "Trend", render: (row) => <TrendBadge trend={row.trend} /> },
    { key: "alert_level", label: "Alert Level", render: (row) => <AlertLevelBadge level={row.alert_level} /> },
  ];

  return (
    <>
      <div className="space-y-6 print:hidden">
      {outbreaks.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50/70 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-red-700 mb-1.5">
              Outbreak Watch — {outbreaks.length} disease{outbreaks.length === 1 ? "" : "s"} at or above threshold
            </p>
            <div className="flex flex-wrap gap-2">
              {outbreaks.map((o) => (
                <span
                  key={o.disease}
                  className="inline-flex items-center gap-1.5 bg-white border border-red-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-700"
                >
                  {o.disease}
                  <span className="text-red-400">·</span>
                  {o.cases} cases
                  <span className="text-red-400">·</span>
                  {o.facilities_affected} facilities
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="Total Cases" value={kpis.totalCases.toLocaleString()} tone="red" />
        <StatCard icon={MapPinned} label="LGAs Affected" value={kpis.lgasAffected} tone="amber" />
        <StatCard icon={AlertTriangle} label="Critical Alerts" value={kpis.criticalAlerts} tone="red" />
        <StatCard icon={TrendingUp} label="Increasing Trends" value={kpis.increasingOnPage} subLabel="on this page" tone="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h3 className="text-base font-bold text-[#101928] mb-1">Case Trend</h3>
          <p className="text-xs text-gray-400 mb-5">State-wide reported cases over the selected period</p>
          {isLoading ? (
            <LoadingBlock label="Loading chart..." />
          ) : (
            <GroupedBarChart
              data={formattedTrend}
              xKey="dateLabel"
              series={[{ key: "cases", label: "Cases", color: "#DC2626" }]}
              emptyMessage="No cases reported in this period."
            />
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h3 className="text-base font-bold text-[#101928] mb-1">LGA Heatmap</h3>
          <p className="text-xs text-gray-400 mb-5">Reported cases by local government area</p>
          {isLoading ? (
            <LoadingBlock label="Loading heatmap..." />
          ) : heatmap.length === 0 ? (
            <EmptyBlock label="No LGA case data for this period." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
              {heatmap
                .slice()
                .sort((a, b) => b.cases - a.cases)
                .map((h) => {
                  const colors = heatColor(h.cases / maxHeat);
                  return (
                    <div
                      key={h.lga}
                      className="rounded-xl p-3 flex flex-col gap-1"
                      style={{ backgroundColor: colors.bg }}
                      title={`${h.lga}: ${h.cases} cases`}
                    >
                      <span className="text-[11px] font-semibold truncate" style={{ color: colors.text }}>
                        {h.lga}
                      </span>
                      <span className="text-lg font-extrabold" style={{ color: colors.text }}>
                        {h.cases}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-50">
          <h3 className="font-bold text-gray-900 text-lg">
            Disease Records <span className="text-gray-400 font-medium text-sm">({data?.count ?? 0})</span>
          </h3>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
        </div>
        {isLoading ? (
          <LoadingBlock />
        ) : rows.length === 0 ? (
          <EmptyBlock label="No disease surveillance records for this period." />
        ) : (
          <>
            <DataTable columns={columns} data={rows} />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
