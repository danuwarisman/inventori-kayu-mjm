'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Search, Plus, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { SupplierItem, SupplierFormData } from '@/types/supplier';
import SupplierTable from '@/components/suppliers/SupplierTable';
import SupplierModal from '@/components/suppliers/SupplierModal';
import { getApiErrorMessage, supplierApi } from '@/lib/api';
import useSessionUser from '@/lib/useSessionUser';

export default function SuppliersPage() {
  // Role asli dari sesi login: manager read-only; selain itu bisa Add/Remove Supplier.
  const user = useSessionUser();
  const isManager = user?.role === 'manager';

  // State data utama dari backend
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // State Seleksi Checkbox (Untuk fitur Remove Supplier)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'input' | 'edit'>('input');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Ambil data supplier dari backend (GET /supplier).
  // setState hanya dijalankan pada callback promise (bukan sinkron di body effect).
  const fetchSuppliers = useCallback(() => {
    return supplierApi
      .list()
      .then((data) => {
        setSuppliers(data);
        // ID bisa berubah/hilang setelah refresh, jadi seleksi direset.
        setSelectedIds([]);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(
          getApiErrorMessage(
            err,
            'Terjadi kesalahan tak terduga saat mengambil data supplier.'
          )
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Retry/refresh lewat event handler: setState sinkron di sini tidak masalah
  const handleRefresh = () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    fetchSuppliers();
  };

  const handleOpenInput = () => {
    setModalMode('input');
    setSelectedSupplier(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SupplierItem) => {
    setModalMode('edit');
    setSelectedSupplier(item);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setModalError(null);
  };

  // Simpan ke backend: POST /supplier (tambah) atau PATCH /supplier/:id (edit).
  // Modal baru ditutup setelah request sukses.
  const handleModalSubmit = async (data: SupplierFormData) => {
    if (isSaving) return;

    setIsSaving(true);
    setModalError(null);

    try {
      if (modalMode === 'input') {
        const created = await supplierApi.create(data);
        setSuppliers((prev) => [created, ...prev]);
      } else if (selectedSupplier) {
        const updated = await supplierApi.update(selectedSupplier.id_backend, data);
        setSuppliers((prev) =>
          prev.map((item) =>
            item.id_backend === updated.id_backend ? updated : item
          )
        );
      }

      setIsModalOpen(false);
      setSelectedSupplier(null);
      setError(null);
    } catch (err) {
      setModalError(
        getApiErrorMessage(
          err,
          modalMode === 'input'
            ? 'Gagal menyimpan supplier. Silakan coba lagi.'
            : 'Gagal memperbarui supplier. Silakan coba lagi.'
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Seleksi Baris
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredSuppliers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSuppliers.map((s) => s.id_supplier));
    }
  };

  // Hapus supplier terpilih lewat DELETE /supplier/:id.
  const handleRemoveSelected = async () => {
    if (selectedIds.length === 0 || isDeleting) return;

    const targets = suppliers.filter((item) =>
      selectedIds.includes(item.id_supplier)
    );
    if (targets.length === 0) return;

    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus ${targets.length} supplier terpilih?`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const results = await Promise.allSettled(
      targets.map((item) => supplierApi.remove(item.id_backend))
    );

    const removedIds = new Set(
      targets
        .filter((_, index) => results[index].status === 'fulfilled')
        .map((item) => item.id_backend)
    );
    const failed = targets.filter(
      (_, index) => results[index].status === 'rejected'
    );

    setSuppliers((prev) => prev.filter((item) => !removedIds.has(item.id_backend)));
    setSelectedIds([]);

    if (failed.length > 0) {
      const firstRejection = results.find(
        (result): result is PromiseRejectedResult => result.status === 'rejected'
      );
      setError(
        `${failed.length} supplier gagal dihapus (${failed
          .map((item) => item.nama_supplier)
          .join(', ')}). ` +
          getApiErrorMessage(
            firstRejection?.reason,
            'Silakan muat ulang data lalu coba lagi.'
          )
      );
    }

    setIsDeleting(false);
  };

  const filteredSuppliers = suppliers.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      item.id_supplier.toLowerCase().includes(query) ||
      item.nama_supplier.toLowerCase().includes(query) ||
      item.alamat_supplier.toLowerCase().includes(query) ||
      item.kontak_supplier.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-5 p-6 max-w-[1440px] mx-auto font-sans">
      {/* Filter & Action Toolbar */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search Bar: ID / Nama / Alamat / Kontak */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ID / Supplier / Address / Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-green-700 text-stone-900"
            />
          </div>
        </div>

        {/* Tombol Aksi Eksklusif Admin */}
        {!isManager && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              title="Muat ulang data dari server"
              className="p-2 text-green-700 border border-green-700 hover:bg-green-50 rounded text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleRemoveSelected}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>
                  {isDeleting
                    ? 'Removing...'
                    : `Remove Supplier (${selectedIds.length})`}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenInput}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Supplier</span>
            </button>
          </div>
        )}
      </section>

      {/* Banner Error */}
      {error && (
        <section className="p-4 bg-red-50 border border-red-200 rounded-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-red-800">
              Gagal memproses data supplier
            </span>
            <span className="text-xs text-red-700">{error}</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-60"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </section>
      )}

      {/* Tabel Supplier */}
      <SupplierTable
        items={filteredSuppliers}
        totalCount={suppliers.length}
        isManager={isManager}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onEdit={handleOpenEdit}
      />

      {/* Modal Input & Edit Supplier */}
      <SupplierModal
        key={`${isModalOpen}-${modalMode}-${selectedSupplier?.id_backend ?? 'new'}`}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        initialData={selectedSupplier}
        mode={modalMode}
        isSaving={isSaving}
        errorMessage={modalError}
      />
    </div>
  );
}
