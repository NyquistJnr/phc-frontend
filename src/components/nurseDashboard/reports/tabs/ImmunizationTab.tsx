"use client";

import { useEffect, useState, useMemo } from "react";
import { Download, Syringe, ShieldCheck, CalendarX } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import RankedBarList from "@/src/components/stateDashboard/reports/shared/RankedBarList";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useImmunizationReport, ImmunizationRow } from "@/src/hooks/nurses/use-reports";

const ITEMS_PER_PAGE = 10;

function formatDisplayDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ImmunizationTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useImmunizationReport({ startDate, endDate, page, pageSize: ITEMS_PER_PAGE });

  const rows = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;
  const summary = data?.summary_cards;

  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const vaccineItems = useMemo(() => {
    return (summary?.vaccines_administered_by_type ?? []).map((v) => ({
      label: v.vaccine,
      value: v.count,
    }));
  }, [summary]);

  const handleExport = () => {
    if (!summary) return;
    setPrintPayload({
      reportTitle: "Nurse Immunization Report",
      periodLabel,
      summaryCards: [
        { label: "Total Vaccinations", value: summary.total_vaccinations },
        { label: "Fully Immunized Children", value: summary.fully_immunized_children },
        { label: "Missed Appointments", value: summary.missed_appointments },
      ],
      columns: [
        { header: "Patient", key: "patient" },
        { header: "Vaccine", key: "vaccine" },
        { header: "Dose", key: "dose" },
        { header: "Date Administered", key: "date_administered" },
        { header: "Batch Number", key: "batch_number" },
        { header: "Next Due Date", key: "next_due_date" },
        { header: "Status", key: "status" },
      ],
      rows: rows.map((r) => ({
        patient: r.patient,
        vaccine: r.vaccine,
        dose: r.dose,
        date_administered: formatDisplayDate(r.date_administered),
        batch_number: r.batch_number ?? "Placeholder",
        next_due_date: r.next_due_date ? formatDisplayDate(r.next_due_date) : "N/A",
        status: r.status,
      })),
      note: `Note: 'Fully Immunized Children' is an all-time heuristic count for BCG + Penta3 + Measles. 'Batch Number' is currently a placeholder.\nShowing page ${page} of ${totalPages}.`,
    });
  };

  const columns: Column<ImmunizationRow>[] = [
    { key: "patient", label: "Patient" },
    { key: "vaccine", label: "Vaccine" },
    { key: "dose", label: "Dose" },
    { key: "date_administered", label: "Date Administered", render: (row) => formatDisplayDate(row.date_administered) },
    { key: "batch_number", label: "Batch Number", render: (row) => <span className="text-gray-400 italic">Placeholder</span> },
    { key: "next_due_date", label: "Next Due Date", render: (row) => row.next_due_date ? formatDisplayDate(row.next_due_date) : "-" },
    { key: "status", label: "Status", render: (row) => (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
        row.status === 'COMPLETED' ? 'bg-[#E8F7F0] text-[#046C3F]' :
        row.status === 'PENDING' ? 'bg-[#FFF4E5] text-[#B45309]' :
        'bg-[#FEE2E2] text-[#DC2626]' // MISSED
      }`}>
        {row.status}
      </span>
    ) },
  ];

  if (isLoading) return <LoadingBlock />;

  return (
    <>
      <div className="space-y-6 print:hidden">
        {summary && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-4">
              <StatCard icon={Syringe} label="Total Vaccinations" value={summary.total_vaccinations} tone="blue" />
              <StatCard icon={ShieldCheck} label="Fully Immunized Children" value={summary.fully_immunized_children} tone="green" subLabel="All-time heuristic (BCG + Penta3 + Measles)" />
              <StatCard icon={CalendarX} label="Missed Appointments" value={summary.missed_appointments} tone="red" />
            </div>

            <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h3 className="text-base font-bold text-[#101928] mb-1">Vaccines Administered by Type</h3>
              <p className="text-xs text-gray-400 mb-5">Breakdown of vaccines given</p>
              <RankedBarList items={vaccineItems} color="#0284C7" emptyMessage="No vaccines administered." />
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">
              Vaccination Log <span className="text-gray-400 font-medium text-sm">({data?.count ?? 0})</span>
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
            <EmptyBlock label="No vaccinations recorded for this period." />
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
