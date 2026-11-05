'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Search, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { CustomerItem, CustomerFormData } from '@/types/customer';
import CustomerAnalytics from '@/components/customers/CustomerAnalytics';
import CustomerTable from '@/components/customers/CustomerTable';
import CustomerModal from '@/components/customers/CustomerModal';
import { customerApi, getApiErrorMessage } from '@/lib/api';
import useSessionUser from '@/lib/useSessionUser';
import { can } from '@/lib/permissions';

export default function CustomersPage() {
  // Customer dikelola Admin Lapangan; role lain hanya melihat.
  const user = useSessionUser();
  const isManager = user?.role === 'manager';
  const canCreate = can(user?.role, 'customer:create');
  const canUpdate = can(user?.role, 'customer:update');
  const canDelete = can(user?.role, 'customer:delete');

  // State data utama dari backend
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'input' | 'edit'>('input');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Ambil data customer dari backend (GET /customers)
  const fetchCustomers = useCallback(() => {
    return customerApi
      .list()
      .then((data) => {
        setCustomers(data);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(
          getApiErrorMessage(
            err,
            'Terjadi kesalahan tak terduga saat mengambil data customer.'
          )
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleRefresh = () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    fetchCustomers();
  };

  const handleOpenInput = () => {
    if (!canCreate) return;
    setModalMode('input');
    setSelectedCustomer(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CustomerItem) => {
    if (!canUpdate) return;
    setModalMode('edit');
    setSelectedCustomer(item);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedCustomer(null);
    setModalError(null);
  };

  // Simpan ke backend: POST /customers atau PATCH /customers/:id
  const handleModalSubmit = async (data: CustomerFormData) => {
    if (isSaving) return;
    setIsSaving(true);
    setModalError(null);

    try {
      if (modalMode === 'input') {
        const created = await customerApi.create(data);
        setCustomers((prev) => [created, ...prev]);
      } else if (selectedCustomer?.id_backend) {
        const updated = await customerApi.update(selectedCustomer.id_backend, data);
        setCustomers((prev) =>
          prev.map((item) =>
            item.id_backend === updated.id_backend ? updated : item
          )
        );
      } else {
        throw new Error('ID backend customer tidak ditemukan.');
      }

      setIsModalOpen(false);
      setSelectedCustomer(null);
      setError(null);
    } catch (err: unknown) {
      setModalError(
        getApiErrorMessage(
          err,
          modalMode === 'input'
            ? 'Gagal menyimpan customer. Silakan coba lagi.'
            : 'Gagal memperbarui customer. Silakan coba lagi.'
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Hapus single customer via DELETE /customers/:id
  const handleDelete = async (item: CustomerItem) => {
    if (!canDelete || !item.id_backend) return;

    if (!window.confirm(`Apakah Anda yakin ingin menghapus customer "${item.nama}"?`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await customerApi.remove(item.id_backend);
      setCustomers((prev) => prev.filter((c) => c.id_backend !== item.id_backend));
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(
          err,
          `Gagal menghapus customer "${item.nama}". Silakan coba lagi.`
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id_customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.no_hp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.alamat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 p-6 max-w-[1440px] mx-auto font-sans">
      {/* Tampilan Khusus Manajer: Widget Analitik & Smart Alerts */}
      {isManager && <CustomerAnalytics customers={customers} />}

      {/* Banner Error Global */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-rose-700 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="underline hover:text-rose-900 font-semibold cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Toolbar Pencarian & Registrasi Customer */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
          <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
            Search Customer
          </span>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, ID, alamat, atau no HP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-green-700 text-stone-900"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-9 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Muat ulang data customer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Tombol aksi sesuai izin role */}
          {canCreate && (
            <button
              type="button"
              onClick={handleOpenInput}
              className="h-9 px-4 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Customer</span>
            </button>
          )}
        </div>
      </section>

      {/* Tabel Pelanggan */}
      <CustomerTable
        items={filteredCustomers}
        totalCount={customers.length}
        isLoading={isLoading}
        isManager={isManager}
        canEdit={canUpdate}
        canDelete={canDelete}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Modal Input & Edit */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        initialData={selectedCustomer}
        mode={modalMode}
        nextCustomerIndex={customers.length + 1}
        isSaving={isSaving}
        errorMessage={modalError}
      />
    </div>
  );
}
