"use client";

import { useEffect, useState, useMemo } from "react";
import { Download, BookOpen, Users } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import RankedBarList from "@/src/components/stateDashboard/reports/shared/RankedBarList";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useHealthEducationReport, HealthEducationRow } from "@/src/hooks/nurses/use-reports";

const ITEMS_PER_PAGE = 10;

function formatDisplayDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HealthEducationTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useHealthEducationReport({ startDate, endDate, page, pageSize: ITEMS_PER_PAGE });

  const rows = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;
  const summary = data?.summary_cards;

  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const topicItems = useMemo(() => {
    return (summary?.most_covered_topics ?? []).map((t: any) => ({
      label: t.title ?? t.topic ?? "Unknown Topic",
      value: t.count,
    }));
  }, [summary]);

  const handleExport = () => {
    if (!summary) return;
    setPrintPayload({
      reportTitle: "Nurse Health Education Report",
      periodLabel,
      summaryCards: [
        { label: "Sessions Conducted", value: summary.sessions_conducted },
        { label: "Total Participants", value: summary.total_participants },
      ],
      columns: [
        { header: "Date & Time", key: "session_date" },
        { header: "Topic", key: "topic" },
        { header: "Audience", key: "audience" },
        { header: "Participants", key: "number_of_participants" },
        { header: "Facilitator", key: "facilitator" },
        { header: "Location", key: "location" },
      ],
      rows: rows.map((r) => ({
        session_date: formatDisplayDate(r.session_date),
        topic: r.topic,
        audience: r.audience,
        number_of_participants: String(r.number_of_participants),
        facilitator: r.facilitator,
        location: r.location,
      })),
      note: `Note: 'Topic' maps directly to the session title. 'Participants' reflects actual attendance if available, otherwise estimated.\nShowing page ${page} of ${totalPages}.`,
    });
  };

  const columns: Column<HealthEducationRow>[] = [
    { key: "session_date", label: "Date & Time", render: (row) => formatDisplayDate(row.session_date) },
    { key: "topic", label: "Topic (Title)" },
    { key: "audience", label: "Audience" },
    { key: "number_of_participants", label: "Participants" },
    { key: "facilitator", label: "Facilitator" },
    { key: "location", label: "Location" },
  ];

  if (isLoading) return <LoadingBlock />;

  return (
    <>
      <div className="space-y-6 print:hidden">
        {summary && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-4">
              <StatCard icon={BookOpen} label="Sessions Conducted" value={summary.sessions_conducted} tone="blue" subLabel="Completed sessions only" />
              <StatCard icon={Users} label="Total Participants" value={summary.total_participants} tone="neutral" subLabel="Actual or estimated" />
            </div>

            <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h3 className="text-base font-bold text-[#101928] mb-1">Most Covered Topics</h3>
              <p className="text-xs text-gray-400 mb-5">Top 5 education sessions by frequency</p>
              <RankedBarList items={topicItems} color="#0284C7" emptyMessage="No topics recorded." />
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">
              Education Sessions <span className="text-gray-400 font-medium text-sm">({data?.count ?? 0})</span>
            </h3>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Download size={16} />
              Export
            </button>
          </div>
          
          {rows.length === 0 ? (
            <EmptyBlock label="No health education sessions found for this period." />
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
