'use client';

import React, { useState } from 'react';
import { X, Check, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { SupplierItem, SupplierFormData } from '@/types/supplier';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Boleh async: modal tetap terbuka sampai parent menutupnya setelah sukses. */
  onSubmit: (data: SupplierFormData) => void | Promise<void>;
  initialData?: SupplierItem | null;
  mode: 'input' | 'edit';
  isSaving?: boolean;
  /** Error dari backend, ditampilkan di dalam modal. */
  errorMessage?: string | null;
}

const EMPTY_FORM: SupplierFormData = {
  nama_supplier: '',
  alamat_supplier: '',
  kontak_supplier: '',
};

/**
 * Nilai awal form. Parent memberi `key` yang berubah saat modal dibuka /
 * target edit berganti, sehingga state ter-reset tanpa useEffect.
 */
function buildInitialForm(
  initialData: SupplierItem | null | undefined,
  mode: 'input' | 'edit'
): SupplierFormData {
  if (initialData && mode === 'edit') {
    return {
      nama_supplier: initialData.nama_supplier,
      alamat_supplier: initialData.alamat_supplier,
      kontak_supplier: initialData.kontak_supplier,
    };
  }
  return EMPTY_FORM;
}

export default function SupplierModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  isSaving = false,
  errorMessage = null,
}: SupplierModalProps) {
  const [formData, setFormData] = useState<SupplierFormData>(() =>
    buildInitialForm(initialData, mode)
  );
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const updateField = (field: keyof SupplierFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formError) setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const payload: SupplierFormData = {
      nama_supplier: formData.nama_supplier.trim(),
      alamat_supplier: formData.alamat_supplier.trim(),
      kontak_supplier: formData.kontak_supplier.trim(),
    };

    if (!payload.nama_supplier || !payload.alamat_supplier || !payload.kontak_supplier) {
      setFormError('Nama, alamat, dan kontak supplier wajib diisi.');
      return;
    }

    setFormError(null);
    // Parent yang menutup modal setelah request backend sukses.
    void onSubmit(payload);
  };

  const displayedError = formError ?? errorMessage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div className="relative w-full max-w-[520px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
          <h2 className="text-stone-800 text-xl font-bold font-sans">
            {mode === 'input' ? 'Add Supplier' : 'Edit Supplier'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1 text-stone-500 hover:text-stone-900 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white/80 rounded-[10px] border border-stone-800 flex flex-col gap-3 text-xs"
        >
          {/* Company Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="supplier-nama" className="font-semibold text-green-700">
              Company Name
            </label>
            <input
              id="supplier-nama"
              type="text"
              required
              maxLength={100}
              placeholder="Contoh: PT Kayu Nusantara"
              value={formData.nama_supplier}
              onChange={(e) => updateField('nama_supplier', e.target.value)}
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-900 font-medium focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1">
            <label htmlFor="supplier-alamat" className="font-semibold text-green-700">
              Address
            </label>
            <input
              id="supplier-alamat"
              type="text"
              required
              maxLength={200}
              placeholder="Contoh: Jl. Raya Solo - Semarang, Jepara"
              value={formData.alamat_supplier}
              onChange={(e) => updateField('alamat_supplier', e.target.value)}
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Contact / Phone */}
          <div className="flex flex-col gap-1">
            <label htmlFor="supplier-kontak" className="font-semibold text-green-700">
              Phone Number
            </label>
            <input
              id="supplier-kontak"
              type="text"
              required
              inputMode="tel"
              maxLength={15}
              placeholder="0812xxxxxxx"
              value={formData.kontak_supplier}
              onChange={(e) => updateField('kontak_supplier', e.target.value)}
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded font-mono text-stone-900 focus:outline-none focus:border-green-700"
            />
            <span className="text-[10px] text-stone-500">
              Maksimal 15 karakter (batas kolom kontak di backend).
            </span>
          </div>

          {displayedError && (
            <div
              role="alert"
              className="px-3 py-2 bg-red-50 border border-red-200 rounded flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="text-[11px] text-red-700 font-medium">
                {displayedError}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSaving}
            className="mt-1 h-10 w-full bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : mode === 'input' ? (
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
        </form>
      </div>
    </div>
  );
}
