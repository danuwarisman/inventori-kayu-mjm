'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Pencil, ShieldCheck } from 'lucide-react';
import { AccountItem } from '@/types/account';

interface AccountCardProps {
  account: AccountItem;
  onEdit: (account: AccountItem) => void;
}

export default function AccountCard({ account, onEdit }: AccountCardProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="p-5 bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col justify-between gap-3 font-sans hover:shadow-md transition-shadow">
      {/* Header Kartu: Username & Aksi Edit */}
      <div className="flex justify-between items-start pb-2 border-b border-stone-100">
        <div>
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
            NAME ACCOUNT
          </span>
          <span className="text-base font-bold text-stone-900 font-mono">
            {account.name_account}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onEdit(account)}
          className="p-1.5 text-stone-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
          title="Edit Akun"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      {/* Rincian Profil Akun */}
      <div className="flex flex-col gap-2.5 text-xs">
        {/* Nama Lengkap */}
        <div className="grid grid-cols-12 items-center gap-2">
          <span className="col-span-4 text-neutral-500 font-medium uppercase tracking-tight">
            Nama User
          </span>
          <span className="col-span-8 font-semibold text-stone-900 capitalize truncate">
            {account.nama_user}
          </span>
        </div>

        {/* Password dengan Fitur Toggle Visibility */}
        <div className="grid grid-cols-12 items-center gap-2">
          <span className="col-span-4 text-neutral-500 font-medium uppercase tracking-tight">
            Password
          </span>
          <div className="col-span-8 flex items-center justify-between">
            <span className="font-mono text-neutral-700">
              {showPassword ? account.password : '••••••••••••'}
            </span>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              title={showPassword ? 'Sembunyikan Password' : 'Lihat Password'}
            >
              {showPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Email */}
        <div className="grid grid-cols-12 items-center gap-2">
          <span className="col-span-4 text-neutral-500 font-medium uppercase tracking-tight">
            Email
          </span>
          <span className="col-span-8 text-neutral-700 lowercase truncate">
            {account.email}
          </span>
        </div>

        {/* Alamat */}
        <div className="grid grid-cols-12 items-start gap-2">
          <span className="col-span-4 text-neutral-500 font-medium uppercase tracking-tight pt-0.5">
            Address
          </span>
          <span className="col-span-8 text-neutral-700 capitalize line-clamp-2 leading-relaxed">
            {account.alamat}
          </span>
        </div>

        {/* Divisi / Role Wewenang */}
        <div className="grid grid-cols-12 items-center gap-2 pt-1 border-t border-stone-100">
          <span className="col-span-4 text-neutral-500 font-medium uppercase tracking-tight">
            Division
          </span>
          <div className="col-span-8 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-green-700 shrink-0" />
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                account.divisi === 'Manager'
                  ? 'bg-purple-100 text-purple-800'
                  : account.divisi === 'Admin Kantor'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-lime-100 text-green-800'
              }`}
            >
              {account.divisi}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}