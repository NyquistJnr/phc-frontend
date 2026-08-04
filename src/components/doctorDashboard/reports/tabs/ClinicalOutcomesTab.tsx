"use client";

import { Activity, ArrowRightLeft, BedDouble, HeartPulse, UserMinus } from "lucide-react";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import { useClinicalOutcomesReport } from "@/src/hooks/doctors/use-reports";

export default function ClinicalOutcomesTab({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useClinicalOutcomesReport({ startDate, endDate });

  if (isLoading) {
    return <LoadingBlock />;
  }

  if (!data) {
    return <EmptyBlock label="No clinical outcomes data found for this period." />;
  }

  return (
    <div className="space-y-6 print:hidden">
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
  );
}
