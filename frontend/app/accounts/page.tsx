'use client';

import React, { useState } from 'react';
import { Search, Plus, UserCog, Inbox } from 'lucide-react';
import { AccountItem, AccountFormData } from '@/types/account';
import AccountCard from '@/components/accounts/AccountCard';
import AccountModal from '@/components/accounts/AccountModal';

export default function AccountsPage() {
  // State data akun pengguna awal (Zero Dummy Data)
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'input' | 'edit'>('input');
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(null);

  const handleOpenInput = () => {
    setModalMode('input');
    setSelectedAccount(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (account: AccountItem) => {
    setModalMode('edit');
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: AccountFormData) => {
    if (modalMode === 'input') {
      setAccounts((prev) => [data, ...prev]);
    } else if (modalMode === 'edit' && selectedAccount) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id_account === selectedAccount.id_account ? data : acc
        )
      );
    }
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.nama_user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.name_account.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.divisi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1440px] mx-auto font-sans">
      {/* Bar Pencarian & Registrasi Akun */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
          <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
            Search Account
          </span>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, username, atau divisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-green-700 text-stone-900"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenInput}
          className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Account</span>
        </button>
      </section>

      {/* Grid Kartu Akun Pengguna */}
      {filteredAccounts.length === 0 ? (
        <div className="p-14 bg-white rounded-xl border border-stone-200 shadow-2xs flex flex-col items-center justify-center text-center gap-2 text-stone-400">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700 mb-1">
            <UserCog className="w-6 h-6 stroke-[1.75]" />
          </div>
          <p className="text-base font-bold text-stone-700">
            Belum ada akun pengguna terdaftar
          </p>
          <p className="text-xs text-stone-400 max-w-sm">
            Gunakan tombol &quot;+ New Account&quot; di atas untuk mendaftarkan akun staf Admin Lapangan, Admin Kantor, maupun Manajer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAccounts.map((account) => (
            <AccountCard
              key={account.id_account}
              account={account}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}

      {/* Modal Input & Edit Akun */}
      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedAccount}
        mode={modalMode}
        nextIndex={accounts.length + 1}
      />
    </div>
  );
}