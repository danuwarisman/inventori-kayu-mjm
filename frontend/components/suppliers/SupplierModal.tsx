'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Plus, ChevronDown } from 'lucide-react';
import { SupplierItem, SupplierFormData } from '@/types/supplier';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SupplierFormData) => void;
  initialData?: SupplierItem | null;
  mode: 'input' | 'edit';
  nextIndex: number;
}

export default function SupplierModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  nextIndex,
}: SupplierModalProps) {
  const [formData, setFormData] = useState<SupplierFormData>({
    id_supplier: '',
    nama_supplier: '',
    kontak_person: '',
    no_hp: '',
    harga: '',
    kota: 'Solo',
    status: 'Active',
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        id_supplier: initialData.id_supplier,
        nama_supplier: initialData.nama_supplier,
        kontak_person: initialData.kontak_person,
        no_hp: initialData.no_hp,
        harga: initialData.harga,
        kota: initialData.kota,
        status: initialData.status,
      });
    } else {
      setFormData({
        id_supplier: `SUP-${String(nextIndex).padStart(3, '0')}`,
        nama_supplier: '',
        kontak_person: '',
        no_hp: '',
        harga: 1000000,
        kota: 'Solo',
        status: 'Active',
      });
    }
  }, [initialData, mode, isOpen, nextIndex]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.id_supplier ||
      !formData.nama_supplier ||
      !formData.kontak_person ||
      !formData.no_hp ||
      formData.harga === ''
    ) {
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
          <h2 className="text-stone-800 text-xl font-bold font-sans">
            {mode === 'input' ? 'Add Supplier' : 'Edit Supplier'}
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
          {/* ID Supplier */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">ID Supplier</label>
            <input
              type="text"
              required
              value={formData.id_supplier}
              onChange={(e) =>
                setFormData({ ...formData, id_supplier: e.target.value })
              }
              className="w-full h-10 px-3 bg-white border border-stone-800 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Company Name */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Company Name</label>
            <input
              type="text"
              required
              placeholder="Contoh: PT Kayu Nusantara"
              value={formData.nama_supplier}
              onChange={(e) =>
                setFormData({ ...formData, nama_supplier: e.target.value })
              }
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-900 font-medium focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Contact Person & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-green-700">
                Contact Person
              </label>
              <input
                type="text"
                required
                placeholder="Nama PIC"
                value={formData.kontak_person}
                onChange={(e) =>
                  setFormData({ ...formData, kontak_person: e.target.value })
                }
                className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-green-700">
                Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="+62 812 xxxx xxxx"
                value={formData.no_hp}
                onChange={(e) =>
                  setFormData({ ...formData, no_hp: e.target.value })
                }
                className="w-full h-9 px-3 bg-white border border-stone-300 rounded font-mono text-stone-900 focus:outline-none focus:border-green-700"
              />
            </div>
          </div>

          {/* Kota & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-green-700">Kota Domisili</label>
              <input
                type="text"
                required
                placeholder="Solo / Semarang / dll"
                value={formData.kota}
                onChange={(e) =>
                  setFormData({ ...formData, kota: e.target.value })
                }
                className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-green-700">Status</label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'Active' | 'Inactive',
                    })
                  }
                  className="w-full h-9 pl-3 pr-8 bg-white border border-stone-300 rounded text-stone-900 appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Price (Harga) & Submit */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Price (IDR)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                required
                placeholder="1000000"
                value={formData.harga}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    harga: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="flex-1 h-10 px-3 bg-white border border-stone-300 rounded font-semibold text-stone-900 focus:outline-none focus:border-green-700"
              />
              <button
                type="submit"
                className="h-10 px-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {mode === 'input' ? (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Supplier</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Update Supplier</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}