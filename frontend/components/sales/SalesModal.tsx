'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';
import { SalesItem, SalesFormData, SalesStatus } from '@/types/sales';

interface SalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SalesItem, 'total_harga'>) => void;
  nextIndex: number;
}

export default function SalesModal({
  isOpen,
  onClose,
  onSubmit,
  nextIndex,
}: SalesModalProps) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<SalesFormData>({
    id_transaksi: '',
    nama_customer: '',
    kuantitas: '',
    harga_satuan: 1000000,
    tanggal: new Date().toLocaleDateString('id-ID'),
    status: 'Pending',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id_transaksi: `TRX-${String(nextIndex).padStart(3, '0')}`,
        nama_customer: '',
        kuantitas: '',
        harga_satuan: 1000000,
        tanggal: new Date().toLocaleDateString('id-ID'),
        status: 'Pending', // Sesuai SRS: default order admin berstatus Pending
      });
    }
  }, [isOpen, nextIndex, currentYear]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.id_transaksi ||
      !formData.nama_customer ||
      formData.kuantitas === '' ||
      formData.harga_satuan === ''
    ) {
      return;
    }

    onSubmit({
      id_transaksi: formData.id_transaksi,
      nama_customer: formData.nama_customer,
      kuantitas: Number(formData.kuantitas),
      harga_satuan: Number(formData.harga_satuan),
      tanggal: formData.tanggal,
      status: formData.status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
          <h2 className="text-stone-800 text-xl font-bold font-sans">
            Add New Sale
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-900 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white/80 rounded-[10px] border border-stone-800 flex flex-col gap-3 text-xs"
        >
          {/* Transaction ID */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Transaction ID</label>
            <input
              type="text"
              required
              value={formData.id_transaksi}
              onChange={(e) =>
                setFormData({ ...formData, id_transaksi: e.target.value })
              }
              className="w-full h-10 px-3 bg-white border border-stone-800 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Customer */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Customer</label>
            <input
              type="text"
              required
              placeholder="Contoh: PT Kayu Nusantara"
              value={formData.nama_customer}
              onChange={(e) =>
                setFormData({ ...formData, nama_customer: e.target.value })
              }
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-900 font-medium focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Quantity & Unit Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <label className="font-semibold text-green-700">Quantity (pcs)</label>
              <input
                type="number"
                required
                placeholder="50"
                value={formData.kuantitas}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    kuantitas: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="font-semibold text-green-700">Unit Price (IDR)</label>
              <input
                type="number"
                required
                placeholder="1000000"
                value={formData.harga_satuan}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    harga_satuan:
                      e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full h-9 px-3 bg-white border border-stone-300 rounded font-mono text-stone-900 focus:outline-none focus:border-green-700"
              />
            </div>
          </div>

          {/* Sale Date & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <label className="font-semibold text-green-700">Sale Date</label>
              <input
                type="text"
                required
                value={formData.tanggal}
                onChange={(e) =>
                  setFormData({ ...formData, tanggal: e.target.value })
                }
                className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="font-semibold text-green-700">Status</label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as SalesStatus,
                    })
                  }
                  className="w-full h-9 pl-3 pr-8 bg-white border border-stone-300 rounded text-green-700 font-semibold appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
                >
                  <option value="Pending">Pending (Menunggu ACC)</option>
                  <option value="Approved">Approved (Disetujui)</option>
                  <option value="Rejected">Rejected (Ditolak)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="h-10 px-5 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Sale</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}