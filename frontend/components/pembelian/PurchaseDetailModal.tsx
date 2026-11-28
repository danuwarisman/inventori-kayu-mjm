'use client';

import React from 'react';
import {
  X, Building2, User, FileText,
  Printer,
} from 'lucide-react';
import { PurchaseOrder } from '@/types/purchase';
import { formatDateID } from '@/lib/dates';

interface PurchaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PurchaseOrder | null;
  onPrint?: (order: PurchaseOrder) => void;
}

export default function PurchaseDetailModal({
  isOpen,
  onClose,
  order,
  onPrint,
}: PurchaseDetailModalProps) {

  if (!isOpen || !order) return null;

  const poNumber = `PO-${String(order.idPembelian).padStart(4, '0')}`;
  const details = order.detailPembelian ?? [];

  const totalVolume = details.reduce((sum, d) => sum + (d.volume || 0), 0);




  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">
                  Detail Transaksi Pembelian
                </h3>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-800">
                  {poNumber}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Diajukan pada {formatDateID(order.tanggalBeli)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs">
          {/* Info Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/50 flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-stone-400" />
                Supplier
              </span>
              <span className="font-bold text-stone-800 text-sm">
                {order.supplier?.namaSupplier || '-'}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/50 flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                Diajukan Oleh
              </span>
              <span className="font-bold text-stone-800 text-sm">
                {order.user?.nama || 'Admin Lapangan'}
              </span>
            </div>


          </div>

          {/* Rincian Kayu Log yang Dipesan */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider">
                Rincian Kayu Log ({details.length} jenis, total {totalVolume.toFixed(3)} m³)
              </h4>
              <span className="text-[11px] font-semibold text-stone-500">
                Total Biaya: <strong className="text-emerald-700">Rp {(order.totalHarga || 0).toLocaleString('id-ID')}</strong>
              </span>
            </div>

            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Sortimen</th>
                    <th className="py-2.5 px-3 text-center">Volume (m³)</th>
                    <th className="py-2.5 px-3 text-right">Harga per m³</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {details.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-stone-400">
                        Tidak ada rincian item dalam pesanan ini.
                      </td>
                    </tr>
                  ) : (
                    details.map((detail, idx) => {
                      const subtotal = (detail.volume || 0) * (detail.hargaPerKubik || 0);
                      return (
                        <tr key={detail.idDetailPembelian || idx} className="hover:bg-stone-50/50">
                          <td className="py-2.5 px-3 text-stone-400 font-mono">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-stone-800">
                            {detail.asalSortimen}
                          </td>
                          <td className="py-2.5 px-3 text-center text-stone-600 font-mono">
                            {(detail.volume || 0).toFixed(3)} m³
                          </td>
                          <td className="py-2.5 px-3 text-right text-stone-600">
                            Rp {(detail.hargaPerKubik || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                            Rp {subtotal.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Riwayat approval dihapus dari tampilan pembelian. */}
          {false && (
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider">
                Catatan & Keputusan Manager
              </h4>
              <div className="flex flex-col gap-2">
                {(order?.approvals ?? []).map((app) => (
                  <div
                    key={app.idApproval}
                    className="p-3 rounded-lg border border-stone-200 bg-stone-50/50 flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800">
                        Manager (ID: {app.idUserManager})
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          app.status === 'DISETUJUI'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {app.status === 'DISETUJUI' ? 'Disetujui' : 'Ditolak'}
                      </span>
                    </div>
                    {app.keteranganCatatan && (
                      <p className="text-stone-600 italic">
                        &quot;{app.keteranganCatatan}&quot;
                      </p>
                    )}
                    <span className="text-[10px] text-stone-400">
                      {formatDateID(app.tanggalApprove)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-stone-100">
            {onPrint && (
              <button
                type="button"
                onClick={() => onPrint(order)}
                className="inline-flex items-center gap-1.5 h-9 px-4 bg-green-50 hover:bg-green-100 border border-green-300 text-green-800 font-semibold rounded transition-colors cursor-pointer mr-auto"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak PO</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded transition-colors cursor-pointer"
            >
              Tutup
            </button>



            {order.statusPembelian === 'DITOLAK' && (
              <div className="h-9 px-4 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded select-none flex items-center">
                Ditolak
              </div>
            )}
            {order.statusPembelian === 'DIBATALKAN' && (
              <div className="h-9 px-4 bg-stone-100 text-stone-500 text-xs font-semibold rounded select-none flex items-center">
                Dibatalkan
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}
