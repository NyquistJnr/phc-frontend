"use client";

import { useState } from "react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import { SeverityBadge, StatusBadge } from "@/src/components/stateDashboard/reports/shared/Badges";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import { useAdverseEventsReport, AdverseEventRow } from "@/src/hooks/doctors/use-reports";

const ITEMS_PER_PAGE = 10;

function formatDisplayDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdverseEventsTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdverseEventsReport({ startDate, endDate, page, pageSize: ITEMS_PER_PAGE });

  const rows = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

  const columns: Column<AdverseEventRow>[] = [
    { key: "event_id", label: "Event ID", sortable: true, render: (row) => <span className="font-mono text-xs font-bold text-gray-900">{row.event_id}</span> },
    { key: "patient", label: "Patient", sortable: true },
    { key: "medicine_treatment", label: "Drug / Treatment" },
    { key: "adverse_event", label: "Adverse Event" },
    { key: "severity", label: "Severity", render: (row) => <SeverityBadge severity={row.severity} /> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "encounter_date", label: "Encounter Date", sortable: true, render: (row) => formatDisplayDate(row.encounter_date) },
  ];

  return (
    <div className="space-y-6 print:hidden">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">
            Adverse Events Reported <span className="text-gray-400 font-medium text-sm">({data?.count ?? 0})</span>
          </h3>
        </div>
        
        {isLoading ? (
          <LoadingBlock />
        ) : rows.length === 0 ? (
          <EmptyBlock label="No adverse events reported for this period." />
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
