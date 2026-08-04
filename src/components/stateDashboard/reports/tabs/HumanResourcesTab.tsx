"use client";

import { useEffect, useMemo, useState } from "react";
import { Stethoscope, Users, HeartHandshake, CalendarCheck } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import StatCard from "../shared/StatCard";
import GroupedBarChart from "../shared/GroupedBarChart";
import TableToolbar from "../shared/TableToolbar";
import EstimatedBadge from "../shared/EstimatedBadge";
import { LoadingBlock, EmptyBlock } from "../shared/QueryState";
import PrintableReport, { PrintPayload } from "../shared/PrintableReport";
import { useLocalReportFilter } from "../shared/useLocalReportFilter";
import { getPeriodLabel } from "../shared/dateLabel";
import { useHumanResourcesReport, HumanResourcesRow } from "@/src/hooks/state/use-reports";

export default function HumanResourcesTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useHumanResourcesReport({ startDate, endDate });
  const rows = data?.results ?? [];
  const { search, setSearch, lga, setLga, lgaOptions, filtered } = useLocalReportFilter(rows);
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const kpis = useMemo(() => {
    const doctors = rows.reduce((acc, r) => acc + r.doctors, 0);
    const nurses = rows.reduce((acc, r) => acc + r.nurses, 0);
    const chews = rows.reduce((acc, r) => acc + r.chews, 0);
    const avgAttendance = rows.length
      ? Math.round((rows.reduce((acc, r) => acc + r.attendance_percent, 0) / rows.length) * 10) / 10
      : 0;
    return { doctors, nurses, chews, avgAttendance };
  }, [rows]);

  const staffMixTop = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b.doctors + b.nurses + b.chews - (a.doctors + a.nurses + a.chews))
        .slice(0, 10),
    [rows],
  );

  const handleExport = () => {
    setPrintPayload({
      reportTitle: "State Human Resources Report",
      periodLabel,
      summaryCards: [
        { label: "Doctors", value: kpis.doctors },
        { label: "Nurses", value: kpis.nurses },
        { label: "CHEWs", value: kpis.chews },
        { label: "Avg Attendance", value: `${kpis.avgAttendance}%` },
      ],
      columns: [
        { header: "Facility", key: "facility" },
        { header: "LGA", key: "lga" },
        { header: "Doctors", key: "doctors", align: "right" },
        { header: "Nurses", key: "nurses", align: "right" },
        { header: "CHEWs", key: "chews", align: "right" },
        { header: "Attendance", key: "attendance_percent", align: "right" },
      ],
      rows: filtered.map((r) => ({
        facility: r.facility,
        lga: r.lga,
        doctors: r.doctors,
        nurses: r.nurses,
        chews: r.chews,
        attendance_percent: `${r.attendance_percent}%`,
      })),
      note: "CHOs is a placeholder value (no Community Health Officer role exists yet). Attendance is approximated from login activity.",
    });
  };

  const columns: Column<HumanResourcesRow>[] = [
    { key: "facility", label: "Facility", sortable: true, render: (row) => <span className="font-bold text-gray-900">{row.facility}</span> },
    { key: "lga", label: "LGA", sortable: true },
    { key: "doctors", label: "Doctors", sortable: true, render: (row) => <span className="font-mono">{row.doctors}</span> },
    { key: "nurses", label: "Nurses", sortable: true, render: (row) => <span className="font-mono">{row.nurses}</span> },
    { key: "chews", label: "CHEWs", sortable: true, render: (row) => <span className="font-mono">{row.chews}</span> },
    {
      key: "chos",
      label: "CHOs",
      render: () => (
        <span className="inline-flex items-center gap-1.5">
          <span className="font-mono text-gray-400">0</span>
          <EstimatedBadge variant="not-tracked" />
        </span>
      ),
    },
    {
      key: "attendance_percent",
      label: "Attendance",
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5">
          <span className="font-mono">{row.attendance_percent}%</span>
          <EstimatedBadge variant="estimated" />
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6 print:hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Stethoscope} label="Doctors" value={kpis.doctors} tone="green" />
        <StatCard icon={Users} label="Nurses" value={kpis.nurses} tone="blue" />
        <StatCard icon={HeartHandshake} label="CHEWs" value={kpis.chews} tone="amber" />
        <StatCard icon={CalendarCheck} label="Avg Attendance" value={`${kpis.avgAttendance}%`} tone="neutral" placeholder="estimated" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
          <div>
            <h3 className="text-base font-bold text-[#101928]">Staff Mix — Top 10 Facilities</h3>
            <p className="text-xs text-gray-400 mt-0.5">Doctors, nurses and CHEWs by facility headcount</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#046C3F" }} />
              <span className="text-[11px] text-gray-500 font-medium">Doctors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#0284C7" }} />
              <span className="text-[11px] text-gray-500 font-medium">Nurses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#F79009" }} />
              <span className="text-[11px] text-gray-500 font-medium">CHEWs</span>
            </div>
          </div>
        </div>
        {isLoading ? (
          <LoadingBlock label="Loading chart..." />
        ) : (
          <GroupedBarChart
            data={staffMixTop}
            xKey="facility"
            series={[
              { key: "doctors", label: "Doctors", color: "#046C3F" },
              { key: "nurses", label: "Nurses", color: "#0284C7" },
              { key: "chews", label: "CHEWs", color: "#F79009" },
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
