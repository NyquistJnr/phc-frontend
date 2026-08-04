"use client";

import { useEffect, useState } from "react";
import { Download, CalendarClock, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useFollowUpsReport, FollowUpRow } from "@/src/hooks/nurses/use-reports";

const ITEMS_PER_PAGE = 10;

function formatDisplayDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function FollowUpsTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFollowUpsReport({ startDate, endDate, page, pageSize: ITEMS_PER_PAGE });

  const rows = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;
  const summary = data?.summary_cards;

  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const handleExport = () => {
    if (!summary) return;
    setPrintPayload({
      reportTitle: "Nurse Follow-ups Worklist",
      periodLabel: "Live worklist (completed items filtered by date)",
      summaryCards: [
        { label: "Due Today", value: summary.due_today },
        { label: "Overdue", value: summary.overdue },
        { label: "Pending", value: summary.pending },
        { label: "Completed", value: summary.completed },
      ],
      columns: [
        { header: "Patient", key: "patient" },
        { header: "Reason", key: "reason_for_followup" },
        { header: "Due Date", key: "due_date" },
        { header: "Status", key: "status" },
        { header: "Assigned Nurse", key: "assigned_nurse" },
        { header: "Outcome", key: "outcome" },
      ],
      rows: rows.map((r) => ({
        patient: r.patient,
        reason_for_followup: r.reason_for_followup,
        due_date: formatDisplayDate(r.due_date),
        status: r.status,
        assigned_nurse: r.assigned_nurse ?? "Unassigned",
        outcome: r.outcome ?? "N/A",
      })),
      note: `Note: All outstanding items are always shown regardless of date filters.\nShowing page ${page} of ${totalPages}.`,
    });
  };

  const columns: Column<FollowUpRow>[] = [
    { key: "patient", label: "Patient" },
    { key: "reason_for_followup", label: "Reason", render: (row) => <span className="truncate max-w-[200px] block" title={row.reason_for_followup}>{row.reason_for_followup}</span> },
    { key: "due_date", label: "Due Date", render: (row) => formatDisplayDate(row.due_date) },
    { key: "status", label: "Status", render: (row) => (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
        row.status === 'COMPLETED' ? 'bg-[#E8F7F0] text-[#046C3F]' :
        row.status === 'PENDING' ? 'bg-[#FFF4E5] text-[#B45309]' :
        row.status === 'OVERDUE' ? 'bg-[#FEE2E2] text-[#DC2626]' :
        'bg-[#E0F2FE] text-[#0284C7]' // DUE_TODAY
      }`}>
        {row.status.replaceAll("_", " ")}
      </span>
    ) },
    { key: "assigned_nurse", label: "Assigned Nurse", render: (row) => row.assigned_nurse ?? <span className="text-gray-400 italic">Unassigned</span> },
    { key: "outcome", label: "Outcome", render: (row) => <span className="truncate max-w-[200px] block" title={row.outcome ?? ""}>{row.outcome ?? "-"}</span> },
  ];

  if (isLoading) return <LoadingBlock />;

  return (
    <>
      <div className="space-y-6 print:hidden">
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={CalendarClock} label="Due Today" value={summary.due_today} tone="blue" />
            <StatCard icon={AlertCircle} label="Overdue" value={summary.overdue} tone="red" />
            <StatCard icon={Clock} label="Pending (Future)" value={summary.pending} tone="amber" />
            <StatCard icon={CheckCircle2} label="Completed" value={summary.completed} tone="green" />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">
              Follow-ups & Next Visits <span className="text-gray-400 font-medium text-sm">({data?.count ?? 0})</span>
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
            <EmptyBlock label="No follow-ups found." />
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
