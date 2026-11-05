'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Trash2, Loader2, DollarSign } from 'lucide-react';
import { PurchaseOrder, PurchaseCreatePayload } from '@/types/purchase';
import { SupplierItem } from '@/types/supplier';
import FormError from '@/components/FormError';
import { toISODate } from '@/lib/dates';
import { firstError, required } from '@/lib/validation';

interface PurchaseDetailRow {
  asalSortimen: string;
  panjang: string;
  diameter: string;
  jumlahDipesan: string;
  hargaPerLog: string;
}

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PurchaseCreatePayload) => void | Promise<void>;
  suppliers: SupplierItem[];
  initialData?: PurchaseOrder | null;
  mode: 'input' | 'edit';
  isSaving?: boolean;
  errorMessage?: string | null;
}

const DEFAULT_ROW: PurchaseDetailRow = {
  asalSortimen: '',
  panjang: '',
  diameter: '',
  jumlahDipesan: '1',
  hargaPerLog: '0',
};

export default function PurchaseModal({
  isOpen,
  onClose,
  onSubmit,
  suppliers,
  initialData,
  mode,
  isSaving = false,
  errorMessage = null,
}: PurchaseModalProps) {
  const [idSupplier, setIdSupplier] = useState<string>('');
  const [tanggalBeli, setTanggalBeli] = useState<string>(toISODate());
  const [detailRows, setDetailRows] = useState<PurchaseDetailRow[]>([
    { ...DEFAULT_ROW },
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setIdSupplier(String(initialData.idSupplier));
      setTanggalBeli(
        initialData.tanggalBeli ? initialData.tanggalBeli.slice(0, 10) : toISODate()
      );
      if (initialData.detailPembelian && initialData.detailPembelian.length > 0) {
        setDetailRows(
          initialData.detailPembelian.map((d) => ({
            asalSortimen: d.asalSortimen || '',
            panjang: String(d.panjang || ''),
            diameter: String(d.diameter || ''),
            jumlahDipesan: String(d.jumlahDipesan || 1),
            hargaPerLog: String(d.hargaPerLog || 0),
          }))
        );
      } else {
        setDetailRows([{ ...DEFAULT_ROW }]);
      }
    } else {
      setIdSupplier(suppliers.length > 0 ? String(suppliers[0].id_backend) : '');
      setTanggalBeli(toISODate());
      setDetailRows([{ ...DEFAULT_ROW }]);
    }
  }, [initialData, mode, isOpen, suppliers]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormError(null);
    onClose();
  };

  const handleAddRow = () => {
    setDetailRows((prev) => [...prev, { ...DEFAULT_ROW }]);
  };

  const handleRemoveRow = (index: number) => {
    if (detailRows.length <= 1) return;
    setDetailRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (
    index: number,
    field: keyof PurchaseDetailRow,
    value: string
  ) => {
    setDetailRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
    if (formError) setFormError(null);
  };

  // Kalkulasi total batang dan total biaya
  const totalLogs = detailRows.reduce((sum, row) => {
    const qty = parseInt(row.jumlahDipesan, 10);
    return sum + (isNaN(qty) || qty < 0 ? 0 : qty);
  }, 0);

  const totalCost = detailRows.reduce((sum, row) => {
    const qty = parseInt(row.jumlahDipesan, 10);
    const price = parseFloat(row.hargaPerLog);
    const validQty = isNaN(qty) || qty < 0 ? 0 : qty;
    const validPrice = isNaN(price) || price < 0 ? 0 : price;
    return sum + validQty * validPrice;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!idSupplier || Number(idSupplier) <= 0) {
      setFormError('Silakan pilih supplier mitra pengadaan.');
      return;
    }

    const baseValidation = firstError(
      required(tanggalBeli, 'Tanggal Pembelian')
    );
    if (baseValidation) {
      setFormError(baseValidation);
      return;
    }

    if (detailRows.length === 0) {
      setFormError('Harus menyertakan setidaknya 1 rincian log yang dipesan.');
      return;
    }

    // Validasi setiap baris detail
    for (let i = 0; i < detailRows.length; i++) {
      const row = detailRows[i];
      if (!row.asalSortimen.trim()) {
        setFormError(`Baris #${i + 1}: Asal Sortimen kayu wajib diisi.`);
        return;
      }
      const panjang = parseFloat(row.panjang);
      if (isNaN(panjang) || panjang <= 0) {
        setFormError(`Baris #${i + 1}: Panjang harus berupa angka lebih dari 0.`);
        return;
      }
      const diameter = parseFloat(row.diameter);
      if (isNaN(diameter) || diameter <= 0) {
        setFormError(`Baris #${i + 1}: Diameter harus berupa angka lebih dari 0.`);
        return;
      }
      const qty = parseInt(row.jumlahDipesan, 10);
      if (isNaN(qty) || qty < 1) {
        setFormError(`Baris #${i + 1}: Jumlah pesanan minimal 1 batang.`);
        return;
      }
      const harga = parseFloat(row.hargaPerLog);
      if (isNaN(harga) || harga < 0) {
        setFormError(`Baris #${i + 1}: Harga per log tidak boleh negatif.`);
        return;
      }
    }

    setFormError(null);

    const payload: PurchaseCreatePayload = {
      idSupplier: Number(idSupplier),
      tanggalBeli,
      detailPembelian: detailRows.map((row) => ({
        asalSortimen: row.asalSortimen.trim(),
        panjang: Number(parseFloat(row.panjang).toFixed(2)),
        diameter: Number(parseFloat(row.diameter).toFixed(2)),
        dimensiLog: `${row.panjang} x ${row.diameter}`,
        jumlahDipesan: parseInt(row.jumlahDipesan, 10),
        hargaPerLog: Number(parseFloat(row.hargaPerLog).toFixed(2)),
      })),
    };

    void onSubmit(payload);
  };

  const displayedError = formError ?? errorMessage;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) handleClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-xl border border-stone-200 w-full max-w-3xl overflow-hidden font-sans my-8">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="font-bold text-sm text-stone-900">
              {mode === 'input' ? 'New Purchase Order' : 'Edit Purchase Order'}
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {mode === 'input'
                ? 'Catat transaksi pemesanan bahan baku kayu log dari supplier.'
                : `Perbarui informasi pesanan PO-${String(initialData?.idPembelian).padStart(4, '0')}.`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Baris 1: Pilihan Supplier & Tanggal Beli */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-green-700">
                Pilih Supplier <span className="text-red-500">*</span>
              </label>
              <select
                value={idSupplier}
                onChange={(e) => {
                  setIdSupplier(e.target.value);
                  if (formError) setFormError(null);
                }}
                required
                className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
              >
                <option value="">-- Pilih Supplier Mitra --</option>
                {suppliers.map((s) => (
                  <option key={s.id_backend} value={s.id_backend}>
                    {s.nama_supplier} ({s.id_supplier})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-green-700">
                Tanggal Pembelian <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tanggalBeli}
                onChange={(e) => {
                  setTanggalBeli(e.target.value);
                  if (formError) setFormError(null);
                }}
                className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
              />
            </div>
          </div>

          {/* Section Detail Kayu Log */}
          <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-800">
                  Rincian Kayu Log yang Dipesan
                </span>
                <p className="text-[11px] text-stone-400">
                  Tentukan spesifikasi sortimen, dimensi potongan, dan harga beli per batang.
                </p>
              </div>
              {mode === 'input' && (
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Item</span>
                </button>
              )}
            </div>

            {/* List Baris Item Log */}
            <div className="flex flex-col gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {detailRows.map((row, index) => {
                const subtotal =
                  (parseInt(row.jumlahDipesan, 10) || 0) *
                  (parseFloat(row.hargaPerLog) || 0);

                return (
                  <div
                    key={index}
                    className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-col gap-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-700">
                        Item #{index + 1}
                      </span>
                      {mode === 'input' && detailRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Hapus baris ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                      <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-stone-600">
                          Asal Sortimen / Jenis Kayu
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="cth. Jati A1 / Sengon Log"
                          value={row.asalSortimen}
                          disabled={mode === 'edit'}
                          onChange={(e) =>
                            handleUpdateRow(index, 'asalSortimen', e.target.value)
                          }
                          className="h-8 px-2.5 bg-white border border-stone-300 rounded text-stone-900 text-xs focus:outline-none focus:border-green-700 disabled:bg-stone-100"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-stone-600">
                          Panjang (cm)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          placeholder="cth. 250"
                          value={row.panjang}
                          disabled={mode === 'edit'}
                          onChange={(e) =>
                            handleUpdateRow(index, 'panjang', e.target.value)
                          }
                          className="h-8 px-2.5 bg-white border border-stone-300 rounded text-stone-900 text-xs focus:outline-none focus:border-green-700 disabled:bg-stone-100"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-stone-600">
                          Diameter (cm)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          placeholder="cth. 30"
                          value={row.diameter}
                          disabled={mode === 'edit'}
                          onChange={(e) =>
                            handleUpdateRow(index, 'diameter', e.target.value)
                          }
                          className="h-8 px-2.5 bg-white border border-stone-300 rounded text-stone-900 text-xs focus:outline-none focus:border-green-700 disabled:bg-stone-100"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-stone-600">
                          Qty (Batang)
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={row.jumlahDipesan}
                          disabled={mode === 'edit'}
                          onChange={(e) =>
                            handleUpdateRow(index, 'jumlahDipesan', e.target.value)
                          }
                          className="h-8 px-2.5 bg-white border border-stone-300 rounded text-stone-900 text-xs focus:outline-none focus:border-green-700 disabled:bg-stone-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center pt-1 border-t border-stone-200/60 text-xs">
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-medium text-stone-600 whitespace-nowrap">
                          Harga / Log:
                        </label>
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-2 text-stone-400 text-xs">
                            Rp
                          </span>
                          <input
                            type="number"
                            step="1000"
                            min="0"
                            required
                            placeholder="0"
                            value={row.hargaPerLog}
                            disabled={mode === 'edit'}
                            onChange={(e) =>
                              handleUpdateRow(index, 'hargaPerLog', e.target.value)
                            }
                            className="w-full h-8 pl-8 pr-2.5 bg-white border border-stone-300 rounded text-stone-900 text-xs focus:outline-none focus:border-green-700 disabled:bg-stone-100 font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-1.5 text-stone-600">
                        <span className="text-[11px]">Subtotal:</span>
                        <span className="font-semibold text-emerald-700 font-mono">
                          Rp {subtotal.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ringkasan Akumulasi */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-medium">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              <span>Total Estimasi Transaksi:</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-stone-600">
                Total:{' '}
                <strong className="text-stone-900">
                  {totalLogs.toLocaleString('id-ID')} batang log
                </strong>
              </span>
              <span className="text-sm font-bold text-emerald-800 font-mono">
                Rp {totalCost.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <FormError message={displayedError} />

          {/* Submit Actions */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="h-10 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 px-5 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : mode === 'input' ? (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Buat Order Pembelian</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
