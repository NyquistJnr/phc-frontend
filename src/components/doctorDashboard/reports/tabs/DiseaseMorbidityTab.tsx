"use client";

import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useDiseaseMorbidityReport, DiseaseMorbidityRow } from "@/src/hooks/doctors/use-reports";

export default function DiseaseMorbidityTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useDiseaseMorbidityReport({ startDate, endDate });

  const rows = data?.results ?? [];

  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const handleExport = () => {
    setPrintPayload({
      reportTitle: "Doctor Disease Morbidity Report",
      periodLabel,
      columns: [
        { header: "Disease", key: "disease" },
        { header: "Male", key: "male", align: "right" },
        { header: "Female", key: "female", align: "right" },
        { header: "Under 5", key: "under_5", align: "right" },
        { header: "Above 5", key: "above_5", align: "right" },
        { header: "Total", key: "total", align: "right" },
      ],
      rows: rows.map((r) => ({
        disease: r.disease,
        male: r.male,
        female: r.female,
        under_5: r.under_5,
        above_5: r.above_5,
        total: r.total,
      })),
      note: "Data represents cases across 10 fixed disease categories.",
    });
  };

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
    <>
      <div className="space-y-6 print:hidden">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Disease Morbidity</h3>
            <p className="text-xs text-gray-400">Case counts across fixed disease categories</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
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
    <PrintableReport payload={printPayload} />
  </>
  );
}
