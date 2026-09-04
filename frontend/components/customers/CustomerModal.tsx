'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Plus } from 'lucide-react';
import { CustomerItem, CustomerFormData } from '@/types/customer';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  initialData?: CustomerItem | null;
  mode: 'input' | 'edit';
  nextCustomerIndex: number;
}

export default function CustomerModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  nextCustomerIndex,
}: CustomerModalProps) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<CustomerFormData>({
    id_customer: '',
    nama: '',
    alamat: '',
    no_hp: '',
    email: '',
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        id_customer: initialData.id_customer,
        nama: initialData.nama,
        alamat: initialData.alamat,
        no_hp: initialData.no_hp,
        email: initialData.email,
      });
    } else {
      setFormData({
        id_customer: `C-${currentYear}-3-A-${nextCustomerIndex}`,
        nama: '',
        alamat: '',
        no_hp: '',
        email: '',
      });
    }
  }, [initialData, mode, isOpen, nextCustomerIndex, currentYear]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_customer || !formData.nama || !formData.alamat || !formData.no_hp) {
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
          <h2 className="text-stone-800 text-xl font-bold">
            {mode === 'input' ? 'Input Customer' : 'Edit Customer'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-900 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white/80 rounded-[10px] border border-stone-800 flex flex-col gap-3 text-xs"
        >
          {/* Id Customer */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Id Customer</label>
            <input
              type="text"
              required
              value={formData.id_customer}
              onChange={(e) =>
                setFormData({ ...formData, id_customer: e.target.value })
              }
              className="w-full h-10 px-3 bg-white border border-stone-800 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Nama */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Nama Pelanggan / Perusahaan</label>
            <input
              type="text"
              required
              placeholder="Contoh: PT. Abadi Jaya"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Alamat */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Alamat</label>
            <textarea
              rows={2}
              required
              placeholder="Alamat operasional kantor/gudang mitra"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700 resize-none"
            />
          </div>

          {/* No HP */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">No HP / WhatsApp</label>
            <input
              type="text"
              required
              placeholder="0857-xxxx-xxxx"
              value={formData.no_hp}
              onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded font-mono text-stone-900 focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Email</label>
            <input
              type="email"
              required
              placeholder="kontak@perusahaan.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="h-10 px-5 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              {mode === 'input' ? (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Customer</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Batch</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}