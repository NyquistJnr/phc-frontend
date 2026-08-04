"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Activity, ShieldAlert, ListChecks } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import { LoadingBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { EpidemicProneBadge, NotInRegistryBadge, SeverityDot } from "../shared/OicBadges";
import { useDiseaseSurveillanceReport, DiseaseSurveillanceItem } from "@/src/hooks/oic/use-reports";

export default function DiseaseSurveillanceTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useDiseaseSurveillanceReport({ startDate, endDate });
  const rows = data?.results ?? [];
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const outbreaks = useMemo(() => rows.filter((r) => r.is_epidemic_prone && r.cases > 0), [rows]);

  const kpis = useMemo(() => {
    const totalCases = rows.reduce((acc, r) => acc + r.cases, 0);
    const diseasesWithCases = rows.filter((r) => r.cases > 0).length;
    const trackedDiseases = rows.filter((r) => r.in_registry).length;
    return { totalCases, diseasesWithCases, trackedDiseases, activeAlerts: outbreaks.length };
  }, [rows, outbreaks]);

  const handleExport = () => {
    setPrintPayload({
      reportTitle: "Disease Surveillance Report",
      periodLabel,
      summaryCards: [
        { label: "Total Cases", value: kpis.totalCases },
        { label: "Diseases with Cases", value: kpis.diseasesWithCases },
        { label: "Active Epidemic Alerts", value: kpis.activeAlerts },
        { label: "Diseases in Registry", value: `${kpis.trackedDiseases}/${rows.length}` },
      ],
      columns: [
        { header: "Disease", key: "disease" },
        { header: "Cases", key: "cases", align: "right" },
        { header: "Severity", key: "severity" },
        { header: "Epidemic-Prone", key: "epidemic_prone" },
        { header: "In Registry", key: "in_registry" },
      ],
      rows: rows.map((r) => ({
        disease: r.disease,
        cases: r.cases,
        severity: r.severity ?? "—",
        epidemic_prone: r.is_epidemic_prone ? "Yes" : "No",
        in_registry: r.in_registry ? "Yes" : "No",
      })),
      note: "Epidemic-prone is driven by disease-registry severity (CRITICAL). Diseases not yet in the registry always show 0 cases.",
    });
  };

  const columns: Column<DiseaseSurveillanceItem>[] = [
    {
      key: "disease",
      label: "Disease",
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <SeverityDot severity={row.severity} />
          <span className="font-bold text-gray-900">{row.disease}</span>
        </span>
      ),
    },
    { key: "cases", label: "Cases", sortable: true, render: (row) => <span className="font-mono">{row.cases}</span> },
    {
      key: "severity",
      label: "Severity",
      render: (row) => (row.severity ? <span className="text-xs font-semibold text-gray-600">{row.severity}</span> : <span className="text-xs text-gray-300">—</span>),
    },
    {
      key: "status",
      label: "Status",
      render: (row) =>
        row.is_epidemic_prone ? (
          <EpidemicProneBadge />
        ) : !row.in_registry ? (
          <NotInRegistryBadge />
        ) : (
          <span className="text-xs text-gray-300">—</span>
        ),
    },
  ];

  return (
    <>
      <div className="space-y-6 print:hidden">
        {outbreaks.length > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-red-700 mb-1.5">
                Outbreak Watch — {outbreaks.length} epidemic-prone disease{outbreaks.length === 1 ? "" : "s"} with active cases
              </p>
              <div className="flex flex-wrap gap-2">
                {outbreaks.map((o) => (
                  <span
                    key={o.disease}
                    className="inline-flex items-center gap-1.5 bg-white border border-red-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-700"
                  >
                    {o.disease}
                    <span className="text-red-400">·</span>
                    {o.cases} cases
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Activity} label="Total Cases" value={kpis.totalCases} tone={kpis.totalCases > 0 ? "red" : "neutral"} />
          <StatCard icon={ListChecks} label="Diseases with Cases" value={kpis.diseasesWithCases} subLabel={`of ${rows.length} tracked`} tone="amber" />
          <StatCard icon={ShieldAlert} label="Active Epidemic Alerts" value={kpis.activeAlerts} tone={kpis.activeAlerts > 0 ? "red" : "neutral"} />
          <StatCard icon={ListChecks} label="Diseases in Registry" value={`${kpis.trackedDiseases}/${rows.length}`} tone="neutral" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-50">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Disease Surveillance List</h3>
              <p className="text-xs text-gray-400 mt-0.5">Fixed set of 11 monitored diseases, this facility</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Export
            </button>
          </div>
          {isLoading ? <LoadingBlock /> : <DataTable columns={columns} data={rows} />}
        </div>
      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
