"use client";

import { useEffect, useState } from "react";
import { Download, Baby, UserCheck, Stethoscope, AlertTriangle, ListTodo } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { usePncReport, PNCReportRow } from "@/src/hooks/nurses/use-reports";

const ITEMS_PER_PAGE = 10;

function formatDisplayDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PostnatalCareTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePncReport({ startDate, endDate, page, pageSize: ITEMS_PER_PAGE });

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
      reportTitle: "Nurse Postnatal Care Report",
      periodLabel,
      summaryCards: [
        { label: "Total PNC Visits", value: summary.total_pnc_visits },
        { label: "Mothers Reviewed", value: summary.mothers_reviewed },
        { label: "Babies Reviewed", value: summary.babies_reviewed },
        { label: "Complications Identified", value: summary.complications_identified },
        { label: "Follow-ups Due", value: summary.follow_ups_due },
      ],
      columns: [
        { header: "Mother", key: "mother" },
        { header: "Baby", key: "baby" },
        { header: "Delivery Date", key: "delivery_date" },
        { header: "Visit Type", key: "visit_type" },
        { header: "Findings", key: "findings" },
        { header: "Complications", key: "complications" },
        { header: "Follow-up Status", key: "follow_up_status" },
      ],
      rows: rows.map((r) => ({
        mother: r.mother,
        baby: r.baby ?? "N/A",
        delivery_date: r.delivery_date ? formatDisplayDate(r.delivery_date) : "N/A (Approximated)",
        visit_type: r.visit_type,
        findings: r.findings ?? "N/A",
        complications: r.complications ?? "None",
        follow_up_status: r.follow_up_status.replaceAll("_", " "),
      })),
      note: `Note: 'Follow-ups Due' is not date-scoped and shows current pending tasks. 'Delivery Date' is an approximation.\nShowing page ${page} of ${totalPages}.`,
    });
  };

  const columns: Column<PNCReportRow>[] = [
    { key: "mother", label: "Mother" },
    { key: "baby", label: "Baby", render: (row) => row.baby ?? <span className="text-gray-400 italic">None</span> },
    { key: "delivery_date", label: "Delivery Date", render: (row) => row.delivery_date ? formatDisplayDate(row.delivery_date) : <span className="text-gray-400 italic">N/A</span> },
    { key: "visit_type", label: "Visit Type" },
    { key: "findings", label: "Findings", render: (row) => <span className="truncate max-w-[200px] block" title={row.findings ?? ""}>{row.findings ?? "-"}</span> },
    { key: "complications", label: "Complications", render: (row) => (
      row.complications ? <span className="text-red-600 font-medium">{row.complications}</span> : <span className="text-gray-500">None</span>
    ) },
    { key: "follow_up_status", label: "Follow-up Status", render: (row) => (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
        row.follow_up_status === 'COMPLETE' ? 'bg-[#E8F7F0] text-[#046C3F]' :
        row.follow_up_status === 'PENDING' ? 'bg-[#FFF4E5] text-[#B45309]' :
        row.follow_up_status === 'OVERDUE' ? 'bg-[#FEE2E2] text-[#DC2626]' :
        'bg-[#E0F2FE] text-[#0284C7]' // DUE_TODAY
      }`}>
        {row.follow_up_status.replaceAll("_", " ")}
      </span>
    ) },
  ];

  if (isLoading) return <LoadingBlock />;

  return (
    <>
      <div className="space-y-6 print:hidden">
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard icon={Baby} label="Total PNC Visits" value={summary.total_pnc_visits} tone="blue" />
            <StatCard icon={UserCheck} label="Mothers Reviewed" value={summary.mothers_reviewed} tone="neutral" />
            <StatCard icon={Stethoscope} label="Babies Reviewed" value={summary.babies_reviewed} tone="green" />
            <StatCard icon={AlertTriangle} label="Complications Identified" value={summary.complications_identified} tone="red" />
            <StatCard icon={ListTodo} label="Follow-ups Due" value={summary.follow_ups_due} tone="amber" subLabel="Currently due/overdue" />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">
              Postnatal Care Visits <span className="text-gray-400 font-medium text-sm">({data?.count ?? 0})</span>
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
            <EmptyBlock label="No PNC visits recorded for this period." />
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
