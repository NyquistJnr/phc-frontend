"use client";

import { useEffect, useMemo, useState } from "react";
import { Syringe, TrendingDown } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import StatCard from "../shared/StatCard";
import GroupedBarChart from "../shared/GroupedBarChart";
import TableToolbar from "../shared/TableToolbar";
import EstimatedBadge from "../shared/EstimatedBadge";
import { LoadingBlock, EmptyBlock } from "../shared/QueryState";
import PrintableReport, { PrintPayload } from "../shared/PrintableReport";
import { useLocalReportFilter } from "../shared/useLocalReportFilter";
import { getPeriodLabel } from "../shared/dateLabel";
import { useChildHealthReport, ChildHealthRow } from "@/src/hooks/state/use-reports";

export default function ChildHealthTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useChildHealthReport({ startDate, endDate });
  const rows = data?.results ?? [];
  const { search, setSearch, lga, setLga, lgaOptions, filtered } = useLocalReportFilter(rows);
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const kpis = useMemo(() => {
    const bcg = rows.reduce((acc, r) => acc + r.bcg, 0);
    const penta1 = rows.reduce((acc, r) => acc + r.penta_1, 0);
    const penta3 = rows.reduce((acc, r) => acc + r.penta_3, 0);
    const measles = rows.reduce((acc, r) => acc + r.measles, 0);
    const dropout = penta1 > 0 ? Math.round(((penta1 - penta3) / penta1) * 1000) / 10 : 0;
    return { bcg, penta1, penta3, measles, dropout };
  }, [rows]);

  const immunizationTotals = useMemo(
    () => [
      { vaccine: "BCG", doses: kpis.bcg },
      { vaccine: "Penta 1", doses: kpis.penta1 },
      { vaccine: "Penta 3", doses: kpis.penta3 },
      { vaccine: "Measles", doses: kpis.measles },
    ],
    [kpis],
  );

  const handleExport = () => {
    setPrintPayload({
      reportTitle: "State Child Health Report",
      periodLabel,
      summaryCards: [
        { label: "BCG Doses", value: kpis.bcg },
        { label: "Penta 1 Doses", value: kpis.penta1 },
        { label: "Penta 3 Doses", value: kpis.penta3 },
        { label: "Penta 1→3 Dropout", value: `${kpis.dropout}%` },
      ],
      columns: [
        { header: "Facility", key: "facility" },
        { header: "LGA", key: "lga" },
        { header: "BCG", key: "bcg", align: "right" },
        { header: "Penta 1", key: "penta_1", align: "right" },
        { header: "Penta 3", key: "penta_3", align: "right" },
        { header: "Measles", key: "measles", align: "right" },
      ],
      rows: filtered.map((r) => ({
        facility: r.facility,
        lga: r.lga,
        bcg: r.bcg,
        penta_1: r.penta_1,
        penta_3: r.penta_3,
        measles: r.measles,
      })),
      note: "SAM Cases and Growth Monitoring columns are placeholder values (no underlying data model exists yet).",
    });
  };

  const columns: Column<ChildHealthRow>[] = [
    { key: "facility", label: "Facility", sortable: true, render: (row) => <span className="font-bold text-gray-900">{row.facility}</span> },
    { key: "lga", label: "LGA", sortable: true },
    { key: "bcg", label: "BCG", sortable: true, render: (row) => <span className="font-mono">{row.bcg}</span> },
    { key: "penta_1", label: "Penta 1", sortable: true, render: (row) => <span className="font-mono">{row.penta_1}</span> },
    { key: "penta_3", label: "Penta 3", sortable: true, render: (row) => <span className="font-mono">{row.penta_3}</span> },
    { key: "measles", label: "Measles", sortable: true, render: (row) => <span className="font-mono">{row.measles}</span> },
    {
      key: "sam_cases",
      label: "SAM Cases",
      render: () => (
        <span className="inline-flex items-center gap-1.5">
          <span className="font-mono text-gray-400">0</span>
          <EstimatedBadge variant="not-tracked" />
        </span>
      ),
    },
    {
      key: "growth_monitoring",
      label: "Growth Monitoring",
      render: () => (
        <span className="inline-flex items-center gap-1.5">
          <span className="font-mono text-gray-400">0</span>
          <EstimatedBadge variant="not-tracked" />
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6 print:hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Syringe} label="BCG Doses" value={kpis.bcg.toLocaleString()} tone="green" />
        <StatCard icon={Syringe} label="Penta 1 Doses" value={kpis.penta1.toLocaleString()} tone="blue" />
        <StatCard icon={Syringe} label="Penta 3 Doses" value={kpis.penta3.toLocaleString()} tone="amber" />
        <StatCard icon={TrendingDown} label="Penta 1→3 Dropout" value={`${kpis.dropout}%`} subLabel="Lower is better" tone="neutral" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h3 className="text-base font-bold text-[#101928] mb-1">Immunization Coverage</h3>
        <p className="text-xs text-gray-400 mb-5">Total doses administered state-wide, by vaccine</p>
        {isLoading ? (
          <LoadingBlock label="Loading chart..." />
        ) : (
          <GroupedBarChart
            data={immunizationTotals}
            xKey="vaccine"
            series={[{ key: "doses", label: "Doses", color: "#1AC073" }]}
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
