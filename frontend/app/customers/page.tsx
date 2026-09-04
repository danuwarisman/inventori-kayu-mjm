'use client';

import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { CustomerItem, CustomerFormData } from '@/types/customer';
import CustomerAnalytics from '@/components/customers/CustomerAnalytics';
import CustomerTable from '@/components/customers/CustomerTable';
import CustomerModal from '@/components/customers/CustomerModal';

export default function CustomersPage() {
  // Switch role pengguna ('admin' untuk Office Admin, 'manager' untuk Manajer)
  const [role] = useState<'admin' | 'manager'>('admin');
  const isManager = role === 'manager';

  // State data utama tanpa dummy
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'input' | 'edit'>('input');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  const handleOpenInput = () => {
    setModalMode('input');
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CustomerItem) => {
    setModalMode('edit');
    setSelectedCustomer(item);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: CustomerFormData) => {
    if (modalMode === 'input') {
      setCustomers((prev) => [data, ...prev]);
    } else if (modalMode === 'edit' && selectedCustomer) {
      setCustomers((prev) =>
        prev.map((item) =>
          item.id_customer === selectedCustomer.id_customer ? data : item
        )
      );
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id_customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 p-6 max-w-[1440px] mx-auto font-sans">
      {/* Tampilan Khusus Manajer: Widget Analitik & Smart Alerts */}
      {isManager && <CustomerAnalytics customers={customers} />}

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
              placeholder="Cari berdasarkan nama, ID, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-green-700 text-stone-900"
            />
          </div>
        </div>

        {/* Tombol aksi eksklusif Admin */}
        {!isManager && (
          <button
            type="button"
            onClick={handleOpenInput}
            className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Customer</span>
          </button>
        )}
      </section>

      {/* Tabel Pelanggan */}
      <CustomerTable
        items={filteredCustomers}
        totalCount={customers.length}
        isManager={isManager}
        onEdit={handleOpenEdit}
      />

      {/* Modal Input & Edit */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedCustomer}
        mode={modalMode}
        nextCustomerIndex={customers.length + 1}
      />
    </div>
  );
}