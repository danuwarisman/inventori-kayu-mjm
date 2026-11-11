'use client';

import React, { useState } from 'react';
import {
  X, Building2, User, Calendar, FileText,
  CheckCircle2, XCircle, Check, Printer,
} from 'lucide-react';
import { PurchaseOrder } from '@/types/purchase';
import { formatDateID } from '@/lib/dates';

interface PurchaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PurchaseOrder | null;
  onPrint?: (order: PurchaseOrder) => void;
  onApprove?: (order: PurchaseOrder) => void;
  onReject?: (order: PurchaseOrder) => void;
}

export default function PurchaseDetailModal({
  isOpen,
  onClose,
  order,
  onPrint,
  onApprove,
  onReject,
}: PurchaseDetailModalProps) {
  const [confirmReject, setConfirmReject] = useState(false);

  if (!isOpen || !order) return null;

  const poNumber = `PO-${String(order.idPembelian).padStart(4, '0')}`;
  const details = order.detailPembelian ?? [];

  const totalLogs = details.reduce(
    (sum, d) => sum + (d.jumlahDipesan || 0),
    0
  );

  const isPending =
    order.statusVerifikasi === 'PENDING' ||
    order.statusPembelian === 'MENUNGGU';

  const isApproved =
    order.statusPembelian === 'DISETUJUI' ||
    order.statusPembelian === 'DITERIMA';

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

            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/50 flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Status Transaksi
              </span>
              <div>
                {isApproved ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    Disetujui (Stok Log)
                  </span>
                ) : order.statusPembelian === 'DITOLAK' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                    Ditolak
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                    Menunggu Approval
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rincian Kayu Log yang Dipesan */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider">
                Rincian Kayu Log ({details.length} jenis, total {totalLogs} batang)
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
                    <th className="py-2.5 px-3 text-center">Ukuran (P x D)</th>
                    <th className="py-2.5 px-3 text-center">Jumlah Batang</th>
                    <th className="py-2.5 px-3 text-right">Harga per Log</th>
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
                      const subtotal = (detail.jumlahDipesan || 0) * (detail.hargaPerLog || 0);
                      return (
                        <tr key={detail.idDetailPembelian || idx} className="hover:bg-stone-50/50">
                          <td className="py-2.5 px-3 text-stone-400 font-mono">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-stone-800">
                            {detail.asalSortimen}
                          </td>
                          <td className="py-2.5 px-3 text-center text-stone-600 font-mono">
                            {detail.panjang} x {detail.diameter} cm
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-stone-900">
                            {detail.jumlahDipesan}
                          </td>
                          <td className="py-2.5 px-3 text-right text-stone-600">
                            Rp {(detail.hargaPerLog || 0).toLocaleString('id-ID')}
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

          {/* Riwayat Approval */}
          {(order.approvals ?? []).length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider">
                Catatan & Keputusan Manager
              </h4>
              <div className="flex flex-col gap-2">
                {(order.approvals ?? []).map((app) => (
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
            {isPending && (
              <>
                {onApprove && (
                  <button
                    type="button"
                    onClick={() => onApprove(order)}
                    className="inline-flex items-center gap-1.5 h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors cursor-pointer shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    Approve (ACC) ke Stok Log
                  </button>
                )}
                {onReject && (
                  <button
                    type="button"
                    onClick={() => setConfirmReject(true)}
                    className="inline-flex items-center gap-1.5 h-9 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Tolak
                  </button>
                )}
              </>
            )}
            {isApproved && (
              <div className="inline-flex items-center gap-1.5 h-9 px-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded select-none">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Disetujui (Sudah Masuk Stok Log)
              </div>
            )}
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

          {confirmReject && onReject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-lg shadow-xl border border-stone-200 w-full max-w-sm p-5">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <p className="text-stone-800 text-sm font-medium">
                    Konfirmasi penolakan
                  </p>
                </div>
                <p className="text-stone-600 text-xs mt-2">
                  Apakah Anda yakin ingin menolak pembelian {poNumber}?
                  Catatan penolakan dapat disertakan.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setConfirmReject(false)}
                    className="h-8 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded text-xs transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmReject(false);
                      onReject(order);
                    }}
                    className="h-8 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
                  >
                    Ya, Tolak
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
