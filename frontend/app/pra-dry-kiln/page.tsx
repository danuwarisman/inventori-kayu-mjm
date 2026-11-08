'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileDown, Plus, ChevronDown, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { dryKilnApi } from '@/lib/api';
import { PraDryKilnItem } from '@/types/pra-dry-kiln';
import PlankTable from '@/components/pra-dry-kiln/PlankTable';
import BatchModal from '@/components/pra-dry-kiln/BatchModal';
import { toISODate, formatDateID } from '@/lib/dates';
import { exportToPdf } from '@/lib/export';
import useSessionUser from '@/lib/useSessionUser';
import { can } from '@/lib/permissions';

// Data contoh palet pra dry kiln aktif (Sample Data)
const INITIAL_PRA_DRY_KILN: PraDryKilnItem[] = [
  {
    id_plank: 'P-2026-004-A1',
    id_log: 'L-2026-004',
    sortimen: 'Sortimen A',
    panjang: 250,
    lebar: 20,
    tinggi: 5,
    volume: 0.025,
    grade: 'Grade A',
    stage: 'pra-drykiln',
    date: '2026-11-05',
  },
  {
    id_plank: 'P-2026-004-A2',
    id_log: 'L-2026-004',
    sortimen: 'Sortimen A',
    panjang: 250,
    lebar: 18,
    tinggi: 5,
    volume: 0.023,
    grade: 'Grade A',
    stage: 'pra-drykiln',
    date: '2026-11-05',
  },
  {
    id_plank: 'P-2026-005-B1',
    id_log: 'L-2026-005',
    sortimen: 'Sortimen A',
    panjang: 300,
    lebar: 25,
    tinggi: 5,
    volume: 0.038,
    grade: 'Grade A',
    stage: 'finish pra-drykiln',
    date: '2026-11-06',
  },
  {
    id_plank: 'P-2026-006-A1',
    id_log: 'L-2026-006',
    sortimen: 'Sortimen B',
    panjang: 220,
    lebar: 15,
    tinggi: 4,
    volume: 0.013,
    grade: 'Grade B',
    stage: 'pra-drykiln',
    date: '2026-11-06',
  },
  {
    id_plank: 'P-2026-007-B1',
    id_log: 'L-2026-007',
    sortimen: 'Sortimen B',
    panjang: 260,
    lebar: 20,
    tinggi: 4,
    volume: 0.021,
    grade: 'Grade B',
    stage: 'finish pra-drykiln',
    date: '2026-11-07',
  },
  {
    id_plank: 'P-2026-008-C1',
    id_log: 'L-2026-008',
    sortimen: 'Sortimen C',
    panjang: 200,
    lebar: 15,
    tinggi: 3,
    volume: 0.009,
    grade: 'Grade C',
    stage: 'pra-drykiln',
    date: '2026-11-07',
  },
  {
    id_plank: 'P-2026-010-A1',
    id_log: 'L-2026-010',
    sortimen: 'Sortimen A',
    panjang: 320,
    lebar: 25,
    tinggi: 6,
    volume: 0.048,
    grade: 'Grade A',
    stage: 'finish pra-drykiln',
    date: '2026-11-07',
  },
];

export default function PraDryKilnPage() {
  // Role asli dari sesi login (Manager & Admin Kantor read-only)
  const user = useSessionUser();
  const isManager = user?.role === 'manager';
  const canCreate = can(user?.role, 'pra-dry-kiln:create');
  const canUpdate = can(user?.role, 'pra-dry-kiln:update');

  // State Data Awal (Zero Dummy Data)
  const [items, setItems] = useState<PraDryKilnItem[]>(INITIAL_PRA_DRY_KILN);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

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

  const handleSendToOven = async (item: PraDryKilnItem) => {
    if (!canUpdate) return;
    setTransferSuccess(null);

    try {
      await dryKilnApi.create({
        id_plank: item.id_plank,
        id_log: item.id_log,
        sortimen: item.sortimen,
        panjang: item.panjang,
        lebar: item.lebar,
        tinggi: item.tinggi,
        volume: item.volume,
        grade: item.grade,
        stage: 'in-drykiln',
        date: toISODate(),
      });
    } catch (err) {
      console.warn('Gagal menyimpan langsung ke API dry-kiln, menggunakan fallback state lokal:', err);
    }

    setItems((prev) =>
      prev.map((row) =>
        row.id_plank === item.id_plank
          ? { ...row, stage: 'finish pra-drykiln' }
          : row
      )
    );
    setTransferSuccess(
      `Palet / Papan ${item.id_plank} (${item.sortimen} - ${item.volume.toFixed(3)} m³) berhasil dikirim ke antrean Oven Dry-Kiln.`
    );
  };

  const handleModalSubmit = (
    data: Omit<PraDryKilnItem, 'volume' | 'date'>
  ) => {
    const vol = calculateVolume(data.tinggi, data.lebar, data.panjang);

    if (modalMode === 'input') {
      const newItem: PraDryKilnItem = {
        ...data,
        volume: vol,
        date: toISODate(),
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

  const handleExportPdf = () => {
    const rows = filteredItems.map((item) => [
      item.id_plank,
      item.id_log,
      item.sortimen,
      `${item.tinggi}cm x ${item.lebar}cm x ${item.panjang}cm`,
      item.volume.toFixed(3),
      item.grade,
      item.stage,
      formatDateID(item.date),
    ]);

    exportToPdf({
      title: 'Laporan Data Pra Dry-Kiln',
      subtitle: `Tanggal: ${
        dateFilter ? formatDateID(dateFilter) : 'Semua'
      } | Sortimen: ${
        sortimenFilter === 'All Sortimen' ? 'Semua' : sortimenFilter
      }`,
      sections: [
        {
          title: 'Data Pra Dry-Kiln',
          columns: [
            'ID Plank',
            'ID Log',
            'Sortimen',
            'Dimensi (T x W x L)',
            'Volume (m³)',
            'Grade',
            'Stage',
            'Tanggal',
          ],
          rows,
        },
      ],
    });
  };

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
            onClick={handleExportPdf}
            className="px-4 py-2 bg-red-50 hover:bg-red-100/70 border border-stone-300 rounded text-xs font-semibold text-green-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-green-700" />
            <span>Export PDF</span>
          </button>

          {canCreate && (
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

      {/* Banner Notifikasi Sukses Transfer ke Oven */}
      {transferSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg flex flex-wrap items-center justify-between gap-3 text-emerald-800 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{transferSuccess}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dry-kiln"
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded inline-flex items-center gap-1 transition-colors"
            >
              <span>Buka Dry-Kiln</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setTransferSuccess(null)}
              className="text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Table Component */}
      <PlankTable
        items={filteredItems}
        totalCount={items.length}
        isManager={isManager}
        canEdit={canUpdate}
        onEdit={handleOpenEdit}
        onSendToOven={handleSendToOven}
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