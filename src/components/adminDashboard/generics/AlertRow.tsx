import React from 'react';

export interface AlertRowProps {
  title: string;
  desc: string;
  time: string;
  borderColor: string;
  bgColor: string;
  titleColor: string;
}

export default function AlertRow({ title, desc, time, borderColor, bgColor, titleColor }: AlertRowProps) {
  return (
    <div className={`flex justify-between items-center p-5 rounded-2xl border-l-4 ${borderColor} ${bgColor}`}>
      <div>
        <h4 className={`text-sm font-bold ${titleColor} mb-1`}>{title}</h4>
        <p className="text-xs text-gray-500 font-medium">{desc}</p>
      </div>
      <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">{time}</span>
    </div>
  );
}
