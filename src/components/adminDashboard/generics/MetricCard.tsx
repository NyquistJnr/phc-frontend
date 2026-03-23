import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface MetricCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  colorClass: string;
  subValue?: string;
}

export default function MetricCard({ icon: Icon, title, value, colorClass, subValue }: MetricCardProps) {
  const isLight = colorClass.includes('bg-white');
  return (
    <div className={`${colorClass} p-6 rounded-[32px] shadow-sm flex flex-col justify-between min-h-[160px]`}>
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/20 text-white'}`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-medium ${isLight ? 'text-gray-400' : 'text-white/80'}`}>
          This Week <ChevronDown size={12} />
        </div>
      </div>
      <div className="space-y-1">
        <p className={`text-sm font-medium ${isLight ? 'text-gray-500' : 'text-white/90'}`}>{title}</p>
        <div className="flex items-baseline gap-1">
          <p className={`text-4xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{value}</p>
          {subValue && <span className={`text-lg font-medium ${isLight ? 'text-gray-500' : 'text-white/70'}`}>{subValue}</span>}
        </div>
      </div>
    </div>
  );
}
