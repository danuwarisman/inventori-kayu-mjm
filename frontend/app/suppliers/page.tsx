'use client';

import React, { useState } from 'react';
import { Search, Plus, Trash2, ChevronDown } from 'lucide-react';
import { SupplierItem, SupplierFormData } from '@/types/supplier';
import SupplierTable from '@/components/suppliers/SupplierTable';
import SupplierModal from '@/components/suppliers/SupplierModal';

export default function SuppliersPage() {
  // Role switcher: 'admin' (bisa Add/Remove Supplier), 'manager' (read-only)
  const [role] = useState<'admin' | 'manager'>('admin');
  const isManager = role === 'manager';

  // State data utama tanpa dummy
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // State Seleksi Checkbox (Untuk fitur Remove Supplier)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'input' | 'edit'>('input');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(null);

  const handleOpenInput = () => {
    setModalMode('input');
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SupplierItem) => {
    setModalMode('edit');
    setSelectedSupplier(item);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: SupplierFormData) => {
    const preparedItem: SupplierItem = {
      ...data,
      harga: Number(data.harga) || 0,
    };

    if (modalMode === 'input') {
      setSuppliers((prev) => [preparedItem, ...prev]);
    } else if (modalMode === 'edit' && selectedSupplier) {
      setSuppliers((prev) =>
        prev.map((item) =>
          item.id_supplier === selectedSupplier.id_supplier
            ? preparedItem
            : item
        )
      );
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

  // Handler Hapus Supplier Terpilih (Fitur Remove Supplier dari Figma)
  const handleRemoveSelected = () => {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus ${selectedIds.length} supplier terpilih?`
      )
    ) {
      setSuppliers((prev) =>
        prev.filter((item) => !selectedIds.includes(item.id_supplier))
      );
      setSelectedIds([]);
    }
  };

  const filteredSuppliers = suppliers.filter((item) => {
    const matchesQuery =
      item.id_supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama_supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kontak_person.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity =
      cityFilter === 'All Cities' || item.kota === cityFilter;
    const matchesStatus =
      statusFilter === 'All Status' || item.status === statusFilter;

    return matchesQuery && matchesCity && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-5 p-6 max-w-[1440px] mx-auto font-sans">
      {/* Filter & Action Toolbar */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search Bar: ID / Supplier */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ID / Supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-green-700 text-stone-900"
            />
          </div>

          {/* Filter Kota (All Cities) */}
          <div className="relative">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="appearance-none pr-8 pl-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700 cursor-pointer"
            >
              <option value="All Cities">All Cities</option>
              <option value="Solo">Solo</option>
              <option value="Semarang">Semarang</option>
              <option value="Jepara">Jepara</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Filter Status (All Status) */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pr-8 pl-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Tombol Aksi Eksklusif Admin */}
        {!isManager && (
          <div className="flex items-center gap-2.5">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleRemoveSelected}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Supplier ({selectedIds.length})</span>
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

      {/* Tabel Supplier */}
      <SupplierTable
        items={filteredSuppliers}
        totalCount={suppliers.length}
        isManager={isManager}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onEdit={handleOpenEdit}
      />

      {/* Modal Input & Edit Supplier */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedSupplier}
        mode={modalMode}
        nextIndex={suppliers.length + 1}
      />
    </div>
  );
}