'use client';

import React, { useState } from 'react';
import {
  Eye, Pencil, Trash2, Loader2, ShoppingBag,
  CheckCircle2, Clock, XCircle, Box,
  Package,
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
  canVerify?: boolean;
  canApprove?: boolean;
  canReject?: boolean;
  canReceive?: boolean;
  onView: (item: PurchaseOrder) => void;
  onEdit?: (item: PurchaseOrder) => void;
  onDelete?: (item: PurchaseOrder) => void;
  onVerify?: (item: PurchaseOrder) => void;
  onApprove?: (item: PurchaseOrder) => void;
  onReject?: (item: PurchaseOrder) => void;
  onReceive?: (item: PurchaseOrder) => void;
}

function renderStatusBadge(status: string) {
  switch (status) {
    case 'DISETUJUI':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
          Disetujui
        </span>
      );
    case 'DITERIMA':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-100 text-teal-800">
          Diterima
        </span>
      );
    case 'DITOLAK':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">
          Ditolak
        </span>
      );
    case 'DIBATALKAN':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700">
          Dibatalkan
        </span>
      );
    case 'MENUNGGU':
    case 'PENDING':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
          Menunggu
        </span>
      );
  }
}

export default function PurchaseTable({
  items,
  totalCount,
  isLoading = false,
  canEdit = false,
  canDelete = false,
  canVerify = false,
  canApprove = false,
  canReject = false,
  canReceive = false,
  onView,
  onEdit,
  onDelete,
  onVerify,
  onApprove,
  onReject,
  onReceive,
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
              <th className="py-3 px-3 text-center">Tanggal</th>
              <th className="py-3 px-3 text-center min-w-[160px]">Supplier</th>
              <th className="py-3 px-3 text-center">Dibuat Oleh</th>
              <th className="py-3 px-3 text-center">Item Kayu</th>
              <th className="py-3 px-3 text-center">Total Biaya</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 text-center">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                      <Loader2 className="w-8 h-8 stroke-[1.5] animate-spin text-green-700" />
                      <p className="text-sm font-semibold text-stone-600">
                        Memuat data pembelian...
                      </p>
                      <p className="text-xs text-stone-400">
                        Mengambil riwayat pesanan dari server, mohon tunggu sebentar.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                      <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-stone-600">
                        Belum ada data transaksi pembelian
                      </p>
                      <p className="text-xs text-stone-400">
                        Klik tombol &quot;+ New Purchase Order&quot; untuk membuat pesanan bahan baku ke supplier.
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const poNumber = `PO-${String(item.idPembelian).padStart(4, '0')}`;
                const totalLogs = (item.detailPembelian ?? []).reduce(
                  (sum, d) => sum + (d.jumlahDipesan || 0),
                  0
                );
                const supplierName = item.supplier?.namaSupplier || `Supplier #${item.idSupplier}`;
                const creatorName = item.user?.nama || `User #${item.idUser}`;

                return (
                  <tr
                    key={item.idPembelian}
                    className="text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-mono font-semibold text-green-700">
                      {poNumber}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap text-stone-600">
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
                        {totalLogs.toLocaleString('id-ID')}
                      </span>{' '}
                      <span className="text-[11px] text-stone-500">
                        ({item.detailPembelian?.length || 0} jenis)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-emerald-700">
                      Rp {(item.totalHarga || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {renderStatusBadge(item.statusPembelian || item.statusVerifikasi)}
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
                        {canEdit && onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Edit Draft Pembelian"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canVerify && onVerify && (
                          <button
                            type="button"
                            onClick={() => onVerify(item)}
                            className="p-1 text-blue-700 hover:bg-blue-50 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Verifikasi oleh Admin Kantor"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canApprove && onApprove && (
                          <button
                            type="button"
                            onClick={() => onApprove(item)}
                            className="p-1 text-emerald-700 hover:bg-emerald-50 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Approval oleh Manager"
                          >
                            <Box className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canReject && onReject && (
                          <button
                            type="button"
                            onClick={() => onReject(item)}
                            className="p-1 text-amber-700 hover:bg-amber-50 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Tolak Pembelian"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canReceive && onReceive && (
                          <button
                            type="button"
                            onClick={() => onReceive(item)}
                            className="p-1 text-teal-700 hover:bg-teal-50 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Terima Barang"
                          >
                            <Package className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canDelete && onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
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
