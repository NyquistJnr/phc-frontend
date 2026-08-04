"use client";

import { useEffect, useMemo, useState } from "react";
import { Syringe, Scale, Pill, TrendingUp } from "lucide-react";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import RankedBarList from "@/src/components/stateDashboard/reports/shared/RankedBarList";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useChildHealthReport } from "@/src/hooks/oic/use-reports";

export default function ChildHealthTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useChildHealthReport({ startDate, endDate });
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const vaccineItems = useMemo(
    () => (data?.immunization_coverage ?? []).map((v) => ({ label: v.vaccine, value: v.count })),
    [data],
  );
  const totalDoses = useMemo(() => (data?.immunization_coverage ?? []).reduce((acc, v) => acc + v.count, 0), [data]);

  const handleExport = () => {
    if (!data) return;
    setPrintPayload({
      reportTitle: "Child Health Report",
      periodLabel,
      summaryCards: [
        { label: "Total Doses Given", value: totalDoses },
        { label: "Vitamin A (est.)", value: data.vitamin_a },
        { label: "Deworming (est.)", value: data.deworming },
        { label: "Vaccines Tracked", value: data.immunization_coverage.length },
      ],
      columns: [
        { header: "Vaccine", key: "vaccine" },
        { header: "Doses Given", key: "count", align: "right" },
      ],
      rows: data.immunization_coverage.map((v) => ({ vaccine: v.vaccine, count: v.count })),
      note: "Vitamin A and Deworming are approximated from dispensed inventory items matched by name — real data, but only as accurate as inventory naming. Growth Monitoring and SAM Cases are placeholder values (no data model exists yet).",
    });
  };

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Syringe} label="Total Doses Given" value={totalDoses.toLocaleString()} tone="green" />
          <StatCard icon={Scale} label="Vitamin A" value={data?.vitamin_a ?? 0} tone="amber" placeholder="estimated" />
          <StatCard icon={Pill} label="Deworming" value={data?.deworming ?? 0} tone="amber" placeholder="estimated" />
          <StatCard icon={TrendingUp} label="Growth Monitoring" value={data?.growth_monitoring ?? 0} tone="neutral" placeholder="not-tracked" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Scale} label="SAM Cases" value={data?.sam ?? 0} tone="neutral" placeholder="not-tracked" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-bold text-[#101928]">Immunization Coverage</h3>
              <p className="text-xs text-gray-400 mt-0.5">Doses administered this period, by vaccine</p>
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
          ) : vaccineItems.length === 0 ? (
            <EmptyBlock label="No immunizations recorded in this period." />
          ) : (
            <RankedBarList items={vaccineItems} limit={12} color="#1AC073" />
          )}
        </div>
      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
