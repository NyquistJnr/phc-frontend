"use client";

import { useEffect, useState } from "react";
import { Download, Heart, Users, AlertCircle, ShieldPlus, TestTube } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useMaternalCareReport, MaternalCareRow } from "@/src/hooks/nurses/use-reports";

const ITEMS_PER_PAGE = 10;

export default function MaternalCareTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMaternalCareReport({ startDate, endDate, page, pageSize: ITEMS_PER_PAGE });

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
      reportTitle: "Nurse Maternal Care (ANC) Report",
      periodLabel,
      summaryCards: [
        { label: "ANC 1 Visits", value: summary.anc_1_visits },
        { label: "Repeat ANC Visits", value: summary.repeat_anc_visits },
        { label: "High Risk Pregnancies", value: summary.high_risk_pregnancies },
        { label: "IPTp Coverage", value: `${summary.iptp_coverage.toFixed(1)}%` },
        { label: "HIV Tests Conducted", value: summary.hiv_tests_conducted },
      ],
      columns: [
        { header: "Patient", key: "patient" },
        { header: "ANC Visit #", key: "anc_visit" },
        { header: "Gestational Age (wks)", key: "gestational_age_weeks" },
        { header: "BP", key: "blood_pressure" },
        { header: "Hb Status", key: "hb_status" },
        { header: "IPTp Dose", key: "iptp_dose" },
        { header: "HIV Status", key: "hiv_status" },
        { header: "Risk Level", key: "risk_level" },
      ],
      rows: rows.map((r) => ({
        patient: r.patient,
        anc_visit: String(r.anc_visit),
        gestational_age_weeks: r.gestational_age_weeks ? String(r.gestational_age_weeks) : "N/A",
        blood_pressure: r.blood_pressure ?? "N/A",
        hb_status: r.hb_status,
        iptp_dose: r.iptp_dose ?? "None",
        hiv_status: r.hiv_status ?? "Unknown",
        risk_level: r.risk_level,
      })),
      note: `Note: 'Hb Status' and 'Risk Level' are derived heuristics.\nShowing page ${page} of ${totalPages}.`,
    });
  };

  const columns: Column<MaternalCareRow>[] = [
    { key: "patient", label: "Patient" },
    { key: "anc_visit", label: "Visit #" },
    { key: "gestational_age_weeks", label: "Gestational Age", render: (row) => row.gestational_age_weeks ? `${row.gestational_age_weeks} wks` : "-" },
    { key: "blood_pressure", label: "BP", render: (row) => row.blood_pressure ?? "-" },
    { key: "hb_status", label: "Hb Status", render: (row) => (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
        row.hb_status === 'Normal' ? 'bg-[#E8F7F0] text-[#046C3F]' :
        row.hb_status.includes('Severe') ? 'bg-[#FEE2E2] text-[#DC2626]' :
        'bg-[#FFF4E5] text-[#B45309]'
      }`}>
        {row.hb_status}
      </span>
    ) },
    { key: "iptp_dose", label: "IPTp Dose", render: (row) => row.iptp_dose ?? <span className="text-gray-400 italic">None</span> },
    { key: "hiv_status", label: "HIV Status", render: (row) => row.hiv_status ?? "-" },
    { key: "risk_level", label: "Risk Level", render: (row) => (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
        row.risk_level === 'HIGH' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#E8F7F0] text-[#046C3F]'
      }`}>
        {row.risk_level}
      </span>
    ) },
  ];

  if (isLoading) return <LoadingBlock />;

  return (
    <>
      <div className="space-y-6 print:hidden">
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard icon={Heart} label="ANC 1 Visits" value={summary.anc_1_visits} tone="blue" />
            <StatCard icon={Users} label="Repeat ANC Visits" value={summary.repeat_anc_visits} tone="purple" />
            <StatCard icon={AlertCircle} label="High Risk Pregnancies" value={summary.high_risk_pregnancies} tone="red" subLabel="Based on recorded risk factors" />
            <StatCard icon={ShieldPlus} label="IPTp Coverage" value={`${summary.iptp_coverage.toFixed(1)}%`} tone="green" />
            <StatCard icon={TestTube} label="HIV Tests Conducted" value={summary.hiv_tests_conducted} tone="amber" />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">
              Antenatal Care Visits <span className="text-gray-400 font-medium text-sm">({data?.count ?? 0})</span>
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
            <EmptyBlock label="No ANC visits recorded for this period." />
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
