'use client';

import React, { useState } from 'react';
import { FileDown, Plus, ChevronDown } from 'lucide-react';
import { PraDryKilnItem } from '@/types/pra-dry-kiln';
import PlankTable from '@/components/pra-dry-kiln/PlankTable';
import BatchModal from '@/components/pra-dry-kiln/BatchModal';

export default function PraDryKilnPage() {
  // Role switcher (Manager or Admin)
  const [role] = useState<'admin' | 'manager'>('admin');
  const isManager = role === 'manager';

  // State Data Awal (Zero Dummy Data)
  const [items, setItems] = useState<PraDryKilnItem[]>([]);

  // Filter States
  const [dateFilter, setDateFilter] = useState('');
  const [sortimenFilter, setSortimenFilter] = useState('All Sortimen');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'input' | 'edit'>('input');
  const [selectedItem, setSelectedItem] = useState<PraDryKilnItem | null>(null);

  // Volume Calculation: T(cm) * W(cm) * L(cm) / 1.000.000 (m³)
  const calculateVolume = (t: number, w: number, l: number): number => {
    return Number(((t * w * l) / 1000000).toFixed(3));
  };

  const handleOpenInput = () => {
    setModalMode('input');
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PraDryKilnItem) => {
    setModalMode('edit');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (
    data: Omit<PraDryKilnItem, 'volume' | 'date'>
  ) => {
    const vol = calculateVolume(data.tinggi, data.lebar, data.panjang);

    if (modalMode === 'input') {
      const newItem: PraDryKilnItem = {
        ...data,
        volume: vol,
        date: new Date().toLocaleDateString('id-ID'),
      };
      setItems((prev) => [newItem, ...prev]);
    } else if (modalMode === 'edit' && selectedItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id_plank === selectedItem.id_plank
            ? {
                ...item,
                ...data,
                volume: vol,
              }
            : item
        )
      );
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSortimen =
      sortimenFilter === 'All Sortimen' || item.sortimen === sortimenFilter;
    const matchesDate = !dateFilter || item.date === dateFilter;
    return matchesSortimen && matchesDate;
  });

  return (
    <div className="flex flex-col gap-5 p-6 max-w-[1440px] mx-auto font-sans">
      {/* Filter & Action Toolbar */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Filter by Date:
            </span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Sortimen Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Log Sortimen
            </span>
            <div className="relative">
              <select
                value={sortimenFilter}
                onChange={(e) => setSortimenFilter(e.target.value)}
                className="appearance-none pr-8 pl-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700 cursor-pointer"
              >
                <option value="All Sortimen">All Sortimen</option>
                <option value="Sortimen A">Sortimen A</option>
                <option value="Sortimen B">Sortimen B</option>
                <option value="Sortimen C">Sortimen C</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Top Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="px-4 py-2 bg-red-50 hover:bg-red-100/70 border border-stone-300 rounded text-xs font-semibold text-green-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-green-700" />
            <span>Export PDF</span>
          </button>

          {!isManager && (
            <button
              type="button"
              onClick={handleOpenInput}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Batch</span>
            </button>
          )}
        </div>
      </section>

      {/* Main Table Component */}
      <PlankTable
        items={filteredItems}
        totalCount={items.length}
        isManager={isManager}
        onEdit={handleOpenEdit}
      />

      {/* Input / Edit Batch Modal */}
      <BatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedItem}
        mode={modalMode}
        nextBatchIndex={items.length + 1}
      />
    </div>
  );
}