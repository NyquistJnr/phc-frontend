import React, { Suspense, useState } from "react";
import { Search, ArrowRight, ListFilter } from "lucide-react";
import Link from "next/link";
import { TablePagination } from "./TablePagination";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T | string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: ColumnDef<T>[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  toolbarActions?: React.ReactNode;
  onViewAll?: () => void;
  viewAllLink?: string;
  totalPages?: number;
  emptyMessage?: string;
}

export function DataTable<T>({
  title,
  data,
  columns,
  showSearch = false,
  searchPlaceholder = "Search...",
  onSearch,
  toolbarActions,
  onViewAll,
  viewAllLink,
  totalPages,
  emptyMessage = "No data found.",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const getAccessorValue = (row: T, accessorKey: keyof T | string) => {
    if (row && typeof row === "object") {
      const value = (row as Record<string, unknown>)[String(accessorKey)];
      return value == null ? "" : String(value);
    }

    return "";
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) onSearch(val);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden flex flex-col">
      <div className="p-4 md:p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
            {title && (
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            )}

            {(onViewAll || viewAllLink) && (
              <div className="md:hidden">
                {viewAllLink ? (
                  <Link
                    href={viewAllLink}
                    className="flex items-center gap-1 text-sm font-medium text-[#0a6c38] hover:underline"
                  >
                    View all <ArrowRight size={16} />
                  </Link>
                ) : (
                  <button
                    onClick={onViewAll}
                    className="flex items-center gap-1 text-sm font-medium text-[#0a6c38] hover:underline"
                  >
                    View all <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto md:flex-1">
            {showSearch && (
              <div className="relative w-full sm:w-auto">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a6c38]/20 focus:border-[#0a6c38] w-full sm:w-64 transition-all"
                />
              </div>
            )}

            {toolbarActions && (
              <div className="flex items-center gap-2">{toolbarActions}</div>
            )}

            {(onViewAll || viewAllLink) && (
              <div className="hidden md:block ml-2 border-l border-gray-200 pl-4">
                {viewAllLink ? (
                  <Link
                    href={viewAllLink}
                    className="flex items-center gap-1 text-sm font-medium text-[#0a6c38] hover:underline whitespace-nowrap"
                  >
                    View all <ArrowRight size={16} />
                  </Link>
                ) : (
                  <button
                    onClick={onViewAll}
                    className="flex items-center gap-1 text-sm font-medium text-[#0a6c38] hover:underline whitespace-nowrap"
                  >
                    View all <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hidden md:block overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-gray-500 bg-gray-50/50 border-b border-gray-100">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && (
                      <ListFilter
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-600"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-14 text-center text-sm text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {col.render
                        ? col.render(row)
                        : col.accessorKey
                          ? getAccessorValue(row, col.accessorKey)
                          : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col p-4 gap-4 bg-gray-50/30 flex-1">
        {data.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-sm text-gray-400">
            {emptyMessage}
          </div>
        ) : (
          data.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex flex-col gap-3"
            >
              {columns.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0 last:pb-0"
                >
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider pr-4">
                    {col.header}
                  </span>
                  <div className="text-sm font-medium text-gray-800 text-right">
                    {col.render
                      ? col.render(row)
                      : col.accessorKey
                        ? getAccessorValue(row, col.accessorKey)
                        : null}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      {totalPages && totalPages > 1 && (
        <div className="p-4 md:py-6 md:px-8 border-t border-gray-100 bg-white flex justify-center w-full">
          <Suspense fallback={null}>
            <TablePagination totalPages={totalPages} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
