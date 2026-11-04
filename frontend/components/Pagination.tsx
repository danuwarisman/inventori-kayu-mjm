'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  totalCount?: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(page: number, totalPages: number): number[] {
  const visiblePages = Math.min(5, totalPages);
  const start = Math.max(
    1,
    Math.min(page - Math.floor(visiblePages / 2), totalPages - visiblePages + 1)
  );

  return Array.from({ length: visiblePages }, (_, index) => start + index);
}

export default function Pagination({
  page,
  pageSize,
  totalItems,
  totalCount,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const hasFilteredResult =
    typeof totalCount === 'number' && totalCount > totalItems;

  return (
    <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
      <span className="text-green-700/80 font-medium">
        Showing {startItem}-{endItem} of {totalItems}
        {hasFilteredResult ? ` (filtered from ${totalCount})` : ''}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Halaman sebelumnya"
          className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers(currentPage, totalPages).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === currentPage ? 'page' : undefined}
            className={`w-7 h-7 rounded font-extrabold transition-colors cursor-pointer ${
              pageNumber === currentPage
                ? 'text-green-700 bg-green-100/80'
                : 'text-green-700/70 hover:bg-green-50'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Halaman berikutnya"
          className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
