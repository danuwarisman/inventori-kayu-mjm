'use client';

import React, { useState } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { SalesItem } from '@/types/sales';
import SalesStatCards from '@/components/sales/SalesStatCards';
import SalesTable from '@/components/sales/SalesTable';
import SalesModal from '@/components/sales/SalesModal';

export default function SalesPage() {
  // Role switcher ('admin' untuk input pesanan, 'manager' untuk approval)
  const [role] = useState<'admin' | 'manager'>('admin');
  const isManager = role === 'manager';

  // State data transaksi (Zero Dummy Data)
  const [sales, setSales] = useState<SalesItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: Omit<SalesItem, 'total_harga'>) => {
    const total = data.kuantitas * data.harga_satuan;
    const newItem: SalesItem = {
      ...data,
      total_harga: total,
    };
    setSales((prev) => [newItem, ...prev]);
  };

  // Handler Approval Manager (FR-013 & UC-08)
  const handleApprove = (id: string) => {
    setSales((prev) =>
      prev.map((item) =>
        item.id_transaksi === id ? { ...item, status: 'Approved' } : item
      )
    );
  };

  const handleReject = (id: string) => {
    const reason = window.prompt('Masukkan alasan penolakan pesanan penjualan:');
    if (reason !== null) {
      setSales((prev) =>
        prev.map((item) =>
          item.id_transaksi === id
            ? { ...item, status: 'Rejected', catatan_approval: reason }
            : item
        )
      );
    }
  };

  const filteredSales = sales.filter((item) => {
    const matchesQuery =
      item.id_transaksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama_customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All Status' || item.status === statusFilter;
    const matchesDate = !dateFilter || item.tanggal === dateFilter;

    return matchesQuery && matchesStatus && matchesDate;
  });

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1440px] mx-auto font-sans">
      {/* 1. Stat Cards (Metrik Ringkasan Status) */}
      <SalesStatCards items={sales} />

      {/* 2. Filter & Action Toolbar */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ID / Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-green-700 text-stone-900"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pr-8 pl-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Date:
            </span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700"
            />
          </div>
        </div>

        {/* Action Button: Add Sales (Admin Only) */}
        {!isManager && (
          <button
            type="button"
            onClick={handleOpenModal}
            className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sales</span>
          </button>
        )}
      </section>

      {/* 3. Main Sales Table */}
      <SalesTable
        items={filteredSales}
        totalCount={sales.length}
        isManager={isManager}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* 4. Modal Add New Sale */}
      <SalesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        nextIndex={sales.length + 1}
      />
    </div>
  );
}