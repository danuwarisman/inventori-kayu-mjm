'use client';

import React, { useState } from 'react';
import { Pencil, Trash2, UsersRound, Loader2 } from 'lucide-react';
import { CustomerItem } from '@/types/customer';
import Pagination from '@/components/Pagination';

interface CustomerTableProps {
  items: CustomerItem[];
  totalCount: number;
  isLoading?: boolean;
  isManager?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit: (item: CustomerItem) => void;
  onDelete?: (item: CustomerItem) => void;
}

export default function CustomerTable({
  items,
  totalCount,
  isLoading = false,
  isManager = false,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const hasAction = canEdit || canDelete;

  return (
    <section className="p-4 bg-white rounded-[10px] border border-stone-200 shadow-2xs flex flex-col gap-3 font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider">
              <th className="py-3 px-3 text-center">ID CUSTOMER</th>
              <th className="py-3 px-3 text-center">Nama</th>
              <th className="py-3 px-3 text-center min-w-[280px]">Alamat</th>
              <th className="py-3 px-3 text-center">No HP</th>
              <th className="py-3 px-3 text-center">Email</th>
              {hasAction && (
                <th className="py-3 px-3 text-center w-20">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5 + (hasAction ? 1 : 0)} className="py-14 text-center">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                      <Loader2 className="w-8 h-8 stroke-[1.5] animate-spin text-green-700" />
                      <p className="text-sm font-semibold text-stone-600">
                        Memuat data customer...
                      </p>
                      <p className="text-xs text-stone-400">
                        Mengambil data dari server, mohon tunggu sebentar.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                      <UsersRound className="w-8 h-8 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-stone-600">
                        Belum ada data pelanggan terdaftar
                      </p>
                      <p className="text-xs text-stone-400">
                        {isManager
                          ? 'Belum ada data mitra pelanggan yang dimasukkan ke sistem.'
                          : canEdit
                          ? 'Klik tombol "+ New Customer" untuk meregistrasikan mitra pembeli baru.'
                          : 'Belum ada data customer yang dapat ditampilkan.'}
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr
                  key={item.id_customer}
                  className="text-green-700 hover:bg-stone-50 transition-colors"
                >
                  <td className="py-3 px-3 text-center font-mono font-medium">
                    {item.id_customer}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-stone-900">
                    {item.nama}
                  </td>
                  <td className="py-3 px-3 text-center font-normal text-stone-600">
                    {item.alamat}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium">
                    {item.no_hp}
                  </td>
                  <td className="py-3 px-3 text-center font-normal lowercase">
                    {item.email || '-'}
                  </td>
                  {hasAction && (
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Edit Customer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canDelete && onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Hapus Customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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