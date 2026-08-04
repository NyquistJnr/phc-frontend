"use client";

import { useState } from "react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import { useReferralReport, ReferralReportRow } from "@/src/hooks/doctors/use-reports";

const ITEMS_PER_PAGE = 10;

function formatDisplayDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ReferralsTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useReferralReport({ startDate, endDate, page, pageSize: ITEMS_PER_PAGE });

  const rows = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

  const columns: Column<ReferralReportRow>[] = [
    { key: "referral_id", label: "Referral ID", sortable: true, render: (row) => <span className="font-mono text-xs font-bold text-gray-900">{row.referral_id}</span> },
    { key: "patient", label: "Patient", sortable: true },
    { key: "referral_date", label: "Date", sortable: true, render: (row) => formatDisplayDate(row.referral_date) },
    { key: "reason", label: "Reason", render: (row) => <span className="truncate max-w-[200px] block" title={row.reason}>{row.reason}</span> },
    { key: "receiving_facility", label: "Receiving Facility" },
    { key: "urgency", label: "Urgency", render: (row) => (
      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${row.urgency === 'Emergency' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
        {row.urgency}
      </span>
    ) },
    { key: "status", label: "Status", render: (row) => (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
        row.status === 'PENDING' ? 'bg-[#FFF4E5] text-[#B45309]' :
        row.status === 'ACCEPTED' ? 'bg-[#E0F2FE] text-[#0284C7]' :
        row.status === 'REJECTED' ? 'bg-[#FEE2E2] text-[#DC2626]' :
        row.status === 'CALL_CREATED' ? 'bg-[#E8F7F0] text-[#046C3F]' :
        'bg-gray-100 text-gray-500' // COMPLETED
      }`}>
        {row.status_label}
      </span>
    ) },
  ];

  return (
    <div className="space-y-6 print:hidden">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">
            Referrals Initiated <span className="text-gray-400 font-medium text-sm">({data?.count ?? 0})</span>
          </h3>
        </div>
        
        {isLoading ? (
          <LoadingBlock />
        ) : rows.length === 0 ? (
          <EmptyBlock label="No referrals found for this period." />
        ) : (
          <>
            <DataTable columns={columns} data={rows} />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
