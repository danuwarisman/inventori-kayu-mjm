'use client';

import React from 'react';
import { Truck, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { SupplierItem } from '@/types/supplier';

interface SupplierTableProps {
  items: SupplierItem[];
  totalCount: number;
  isManager?: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (item: SupplierItem) => void;
}

export default function SupplierTable({
  items,
  totalCount,
  isManager = false,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
}: SupplierTableProps) {
  const isAllSelected =
    items.length > 0 && selectedIds.length === items.length;

  return (
    <section className="p-4 bg-white rounded-[10px] border border-stone-200 shadow-2xs flex flex-col gap-3 font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider">
              {!isManager && (
                <th className="py-3 px-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                    className="w-4 h-4 rounded border-stone-300 accent-green-700 cursor-pointer"
                  />
                </th>
              )}
              <th className="py-3 px-3 text-center">ID Supplier</th>
              <th className="py-3 px-3 text-center">Company Name</th>
              <th className="py-3 px-3 text-center">Contact Person</th>
              <th className="py-3 px-3 text-center">Phone Number</th>
              <th className="py-3 px-3 text-center">Harga</th>
              {!isManager && (
                <th className="py-3 px-3 text-center w-12">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={isManager ? 5 : 7}
                  className="py-14 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                    <Truck className="w-8 h-8 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-stone-600">
                      Belum ada data supplier
                    </p>
                    <p className="text-xs text-stone-400">
                      {isManager
                        ? 'Belum ada data pemasok kayu yang dimasukkan ke sistem.'
                        : 'Klik tombol "Add Supplier" untuk meregistrasikan mitra pemasok kayu baru.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id_supplier);

                return (
                  <tr
                    key={item.id_supplier}
                    className={`text-green-700 hover:bg-stone-50 transition-colors ${
                      isSelected ? 'bg-green-50/50' : ''
                    }`}
                  >
                    {!isManager && (
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(item.id_supplier)}
                          className="w-4 h-4 rounded border-stone-300 accent-green-700 cursor-pointer"
                        />
                      </td>
                    )}
                    <td className="py-3 px-3 text-center font-mono font-medium">
                      {item.id_supplier}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-stone-900">
                      {item.nama_supplier}
                    </td>
                    <td className="py-3 px-3 text-center font-medium">
                      {item.kontak_person}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-medium">
                      {item.no_hp}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-stone-900">
                      Rp {item.harga.toLocaleString('id-ID')}
                    </td>
                    {!isManager && (
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors cursor-pointer"
                          title="Edit Supplier"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
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