'use client';

import React, { useState } from 'react';
import {
  FileDown,
  Plus,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Inbox,
  Package,
} from 'lucide-react';
import {
  StockReportItem,
  StockReportFormData,
  StockStatus,
} from '@/types/stock-report';

export default function StockReportsPage() {
  // Role switcher ('admin' memiliki tombol Add Stock, 'manager' bersifat read-only)
  const [role] = useState<'admin' | 'manager'>('admin');
  const isManager = role === 'manager';
  const currentYear = new Date().getFullYear();

  // State data inventori (Zero Dummy Data)
  const [stocks, setStocks] = useState<StockReportItem[]>([]);

  // Filter States
  const [sortimenFilter, setSortimenFilter] = useState('All Sortimen');
  const [gradeFilter, setGradeFilter] = useState('All Grade');
  const [dateFilter, setDateFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<StockReportFormData>({
    id_log: '',
    sortimen: 'Sortimen A',
    grade: 'Grade A',
    thickness: 50,
    width: 200,
    length: 2400,
    status: 'Available',
  });

  // Hitung volume kubikasi: T(mm) * W(mm) * L(mm) / 1.000.000.000 (m³)
  const calculateVolume = (t: number, w: number, l: number): number => {
    if (!t || !w || !l) return 0;
    return Number(((t * w * l) / 1000000000).toFixed(3));
  };

  const handleOpenModal = () => {
    setFormData({
      id_log: `L-${currentYear}-3-A-${stocks.length + 1}`,
      sortimen: 'Sortimen A',
      grade: 'Grade A',
      thickness: 50,
      width: 200,
      length: 2400,
      status: 'Available',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.id_log ||
      formData.thickness === '' ||
      formData.width === '' ||
      formData.length === ''
    ) {
      return;
    }

    const t = Number(formData.thickness);
    const w = Number(formData.width);
    const l = Number(formData.length);
    const vol = calculateVolume(t, w, l);

    const newItem: StockReportItem = {
      id_log: formData.id_log,
      sortimen: formData.sortimen,
      grade: formData.grade,
      thickness: t,
      width: w,
      length: l,
      dimensions: `${t}mm x ${w}mm x ${l}mm`,
      volume: vol,
      status: formData.status,
      date: new Date().toLocaleDateString('id-ID'),
    };

    setStocks((prev) => [newItem, ...prev]);
    setIsModalOpen(false);
  };

  const filteredStocks = stocks.filter((item) => {
    const matchesSortimen =
      sortimenFilter === 'All Sortimen' || item.sortimen === sortimenFilter;
    const matchesGrade =
      gradeFilter === 'All Grade' || item.grade === gradeFilter;
    const matchesDate = !dateFilter || item.date === dateFilter;
    return matchesSortimen && matchesGrade && matchesDate;
  });

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

          {/* Filter Grade */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Grade
            </span>
            <div className="relative">
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
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
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700"
            />
          </div>
        </div>

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
                <th className="py-3 px-3 text-center">ID LOG</th>
                <th className="py-3 px-3 text-center">Sortimen</th>
                <th className="py-3 px-3 text-center">DIMENSIONS (T X W X L)</th>
                <th className="py-3 px-3 text-center">Total Volume</th>
                <th className="py-3 px-3 text-center">Status Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                      <Inbox className="w-8 h-8 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-stone-600">
                        Belum ada laporan stok kayu
                      </p>
                      <p className="text-xs text-stone-400">
                        {isManager
                          ? 'Belum ada data stok kayu yang diregistrasikan oleh tim logistik.'
                          : 'Klik tombol "+ Add Stock" untuk menambahkan inventaris kayu pertama.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStocks.map((item) => (
                  <tr
                    key={item.id_log}
                    className="text-green-700 hover:bg-stone-50 transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-mono font-medium">
                      {item.id_log}
                    </td>
                    <td className="py-3 px-3 text-center font-normal">
                      {item.sortimen}
                    </td>
                    <td className="py-3 px-3 text-center font-medium whitespace-nowrap">
                      {item.dimensions}
                    </td>
                    <td className="py-3 px-3 text-center font-medium">
                      {item.volume.toFixed(3)} m³
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-xs font-medium tracking-wide shadow-2xs ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="text-green-700/80 font-medium">
            Showing {filteredStocks.length} of {stocks.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded text-green-700 font-extrabold bg-green-100/80"
            >
              1
            </button>
            <button
              type="button"
              className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
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
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-900 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 bg-white/80 rounded-[10px] border border-stone-800 flex flex-col gap-3 text-xs"
            >
              {/* ID LOG */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">ID LOG</label>
                <input
                  type="text"
                  required
                  placeholder="L-2026-X-X-X"
                  value={formData.id_log}
                  onChange={(e) =>
                    setFormData({ ...formData, id_log: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-white border border-stone-800 rounded font-mono text-green-700 font-medium focus:outline-none focus:border-green-700"
                />
              </div>

              {/* Sortimen & Grade */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-green-700">Sortimen</label>
                  <div className="relative">
                    <select
                      value={formData.sortimen}
                      onChange={(e) =>
                        setFormData({ ...formData, sortimen: e.target.value })
                      }
                      className="w-full h-10 pl-3 pr-8 bg-white border border-stone-300 rounded text-green-700 appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
                    >
                      <option value="Sortimen A">Sortimen A</option>
                      <option value="Sortimen B">Sortimen B</option>
                      <option value="Sortimen C">Sortimen C</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-green-700">Grade</label>
                  <div className="relative">
                    <select
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                      className="w-full h-10 pl-3 pr-8 bg-white border border-stone-300 rounded text-green-700 font-medium appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
                    >
                      <option value="Grade A">Grade A</option>
                      <option value="Grade B">Grade B</option>
                      <option value="Grade C">Grade C</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Dimensions: Thickness, Width, Length in mm */}
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-green-700">Dimensions</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">
                      Thickness (T) mm
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="50"
                      value={formData.thickness}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          thickness:
                            e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full h-9 px-2.5 bg-white border border-stone-300 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">
                      Width (W) mm
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="200"
                      value={formData.width}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          width:
                            e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full h-9 px-2.5 bg-white border border-stone-300 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">
                      Length (L) mm
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="2400"
                      value={formData.length}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          length:
                            e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full h-9 px-2.5 bg-white border border-stone-300 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Stock Status</label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as StockStatus,
                      })
                    }
                    className="w-full h-10 pl-3 pr-8 bg-white border border-neutral-800 rounded text-green-700 font-semibold appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
                  >
                    <option value="Available">Available (Tersedia)</option>
                    <option value="Low Stock">Low Stock (Menipis)</option>
                    <option value="Out of Stock">Out of Stock (Habis)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

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