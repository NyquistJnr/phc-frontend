"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Ambulance, CheckCircle2 } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import StatCard from "../shared/StatCard";
import GroupedBarChart from "../shared/GroupedBarChart";
import TableToolbar from "../shared/TableToolbar";
import { LoadingBlock, EmptyBlock } from "../shared/QueryState";
import PrintableReport, { PrintPayload } from "../shared/PrintableReport";
import { useLocalReportFilter } from "../shared/useLocalReportFilter";
import { getPeriodLabel } from "../shared/dateLabel";
import { useReferralAnalyticsReport, ReferralAnalyticsRow } from "@/src/hooks/state/use-reports";

export default function ReferralAnalyticsTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useReferralAnalyticsReport({ startDate, endDate });
  const rows = data?.results ?? [];
  const { search, setSearch, lga, setLga, lgaOptions, filtered } = useLocalReportFilter(rows);
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const kpis = useMemo(() => {
    const sent = rows.reduce((acc, r) => acc + r.referrals_sent, 0);
    const received = rows.reduce((acc, r) => acc + r.referrals_received, 0);
    const ambulance = rows.reduce((acc, r) => acc + r.ambulance_referrals, 0);
    const avgCompletion = rows.length
      ? Math.round((rows.reduce((acc, r) => acc + r.completion_rate, 0) / rows.length) * 10) / 10
      : 0;
    const avgTime = rows.length
      ? Math.round((rows.reduce((acc, r) => acc + r.average_referral_time_hours, 0) / rows.length) * 10) / 10
      : 0;
    return { sent, received, ambulance, avgCompletion, avgTime };
  }, [rows]);

  const topFacilities = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b.referrals_sent + b.referrals_received - (a.referrals_sent + a.referrals_received))
        .slice(0, 10),
    [rows],
  );

  const handleExport = () => {
    setPrintPayload({
      reportTitle: "State Referral Analytics Report",
      periodLabel,
      summaryCards: [
        { label: "Referrals Sent", value: kpis.sent },
        { label: "Referrals Received", value: kpis.received },
        { label: "Ambulance Referrals", value: kpis.ambulance },
        { label: "Avg Completion Rate", value: `${kpis.avgCompletion}%` },
      ],
      columns: [
        { header: "Facility", key: "facility" },
        { header: "LGA", key: "lga" },
        { header: "Sent", key: "referrals_sent", align: "right" },
        { header: "Received", key: "referrals_received", align: "right" },
        { header: "Ambulance", key: "ambulance_referrals", align: "right" },
        { header: "Completion Rate", key: "completion_rate", align: "right" },
        { header: "Avg Time (hrs)", key: "average_referral_time_hours", align: "right" },
      ],
      rows: filtered.map((r) => ({
        facility: r.facility,
        lga: r.lga,
        referrals_sent: r.referrals_sent,
        referrals_received: r.referrals_received,
        ambulance_referrals: r.ambulance_referrals,
        completion_rate: `${r.completion_rate}%`,
        average_referral_time_hours: r.average_referral_time_hours,
      })),
      note: "Average referral time is computed only from referrals marked COMPLETED in this period.",
    });
  };

  const columns: Column<ReferralAnalyticsRow>[] = [
    { key: "facility", label: "Facility", sortable: true, render: (row) => <span className="font-bold text-gray-900">{row.facility}</span> },
    { key: "lga", label: "LGA", sortable: true },
    { key: "referrals_sent", label: "Sent", sortable: true, render: (row) => <span className="font-mono">{row.referrals_sent}</span> },
    { key: "referrals_received", label: "Received", sortable: true, render: (row) => <span className="font-mono">{row.referrals_received}</span> },
    { key: "ambulance_referrals", label: "Ambulance", sortable: true, render: (row) => <span className="font-mono">{row.ambulance_referrals}</span> },
    {
      key: "completion_rate",
      label: "Completion Rate",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            row.completion_rate >= 75 ? "bg-[#E8F7F0] text-[#046C3F]" : "bg-[#FFF4E5] text-[#B45309]"
          }`}
        >
          {row.completion_rate}%
        </span>
      ),
    },
    {
      key: "average_referral_time_hours",
      label: "Avg Time (hrs)",
      sortable: true,
      render: (row) => <span className="font-mono">{row.average_referral_time_hours}</span>,
    },
  ];

  return (
    <>
      <div className="space-y-6 print:hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ArrowRightLeft} label="Referrals Sent" value={kpis.sent} tone="green" />
        <StatCard icon={ArrowRightLeft} label="Referrals Received" value={kpis.received} tone="blue" />
        <StatCard icon={Ambulance} label="Ambulance Referrals" value={kpis.ambulance} tone="amber" />
        <StatCard icon={CheckCircle2} label="Avg Completion Rate" value={`${kpis.avgCompletion}%`} subLabel={`${kpis.avgTime} hrs avg time`} tone="neutral" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
          <div>
            <h3 className="text-base font-bold text-[#101928]">Top 10 Facilities by Referral Volume</h3>
            <p className="text-xs text-gray-400 mt-0.5">Sent vs received referrals</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#046C3F" }} />
              <span className="text-[11px] text-gray-500 font-medium">Sent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#0284C7" }} />
              <span className="text-[11px] text-gray-500 font-medium">Received</span>
            </div>
          </div>
        </div>
        {isLoading ? (
          <LoadingBlock label="Loading chart..." />
        ) : (
          <GroupedBarChart
            data={topFacilities}
            xKey="facility"
            series={[
              { key: "referrals_sent", label: "Sent", color: "#046C3F" },
              { key: "referrals_received", label: "Received", color: "#0284C7" },
            ]}
          />
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <TableToolbar
          title="All Facilities"
          count={filtered.length}
          search={search}
          onSearchChange={setSearch}
          lga={lga}
          lgaOptions={lgaOptions}
          onLgaChange={setLga}
          onExport={handleExport}
        />
        {isLoading ? (
          <LoadingBlock />
        ) : filtered.length === 0 ? (
          <EmptyBlock label="No facilities match your filters." />
        ) : (
          <DataTable columns={columns} data={filtered} />
        )}
      </div>

      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
