'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Pencil,
  Eye,
  EyeOff,
  X,
  Check,
  ChevronDown,
  User,
  Mail,
  MapPin,
  Briefcase,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

interface AccountItem {
  id: string;
  accountName: string;
  fullName: string;
  password: string;
  email: string;
  address: string;
  division: string;
}

const mockAccounts: AccountItem[] = [
  {
    id: 'ACC-2026-001',
    accountName: 'admin_lapangan_1',
    fullName: 'Budi Santoso',
    password: 'Password123',
    email: 'budi.santoso@gmail.com',
    address: 'Jl. Ahmad Yani No. 32, Kec. Banjarsari, Kota Surakarta, Jawa Tengah',
    division: 'Admin Lapangan',
  },
  {
    id: 'ACC-2026-002',
    accountName: 'office_admin',
    fullName: 'Siti Rahmawati',
    password: 'OfficeAdmin2026',
    email: 'siti.rahma@gmail.com',
    address: 'Jl. Slamet Riyadi No. 104, Solo, Jawa Tengah',
    division: 'Office Admin',
  },
  {
    id: 'ACC-2026-003',
    accountName: 'sawmill_lead',
    fullName: 'Agus Purnomo',
    password: 'SawmillSafe#9',
    email: 'agus.purnomo@gmail.com',
    address: 'Jl. Raya Palur Km 5, Karanganyar, Jawa Tengah',
    division: 'Sawmill Operator',
  },
  {
    id: 'ACC-2026-004',
    accountName: 'drykiln_tech',
    fullName: 'Hendra Wijaya',
    password: 'DryKiln2026!',
    email: 'hendra.dry@gmail.com',
    address: 'Jl. Veteran No. 12, Boyolali, Jawa Tengah',
    division: 'Dry Kiln Operator',
  },
  {
    id: 'ACC-2026-005',
    accountName: 'inventory_ctrl',
    fullName: 'Dewi Lestari',
    password: 'InventoryPassword1',
    email: 'dewi.lestari@gmail.com',
    address: 'Kavling Madu Asri No. 18, Colomadu, Karanganyar',
    division: 'Inventory Control',
  },
  {
    id: 'ACC-2026-006',
    accountName: 'manager_ops',
    fullName: 'Unknown 123',
    password: 'ManagerSecure2026',
    email: 'manager@margijatimakmur.com',
    address: 'Jl. Diponegoro No. 88, Surakarta, Jawa Tengah',
    division: 'Manager',
  },
];

const availableDivisions = [
  'Admin Lapangan',
  'Office Admin',
  'Sawmill Operator',
  'Pra Dry Kiln Operator',
  'Dry Kiln Operator',
  'Inventory Control',
  'Manager',
];

export default function AccountManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState<'input' | 'edit' | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Form State
  const [formData, setFormData] = useState<AccountItem>({
    id: '',
    accountName: '',
    fullName: '',
    password: '',
    email: '',
    address: '',
    division: 'Admin Lapangan',
  });

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenCreate = () => {
    setFormData({
      id: `ACC-2026-${String(mockAccounts.length + 1).padStart(3, '0')}`,
      accountName: '',
      fullName: '',
      password: '',
      email: '',
      address: '',
      division: 'Admin Lapangan',
    });
    setModalMode('input');
  };

  const handleOpenEdit = (acc: AccountItem) => {
    setFormData(acc);
    setModalMode('edit');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalMode(null);
  };

  const filteredAccounts = mockAccounts.filter(
    (acc) =>
      acc.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.division.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1440px] mx-auto font-sans">
      {/* 1. Header Toolbar (Search & New Account Button) */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
          <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
            Search Account
          </span>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari user, nama, divisi, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-green-700"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Account</span>
        </button>
      </section>

      {/* 2. Account Cards Grid (Sesuai Struktur Frame Figma) */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredAccounts.map((acc) => {
          const isPasswordVisible = visiblePasswords[acc.id] || false;

          return (
            <div
              key={acc.id}
              className="p-5 bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col justify-between gap-3 relative hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start border-b border-stone-100 pb-2.5">
                <div>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                    Account Name
                  </span>
                  <h3 className="text-base font-bold text-neutral-800 tracking-tight">
                    {acc.accountName}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(acc)}
                  className="p-1.5 text-stone-500 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                  title="Edit Akun"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              {/* Data Rows */}
              <div className="flex flex-col gap-2 text-xs">
                {/* Nama User */}
                <div className="flex items-center gap-3">
                  <span className="w-24 text-[11px] font-medium text-neutral-500 uppercase tracking-tight flex items-center gap-1.5 shrink-0">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    Nama User
                  </span>
                  <span className="font-semibold text-neutral-800 capitalize truncate">
                    {acc.fullName}
                  </span>
                </div>

                {/* Password Row with Toggle View */}
                <div className="flex items-center gap-3">
                  <span className="w-24 text-[11px] font-medium text-neutral-500 uppercase tracking-tight flex items-center gap-1.5 shrink-0">
                    <KeyRound className="w-3.5 h-3.5 text-stone-400" />
                    Password
                  </span>
                  <div className="flex-1 flex items-center justify-between min-w-0 pr-1">
                    <span className="font-mono text-neutral-700 text-xs truncate">
                      {isPasswordVisible ? acc.password : '••••••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(acc.id)}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors ml-2"
                      title={isPasswordVisible ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="w-3.5 h-3.5 text-green-700" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <span className="w-24 text-[11px] font-medium text-neutral-500 uppercase tracking-tight flex items-center gap-1.5 shrink-0">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    Email
                  </span>
                  <span className="text-neutral-700 lowercase truncate font-mono text-[11px]">
                    {acc.email}
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <span className="w-24 text-[11px] font-medium text-neutral-500 uppercase tracking-tight flex items-center gap-1.5 shrink-0 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    Address
                  </span>
                  <span className="text-neutral-600 text-[11px] leading-relaxed line-clamp-2">
                    {acc.address}
                  </span>
                </div>

                {/* Division */}
                <div className="flex items-center gap-3 pt-1 border-t border-stone-100">
                  <span className="w-24 text-[11px] font-medium text-neutral-500 uppercase tracking-tight flex items-center gap-1.5 shrink-0">
                    <Briefcase className="w-3.5 h-3.5 text-stone-400" />
                    Division
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-lime-100 text-green-800 tracking-tight">
                    {acc.division}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Input & Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
              <h2 className="text-stone-800 text-xl font-bold font-sans">
                {modalMode === 'input' ? 'Input Account' : 'Edit Account'}
              </h2>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1 text-stone-500 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="p-4 bg-white/80 rounded-[10px] border border-stone-800/80 flex flex-col gap-3 text-xs"
            >
              {/* Id Account */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Id Account</label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-stone-800 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
                />
              </div>

              {/* Name Account */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Name account (Username)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin_lapangan_1"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
                />
              </div>

              {/* Name User */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Name user (Nama Lengkap)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Budi Santoso"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Password</label>
                <input
                  type="text"
                  required
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-stone-300 rounded font-mono text-stone-900 focus:outline-none focus:border-green-700"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Email</label>
                <input
                  type="email"
                  required
                  placeholder="user@margijatimakmur.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
                />
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Alamat domisili staf"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700 resize-none"
                />
              </div>

              {/* Division */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Division</label>
                <div className="relative">
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full h-9 px-3 appearance-none bg-white border border-stone-300 rounded text-green-700 font-semibold focus:outline-none focus:border-green-700 cursor-pointer"
                  >
                    {availableDivisions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="h-9 px-5 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{modalMode === 'input' ? 'Save Account' : 'Update Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}