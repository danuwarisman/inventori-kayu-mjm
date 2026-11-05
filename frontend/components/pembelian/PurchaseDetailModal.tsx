'use client';

import React, { useState } from 'react';
import {
  X, Building2, User, Calendar, FileText,
  CheckCircle2, Clock, XCircle, Box, Package,
} from 'lucide-react';
import { PurchaseOrder } from '@/types/purchase';
import { formatDateID } from '@/lib/dates';

interface PurchaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PurchaseOrder | null;
  onVerify?: (order: PurchaseOrder) => void;
  onApprove?: (order: PurchaseOrder) => void;
  onReject?: (order: PurchaseOrder) => void;
  onReceive?: (order: PurchaseOrder) => void;
}

export default function PurchaseDetailModal({
  isOpen,
  onClose,
  order,
  onVerify,
  onApprove,
  onReject,
  onReceive,
}: PurchaseDetailModalProps) {
  const [confirmReject, setConfirmReject] = useState(false);

  if (!isOpen || !order) return null;

  const poNumber = `PO-${String(order.idPembelian).padStart(4, '0')}`;
  const details = order.detailPembelian ?? [];

  const totalLogs = details.reduce(
    (sum, d) => sum + (d.jumlahDipesan || 0),
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-xl border border-stone-200 w-full max-w-3xl overflow-hidden my-8">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-stone-900">{poNumber}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  {order.statusPembelian || 'MENUNGGU'}
                </span>
                {order.statusVerifikasi && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                    Verif: {order.statusVerifikasi}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Rincian transaksi pengadaan bahan baku kayu log
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-5 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-semibold text-stone-400 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Supplier Mitra
              </span>
              <span className="font-bold text-stone-900 text-xs truncate">
                {order.supplier?.namaSupplier || `Supplier #${order.idSupplier}`}
              </span>
              <span className="text-[11px] text-stone-500">
                ID Supplier: SUP-{String(order.idSupplier).padStart(3, '0')}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-semibold text-stone-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Tanggal Transaksi
              </span>
              <span className="font-bold text-stone-900 text-xs">
                {formatDateID(order.tanggalBeli)}
              </span>
              <span className="text-[11px] text-stone-500">
                {order.tanggalBeli ? order.tanggalBeli.slice(0, 10) : '-'}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-semibold text-stone-400 flex items-center gap-1">
                <User className="w-3 h-3" /> Staf Penginput
              </span>
              <span className="font-bold text-stone-900 text-xs truncate">
                {order.user?.nama || `User #${order.idUser}`}
              </span>
              <span className="text-[11px] text-stone-500">
                ID User: {order.idUser}
              </span>
            </div>
          </div>

          {/* Tabel Detail Kayu Log */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-stone-800">
              Daftar Spesifikasi Kayu Log
            </span>
            <div className="overflow-x-auto border border-stone-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-10">No</th>
                    <th className="py-2.5 px-3">Asal Sortimen</th>
                    <th className="py-2.5 px-3 text-center">Panjang (cm)</th>
                    <th className="py-2.5 px-3 text-center">Diameter (cm)</th>
                    <th className="py-2.5 px-3 text-center">Qty (Batang)</th>
                    <th className="py-2.5 px-3 text-right">Harga / Log</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {details.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-stone-400">
                        Tidak ada rincian item log untuk pesanan ini.
                      </td>
                    </tr>
                  ) : (
                    details.map((item, idx) => {
                      const subtotal = item.jumlahDipesan * item.hargaPerLog;
                      return (
                        <tr key={item.idDetailPembelian || idx} className="hover:bg-stone-50">
                          <td className="py-2.5 px-3 text-center font-mono text-stone-400">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-stone-900">
                            {item.asalSortimen}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-stone-700">
                            {item.panjang}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-stone-700">
                            {item.diameter}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-stone-900">
                            {item.jumlahDipesan.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-stone-700">
                            Rp {item.hargaPerLog.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-700">
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

          {/* Ringkasan Akumulasi Total */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-stone-600">
              Total Log Dipesan:{' '}
              <strong className="text-stone-900 font-bold">
                {totalLogs.toLocaleString('id-ID')} batang ({details.length} sortimen)
              </strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Total Nilai Pesanan:</span>
              <span className="text-base font-bold text-emerald-800 font-mono">
                Rp {(order.totalHarga || 0).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Riwayat Approval (jika ada) */}
          {order.approvals && order.approvals.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
              <span className="font-bold text-stone-800">Riwayat Verifikasi & Approval</span>
              <div className="flex flex-col gap-1.5">
                {order.approvals.map((app) => (
                  <div
                    key={app.idApproval}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      {app.status === 'DISETUJUI' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : app.status === 'DITOLAK' ? (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600" />
                      )}
                      <div>
                        <span className="font-bold text-stone-800">
                          {app.manager?.nama || `Manager #${app.idUserManager}`}
                        </span>{' '}
                        — <span className="font-semibold">{app.status}</span>
                        {app.keteranganCatatan && (
                          <p className="text-stone-500 mt-0.5 italic">
                            &quot;{app.keteranganCatatan}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-stone-400 font-mono">
                      {formatDateID(app.tanggalApprove)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded transition-colors cursor-pointer"
            >
              Tutup
            </button>
            {order.statusVerifikasi === 'PENDING' && (
              <>
                {onVerify && (
                  <button
                    type="button"
                    onClick={() => onVerify(order)}
                    className="inline-flex items-center gap-1.5 h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verifikasi
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
            {order.statusVerifikasi === 'DISETUJUI' && onApprove && (
              <button
                type="button"
                onClick={() => onApprove(order)}
                className="inline-flex items-center gap-1.5 h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                <Box className="w-3.5 h-3.5" />
                Approve
              </button>
            )}
            {order.statusPembelian === 'DITERIMA' ? (
              <div className="h-9 px-4 bg-stone-100 text-stone-500 text-xs font-semibold rounded transition-colors cursor-pointer select-none">
                Sudah Diterima
              </div>
            ) : order.statusPembelian === 'DIBATALKAN' ? (
              <div className="h-9 px-4 bg-stone-100 text-stone-500 text-xs font-semibold rounded transition-colors cursor-pointer select-none">
                Dibatalkan
              </div>
            ) : onReceive && (
              <button
                type="button"
                onClick={() => onReceive(order)}
                className="inline-flex items-center gap-1.5 h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                <Package className="w-3.5 h-3.5" />
                Terima
              </button>
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
                  Apakah Anda yakin ingin menolak pembelian {order.idPembelian}?
                  Stakeholder akan melihat alasan ini.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setConfirmReject(false)}
                    className="h-8 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded text-xs transition-colors cursor-pointer"
                  >
                    Batalkan
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
