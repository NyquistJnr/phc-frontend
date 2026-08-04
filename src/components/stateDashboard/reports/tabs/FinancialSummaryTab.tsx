"use client";

import { useEffect, useState } from "react";
import { Construction, Wallet, Receipt, Landmark, Scale } from "lucide-react";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import StatCard from "../shared/StatCard";
import TableToolbar from "../shared/TableToolbar";
import EstimatedBadge from "../shared/EstimatedBadge";
import { LoadingBlock, EmptyBlock } from "../shared/QueryState";
import PrintableReport, { PrintPayload } from "../shared/PrintableReport";
import { useLocalReportFilter } from "../shared/useLocalReportFilter";
import { getPeriodLabel } from "../shared/dateLabel";
import { useFinancialSummaryReport, FinancialSummaryRow } from "@/src/hooks/state/use-reports";

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export default function FinancialSummaryTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useFinancialSummaryReport({ startDate, endDate });
  const rows = data?.results ?? [];
  const { search, setSearch, lga, setLga, lgaOptions, filtered } = useLocalReportFilter(rows);
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const handleExport = () => {
    setPrintPayload({
      reportTitle: "State Financial Summary Report",
      periodLabel,
      summaryCards: [
        { label: "Revenue", value: formatNaira(0) },
        { label: "Expenditure", value: formatNaira(0) },
        { label: "BHCPF Funds", value: formatNaira(0) },
        { label: "Balance", value: formatNaira(0) },
      ],
      columns: [
        { header: "Facility", key: "facility" },
        { header: "LGA", key: "lga" },
        { header: "Revenue", key: "revenue", align: "right" },
        { header: "Expenditure", key: "expenditure", align: "right" },
        { header: "BHCPF Funds", key: "bhcpf_funds", align: "right" },
        { header: "Balance", key: "balance", align: "right" },
      ],
      rows: filtered.map((r) => ({
        facility: r.facility,
        lga: r.lga,
        revenue: formatNaira(r.revenue),
        expenditure: formatNaira(r.expenditure),
        bhcpf_funds: formatNaira(r.bhcpf_funds),
        balance: formatNaira(r.balance),
      })),
      note: "This entire report is a placeholder — no finance module exists yet. All monetary values are always 0.",
    });
  };

  const moneyColumn = (key: keyof FinancialSummaryRow, label: string): Column<FinancialSummaryRow> => ({
    key,
    label,
    render: (row) => (
      <span className="inline-flex items-center gap-1.5">
        <span className="font-mono text-gray-400">{formatNaira(row[key] as number)}</span>
        <EstimatedBadge variant="not-tracked" />
      </span>
    ),
  });

  const columns: Column<FinancialSummaryRow>[] = [
    { key: "facility", label: "Facility", sortable: true, render: (row) => <span className="font-bold text-gray-900">{row.facility}</span> },
    { key: "lga", label: "LGA", sortable: true },
    moneyColumn("revenue", "Revenue"),
    moneyColumn("expenditure", "Expenditure"),
    moneyColumn("bhcpf_funds", "BHCPF Funds"),
    moneyColumn("balance", "Balance"),
  ];

  return (
    <>
      <div className="space-y-6 print:hidden">
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <Construction size={20} className="text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-800 mb-1">Finance module not yet available</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            This report is wired up and ready, but no finance module exists in the system yet — revenue,
            expenditure, BHCPF funds and balance will always show as ₦0 until it ships. Treat every figure
            below as a placeholder, not a real number.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Revenue" value={formatNaira(0)} tone="green" placeholder="not-tracked" />
        <StatCard icon={Receipt} label="Expenditure" value={formatNaira(0)} tone="red" placeholder="not-tracked" />
        <StatCard icon={Landmark} label="BHCPF Funds" value={formatNaira(0)} tone="blue" placeholder="not-tracked" />
        <StatCard icon={Scale} label="Balance" value={formatNaira(0)} tone="neutral" placeholder="not-tracked" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <TableToolbar
          title="All Facilities"
          count={filtered.length}
          search={search}
          onSearchChange={setSearch}
          lga={lga}
          lgaOptions={lgaOptions}
          onLgaChange={setLga}
          onExport={handleExport}
        />
        {isLoading ? (
          <LoadingBlock />
        ) : filtered.length === 0 ? (
          <EmptyBlock label="No facilities match your filters." />
        ) : (
          <DataTable columns={columns} data={filtered} />
        )}
      </div>

      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
