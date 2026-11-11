'use client';

import React, { useState } from 'react';
import { ShoppingBag, CheckCircle2, XCircle, Printer, Truck } from 'lucide-react';
import { SalesItem } from '@/types/sales';
import { formatDateID } from '@/lib/dates';
import Pagination from '@/components/Pagination';

interface SalesTableProps {
  items: SalesItem[];
  totalCount: number;
  canCreate?: boolean;
  canApprove?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onPrintInvoice?: (item: SalesItem) => void;
  onPrintSuratJalan?: (item: SalesItem) => void;
}

export default function SalesTable({
  items,
  totalCount,
  canCreate = false,
  canApprove = false,
  onApprove,
  onReject,
  onPrintInvoice,
  onPrintSuratJalan,
}: SalesTableProps) {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadge = (status: SalesItem['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Rejected':
        return 'bg-rose-100 text-red-800 border-rose-300';
    }
  };

  return (
    <section className="p-4 bg-white rounded-[10px] border border-stone-200 shadow-2xs flex flex-col gap-3 font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider">
              <th className="py-3 px-3 text-center">ID Transaksi</th>
              <th className="py-3 px-3 text-center">Date</th>
              <th className="py-3 px-3 text-center">Customer</th>
              <th className="py-3 px-3 text-center">Quantity</th>
              <th className="py-3 px-3 text-center">Total Amount</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-center">Dokumen</th>
              {canApprove && (
                <th className="py-3 px-3 text-center w-28">Approval Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7 + (canApprove ? 1 : 0)} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                    <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-stone-600">
                      Belum ada transaksi penjualan
                    </p>
                    <p className="text-xs text-stone-400">
                      {canApprove
                        ? 'Tidak ada pesanan penjualan yang perlu diverifikasi atau ditinjau.'
                        : canCreate
                        ? 'Klik tombol "Add Sales" untuk mencatat transaksi pemesanan baru.'
                        : 'Belum ada transaksi penjualan yang dapat ditampilkan.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr
                  key={item.id_transaksi}
                  className="text-green-700 hover:bg-stone-50 transition-colors"
                >
                  <td className="py-3 px-3 text-center font-mono font-medium">
                    {item.id_transaksi}
                  </td>
                  <td className="py-3 px-3 text-center font-normal text-stone-600">
                    {formatDateID(item.tanggal)}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-stone-900">
                    {item.nama_customer}
                  </td>
                  <td className="py-3 px-3 text-center font-medium">
                    {item.kuantitas.toLocaleString('id-ID')} pcs
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-stone-900">
                    Rp {item.total_harga.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Cetak Invoice & Surat Jalan */}
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      {onPrintInvoice && (
                        <button
                          type="button"
                          onClick={() => onPrintInvoice(item)}
                          className="px-2 py-1 text-[11px] font-semibold text-green-800 bg-green-50 hover:bg-green-100 border border-green-300 rounded inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Cetak Invoice Penjualan"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Invoice</span>
                        </button>
                      )}
                      {onPrintSuratJalan && (
                        <button
                          type="button"
                          onClick={() => onPrintSuratJalan(item)}
                          className="px-2 py-1 text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Cetak Surat Jalan Pengiriman"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Surat Jalan</span>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Fitur Approval Aksi Eksklusif Manager */}
                  {canApprove && (
                    <td className="py-3 px-3 text-center">
                      {item.status === 'Pending' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onApprove && onApprove(item.id_transaksi)}
                            className="p-1 text-emerald-700 hover:bg-emerald-100 rounded transition-colors"
                            title="Setujui Pesanan"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onReject && onReject(item.id_transaksi)}
                            className="p-1 text-red-700 hover:bg-red-100 rounded transition-colors"
                            title="Tolak Pesanan"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-400 font-medium">
                          Selesai
                        </span>
                      )}
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