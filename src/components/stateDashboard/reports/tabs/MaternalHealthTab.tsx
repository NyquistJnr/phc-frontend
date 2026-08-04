"use client";

import { useEffect, useMemo, useState } from "react";
import { HeartPulse, Baby, Syringe, ShieldCheck } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import StatCard from "../shared/StatCard";
import GroupedBarChart from "../shared/GroupedBarChart";
import TableToolbar from "../shared/TableToolbar";
import EstimatedBadge from "../shared/EstimatedBadge";
import { LoadingBlock, EmptyBlock } from "../shared/QueryState";
import PrintableReport, { PrintPayload } from "../shared/PrintableReport";
import { useLocalReportFilter } from "../shared/useLocalReportFilter";
import { getPeriodLabel } from "../shared/dateLabel";
import { useMaternalHealthReport, MaternalHealthRow } from "@/src/hooks/state/use-reports";

export default function MaternalHealthTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useMaternalHealthReport({ startDate, endDate });
  const rows = data?.results ?? [];
  const chartData = data?.state_comparison_chart ?? [];
  const { search, setSearch, lga, setLga, lgaOptions, filtered } = useLocalReportFilter(rows);
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const kpis = useMemo(() => {
    const anc1 = rows.reduce((acc, r) => acc + r.anc_1, 0);
    const anc4 = rows.reduce((acc, r) => acc + r.anc_4, 0);
    const deliveries = rows.reduce((acc, r) => acc + r.deliveries, 0);
    const avgIptp = rows.length
      ? Math.round((rows.reduce((acc, r) => acc + r.iptp_coverage, 0) / rows.length) * 10) / 10
      : 0;
    const retention = anc1 > 0 ? Math.round((anc4 / anc1) * 1000) / 10 : 0;
    return { anc1, anc4, deliveries, avgIptp, retention };
  }, [rows]);

  const handleExport = () => {
    setPrintPayload({
      reportTitle: "State Maternal Health Report",
      periodLabel,
      summaryCards: [
        { label: "ANC 1st Visit", value: kpis.anc1 },
        { label: "ANC 4th Visit", value: kpis.anc4 },
        { label: "Deliveries", value: kpis.deliveries },
        { label: "Avg IPTp Coverage", value: `${kpis.avgIptp}%` },
      ],
      columns: [
        { header: "Facility", key: "facility" },
        { header: "LGA", key: "lga" },
        { header: "ANC 1", key: "anc_1", align: "right" },
        { header: "ANC 4", key: "anc_4", align: "right" },
        { header: "Deliveries", key: "deliveries", align: "right" },
        { header: "Neonatal Deaths", key: "neonatal_deaths", align: "right" },
        { header: "IPTp Coverage", key: "iptp_coverage", align: "right" },
      ],
      rows: filtered.map((r) => ({
        facility: r.facility,
        lga: r.lga,
        anc_1: r.anc_1,
        anc_4: r.anc_4,
        deliveries: r.deliveries,
        neonatal_deaths: r.neonatal_deaths,
        iptp_coverage: `${r.iptp_coverage}%`,
      })),
      note: "Maternal Deaths column is a placeholder value (no maternal-mortality tracking model exists yet).",
    });
  };

  const columns: Column<MaternalHealthRow>[] = [
    { key: "facility", label: "Facility", sortable: true, render: (row) => <span className="font-bold text-gray-900">{row.facility}</span> },
    { key: "lga", label: "LGA", sortable: true },
    { key: "anc_1", label: "ANC 1", sortable: true, render: (row) => <span className="font-mono">{row.anc_1}</span> },
    { key: "anc_4", label: "ANC 4", sortable: true, render: (row) => <span className="font-mono">{row.anc_4}</span> },
    { key: "deliveries", label: "Deliveries", sortable: true, render: (row) => <span className="font-mono">{row.deliveries}</span> },
    {
      key: "maternal_deaths",
      label: "Maternal Deaths",
      render: (row) => (
        <span className="inline-flex items-center gap-1.5">
          <span className="font-mono text-gray-400">{row.maternal_deaths}</span>
          <EstimatedBadge variant="not-tracked" />
        </span>
      ),
    },
    { key: "neonatal_deaths", label: "Neonatal Deaths", sortable: true, render: (row) => <span className="font-mono">{row.neonatal_deaths}</span> },
    {
      key: "iptp_coverage",
      label: "IPTp Coverage",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            row.iptp_coverage >= 75 ? "bg-[#E8F7F0] text-[#046C3F]" : "bg-[#FFF4E5] text-[#B45309]"
          }`}
        >
          {row.iptp_coverage}%
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6 print:hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HeartPulse} label="ANC 1st Visits" value={kpis.anc1.toLocaleString()} tone="green" />
        <StatCard icon={Syringe} label="ANC 4th Visits" value={kpis.anc4.toLocaleString()} subLabel={`${kpis.retention}% retention from ANC1`} tone="blue" />
        <StatCard icon={Baby} label="Deliveries" value={kpis.deliveries.toLocaleString()} tone="amber" />
        <StatCard icon={ShieldCheck} label="Avg IPTp Coverage" value={`${kpis.avgIptp}%`} tone="neutral" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
          <div>
            <h3 className="text-base font-bold text-[#101928]">State Comparison — ANC Visits</h3>
            <p className="text-xs text-gray-400 mt-0.5">ANC 1st vs 4th visit volume per facility</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#046C3F" }} />
              <span className="text-[11px] text-gray-500 font-medium">ANC 1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#0284C7" }} />
              <span className="text-[11px] text-gray-500 font-medium">ANC 4</span>
            </div>
          </div>
        </div>
        {isLoading ? (
          <LoadingBlock label="Loading chart..." />
        ) : (
          <GroupedBarChart
            data={chartData}
            xKey="facility"
            series={[
              { key: "anc_1", label: "ANC 1", color: "#046C3F" },
              { key: "anc_4", label: "ANC 4", color: "#0284C7" },
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
