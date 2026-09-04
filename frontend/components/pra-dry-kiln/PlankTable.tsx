'use client';

import React from 'react';
import { Pencil, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { PraDryKilnItem } from '@/types/pra-dry-kiln';

interface PlankTableProps {
  items: PraDryKilnItem[];
  totalCount: number;
  isManager?: boolean;
  onEdit: (item: PraDryKilnItem) => void;
}

export default function PlankTable({
  items,
  totalCount,
  isManager = false,
  onEdit,
}: PlankTableProps) {
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
              {!isManager && <th className="py-3 px-3 text-center w-12">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={isManager ? 8 : 9} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                    <Inbox className="w-8 h-8 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-stone-600">
                      Belum ada papan di tahap Pra Dry-Kiln
                    </p>
                    <p className="text-xs text-stone-400">
                      {isManager
                        ? 'Staf lapangan belum meregistrasikan papan ke tahapan sticking / pra oven.'
                        : 'Klik tombol "+ New Batch" untuk meregistrasikan penataan papan kayu.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
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
                    {item.date}
                  </td>
                  {!isManager && (
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

      {/* Pagination Bar */}
      <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="text-green-700/80 font-medium">
          Showing {items.length} of {totalCount}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded text-green-700 font-extrabold bg-green-100/80"
          >
            1
          </button>
          <button
            type="button"
            className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}