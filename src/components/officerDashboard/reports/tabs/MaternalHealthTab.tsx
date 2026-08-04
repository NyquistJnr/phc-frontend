"use client";

import { useEffect, useState } from "react";
import { HeartPulse, Baby, Repeat, ShieldCheck, Skull, AlertOctagon, Weight } from "lucide-react";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useMaternalHealthReport } from "@/src/hooks/oic/use-reports";

export default function MaternalHealthTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data } = useMaternalHealthReport({ startDate, endDate });
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const handleExport = () => {
    if (!data) return;
    setPrintPayload({
      reportTitle: "Maternal Health Report",
      periodLabel,
      summaryCards: [
        { label: "ANC 1", value: data.anc_1 },
        { label: "ANC Repeat Visits", value: data.anc_repeat },
        { label: "ANC 4+", value: data.anc_4 },
        { label: "IPTp Coverage", value: `${data.iptp_coverage}%` },
      ],
      columns: [
        { header: "Metric", key: "metric" },
        { header: "Value", key: "value", align: "right" },
      ],
      rows: [
        { metric: "ANC 1 (first visit)", value: data.anc_1 },
        { metric: "ANC Repeat Visits", value: data.anc_repeat },
        { metric: "ANC 4+ (episodes with 4+ visits)", value: data.anc_4 },
        { metric: "Deliveries", value: data.deliveries },
        { metric: "Stillbirths (not yet tracked)", value: data.stillbirths },
        { metric: "Low Birth Weight (not yet tracked)", value: data.low_birth_weight },
        { metric: "Maternal Deaths (not yet tracked)", value: data.maternal_deaths },
        { metric: "Neonatal Deaths", value: data.neonatal_deaths },
        { metric: "IPTp Coverage", value: `${data.iptp_coverage}%` },
      ],
      note: "Stillbirths, Low Birth Weight and Maternal Deaths are placeholder values — no underlying data model exists yet.",
    });
  };

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Export
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HeartPulse} label="ANC 1" value={data?.anc_1 ?? 0} tone="green" />
          <StatCard icon={Repeat} label="ANC Repeat Visits" value={data?.anc_repeat ?? 0} tone="blue" />
          <StatCard icon={ShieldCheck} label="ANC 4+" value={data?.anc_4 ?? 0} tone="amber" />
          <StatCard icon={ShieldCheck} label="IPTp Coverage" value={`${data?.iptp_coverage ?? 0}%`} tone="neutral" />
          <StatCard icon={Baby} label="Deliveries" value={data?.deliveries ?? 0} tone="green" />
          <StatCard icon={AlertOctagon} label="Stillbirths" value={data?.stillbirths ?? 0} tone="neutral" placeholder="not-tracked" />
          <StatCard icon={Weight} label="Low Birth Weight" value={data?.low_birth_weight ?? 0} tone="neutral" placeholder="not-tracked" />
          <StatCard icon={Skull} label="Maternal Deaths" value={data?.maternal_deaths ?? 0} tone="neutral" placeholder="not-tracked" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Skull} label="Neonatal Deaths" value={data?.neonatal_deaths ?? 0} tone="red" />
        </div>
      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
