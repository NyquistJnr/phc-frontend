"use client";

import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T | string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const TablePagination = ({ totalPages }: { totalPages: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pages = generatePagination(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {currentPage <= 1 ? (
        <span className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-gray-300 cursor-not-allowed mr-2 sm:mr-4">
          <ArrowLeft size={16} /> Previous
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage - 1)}
          className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mr-2 sm:mr-4"
        >
          <ArrowLeft size={16} /> Previous
        </Link>
      )}
      <div className="flex items-center gap-1 sm:gap-2">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-gray-400 font-medium tracking-widest"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Link
              key={page}
              href={createPageURL(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#2d2e33] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>
      {currentPage >= totalPages ? (
        <span className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-gray-300 cursor-not-allowed ml-2 sm:ml-4">
          Next <ArrowRight size={16} />
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage + 1)}
          className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors ml-2 sm:ml-4"
        >
          Next <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
};
