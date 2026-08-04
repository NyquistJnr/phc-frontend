"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, AlertOctagon, CheckCircle2, Clock3, Download } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import StatCard from "../shared/StatCard";
import { SeverityBadge, StatusBadge } from "../shared/Badges";
import { LoadingBlock, EmptyBlock } from "../shared/QueryState";
import PrintableReport, { PrintPayload } from "../shared/PrintableReport";
import { getPeriodLabel } from "../shared/dateLabel";
import { useAdverseEventsReport, AdverseEventRow } from "@/src/hooks/state/use-reports";

const ITEMS_PER_PAGE = 10;

function formatDisplayDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdverseEventsTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdverseEventsReport({ startDate, endDate, page, pageSize: ITEMS_PER_PAGE });

  const rows = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;
  const summary = data?.summary_cards;

  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const handleExport = () => {
    setPrintPayload({
      reportTitle: "State Adverse Events Report",
      periodLabel,
      summaryCards: [
        { label: "Total Events", value: summary?.total_adverse_events ?? 0 },
        { label: "Severe / Life-Threatening / Fatal", value: summary?.severe_events ?? 0 },
        { label: "Resolved", value: summary?.resolved ?? 0 },
        { label: "Pending", value: summary?.pending ?? 0 },
      ],
      columns: [
        { header: "Event ID", key: "event_id" },
        { header: "Facility", key: "facility" },
        { header: "Patient", key: "patient" },
        { header: "Drug / Treatment", key: "drug_treatment" },
        { header: "Adverse Event", key: "adverse_event" },
        { header: "Severity", key: "severity" },
        { header: "Status", key: "status" },
        { header: "Date Reported", key: "date_reported" },
      ],
      rows: rows.map((r) => ({
        event_id: r.event_id,
        facility: r.facility ?? "—",
        patient: r.patient,
        drug_treatment: r.drug_treatment,
        adverse_event: r.adverse_event,
        severity: r.severity.replaceAll("_", " "),
        status: r.status.replaceAll("_", " "),
        date_reported: formatDisplayDate(r.date_reported),
      })),
      note: `Showing page ${page} of ${totalPages}. Most common drug: ${summary?.most_common_drug ?? "N/A"}. Most common reaction: ${summary?.most_common_reaction ?? "N/A"}.`,
    });
  };

  const columns: Column<AdverseEventRow>[] = [
    { key: "event_id", label: "Event ID", sortable: true, render: (row) => <span className="font-mono text-xs font-bold text-gray-900">{row.event_id}</span> },
    { key: "facility", label: "Facility", render: (row) => row.facility ?? <span className="text-gray-300">—</span> },
    { key: "patient", label: "Patient", sortable: true },
    { key: "drug_treatment", label: "Drug / Treatment" },
    { key: "adverse_event", label: "Adverse Event" },
    { key: "severity", label: "Severity", render: (row) => <SeverityBadge severity={row.severity} /> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "date_reported", label: "Date Reported", sortable: true, render: (row) => formatDisplayDate(row.date_reported) },
  ];

  return (
    <>
      <div className="space-y-6 print:hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShieldAlert} label="Total Events" value={summary?.total_adverse_events ?? 0} tone="neutral" />
        <StatCard icon={AlertOctagon} label="Severe & Above" value={summary?.severe_events ?? 0} tone="red" />
        <StatCard icon={CheckCircle2} label="Resolved" value={summary?.resolved ?? 0} tone="green" />
        <StatCard icon={Clock3} label="Pending" value={summary?.pending ?? 0} tone="amber" />
      </div>

      {(summary?.most_common_drug || summary?.most_common_reaction) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">Most Common Drug</span>
            <span className="text-sm font-bold text-gray-900">{summary?.most_common_drug ?? "N/A"}</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">Most Common Reaction</span>
            <span className="text-sm font-bold text-gray-900">{summary?.most_common_reaction ?? "N/A"}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-50">
          <h3 className="font-bold text-gray-900 text-lg">
            Adverse Events <span className="text-gray-400 font-medium text-sm">({data?.count ?? 0})</span>
          </h3>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
        </div>
        {isLoading ? (
          <LoadingBlock />
        ) : rows.length === 0 ? (
          <EmptyBlock label="No adverse events reported for this period." />
        ) : (
          <>
            <DataTable columns={columns} data={rows} />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
