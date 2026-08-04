"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, Award, ArrowRightLeft, Building2 } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import StatCard from "../shared/StatCard";
import RankedBarList from "../shared/RankedBarList";
import TableToolbar from "../shared/TableToolbar";
import EstimatedBadge from "../shared/EstimatedBadge";
import { LoadingBlock, EmptyBlock } from "../shared/QueryState";
import PrintableReport, { PrintPayload } from "../shared/PrintableReport";
import { useLocalReportFilter } from "../shared/useLocalReportFilter";
import { getPeriodLabel } from "../shared/dateLabel";
import { useFacilityPerformanceReport, FacilityPerformanceRow } from "@/src/hooks/state/use-reports";

export default function FacilityPerformanceTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useFacilityPerformanceReport({ startDate, endDate });
  const rows = data?.results ?? [];
  const { search, setSearch, lga, setLga, lgaOptions, filtered } = useLocalReportFilter(rows);
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const kpis = useMemo(() => {
    const totalPatients = rows.reduce((acc, r) => acc + r.patients_seen, 0);
    const avgScore = rows.length
      ? Math.round((rows.reduce((acc, r) => acc + r.performance_score, 0) / rows.length) * 10) / 10
      : 0;
    const avgReferral = rows.length
      ? Math.round((rows.reduce((acc, r) => acc + r.referral_rate, 0) / rows.length) * 10) / 10
      : 0;
    return { totalPatients, avgScore, avgReferral, facilityCount: rows.length };
  }, [rows]);

  const handleExport = () => {
    setPrintPayload({
      reportTitle: "State Facility Performance Report",
      periodLabel,
      summaryCards: [
        { label: "Total Patients Seen", value: kpis.totalPatients },
        { label: "Avg Performance Score", value: `${kpis.avgScore}%` },
        { label: "Avg Referral Rate", value: `${kpis.avgReferral}%` },
        { label: "Facilities", value: kpis.facilityCount },
      ],
      columns: [
        { header: "Facility", key: "facility" },
        { header: "Code", key: "facility_code" },
        { header: "LGA", key: "lga" },
        { header: "Patients Seen", key: "patients_seen", align: "right" },
        { header: "Referral Rate", key: "referral_rate", align: "right" },
        { header: "Performance Score", key: "performance_score", align: "right" },
      ],
      rows: filtered.map((r) => ({
        facility: r.facility,
        facility_code: r.facility_code,
        lga: r.lga,
        patients_seen: r.patients_seen,
        referral_rate: `${r.referral_rate}%`,
        performance_score: `${r.performance_score}%`,
      })),
      note: "Reports Submitted and Reporting Timeliness columns are placeholder values (no submission-tracking model exists yet).",
    });
  };

  const columns: Column<FacilityPerformanceRow>[] = [
    {
      key: "facility",
      label: "Facility",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-gray-900">{row.facility}</p>
          <p className="text-[11px] text-gray-400 font-mono">{row.facility_code}</p>
        </div>
      ),
    },
    { key: "lga", label: "LGA", sortable: true },
    {
      key: "patients_seen",
      label: "Patients Seen",
      sortable: true,
      render: (row) => <span className="font-mono">{row.patients_seen}</span>,
    },
    {
      key: "reports_submitted",
      label: "Reports Submitted",
      render: () => (
        <span className="inline-flex items-center gap-1.5">
          <span className="font-mono text-gray-400">0</span>
          <EstimatedBadge variant="not-tracked" />
        </span>
      ),
    },
    {
      key: "referral_rate",
      label: "Referral Rate",
      sortable: true,
      render: (row) => <span className="font-mono">{row.referral_rate}%</span>,
    },
    {
      key: "performance_score",
      label: "Performance Score",
      sortable: true,
      render: (row) => {
        const good = row.performance_score >= 75;
        const warn = row.performance_score >= 50 && row.performance_score < 75;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
              good ? "bg-[#E8F7F0] text-[#046C3F]" : warn ? "bg-[#FFF4E5] text-[#B45309]" : "bg-[#FEE2E2] text-[#DC2626]"
            }`}
          >
            {row.performance_score}%
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div className="space-y-6 print:hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Patients Seen" value={kpis.totalPatients.toLocaleString()} tone="green" />
        <StatCard icon={Award} label="Avg Performance Score" value={`${kpis.avgScore}%`} tone="blue" />
        <StatCard icon={ArrowRightLeft} label="Avg Referral Rate" value={`${kpis.avgReferral}%`} tone="amber" />
        <StatCard icon={Building2} label="Facilities Reporting" value={kpis.facilityCount} tone="neutral" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h3 className="text-base font-bold text-[#101928] mb-1">Top Facilities by Performance Score</h3>
        <p className="text-xs text-gray-400 mb-5">Ranked composite score of patient load and reporting timeliness</p>
        {isLoading ? (
          <LoadingBlock label="Loading chart..." />
        ) : (
          <RankedBarList
            items={rows.map((r) => ({ label: r.facility, sublabel: r.lga, value: r.performance_score }))}
            formatValue={(v) => `${v}%`}
            color="#046C3F"
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
