'use client';

import React, { useState } from 'react';
import { Pencil, Inbox } from 'lucide-react';
import { PraDryKilnItem } from '@/types/pra-dry-kiln';
import { formatDateID } from '@/lib/dates';
import Pagination from '@/components/Pagination';

interface PlankTableProps {
  items: PraDryKilnItem[];
  totalCount: number;
  isManager?: boolean;
  canEdit?: boolean;
  onEdit: (item: PraDryKilnItem) => void;
}

export default function PlankTable({
  items,
  totalCount,
  isManager = false,
  canEdit = false,
  onEdit,
}: PlankTableProps) {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <section className="p-4 bg-white rounded-[10px] border border-stone-200 shadow-2xs flex flex-col gap-3 font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider">
              <th className="py-3 px-3 text-center">ID PLANK</th>
              <th className="py-3 px-3 text-center">ID LOG</th>
              <th className="py-3 px-3 text-center">Sortimen</th>
              <th className="py-3 px-3 text-center">DIMENSIONS (T X W X L)</th>
              <th className="py-3 px-3 text-center">Total Volume</th>
              <th className="py-3 px-3 text-center">Grade</th>
              <th className="py-3 px-3 text-center">Stage</th>
              <th className="py-3 px-3 text-center">Date</th>
              {canEdit && <th className="py-3 px-3 text-center w-12">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8 + (canEdit ? 1 : 0)} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                    <Inbox className="w-8 h-8 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-stone-600">
                      Belum ada papan di tahap Pra Dry-Kiln
                    </p>
                    <p className="text-xs text-stone-400">
                      {isManager
                        ? 'Staf lapangan belum meregistrasikan papan ke tahapan sticking / pra oven.'
                        : canEdit
                        ? 'Klik tombol "+ New Batch" untuk meregistrasikan penataan papan kayu.'
                        : 'Belum ada data papan pada tahap Pra Dry-Kiln.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr
                  key={item.id_plank}
                  className="text-green-700 hover:bg-stone-50 transition-colors"
                >
                  <td className="py-3 px-3 text-center font-mono font-medium">
                    {item.id_plank}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-stone-600">
                    {item.id_log}
                  </td>
                  <td className="py-3 px-3 text-center font-normal">{item.sortimen}</td>
                  <td className="py-3 px-3 text-center font-medium whitespace-nowrap">
                    {item.tinggi}cm x {item.lebar}cm x {item.panjang}cm
                  </td>
                  <td className="py-3 px-3 text-center font-medium">
                    {item.volume.toFixed(3)} m³
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 border border-green-700 rounded-xs text-[11px] font-semibold">
                      {item.grade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.stage === 'finish pra-drykiln'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-lime-100 text-green-800'
                      }`}
                    >
                      {item.stage}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-normal text-stone-600">
                    {formatDateID(item.date)}
                  </td>
                  {canEdit && (
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="Edit Batch"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={items.length}
        totalCount={totalCount}
        onPageChange={setPage}
      />
    </section>
  );
}