import React from 'react';

export interface StatusRowProps {
  icon: React.ElementType;
  label: string;
  status: string;
  badgeColor: string;
  subText: string;
}

export default function StatusRow({ icon: Icon, label, status, badgeColor, subText }: StatusRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#F0F2F5] flex items-center justify-center text-[#53545C]">
          <Icon size={20} />
        </div>
        <span className="text-sm font-medium text-[#101928]">{label}</span>
      </div>
      <div className="text-right">
        <div className={`${badgeColor} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block mb-1`}>
          {status}
        </div>
        <p className="text-[10px] text-gray-400 font-medium">{subText}</p>
      </div>
    </div>
  );
}
