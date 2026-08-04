"use client";

import { useEffect, useState } from "react";
import { Info, UserPlus, Repeat, MessageCircle } from "lucide-react";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import { EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useFamilyPlanningReport } from "@/src/hooks/oic/use-reports";

export default function FamilyPlanningTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data } = useFamilyPlanningReport({ startDate, endDate });
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const handleExport = () => {
    if (!data) return;
    setPrintPayload({
      reportTitle: "Family Planning Report",
      periodLabel,
      summaryCards: [
        { label: "New Clients", value: data.new_clients },
        { label: "Repeat Clients", value: data.repeat_clients },
        { label: "Counselling Sessions", value: data.counselling_sessions },
      ],
      columns: [
        { header: "Metric", key: "metric" },
        { header: "Value", key: "value", align: "right" },
      ],
      rows: [
        { metric: "New Clients", value: data.new_clients },
        { metric: "Repeat Clients", value: data.repeat_clients },
        { metric: "Counselling Sessions", value: data.counselling_sessions },
        { metric: "Methods Used (recorded)", value: data.methods_used.length },
        { metric: "Commodity Distribution (recorded)", value: data.commodity_distribution.length },
      ],
      note: "No Family Planning module exists in the system yet — every figure here is a static placeholder until one is built.",
    });
  };

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Info size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-800">Family Planning module not yet available</p>
            <p className="text-xs text-amber-700 mt-1">
              This facility doesn&apos;t have Family Planning data collection wired up yet. The figures below are static placeholders and will start reflecting real activity once the module ships.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={UserPlus} label="New Clients" value={data?.new_clients ?? 0} tone="neutral" placeholder="not-tracked" />
          <StatCard icon={Repeat} label="Repeat Clients" value={data?.repeat_clients ?? 0} tone="neutral" placeholder="not-tracked" />
          <StatCard icon={MessageCircle} label="Counselling Sessions" value={data?.counselling_sessions ?? 0} tone="neutral" placeholder="not-tracked" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-[#101928]">Methods Used</h3>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Export
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-5">Breakdown by contraceptive method</p>
            <EmptyBlock label="Not yet tracked." />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h3 className="text-base font-bold text-[#101928] mb-1">Commodity Distribution</h3>
            <p className="text-xs text-gray-400 mb-5">Commodities dispensed this period</p>
            <EmptyBlock label="Not yet tracked." />
          </div>
        </div>
      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
