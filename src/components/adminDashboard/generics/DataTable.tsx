"use client";

import React, { useState } from 'react';
import { ListFilter, ArrowUp, ArrowDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onSort,
  emptyMessage = 'No data found.',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    const newDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(newDir);
    onSort?.(key, newDir);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[640px]">
        <thead>
          <tr className="text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-4 ${col.sortable ? 'cursor-pointer select-none' : ''} ${col.className || ''}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    sortKey === col.key ? (
                      sortDir === 'asc' ? <ArrowUp size={14} className="text-gray-600" /> : <ArrowDown size={14} className="text-gray-600" />
                    ) : (
                      <ListFilter size={14} className="opacity-50" />
                    )
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-6 py-4 text-sm text-gray-600 font-medium ${col.className || ''}`}>
                    {col.render ? col.render(row, idx) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
