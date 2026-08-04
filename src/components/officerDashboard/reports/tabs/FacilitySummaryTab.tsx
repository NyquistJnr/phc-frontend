"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, ArrowRightLeft, CheckCircle2, Users2 } from "lucide-react";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import GroupedBarChart from "@/src/components/stateDashboard/reports/shared/GroupedBarChart";
import RankedBarList from "@/src/components/stateDashboard/reports/shared/RankedBarList";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useFacilitySummaryReport } from "@/src/hooks/oic/use-reports";

function formatShortDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function FacilitySummaryTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useFacilitySummaryReport({ startDate, endDate });
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const trend = data?.patient_attendance.trend ?? [];
  const formattedTrend = useMemo(
    () => trend.map((p) => ({ dateLabel: formatShortDate(p.date), count: p.count })),
    [trend],
  );

  const genderItems = useMemo(
    () => (data?.gender_distribution ?? []).map((g) => ({ label: g.label, value: g.count })),
    [data],
  );
  const ageItems = useMemo(
    () => (data?.age_distribution ?? []).map((a) => ({ label: a.age_group, value: a.count })),
    [data],
  );
  const diseaseItems = useMemo(
    () => (data?.top_diseases ?? []).map((d) => ({ label: d.disease, sublabel: `${d.percentage}%`, value: d.count })),
    [data],
  );
  const serviceItems = useMemo(
    () => (data?.service_utilization ?? []).map((s) => ({ label: s.label, value: s.count })),
    [data],
  );

  const handleExport = () => {
    if (!data) return;
    setPrintPayload({
      reportTitle: "Facility Summary Report",
      periodLabel,
      summaryCards: [
        { label: "Total Appointments", value: data.patient_attendance.total_appointments },
        { label: "Referrals Sent", value: data.referral_statistics.sent },
        { label: "Referrals Completed", value: data.referral_statistics.completed },
        { label: "Referral Completion Rate", value: `${data.referral_statistics.completion_rate}%` },
      ],
      columns: [
        { header: "Category", key: "category" },
        { header: "Breakdown", key: "breakdown" },
        { header: "Count", key: "count", align: "right" },
      ],
      rows: [
        ...data.gender_distribution.map((g) => ({ category: "Gender", breakdown: g.label, count: g.count })),
        ...data.age_distribution.map((a) => ({ category: "Age Group", breakdown: a.age_group, count: a.count })),
        ...data.top_diseases.map((d) => ({ category: "Top Disease", breakdown: `${d.disease} (${d.percentage}%)`, count: d.count })),
        ...data.service_utilization.map((s) => ({ category: "Service", breakdown: s.label, count: s.count })),
      ],
      note: "Top diseases are ranked by count out of total diagnosed consultations at this facility in the period (top 5 shown).",
    });
  };

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={CalendarCheck} label="Total Appointments" value={data?.patient_attendance.total_appointments ?? 0} tone="green" />
          <StatCard icon={ArrowRightLeft} label="Referrals Sent" value={data?.referral_statistics.sent ?? 0} tone="blue" />
          <StatCard icon={CheckCircle2} label="Referrals Completed" value={data?.referral_statistics.completed ?? 0} tone="amber" />
          <StatCard icon={Users2} label="Referral Completion Rate" value={`${data?.referral_statistics.completion_rate ?? 0}%`} tone="neutral" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
            <div>
              <h3 className="text-base font-bold text-[#101928]">Patient Attendance Trend</h3>
              <p className="text-xs text-gray-400 mt-0.5">Appointments over the selected period</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Export
            </button>
          </div>
          {isLoading ? (
            <LoadingBlock label="Loading chart..." />
          ) : (
            <GroupedBarChart
              data={formattedTrend}
              xKey="dateLabel"
              series={[{ key: "count", label: "Appointments", color: "#046C3F" }]}
              emptyMessage="No appointments recorded in this period."
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h3 className="text-base font-bold text-[#101928] mb-1">Gender Distribution</h3>
            <p className="text-xs text-gray-400 mb-5">Patients seen this period, by sex</p>
            {isLoading ? <LoadingBlock /> : genderItems.length === 0 ? <EmptyBlock /> : <RankedBarList items={genderItems} color="#0284C7" />}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h3 className="text-base font-bold text-[#101928] mb-1">Age Distribution</h3>
            <p className="text-xs text-gray-400 mb-5">Patients seen this period, by age group</p>
            {isLoading ? <LoadingBlock /> : ageItems.length === 0 ? <EmptyBlock /> : <RankedBarList items={ageItems} color="#B45309" />}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h3 className="text-base font-bold text-[#101928] mb-1">Top Diagnoses</h3>
            <p className="text-xs text-gray-400 mb-5">Most common diagnoses this period</p>
            {isLoading ? <LoadingBlock /> : diseaseItems.length === 0 ? <EmptyBlock /> : <RankedBarList items={diseaseItems} color="#DC2626" />}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h3 className="text-base font-bold text-[#101928] mb-1">Service Utilization</h3>
            <p className="text-xs text-gray-400 mb-5">Appointments by visit type</p>
            {isLoading ? <LoadingBlock /> : serviceItems.length === 0 ? <EmptyBlock /> : <RankedBarList items={serviceItems} color="#1AC073" />}
          </div>
        </div>
      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
