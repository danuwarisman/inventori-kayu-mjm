'use client';

import React, { useState } from 'react';
import {
  Eye, Pencil, Trash2, Loader2, ShoppingBag,
  Printer,
} from 'lucide-react';
import { PurchaseOrder } from '@/types/purchase';
import Pagination from '@/components/Pagination';
import { formatDateID } from '@/lib/dates';

interface PurchaseTableProps {
  items: PurchaseOrder[];
  totalCount: number;
  isLoading?: boolean;
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onView: (item: PurchaseOrder) => void;
  onPrint?: (item: PurchaseOrder) => void;
  onEdit?: (item: PurchaseOrder) => void;
  onDelete?: (item: PurchaseOrder) => void;
}


export default function PurchaseTable({
  items,
  totalCount,
  isLoading = false,
  canEdit = false,
  canDelete = false,
  onView,
  onPrint,
  onEdit,
  onDelete,
}: PurchaseTableProps) {
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
              <th className="py-3 px-3 text-center">No. PO</th>
              <th className="py-3 px-3 text-center">Tanggal Beli</th>
              <th className="py-3 px-3 text-center">Supplier</th>
              <th className="py-3 px-3 text-center">Diajukan Oleh</th>
              <th className="py-3 px-3 text-center">Total Volume</th>
              <th className="py-3 px-3 text-center">Total Biaya</th>
              <th className="py-3 px-3 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-stone-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-green-700" />
                    <span>Memuat riwayat transaksi pembelian...</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                    <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-stone-600">
                      Belum ada transaksi pembelian
                    </p>
                    <p className="text-xs text-stone-400">
                      Gunakan tombol &quot;+ New Purchase Order&quot; untuk mengajukan pesanan log baru ke Manager.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const poNumber = `PO-${String(item.idPembelian).padStart(4, '0')}`;
                const supplierName =
                  item.supplier?.namaSupplier || 'Supplier Tidak Dikenal';
                const creatorName = item.user?.nama || 'Admin';
                const totalVolume = (item.detailPembelian ?? []).reduce(
                  (sum, d) => sum + (d.volume || 0),
                  0
                );
                const isPending =
                  item.statusVerifikasi === 'PENDING' ||
                  item.statusPembelian === 'MENUNGGU';

                return (
                  <tr
                    key={item.idPembelian}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-mono font-bold text-green-700">
                      {poNumber}
                    </td>
                    <td className="py-3 px-3 text-center text-stone-600">
                      {formatDateID(item.tanggalBeli)}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-stone-900">
                      {supplierName}
                    </td>
                    <td className="py-3 px-3 text-center text-stone-600">
                      {creatorName}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-semibold text-stone-800">
                        {totalVolume.toFixed(3)} m³
                      </span>{' '}
                      <span className="text-[11px] text-stone-500">
                        ({item.detailPembelian?.length || 0} jenis)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-emerald-700">
                      Rp {(item.totalHarga || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onView(item)}
                          className="p-1 text-stone-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                          title="Lihat Detail Pembelian"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {onPrint && (
                          <button
                            type="button"
                            onClick={() => onPrint(item)}
                            className="p-1 text-stone-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Cetak Purchase Order (PO)"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isPending && canEdit && onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Edit Draft Pembelian"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {isPending && canDelete && onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Hapus / Batalkan Pembelian"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                );
              })
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
