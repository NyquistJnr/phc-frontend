"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Ambulance, CheckCircle2, Siren, Clock3 } from "lucide-react";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import RankedBarList from "@/src/components/stateDashboard/reports/shared/RankedBarList";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useReferralsReport } from "@/src/hooks/oic/use-reports";

export default function ReferralsTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useReferralsReport({ startDate, endDate });
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const destinationItems = useMemo(
    () => (data?.referral_destinations ?? []).map((d) => ({ label: d.destination, value: d.count })),
    [data],
  );

  const completionRate = data && data.total_referrals > 0 ? Math.round((data.completed_referrals / data.total_referrals) * 1000) / 10 : 0;

  const handleExport = () => {
    if (!data) return;
    setPrintPayload({
      reportTitle: "Referral Report",
      periodLabel,
      summaryCards: [
        { label: "Total Referrals Sent", value: data.total_referrals },
        { label: "Completed", value: data.completed_referrals },
        { label: "Emergency", value: data.emergency_referrals },
        { label: "Completion Rate", value: `${completionRate}%` },
      ],
      columns: [
        { header: "Destination", key: "destination" },
        { header: "Referrals", key: "count", align: "right" },
      ],
      rows: data.referral_destinations.map((d) => ({ destination: d.destination, count: d.count })),
      note: "Scoped to referrals sent out from this facility. Average referral time is computed only from referrals marked COMPLETED.",
    });
  };

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={ArrowRightLeft} label="Total Referrals Sent" value={data?.total_referrals ?? 0} tone="green" />
          <StatCard icon={CheckCircle2} label="Completed" value={data?.completed_referrals ?? 0} subLabel={`${completionRate}% completion rate`} tone="blue" />
          <StatCard icon={Siren} label="Emergency Referrals" value={data?.emergency_referrals ?? 0} tone="red" />
          <StatCard icon={Ambulance} label="Ambulance Referrals" value={data?.ambulance_referrals ?? 0} tone="amber" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Clock3} label="Avg. Referral Time" value={`${data?.average_referral_time_hours ?? 0} hrs`} subLabel="Completed referrals only" tone="neutral" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-bold text-[#101928]">Referral Destinations</h3>
              <p className="text-xs text-gray-400 mt-0.5">Where referrals from this facility are sent</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Export
            </button>
          </div>
          {isLoading ? (
            <LoadingBlock label="Loading destinations..." />
          ) : destinationItems.length === 0 ? (
            <EmptyBlock label="No referrals sent in this period." />
          ) : (
            <RankedBarList items={destinationItems} limit={10} color="#0284C7" />
          )}
        </div>
      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
