"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, HeartPulse, Baby, Syringe, ArrowRightLeft, PackageX, Skull, ClipboardCheck } from "lucide-react";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import GroupedBarChart from "@/src/components/stateDashboard/reports/shared/GroupedBarChart";
import { LoadingBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useOicDashboardReport } from "@/src/hooks/oic/use-reports";

export default function OverviewTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useOicDashboardReport({ startDate, endDate });
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const serviceVolume = useMemo(
    () => [
      { service: "ANC Attendance", count: data?.anc_attendance ?? 0 },
      { service: "Deliveries", count: data?.deliveries ?? 0 },
      { service: "Immunizations", count: data?.immunizations ?? 0 },
      { service: "Referrals", count: data?.referrals ?? 0 },
    ],
    [data],
  );

  const reportingStatus = data?.monthly_reporting_status;

  const handleExport = () => {
    if (!data) return;
    setPrintPayload({
      reportTitle: "OIC Facility Overview",
      periodLabel,
      summaryCards: [
        { label: "Total Patients", value: data.total_patients },
        { label: "ANC Attendance", value: data.anc_attendance },
        { label: "Immunizations", value: data.immunizations },
        { label: "Referrals Sent", value: data.referrals },
      ],
      columns: [
        { header: "Metric", key: "metric" },
        { header: "Value", key: "value", align: "right" },
      ],
      rows: [
        { metric: "Total Patients (all-time)", value: data.total_patients },
        { metric: "ANC Attendance", value: data.anc_attendance },
        { metric: "Deliveries", value: data.deliveries },
        { metric: "Immunizations", value: data.immunizations },
        { metric: "Referrals Sent", value: data.referrals },
        { metric: "Drug Stock Alerts", value: data.drug_stock_alerts },
        { metric: "Maternal Deaths (not yet tracked)", value: data.maternal_deaths },
        { metric: "Neonatal Deaths", value: data.neonatal_deaths },
        { metric: `Monthly Report Status (${data.monthly_reporting_status.month})`, value: data.monthly_reporting_status.status },
      ],
      note: "Total Patients is an all-time running total for this facility, not scoped to the selected period. Maternal Deaths and Monthly Reporting Status are placeholder values — no underlying data model exists yet.",
    });
  };

  return (
    <>
      <div className="space-y-6 print:hidden">
        {reportingStatus?.status === "NOT_TRACKED" && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex items-center gap-3">
            <ClipboardCheck size={18} className="text-gray-400 shrink-0" />
            <p className="text-sm text-gray-500">
              Monthly reporting status for <span className="font-semibold">{reportingStatus.month}</span> is not yet tracked — no report-submission model exists for this facility yet.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Patients" value={(data?.total_patients ?? 0).toLocaleString()} subLabel="All-time, this facility" tone="green" />
          <StatCard icon={HeartPulse} label="ANC Attendance" value={data?.anc_attendance ?? 0} tone="blue" />
          <StatCard icon={Baby} label="Deliveries" value={data?.deliveries ?? 0} tone="amber" />
          <StatCard icon={Syringe} label="Immunizations" value={data?.immunizations ?? 0} tone="green" />
          <StatCard icon={ArrowRightLeft} label="Referrals Sent" value={data?.referrals ?? 0} tone="blue" />
          <StatCard icon={PackageX} label="Drug Stock Alerts" value={data?.drug_stock_alerts ?? 0} tone={data && data.drug_stock_alerts > 0 ? "red" : "neutral"} />
          <StatCard icon={Skull} label="Maternal Deaths" value={data?.maternal_deaths ?? 0} tone="neutral" placeholder="not-tracked" />
          <StatCard icon={Skull} label="Neonatal Deaths" value={data?.neonatal_deaths ?? 0} tone="neutral" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-bold text-[#101928]">Service Volume</h3>
              <p className="text-xs text-gray-400 mt-0.5">Core services delivered at this facility this period</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Export
            </button>
          </div>
          {isLoading ? (
            <LoadingBlock label="Loading overview..." />
          ) : (
            <GroupedBarChart
              data={serviceVolume}
              xKey="service"
              series={[{ key: "count", label: "Count", color: "#046C3F" }]}
            />
          )}
        </div>
      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
