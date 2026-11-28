'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  FileDown,
  Plus,
  X,
  ChevronDown,
  Check,
  Inbox,
} from 'lucide-react';
import { toISODate, formatDateID } from '@/lib/dates';
import { exportToPdf } from '@/lib/export';
import useSessionUser from '@/lib/useSessionUser';
import { useGlobalSearch } from '@/lib/useGlobalSearch';
import { can } from '@/lib/permissions';
import { dryKilnApi, getApiErrorMessage } from '@/lib/api';
import { DEMO_DRY_KILN } from '@/lib/demo-data';
import Pagination from '@/components/Pagination';
import {
  StockReportItem,
  StockReportFormData,
  StockStatus,
} from '@/types/stock-report';
import { DryKilnItem } from '@/types/dry-kiln';
import { PlankGrade } from '@/types/dry-kiln';
import FormError from '@/components/FormError';
import {
  firstError,
  maxLength,
  positiveNumber,
  required,
} from '@/lib/validation';

const PAGE_SIZE = 10;

type EligiblePallet = {
  id: string;
  items: DryKilnItem[];
  thickness: string;
  length: string;
  width: string;
  grade: string;
};

function range(values: number[], unit = 'cm') {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `${min} ${unit}` : `${min}–${max} ${unit}`;
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return <label className="flex flex-col gap-1 text-[11px] font-medium text-stone-600">{label}<span className="h-10 px-3 flex items-center bg-stone-100 border border-stone-300 rounded font-mono text-stone-600">{value}</span></label>;
}

// Data stok fisik gudang dan olahan aktif (Sample Data)
const INITIAL_STOCKS: StockReportItem[] = [
  {
    id_palet: 'PAL-L-2026-004',
    id_log: 'L-2026-004',
    sortimen: 'A4',
    grade: 'Grade A',
    thickness: 50,
    width: 200,
    length: 2500,
    dimensions: '50 x 200 x 2500',
    volume: 0.025,
    availablePlanks: 15,
    totalPlanks: 20,
    status: 'Low Stock',
    date: '2026-11-04',
  },
  {
    id_palet: 'PAL-L-2026-005',
    id_log: 'L-2026-005',
    sortimen: 'A4',
    grade: 'Grade A',
    thickness: 50,
    width: 250,
    length: 3000,
    dimensions: '50 x 250 x 3000',
    volume: 0.038,
    status: 'Available',
    date: '2026-11-04',
  },
  {
    id_palet: 'PAL-L-2026-006',
    id_log: 'L-2026-006',
    sortimen: 'A3',
    grade: 'Grade B',
    thickness: 40,
    width: 180,
    length: 2200,
    dimensions: '40 x 180 x 2200',
    volume: 0.016,
    status: 'Low Stock',
    date: '2026-11-05',
  },
  {
    id_palet: 'PAL-L-2026-007',
    id_log: 'L-2026-007',
    sortimen: 'A3',
    grade: 'Grade B',
    thickness: 45,
    width: 200,
    length: 2600,
    dimensions: '45 x 200 x 2600',
    volume: 0.023,
    status: 'Available',
    date: '2026-11-05',
  },
  {
    id_palet: 'PAL-L-2026-008',
    id_log: 'L-2026-008',
    sortimen: 'A2',
    grade: 'Grade C',
    thickness: 30,
    width: 150,
    length: 2000,
    dimensions: '30 x 150 x 2000',
    volume: 0.009,
    status: 'Low Stock',
    date: '2026-11-06',
  },
  {
    id_palet: 'PAL-L-2026-009',
    id_log: 'L-2026-009',
    sortimen: 'A4',
    grade: 'Grade A',
    thickness: 60,
    width: 220,
    length: 2800,
    dimensions: '60 x 220 x 2800',
    volume: 0.037,
    status: 'Available',
    date: '2026-11-06',
  },
  {
    id_palet: 'PAL-L-2026-010',
    id_log: 'L-2026-010',
    sortimen: 'A4',
    grade: 'Grade A',
    thickness: 50,
    width: 250,
    length: 3200,
    dimensions: '50 x 250 x 3200',
    volume: 0.040,
    status: 'Available',
    date: '2026-11-06',
  },
  {
    id_palet: 'PAL-L-2026-011',
    id_log: 'L-2026-011',
    sortimen: 'A3',
    grade: 'Grade A',
    thickness: 40,
    width: 200,
    length: 2400,
    dimensions: '40 x 200 x 2400',
    volume: 0.019,
    status: 'Available',
    date: '2026-11-07',
  },
  {
    id_palet: 'PAL-L-2026-012',
    id_log: 'L-2026-012',
    sortimen: 'A2',
    grade: 'Grade C',
    thickness: 25,
    width: 120,
    length: 1900,
    dimensions: '25 x 120 x 1900',
    volume: 0.006,
    status: 'Out of Stock',
    date: '2026-11-07',
  },
  {
    id_palet: 'PAL-L-2026-013',
    id_log: 'L-2026-013',
    sortimen: 'A4',
    grade: 'Grade B',
    thickness: 50,
    width: 200,
    length: 2600,
    dimensions: '50 x 200 x 2600',
    volume: 0.026,
    status: 'Available',
    date: '2026-11-07',
  },
];

export default function StockReportsPage() {
  // Input stok dilakukan Admin Lapangan; role lain read-only.
  const user = useSessionUser();
  const globalSearch = useGlobalSearch();
  const isManager = user?.role === 'manager';
  const canCreate = can(user?.role, 'stock:create');
  const currentYear = new Date().getFullYear();

  // State data inventori (Zero Dummy Data)
  const [stocks, setStocks] = useState<StockReportItem[]>(INITIAL_STOCKS);
  const [finishedDryKiln, setFinishedDryKiln] = useState<DryKilnItem[]>([]);
  const [selectedPalletId, setSelectedPalletId] = useState('');
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    dryKilnApi.list({ stage: 'oven' })
      .then((items) => setFinishedDryKiln(items.filter((item) => item.stage === 'finish drykiln')))
      .catch(() => setFinishedDryKiln(DEMO_DRY_KILN.filter((item) => item.stage === 'finish drykiln')));
  }, []);

  const eligiblePallets = useMemo<EligiblePallet[]>(() => {
    const groups = new Map<string, DryKilnItem[]>();
    finishedDryKiln.forEach((item) => {
      const fallbackSequence = item.idOven ? String(item.idOven).padStart(3, '0') : '';
      const id = item.id_palet || (fallbackSequence
        ? `PAL-L-${new Date().getFullYear()}-${fallbackSequence}`
        : '');
      if (id) groups.set(id, [...(groups.get(id) ?? []), item]);
    });
    return Array.from(groups, ([id, items]) => ({
      id,
      items,
      thickness: range(items.map((item) => item.tinggi)),
      length: range(items.map((item) => item.panjang)),
      width: range(items.map((item) => item.lebar)),
      grade: items.every((item) => item.grade === items[0].grade) ? items[0].grade : 'Campuran',
    }));
  }, [finishedDryKiln]);

  // Filter States
  const [sortimenFilter, setSortimenFilter] = useState('All Sortimen');
  const [gradeFilter, setGradeFilter] = useState('All Grade');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<StockReportFormData>({
    id_log: '',
    sortimen: 'A4',
    grade: 'Grade A',
    thickness: 50,
    width: 200,
    length: 2400,
    status: 'Available',
    availablePlanks: 20,
    totalPlanks: 20,
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Hitung volume kubikasi: T(mm) * W(mm) * L(mm) / 1.000.000.000 (m³)
  const calculateVolume = (t: number, w: number, l: number): number => {
    if (!t || !w || !l) return 0;
    return Number(((t * w * l) / 1000000000).toFixed(3));
  };

  const getStockStatus = (available: number, total: number): StockStatus => {
    if (available <= 0) return 'Out of Stock';
    if (available < total) return 'Low Stock';
    return 'Available';
  };

  const getPlankCount = (item: StockReportItem) => {
    const total = item.totalPlanks ?? 20;
    const available = item.availablePlanks ?? (
      item.status === 'Out of Stock' ? 0 : item.status === 'Low Stock' ? 5 : total
    );
    return `${available}/${total}`;
  };

  const handleOpenModal = () => {
    if (!canCreate) return;
    setFormData({
      id_log: `L-${currentYear}-3-A-${stocks.length + 1}`,
      sortimen: 'A4',
      grade: 'Grade A',
      thickness: 50,
      width: 200,
      length: 2400,
      status: 'Available',
      availablePlanks: 20,
      totalPlanks: 20,
    });
    setSelectedPalletId('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;

    const selectedPallet = eligiblePallets.find((pallet) => pallet.id === selectedPalletId);
    const sourceItem = selectedPallet?.items[0];
    if (!selectedPallet || !sourceItem) {
      setFormError('Pilih ID palet yang sudah selesai Dry-Kiln.');
      return;
    }
    const idLog = sourceItem.id_log;
    const validationError = firstError(
      required(idLog, 'ID Log'),
      maxLength(idLog, 'ID Log', 50),
      stocks.some((item) => item.id_palet === selectedPallet.id)
        ? 'ID Palet tersebut sudah terdaftar di Stock Reports.'
        : null,
      stocks.some((item) => item.id_log.toLowerCase() === idLog.toLowerCase())
        ? 'ID Log sudah terdaftar. Gunakan ID lain.'
        : null
    );

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const t = Number(formData.thickness);
    const w = Number(formData.width);
    const l = Number(formData.length);
    const vol = calculateVolume(t, w, l);

    const newItem: StockReportItem = {
      id_log: idLog,
      id_palet: selectedPallet.id,
      sortimen: sourceItem.sortimen,
      grade: sourceItem.grade,
      thickness: t,
      width: w,
      length: l,
      dimensions: `${t}mm x ${w}mm x ${l}mm`,
      volume: vol,
      availablePlanks: selectedPallet.items.length,
      totalPlanks: selectedPallet.items.length,
      status: 'Available',
      date: toISODate(),
    };

    setStocks((prev) => [newItem, ...prev]);
    setPage(1);
    setFormError(null);
    setIsModalOpen(false);
  };

  const filteredStocks = stocks.filter((item) => {
    const matchesSortimen =
      sortimenFilter === 'All Sortimen' || item.sortimen === sortimenFilter;
    const matchesGrade =
      gradeFilter === 'All Grade' || item.grade === gradeFilter;
    const matchesDate = !dateFilter || item.date === dateFilter;
    const q = globalSearch.trim().toLowerCase();
    const matchesGlobal =
      !q ||
      item.id_log.toLowerCase().includes(q) ||
      item.sortimen.toLowerCase().includes(q) ||
      item.grade.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q);
    return matchesSortimen && matchesGrade && matchesDate && matchesGlobal;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStocks.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedStocks = filteredStocks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleExportPdf = () => {
    const rows = filteredStocks.map((item) => [
      item.id_log,
      String(item.thickness),
      String(item.length),
      String(item.width),
      item.grade,
      `${getPlankCount(item)} - ${item.status}`,
    ]);

    exportToPdf({
      title: 'Laporan Stok Kayu',
      subtitle: `Tanggal: ${
        dateFilter ? formatDateID(dateFilter) : 'Semua'
      } | Sortimen: ${
        sortimenFilter === 'All Sortimen' ? 'Semua' : sortimenFilter
      } | Grade: ${gradeFilter === 'All Grade' ? 'Semua' : gradeFilter}`,
      sections: [
        {
          title: 'Data Stok Kayu',
          columns: [
            'ID Log',
            'Ketebalan',
            'Panjang',
            'Lebar',
            'Grade',
            'Status Stock',
          ],
          rows,
        },
      ],
    });
  };

  // Styling badge status stok sesuai indikator warna SDD
  const getStatusBadge = (status: StockStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-green-700 text-white';
      case 'Low Stock':
        return 'bg-amber-600 text-white';
      case 'Out of Stock':
        return 'bg-red-700 text-white';
      default:
        return 'bg-stone-500 text-white';
    }
  };

  return (
    <div className="flex flex-col gap-5 p-6 max-w-[1440px] mx-auto font-sans">
      {/* 1. Filter & Action Toolbar */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter Sortimen / Wood Type */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Search wood type...
            </span>
            <div className="relative">
              <select
                value={sortimenFilter}
                onChange={(e) => {
                  setSortimenFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none pr-8 pl-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700 cursor-pointer"
              >
                <option value="All Sortimen">All Sortimen</option>
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="A2">A2</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Filter Grade */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Grade
            </span>
            <div className="relative">
              <select
                value={gradeFilter}
                onChange={(e) => {
                  setGradeFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none pr-8 pl-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700 cursor-pointer"
              >
                <option value="All Grade">All Grade</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Grade C">Grade C</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Filter Date */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Date:
            </span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700"
            />
          </div>
        </div>

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
              onClick={handleOpenModal}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stock</span>
            </button>
          )}
        </div>
      </section>

      {/* 2. Main Stock Table */}
      <section className="p-4 bg-white rounded-[10px] border border-stone-200 shadow-2xs flex flex-col gap-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 text-center">ID PALET</th>
                <th className="py-3 px-3 text-center">KETEBALAN</th>
                <th className="py-3 px-3 text-center">PANJANG</th>
                <th className="py-3 px-3 text-center">LEBAR</th>
                <th className="py-3 px-3 text-center">GRADE</th>
                <th className="py-3 px-3 text-center">STATUS STOCK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                      <Inbox className="w-8 h-8 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-stone-600">
                        Belum ada laporan stok kayu
                      </p>
                      <p className="text-xs text-stone-400">
                        {isManager
                          ? 'Belum ada data stok kayu yang diregistrasikan oleh tim logistik.'
                          : canCreate
                          ? 'Klik tombol "+ Add Stock" untuk menambahkan inventaris kayu pertama.'
                          : 'Belum ada laporan stok yang dapat ditampilkan.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStocks.map((item) => (
                  <tr
                    key={item.id_log}
                    className="text-green-700 hover:bg-stone-50 transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-mono font-medium">
                      {item.id_palet ?? '-'}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {item.thickness} mm
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {item.length} mm
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {item.width} mm
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 border border-green-700 rounded-xs text-[11px] font-semibold">
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-xs font-medium tracking-wide shadow-2xs ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {getPlankCount(item)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={currentPage}
          pageSize={PAGE_SIZE}
          totalItems={filteredStocks.length}
          totalCount={stocks.length}
          onPageChange={setPage}
        />
      </section>

      {/* 3. Modal: Add New Stock */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
          <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
              <h2 className="text-stone-800 text-xl font-bold font-sans">
                Add New Stock
              </h2>
              <button
                type="button"
                onClick={() => {
                  setFormError(null);
                  setIsModalOpen(false);
                }}
                className="p-1 text-stone-500 hover:text-stone-900 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              onInput={() => {
                if (formError) setFormError(null);
              }}
              className="p-4 bg-white/80 rounded-[10px] border border-stone-800 flex flex-col gap-3 text-xs"
            >
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">ID PALET</label>
                <select
                  required
                  value={selectedPalletId}
                  onChange={(e) => {
                    const pallet = eligiblePallets.find((item) => item.id === e.target.value);
                    const source = pallet?.items[0];
                    setSelectedPalletId(e.target.value);
                    if (pallet && source) {
                      setFormData({
                        ...formData,
                        id_log: source.id_log,
                        sortimen: source.sortimen,
                        grade: source.grade as PlankGrade,
                        thickness: source.tinggi * 10,
                        width: source.lebar * 10,
                        length: source.panjang * 10,
                      });
                    }
                  }}
                  className="w-full h-10 px-3 bg-white border border-stone-300 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
                >
                  <option value="">Pilih palet yang selesai Dry-Kiln</option>
                  {eligiblePallets.map((pallet) => (
                    <option key={pallet.id} value={pallet.id}>{pallet.id} ({pallet.items.length} plank)</option>
                  ))}
                </select>
                {eligiblePallets.length === 0 && <p className="text-[11px] text-amber-700">Belum ada palet dengan status selesai Dry-Kiln.</p>}
              </div>

              {selectedPalletId && (() => {
                const pallet = eligiblePallets.find((item) => item.id === selectedPalletId);
                if (!pallet) return null;
                return <div className="grid grid-cols-4 gap-2 text-[11px] text-stone-600"><ReadOnly label="Ketebalan" value={pallet.thickness} /><ReadOnly label="Panjang" value={pallet.length} /><ReadOnly label="Lebar" value={pallet.width} /><ReadOnly label="Grade" value={pallet.grade} /></div>;
              })()}

              {/* Jumlah plank berasal dari isi palet selesai Dry-Kiln */}
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-green-700">Jumlah Plank</span>
                <p className="text-[11px] text-stone-500">Jumlah plank dan status akan diambil dari palet yang dipilih. Saat ini: {selectedPalletId ? `${eligiblePallets.find((item) => item.id === selectedPalletId)?.items.length ?? 0}/${eligiblePallets.find((item) => item.id === selectedPalletId)?.items.length ?? 0}` : '-'}</p>
              </div>

              <FormError message={formError} />

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="h-10 px-5 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}