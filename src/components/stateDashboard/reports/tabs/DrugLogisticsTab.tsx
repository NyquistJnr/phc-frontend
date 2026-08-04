"use client";

import { useEffect, useMemo, useState } from "react";
import { PackageX, Syringe, ShieldCheck, Snowflake } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import StatCard from "../shared/StatCard";
import RankedBarList from "../shared/RankedBarList";
import TableToolbar from "../shared/TableToolbar";
import EstimatedBadge from "../shared/EstimatedBadge";
import { LoadingBlock, EmptyBlock } from "../shared/QueryState";
import PrintableReport, { PrintPayload } from "../shared/PrintableReport";
import { useLocalReportFilter } from "../shared/useLocalReportFilter";
import { getPeriodLabel } from "../shared/dateLabel";
import { useDrugLogisticsReport, DrugLogisticsRow } from "@/src/hooks/state/use-reports";

export default function DrugLogisticsTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useDrugLogisticsReport({ startDate, endDate });
  const rows = data?.results ?? [];
  const { search, setSearch, lga, setLga, lgaOptions, filtered } = useLocalReportFilter(rows);
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const kpis = useMemo(() => {
    const stockOuts = rows.reduce((acc, r) => acc + r.stock_outs, 0);
    const avgWastage = rows.length
      ? Math.round((rows.reduce((acc, r) => acc + r.vaccine_wastage, 0) / rows.length) * 10) / 10
      : 0;
    const avgAvailability = rows.length
      ? Math.round((rows.reduce((acc, r) => acc + r.tracer_drug_availability, 0) / rows.length) * 10) / 10
      : 0;
    return { stockOuts, avgWastage, avgAvailability };
  }, [rows]);

  const handleExport = () => {
    setPrintPayload({
      reportTitle: "State Drug Logistics Report",
      periodLabel,
      summaryCards: [
        { label: "Total Stock-Outs", value: kpis.stockOuts },
        { label: "Avg Vaccine Wastage", value: `${kpis.avgWastage}%` },
        { label: "Avg Tracer Drug Availability", value: `${kpis.avgAvailability}%` },
        { label: "Facilities", value: rows.length },
      ],
      columns: [
        { header: "Facility", key: "facility" },
        { header: "LGA", key: "lga" },
        { header: "Stock-Outs", key: "stock_outs", align: "right" },
        { header: "Vaccine Wastage", key: "vaccine_wastage", align: "right" },
        { header: "Tracer Drug Availability", key: "tracer_drug_availability", align: "right" },
      ],
      rows: filtered.map((r) => ({
        facility: r.facility,
        lga: r.lga,
        stock_outs: r.stock_outs,
        vaccine_wastage: `${r.vaccine_wastage}%`,
        tracer_drug_availability: `${r.tracer_drug_availability}%`,
      })),
      note: "Cold Chain Status is not yet tracked. Tracer Drug Availability is approximated from all drug stock, not a curated tracer-drug list.",
    });
  };

  const columns: Column<DrugLogisticsRow>[] = [
    { key: "facility", label: "Facility", sortable: true, render: (row) => <span className="font-bold text-gray-900">{row.facility}</span> },
    { key: "lga", label: "LGA", sortable: true },
    {
      key: "stock_outs",
      label: "Stock-Outs",
      sortable: true,
      render: (row) => (
        <span className={`font-mono font-bold ${row.stock_outs > 0 ? "text-red-600" : "text-gray-600"}`}>
          {row.stock_outs}
        </span>
      ),
    },
    {
      key: "vaccine_wastage",
      label: "Vaccine Wastage",
      sortable: true,
      render: (row) => <span className="font-mono">{row.vaccine_wastage}%</span>,
    },
    {
      key: "cold_chain_status",
      label: "Cold Chain",
      render: () => (
        <span className="inline-flex items-center gap-1.5">
          <span className="text-gray-400 text-xs font-semibold">Not tracked</span>
          <EstimatedBadge variant="not-tracked" />
        </span>
      ),
    },
    {
      key: "tracer_drug_availability",
      label: "Tracer Drug Availability",
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5">
          <span className="font-mono">{row.tracer_drug_availability}%</span>
          <EstimatedBadge variant="estimated" />
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6 print:hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={PackageX} label="Total Stock-Outs" value={kpis.stockOuts} tone="red" />
        <StatCard icon={Syringe} label="Avg Vaccine Wastage" value={`${kpis.avgWastage}%`} tone="amber" />
        <StatCard
          icon={ShieldCheck}
          label="Avg Tracer Drug Availability"
          value={`${kpis.avgAvailability}%`}
          tone="green"
          placeholder="estimated"
        />
        <StatCard icon={Snowflake} label="Cold Chain Monitoring" value="Not tracked" tone="neutral" placeholder="not-tracked" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h3 className="text-base font-bold text-[#101928] mb-1">Facilities by Stock-Outs</h3>
        <p className="text-xs text-gray-400 mb-5">Facilities with the most drug-category items at zero stock</p>
        {isLoading ? (
          <LoadingBlock label="Loading chart..." />
        ) : (
          <RankedBarList
            items={rows.map((r) => ({ label: r.facility, sublabel: r.lga, value: r.stock_outs }))}
            color="#DC2626"
            emptyMessage="No stock-outs recorded in this period."
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
