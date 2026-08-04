"use client";

import { useEffect, useState } from "react";
import { Download, Activity, HeartPulse, Thermometer, Wind, Beaker } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useVitalSignsReport, VitalSignsRow } from "@/src/hooks/nurses/use-reports";

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

export default function VitalSignsTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useVitalSignsReport({ startDate, endDate, page, pageSize: ITEMS_PER_PAGE });

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
      reportTitle: "Nurse Vital Signs Report",
      periodLabel,
      summaryCards: [
        { label: "Total Assessments", value: summary.total_vital_assessments },
        { label: "High BP Cases", value: summary.high_blood_pressure_cases },
        { label: "Fever Cases", value: summary.fever_cases },
        { label: "Abnormal Pulse", value: summary.abnormal_pulse_cases },
        { label: "Abnormal Resp Rate", value: summary.abnormal_respiratory_rate_cases },
      ],
      columns: [
        { header: "Date", key: "date" },
        { header: "Patient", key: "patient" },
        { header: "Temp (°C)", key: "temperature" },
        { header: "BP", key: "blood_pressure" },
        { header: "Pulse", key: "pulse" },
        { header: "Resp Rate", key: "respiratory_rate" },
        { header: "BMI", key: "bmi" },
        { header: "Recorded By", key: "recorded_by" },
      ],
      rows: rows.map((r) => ({
        date: formatDisplayDate(r.date),
        patient: r.patient,
        temperature: r.temperature ?? "N/A",
        blood_pressure: r.blood_pressure ?? "N/A",
        pulse: r.pulse ?? "N/A",
        respiratory_rate: r.respiratory_rate ?? "N/A",
        bmi: r.bmi ?? "N/A",
        recorded_by: r.recorded_by,
      })),
      note: `Showing page ${page} of ${totalPages}.`,
    });
  };

  const columns: Column<VitalSignsRow>[] = [
    { key: "date", label: "Date & Time", render: (row) => formatDisplayDate(row.date) },
    { key: "patient", label: "Patient" },
    { key: "temperature", label: "Temp (°C)", render: (row) => row.temperature ?? "-" },
    { key: "blood_pressure", label: "BP", render: (row) => row.blood_pressure ?? "-" },
    { key: "pulse", label: "Pulse", render: (row) => row.pulse ?? "-" },
    { key: "respiratory_rate", label: "Resp Rate", render: (row) => row.respiratory_rate ?? "-" },
    { key: "bmi", label: "BMI", render: (row) => row.bmi ?? "-" },
    { key: "recorded_by", label: "Recorded By" },
  ];

  if (isLoading) return <LoadingBlock />;

  return (
    <>
      <div className="space-y-6 print:hidden">
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard icon={Activity} label="Total Assessments" value={summary.total_vital_assessments} tone="blue" />
            <StatCard icon={HeartPulse} label="High BP Cases" value={summary.high_blood_pressure_cases} tone="red" />
            <StatCard icon={Thermometer} label="Fever Cases" value={summary.fever_cases} tone="amber" />
            <StatCard icon={Beaker} label="Abnormal Pulse" value={summary.abnormal_pulse_cases} tone="neutral" />
            <StatCard icon={Wind} label="Abnormal Resp Rate" value={summary.abnormal_respiratory_rate_cases} tone="neutral" />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">
              Vital Signs Log <span className="text-gray-400 font-medium text-sm">({data?.count ?? 0})</span>
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
            <EmptyBlock label="No vitals recorded for this period." />
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
