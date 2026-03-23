"use client";

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [];
  if (current <= 3) {
    pages.push(1, 2, 3, '...', total - 1, total);
  } else if (current >= total - 2) {
    pages.push(1, 2, '...', total - 2, total - 1, total);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }
  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="p-4 sm:p-6 flex items-center justify-center gap-2 sm:gap-4 border-t border-gray-50">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 text-sm font-medium px-2 sm:px-4 transition-colors ${
          currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-400 font-bold">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-sm font-bold transition-colors ${
                currentPage === page
                  ? 'bg-[#2D2D2D] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 text-sm font-bold px-2 sm:px-4 transition-opacity ${
          currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-800 hover:opacity-70'
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
