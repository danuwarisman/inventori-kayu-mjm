'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Plus, ChevronDown } from 'lucide-react';
import { AccountItem, AccountFormData, AccountDivision } from '@/types/account';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccountFormData) => void;
  initialData?: AccountItem | null;
  mode: 'input' | 'edit';
  nextIndex: number;
}

export default function AccountModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  nextIndex,
}: AccountModalProps) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<AccountFormData>({
    id_account: '',
    name_account: '',
    nama_user: '',
    password: '',
    email: '',
    alamat: '',
    divisi: 'Admin Lapangan',
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        id_account: initialData.id_account,
        name_account: initialData.name_account,
        nama_user: initialData.nama_user,
        password: initialData.password,
        email: initialData.email,
        alamat: initialData.alamat,
        divisi: initialData.divisi,
      });
    } else {
      setFormData({
        id_account: `USR-${currentYear}-${String(nextIndex).padStart(3, '0')}`,
        name_account: '',
        nama_user: '',
        password: '',
        email: '',
        alamat: '',
        divisi: 'Admin Lapangan',
      });
    }
  }, [initialData, mode, isOpen, nextIndex, currentYear]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.id_account ||
      !formData.name_account ||
      !formData.nama_user ||
      !formData.password
    ) {
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
            {mode === 'input' ? 'Input Account' : 'Edit Account'}
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
          {/* Id Account */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Id Account</label>
            <input
              type="text"
              required
              value={formData.id_account}
              onChange={(e) =>
                setFormData({ ...formData, id_account: e.target.value })
              }
              className="w-full h-10 px-3 bg-white border border-stone-800 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Name Account (Username) */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Name Account (Username)</label>
            <input
              type="text"
              required
              placeholder="Contoh: danu.warisman"
              value={formData.name_account}
              onChange={(e) =>
                setFormData({ ...formData, name_account: e.target.value })
              }
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-900 font-mono focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Nama User (Nama Lengkap) */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Nama Lengkap User</label>
            <input
              type="text"
              required
              placeholder="Contoh: Danu Warisman"
              value={formData.nama_user}
              onChange={(e) =>
                setFormData({ ...formData, nama_user: e.target.value })
              }
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Password</label>
            <input
              type="text"
              required
              placeholder="Masukkan password akun"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-900 font-mono focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Email</label>
            <input
              type="email"
              required
              placeholder="user@perusahaan.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Address</label>
            <textarea
              rows={2}
              required
              placeholder="Alamat domisili staf"
              value={formData.alamat}
              onChange={(e) =>
                setFormData({ ...formData, alamat: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700 resize-none"
            />
          </div>

          {/* Division / Role */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Division (Role)</label>
            <div className="relative">
              <select
                value={formData.divisi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    divisi: e.target.value as AccountDivision,
                  })
                }
                className="w-full h-10 pl-3 pr-8 bg-white border border-stone-300 rounded text-green-700 font-semibold appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
              >
                <option value="Admin Lapangan">Admin Lapangan</option>
                <option value="Admin Kantor">Admin Kantor</option>
                <option value="Manager">Manager</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="h-10 px-5 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              {mode === 'input' ? (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Account</span>
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