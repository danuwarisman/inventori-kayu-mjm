'use client';

import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  FileDown,
  Plus,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
  Factory,
  Flame,
  PackageCheck,
  Check,
} from 'lucide-react';

interface LogItem {
  id: string;
  sortimen: string;
  panjang: number; // cm
  diameter: number; // cm
  volume: number; // m3
  stage: string;
  date: string;
  suplier: string;
  harga: number;
}

const mockLogs: LogItem[] = Array.from({ length: 10 }).map((_, idx) => ({
  id: `L-2026-3-A-${idx + 1}`,
  sortimen: 'Sortimen A',
  panjang: 50,
  diameter: 200,
  volume: 12.45,
  stage: idx === 0 ? 'Log' : 'Sawmill',
  date: '22/05/2026',
  suplier: 'PT. Suplier',
  harga: 1000000,
}));

export default function DataLogPage({
  role = 'admin',
}: {
  role?: 'admin' | 'manager';
}) {
  // Filter States
  const [dateFilter, setDateFilter] = useState('');
  const [selectedSortimen, setSelectedSortimen] = useState('All Sortimen');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'input' | 'edit'>('input');
  const [activeLog, setActiveLog] = useState<Partial<LogItem>>({
    id: '',
    sortimen: 'Sortimen A',
    panjang: 100,
    diameter: 20,
    suplier: 'PT. Suplier',
  });

  const handleOpenCreate = () => {
    setModalMode('input');
    setActiveLog({
      id: '',
      sortimen: 'Sortimen A',
      panjang: 0,
      diameter: 0,
      suplier: 'PT. Suplier',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: LogItem) => {
    setModalMode('edit');
    setActiveLog(item);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-5 p-6 max-w-[1440px] mx-auto font-sans">
      {/* 1. Filter & Actions Header Bar */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Filter by Date:
            </span>
            <div className="relative flex items-center">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-green-700"
              />
            </div>
          </div>

          {/* Sortimen Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Log Sortimen
            </span>
            <div className="relative">
              <select
                value={selectedSortimen}
                onChange={(e) => setSelectedSortimen(e.target.value)}
                className="appearance-none pr-8 pl-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-green-700 cursor-pointer"
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

        {/* Export & Create Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="px-4 py-2 bg-red-50 hover:bg-red-100/70 border border-stone-300 rounded text-xs font-semibold text-green-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-green-700" />
            <span>Export PDF</span>
          </button>

          {role === 'admin' && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Batch</span>
            </button>
          )}
        </div>
      </section>

      {/* 2. Main Data Table */}
      <section className="p-4 bg-white rounded-[10px] border border-stone-200 shadow-xs flex flex-col gap-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 text-center">ID LOG</th>
                <th className="py-3 px-3 text-center">Sortimen</th>
                <th className="py-3 px-3 text-center">Dimensions (P x D)</th>
                <th className="py-3 px-3 text-center">Total Volume</th>
                <th className="py-3 px-3 text-center">Stage</th>
                <th className="py-3 px-3 text-center">Date</th>

                {/* Manager-only Columns */}
                {role === 'manager' && (
                  <>
                    <th className="py-3 px-3 text-center">Suplier</th>
                    <th className="py-3 px-3 text-center">Harga</th>
                  </>
                )}

                {/* Admin-only Column */}
                {role === 'admin' && (
                  <th className="py-3 px-3 text-center w-16">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {mockLogs.map((item, idx) => (
                <tr
                  key={idx}
                  className="text-green-700 hover:bg-stone-50/80 transition-colors"
                >
                  <td className="py-3 px-3 text-center font-mono font-medium">
                    {item.id}
                  </td>
                  <td className="py-3 px-3 text-center font-normal">{item.sortimen}</td>
                  <td className="py-3 px-3 text-center font-medium">
                    {item.panjang}mm x {item.diameter}mm
                  </td>
                  <td className="py-3 px-3 text-center font-medium">
                    {item.volume.toFixed(3)} m³
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.stage === 'Log'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-lime-100 text-green-800'
                      }`}
                    >
                      {item.stage}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-normal text-stone-600">
                    {item.date}
                  </td>

                  {/* Manager Data Cells */}
                  {role === 'manager' && (
                    <>
                      <td className="py-3 px-3 text-center font-medium text-stone-800">
                        {item.suplier}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-stone-900">
                        {item.harga.toLocaleString('id-ID')}
                      </td>
                    </>
                  )}

                  {/* Admin Action Cell */}
                  {role === 'admin' && (
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-green-700 hover:bg-green-100/60 rounded transition-colors inline-flex items-center justify-center"
                        title="Edit Log"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="text-green-700/80 font-medium">Showing 10 of 1024</span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50 transition-colors"
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
              className="w-7 h-7 rounded text-green-700/60 font-semibold hover:bg-stone-100"
            >
              2
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded text-green-700/50 font-semibold hover:bg-stone-100"
            >
              3
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded text-green-700/40 font-semibold hover:bg-stone-100"
            >
              4
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded text-green-700/40 font-semibold hover:bg-stone-100"
            >
              5
            </button>
            <button
              type="button"
              className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Bottom Operational Process Capacity Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { title: 'Sawmill', icon: Factory, ratio: '14/15', pct: 78 },
          { title: 'Pra Dry-Kiln', icon: Flame, ratio: '14/15', pct: 78 },
          { title: 'Dry-Kiln Process', icon: Flame, ratio: '14/15', pct: 78 },
          { title: 'Ready To Sale', icon: PackageCheck, ratio: '14/15', pct: 78 },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-3 bg-white rounded border border-stone-200 shadow-xs flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-green-700">
                  {stat.title}
                </span>
                <Icon className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-green-700">
                <span>{stat.ratio}</span>
                <span>{stat.pct}%</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full border border-green-700 overflow-hidden">
                <div
                  className="h-full bg-green-700 rounded-full"
                  style={{ width: `${stat.pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. Input & Edit Modal (Orange-50 Theme) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-1 border-b border-stone-300/60">
              <h2 className="text-stone-800 text-lg font-bold">
                {modalMode === 'input' ? 'Input Log' : 'Edit Log'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Box */}
            <form
              onSubmit={handleSave}
              className="p-3.5 bg-white/70 rounded-[10px] border border-stone-400/80 flex flex-col gap-3 text-xs"
            >
              {/* ID Log */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">ID LOG</label>
                <input
                  type="text"
                  required
                  placeholder="L-2026-X-X-X"
                  value={activeLog.id || ''}
                  onChange={(e) =>
                    setActiveLog({ ...activeLog, id: e.target.value })
                  }
                  className="w-full h-9 px-3 bg-white border border-stone-300 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
                />
              </div>

              {/* Sortimen */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Sortimen</label>
                <select
                  value={activeLog.sortimen || 'Sortimen A'}
                  onChange={(e) =>
                    setActiveLog({ ...activeLog, sortimen: e.target.value })
                  }
                  className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-green-700 font-medium focus:outline-none focus:border-green-700"
                >
                  <option value="Sortimen A">Sortimen A</option>
                  <option value="Sortimen B">Sortimen B</option>
                  <option value="Sortimen C">Sortimen C</option>
                </select>
              </div>

              {/* Ukuran (Panjang & Diameter) */}
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-green-700">Ukuran</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">Panjang (cm)</label>
                    <input
                      type="number"
                      required
                      placeholder="100"
                      value={activeLog.panjang || ''}
                      onChange={(e) =>
                        setActiveLog({
                          ...activeLog,
                          panjang: Number(e.target.value),
                        })
                      }
                      className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">Diameter (cm)</label>
                    <input
                      type="number"
                      required
                      placeholder="20"
                      value={activeLog.diameter || ''}
                      onChange={(e) =>
                        setActiveLog({
                          ...activeLog,
                          diameter: Number(e.target.value),
                        })
                      }
                      className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                </div>
              </div>

              {/* Suplier & Submit Button */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Suplier</label>
                <div className="flex items-center gap-3">
                  <select
                    value={activeLog.suplier || 'PT. Suplier'}
                    onChange={(e) =>
                      setActiveLog({ ...activeLog, suplier: e.target.value })
                    }
                    className="flex-1 h-9 px-3 bg-white border border-stone-300 rounded text-green-700 font-semibold focus:outline-none focus:border-green-700"
                  >
                    <option value="PT. Suplier">PT. Suplier</option>
                    <option value="CV. Rimba Mandiri">CV. Rimba Mandiri</option>
                    <option value="UD. Jati Makmur">UD. Jati Makmur</option>
                  </select>

                  <button
                    type="submit"
                    className="h-9 px-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    {modalMode === 'input' ? (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Batch</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Batch</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}