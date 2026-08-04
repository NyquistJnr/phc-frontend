"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowRightLeft, BedDouble, HeartPulse, UserMinus, Download } from "lucide-react";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { getPeriodLabel } from "@/src/components/stateDashboard/reports/shared/dateLabel";
import { useClinicalOutcomesReport } from "@/src/hooks/doctors/use-reports";

export default function ClinicalOutcomesTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useClinicalOutcomesReport({ startDate, endDate });

  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const periodLabel = getPeriodLabel(startDate, endDate);

  const handleExport = () => {
    if (!data) return;
    setPrintPayload({
      reportTitle: "Doctor Clinical Outcomes",
      periodLabel,
      summaryCards: [
        { label: "Patients Referred", value: data.referred },
        { label: "Patients Recovered", value: data.recovered },
        { label: "Patients Admitted", value: data.admitted },
        { label: "Patients Transferred", value: data.transferred },
        { label: "Patient Deaths", value: data.deaths },
      ],
      columns: [],
      rows: [],
      note: "Note: Recovered, Admitted, Transferred, and Deaths are currently placeholders and not actively tracked."
    });
  };

  if (isLoading) {
    return <LoadingBlock />;
  }

  if (!data) {
    return <EmptyBlock label="No clinical outcomes data found for this period." />;
  }

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={16} />
            Export Outcomes
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard 
          icon={ArrowRightLeft} 
          label="Patients Referred" 
          value={data.referred} 
          tone="blue"
          subLabel="Total referrals initiated"
        />
        
        {/* Placeholders */}
        <StatCard 
          icon={HeartPulse} 
          label="Patients Recovered" 
          value={data.recovered} 
          tone="green" 
          subLabel="Placeholder - Not tracked yet"
        />
        <StatCard 
          icon={BedDouble} 
          label="Patients Admitted" 
          value={data.admitted} 
          tone="amber" 
          subLabel="Placeholder - Not tracked yet"
        />
        <StatCard 
          icon={Activity} 
          label="Patients Transferred" 
          value={data.transferred} 
          tone="neutral" 
          subLabel="Placeholder - Not tracked yet"
        />
        <StatCard 
          icon={UserMinus} 
          label="Patient Deaths" 
          value={data.deaths} 
          tone="red" 
          subLabel="Placeholder - Not tracked yet"
        />
      </div>
    </div>
    <PrintableReport payload={printPayload} />
  </>
  );
}
