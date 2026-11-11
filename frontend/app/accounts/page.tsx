'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Search,
  Plus,
  UserCog,
  RefreshCw,
  CheckCircle2,
  X,
  KeyRound,
  Filter,
} from 'lucide-react';
import {
  AccountItem,
  AccountFormData,
  AccountUser,
  AccountDivision,
} from '@/types/account';
import AccountCard from '@/components/accounts/AccountCard';
import AccountModal from '@/components/accounts/AccountModal';
import { accountApi } from '@/lib/api';
import { useConfirm } from '@/components/ConfirmModal';

const ACCOUNTS_STORAGE_KEY = 'mjm_accounts_records_v1';

// Data akun pengguna sistem aktif (Default Initial Seed)
const INITIAL_ACCOUNTS: AccountItem[] = [
  {
    idUser: 1,
    id_account: 'ACC-001',
    name_account: 'manager',
    nama_user: 'Manager MJM',
    password: '••••••••',
    email: 'manager@margijatimakmur.co.id',
    alamat: 'Jl. Pemuda No. 10, Pati',
    divisi: 'Manager',
    isActive: true,
  },
  {
    idUser: 2,
    id_account: 'ACC-002',
    name_account: 'danuwarisman',
    nama_user: 'Danu Warisman',
    password: '••••••••',
    email: 'danu@margijatimakmur.co.id',
    alamat: 'Kudus, Jawa Tengah',
    divisi: 'Admin Kantor',
    isActive: true,
  },
  {
    idUser: 3,
    id_account: 'ACC-003',
    name_account: 'cikalchrestella',
    nama_user: 'Cikal Chrestella Cora',
    password: '••••••••',
    email: 'cikal@margijatimakmur.co.id',
    alamat: 'Semarang, Jawa Tengah',
    divisi: 'Admin Kantor',
    isActive: true,
  },
  {
    idUser: 4,
    id_account: 'ACC-004',
    name_account: 'haryantoazmi',
    nama_user: 'Haryanto Wifakul Azmi',
    password: '••••••••',
    email: 'haryanto@margijatimakmur.co.id',
    alamat: 'Pati, Jawa Tengah',
    divisi: 'Manager',
    isActive: true,
  },
  {
    idUser: 5,
    id_account: 'ACC-005',
    name_account: 'riyanhidayat',
    nama_user: 'Riyan Hidayat Taufik',
    password: '••••••••',
    email: 'riyan@margijatimakmur.co.id',
    alamat: 'Blora, Jawa Tengah',
    divisi: 'Admin Lapangan',
    isActive: true,
  },
  {
    idUser: 6,
    id_account: 'ACC-006',
    name_account: 'lapangan',
    nama_user: 'Jovanov Alvin Bertram',
    password: '••••••••',
    email: 'jovanov@margijatimakmur.co.id',
    alamat: 'Jepara, Jawa Tengah',
    divisi: 'Admin Lapangan',
    isActive: true,
  },
];

function mapRoleToDivision(roleRaw?: AccountUser['role']): AccountDivision {
  const roleStr =
    typeof roleRaw === 'string'
      ? roleRaw
      : typeof roleRaw === 'object' && roleRaw !== null
      ? roleRaw.nama
      : '';
  const upper = roleStr.toUpperCase();
  if (upper.includes('MANAGER')) return 'Manager';
  if (upper.includes('LAPANGAN')) return 'Admin Lapangan';
  if (upper.includes('KANTOR')) return 'Admin Kantor';
  return 'Admin';
}

function mapDivisionToBackendRole(divisi: AccountDivision): {
  role: string;
  roleId: number;
} {
  if (divisi === 'Manager') return { role: 'MANAGER', roleId: 1 };
  if (divisi === 'Admin Lapangan') return { role: 'ADMIN_LAPANGAN', roleId: 3 };
  return { role: 'ADMIN_KANTOR', roleId: 2 };
}

function mapBackendUserToAccount(user: AccountUser, idx: number): AccountItem {
  const numericId = user.idUser ?? user.id ?? idx + 1;
  return {
    idUser: numericId,
    id_account: `ACC-${String(numericId).padStart(3, '0')}`,
    name_account: user.username,
    nama_user: user.nama || user.username,
    password: '••••••••',
    email: user.email || `${user.username}@margijatimakmur.co.id`,
    alamat: user.alamat || 'Jawa Tengah, Indonesia',
    divisi: mapRoleToDivision(user.role),
    isActive: user.isActive !== undefined ? user.isActive : !user.deletedAt,
  };
}

export default function AccountsPage() {
  const { confirm, ConfirmDialog } = useConfirm();
  const [accounts, setAccounts] = useState<AccountItem[]>(INITIAL_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // State Modal Input/Edit Akun
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'input' | 'edit'>('input');
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(null);

  // State Modal Reset Password
  const [resetTarget, setResetTarget] = useState<AccountItem | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);

  const persistLocalAccounts = (next: AccountItem[]) => {
    setAccounts(next);
    try {
      window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Abaikan bila localStorage penuh/tidak tersedia
    }
  };

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const remoteUsers = await accountApi.list();
      if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
        const mapped = remoteUsers.map(mapBackendUserToAccount);
        persistLocalAccounts(mapped);
        setIsLoading(false);
        return;
      }
    } catch {
      // Jika endpoint /users belum diaktifkan di server, gunakan penyimpanan lokal
    }

    try {
      const saved = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AccountItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAccounts(parsed);
        }
      }
    } catch {
      // Abaikan error parse
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

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

  const handleModalSubmit = async (data: AccountFormData) => {
    const roleMapping = mapDivisionToBackendRole(data.divisi);

    if (modalMode === 'input') {
      try {
        const created = await accountApi.create({
          username: data.name_account,
          password: data.password,
          nama: data.nama_user,
          role: roleMapping.role,
          roleId: roleMapping.roleId,
          email: data.email,
          alamat: data.alamat,
        });
        const mapped = mapBackendUserToAccount(created, accounts.length);
        const merged: AccountItem = {
          ...mapped,
          email: data.email || mapped.email,
          alamat: data.alamat || mapped.alamat,
          divisi: data.divisi,
          isActive: true,
        };
        persistLocalAccounts([merged, ...accounts]);
      } catch {
        const newLocal: AccountItem = {
          ...data,
          idUser: Date.now(),
          isActive: true,
        };
        persistLocalAccounts([newLocal, ...accounts]);
      }
      setStatusMessage(
        `Akun staf "${data.nama_user}" (@${data.name_account}) berhasil ditambahkan.`
      );
    } else if (modalMode === 'edit' && selectedAccount) {
      const isPasswordChanged =
        data.password && data.password !== '••••••••' && data.password.trim() !== '';

      try {
        if (selectedAccount.idUser) {
          await accountApi.update(selectedAccount.idUser, {
            username: data.name_account,
            nama: data.nama_user,
            role: roleMapping.role,
            roleId: roleMapping.roleId,
            email: data.email,
            alamat: data.alamat,
            ...(isPasswordChanged ? { password: data.password } : {}),
          });
        }
      } catch {
        // Fallback ke update state lokal bila endpoint /users belum tersedia
      }

      const nextList = accounts.map((acc) =>
        acc.id_account === selectedAccount.id_account
          ? {
              ...acc,
              ...data,
              password: isPasswordChanged ? data.password : acc.password,
            }
          : acc
      );
      persistLocalAccounts(nextList);
      setStatusMessage(
        `Perubahan profil akun "${data.nama_user}" berhasil disimpan.`
      );
    }
  };

  const handleOpenResetPassword = (account: AccountItem) => {
    setResetTarget(account);
    setNewPasswordInput('');
    setResetError(null);
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;

    if (newPasswordInput.trim().length < 8) {
      setResetError('Password baru wajib minimal 8 karakter.');
      return;
    }

    try {
      if (resetTarget.idUser) {
        await accountApi.resetPassword(
          resetTarget.idUser,
          newPasswordInput.trim()
        );
      }
    } catch {
      // Fallback ke penyimpanan lokal bila endpoint /users belum aktif
    }

    const nextList = accounts.map((acc) =>
      acc.id_account === resetTarget.id_account
        ? { ...acc, password: newPasswordInput.trim() }
        : acc
    );
    persistLocalAccounts(nextList);
    setStatusMessage(
      `Password untuk akun @${resetTarget.name_account} (${resetTarget.nama_user}) berhasil direset.`
    );
    setResetTarget(null);
    setNewPasswordInput('');
  };

  const handleToggleAccountStatus = async (account: AccountItem) => {
    const currentlyActive = account.isActive !== false;
    const nextActive = !currentlyActive;
    const actionLabel = nextActive ? 'mengaktifkan kembali' : 'menonaktifkan';

    const ok = await confirm({
      title: nextActive ? 'Aktifkan Akun Staf' : 'Nonaktifkan Akun Staf',
      message: `Apakah Anda yakin ingin ${actionLabel} akun @${account.name_account} (${account.nama_user})?`,
      confirmLabel: nextActive ? 'Ya, Aktifkan' : 'Ya, Nonaktifkan',
      variant: nextActive ? 'primary' : 'danger',
    });
    if (!ok) {
      return;
    }

    try {
      if (account.idUser) {
        if (!nextActive) {
          await accountApi.toggleStatus(account.idUser, false);
        } else {
          await accountApi.toggleStatus(account.idUser, true);
        }
      }
    } catch {
      // Fallback ke update lokal bila endpoint /users belum aktif
    }

    const nextList = accounts.map((acc) =>
      acc.id_account === account.id_account
        ? { ...acc, isActive: nextActive }
        : acc
    );
    persistLocalAccounts(nextList);
    setStatusMessage(
      `Status akun @${account.name_account} diubah menjadi ${
        nextActive ? 'Aktif' : 'Nonaktif'
      }.`
    );
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.nama_user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.name_account.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.divisi.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const isActive = acc.isActive !== false;
    if (statusFilter === 'ACTIVE') return isActive;
    if (statusFilter === 'INACTIVE') return !isActive;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1440px] mx-auto font-sans">
      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between text-emerald-800 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bar Pencarian, Filter Status & Registrasi Akun */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1 max-w-2xl">
          <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
            Search Account
          </span>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, username, atau divisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-green-700 text-stone-900"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')
              }
              className="h-9 px-2.5 bg-white border border-stone-300 rounded text-stone-700 text-xs focus:outline-none focus:border-green-700 cursor-pointer"
            >
              <option value="ALL">Semua Status ({accounts.length})</option>
              <option value="ACTIVE">
                Aktif ({accounts.filter((a) => a.isActive !== false).length})
              </option>
              <option value="INACTIVE">
                Nonaktif ({accounts.filter((a) => a.isActive === false).length})
              </option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchAccounts}
            disabled={isLoading}
            className="h-9 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Sinkronkan daftar user dari server (/users)"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync /users</span>
          </button>

          <button
            type="button"
            onClick={handleOpenInput}
            className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Account</span>
          </button>
        </div>
      </section>

      {/* Grid Kartu Akun Pengguna */}
      {filteredAccounts.length === 0 ? (
        <div className="p-14 bg-white rounded-xl border border-stone-200 shadow-2xs flex flex-col items-center justify-center text-center gap-2 text-stone-400">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700 mb-1">
            <UserCog className="w-6 h-6 stroke-[1.75]" />
          </div>
          <p className="text-base font-bold text-stone-700">
            Belum ada akun pengguna yang sesuai filter
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
              onResetPassword={handleOpenResetPassword}
              onToggleStatus={handleToggleAccountStatus}
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

      {/* Modal Reset Password Cepat */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-orange-50 rounded-xl border border-stone-300 shadow-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-300/60">
              <div className="flex items-center gap-2 text-stone-800">
                <KeyRound className="w-5 h-5 text-green-700" />
                <h3 className="text-base font-bold">Reset Password Staf</h3>
              </div>
              <button
                type="button"
                onClick={() => setResetTarget(null)}
                className="p-1 text-stone-500 hover:text-stone-900 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleConfirmResetPassword}
              className="p-4 bg-white rounded-lg border border-stone-300 flex flex-col gap-3 text-xs"
            >
              <div>
                <span className="text-stone-500 block">Target Akun:</span>
                <span className="font-bold text-stone-900 text-sm">
                  {resetTarget.nama_user} (@{resetTarget.name_account})
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">
                  Password Baru (Minimal 8 Karakter)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Masukkan password baru..."
                  value={newPasswordInput}
                  onChange={(e) => {
                    setNewPasswordInput(e.target.value);
                    if (resetError) setResetError(null);
                  }}
                  className="w-full h-10 px-3 bg-white border border-stone-300 rounded font-mono text-stone-900 focus:outline-none focus:border-green-700"
                  autoFocus
                />
              </div>

              {resetError && (
                <p className="text-rose-600 font-semibold text-[11px]">
                  {resetError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetTarget(null)}
                  className="h-9 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded cursor-pointer"
                >
                  Simpan Password Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {ConfirmDialog}
    </div>
  );
}
