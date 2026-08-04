"use client";

import { useMemo } from "react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import { useDiseaseMorbidityReport, DiseaseMorbidityRow } from "@/src/hooks/doctors/use-reports";

export default function DiseaseMorbidityTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useDiseaseMorbidityReport({ startDate, endDate });

  const rows = data?.results ?? [];

  const columns: Column<DiseaseMorbidityRow>[] = useMemo(
    () => [
      { 
        key: "disease", 
        label: "Disease", 
        render: (row) => <span className="font-bold text-gray-900">{row.disease}</span> 
      },
      { 
        key: "male", 
        label: "Male", 
        align: "right",
        render: (row) => <span className="font-mono">{row.male}</span> 
      },
      { 
        key: "female", 
        label: "Female", 
        align: "right",
        render: (row) => <span className="font-mono">{row.female}</span> 
      },
      { 
        key: "under_5", 
        label: "Under 5", 
        align: "right",
        render: (row) => <span className="font-mono">{row.under_5}</span> 
      },
      { 
        key: "above_5", 
        label: "Above 5", 
        align: "right",
        render: (row) => <span className="font-mono">{row.above_5}</span> 
      },
      { 
        key: "total", 
        label: "Total", 
        align: "right",
        render: (row) => <span className="font-mono font-bold">{row.total}</span> 
      },
    ],
    []
  );

  return (
    <div className="space-y-6 print:hidden">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-50">
          <h3 className="font-bold text-gray-900 text-lg">Disease Morbidity</h3>
          <p className="text-xs text-gray-400">Case counts across fixed disease categories</p>
        </div>
        
        {isLoading ? (
          <LoadingBlock />
        ) : rows.length === 0 ? (
          <EmptyBlock label="No data available for this period." />
        ) : (
          <DataTable columns={columns} data={rows} />
        )}
      </div>
    </div>
  );
}
