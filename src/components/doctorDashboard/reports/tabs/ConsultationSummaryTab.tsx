"use client";

import { useMemo } from "react";
import { Stethoscope } from "lucide-react";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import RankedBarList from "@/src/components/stateDashboard/reports/shared/RankedBarList";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import { useConsultationSummaryReport } from "@/src/hooks/doctors/use-reports";

export default function ConsultationSummaryTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useConsultationSummaryReport({ startDate, endDate });

  const summary = data;

  const diagnosisItems = useMemo(() => {
    return (summary?.diagnosis_distribution ?? []).map((d) => ({
      label: d.diagnosis,
      value: d.count,
    }));
  }, [summary]);

  const treatmentItems = useMemo(() => {
    return (summary?.treatment_provided ?? []).map((t) => ({
      label: t.treatment,
      value: t.count,
    }));
  }, [summary]);

  const referralItems = useMemo(() => {
    return (summary?.referral_status ?? []).map((r) => ({
      label: r.label,
      value: r.count,
    }));
  }, [summary]);

  const outcomeItems = useMemo(() => {
    return (summary?.consultation_outcome ?? []).map((o) => ({
      label: o.outcome,
      value: o.count,
    }));
  }, [summary]);

  if (isLoading) {
    return <LoadingBlock />;
  }

  if (!summary) {
    return <EmptyBlock label="No consultation data found for this period." />;
  }

  return (
    <div className="space-y-6 print:hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Stethoscope} 
          label="Total Consultations" 
          value={summary.total_consultations} 
          tone="green" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h3 className="text-base font-bold text-[#101928] mb-1">Top Diagnoses</h3>
          <p className="text-xs text-gray-400 mb-5">Most frequent primary diagnoses</p>
          <RankedBarList items={diagnosisItems} color="#046C3F" emptyMessage="No diagnoses recorded." />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h3 className="text-base font-bold text-[#101928] mb-1">Top Treatments</h3>
          <p className="text-xs text-gray-400 mb-5">Most frequently provided treatments</p>
          <RankedBarList items={treatmentItems} color="#005A9C" emptyMessage="No treatments recorded." />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h3 className="text-base font-bold text-[#101928] mb-1">Consultation Outcomes</h3>
          <p className="text-xs text-gray-400 mb-5">Breakdown of outcomes</p>
          <RankedBarList items={outcomeItems} color="#E07A5F" emptyMessage="No outcomes recorded." />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h3 className="text-base font-bold text-[#101928] mb-1">Referral Statuses</h3>
          <p className="text-xs text-gray-400 mb-5">Status of referrals made from consultations</p>
          <RankedBarList items={referralItems} color="#F2CC8F" emptyMessage="No referrals recorded." />
        </div>
      </div>
    </div>
  );
}
